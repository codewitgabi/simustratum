import type { Metadata } from "next";
import SessionRoom from "./_components/SessionRoom";

export const metadata: Metadata = {
  title: "Session",
  description: "Live AI panel session — speak, listen, and respond in a simulated panel room.",
  robots: { index: false, follow: false },
};

function SessionPage() {
  return (
    <div className="h-screen w-screen overflow-hidden font-inter">
      <SessionRoom />
    </div>
  );
}

export default SessionPage;
