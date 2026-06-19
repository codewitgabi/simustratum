import type { Metadata } from "next";
import ReplayRoom from "../_components/ReplayRoom";

export const metadata: Metadata = {
  title: "Session Replay — Simustratum",
  description: "Watch back a completed AI panel session, turn by turn.",
};

async function ReplayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen overflow-hidden font-inter">
      <ReplayRoom sessionId={id} />
    </div>
  );
}

export default ReplayPage;
