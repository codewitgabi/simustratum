import type { ReactNode } from "react";

type StaticSectionProps = {
  title: string;
  children: ReactNode;
};

function StaticSection({ title, children }: StaticSectionProps) {
  return (
    <section>
      <h2 className="mb-3 font-grotesk text-[1.3rem] font-bold tracking-[-0.3px] text-ink">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-[0.95rem] leading-[1.75] text-mid">{children}</div>
    </section>
  );
}

export default StaticSection;
