"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Scissors, Clock, Users, Star } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

const WORKSHOPS = [
  { id: "W-001", title: "Wheel Throwing Pottery", category: "Nature & Earth", duration: "2.5 hrs", group: "4–10", price: 450, nextSession: "Sat 14 Jun", spots: "6/10", status: "Published", bookings: 48 },
  { id: "W-002", title: "Shibori Indigo Dyeing",   category: "Making & Craft", duration: "3 hrs",  group: "6–12", price: 380, nextSession: "Sun 15 Jun", spots: "4/8",  status: "Published", bookings: 31 },
  { id: "W-003", title: "Terrarium Building",       category: "Nature & Earth", duration: "2 hrs",  group: "4–8",  price: 320, nextSession: "Sat 21 Jun", spots: "8/8",  status: "Published", bookings: 62 },
  { id: "W-004", title: "Glass Painting",           category: "Light & Wonder", duration: "2.5 hrs",group: "4–8",  price: 280, nextSession: "Sat 21 Jun", spots: "3/8",  status: "Published", bookings: 19 },
  { id: "W-005", title: "Natural Candle Making",    category: "Making & Craft", duration: "2 hrs",  group: "6–12", price: 290, nextSession: "Sun 22 Jun", spots: "9/12", status: "Published", bookings: 44 },
  { id: "W-006", title: "Macramé Wall Hanging",     category: "Imagination",    duration: "3 hrs",  group: "4–8",  price: 350, nextSession: "—",          spots: "—",    status: "Draft",     bookings: 0  },
  { id: "W-007", title: "Botanical Weaving",        category: "Nature & Earth", duration: "2.5 hrs",group: "4–10", price: 310, nextSession: "Sat 28 Jun", spots: "2/10", status: "Published", bookings: 27 },
  { id: "W-008", title: "Resin Jewellery",          category: "Light & Wonder", duration: "2 hrs",  group: "4–8",  price: 420, nextSession: "—",          spots: "—",    status: "Archived",  bookings: 88 },
];

const CAT_COLORS: Record<string, string> = {
  "Nature & Earth": D.green,
  "Making & Craft": D.gold,
  "Light & Wonder": D.purple,
  "Imagination":    D.blue,
};

const TABS = [
  { label: "All", count: 8 },
  { label: "Published", count: 6 },
  { label: "Draft", count: 1 },
  { label: "Archived", count: 1 },
];

const COLUMNS = [
  { key: "title",       label: "Title",         width: "2fr"   },
  { key: "category",    label: "Category",      width: "140px" },
  { key: "duration",    label: "Duration",      width: "90px"  },
  { key: "price",       label: "Price",         width: "80px", mono: true, align: "right" as const },
  { key: "nextSession", label: "Next Session",  width: "120px" },
  { key: "spots",       label: "Spots",         width: "80px", mono: true },
  { key: "status",      label: "Status",        width: "110px" },
];

export default function WorkshopsPage() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);

  const filtered = WORKSHOPS.filter(w => {
    if (tab === 1) return w.status === "Published";
    if (tab === 2) return w.status === "Draft";
    if (tab === 3) return w.status === "Archived";
    return true;
  });

  const rows = filtered.map(w => ({
    title: (
      <div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 2 }}>{w.title}</p>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{w.id} · {w.bookings} total bookings</p>
      </div>
    ),
    category: (
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: CAT_COLORS[w.category] ?? D.subtle, background: (CAT_COLORS[w.category] ?? D.subtle) + "15", borderRadius: 20, padding: "2px 8px" }}>
        {w.category}
      </span>
    ),
    duration:    <span style={{ fontFamily: "monospace", fontSize: 12, color: D.subtle }}>{w.duration}</span>,
    price:       <span style={{ fontFamily: "monospace", fontSize: 13, color: D.gold }}>{w.price} EGP</span>,
    nextSession: <span style={{ fontFamily: "monospace", fontSize: 11, color: w.nextSession === "—" ? D.muted : D.body }}>{w.nextSession}</span>,
    spots:       <span style={{ fontFamily: "monospace", fontSize: 12, color: w.spots === "—" ? D.muted : w.spots.startsWith("8/8") ? D.red : D.body }}>{w.spots}</span>,
    status:      <StatusBadge status={w.status} />,
  }));

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="Workshops"
        breadcrumb={["Workshops"]}
        stats={[
          { label: "total", value: 8 },
          { label: "published", value: 6, color: D.green },
          { label: "drafts", value: 1, color: D.amber },
          { label: "bookings this month", value: 127, color: D.gold },
        ]}
        action={{ label: "New Workshop", href: "/studio/workshops/new" }}
      />

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { icon: Scissors,  label: "Active workshops", value: "6",    color: D.gold   },
          { icon: Users,     label: "Bookings / month", value: "127",  color: D.green  },
          { icon: Clock,     label: "Avg duration",     value: "2.4h", color: D.blue   },
          { icon: Star,      label: "Avg occupancy",    value: "71%",  color: D.amber  },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ borderColor: color + "40" }}
            style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, padding: "16px 18px", transition: "border-color 0.2s" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 600, color: D.heading, lineHeight: 1 }}>{value}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginTop: 2 }}>{label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <SearchBar placeholder="Search workshops..." />
      <DataTable columns={COLUMNS} rows={rows} />
      <Pagination total={filtered.length} perPage={20} page={page} onChange={setPage} />
    </div>
  );
}
