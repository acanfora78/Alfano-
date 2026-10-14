/**
 * Servizi effettivamente presentati sul sito ufficiale precedente.
 * Non aggiungere servizi (es. finanziamenti, garanzie, permute) finché
 * non sono confermati dalla concessionaria.
 */
export type Service = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  summary: string;
  details: string[];
  image: { src: string; alt: string };
  href?: string;
};

export const services: Service[] = [
  {
    slug: "vendita",
    index: "01",
    kicker: "Vendita",
    title: "Vendita auto",
    summary:
      "Un team che ti accompagna nella scelta del veicolo più adatto alle tue esigenze personali ed economiche, con un rapporto qualità-prezzo trasparente.",
    details: ["Consulenza nella scelta del veicolo", "Visione della vettura in sede", "Richiesta informazioni e preventivo"],
    image: { src: "/images/details/key-handover.jpg", alt: "Consegna delle chiavi di un'Alfa Romeo nella sede Alfano Cars" },
    href: "/stock-auto/",
  },
  {
    slug: "noleggio",
    index: "02",
    kicker: "Noleggio",
    title: "Noleggio a breve e lungo termine",
    summary:
      "Dalla city car all'auto di prestigio: poche ore, un weekend o un periodo prolungato, con un piano di noleggio personalizzato.",
    details: ["Breve termine: ore, giorni, weekend", "Lungo termine per lavoro o trasferte", "Piano personalizzato sulle tue esigenze"],
    image: { src: "/images/showroom/rental-sign.jpg", alt: "Cartello Noleggio sul tetto di una vettura Alfano Cars" },
    href: "/noleggio-auto-breve-lungo-termine-pompei/",
  },
  {
    slug: "conducente",
    index: "03",
    kicker: "Con conducente",
    title: "Noleggio con conducente",
    summary: "Un servizio su richiesta, giornaliero, settimanale o mensile. Contattaci per tipologie di servizio e tariffe.",
    details: ["Giornaliero, settimanale, mensile", "Tariffe su richiesta"],
    image: { src: "/images/services/limousine.jpg", alt: "Limousine bianca per il servizio con conducente" },
  },
  {
    slug: "cerimonie",
    index: "04",
    kicker: "Eventi",
    title: "Auto per matrimoni ed eventi",
    summary: "Vetture dedicate ai giorni speciali: matrimoni, cerimonie ed eventi, con la cura che il momento merita.",
    details: ["Auto per matrimoni", "Cerimonie ed eventi"],
    image: { src: "/images/services/wedding.jpg", alt: "Sposi accanto a un'auto per matrimoni Alfano Cars" },
  },
  {
    slug: "furgoni",
    index: "05",
    kicker: "Furgoni",
    title: "Noleggio furgoni",
    summary: "Furgoni a noleggio con formule mensili, settimanali, giornaliere o a ore, con la stessa serietà di sempre.",
    details: ["Mensile, settimanale, giornaliero", "Anche a ore"],
    image: { src: "/images/showroom/forecourt.jpg", alt: "Piazzale della sede Alfano Cars a Pompei" },
  },
  {
    slug: "mobilita",
    index: "06",
    kicker: "Due ruote",
    title: "Motocicli, e-bike e quad",
    summary: "Vendita e noleggio di motocicli, e-bike e quad: tutto per la mobilità cittadina e il tempo libero.",
    details: ["Motocicli", "E-bike", "Quad"],
    image: { src: "/images/services/moto-ebike.jpg", alt: "Pannello Alfano Cars dedicato a motocicli, e-bike e quad" },
  },
  {
    slug: "barca",
    index: "07",
    kicker: "Mare",
    title: "Tour in barca e imbarcazioni senza patente",
    summary: "Noleggio di imbarcazioni senza patente e prenotazione di tour in barca nel Golfo di Napoli.",
    details: ["Imbarcazioni senza patente", "Tour nel Golfo di Napoli"],
    image: { src: "/images/services/boat-2.jpg", alt: "Imbarcazioni ormeggiate in porto" },
    href: "/tour-barca-noleggio-imbarcazioni-pompei/",
  },
];
