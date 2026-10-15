/**
 * Fotografie reali di Alfano Cars (fornite dalla concessionaria).
 * Unica fonte di immagini del sito: nessuna foto di repertorio.
 * Le vetture con il cartello "Noleggio" fanno parte della flotta a noleggio:
 * queste foto illustrano la sede e i servizi, NON indicano disponibilità in vendita
 * (lo stock in vendita è solo quello del catalogo).
 */
export type Photo = { src: string; ambient: string; alt: string; w: number; h: number; label: string; make: string; model: string };

const p = (name: string, alt: string, make: string, model: string, label: string, h = 1560): Photo => ({
  src: `/images/alfano/${name}.jpg`,
  ambient: `/images/alfano/${name}-ambient.jpg`,
  alt,
  w: 1179,
  h,
  label,
  make,
  model,
});

export const photos = {
  urus: p("urus-showroom", "Lamborghini Urus nera addobbata per un matrimonio nello showroom Alfano Cars", "Lamborghini", "Urus", "Showroom", 1560),
  g63: p("g63-showroom", "Mercedes-AMG G 63 grigio opaco nello showroom Alfano Cars", "Mercedes-AMG", "G 63", "Showroom", 1564),
  grecale: p("grecale-noleggio", "Maserati Grecale blu con cartello Noleggio nello showroom", "Maserati", "Grecale", "Noleggio", 1552),
  cayenne: p("cayenne-showroom", "Porsche Cayenne grigia sotto le luci esagonali dello showroom", "Porsche", "Cayenne", "Showroom", 1558),
  q3Grigia: p("q3-sportback-grigia", "Audi Q3 Sportback grigia con cartello Noleggio nello showroom", "Audi", "Q3 Sportback", "Noleggio", 1552),
  tRoc: p("t-roc-noleggio", "Volkswagen T-Roc bianca con cartello Noleggio nello showroom", "Volkswagen", "T-Roc", "Noleggio", 1576),
  tmax: p("tmax-showroom", "Scooter Yamaha TMAX nello showroom Alfano Cars", "Yamaha", "TMAX", "Due ruote", 1418),
  q3Bianca: p("q3-sportback-bianca", "Audi Q3 Sportback bianca con cartello Noleggio nello showroom", "Audi", "Q3 Sportback", "Noleggio", 1563),
  rs3: p("rs3-noleggio", "Audi RS 3 nera con cartello Noleggio nello showroom", "Audi", "RS 3", "Noleggio", 1564),
  ghibli: p("ghibli-noleggio", "Maserati Ghibli bianca con cartello Noleggio nello showroom", "Maserati", "Ghibli", "Noleggio", 1557),
  rsq3Sede: p("rsq3-sede", "Audi RS Q3 bianca davanti alla sede Alfano Cars", "Audi", "RS Q3", "La sede", 1558),
  gleSede: p("gle-coupe-sede", "Mercedes GLE Coupé davanti alla sede Alfano Cars con l'insegna Vendita Auto e Noleggio", "Mercedes-Benz", "GLE Coupé", "La sede", 1564),
  sposi: p("sposi-q8", "Sposi accanto a un'Audi nera addobbata per il matrimonio", "Audi", "Q8", "Cerimonie", 1564),
  q8Cerimonia: p("q8-cerimonia-sede", "Audi nera addobbata per una cerimonia davanti alla sede Alfano Cars", "Audi", "Q8", "Cerimonie", 1567),
  smart: p("smart-cabrio-showroom", "smart fortwo cabrio bronzo nello showroom con i totem luminosi Alfano Cars", "smart", "fortwo cabrio", "Showroom", 1564),
} satisfies Record<string, Photo>;

export const allPhotos = Object.values(photos);
