"use client";

import { useState } from "react";

const SESSION_KEY = "skyroute_session_id";

function readOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = `sess-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return `sess-fallback-${Date.now()}`;
  }
}

/** Stable per-tab session id (sessionStorage, not localStorage) so that two
 * tabs in the same browser are treated as two different "users" — this is
 * what lets the seat map demonstrate real-time double-booking prevention. */
export function useSessionId(): string {
  const [sessionId] = useState(() => readOrCreateSessionId());
  return sessionId;
}
