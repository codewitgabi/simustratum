"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SCENARIO_META, SCENARIO_FROM_API_VALUE, type ScenarioId } from "@/lib/dashboard-data";
import {
  PANELIST_GESTURES,
  PANELIST_VOICE_PROFILES,
  type PanelistGesture,
  type SessionPanelist,
} from "@/lib/session-data";
import { useSessionSpeech } from "@/app/session/_components/hooks/useSessionSpeech";
import RoomScene from "@/app/session/_components/RoomScene";
import ScorePanel from "@/app/session/_components/ScorePanel";

type ReplayTurn = {
  sequence: number;
  speaker_type: "panelist" | "user";
  panelist_id: string | null;
  text: string;
  audio_url: string | null;
  started_at_ms: number;
  ended_at_ms: number;
  gesture_sequence: { t_ms: number; gesture: string }[] | null;
};

type ReplayData = {
  session_id: string;
  scenario: string;
  topic: string;
  panelists: { id: string; name: string; role: string; strictness: number; inquisitiveness: number }[];
  final_clarity: number;
  final_confidence: number;
  final_structure: number;
  turns: ReplayTurn[];
};

type ReplayRoomProps = { sessionId: string };

function ReplayRoom({ sessionId }: ReplayRoomProps) {
  const router = useRouter();
  const { ttsSupported, speak, cancelSpeech } = useSessionSpeech();

  const [data, setData] = useState<ReplayData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [turnIndex, setTurnIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<number | null>(null);
  const [activeGesture, setActiveGesture] = useState<PanelistGesture>(PANELIST_GESTURES[0]);
  const [activeQuestion, setActiveQuestion] = useState("");
  const [captionSpeaker, setCaptionSpeaker] = useState("");
  const [captionText, setCaptionText] = useState("");

  const playingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechCleanupRef = useRef<(() => void) | null>(null);
  const advanceTimeoutRef = useRef<number | null>(null);
  const playTurnAtRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/v1/sessions/${sessionId}/replay`);
        const json = await res.json();
        if (cancelled) return;

        if (json.logged_out) {
          router.push("/login");
          return;
        }

        if (!res.ok || !json.success) {
          setLoadError(
            res.status === 404
              ? "This session could not be found."
              : res.status === 403
                ? "This session doesn't belong to your account."
                : res.status === 409
                  ? "This session is still in progress — open it from the dashboard to continue live."
                  : json.message ?? "Couldn't load this session's replay.",
          );
        } else {
          setData(json.data as ReplayData);
        }
      } catch {
        if (!cancelled) setLoadError("Couldn't reach the server. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  const stopPlayback = useCallback(() => {
    playingRef.current = false;
    cancelSpeech();
    speechCleanupRef.current?.();
    speechCleanupRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    if (advanceTimeoutRef.current != null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, [cancelSpeech]);

  useEffect(() => stopPlayback, [stopPlayback]);

  const panelists: SessionPanelist[] = useMemo(
    () =>
      (data?.panelists ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        strict: p.strictness,
        inquisitive: p.inquisitiveness,
      })),
    [data],
  );

  const panelistIndexById = useMemo(() => {
    const map = new Map<string, number>();
    panelists.forEach((p, i) => {
      if (p.id) map.set(p.id, i);
    });
    return map;
  }, [panelists]);

  const playTurnAt = useCallback(
    (index: number) => {
      if (!data) return;
      const turn = data.turns[index];

      if (!turn) {
        playingRef.current = false;
        setPlaying(false);
        setFinished(true);
        setActiveSpeaker(null);
        setCaptionText("");
        return;
      }

      setTurnIndex(index);
      const onDone = () => {
        if (playingRef.current) playTurnAtRef.current(index + 1);
      };

      if (turn.speaker_type === "panelist") {
        const panelistIndex = panelistIndexById.get(turn.panelist_id ?? "") ?? 0;
        const gesture =
          (turn.gesture_sequence?.[0]?.gesture as PanelistGesture | undefined) ?? PANELIST_GESTURES[0];

        setCaptionSpeaker("");
        setCaptionText("");

        const onStart = () => {
          setActiveSpeaker(panelistIndex);
          setActiveGesture(gesture);
          setActiveQuestion(turn.text);
        };

        if (ttsSupported) {
          const profile = PANELIST_VOICE_PROFILES[panelistIndex % PANELIST_VOICE_PROFILES.length];
          speechCleanupRef.current = speak(turn.text, panelistIndex, profile, onDone, onStart);
        } else {
          onStart();
          const fallbackMs = Math.max(turn.ended_at_ms - turn.started_at_ms, 1200);
          advanceTimeoutRef.current = window.setTimeout(onDone, fallbackMs);
        }
        return;
      }

      setActiveSpeaker(null);
      setCaptionSpeaker("You");
      setCaptionText(turn.text);

      if (turn.audio_url) {
        const audio = new Audio(turn.audio_url);
        audioRef.current = audio;
        audio.onended = onDone;
        audio.onerror = () => { setAudioFailed(true); onDone(); };
        audio.play().catch(() => { setAudioFailed(true); onDone(); });
        return;
      }

      const fallbackMs = Math.max(turn.ended_at_ms - turn.started_at_ms, 1500);
      advanceTimeoutRef.current = window.setTimeout(onDone, fallbackMs);
    },
    [data, panelistIndexById, speak, ttsSupported],
  );

  useEffect(() => {
    playTurnAtRef.current = playTurnAt;
  }, [playTurnAt]);

  const handlePlay = useCallback(() => {
    if (!data || data.turns.length === 0) return;
    setFinished(false);
    playingRef.current = true;
    setPlaying(true);
    playTurnAt(turnIndex < 0 || turnIndex >= data.turns.length ? 0 : turnIndex);
  }, [data, playTurnAt, turnIndex]);

  const handlePause = useCallback(() => {
    setPlaying(false);
    stopPlayback();
  }, [stopPlayback]);

  const handleRestart = useCallback(() => {
    stopPlayback();
    setTurnIndex(-1);
    setActiveSpeaker(null);
    setCaptionText("");
    setFinished(false);
    setAudioFailed(false);
    playingRef.current = true;
    setPlaying(true);
    playTurnAt(0);
  }, [stopPlayback, playTurnAt]);

  const scenarioId: ScenarioId | undefined = data ? SCENARIO_FROM_API_VALUE[data.scenario] : undefined;
  const scores = data
    ? { clarity: data.final_clarity, confidence: data.final_confidence, structure: data.final_structure }
    : { clarity: 0, confidence: 0, structure: 0 };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-ink">
        <svg className="animate-spin text-camel" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
          <circle cx="14" cy="14" r="11" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
          <path d="M14 3a11 11 0 0 1 11 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="font-inter text-sm text-white/50">Loading replay…</p>
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-ink p-4 text-center font-inter">
        <div className="w-full max-w-md border-3 border-ink bg-cream px-8 py-10 shadow-[8px_8px_0_#1A1109]">
          <span className="mb-4 inline-block border border-ink bg-sienna px-3 py-1 font-grotesk text-2xs font-bold tracking-[0.08em] text-white uppercase">
            Replay unavailable
          </span>
          <h1 className="mb-6 font-grotesk text-xl font-bold text-ink">
            {loadError ?? "Something went wrong."}
          </h1>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="neu-press w-full border-2 border-ink bg-sienna px-6 py-4 font-grotesk text-sm font-bold tracking-wider text-white uppercase shadow-[5px_5px_0_#1A1109]"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="session-scene">
      <RoomScene
        panelists={panelists}
        activeSpeaker={activeSpeaker}
        activeGesture={activeGesture}
        activeQuestion={activeQuestion}
      />

      <div className="pointer-events-auto absolute inset-x-0 top-0 z-70 flex h-14 items-center justify-between gap-3 border-b-2 border-camel/30 bg-ink px-3 sm:px-5">
        <div className="flex items-center gap-2 font-grotesk text-sm font-bold text-white">
          <div className="flex h-6 w-6 items-center justify-center border-2 border-camel bg-sienna text-xs">
            S
          </div>
          <span className="hidden sm:inline">Replay</span>
        </div>

        <div className="flex flex-1 items-center justify-center gap-2 overflow-hidden">
          {scenarioId && (
            <span className="border border-camel bg-sienna px-2.5 py-1 font-grotesk text-2xs font-bold tracking-[0.06em] text-white uppercase">
              {SCENARIO_META[scenarioId].label}
            </span>
          )}
          <span className="hidden truncate border border-camel/35 px-2.5 py-1 font-grotesk text-2xs font-bold tracking-[0.06em] text-white/70 uppercase sm:inline">
            {data.topic}
          </span>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 border border-white/20 px-3 py-1.5 font-grotesk text-2xs font-bold text-white/50 transition hover:border-camel hover:bg-camel/20 hover:text-white"
        >
          Exit replay
        </button>
      </div>

      <ScorePanel scores={scores} started />

      {captionText && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 z-70 w-[90%] max-w-xl -translate-x-1/2 border-2 border-camel bg-ink/90 px-4 py-3 text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <p className="font-grotesk text-2xs font-bold tracking-[0.08em] text-camel uppercase">
              {captionSpeaker}
            </p>
            {audioFailed && (
              <span className="font-grotesk text-2xs font-bold tracking-[0.06em] text-white/30 uppercase">
                · audio unavailable
              </span>
            )}
          </div>
          <p className="font-inter text-sm text-white">{captionText}</p>
        </div>
      )}

      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-70 flex items-center justify-center gap-3 bg-linear-to-t from-ink/95 to-transparent px-4 py-5">
        {!playing ? (
          <button
            type="button"
            onClick={handlePlay}
            className="neu-press border-2 border-ink bg-sienna px-6 py-3 font-grotesk text-sm font-bold tracking-wider text-white uppercase shadow-[4px_4px_0_#1A1109]"
          >
            {finished ? "Watch again" : turnIndex < 0 ? "Play replay" : "Resume"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePause}
            className="neu-press border-2 border-ink bg-white px-6 py-3 font-grotesk text-sm font-bold tracking-wider text-ink uppercase shadow-[4px_4px_0_#1A1109]"
          >
            Pause
          </button>
        )}
        <button
          type="button"
          onClick={handleRestart}
          className="border-2 border-white/20 px-4 py-3 font-grotesk text-xs font-bold tracking-wider text-white/60 uppercase transition hover:text-white"
        >
          Restart
        </button>
      </div>

      {finished && (
        <div className="pointer-events-auto absolute inset-0 z-130 flex items-center justify-center bg-ink/85 p-4 text-center">
          <div className="w-full max-w-md border-3 border-ink bg-cream px-8 py-10 shadow-[8px_8px_0_#1A1109]">
            <span className="mb-4 inline-block border border-ink bg-green px-3 py-1 font-grotesk text-2xs font-bold tracking-[0.08em] text-white uppercase">
              Replay finished
            </span>
            <h1 className="mb-6 font-grotesk text-xl font-bold text-ink">
              That&apos;s how the session went
            </h1>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="neu-press w-full border-2 border-ink bg-white px-6 py-3 font-grotesk text-sm font-bold tracking-wider text-ink uppercase shadow-[4px_4px_0_#1A1109]"
              >
                Watch again
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="neu-press w-full border-2 border-ink bg-sienna px-6 py-4 font-grotesk text-sm font-bold tracking-wider text-white uppercase shadow-[5px_5px_0_#1A1109]"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReplayRoom;
