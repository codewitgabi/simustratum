"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { ScenarioId } from "@/lib/dashboard-data";
import { createId } from "@/lib/dashboard-utils";
import { DEFAULT_SCENARIO, DEFAULT_TOPIC } from "@/lib/session-data";
import DashboardHeader from "./DashboardHeader";
import StepPanelists from "./StepPanelists";
import StepReady, { type SessionOptions } from "./StepReady";
import StepScenario from "./StepScenario";
import StepTabs from "./StepTabs";
import type { Panelist } from "./PanelistCard";

const MAX_PANELISTS = 3;

function createPanelist(): Panelist {
  return {
    id: createId("panelist"),
    name: "",
    role: "",
    strict: 50,
    inquisitive: 50,
  };
}

function NewSessionWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(
    null,
  );
  const [topic, setTopic] = useState("");
  const [panelists, setPanelists] = useState<Panelist[]>([createPanelist()]);
  const [options, setOptions] = useState<SessionOptions>({
    feedback: true,
    timer: false,
    transcript: true,
  });
  const [launching, setLaunching] = useState(false);

  const goToStep = useCallback(
    (n: number) => {
      if (n === 2 && !selectedScenario) return;
      setStep(n);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [selectedScenario],
  );

  const handleAddPanelist = () => {
    if (panelists.length >= MAX_PANELISTS) return;
    setPanelists((prev) => [...prev, createPanelist()]);
  };

  const handleRemovePanelist = (id: string) => {
    setPanelists((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePanelistChange = (id: string, updates: Partial<Panelist>) => {
    setPanelists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const toggleOption = (key: keyof SessionOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBeginSession = () => {
    setLaunching(true);

    const sessionPanelists = panelists.map((panelist, index) => ({
      name: panelist.name.trim() || `Panelist ${index + 1}`,
      role: panelist.role.trim() || "Panelist",
      strict: panelist.strict,
      inquisitive: panelist.inquisitive,
    }));

    window.localStorage.setItem("ss_scenario", selectedScenario ?? DEFAULT_SCENARIO);
    window.localStorage.setItem("ss_topic", topic.trim() || DEFAULT_TOPIC);
    window.localStorage.setItem("ss_panelists", JSON.stringify(sessionPanelists));

    setTimeout(() => {
      router.push("/session");
    }, 1800);
  };

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-clip">
      <DashboardHeader currentStep={step} />
      <StepTabs currentStep={step} onStepClick={goToStep} />

      {step === 1 && (
        <StepScenario
          selectedScenario={selectedScenario}
          topic={topic}
          onSelectScenario={setSelectedScenario}
          onTopicChange={setTopic}
          onNext={() => goToStep(2)}
        />
      )}

      {step === 2 && (
        <StepPanelists
          panelists={panelists}
          maxPanelists={MAX_PANELISTS}
          onAdd={handleAddPanelist}
          onRemove={handleRemovePanelist}
          onChange={handlePanelistChange}
          onBack={() => goToStep(1)}
          onNext={() => goToStep(3)}
        />
      )}

      {step === 3 && (
        <StepReady
          selectedScenario={selectedScenario}
          topic={topic}
          panelists={panelists}
          options={options}
          launching={launching}
          onToggleOption={toggleOption}
          onEditScenario={() => goToStep(1)}
          onEditPanelists={() => goToStep(2)}
          onBack={() => goToStep(2)}
          onBegin={handleBeginSession}
        />
      )}
    </div>
  );
}

export default NewSessionWizard;
