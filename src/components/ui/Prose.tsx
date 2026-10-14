import type { ReactNode } from "react";

/** Tipografia per pagine testuali (legali, approfondimenti). */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl text-base leading-relaxed text-ice/80 [&_a]:text-ice [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:tracking-tight [&_h2]:text-ice [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-ice [&_li]:mt-2 [&_p]:mt-4 [&_strong]:text-ice [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
      {children}
    </div>
  );
}
