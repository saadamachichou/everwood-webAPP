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
    excerpt: "When the gates of Granada closed in 1492, the craftsmen carried their geometry westward — to Fès, to Tétouan, to the workshops that would shape three centuries of Moroccan interiors.",
    gradient: "radial-gradient(ellipse at 40% 60%, #2a1a08 0%, #160e04 50%, #0a0602 100%)",
    accent: "#C9A96E",
  },
  {
    id: "ch2",
    index: 2,
    title: "The Ottoman Meridian",
    category: "Metalwork & Instruments",
    century: "XVII Century",
    origin: "Istanbul & Aleppo",
    excerpt: "Astrolabes, orreries, celestial globes — the Ottoman court transformed scientific instruments into objects of such refinement that knowledge itself became beautiful.",
    gradient: "radial-gradient(ellipse at 60% 30%, #1a0f1f 0%, #0e0812 55%, #060408 100%)",
    accent: "#B8A0D4",
  },
  {
    id: "ch3",
    index: 3,
    title: "The Amazigh Silence",
    category: "Textiles & Weaving",
    century: "XIX Century",
    origin: "High Atlas, Morocco",
    excerpt: "The Berber carpet speaks in a language older than Arabic, older than Islam — a cosmological alphabet encoded in diamond and chevron, passed from grandmother to granddaughter without a single written word.",
    gradient: "radial-gradient(ellipse at 50% 70%, #1f1008 0%, #120a04 55%, #080402 100%)",
    accent: "#D4943A",
  },
  {
    id: "ch4",
    index: 4,
    title: "The Moorish Archive",
    category: "Manuscripts & Books",
    century: "XVI Century",
    origin: "Marrakech & Fès",
    excerpt: "In the libraries of the great riads, scholars copied and annotated on paper so fine it held the breath of centuries. Each margin note a conversation across time.",
    gradient: "radial-gradient(ellipse at 30% 40%, #0a1a10 0%, #050e08 55%, #020604 100%)",
    accent: "#6BA87A",
  },
  {
    id: "ch5",
    index: 5,
    title: "The Saharan Crossing",
    category: "Ceramics & Vessels",
    century: "XVIII Century",
    origin: "Saharan Trade Routes",
    excerpt: "The caravans moved through Sijilmasa, through Timbuktu, through the salt flats of Taghaza. What survived the crossing was not merely useful — it was sanctified by the journey itself.",
    gradient: "radial-gradient(ellipse at 70% 50%, #1f1508 0%, #120d04 55%, #080602 100%)",
    accent: "#C9A96E",
  },
];

export const cascadePanels: GalleryCascadePanel[] = [
  {
    id: "cas1",
    label: "Chapter I",
    title: "The Inheritance\nof Silence",
    subtitle: "On what objects remember when their owners forget",
    body: "Every object in this archive passed through at least three pairs of hands before it reached Casablanca. A 15th-century cedar chest from Granada, a brass astrolabe from Aleppo, a marriage carpet from the High Atlas — each carries the fingerprints of silences too profound for documentation. The archive begins here: in the gap between provenance and memory.",
    gradient: "radial-gradient(ellipse at 20% 80%, #0f0a18 0%, #07050f 45%, #030208 100%)",
    accent: "#8884A8",
  },
  {
    id: "cas2",
    label: "Chapter II",
    title: "What the Merchants\nCarried",
    subtitle: "On the economy of beautiful things",
    body: "The trans-Saharan trade routes were not merely economic arteries — they were cultural capillaries through which ideas, aesthetics, and techniques moved slowly but permanently. A glazing technique from Tang China arrived in Morocco three centuries after its invention. A geometric pattern born in Mesopotamia reproduced itself in the zellige of a Fès fountain. Objects were the slowest but most faithful messengers.",
    gradient: "radial-gradient(ellipse at 80% 20%, #1f1208 0%, #120c04 45%, #080502 100%)",
    accent: "#D4943A",
  },
  {
    id: "cas3",
    label: "Chapter III",
    title: "The Year of the\nGreat Dispersal",
    subtitle: "On exile and the objects that survived it",
    body: "1492. 1609. 1830. The history of North Africa is punctuated by dispersals — of peoples, of knowledge, of craft traditions. When the Moriscos were expelled from Spain for the second and final time, they carried what they could: a lute, a manuscript, the memory of a geometric pattern. The objects in this room are the children of those decisions, made in doorways, under duress, in the last minutes before departure.",
    gradient: "radial-gradient(ellipse at 50% 60%, #200808 0%, #130404 45%, #080202 100%)",
    accent: "#E85D26",
  },
];

export const archiveArtifacts: GalleryArtifact[] = [
  {
    id: "ar1",
    title: "Zellij Panel, Bou Inania Madrasa",
    category: "Architectural Fragment",
    century: "XIV Century",
    origin: "Fès, Morocco",
    excerpt: "A single panel of 8-pointed star zellij, removed during the 1920s renovation and preserved in a private Fès collection for four generations.",
    gradient: "radial-gradient(ellipse at 40% 60%, #1a1008 0%, #0f0904 100%)",
    accent: "#C9A96E",
    span: "wide",
  },
  {
    id: "ar2",
    title: "Andalusian Lute, Oud al-Gharb",
    category: "Musical Instrument",
    century: "XVI Century",
    origin: "Tétouan, Morocco",
    excerpt: "The oldest surviving example of the Andalusian lute tradition in Morocco. The rosette is carved from a single piece of cedarwood.",
    gradient: "radial-gradient(ellipse at 60% 40%, #180e06 0%, #0c0803 100%)",
    accent: "#D4943A",
    span: "normal",
  },
  {
    id: "ar3",
    title: "Celestial Planisphere",
    category: "Scientific Instrument",
    century: "XI Century",
    origin: "Toledo, Al-Andalus",
    excerpt: "Brass, engraved and inlaid with silver. The rete is a map of the heavens as they appeared above Toledo in the year 1055 CE.",
    gradient: "radial-gradient(ellipse at 30% 70%, #12101a 0%, #090810 100%)",
    accent: "#B8A0D4",
    span: "tall",
  },
  {
    id: "ar4",
    title: "Marriage Carpet, Aït Ouaouzguite",
    category: "Textile",
    century: "XIX Century",
    origin: "Draa Valley, Morocco",
    excerpt: "The diamonds encode a genealogy. Red ochre from the Atlas mountains. The wool was spun in winter and dyed before the first rain.",
    gradient: "radial-gradient(ellipse at 70% 30%, #1a0808 0%, #0e0404 100%)",
    accent: "#E85D26",
    span: "normal",
  },
  {
    id: "ar5",
    title: "Quran Manuscript, Maghrebi Script",
    category: "Manuscript",
    century: "XIII Century",
    origin: "Marrakech, Morocco",
    excerpt: "112 folios on gazelle vellum. The illuminated opening pages use lapis lazuli ground in the same workshop as the Ben Youssef Madrasa tilework.",
    gradient: "radial-gradient(ellipse at 50% 50%, #081208 0%, #040904 100%)",
    accent: "#6BA87A",
    span: "wide",
  },
  {
    id: "ar6",
    title: "Hammam Vessel, Pierced Brass",
    category: "Metalwork",
    century: "XVII Century",
    origin: "Meknès, Morocco",
    excerpt: "The pierced arabesque allows steam to pass while the outer shell remains cool to the touch. Engineering as calligraphy.",
    gradient: "radial-gradient(ellipse at 40% 40%, #141008 0%, #0c0a04 100%)",
    accent: "#C9A96E",
    span: "normal",
  },
  {
    id: "ar7",
    title: "Fassi Pottery Amphora",
    category: "Ceramics",
    century: "XVIII Century",
    origin: "Fès el-Bali, Morocco",
    excerpt: "The cobalt is from cobaltite ore mined in the Middle Atlas. The painter's hand can be identified in the particular flourish of the calligraphic cartouche.",
    gradient: "radial-gradient(ellipse at 60% 60%, #080f18 0%, #040810 100%)",
    accent: "#4A90D9",
    span: "normal",
  },
  {
    id: "ar8",
    title: "Tadelakt Bath Panel",
    category: "Architectural Fragment",
    century: "XIX Century",
    origin: "Marrakech, Morocco",
    excerpt: "Polished lime plaster waterproofed with black soap and egg white. The technique was nearly lost before 1970. This panel came from a demolished riad on Rue Dar el-Bacha.",
    gradient: "radial-gradient(ellipse at 20% 80%, #181008 0%, #0e0904 100%)",
    accent: "#D4943A",
    span: "tall",
  },
];
