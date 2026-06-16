# AGENT.md

Guidance for AI agents (and humans) working in the **Simustratum** codebase — a
Next.js App Router app for practicing speaking scenarios (presentations, oral
exams, thesis defenses) against AI panelists driven by the Web Speech API.

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS v4 — theme tokens via `@theme inline` in `app/globals.css`
- Path alias `@/*` → project root (e.g. `@/lib/session-data`)
- No backend/database — all data is mocked in `lib/` or kept in component
  state / `localStorage`

```bash
pnpm dev     # localhost:3000
pnpm build
pnpm lint
```

## Directory layout & where things go

```
app/
  layout.tsx         # root layout, fonts, <html>/<body>
  globals.css        # Tailwind theme tokens + all custom CSS
  page.tsx           # landing page (server component)
  _components/       # landing-page sections (Hero, Features, Nav, ...)
  login/, signup/     # auth pages
  dashboard/
    page.tsx
    _components/      # wizard, sidebar, cards — route-local only
  session/
    page.tsx
    _components/      # in-session UI
      hooks/           # route-local hooks + ambient .d.ts files
components/            # TRULY global/shared components only
lib/                   # mock data, types, and pure utility functions
```

Rules of thumb:

- **Route-local components** live in `<route>/_components/`. If a hook or
  type is only used by one route, it goes in that route's `_components/`
  (or a `hooks/` subfolder under it), not in `lib/` or `@/components`.
- **`@/components`** is reserved for components used across multiple routes
  (e.g. `Logo`, `GoogleSignInButton`, `MicIcon`). Don't add a component here
  unless it's actually shared.
- **`lib/`** holds mock/static data, shared TypeScript types, and pure
  helper functions (no JSX, no React hooks). e.g. `dashboard-data.ts`,
  `session-data.ts`, `dashboard-utils.ts`.

## Component conventions

- **`page.tsx` files are server components.** No `"use client"`, no hooks.
  They typically just export `metadata` and render a single client
  orchestrator component:

  ```tsx
  import type { Metadata } from "next";
  import SessionRoom from "./_components/SessionRoom";

  export const metadata: Metadata = {
    title: "Session — Simustratum",
    description: "…",
  };

  function SessionPage() {
    return (
      <div className="h-screen w-screen overflow-hidden font-inter">
        <SessionRoom />
      </div>
    );
  }

  export default SessionPage;
  ```

- **Every component file ends with a default export of the component**,
  declared as a named function above and exported at the bottom:

  ```tsx
  function PanelistAvatar({ ... }: PanelistAvatarProps) {
    // ...
  }

  export default PanelistAvatar;
  ```

  Named/secondary exports (types, small helpers) are fine alongside this,
  but the component itself is always a default export at the bottom of the
  file.

- **`"use client"`** is the first line of any file using hooks, browser
  APIs, or event handlers. Server components omit it entirely.

- **Props types** are named `<Component>Props` and declared just above the
  component function.

- IDs that need to be unique (list keys, message ids) use `createId(prefix)`
  from `@/lib/dashboard-utils` — it wraps `crypto.randomUUID()` with a
  fallback for environments where it's unavailable.

## Styling (Tailwind v4 / neubrutalism)

- Theme tokens are defined once in `app/globals.css` under `@theme inline`
  and consumed as Tailwind utilities: `bg-cream`, `text-ink`, `border-camel`,
  `shadow-neu-sm`, `font-grotesk`, `text-2xs`, `tracking-widest`, etc. Add new
  design tokens there rather than inlining raw values.
- **Use canonical Tailwind v4 utilities, not arbitrary-value brackets**, when
  a canonical class exists:
  - `z-70` not `z-[70]`
  - `border-2` / `border-3` not `border-[2px]` / `border-[3px]`
  - `top-17`, `min-w-14.5` (0.25rem spacing scale) not `top-[68px]` / `min-w-[58px]`
  - `bg-linear-to-t` not `bg-gradient-to-t`
  - `tracking-wider` (0.05em) / `tracking-widest` (0.1em) not
    `tracking-[0.05em]` / `tracking-[0.1em]`
  - Arbitrary values (`shadow-[5px_5px_0_#1A1109]`, custom rgba shadows) are
    still used where there's no canonical equivalent — that's expected.
- **Neubrutalist look**: thick `border-2`/`border-3 border-ink`, hard offset
  `shadow-[Npx_Npx_0_#1A1109]` shadows, and `.neu-press` / `.neu-press-sm`
  classes for the "press down, drop the shadow" hover effect on buttons.
- **Custom CSS for non-utility work** (3D room transforms, animations,
  gesture variants, scrollbars) lives in `app/globals.css`, namespaced by
  feature (e.g. all session-room styles are prefixed `.session-*`).
  `useState(false)` + `useEffect` is used to gate any browser-only rendering
  for SSR safety, and typed CSS custom properties are passed via
  `style={{...} as CSSProperties & {"--my-var": string}}`.

## Web Speech API pattern

Browser speech APIs (`SpeechSynthesis`, `SpeechRecognition`) are wrapped in a
hook under `<route>/_components/hooks/` (see `useSessionSpeech.ts`), with:

- Feature detection done in `useEffect` (`"speechSynthesis" in window`,
  `window.SpeechRecognition ?? window.webkitSpeechRecognition`) and stored in
  state — never assumed at module scope.
- Ambient TypeScript declarations for non-standard browser APIs (e.g.
  `webkitSpeechRecognition`) in a `*.d.ts` file alongside the hook
  (`speech-recognition.d.ts`).
- Graceful fallbacks for unsupported browsers (e.g. `BottomControls`
  renders a text-input form instead of a mic button when STT is
  unsupported).

## Session config flow

`NewSessionWizard` writes the chosen scenario/topic/panelists to
`localStorage` (`ss_scenario`, `ss_topic`, `ss_panelists`) and navigates via
`router.push("/session")`. `SessionRoom` reads and validates these on mount,
falling back to `DEFAULT_SCENARIO` / `DEFAULT_TOPIC` / `DEFAULT_PANELISTS`
from `lib/session-data.ts` if missing or invalid.
