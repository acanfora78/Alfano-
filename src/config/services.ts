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
    image: { src: "/images/alfano/gle-coupe-sede.jpg", alt: "Mercedes GLE Coupé davanti alla sede Alfano Cars con l'insegna Vendita Auto nuovo e usato" },
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
    image: { src: "/images/alfano/q3-sportback-bianca.jpg", alt: "Audi Q3 Sportback bianca con cartello Noleggio nello showroom" },
    href: "/noleggio-auto-breve-lungo-termine-pompei/",
  },
  {
    slug: "conducente",
    index: "03",
    kicker: "Con conducente",
    title: "Noleggio con conducente",
    summary: "Un servizio su richiesta, giornaliero, settimanale o mensile. Contattaci per tipologie di servizio e tariffe.",
    details: ["Giornaliero, settimanale, mensile", "Tariffe su richiesta"],
    image: { src: "/images/alfano/ghibli-noleggio.jpg", alt: "Maserati Ghibli bianca nello showroom Alfano Cars" },
  },
  {
    slug: "cerimonie",
    index: "04",
    kicker: "Eventi",
    title: "Auto per matrimoni ed eventi",
    summary: "Vetture dedicate ai giorni speciali: matrimoni, cerimonie ed eventi, con la cura che il momento merita.",
    details: ["Auto per matrimoni", "Cerimonie ed eventi"],
    image: { src: "/images/alfano/sposi-q8.jpg", alt: "Sposi accanto a un'Audi nera addobbata per il matrimonio" },
  },
  {
    slug: "furgoni",
    index: "05",
    kicker: "Furgoni",
    title: "Noleggio furgoni",
    summary: "Furgoni a noleggio con formule mensili, settimanali, giornaliere o a ore, con la stessa serietà di sempre.",
    details: ["Mensile, settimanale, giornaliero", "Anche a ore"],
    image: { src: "/images/alfano/rsq3-sede.jpg", alt: "Sede Alfano Cars con l'insegna dei noleggi: auto, furgoni, moto, barche, bike" },
  },
  {
    slug: "mobilita",
    index: "06",
    kicker: "Due ruote",
    title: "Motocicli, e-bike e quad",
    summary: "Vendita e noleggio di motocicli, e-bike e quad: tutto per la mobilità cittadina e il tempo libero.",
    details: ["Motocicli", "E-bike", "Quad"],
    image: { src: "/images/alfano/tmax-showroom.jpg", alt: "Scooter Yamaha TMAX nello showroom Alfano Cars" },
  },
  {
    slug: "barca",
    index: "07",
    kicker: "Mare",
    title: "Tour in barca e imbarcazioni senza patente",
    summary: "Noleggio di imbarcazioni senza patente e prenotazione di tour in barca nel Golfo di Napoli.",
    details: ["Imbarcazioni senza patente", "Tour nel Golfo di Napoli"],
    image: { src: "/images/alfano/q8-cerimonia-sede.jpg", alt: "Sede Alfano Cars: l'insegna elenca anche il noleggio di barche" },
    href: "/tour-barca-noleggio-imbarcazioni-pompei/",
  },
];
