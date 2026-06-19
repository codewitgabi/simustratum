"use client";

import { useCallback, useEffect, useRef } from "react";

const MIME_CANDIDATES = ["audio/webm", "audio/mp4", "audio/ogg"];

export type RecordedAudio = { blob: Blob; mimeType: string };

function pickMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
}

/** Records the student's mic audio alongside speech recognition, using
 * whichever MIME type from the backend's allowlist the browser actually
 * supports. Recording failures (no mic permission, unsupported browser)
 * resolve to null rather than throwing — audio is optional, the turn still
 * saves with just the transcript. */
export function useAudioRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string | null>(null);

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return false;

    const mimeType = pickMimeType();
    if (!mimeType) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      streamRef.current = stream;
      recorderRef.current = recorder;
      mimeTypeRef.current = mimeType;
      recorder.start();
      return true;
    } catch {
      return false;
    }
  }, []);

  const stopRecording = useCallback((): Promise<RecordedAudio | null> => {
    const recorder = recorderRef.current;
    const stream = streamRef.current;

    if (!recorder || recorder.state === "inactive") {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const mimeType = mimeTypeRef.current ?? "audio/webm";
        const blob = chunksRef.current.length > 0 ? new Blob(chunksRef.current, { type: mimeType }) : null;
        chunksRef.current = [];
        stream?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        recorderRef.current = null;
        resolve(blob ? { blob, mimeType } : null);
      };
      recorder.stop();
    });
  }, []);

  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { startRecording, stopRecording };
}
