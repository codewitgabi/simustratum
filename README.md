# Simustratum

A Next.js application for practicing high-stakes speaking scenarios — thesis defenses, oral exams, conference presentations — with AI-powered panelists that ask challenging, targeted questions in real time. Built with a neubrutalist design system and a WebSocket-first session architecture with automatic REST fallback.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
  - [Authentication](#authentication)
  - [Session Flow](#session-flow)
  - [Billing](#billing)
  - [Proxy Layer](#proxy-layer)
- [Design System](#design-system)
- [API Routes](#api-routes)
- [Backend Contract](#backend-contract)

---

## Overview

Simustratum lets students and researchers simulate panel sessions before the real thing. A user picks a scenario (defense, oral exam, presentation, etc.), configures AI panelists with personality sliders, optionally uploads a reference document (Pro), and enters a live session where panelists ask questions via text and synthesised speech. Scores for clarity, confidence, and structure are tracked in real time and surfaced at the end.

**Free plan:** 15 sessions/month, 1 panelist, core scoring and replay.  
**Student Pro:** Unlimited sessions, up to 3 panelists, document-tailored questions, full transcript history.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Auth | JWT — access + refresh tokens in `httpOnly` cookies |
| Google OAuth | `@react-oauth/google` |
| Speech | Web Speech API (synthesis + recognition) |
| Session transport | WebSocket |
| Payments | Stripe (geo-detected: NGN for Nigeria, USD internationally) |
| Package manager | pnpm |

---

## Getting Started

**Prerequisites:** Node.js ≥ 20, pnpm ≥ 9, a running backend at the URL configured in `.env.local`.

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # ESLint
pnpm test       # Vitest watch mode
pnpm test:run   # Vitest single run (CI)
```

---

## Environment Variables

Create a `.env.local` at the project root. All variables are server-side only unless prefixed `NEXT_PUBLIC_`.

```env
# URL of the backend API server (no trailing slash)
BACKEND_URL=http://localhost:8000

# Google OAuth client ID — public, used by @react-oauth/google
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Access token cookie lifetime in minutes (default: 15)
ACCESS_TOKEN_MAX_AGE=15

# Refresh token cookie lifetime in days (default: 30)
REFRESH_TOKEN_MAX_AGE=30

# Canonical site URL — used for SEO metadata (optional, defaults gracefully)
NEXT_PUBLIC_SITE_URL=https://simustratum.com
```

Stripe keys, webhook secrets, and price IDs live on the **backend only** — this frontend never touches them directly. See [`BACKEND_BILLING.md`](./BACKEND_BILLING.md) for the full backend contract.

---

## Project Structure

```
app/
  _components/          # Landing page sections (Nav, Hero, Features, HowItWorks, …)
  login/
    _components/        # LoginFormCard, LoginSidebar, RememberMeCheckbox, …
  signup/
    _components/        # SignupFormCard, SignupSidebar, TermsCheckbox, …
  plans/
    _components/        # PlansClient — plan selection with geo-detected currency
    success/            # Post-payment confirmation page
  dashboard/
    _components/        # NewSessionWizard, StepScenario, StepPanelists, StepReady,
                        # DashboardSidebar, DashboardHeader, PanelistCard, …
    settings/
      _components/      # PlanCard, ProfileCard, PasswordCard, SettingsHeader
  session/
    _components/        # SessionRoom, RoomScene, BottomControls, TranscriptPanel, …
      hooks/            # useSessionSocket, useSessionRest, useSessionSpeech,
                        # useAudioRecorder, useRoomCamera
  replay/[id]/
    _components/        # ReplayRoom, ReplayControls
  api/v1/               # Next.js proxy routes (see API Routes below)
  [static pages]/       # pricing, faq, blog, careers, contact, about, …

components/             # Truly shared components: Logo, GoogleSignInButton, PasswordField
lib/
  proxy.ts              # Core proxy utilities: authedBackendFetch, setAuthCookies, …
  auth.ts               # SessionUser type, getInitials helper
  session.ts            # Server-side getSessionUser (reads ss_user cookie)
  dashboard-data.ts     # Scenario configs, panelist definitions, nav items
  session-data.ts       # Session constants, panelist voice profiles, score types
  dashboard-utils.ts    # createId, other dashboard helpers
  seo.ts                # Shared metadata helpers
  turn-audio.ts         # Turn audio upload helper
```

---

## Architecture

### Authentication

Auth is fully cookie-based. The backend issues a short-lived **access token** and a long-lived **refresh token**; both are stored in `httpOnly; SameSite=Lax` cookies (`ss_access`, `ss_refresh`) written by the Next.js proxy layer — never exposed to client JavaScript.

A third cookie, `ss_user`, caches basic user info (id, name, email, plan) so server components can read the current user without a backend round-trip on every request.

The `authedBackendFetch` helper in `lib/proxy.ts` handles the full refresh cycle transparently: on a 401, it exchanges the refresh token for a new pair and retries the original request. Callers just set the returned `refreshedTokens` on the response, or call `clearAuthCookies` when the refresh fails.

### Session Flow

A live session follows this lifecycle:

```
Dashboard wizard → POST /api/v1/sessions (create)
  → /session page loads
  → StartOverlay shown (user clicks "Enter the room")
  → useSessionSocket connects via a short-lived socket token
       GET /api/v1/sessions/{id}/socket-token → WebSocket URL + token
  → Real-time messages: session_state, panelist_question, score_update, session_complete
  → User responds via mic (Web Speech API) or typed input
  → Each answer sent over the open WebSocket
  → On session complete: results overlay shown
  → POST /api/v1/sessions/{id}/end (explicit end)
```

**WebSocket transport only.** `useSessionSocket` handles reconnection transparently — on a 4401 (token expired) it refreshes and reconnects; on abnormal drops it retries with exponential backoff up to 5 attempts. 4403/4404 (forbidden/not found) and 4409 (already finished) are treated as terminal and surface the appropriate error to the user. If the connection drops mid-session a "Connection lost — reconnecting…" banner is shown so users are never left staring at a frozen screen.

### Billing

After signup, users land on `/plans` instead of the dashboard. The page:

1. Detects the user's timezone (`Africa/Lagos` → NGN, everything else → USD).
2. Fetches `GET /api/v1/billing/status` — if the user is already on Pro, they're redirected to the dashboard immediately.
3. **Free:** calls `POST /api/v1/billing/plan` → dashboard.
4. **Pro:** calls `POST /api/v1/billing/checkout` → receives a Stripe Checkout URL → redirects the browser there. After payment, Stripe returns the user to `/plans/success`.

Plan limits are enforced in the session wizard:
- Free users see 1 panelist maximum; the "Add Panelist" button is replaced with an upgrade prompt.
- The document upload section is locked and grayed out for free users with a "Pro" badge.

The Settings page (`/dashboard/settings`) includes a `PlanCard` that shows live usage (sessions used / limit for free users, billing period end for Pro), with "Upgrade to Pro" or "Manage billing" (Stripe Customer Portal) CTAs.

See [`BACKEND_BILLING.md`](./BACKEND_BILLING.md) for the full backend implementation spec.

### Proxy Layer

Every client request to the backend goes through a Next.js API route under `app/api/v1/`. This keeps the backend URL and auth tokens server-side only.

All state-mutating proxy routes call `enforceSameOrigin(request)` first, which validates the `Origin` header against the current host and returns a 403 if they don't match — a lightweight CSRF guard that requires no tokens.

The core helper is `authedBackendFetch`, which:
- Attaches the access token as a `Bearer` header.
- On a 401, transparently refreshes and retries.
- Returns `{ ok, response, refreshedTokens? }` — callers write the new cookies when `refreshedTokens` is present, or clear auth cookies when `ok` is false.

---

## Design System

Defined as CSS custom properties in `app/globals.css`, consumed via Tailwind utility classes.

**Colors**

| Token | Value | Use |
|---|---|---|
| `--color-cream` | `#fbf4ea` | Page backgrounds |
| `--color-pale` | `#f0e5d0` | Subtle surface fills |
| `--color-camel` | `#c19a6b` | Accents, Pro tier highlights |
| `--color-sienna` | `#a0522d` | Primary CTAs, brand accent |
| `--color-ink` | `#1a1109` | Text, borders |
| `--color-mid` | `#7a5c3a` | Secondary text |
| `--color-green` | `#2d6a4f` | Success states |

**Shadows** — hard offset, no blur (neubrutalist):

| Token | Value |
|---|---|
| `--shadow-neu-sm` | `3px 3px 0 #1a1109` |
| `--shadow-neu` / `--shadow-neu-md` | `5px 5px 0 #1a1109` |
| `--shadow-neu-lg` | `7px 7px 0 #1a1109` |

**Utility classes**

| Class | Purpose |
|---|---|
| `.neu-press` / `.neu-press-sm` | Button press animation (translate + shadow collapse) |
| `.neu-btn` | Full-width button baseline |
| `.neu-input` / `.neu-input-compact` | Input fields with focus ring |
| `.neu-nav-link` | Navigation link hover effect |
| `.hatch`, `.hatch-sidebar`, `.hatch-cta` | Diagonal hatch pattern fills |
| `.bar` | Waveform bar animation (audio visualiser) |
| `.step-animate` | Fade-in entry animation for wizard steps |

**Fonts:** Space Grotesk (`font-grotesk`) for headings and labels; Inter (`font-inter`) for body copy. Both loaded via `next/font` in `app/layout.tsx`.

---

## API Routes

All routes proxy to `BACKEND_URL`. Auth routes write/clear cookies; all others require a valid session.

**Auth**

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Create account |
| `POST` | `/api/v1/auth/login` | Email/password sign-in |
| `POST` | `/api/v1/auth/google` | Google ID token exchange |
| `POST` | `/api/v1/auth/logout` | Clear session cookies |
| `POST` | `/api/v1/auth/refresh` | Rotate access/refresh tokens |
| `GET / PATCH` | `/api/v1/auth/me` | Get / update current user |
| `POST` | `/api/v1/auth/change-password` | Change password |
| `POST` | `/api/v1/auth/forgot-password` | Send reset email |
| `POST` | `/api/v1/auth/reset-password` | Consume reset token |

**Sessions**

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/v1/sessions` | Create session |
| `GET` | `/api/v1/sessions/{id}` | Get session details |
| `GET` | `/api/v1/sessions/{id}/socket-token` | Mint a short-lived WS token |
| `POST` | `/api/v1/sessions/{id}/end` | End session |
| `GET` | `/api/v1/sessions/{id}/replay` | Fetch replay data |
| `POST` | `/api/v1/sessions/{id}/turns/audio-upload-url` | Get presigned upload URL |

**Documents & Billing**

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/v1/documents` | Upload reference document (Pro) |
| `POST` | `/api/v1/billing/plan` | Select free plan |
| `POST` | `/api/v1/billing/checkout` | Create Stripe Checkout session |
| `POST` | `/api/v1/billing/portal` | Create Stripe Customer Portal session |
| `GET` | `/api/v1/billing/status` | Get current plan + usage |

---

## Backend Contract

- **Auth & user data:** [`lib/proxy.ts`](./lib/proxy.ts) — `SessionUser` type, cookie names, token handling conventions.
- **Session WebSocket protocol:** [`app/session/_components/hooks/useSessionSocket.ts`](./app/session/_components/hooks/useSessionSocket.ts) — message types, close codes, reconnect logic.
- **Billing:** [`BACKEND_BILLING.md`](./BACKEND_BILLING.md) — full spec for all billing endpoints, Stripe setup, webhook events, plan enforcement, and database schema.
