import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StepScenario from "@/app/dashboard/_components/StepScenario";
import type { ScenarioId } from "@/lib/dashboard-data";

vi.mock("@/lib/dashboard-data", () => ({
  SCENARIOS: [{ id: "defense", label: "Project Defense", icon: "🎓", description: "Mock" }],
}));

vi.mock("@/app/dashboard/_components/ScenarioCard", () => ({
  default: ({
    id,
    selected,
    onSelect,
  }: {
    id: string;
    selected: boolean;
    onSelect: (id: string) => void;
  }) => (
    <button data-testid={`scenario-${id}`} aria-pressed={selected} onClick={() => onSelect(id)}>
      {id}
    </button>
  ),
}));

const baseProps = {
  selectedScenario: "defense" as ScenarioId,
  topic: "The effect of ML on healthcare outcomes",
  document: null,
  documentStatus: "idle" as const,
  documentError: null,
  isPro: false,
  onSelectScenario: vi.fn(),
  onTopicChange: vi.fn(),
  onDocumentChange: vi.fn(),
  onNext: vi.fn(),
};

describe("StepScenario — document section (free user)", () => {
  it("shows the locked placeholder with Pro label", () => {
    render(<StepScenario {...baseProps} isPro={false} />);
    expect(
      screen.getByText(/upload a document — available on student pro/i),
    ).toBeInTheDocument();
  });

  it('shows "Pro" badge next to the document label', () => {
    render(<StepScenario {...baseProps} isPro={false} />);
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("does not render the file upload button", () => {
    render(<StepScenario {...baseProps} isPro={false} />);
    expect(
      screen.queryByText(/upload a document \(pdf, docx/i),
    ).not.toBeInTheDocument();
  });
});

describe("StepScenario — document section (pro user)", () => {
  it("shows the upload button instead of the locked placeholder", () => {
    render(<StepScenario {...baseProps} isPro={true} />);
    expect(screen.getByText(/upload a document \(pdf, docx/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/available on student pro/i),
    ).not.toBeInTheDocument();
  });

  it('hides the "Pro" badge', () => {
    render(<StepScenario {...baseProps} isPro={true} />);
    expect(screen.queryByText("Pro")).not.toBeInTheDocument();
  });

  it("shows uploaded document name when a file is present", () => {
    const file = new File(["content"], "thesis.pdf", { type: "application/pdf" });
    render(
      <StepScenario
        {...baseProps}
        isPro={true}
        document={file}
        documentStatus="ready"
      />,
    );
    expect(screen.getByText("thesis.pdf")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });
});

describe('StepScenario — "Set up panelists" button', () => {
  it("is disabled when no scenario is selected", () => {
    render(<StepScenario {...baseProps} selectedScenario={null} topic="" />);
    expect(screen.getByRole("button", { name: /set up panelists/i })).toBeDisabled();
  });

  it("is disabled when the topic is empty", () => {
    render(<StepScenario {...baseProps} topic="" />);
    expect(screen.getByRole("button", { name: /set up panelists/i })).toBeDisabled();
  });

  it("is disabled while a document is uploading", () => {
    render(<StepScenario {...baseProps} documentStatus="uploading" />);
    expect(screen.getByRole("button", { name: /set up panelists/i })).toBeDisabled();
  });

  it("is enabled when scenario + topic are provided", () => {
    render(<StepScenario {...baseProps} />);
    expect(screen.getByRole("button", { name: /set up panelists/i })).not.toBeDisabled();
  });
});
