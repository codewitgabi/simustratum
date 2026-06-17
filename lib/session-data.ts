import type { ScenarioId } from "./dashboard-data";

export type SessionPanelist = {
  id?: string;
  name: string;
  role: string;
  strict: number;
  inquisitive: number;
};

export type TranscriptMessage = {
  id: string;
  speaker: string;
  text: string;
  isUser: boolean;
};

export type SessionScores = {
  clarity: number;
  confidence: number;
  structure: number;
};

export type PanelistGesture = "explain" | "point" | "emphasize";

export const PANELIST_GESTURES: PanelistGesture[] = [
  "explain",
  "point",
  "emphasize",
];

export const PANELIST_THEMES = [
  { head: "#F5C5A0", hair: "#3A2010", body: "#2D5A8A" },
  { head: "#C8956A", hair: "#1A1109", body: "#5A2D6A" },
  { head: "#E8B08A", hair: "#8B4513", body: "#2D6A4F" },
] as const;

export const PANELIST_VOICE_PROFILES = [
  { pitch: 0.95, rate: 0.98, voicePreference: "male" as const },
  { pitch: 1.15, rate: 1.02, voicePreference: "female" as const },
  { pitch: 0.85, rate: 0.95, voicePreference: "male" as const },
] as const;

export const PANELIST_POSITIONS: Record<number, string[]> = {
  1: ["50%"],
  2: ["30%", "70%"],
  3: ["18%", "50%", "82%"],
};

export const DEFAULT_SCENARIO: ScenarioId = "defense";

export const DEFAULT_TOPIC =
  "The effect of social media on academic performance";

export const DEFAULT_PANELISTS: SessionPanelist[] = [
  {
    name: "Dr. Okafor",
    role: "Research Methods",
    strict: 75,
    inquisitive: 80,
  },
  { name: "Prof. Amara", role: "Theory", strict: 50, inquisitive: 60 },
  { name: "Dr. Mensah", role: "Statistics", strict: 60, inquisitive: 70 },
];

export const BASELINE_SCORES: SessionScores = {
  clarity: 50,
  confidence: 50,
  structure: 50,
};

/** Rough words-per-minute estimate so the bubble/avatar timing keeps pace
 * with speech synthesis (and still feels right when audio is muted). */
export function estimateSpeechDurationMs(text: string): number {
  return Math.min(Math.max(text.length * 55, 1200), 7000);
}

export function panelistInitials(panelist: SessionPanelist): string {
  const lastName = panelist.name.trim().split(/\s+/).pop() ?? "";
  return lastName;
}
