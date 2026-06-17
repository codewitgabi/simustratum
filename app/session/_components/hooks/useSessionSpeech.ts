"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { estimateSpeechDurationMs } from "@/lib/session-data";

export type VoiceProfile = {
  pitch?: number;
  rate?: number;
  voicePreference?: "male" | "female";
};

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

function pickVoice(
  voices: SpeechSynthesisVoice[],
  index: number,
  preference?: "male" | "female",
): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined;

  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = english.length > 0 ? english : voices;

  if (preference) {
    const match = pool.find((v) => v.name.toLowerCase().includes(preference));
    if (match) return match;
  }

  return pool[index % pool.length] ?? pool[0];
}

/** Bridges the panelist room to the Web Speech API: lets panelists speak
 * their questions aloud (speech synthesis) and lets the user respond by
 * voice (speech recognition), with graceful fallbacks when either is
 * unavailable. */
const noopSubscribe = () => () => {};
const getTtsSnapshot = () => "speechSynthesis" in window;
const getSttSnapshot = () => Boolean(getSpeechRecognitionCtor());
const getFalse = () => false;

export function useSessionSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const ttsSupported = useSyncExternalStore(noopSubscribe, getTtsSnapshot, getFalse);
  const sttSupported = useSyncExternalStore(noopSubscribe, getSttSnapshot, getFalse);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");
  const onFinalResultRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    if (!ttsSupported) return;

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [ttsSupported]);

  useEffect(() => {
    return () => {
      if (ttsSupported) window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
    };
  }, [ttsSupported]);

  const speak = useCallback(
    (
      text: string,
      panelistIndex: number,
      profile: VoiceProfile,
      onEnd: () => void,
    ) => {
      if (!ttsSupported) {
        const timeout = window.setTimeout(
          onEnd,
          estimateSpeechDurationMs(text),
        );
        return () => window.clearTimeout(timeout);
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = profile.pitch ?? 1;
      utterance.rate = profile.rate ?? 1;

      const voice = pickVoice(voices, panelistIndex, profile.voicePreference);
      if (voice) utterance.voice = voice;

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        window.clearTimeout(safety);
        onEnd();
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // Safety net in case the synthesis engine never fires onend.
      const safety = window.setTimeout(
        finish,
        estimateSpeechDurationMs(text) + 4000,
      );

      window.speechSynthesis.speak(utterance);

      return () => {
        window.clearTimeout(safety);
        window.speechSynthesis.cancel();
      };
    },
    [voices, ttsSupported],
  );

  const cancelSpeech = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
  }, [ttsSupported]);

  const pauseSpeech = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.pause();
  }, [ttsSupported]);

  const resumeSpeech = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.resume();
  }, [ttsSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const startListening = useCallback((onFinalResult: (text: string) => void) => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return false;

    recognitionRef.current?.stop();

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    // Keep listening through natural pauses between sentences — the user
    // decides when they're done by tapping the mic again (stopListening),
    // not the recognizer's own silence detection.
    recognition.continuous = true;

    finalTranscriptRef.current = "";
    onFinalResultRef.current = onFinalResult;

    recognition.onresult = (event) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current = `${finalTranscriptRef.current} ${result[0].transcript}`.trim();
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);
    };

    // onend always fires after the session ends, whether it stopped
    // naturally, was aborted, or errored — so flushing here (rather than
    // per-result) is what makes the full answer survive mid-speech pauses.
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
      const text = finalTranscriptRef.current.trim();
      finalTranscriptRef.current = "";
      if (text) onFinalResultRef.current?.(text);
    };
    recognition.onerror = () => {
      /* onend follows and handles cleanup/flushing */
    };

    recognitionRef.current = recognition;
    setInterimTranscript("");
    setIsListening(true);
    recognition.start();
    return true;
  }, []);

  return {
    ttsSupported,
    sttSupported,
    speak,
    cancelSpeech,
    pauseSpeech,
    resumeSpeech,
    isListening,
    interimTranscript,
    startListening,
    stopListening,
  };
}
