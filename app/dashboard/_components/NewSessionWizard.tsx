"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SCENARIO_API_VALUES, type ScenarioId } from "@/lib/dashboard-data";
import type { SessionUser } from "@/lib/auth";
import { createId } from "@/lib/dashboard-utils";
import { DEFAULT_SCENARIO, DEFAULT_TOPIC } from "@/lib/session-data";
import DashboardHeader from "./DashboardHeader";
import StepPanelists from "./StepPanelists";
import StepReady, { type SessionOptions } from "./StepReady";
import StepScenario, { type DocumentStatus } from "./StepScenario";
import StepTabs from "./StepTabs";
import type { Panelist } from "./PanelistCard";

const MAX_PANELISTS_FREE = 1;
const MAX_PANELISTS_PRO = 3;

function createPanelist(): Panelist {
  return {
    id: createId("panelist"),
    name: "",
    role: "",
    strict: 50,
    inquisitive: 50,
  };
}

type NewSessionWizardProps = {
  user: SessionUser | null;
};

function NewSessionWizard({ user }: NewSessionWizardProps) {
  const router = useRouter();
  const isPro = user?.plan === "pro";
  const maxPanelists = isPro ? MAX_PANELISTS_PRO : MAX_PANELISTS_FREE;
  const [step, setStep] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(
    null,
  );
  const [topic, setTopic] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>("idle");
  const [documentError, setDocumentError] = useState<string | null>(null);
  const activeUploadRef = useRef<File | null>(null);
  const [panelists, setPanelists] = useState<Panelist[]>([createPanelist()]);
  const [options, setOptions] = useState<SessionOptions>({
    feedback: true,
    timer: false,
    transcript: true,
  });
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);

  const goToStep = useCallback(
    (n: number) => {
      if (n >= 2 && (!selectedScenario || !topic.trim())) return;
      if (n >= 3 && !panelists[0]?.name.trim()) return;
      setStep(n);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [selectedScenario, topic, panelists],
  );

  const handleAddPanelist = () => {
    if (panelists.length >= maxPanelists) return;
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

  const handleDocumentChange = useCallback(
    async (file: File | null) => {
      activeUploadRef.current = file;
      setDocument(file);
      setDocumentId(null);
      setDocumentError(null);

      if (!file) {
        setDocumentStatus("idle");
        return;
      }

      setDocumentStatus("uploading");

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/v1/documents", { method: "POST", body: formData });
        const data = await res.json();

        if (activeUploadRef.current !== file) return;

        if (data.logged_out) {
          router.push("/login");
          return;
        }

        if (!res.ok || !data.success) {
          setDocumentStatus("failed");
          setDocumentError(data.message ?? "Couldn't upload the document.");
          return;
        }

        if (data.data.status === "failed") {
          setDocumentStatus("failed");
          setDocumentError(data.data.error_message ?? "Document processing failed.");
          return;
        }

        setDocumentId(data.data.id);
        setDocumentStatus("ready");
      } catch {
        if (activeUploadRef.current !== file) return;
        setDocumentStatus("failed");
        setDocumentError("Couldn't reach the server. Try again.");
      }
    },
    [router],
  );

  const handleBeginSession = async () => {
    if (!selectedScenario || !topic.trim() || !panelists[0]?.name.trim()) {
      setLaunchError("Please fill in the topic and at least one panelist name.");
      return;
    }

    if (document && documentStatus === "uploading") {
      setLaunchError("Please wait for the document to finish uploading, or remove it.");
      return;
    }

    setLaunching(true);
    setLaunchError(null);

    const sessionPanelists = panelists.map((panelist, index) => ({
      name: panelist.name.trim() || `Panelist ${index + 1}`,
      role: panelist.role.trim() || "Panelist",
      strictness: panelist.strict,
      inquisitiveness: panelist.inquisitive,
    }));

    try {
      const res = await fetch("/api/v1/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: SCENARIO_API_VALUES[selectedScenario],
          topic: topic.trim(),
          document_id: documentId,
          panelists: sessionPanelists,
          real_time_feedback: options.feedback,
          answer_timer: options.timer,
          save_transcript: options.transcript,
        }),
      });

      const data = await res.json();

      if (data.logged_out) {
        router.push("/login");
        return;
      }

      if (!res.ok || !data.success) {
        setLaunchError(data.message ?? "Couldn't create the session. Try again.");
        setLaunching(false);
        return;
      }

      const createdPanelists = (data.data.panelists ?? []).map(
        (panelist: { id: string; name: string; role: string; strictness: number; inquisitiveness: number }) => ({
          id: panelist.id,
          name: panelist.name,
          role: panelist.role,
          strict: panelist.strictness,
          inquisitive: panelist.inquisitiveness,
        }),
      );

      window.localStorage.setItem("ss_session_id", data.data.id);
      window.localStorage.setItem("ss_scenario", selectedScenario ?? DEFAULT_SCENARIO);
      window.localStorage.setItem("ss_topic", topic.trim() || DEFAULT_TOPIC);
      window.localStorage.setItem("ss_panelists", JSON.stringify(createdPanelists));
      if (document) {
        window.localStorage.setItem("ss_document_name", document.name);
      } else {
        window.localStorage.removeItem("ss_document_name");
      }

      router.push("/session");
    } catch {
      setLaunchError("Couldn't reach the server. Check your connection and try again.");
      setLaunching(false);
    }
  };

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-clip">
      <DashboardHeader currentStep={step} user={user} />
      <StepTabs currentStep={step} onStepClick={goToStep} />

      {step === 1 && (
        <StepScenario
          selectedScenario={selectedScenario}
          topic={topic}
          document={document}
          documentStatus={documentStatus}
          documentError={documentError}
          isPro={isPro}
          onSelectScenario={setSelectedScenario}
          onTopicChange={setTopic}
          onDocumentChange={handleDocumentChange}
          onNext={() => goToStep(2)}
        />
      )}

      {step === 2 && (
        <StepPanelists
          panelists={panelists}
          maxPanelists={maxPanelists}
          isPro={isPro}
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
          document={document}
          panelists={panelists}
          options={options}
          launching={launching}
          launchError={launchError}
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
