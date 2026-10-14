import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata = { title: "Pagina non trovata", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="eyebrow tabular text-ion">404</p>
      <h1 className="headline-lg mt-6 max-w-[14ch] text-balance">Questa strada non porta da nessuna parte.</h1>
      <p className="mt-6 max-w-md text-silver">La pagina che cerchi non esiste o è stata spostata.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Torna alla home <ArrowRight size={16} className="btn-arrow" />
        </Link>
        <Link href="/stock-auto/" className="btn btn-ghost">
          Stock auto
        </Link>
      </div>
    </section>
  );
}
