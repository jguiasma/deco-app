import type { ReactNode } from "react";

type PageProps = { title: string; subtitle: string; children: ReactNode; variant?: string };

export function Page({ title, subtitle, children, variant = "" }: PageProps) {
  return <main className={`bwd-page ${variant}`}><div className="bwd-container"><header className="bwd-page-heading"><p className="bwd-eyebrow">Ben Wada Déco</p><h1>{title}</h1><p>{subtitle}</p></header>{children}</div></main>;
}
