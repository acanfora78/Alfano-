"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="eyebrow text-danger">Errore</p>
      <h1 className="headline-lg mt-6 max-w-[14ch] text-balance">Qualcosa non ha funzionato.</h1>
      <p className="mt-6 max-w-md text-silver">Si è verificato un problema temporaneo. Riprova oppure contattaci direttamente.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          Riprova
        </button>
        <Link href="/contatti/" className="btn btn-ghost">
          Contatti
        </Link>
      </div>
    </section>
  );
}
