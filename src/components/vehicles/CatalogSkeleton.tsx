/** Stato di caricamento del catalogo (skeleton). */
export function CatalogSkeleton({ inline = false }: { inline?: boolean }) {
  return (
    <div className={inline ? "" : "container-x pb-20 pt-[calc(var(--header-h)+4rem)]"} role="status" aria-label="Caricamento delle vetture">
      <div className="h-14 animate-pulse rounded-xl bg-graphite motion-reduce:animate-none" />
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="overflow-hidden rounded-[1.25rem] border border-line">
            <div className="aspect-[4/3] animate-pulse bg-titanium/60 motion-reduce:animate-none" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-16 rounded bg-titanium" />
              <div className="h-6 w-2/3 rounded bg-titanium" />
              <div className="h-3 w-1/2 rounded bg-titanium/70" />
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only">Caricamento in corso…</span>
    </div>
  );
}
