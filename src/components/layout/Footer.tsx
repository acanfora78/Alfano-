import Link from "next/link";
import { business, fullAddress, mapsDirectionsUrl, nav, telUrl, whatsappUrl } from "@/config/site";
import { ArrowUpRight, WhatsApp } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";
import { PointerFxToggle } from "@/components/motion/CursorFollower";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-obsidian">
      <div className="container-x grid gap-14 py-20 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-silver">
            Vendita e noleggio auto a Pompei. Un nuovo concept per auto, motocicli, e-bike e imbarcazioni.
          </p>
          <TrackedLink
            href={whatsappUrl("Buongiorno Alfano Cars, vorrei ricevere informazioni.")}
            event="whatsapp_click"
            eventParams={{ location: "footer" }}
            className="btn btn-ghost btn-sm mt-8"
          >
            <WhatsApp size={16} /> WhatsApp
          </TrackedLink>
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow mb-5">Esplora</h2>
          <ul className="space-y-3 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-line text-ice/85 hover:text-ice">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/noleggio-auto-breve-lungo-termine-pompei/" className="link-line text-ice/85 hover:text-ice">
                Noleggio auto
              </Link>
            </li>
            <li>
              <Link href="/tour-barca-noleggio-imbarcazioni-pompei/" className="link-line text-ice/85 hover:text-ice">
                Tour in barca
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow mb-5">Contatti</h2>
          <address className="space-y-3 text-sm not-italic text-ice/85">
            <p>
              <TrackedLink href={mapsDirectionsUrl} event="contact_click" eventParams={{ type: "directions", location: "footer" }} className="link-line hover:text-ice">
                {fullAddress} <ArrowUpRight size={12} className="inline" />
              </TrackedLink>
            </p>
            {business.phones.map((p) => (
              <p key={p.e164} className="tabular">
                <TrackedLink href={telUrl(p)} event="phone_click" eventParams={{ location: "footer" }} className="link-line hover:text-ice">
                  {p.display}
                </TrackedLink>
                <span className="text-silver"> · {p.label}</span>
              </p>
            ))}
            <p>
              <TrackedLink href={`mailto:${business.email}`} event="contact_click" eventParams={{ type: "email", location: "footer" }} className="link-line hover:text-ice">
                {business.email}
              </TrackedLink>
            </p>
            <p className="text-silver">PEC: {business.pec}</p>
          </address>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow mb-5">Orari</h2>
          <dl className="space-y-3 text-sm">
            {business.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-silver">{h.days}</dt>
                <dd className="text-right tabular text-ice/85">
                  {h.slots.map((s) => (
                    <span key={s} className="block">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-silver md:flex-row md:items-center md:justify-between">
          <p className="tabular">
            © {year} {business.legalName} — P.IVA {business.vatId}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy-policy/" className="link-line hover:text-ice">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy/" className="link-line hover:text-ice">
                Cookie policy
              </Link>
            </li>
            <CookiePreferencesButton />
            <PointerFxToggle />
          </ul>
        </div>
      </div>
    </footer>
  );
}
