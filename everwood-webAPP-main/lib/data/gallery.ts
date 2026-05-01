/**
 * Gallery gradient data — #1A2233 base · #8FA59A / #DCC7A3 accents. Depth = rgba(26,34,51,·) only
 * (slate #36465A removed from fills so the page does not read blanket blue-gray).
 */
const BG = "#F2EDE4";
const MUTED = "#8FA59A";
const WARM = "#B8955A";

export interface GalleryChamberPanel {
  id: string;
  index: number;
  title: string;
  category: string;
  century: string;
  origin: string;
  excerpt: string;
  gradient: string;
  accent: string;
}

export interface GalleryCascadePanel {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  body: string;
  gradient: string;
  accent: string;
}

export interface GalleryArtifact {
  id: string;
  title: string;
  category: string;
  century: string;
  origin: string;
  excerpt: string;
  gradient: string;
  accent: string;
  span?: "normal" | "wide" | "tall";
}

export const chamberPanels: GalleryChamberPanel[] = [
  {
    id: "ch1",
    index: 1,
    title: "The Andalusian Inheritance",
    category: "Furniture & Marquetry",
    century: "XV Century",
    origin: "Granada, Al-Andalus",
    excerpt:
      "When the gates of Granada closed in 1492, the craftsmen carried their geometry westward — to Fès, to Tétouan, to the workshops that would shape three centuries of Moroccan interiors.",
    gradient:
      `radial-gradient(ellipse 120% 80% at 18% 30%, rgba(220,199,163,0.09) 0%, transparent 45%), radial-gradient(ellipse at 75% 72%, ${BG} 0%, rgba(26,34,51,0.2) 38%, ${BG} 92%)`,
    accent: WARM,
  },
  {
    id: "ch2",
    index: 2,
    title: "The Ottoman Meridian",
    category: "Metalwork & Instruments",
    century: "XVII Century",
    origin: "Istanbul & Aleppo",
    excerpt:
      "Astrolabes, orreries, celestial globes — the Ottoman court transformed scientific instruments into objects of such refinement that knowledge itself became beautiful.",
    gradient:
      `radial-gradient(ellipse 90% 70% at 85% 20%, rgba(220,199,163,0.08) 0%, transparent 50%), radial-gradient(ellipse at 40% 55%, ${BG} 0%, rgba(26,34,51,0.28) 48%, ${BG} 100%)`,
    accent: WARM,
  },
  {
    id: "ch3",
    index: 3,
    title: "The Amazigh Silence",
    category: "Textiles & Weaving",
    century: "XIX Century",
    origin: "High Atlas, Morocco",
    excerpt:
      "The Berber carpet speaks in a language older than Arabic, older than Islam — a cosmological alphabet encoded in diamond and chevron, passed from grandmother to granddaughter without a single written word.",
    gradient:
      `radial-gradient(ellipse at 50% 100%, rgba(220,199,163,0.08) 0%, transparent 55%), linear-gradient(195deg, ${BG} 0%, rgba(26,34,51,0.16) 50%, ${BG} 100%)`,
    accent: WARM,
  },
  {
    id: "ch4",
    index: 4,
    title: "The Moorish Archive",
    category: "Manuscripts & Books",
    century: "XVI Century",
    origin: "Marrakech & Fès",
    excerpt:
      "In the libraries of the great riads, scholars copied and annotated on paper so fine it held the breath of centuries. Each margin note a conversation across time.",
    gradient:
      `radial-gradient(ellipse 100% 60% at 30% 40%, rgba(220,199,163,0.06) 0%, transparent 48%), radial-gradient(ellipse at 70% 62%, ${BG} 0%, rgba(26,34,51,0.2) 44%, ${BG} 100%)`,
    accent: WARM,
  },
  {
    id: "ch5",
    index: 5,
    title: "The Saharan Crossing",
    category: "Ceramics & Vessels",
    century: "XVIII Century",
    origin: "Saharan Trade Routes",
    excerpt:
      "The caravans moved through Sijilmasa, through Timbuktu, through the salt flats of Taghaza. What survived the crossing was not merely useful — it was sanctified by the journey itself.",
    gradient:
      `radial-gradient(ellipse at 60% 40%, rgba(220,199,163,0.07) 0%, transparent 50%), radial-gradient(ellipse at 28% 78%, ${BG} 0%, rgba(26,34,51,0.3) 45%, ${BG} 96%)`,
    accent: WARM,
  },
];

export const cascadePanels: GalleryCascadePanel[] = [
  {
    id: "cas1",
    label: "Chapter I",
    title: "The Inheritance\nof Silence",
    subtitle: "On what objects remember when their owners forget",
    body:
      "Every object in this archive passed through at least three pairs of hands before it reached Casablanca. A 15th-century cedar chest from Granada, a brass astrolabe from Aleppo, a marriage carpet from the High Atlas — each carries the fingerprints of silences too profound for documentation. The archive begins here: in the gap between provenance and memory.",
    gradient:
      `radial-gradient(ellipse 85% 55% at 15% 85%, rgba(220,199,163,0.07) 0%, transparent 50%), radial-gradient(ellipse at 52% 50%, ${BG} 0%, rgba(26,34,51,0.14) 55%, ${BG} 100%)`,
    accent: WARM,
  },
  {
    id: "cas2",
    label: "Chapter II",
    title: "What the Merchants\nCarried",
    subtitle: "On the economy of beautiful things",
    body:
      "The trans-Saharan trade routes were not merely economic arteries — they were cultural capillaries through which ideas, aesthetics, and techniques moved slowly but permanently. A glazing technique born in Tang China arrived in Morocco three centuries after its invention. A geometric pattern born in Mesopotamia reproduced itself in the zellige of a Fès fountain. Objects were the slowest but most faithful messengers.",
    gradient:
      `radial-gradient(ellipse 70% 50% at 90% 15%, rgba(220,199,163,0.09) 0%, transparent 55%), radial-gradient(ellipse at 45% 62%, ${BG} 0%, rgba(26,34,51,0.22) 52%, ${BG} 100%)`,
    accent: WARM,
  },
  {
    id: "cas3",
    label: "Chapter III",
    title: "The Year of the\nGreat Dispersal",
    subtitle: "On exile and the objects that survived it",
    body:
      "1492. 1609. 1830. The history of North Africa is punctuated by dispersals — of peoples, of knowledge, of craft traditions. When the Moriscos were expelled from Spain for the second and final time, they carried what they could: a lute, a manuscript, the memory of a geometric pattern. The objects in this room are the children of those decisions, made in doorways, under duress, in the last minutes before departure.",
    gradient:
      `radial-gradient(ellipse 90% 70% at 50% 110%, rgba(220,199,163,0.07) 0%, transparent 50%), radial-gradient(ellipse at 50% 42%, ${BG} 0%, rgba(26,34,51,0.17) 50%, ${BG} 100%)`,
    accent: WARM,
  },
];

export const archiveArtifacts: GalleryArtifact[] = [
  {
    id: "ar1",
    title: "Zellij Panel, Bou Inania Madrasa",
    category: "Architectural Fragment",
    century: "XIV Century",
    origin: "Fès, Morocco",
    excerpt:
      "A single panel of 8-pointed star zellij, removed during the 1920s renovation and preserved in a private Fès collection for four generations.",
    gradient: `linear-gradient(160deg, ${BG} 0%, rgba(26,34,51,0.22) 45%, ${BG} 72%, rgba(26,34,51,1) 100%)`,
    accent: WARM,
    span: "wide",
  },
  {
    id: "ar2",
    title: "Andalusian Lute, Oud al-Gharb",
    category: "Musical Instrument",
    century: "XVI Century",
    origin: "Tétouan, Morocco",
    excerpt:
      "The oldest surviving example of the Andalusian lute tradition in Morocco. The rosette is carved from a single piece of cedarwood.",
    gradient: `radial-gradient(ellipse at 70% 35%, rgba(220,199,163,0.07) 0%, transparent 45%), radial-gradient(at 32% 82%, ${BG} 0%, rgba(26,34,51,0.24) 50%, ${BG} 100%)`,
    accent: WARM,
    span: "normal",
  },
  {
    id: "ar3",
    title: "Celestial Planisphere",
    category: "Scientific Instrument",
    century: "XI Century",
    origin: "Toledo, Al-Andalus",
    excerpt:
      "Brass, engraved and inlaid with silver. The rete is a map of the heavens as they appeared above Toledo in the year 1055 CE.",
    gradient: `radial-gradient(ellipse at 25% 30%, rgba(220,199,163,0.10) 0%, transparent 50%), linear-gradient(210deg, ${BG} 0%, rgba(26,34,51,0.18) 48%, ${BG} 100%)`,
    accent: WARM,
    span: "tall",
  },
  {
    id: "ar4",
    title: "Marriage Carpet, Aït Ouaouzguite",
    category: "Textile",
    century: "XIX Century",
    origin: "Draa Valley, Morocco",
    excerpt:
      "The diamonds encode a genealogy. Red ochre from the Atlas mountains. The wool was spun in winter and dyed before the first rain.",
    gradient: `radial-gradient(ellipse at 60% 20%, rgba(220,199,163,0.1) 0%, transparent 50%), radial-gradient(at 45% 100%, ${BG} 0%, rgba(26,34,51,0.26) 48%, ${BG} 100%)`,
    accent: WARM,
    span: "normal",
  },
  {
    id: "ar5",
    title: "Quran Manuscript, Maghrebi Script",
    category: "Manuscript",
    century: "XIII Century",
    origin: "Marrakech, Morocco",
    excerpt:
      "112 folios on gazelle vellum. The illuminated opening pages ground lapis symbolism in the same workshop tradition as Ben Youssef Madrasa ornament.",
    gradient: `radial-gradient(ellipse at 55% 50%, rgba(220,199,163,0.08) 0%, transparent 55%), radial-gradient(at 22% 22%, ${BG} 0%, rgba(26,34,51,0.22) 46%, ${BG} 100%)`,
    accent: WARM,
    span: "wide",
  },
  {
    id: "ar6",
    title: "Hammam Vessel, Pierced Brass",
    category: "Metalwork",
    century: "XVII Century",
    origin: "Meknès, Morocco",
    excerpt:
      "The pierced arabesque allows steam to pass while the outer shell remains cool to the touch. Engineering as calligraphy.",
    gradient: `linear-gradient(25deg, ${BG} 0%, rgba(26,34,51,0.18) 40%, ${BG} 100%)`,
    accent: WARM,
    span: "normal",
  },
  {
    id: "ar7",
    title: "Fassi Pottery Amphora",
    category: "Ceramics",
    century: "XVIII Century",
    origin: "Fès el-Bali, Morocco",
    excerpt:
      "Glaze rhythm and cobalt depth — the painter's hand can be read in the particular flourish of the calligraphic cartouche.",
    gradient: `radial-gradient(ellipse at 75% 60%, rgba(220,199,163,0.12) 0%, transparent 55%), linear-gradient(to bottom, ${BG} 0%, rgba(26,34,51,0.16) 50%, ${BG} 100%)`,
    accent: WARM,
    span: "normal",
  },
  {
    id: "ar8",
    title: "Tadelakt Bath Panel",
    category: "Architectural Fragment",
    century: "XIX Century",
    origin: "Marrakech, Morocco",
    excerpt:
      "Polished lime plaster waterproofed with black soap and egg white. The technique was nearly lost before 1970. This panel came from a demolished riad on Rue Dar el-Bacha.",
    gradient: `radial-gradient(ellipse at 10% 90%, rgba(220,199,163,0.08) 0%, transparent 50%), radial-gradient(at 85% 12%, ${BG} 0%, rgba(26,34,51,0.22) 45%, ${BG} 100%)`,
    accent: WARM,
    span: "tall",
  },
];
