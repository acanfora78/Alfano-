import { PageWipe } from "@/components/motion/PageWipe";

/** Transizione tra pagine: tendina cinematografica + ingresso morbido dei contenuti. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageWipe />
      <div className="page-enter">{children}</div>
    </>
  );
}
