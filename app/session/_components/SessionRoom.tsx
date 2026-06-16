"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createId } from "@/lib/dashboard-utils";
import { SCENARIO_META, type ScenarioId } from "@/lib/dashboard-data";
import {
  DEFAULT_PANELISTS,
  DEFAULT_SCENARIO,
  DEFAULT_TOPIC,
  DEMO_QUESTIONS,
  PANELIST_GESTURES,
  PANELIST_VOICE_PROFILES,
  computeScores,
  estimateSpeechDurationMs,
  type PanelistGesture,
  type SessionPanelist,
  type TranscriptMessage,
} from "@/lib/session-data";
import { useSessionSpeech } from "./hooks/useSessionSpeech";
import RoomScene from "./RoomScene";
import SessionTopBar from "./SessionTopBar";
import ScorePanel from "./ScorePanel";
import QuestionCounter from "./QuestionCounter";
import BottomControls from "./BottomControls";
import TranscriptPanel from "./TranscriptPanel";
import EndSessionModal from "./EndSessionModal";
import StartOverlay from "./StartOverlay";

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function loadPanelists(): SessionPanelist[] {
  try {
    const raw = window.localStorage.getItem("ss_panelists");
    if (!raw) return DEFAULT_PANELISTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PANELISTS;
  } catch {
    return DEFAULT_PANELISTS;
  }
}

function SessionRoom() {
  const router = useRouter();
  const {
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
  } = useSessionSpeech();

  const [scenario, setScenario] = useState<ScenarioId>(DEFAULT_SCENARIO);
  const [topic, setTopic] = useState(DEFAULT_TOPIC);
  const [panelists, setPanelists] = useState<SessionPanelist[]>(DEFAULT_PANELISTS);

  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null);
  const [activeGesture, setActiveGesture] = useState<PanelistGesture>(PANELIST_GESTURES[0]);
  const [activeQuestion, setActiveQuestion] = useState("");
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [elapsed, setElapsed] = useState(0);

  const speechCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const storedScenario = window.localStorage.getItem("ss_scenario");
    const storedTopic = window.localStorage.getItem("ss_topic");

    if (storedScenario && storedScenario in SCENARIO_META) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScenario(storedScenario as ScenarioId);
    }
    if (storedTopic) setTopic(storedTopic);
    setPanelists(loadPanelists());
  }, []);

  useEffect(() => {
    if (!started || paused || ended) return;
    const interval = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [started, paused, ended]);

  useEffect(() => {
    return () => {
      speechCleanupRef.current?.();
    };
  }, []);

  const scores = computeScores(answeredCount);

  const askQuestion = useCallback(
    (index: number) => {
      const question = DEMO_QUESTIONS[index % DEMO_QUESTIONS.length];
      const panelistIndex = question.panelistIndex % panelists.length;
      const profile = PANELIST_VOICE_PROFILES[panelistIndex % PANELIST_VOICE_PROFILES.length];
      const speaker = panelists[panelistIndex];

      setActiveSpeaker(panelistIndex);
      setActiveGesture(PANELIST_GESTURES[index % PANELIST_GESTURES.length]);
      setActiveQuestion(question.text);
      setWaitingForAnswer(false);

      const onSpeechEnd = () => {
        setActiveSpeaker(null);
        setWaitingForAnswer(true);
        setTranscript((prev) => [
          ...prev,
          { id: createId("msg"), speaker: speaker?.name ?? "Panelist", text: question.text, isUser: false },
        ]);
      };

      speechCleanupRef.current?.();
      if (audioEnabled) {
        speechCleanupRef.current = speak(question.text, panelistIndex, profile, onSpeechEnd);
      } else {
        const timeout = window.setTimeout(onSpeechEnd, estimateSpeechDurationMs(question.text));
        speechCleanupRef.current = () => window.clearTimeout(timeout);
      }
    },
    [panelists, audioEnabled, speak],
  );

  const completeSession = useCallback(() => {
    speechCleanupRef.current?.();
    cancelSpeech();
    stopListening();
    setActiveSpeaker(null);
    setWaitingForAnswer(false);
    setEndModalOpen(false);
    setEnded(true);
  }, [cancelSpeech, stopListening]);

  const handleAnswer = useCallback(
    (text: string) => {
      setTranscript((prev) => [...prev, { id: createId("msg"), speaker: "You", text, isUser: true }]);
      setAnsweredCount((count) => count + 1);
      setWaitingForAnswer(false);

      const nextIndex = questionIndex + 1;
      if (nextIndex >= DEMO_QUESTIONS.length) {
        window.setTimeout(completeSession, 800);
        return;
      }

      setQuestionIndex(nextIndex);
      window.setTimeout(() => askQuestion(nextIndex), 1000);
    },
    [questionIndex, askQuestion, completeSession],
  );

  const handleStart = useCallback(() => {
    setStarted(true);
    if (ttsSupported) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    }
    askQuestion(0);
  }, [askQuestion, ttsSupported]);

  const handleToggleMic = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening((text) => handleAnswer(text));
  }, [isListening, startListening, stopListening, handleAnswer]);

  const handleTogglePause = useCallback(() => {
    setPaused((prev) => {
      const next = !prev;
      if (next) {
        pauseSpeech();
        if (isListening) stopListening();
      } else {
        resumeSpeech();
      }
      return next;
    });
  }, [pauseSpeech, resumeSpeech, isListening, stopListening]);

  const handleToggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const next = !prev;
      if (!next) cancelSpeech();
      return next;
    });
  }, [cancelSpeech]);

  const canRespond = started && !ended && !paused && waitingForAnswer && !isListening;
  const micDisabled = !started || ended || paused || (!waitingForAnswer && !isListening);
  const waveActive = isListening || activeSpeaker !== null;

  let status = "Waiting to begin…";
  let statusVariant: "idle" | "user" | "panelist" = "idle";

  if (ended) {
    status = "Session complete";
  } else if (paused) {
    status = "Paused";
  } else if (isListening) {
    status = interimTranscript || "Listening…";
    statusVariant = "user";
  } else if (activeSpeaker !== null) {
    status = `${panelists[activeSpeaker]?.name ?? "Panelist"} is speaking…`;
    statusVariant = "panelist";
  } else if (waitingForAnswer) {
    status = "Your turn — respond when ready";
  }

  return (
    <div className="session-scene">
      <RoomScene
        panelists={panelists}
        activeSpeaker={activeSpeaker}
        activeGesture={activeGesture}
        activeQuestion={activeQuestion}
      />

      <SessionTopBar
        scenarioLabel={SCENARIO_META[scenario].label}
        topicLabel={topic}
        elapsed={formatElapsed(elapsed)}
        onEndSession={() => setEndModalOpen(true)}
      />

      <ScorePanel scores={scores} started={answeredCount > 0} />
      <QuestionCounter count={answeredCount} />

      <BottomControls
        status={status}
        statusVariant={statusVariant}
        waveActive={waveActive}
        micSupported={sttSupported}
        micDisabled={micDisabled}
        isListening={isListening}
        onToggleMic={handleToggleMic}
        onToggleTranscript={() => setTranscriptOpen((open) => !open)}
        paused={paused}
        onTogglePause={handleTogglePause}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        canRespond={canRespond}
        onSubmitText={handleAnswer}
      />

      <TranscriptPanel
        open={transcriptOpen}
        messages={transcript}
        onClose={() => setTranscriptOpen(false)}
      />

      <EndSessionModal
        open={endModalOpen}
        onCancel={() => setEndModalOpen(false)}
        onConfirm={completeSession}
      />

      {!started && (
        <StartOverlay
          scenarioLabel={SCENARIO_META[scenario].label}
          topicLabel={topic}
          panelistCount={panelists.length}
          micSupported={sttSupported}
          onStart={handleStart}
        />
      )}

      {ended && (
        <div className="pointer-events-auto absolute inset-0 z-130 flex items-center justify-center bg-ink/85 p-4 text-center">
          <div className="w-full max-w-md border-3 border-ink bg-cream px-8 py-10 shadow-[8px_8px_0_#1A1109]">
            <span className="mb-4 inline-block border border-ink bg-green px-3 py-1 font-grotesk text-2xs font-bold tracking-[0.08em] text-white uppercase">
              Session complete
            </span>
            <h1 className="mb-6 font-grotesk text-xl font-bold text-ink sm:text-2xl">
              Great work — here&apos;s how you did
            </h1>
            <div className="mb-8 flex flex-col gap-3">
              <div className="flex items-center justify-between border-2 border-ink bg-pale px-4 py-3">
                <span className="font-grotesk text-[0.72rem] font-bold tracking-[0.06em] text-ink uppercase">
                  Clarity
                </span>
                <span className="font-grotesk text-lg font-bold text-sienna">{scores.clarity}%</span>
              </div>
              <div className="flex items-center justify-between border-2 border-ink bg-pale px-4 py-3">
                <span className="font-grotesk text-[0.72rem] font-bold tracking-[0.06em] text-ink uppercase">
                  Confidence
                </span>
                <span className="font-grotesk text-lg font-bold text-sienna">{scores.confidence}%</span>
              </div>
              <div className="flex items-center justify-between border-2 border-ink bg-pale px-4 py-3">
                <span className="font-grotesk text-[0.72rem] font-bold tracking-[0.06em] text-ink uppercase">
                  Structure
                </span>
                <span className="font-grotesk text-lg font-bold text-sienna">{scores.structure}%</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="neu-press w-full border-2 border-ink bg-sienna px-6 py-4 font-grotesk text-sm font-bold tracking-wider text-white uppercase shadow-[5px_5px_0_#1A1109]"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionRoom;
