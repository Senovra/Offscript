import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}

/** Shared header for the inner pages: utility label, editorial title, optional intro. */
export default function PageHeader({ eyebrow, title, intro, children }: PageHeaderProps) {
  return (
    <header className="page-gutter pb-14 pt-[calc(var(--header-h)+4rem)] md:pb-24 md:pt-[calc(var(--header-h)+7rem)]">
      <p className="type-mono text-ash">{eyebrow}</p>
      <h1 className="type-editorial mt-5 text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02] tracking-[-0.04em]">
        {title}
      </h1>
      {intro && <p className="type-body mt-6 text-fog">{intro}</p>}
      {children}
    </header>
  );
}