export type ScenarioId =
  | "tutorial"
  | "presentation"
  | "defense"
  | "oral"
  | "seminar"
  | "english";

export const SCENARIO_META: Record<
  ScenarioId,
  { label: string; icon: string }
> = {
  tutorial: { label: "Tutorial Practice", icon: "📝" },
  presentation: { label: "Presentation", icon: "📺" },
  defense: { label: "Project Defense", icon: "🎓" },
  oral: { label: "Oral Examination", icon: "✍️" },
  seminar: { label: "Seminar Defense", icon: "🎤" },
  english: { label: "English Proficiency", icon: "🌍" },
};

export const SCENARIO_API_VALUES: Record<ScenarioId, string> = {
  tutorial: "tutorial_practice",
  presentation: "presentation",
  defense: "project_defense",
  oral: "oral_examination",
  seminar: "seminar_defense",
  english: "english_proficiency",
};

export const SCENARIO_FROM_API_VALUE: Record<string, ScenarioId> = Object.fromEntries(
  Object.entries(SCENARIO_API_VALUES).map(([id, value]) => [value, id as ScenarioId]),
);

export const SCENARIOS = [
  {
    id: "tutorial" as ScenarioId,
    icon: "📝",
    title: "Tutorial Practice",
    description:
      "Face tutor-style questioning on course material. Great for weekly prep.",
    tag: "Beginner friendly",
  },
  {
    id: "presentation" as ScenarioId,
    icon: "📺",
    title: "Presentation",
    description:
      "Simulate presenting to an audience with live Q&A from the floor.",
    tag: "Open floor",
  },
  {
    id: "defense" as ScenarioId,
    icon: "🎓",
    title: "Project Defense",
    description:
      "Defend your research to a panel. They'll probe your methodology and findings.",
    tag: "High pressure",
  },
  {
    id: "oral" as ScenarioId,
    icon: "✍️",
    title: "Oral Examination",
    description:
      "Rapid-fire course questions in a timed exam environment. No notes allowed.",
    tag: "Timed",
  },
  {
    id: "seminar" as ScenarioId,
    icon: "🎤",
    title: "Seminar Defense",
    description:
      "Academic seminar with expert panelists challenging your ideas and claims.",
    tag: "Expert panel",
  },
  {
    id: "english" as ScenarioId,
    icon: "🌍",
    title: "English Proficiency",
    description:
      "Practice pronunciation, fluency, and academic vocabulary under real pressure.",
    tag: "Language focus",
  },
];

export const PANELIST_BG = ["#FDEBD0", "#D5E8D4", "#DAE8FC"];

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export const SIDEBAR_WIDTH_EXPANDED = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 72;
