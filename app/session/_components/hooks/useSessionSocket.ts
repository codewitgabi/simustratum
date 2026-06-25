"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SessionStatus = "pending" | "in_progress" | "completed" | "abandoned";

export type SessionStatePayload = {
  status: SessionStatus;
  question_count: number;
  clarity: number;
  confidence: number;
  structure: number;
  current_panelist_id: string | null;
  awaiting_user_response: boolean;
  answer_timer_seconds: number | null;
};

export type ScoreUpdatePayload = {
  clarity: number;
  confidence: number;
  structure: number;
  question_count: number;
};

export type PanelistQuestionPayload = {
  panelist_id: string;
  question_text: string;
  is_followup: boolean;
  audio_url: string | null;
  answer_timer_seconds: number | null;
};

export type SessionCompletePayload = {
  clarity: number;
  confidence: number;
  structure: number;
  question_count: number;
};

export type TurnGesture = { t_ms: number; gesture: string };

export type SessionSocketHandlers = {
  onSessionState?: (payload: SessionStatePayload) => void;
  onScoreUpdate?: (payload: ScoreUpdatePayload) => void;
  onPanelistQuestion?: (payload: PanelistQuestionPayload) => void;
  onSessionComplete?: (payload: SessionCompletePayload) => void;
  onServerError?: (message: string) => void;
  onLoggedOut?: () => void;
  onHardError?: (reason: "forbidden" | "not_found") => void;
  /** Fired once reconnect attempts are exhausted after repeated abnormal
   * closes (e.g. the server is unreachable) — the caller should show a
   * fatal error instead of leaving the user staring at a frozen session. */
  onConnectionFailed?: () => void;
};

export type SessionSocketStatus = "idle" | "connecting" | "open" | "closed";

const RECONNECT_DELAY_MS = 1500;
const MAX_RECONNECT_ATTEMPTS = 5;

/** Drives the live session WebSocket: connects via a server-minted token,
 * dispatches typed messages to the latest handlers, and reconnects
 * transparently on token expiry (4401) or an unexpected drop. 4403/4404
 * (forbidden/not found) and 4409 (already finished) are treated as
 * terminal — the caller decides what to show. */
export function useSessionSocket(sessionId: string | null, handlers: SessionSocketHandlers) {
  const [status, setStatus] = useState<SessionSocketStatus>("idle");
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef(handlers);
  const refreshAttemptedRef = useRef(false);
  const closedByClientRef = useRef(false);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const connectRef = useRef<() => void>(() => {});

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const connect = useCallback(async () => {
    if (!sessionId) return;
    setStatus("connecting");

    const tokenRes = await fetch(`/api/v1/sessions/${sessionId}/socket-token`);
    const tokenData = await tokenRes.json();

    if (tokenData.logged_out) {
      handlersRef.current.onLoggedOut?.();
      return;
    }
    if (!tokenRes.ok || !tokenData.success) {
      setStatus("closed");
      return;
    }

    const { token, url } = tokenData.data as { token: string; url: string };
    const socket = new WebSocket(`${url}?token=${encodeURIComponent(token)}`);
    socketRef.current = socket;

    socket.onopen = () => {
      refreshAttemptedRef.current = false;
      reconnectAttemptsRef.current = 0;
      setStatus("open");
    };

    socket.onmessage = (event) => {
      let message: { type: string; payload: unknown };
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (message.type) {
        case "session_state":
          handlersRef.current.onSessionState?.(message.payload as SessionStatePayload);
          break;
        case "score_update":
          handlersRef.current.onScoreUpdate?.(message.payload as ScoreUpdatePayload);
          break;
        case "panelist_question":
          handlersRef.current.onPanelistQuestion?.(message.payload as PanelistQuestionPayload);
          break;
        case "session_complete":
          handlersRef.current.onSessionComplete?.(message.payload as SessionCompletePayload);
          break;
        case "error":
          handlersRef.current.onServerError?.((message.payload as { message: string }).message);
          break;
      }
    };

    socket.onclose = (event) => {
      socketRef.current = null;
      setStatus("closed");

      if (closedByClientRef.current) {
        closedByClientRef.current = false;
        return;
      }

      if (event.code === 4401) {
        if (refreshAttemptedRef.current) {
          handlersRef.current.onLoggedOut?.();
          return;
        }
        refreshAttemptedRef.current = true;
        fetch("/api/v1/auth/refresh", { method: "POST" }).then((refreshRes) => {
          if (refreshRes.ok) connectRef.current();
          else handlersRef.current.onLoggedOut?.();
        });
        return;
      }

      if (event.code === 4403) {
        handlersRef.current.onHardError?.("forbidden");
        return;
      }
      if (event.code === 4404) {
        handlersRef.current.onHardError?.("not_found");
        return;
      }
      if (event.code === 4409 || event.code === 1000) {
        return;
      }

      reconnectAttemptsRef.current += 1;
      if (reconnectAttemptsRef.current > MAX_RECONNECT_ATTEMPTS) {
        handlersRef.current.onConnectionFailed?.();
        return;
      }

      const delay = RECONNECT_DELAY_MS * 2 ** (reconnectAttemptsRef.current - 1);
      reconnectTimeoutRef.current = window.setTimeout(() => connectRef.current(), Math.min(delay, 15000));
    };
  }, [sessionId]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    refreshAttemptedRef.current = false;
    reconnectAttemptsRef.current = 0;
    queueMicrotask(() => connect());

    return () => {
      closedByClientRef.current = true;
      if (reconnectTimeoutRef.current != null) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [connect]);

  const sendUserResponse = useCallback(
    (
      text: string,
      durationMs: number,
      audioStorageKey: string | null = null,
      previousTurnGestures: TurnGesture[] | null = null,
    ) => {
      const socket = socketRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN) return false;
      socket.send(
        JSON.stringify({
          type: "user_response",
          text,
          audio_storage_key: audioStorageKey,
          duration_ms: durationMs,
          previous_turn_gestures: previousTurnGestures,
        }),
      );
      return true;
    },
    [],
  );

  const close = useCallback(() => {
    closedByClientRef.current = true;
    if (reconnectTimeoutRef.current != null) {
      window.clearTimeout(reconnectTimeoutRef.current);
    }
    socketRef.current?.close();
    socketRef.current = null;
  }, []);

  return { status, sendUserResponse, close };
}
