import type { Metadata } from "next";
import Link from "next/link";
import StaticPageLayout from "../_components/StaticPageLayout";

export const metadata: Metadata = {
  title: "Blog — Simustratum",
  description: "Notes on academic speaking practice, coming soon from Simustratum.",
};

function BlogPage() {
  return (
    <StaticPageLayout
      tag="Blog"
      title="Coming soon"
      intro="We're writing about defense prep, presentation anxiety, and what we learn from thousands of practice sessions. Nothing published yet — check back soon."
    >
      <p className="text-[0.85rem] text-mid">
        In the meantime, try{" "}
        <Link href="/getting-started" className="font-bold text-sienna underline underline-offset-2">
          Getting started
        </Link>{" "}
        or head back to the{" "}
        <Link href="/" className="font-bold text-sienna underline underline-offset-2">
          homepage
        </Link>
        .
      </p>
    </StaticPageLayout>
  );
}

export default BlogPage;
