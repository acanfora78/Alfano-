/** Transizione morbida a ogni cambio pagina (solo opacità, nessun blocco). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
