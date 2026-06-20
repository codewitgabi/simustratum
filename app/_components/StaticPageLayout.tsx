import type { ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

type StaticPageLayoutProps = {
  tag: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

function StaticPageLayout({ tag, title, intro, children }: StaticPageLayoutProps) {
  return (
    <>
      <Nav />
      <main className="bg-cream px-5 pt-[120px] pb-20 sm:px-8 sm:pt-[140px] min-[1101px]:px-[60px]">
        <div className="mx-auto max-w-[760px]">
          <span className="mb-5 inline-block border-2 border-ink bg-pale px-3 py-1 font-grotesk text-[0.68rem] font-bold tracking-[0.12em] text-sienna uppercase">
            {tag}
          </span>
          <h1 className="mb-6 font-grotesk text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-bold tracking-[-1px] text-ink">
            {title}
          </h1>
          {intro && (
            <p className="mb-12 max-w-[620px] text-[1.05rem] leading-[1.75] text-mid">{intro}</p>
          )}
          <div className="flex flex-col gap-10">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default StaticPageLayout;
