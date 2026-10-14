import Link from "next/link";
import type { ReactNode } from "react";

/** Titolo di sezione editoriale con indice, eyebrow e righe mascherate. */
export function SectionHeading({
  index,
  eyebrow,
  lines,
  as: Tag = "h2",
  size = "lg",
  id,
  children,
  className = "",
}: {
  index?: string;
  eyebrow?: string;
  lines: string[];
  as?: "h1" | "h2";
  size?: "lg" | "md";
  id?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div data-reveal="fade" className={className}>
      {(index || eyebrow) && (
        <p className="eyebrow mb-6 flex items-center gap-4">
          {index && <span className="tabular text-ion">{index}</span>}
          {index && <span aria-hidden className="h-px w-10 bg-line-strong" />}
          {eyebrow}
        </p>
      )}
      <Tag id={id} className={`${size === "lg" ? "headline-lg" : "headline-md"} text-balance`}>
        {lines.map((l, i) => (
          <span key={i} className="line-mask">
            <span style={{ ["--line-delay" as string]: `${i * 110}ms` }}>{l}</span>
          </span>
        ))}
      </Tag>
      {children}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Percorso" className="text-xs text-silver">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-titanium">/</span>}
            {it.href ? (
              <Link href={it.href} className="link-line hover:text-ice">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ice/80">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON serializzato lato server; "<" escapato per sicurezza
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
