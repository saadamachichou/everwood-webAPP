export interface TicketTier {
  name: string;
  perks: string;
  price: number;
  available: number;
  low: boolean;
}

export interface SetTime {
  time: string;
  act: string;
}

export interface Event {
  id: string;
  title: string;
  artist: string;
  bio: string;
  genre: "jazz" | "swing" | "blues" | "special";
  month: "apr" | "may";
  day: number;
  monthLabel: string;
  date: string;
  time: string;
  doors: string;
  venue: string;
  capacity: string;
  description: string;
  setTimes: SetTime[];
  tiers: TicketTier[];
  soldOut: boolean;
  availability: number;
  bgColors: [string, string, string];
  accent: string;
  initials: string;
}

export const events: Event[] = [
  {
    id: "e1",
    title: "Nocturne in Blue",
    artist: "Layla Benali Quartet",
    bio: "Casablanca-born pianist weaving Atlantic jazz with Andalusian maqam scales.",
    genre: "jazz",
    month: "apr",
    day: 18,
    monthLabel: "APR",
    date: "Friday, 18 April 2026",
    time: "8:00 PM",
    doors: "7:30 PM",
    venue: "The Loft Stage",
    capacity: "Intimate · 120 seats",
    description: "Layla Benali returns to Everwood for an evening that dissolves the border between Coltrane and Andalusia. Her quartet explores the modal territories where Atlantic jazz meets maqam tonality — a language she has been developing for two decades.",
    setTimes: [{ time: "7:30", act: "Doors open" }, { time: "8:00", act: "Layla Benali Quartet" }, { time: "9:45", act: "Intermission" }, { time: "10:15", act: "Second set" }],
    tiers: [
      { name: "Early Bird", perks: "General admission", price: 28, available: 6, low: true },
      { name: "Standard", perks: "General admission", price: 38, available: 40, low: false },
      { name: "Reserve", perks: "Reserved front row + programme", price: 65, available: 8, low: true },
    ],
    soldOut: false,
    availability: 72,
    bgColors: ["#1a1228", "#0d1020", "#08080f"],
    accent: "#8B5CF6",
    initials: "LB",
  },
  {
    id: "e2",
    title: "The Grand Swing Revival",
    artist: "Casablanca Swing Orchestra",
    bio: "18-piece big band recreating the golden-age ballroom sound of 1940s Casablanca.",
    genre: "swing",
    month: "apr",
    day: 25,
    monthLabel: "APR",
    date: "Saturday, 25 April 2026",
    time: "9:00 PM",
    doors: "8:00 PM",
    venue: "The Grand Courtyard",
    capacity: "Courtyard · 280 guests",
    description: "The most anticipated event of the season. The Casablanca Swing Orchestra occupies the full riad courtyard for a night of big-band swing, period cocktails, and dancing under the stars. Period dress encouraged.",
    setTimes: [{ time: "8:00", act: "Doors & cocktail hour" }, { time: "9:00", act: "First set — the classics" }, { time: "10:30", act: "Dance break" }, { time: "11:00", act: "Second set — originals" }],
    tiers: [
      { name: "Early Bird", perks: "Standing + 1 welcome drink", price: 45, available: 0, low: false },
      { name: "Standard", perks: "Standing + 1 welcome drink", price: 60, available: 22, low: false },
      { name: "Table", perks: "Reserved table for 4 + bottle", price: 320, available: 3, low: true },
    ],
    soldOut: false,
    availability: 88,
    bgColors: ["#201a10", "#150f08", "#0a0804"],
    accent: "#D4943A",
    initials: "CO",
  },
  {
    id: "e3",
    title: "Midnight Delta",
    artist: "Youssef El Fassi",
    bio: "Gnawa-blues guitarist fusing Mississippi roots with Moroccan sacred rhythms.",
    genre: "blues",
    month: "apr",
    day: 11,
    monthLabel: "APR",
    date: "Saturday, 11 April 2026",
    time: "10:00 PM",
    doors: "9:30 PM",
    venue: "The Loft Stage",
    capacity: "Intimate · 120 seats",
    description: "Youssef El Fassi travels the ancient road between the Mississippi Delta and the sub-Saharan plains — finding that blues and Gnawa share the same longing. A late-night ritual of call-and-response, hypnotic rhythm, and raw improvisation.",
    setTimes: [{ time: "9:30", act: "Doors" }, { time: "10:00", act: "Opening ceremony" }, { time: "10:30", act: "Youssef El Fassi" }],
    tiers: [
      { name: "Standard", perks: "General admission", price: 32, available: 35, low: false },
      { name: "Ritual", perks: "Front standing + ceremony kit", price: 55, available: 4, low: true },
    ],
    soldOut: false,
    availability: 61,
    bgColors: ["#12100a", "#0a0806", "#050302"],
    accent: "#E85D26",
    initials: "YF",
  },
  {
    id: "e4",
    title: "La Nuit Blanche",
    artist: "Various Artists",
    bio: "Everwood's annual all-night cultural marathon across all six rooms of the riad.",
    genre: "special",
    month: "may",
    day: 2,
    monthLabel: "MAY",
    date: "Saturday, 2 May 2026",
    time: "8:00 PM",
    doors: "7:00 PM",
    venue: "All Spaces",
    capacity: "Whole riad · 350 guests",
    description: "Once a year, Everwood stays open until dawn. Seven artists across six spaces — jazz in the courtyard, electronic in the cellar, spoken word in the library, dance in the salon. The city sleeps. We don't.",
    setTimes: [{ time: "20:00", act: "Opening — all spaces" }, { time: "22:00", act: "Late programming begins" }, { time: "00:00", act: "Midnight set — courtyard" }, { time: "04:00", act: "Sunrise session" }],
    tiers: [
      { name: "Night Pass", perks: "All spaces · until dawn", price: 75, available: 18, low: false },
      { name: "VIP Pass", perks: "All spaces + artist lounge + breakfast", price: 140, available: 5, low: true },
    ],
    soldOut: false,
    availability: 79,
    bgColors: ["#0a0814", "#050510", "#03030a"],
    accent: "#2AFFA8",
    initials: "NB",
  },
  {
    id: "e5",
    title: "Strings at Dusk",
    artist: "Nadia Laaroussi",
    bio: "Oud virtuoso and composer, alumna of the Berklee Mediterranean Music Summit.",
    genre: "jazz",
    month: "may",
    day: 9,
    monthLabel: "MAY",
    date: "Saturday, 9 May 2026",
    time: "7:30 PM",
    doors: "7:00 PM",
    venue: "The Rooftop Terrace",
    capacity: "Rooftop · 80 guests",
    description: "As the sun sets over the Atlantic and the city's call to prayer echoes through the medina, Nadia Laaroussi plays oud on the rooftop terrace. A concert designed around the Moroccan hour of 'bain deux lumières' — between two lights.",
    setTimes: [{ time: "19:00", act: "Doors & sunset" }, { time: "19:30", act: "Nadia Laaroussi — solo" }, { time: "20:45", act: "Trio set" }],
    tiers: [
      { name: "Terrace", perks: "Standing — rooftop", price: 42, available: 14, low: false },
      { name: "Cushion", perks: "Reserved floor cushion + mint tea", price: 68, available: 6, low: true },
    ],
    soldOut: false,
    availability: 55,
    bgColors: ["#1a1010", "#120a0a", "#080404"],
    accent: "#C9A96E",
    initials: "NL",
  },
  {
    id: "e6",
    title: "Electric Medina",
    artist: "DJ Hamid Hassan",
    bio: "Casablanca electronic producer blending chaabi samples with Berlin techno architecture.",
    genre: "special",
    month: "may",
    day: 16,
    monthLabel: "MAY",
    date: "Saturday, 16 May 2026",
    time: "11:00 PM",
    doors: "10:30 PM",
    venue: "The Cellar",
    capacity: "Underground · 90 standing",
    description: "The riad's 16th-century stone cellar becomes a subterranean dancefloor for one night. Hamid Hassan's sets are legendary in Casablanca — four hours of Moroccan-electronic fusion at a volume the old walls have never known.",
    setTimes: [{ time: "22:30", act: "Doors" }, { time: "23:00", act: "Warm-up set" }, { time: "00:00", act: "Hamid Hassan" }, { time: "04:00", act: "End" }],
    tiers: [
      { name: "Standard", perks: "Entry", price: 25, available: 0, low: false },
    ],
    soldOut: true,
    availability: 100,
    bgColors: ["#050510", "#030308", "#020204"],
    accent: "#2AFFA8",
    initials: "HH",
  },
];
