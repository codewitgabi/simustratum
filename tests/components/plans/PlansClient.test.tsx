import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PlansClient from "@/app/plans/_components/PlansClient";

const mockPush = vi.hoisted(() => vi.fn());
const mockReplace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/Logo", () => ({
  default: () => <div data-testid="logo" />,
}));

/**
 * Route fetch calls by URL so StrictMode double-invoking useEffect does not
 * exhaust mockResolvedValueOnce calls and return undefined.
 */
function stubFetch(handlers: Record<string, { ok: boolean; body: unknown }>) {
  const mock = vi.fn().mockImplementation((url: string) => {
    const h = handlers[url] ?? { ok: true, body: {} };
    return Promise.resolve({ ok: h.ok, json: async () => h.body });
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

function stubTimezone(tz: string) {
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    timeZone: tz,
    locale: "en",
    calendar: "gregory",
    numberingSystem: "latn",
    hour12: false,
  } as Intl.ResolvedDateTimeFormatOptions);
}

beforeEach(() => {
  vi.clearAllMocks();
  stubTimezone("UTC");
  stubFetch({ "/api/v1/billing/status": { ok: true, body: { data: { plan: "free" } } } });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// ─── Feature table ────────────────────────────────────────────────────────────

const FEATURE_LABELS = [
  "Practice sessions",
  "AI panelists per session",
  "Clarity, confidence & structure scoring",
  "Session replay with voice playback",
  "Real-time feedback & answer timers",
  "Document-tailored questions",
  "Full transcript history",
];

describe("PlansClient — feature table", () => {
  it("renders all 7 feature labels in both plan cards", async () => {
    render(<PlansClient />);
    // Each label is rendered once in the Free card and once in the Student Pro card
    await waitFor(() =>
      expect(screen.getAllByText("Practice sessions")).toHaveLength(2),
    );
    FEATURE_LABELS.forEach((label) => {
      expect(screen.getAllByText(label)).toHaveLength(2);
    });
  });
});

// ─── Currency detection ───────────────────────────────────────────────────────

describe("PlansClient — currency detection", () => {
  it("shows NGN prices when timezone is Africa/Lagos", async () => {
    stubTimezone("Africa/Lagos");
    render(<PlansClient />);
    await waitFor(() => expect(screen.getByText("₦0")).toBeInTheDocument());
    expect(screen.getByText("₦2,500")).toBeInTheDocument();
  });

  it("shows USD prices for any other timezone", async () => {
    render(<PlansClient />);
    await waitFor(() => expect(screen.getByText("$0")).toBeInTheDocument());
    expect(screen.getByText("$4")).toBeInTheDocument();
  });

  it("defaults to USD when Intl.DateTimeFormat.resolvedOptions throws", async () => {
    vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockImplementation(
      () => { throw new Error("not supported"); },
    );
    render(<PlansClient />);
    await waitFor(() => expect(screen.getByText("$0")).toBeInTheDocument());
  });
});

// ─── Plan gating ─────────────────────────────────────────────────────────────

describe("PlansClient — plan gating", () => {
  it("redirects pro users to /dashboard and skips the page", async () => {
    stubFetch({ "/api/v1/billing/status": { ok: true, body: { data: { plan: "pro" } } } });
    render(<PlansClient />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
  });

  it("does not redirect free users", async () => {
    render(<PlansClient />);
    await waitFor(() => expect(screen.getByText("Start free")).toBeInTheDocument());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("shows the page even when the billing status fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));
    render(<PlansClient />);
    await waitFor(() => expect(screen.getByText("Start free")).toBeInTheDocument());
  });
});

// ─── Free plan action ─────────────────────────────────────────────────────────

describe("PlansClient — free plan action", () => {
  it('clicking "Start free" posts to /api/v1/billing/plan then navigates to /dashboard', async () => {
    const mock = stubFetch({
      "/api/v1/billing/status": { ok: true, body: { data: { plan: "free" } } },
      "/api/v1/billing/plan": { ok: true, body: {} },
    });

    render(<PlansClient />);
    fireEvent.click(await screen.findByText("Start free"));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/dashboard"));
    expect(mock).toHaveBeenCalledWith(
      "/api/v1/billing/plan",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ plan: "free" }),
      }),
    );
  });

  it("shows the API error message when the billing plan request fails", async () => {
    stubFetch({
      "/api/v1/billing/status": { ok: true, body: { data: { plan: "free" } } },
      "/api/v1/billing/plan": { ok: false, body: { message: "Session limit reached" } },
    });

    render(<PlansClient />);
    fireEvent.click(await screen.findByText("Start free"));

    await waitFor(() =>
      expect(screen.getByText("Session limit reached")).toBeInTheDocument(),
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows a generic error message when the fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url === "/api/v1/billing/status") {
          return Promise.resolve({ ok: true, json: async () => ({ data: { plan: "free" } }) });
        }
        return Promise.reject(new Error("network error"));
      }),
    );

    render(<PlansClient />);
    fireEvent.click(await screen.findByText("Start free"));

    await waitFor(() =>
      expect(
        screen.getByText("Something went wrong. Please try again."),
      ).toBeInTheDocument(),
    );
  });

  it("redirects to /login when the session is expired", async () => {
    stubFetch({
      "/api/v1/billing/status": { ok: true, body: { data: { plan: "free" } } },
      "/api/v1/billing/plan": { ok: true, body: { logged_out: true } },
    });

    render(<PlansClient />);
    fireEvent.click(await screen.findByText("Start free"));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/login"));
  });
});

// ─── Pro plan action ──────────────────────────────────────────────────────────

describe("PlansClient — pro plan action", () => {
  it('clicking "Start with Pro" posts to /api/v1/billing/checkout with currency', async () => {
    // Allow window.location.href assignment in jsdom
    Object.defineProperty(window, "location", {
      value: { ...window.location, href: "" },
      writable: true,
    });

    const mock = stubFetch({
      "/api/v1/billing/status": { ok: true, body: { data: { plan: "free" } } },
      "/api/v1/billing/checkout": {
        ok: true,
        body: { data: { checkout_url: "https://checkout.stripe.com/test" } },
      },
    });

    render(<PlansClient />);
    fireEvent.click(await screen.findByText("Start with Pro"));

    await waitFor(() =>
      expect(mock).toHaveBeenCalledWith(
        "/api/v1/billing/checkout",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"plan":"pro"'),
        }),
      ),
    );
  });

  it("shows an error when the checkout response has no URL", async () => {
    stubFetch({
      "/api/v1/billing/status": { ok: true, body: { data: { plan: "free" } } },
      "/api/v1/billing/checkout": { ok: true, body: {} },
    });

    render(<PlansClient />);
    fireEvent.click(await screen.findByText("Start with Pro"));

    await waitFor(() =>
      expect(
        screen.getByText("Could not start checkout. Please try again."),
      ).toBeInTheDocument(),
    );
  });
});
