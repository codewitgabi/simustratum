import type { Metadata } from "next";
import PlansClient from "./_components/PlansClient";

export const metadata: Metadata = {
  title: "Choose your plan · Simustratum",
  robots: { index: false },
};

export default function PlansPage() {
  return <PlansClient />;
}
