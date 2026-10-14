"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { whatsappUrl } from "@/config/site";
import { track } from "@/lib/analytics";
import { formatNumber } from "@/lib/format";
import {
  activeFilterCount,
  applyFilters,
  EMPTY_FILTERS,
  facetOptions,
  parseFilters,
  serializeFilters,
  SORT_OPTIONS,
  type Filters,
  type SortKey,
} from "@/lib/vehicles/filters";
import type { Vehicle } from "@/lib/vehicles/schema";
import { Alert, Close, Search, Sliders, WhatsApp } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { VehicleCard } from "./VehicleCard";

const PAGE = 12;
const PRICE_STEPS = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000];
const KM_STEPS = [10000, 30000, 50000, 75000, 100000, 150000];

export function Catalog({ vehicles, ok }: { vehicles: Vehicle[]; ok: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const [query, setQuery] = useState(filters.q);
  const [visible, setVisible] = useState(PAGE);
  const [panelOpen, setPanelOpen] = useState(false);
  const facets = useMemo(() => facetOptions(vehicles), [vehicles]);
  const results = useMemo(() => applyFilters(vehicles, filters), [vehicles, filters]);
  const active = activeFilterCount(filters);
  const ids = useId();
  const trackTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    const qs = serializeFilters(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setVisible(PAGE);
    clearTimeout(trackTimer.current);
    trackTimer.current = setTimeout(() => track("catalog_filter", { filters: qs || "nessuno", results: applyFilters(vehicles, next).length }), 800);
  };

  // Ricerca testuale con debounce
  useEffect(() => {
    if (query.trim() === filters.q) return;
    const t = setTimeout(() => update({ q: query.trim() }), 280);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Sincronizza il campo quando il filtro cambia dall'esterno (chip, "rimuovi filtri", navigazione)
  useEffect(() => {
    setQuery((q) => (q.trim() === filters.q ? q : filters.q));
  }, [filters.q]);
  useEffect(() => () => clearTimeout(trackTimer.current), []);

  if (!ok) {
    return (
      <div role="alert" className="mx-auto max-w-xl rounded-2xl border border-line bg-graphite/60 p-10 text-center">
        <Alert size={28} className="mx-auto text-danger" />
        <h2 className="mt-5 font-display text-2xl">Catalogo momentaneamente non disponibile</h2>
        <p className="mt-3 text-sm text-silver">Non siamo riusciti a caricare l&apos;inventario. Riprova tra poco oppure contattaci direttamente.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => router.refresh()}>
            Riprova
          </button>
          <Link href="/contatti/" className="btn btn-ghost btn-sm">
            Contattaci
          </Link>
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) return <InventoryEmpty />;

  const chips: { label: string; clear: Partial<Filters> }[] = [
    filters.q && { label: `“${filters.q}”`, clear: { q: "" } },
    filters.make && { label: filters.make, clear: { make: "" } },
    filters.fuel && { label: filters.fuel, clear: { fuel: "" } },
    filters.transmission && { label: filters.transmission, clear: { transmission: "" } },
    filters.body && { label: filters.body, clear: { body: "" } },
    filters.priceMin !== undefined && { label: `Da € ${formatNumber(filters.priceMin)}`, clear: { priceMin: undefined } },
    filters.priceMax !== undefined && { label: `Fino a € ${formatNumber(filters.priceMax)}`, clear: { priceMax: undefined } },
    filters.yearMin !== undefined && { label: `Dal ${filters.yearMin}`, clear: { yearMin: undefined } },
    filters.kmMax !== undefined && { label: `Max ${formatNumber(filters.kmMax)} km`, clear: { kmMax: undefined } },
  ].filter(Boolean) as { label: string; clear: Partial<Filters> }[];

  const select = (
    scope: string,
    id: string,
    label: string,
    value: string,
    options: { value: string; label: string }[],
    onChange: (v: string) => void,
    allLabel = "Tutte",
  ) => (
    <div>
      <label htmlFor={`${ids}-${scope}-${id}`} className="eyebrow mb-2 block text-[0.62rem]">
        {label}
      </label>
      <select id={`${ids}-${scope}-${id}`} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  const asOpts = (xs: (string | number)[]) => xs.map((x) => ({ value: String(x), label: String(x) }));
  const toNum = (v: string) => (v === "" ? undefined : Number(v));

  // Renderizzato due volte (sidebar desktop e pannello mobile): id distinti per scope
  const filterFields = (scope: "d" | "m") => (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
      {facets.makes.length > 1 && select(scope, "marca", "Marca", filters.make, asOpts(facets.makes), (v) => update({ make: v }))}
      {facets.hasPrice && (
        <>
          {select(scope, "pmin",
            "Prezzo minimo",
            filters.priceMin?.toString() ?? "",
            PRICE_STEPS.map((p) => ({ value: String(p), label: `€ ${formatNumber(p)}` })),
            (v) => update({ priceMin: toNum(v) }),
            "Qualsiasi",
          )}
          {select(scope, "pmax",
            "Prezzo massimo",
            filters.priceMax?.toString() ?? "",
            PRICE_STEPS.map((p) => ({ value: String(p), label: `€ ${formatNumber(p)}` })),
            (v) => update({ priceMax: toNum(v) }),
            "Qualsiasi",
          )}
        </>
      )}
      {facets.years.length > 1 &&
        select(scope, "anno", "Anno dal", filters.yearMin?.toString() ?? "", asOpts(facets.years), (v) => update({ yearMin: toNum(v) }), "Qualsiasi")}
      {facets.hasKm &&
        select(scope, "km",
          "Chilometri massimi",
          filters.kmMax?.toString() ?? "",
          KM_STEPS.map((k) => ({ value: String(k), label: `${formatNumber(k)} km` })),
          (v) => update({ kmMax: toNum(v) }),
          "Qualsiasi",
        )}
      {facets.fuels.length > 1 && select(scope, "fuel", "Alimentazione", filters.fuel, asOpts(facets.fuels), (v) => update({ fuel: v }))}
      {facets.transmissions.length > 1 &&
        select(scope, "cambio", "Cambio", filters.transmission, asOpts(facets.transmissions), (v) => update({ transmission: v }))}
      {facets.bodies.length > 1 && select(scope, "body", "Categoria", filters.body, asOpts(facets.bodies), (v) => update({ body: v }))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[17rem_1fr] lg:gap-14">
      {/* Filtri — desktop */}
      <aside aria-label="Filtri del catalogo" className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+1.5rem)] space-y-8">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Filtri</p>
            {active > 0 && (
              <button type="button" className="text-xs text-ion hover:underline" onClick={() => update({ ...EMPTY_FILTERS, sort: filters.sort })}>
                Rimuovi tutti
              </button>
            )}
          </div>
          {filterFields("d")}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Barra strumenti */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="relative flex-1">
            <label htmlFor={`${ids}-q`} className="sr-only">
              Cerca per marca o modello
            </label>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-silver" />
            <input
              id={`${ids}-q`}
              type="search"
              inputMode="search"
              autoComplete="off"
              placeholder="Cerca marca o modello"
              className="field pl-11"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-ghost btn-sm min-h-[3.25rem] flex-1 lg:hidden"
              aria-expanded={panelOpen}
              aria-controls={`${ids}-panel`}
              onClick={() => setPanelOpen((o) => !o)}
            >
              <Sliders size={16} /> Filtri{active > 0 && <span className="tabular text-ion">({active})</span>}
            </button>
            <div className="flex-1 sm:w-56 sm:flex-none">
              <label htmlFor={`${ids}-sort`} className="sr-only">
                Ordina per
              </label>
              <select
                id={`${ids}-sort`}
                className="field"
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as SortKey })}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filtri — mobile */}
        <div id={`${ids}-panel`} hidden={!panelOpen} className="mt-4 rounded-2xl border border-line bg-graphite/70 p-5 lg:hidden">
          {filterFields("m")}
          <div className="mt-6 flex gap-3">
            <button type="button" className="btn btn-primary btn-sm flex-1" onClick={() => setPanelOpen(false)}>
              Mostra {results.length} risultati
            </button>
            {active > 0 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ ...EMPTY_FILTERS, sort: filters.sort })}>
                Azzera
              </button>
            )}
          </div>
        </div>

        {/* Stato filtri */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-line pb-6">
          <p aria-live="polite" className="mr-3 text-sm text-silver">
            <span className="font-display text-xl text-ice tabular">{results.length}</span>{" "}
            {results.length === 1 ? "vettura" : "vetture"}
            {active > 0 && ` su ${vehicles.length}`}
          </p>
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => update(c.clear)}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-xs transition-colors hover:border-ion hover:text-ion"
              aria-label={`Rimuovi filtro ${c.label}`}
            >
              {c.label} <Close size={12} />
            </button>
          ))}
          {chips.length > 1 && (
            <button type="button" className="text-xs text-silver underline-offset-4 hover:text-ice hover:underline" onClick={() => update({ ...EMPTY_FILTERS, sort: filters.sort })}>
              Rimuovi filtri
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="font-display text-2xl">Nessuna vettura corrisponde ai filtri</h2>
            <p className="mt-3 text-sm text-silver">Modifica i criteri oppure raccontaci cosa cerchi: ti aggiorneremo noi.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => update(EMPTY_FILTERS)}>
                Rimuovi filtri
              </button>
              <TrackedLink
                href={whatsappUrl(`Buongiorno, sto cercando un'auto${filters.q ? `: ${filters.q}` : ""}. Potete aiutarmi?`)}
                event="whatsapp_click"
                eventParams={{ location: "catalog_no_results" }}
                className="btn btn-ghost btn-sm"
              >
                <WhatsApp size={16} /> Chiedi su WhatsApp
              </TrackedLink>
            </div>
          </div>
        ) : (
          <>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.slice(0, visible).map((v, i) => (
                <li key={v.id}>
                  <VehicleCard vehicle={v} priority={i < 3} delay={(i % 3) * 90} />
                </li>
              ))}
            </ul>
            {visible < results.length && (
              <div className="mt-12 flex flex-col items-center gap-3">
                <p className="text-xs text-silver tabular">
                  {visible} di {results.length}
                </p>
                <button type="button" className="btn btn-ghost" onClick={() => setVisible((n) => n + PAGE)}>
                  Carica altre vetture
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function InventoryEmpty() {
  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] border border-line bg-graphite/50 px-6 py-14 text-center sm:px-14">
      <span aria-hidden className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-ion/70 to-transparent" />
      <p className="eyebrow">Stock in aggiornamento</p>
      <h2 className="mt-5 font-display text-3xl tracking-tight sm:text-4xl text-balance">
        Le vetture disponibili vengono pubblicate a breve.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-silver">
        Nel frattempo raccontaci che auto stai cercando: ti mostriamo in sede o in chat le vetture disponibili in questo momento.
      </p>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <TrackedLink
          href={whatsappUrl("Buongiorno Alfano Cars, vorrei sapere quali auto avete disponibili. Cerco: ")}
          event="whatsapp_click"
          eventParams={{ location: "inventory_empty" }}
          className="btn btn-primary"
        >
          <WhatsApp size={18} /> Chiedi le disponibilità
        </TrackedLink>
        <Link href="/contatti/" className="btn btn-ghost">
          Richiedi informazioni
        </Link>
      </div>
    </div>
  );
}
