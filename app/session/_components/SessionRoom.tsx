"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createId } from "@/lib/dashboard-utils";
import { SCENARIO_META, type ScenarioId } from "@/lib/dashboard-data";
import {
  BASELINE_SCORES,
  DEFAULT_PANELISTS,
  DEFAULT_SCENARIO,
  DEFAULT_TOPIC,
  PANELIST_GESTURES,
  PANELIST_VOICE_PROFILES,
  estimateSpeechDurationMs,
  type PanelistGesture,
  type SessionPanelist,
  type SessionScores,
  type TranscriptMessage,
} from "@/lib/session-data";
import { useSessionSpeech } from "./hooks/useSessionSpeech";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { uploadTurnAudio } from "@/lib/turn-audio";
import {
  useSessionSocket,
  type PanelistQuestionPayload,
  type ScoreUpdatePayload,
  type SessionCompletePayload,
  type SessionStatePayload,
  type TurnGesture,
} from "./hooks/useSessionSocket";
import RoomScene from "./RoomScene";
import SessionTopBar from "./SessionTopBar";
import ScorePanel from "./ScorePanel";
import QuestionCounter from "./QuestionCounter";
import AnswerTimer from "./AnswerTimer";
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
  const { startRecording, stopRecording } = useAudioRecorder();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [scenario, setScenario] = useState<ScenarioId>(DEFAULT_SCENARIO);
  const [topic, setTopic] = useState(DEFAULT_TOPIC);
  const [panelists, setPanelists] = useState<SessionPanelist[]>(DEFAULT_PANELISTS);

  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [scores, setScores] = useState<SessionScores>(BASELINE_SCORES);
  const [questionCount, setQuestionCount] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null);
  const [activeGesture, setActiveGesture] = useState<PanelistGesture>(PANELIST_GESTURES[0]);
  const [activeQuestion, setActiveQuestion] = useState("");
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [serverThinking, setServerThinking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [serverNotice, setServerNotice] = useState<string | null>(null);

  const speechCleanupRef = useRef<(() => void) | null>(null);
  const answerStartedAtRef = useRef<number | null>(null);
  const gestureCounterRef = useRef(0);
  const turnSequenceRef = useRef(0);
  const lastTurnGesturesRef = useRef<TurnGesture[] | null>(null);
  const pendingAnswerTimerRef = useRef<number | null>(null);

  const panelistIndexById = useMemo(() => {
    const map = new Map<string, number>();
    panelists.forEach((panelist, index) => {
      if (panelist.id) map.set(panelist.id, index);
    });
    return map;
  }, [panelists]);

  useEffect(() => {
    const storedScenario = window.localStorage.getItem("ss_scenario");
    const storedTopic = window.localStorage.getItem("ss_topic");
    const storedSessionId = window.localStorage.getItem("ss_session_id");

    if (storedScenario && storedScenario in SCENARIO_META) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScenario(storedScenario as ScenarioId);
    }
    if (storedTopic) setTopic(storedTopic);
    setPanelists(loadPanelists());

    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      setFatalError("No active session found. Start a new one from the dashboard.");
    }
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

  useEffect(() => {
    if (!waitingForAnswer || paused || timeLeft === null || timeLeft <= 0) return;
    const timeout = window.setTimeout(() => setTimeLeft((value) => (value !== null ? value - 1 : value)), 1000);
    return () => window.clearTimeout(timeout);
  }, [waitingForAnswer, paused, timeLeft]);

  const finishSession = useCallback(() => {
    speechCleanupRef.current?.();
    cancelSpeech();
    stopListening();
    stopRecording();
    setActiveSpeaker(null);
    setWaitingForAnswer(false);
    setServerThinking(false);
    setEndModalOpen(false);
    setEnded(true);
  }, [cancelSpeech, stopListening, stopRecording]);

  const speakQuestion = useCallback(
    (text: string, panelistIndex: number, onDone: () => void, onStart: () => void) => {
      const profile = PANELIST_VOICE_PROFILES[panelistIndex % PANELIST_VOICE_PROFILES.length];
      speechCleanupRef.current?.();
      if (audioEnabled) {
        speechCleanupRef.current = speak(text, panelistIndex, profile, onDone, onStart);
      } else {
        onStart();
        const timeout = window.setTimeout(onDone, estimateSpeechDurationMs(text));
        speechCleanupRef.current = () => window.clearTimeout(timeout);
      }
    },
    [audioEnabled, speak],
  );

  const handleSessionState = useCallback(
    (payload: SessionStatePayload) => {
      setScores({ clarity: payload.clarity, confidence: payload.confidence, structure: payload.structure });
      setQuestionCount(payload.question_count);
      setActiveSpeaker(null);
      setServerThinking(false);
      setWaitingForAnswer(payload.awaiting_user_response);
      setTimeLeft(payload.awaiting_user_response ? payload.answer_timer_seconds : null);

      if (payload.awaiting_user_response) {
        answerStartedAtRef.current = Date.now();
        setActiveQuestion((prev) =>
          prev
            ? prev
            : payload.current_panelist_id === null
              ? `Introduce your response on "${topic}" to begin.`
              : "Continue your response to the panel's last question.",
        );
      }
    },
    [topic],
  );

  const handleScoreUpdate = useCallback((payload: ScoreUpdatePayload) => {
    setScores({ clarity: payload.clarity, confidence: payload.confidence, structure: payload.structure });
    setQuestionCount(payload.question_count);
  }, []);

  const handlePanelistQuestion = useCallback(
    (payload: PanelistQuestionPayload) => {
      const panelistIndex = panelistIndexById.get(payload.panelist_id) ?? 0;
      const speakerName = panelists[panelistIndex]?.name ?? "Panelist";

      gestureCounterRef.current += 1;
      const gesture = PANELIST_GESTURES[gestureCounterRef.current % PANELIST_GESTURES.length];
      lastTurnGesturesRef.current = [{ t_ms: 0, gesture }];
      pendingAnswerTimerRef.current = payload.answer_timer_seconds;
      setServerThinking(false);
      setWaitingForAnswer(false);

      const onStart = () => {
        setActiveSpeaker(panelistIndex);
        setActiveGesture(gesture);
        setActiveQuestion(payload.question_text);
      };

      const onDone = () => {
        setActiveSpeaker(null);
        setWaitingForAnswer(true);
        setTimeLeft(pendingAnswerTimerRef.current);
        answerStartedAtRef.current = Date.now();
        setTranscript((prev) => [
          ...prev,
          { id: createId("msg"), speaker: speakerName, text: payload.question_text, isUser: false },
        ]);
      };

      speakQuestion(payload.question_text, panelistIndex, onDone, onStart);
    },
    [panelistIndexById, panelists, speakQuestion],
  );

  const handleSessionComplete = useCallback(
    (payload: SessionCompletePayload) => {
      setScores({ clarity: payload.clarity, confidence: payload.confidence, structure: payload.structure });
      setQuestionCount(payload.question_count);
      finishSession();
    },
    [finishSession],
  );

  const handleServerError = useCallback((message: string) => {
    setServerThinking(false);
    setServerNotice(message);
    window.setTimeout(() => setServerNotice((prev) => (prev === message ? null : prev)), 5000);
  }, []);

  const handleLoggedOut = useCallback(() => {
    router.push("/login");
  }, [router]);

  const handleHardError = useCallback((reason: "forbidden" | "not_found") => {
    setFatalError(
      reason === "forbidden"
        ? "This session doesn't belong to your account."
        : "This session could not be found.",
    );
  }, []);

  const handleConnectionFailed = useCallback(() => {
    setFatalError("Couldn't connect to the session. Check your connection and try again.");
  }, []);

  const { sendUserResponse, close: closeSocket } = useSessionSocket(started ? sessionId : null, {
    onSessionState: handleSessionState,
    onScoreUpdate: handleScoreUpdate,
    onPanelistQuestion: handlePanelistQuestion,
    onSessionComplete: handleSessionComplete,
    onServerError: handleServerError,
    onLoggedOut: handleLoggedOut,
    onConnectionFailed: handleConnectionFailed,
    onHardError: handleHardError,
  });

  const handleAnswer = useCallback(
    async (text: string) => {
      const durationMs = answerStartedAtRef.current ? Date.now() - answerStartedAtRef.current : 0;
      answerStartedAtRef.current = null;

      setTranscript((prev) => [...prev, { id: createId("msg"), speaker: "You", text, isUser: true }]);
      setWaitingForAnswer(false);
      setTimeLeft(null);
      setServerThinking(true);

      const turnSequence = turnSequenceRef.current;
      turnSequenceRef.current += 1;
      const gestures = lastTurnGesturesRef.current;
      lastTurnGesturesRef.current = null;

      const recorded = await stopRecording();
      const storageKey =
        recorded && sessionId
          ? await uploadTurnAudio(sessionId, turnSequence, recorded.blob, recorded.mimeType)
          : null;

      const sent = sendUserResponse(text, durationMs, storageKey, gestures);
      if (!sent) {
        setServerThinking(false);
        setServerNotice("Connection lost — reconnecting. Please try again in a moment.");
      }
    },
    [sendUserResponse, sessionId, stopRecording],
  );

  const handleStart = useCallback(() => {
    setStarted(true);
    if (ttsSupported) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    }
  }, [ttsSupported]);

  const handleToggleMic = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }
    startRecording();
    startListening((text) => handleAnswer(text));
  }, [isListening, startListening, stopListening, startRecording, handleAnswer]);

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

  const handleConfirmEnd = useCallback(async () => {
    setEndModalOpen(false);
    speechCleanupRef.current?.();
    cancelSpeech();
    stopListening();
    stopRecording();
    closeSocket();
    setActiveSpeaker(null);
    setWaitingForAnswer(false);
    setServerThinking(false);

    if (sessionId) {
      try {
        const res = await fetch(`/api/v1/sessions/${sessionId}/end`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: "completed" }),
        });
        const data = await res.json();
        if (data?.success && data.data) {
          setScores({
            clarity: data.data.clarity ?? BASELINE_SCORES.clarity,
            confidence: data.data.confidence ?? BASELINE_SCORES.confidence,
            structure: data.data.structure ?? BASELINE_SCORES.structure,
          });
          setQuestionCount(data.data.question_count ?? questionCount);
        }
      } catch {
        /* show the results screen with whatever scores we already have */
      }
    }

    setEnded(true);
  }, [sessionId, cancelSpeech, stopListening, stopRecording, closeSocket, questionCount]);

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
  } else if (serverThinking) {
    status = "Panel is reviewing your answer…";
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

      <ScorePanel scores={scores} started={questionCount > 0} />
      <QuestionCounter count={questionCount} />
      {timeLeft !== null && <AnswerTimer secondsLeft={timeLeft} />}

      {serverNotice && (
        <div className="pointer-events-none absolute top-4 left-1/2 z-120 -translate-x-1/2 border-2 border-ink bg-sienna px-4 py-2 font-grotesk text-xs font-bold text-white shadow-[3px_3px_0_#1A1109]">
          {serverNotice}
        </div>
      )}

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
        onConfirm={handleConfirmEnd}
      />

      {!started && !fatalError && (
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

      {fatalError && (
        <div className="pointer-events-auto absolute inset-0 z-130 flex items-center justify-center bg-ink/85 p-4 text-center">
          <div className="w-full max-w-md border-3 border-ink bg-cream px-8 py-10 shadow-[8px_8px_0_#1A1109]">
            <span className="mb-4 inline-block border border-ink bg-sienna px-3 py-1 font-grotesk text-2xs font-bold tracking-[0.08em] text-white uppercase">
              Session error
            </span>
            <h1 className="mb-6 font-grotesk text-xl font-bold text-ink sm:text-2xl">{fatalError}</h1>
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
