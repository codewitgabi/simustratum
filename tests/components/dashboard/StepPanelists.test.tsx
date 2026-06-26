import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StepPanelists from "@/app/dashboard/_components/StepPanelists";
import type { Panelist } from "@/app/dashboard/_components/PanelistCard";

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

vi.mock("@/app/dashboard/_components/PanelistCard", () => ({
  default: ({ panelist }: { panelist: Panelist }) => (
    <div data-testid="panelist-card">{panelist.name || "Unnamed"}</div>
  ),
}));

const basePanelist: Panelist = {
  id: "p1",
  name: "Dr. Smith",
  role: "Professor",
  strict: 50,
  inquisitive: 50,
};

const defaultProps = {
  panelists: [basePanelist],
  maxPanelists: 1,
  isPro: false,
  onAdd: vi.fn(),
  onRemove: vi.fn(),
  onChange: vi.fn(),
  onBack: vi.fn(),
  onNext: vi.fn(),
};

describe("StepPanelists — free user", () => {
  it("shows the upgrade link instead of the Add Panelist button", () => {
    render(<StepPanelists {...defaultProps} isPro={false} />);
    expect(screen.queryByRole("button", { name: /add panelist/i })).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /upgrade for more panelists/i }),
    ).toBeInTheDocument();
  });

  it("upgrade link points to /plans", () => {
    render(<StepPanelists {...defaultProps} isPro={false} />);
    expect(screen.getByRole("link", { name: /upgrade for more panelists/i })).toHaveAttribute(
      "href",
      "/plans",
    );
  });

  it("shows the free-plan subtitle", () => {
    render(<StepPanelists {...defaultProps} isPro={false} />);
    expect(screen.getByText(/free plan includes 1 ai panelist/i)).toBeInTheDocument();
  });
});

describe("StepPanelists — pro user", () => {
  it("shows the Add Panelist button", () => {
    render(<StepPanelists {...defaultProps} isPro={true} maxPanelists={3} />);
    expect(screen.getByRole("button", { name: /add panelist/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /upgrade/i })).not.toBeInTheDocument();
  });

  it("shows the pro subtitle with max panelist count", () => {
    render(<StepPanelists {...defaultProps} isPro={true} maxPanelists={3} />);
    expect(screen.getByText(/add up to 3 ai panelists/i)).toBeInTheDocument();
  });

  it("disables Add Panelist when the panel is full", () => {
    const full: Panelist[] = [
      { ...basePanelist, id: "p1" },
      { ...basePanelist, id: "p2" },
      { ...basePanelist, id: "p3" },
    ];
    render(<StepPanelists {...defaultProps} isPro={true} maxPanelists={3} panelists={full} />);
    expect(screen.getByRole("button", { name: /add panelist/i })).toBeDisabled();
  });
});

describe("StepPanelists — proceed button", () => {
  it('disables "Review session" when the first panelist has no name', () => {
    const unnamed: Panelist = { ...basePanelist, name: "" };
    render(<StepPanelists {...defaultProps} panelists={[unnamed]} />);
    expect(screen.getByRole("button", { name: /review session/i })).toBeDisabled();
  });

  it('enables "Review session" when the first panelist has a name', () => {
    render(<StepPanelists {...defaultProps} panelists={[basePanelist]} />);
    expect(screen.getByRole("button", { name: /review session/i })).not.toBeDisabled();
  });
});
