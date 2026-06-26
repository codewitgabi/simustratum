# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (localhost:3000)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm test       # Run tests in watch mode (Vitest)
pnpm test:run   # Run tests once (CI)
```

Tests live in `tests/` (mirrors source layout). Stack: Vitest + React Testing Library + jsdom.
- `tests/lib/` — pure utility functions (`getInitials`, `initialsFromName`, `sliderLabel`, `formatRelativeTime`)
- `tests/components/dashboard/` — `StepPanelists` and `StepScenario` (free/pro plan gating)
- `tests/components/plans/` — `PlansClient` (currency detection, plan redirect, billing API flows)

## Architecture

**Simustratum** is a Next.js (App Router) application for practicing high-stakes speaking scenarios (presentations, oral exams, thesis defenses) with AI-powered panelists that ask challenging questions via the Web Speech API.

### Directory Layout

```
app/
  _components/       # Landing page sections (Nav, Hero, Features, etc.)
  login/             # Auth pages
  signup/
  dashboard/
    _components/     # Session setup wizard, sidebar, header, cards
  session/
    _components/     # In-session UI + hooks
components/          # Shared components (Logo, GoogleSignInButton)
lib/                 # Mock data and utility functions
```

### Key Patterns

- **App Router** with per-route `_components/` folders — components are co-located with their routes, not in a global `/components` folder (exception: truly shared components like `Logo`).
- **Path alias**: `@/*` resolves to the project root (e.g., `@/lib/dashboard-data`).
- **Mock data**: `lib/dashboard-data.ts` holds all scenario configs, panelist definitions, nav items, and recent sessions. There is no backend or database yet.
- **Session hooks**: `app/session/_components/hooks/useSessionSpeech.ts` wraps the Web Speech API (synthesis + recognition), and `useRoomCamera.ts` drives the 3D room's pan/zoom/parallax. The `speech-recognition.d.ts` file in the same `hooks/` folder provides TypeScript declarations for browser SpeechRecognition.

### Design System

Custom neubrutalism theme defined in `app/globals.css` as CSS variables consumed by Tailwind:

- **Colors**: `--color-cream` (#fbf4ea), `--color-pale`, `--color-camel`, `--color-sienna`, `--color-ink` (text), `--color-green`
- **Shadows**: `--shadow-neu`, `--shadow-neu-lg` — hard offset shadows for the neubrutalist aesthetic
- **Interactive classes**: `.neu-press` (press-down animation), `.neu-nav-link` (hover nav effect), `.bar` (waveform animation for audio)
- **Fonts**: Space Grotesk (headings/bold), Inter (body) — both loaded in `app/layout.tsx`

### Session Setup Flow

The dashboard has a multi-step wizard (`NewSessionWizard`) with steps:
1. `StepScenario` — pick a scenario type (6 options from `lib/dashboard-data.ts`)
2. `StepPanelists` — configure AI panelists with `PersonalitySlider` and `SessionOptionToggle`
3. `StepReady` / `StepTabs` — review and launch

Panelists are created with `crypto.randomUUID()` (fixed in recent commit to use a polyfill-safe version).
