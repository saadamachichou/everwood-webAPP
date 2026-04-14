"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Ticket, TrendingUp } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

const EVENTS = [
  { id: "E-001", title: "Summer Tasting Evening",  type: "Dining",     date: "Sun 15 Jun", time: "8:00 PM", capacity: 40, rsvp: 28, price: 0,    status: "Published" },
  { id: "E-002", title: "Jazz in the Garden",      type: "Live Music", date: "Fri 20 Jun", time: "7:30 PM", capacity: 60, rsvp: 45, price: 120,  status: "Published" },
  { id: "E-003", title: "Artisan Market",          type: "Exhibition", date: "Sat 21 Jun", time: "10:00 AM",capacity: 0,  rsvp: 0,  price: 0,    status: "Draft"     },
  { id: "E-004", title: "Oud Night — Vol. 3",      type: "Live Music", date: "Thu 26 Jun", time: "8:00 PM", capacity: 50, rsvp: 50, price: 150,  status: "Published" },
  { id: "E-005", title: "Pottery & Wine",          type: "Dining",     date: "Sat 28 Jun", time: "7:00 PM", capacity: 24, rsvp: 12, price: 280,  status: "Published" },
  { id: "E-006", title: "Photography Exhibition",  type: "Exhibition", date: "Jul 1–7",    time: "All day", capacity: 0,  rsvp: 0,  price: 0,    status: "Draft"     },
];

const TYPE_COLOR: Record<string, string> = { "Dining": D.green, "Live Music": D.purple, "Exhibition": D.blue, "Community": D.amber };

const TABS = [
  { label: "All", count: 6 },
  { label: "Published", count: 4 },
  { label: "Draft", count: 2 },
  { label: "Past", count: 0 },
];

const COLUMNS = [
  { key: "title",    label: "Event",       width: "2fr"   },
  { key: "type",     label: "Type",        width: "120px" },
  { key: "date",     label: "Date",        width: "110px", mono: true },
  { key: "time",     label: "Time",        width: "90px",  mono: true },
  { key: "rsvp",     label: "RSVP",        width: "90px"  },
  { key: "price",    label: "Price",       width: "90px",  mono: true, align: "right" as const },
  { key: "status",   label: "Status",      width: "110px" },
];

export default function EventsPage() {
  const [tab, setTab] = useState(0);
  const [view, setView] = useState<"list" | "calendar">("list");

  const filtered = EVENTS.filter(e => {
    if (tab === 1) return e.status === "Published";
    if (tab === 2) return e.status === "Draft";
    return true;
  });

  const rows = filtered.map(e => ({
    title: (
      <div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 2 }}>{e.title}</p>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{e.id}</p>
      </div>
    ),
    type: (
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: TYPE_COLOR[e.type] ?? D.subtle, background: (TYPE_COLOR[e.type] ?? D.subtle) + "15", borderRadius: 20, padding: "2px 8px" }}>
        {e.type}
      </span>
    ),
    date:   <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{e.date}</span>,
    time:   <span style={{ fontFamily: "monospace", fontSize: 12, color: D.subtle }}>{e.time}</span>,
    rsvp: e.capacity > 0 ? (
      <div>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: e.rsvp === e.capacity ? D.red : D.body }}>{e.rsvp}/{e.capacity}</span>
        <div style={{ width: 60, height: 3, background: D.border, borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
          <div style={{ width: `${(e.rsvp / e.capacity) * 100}%`, height: "100%", background: e.rsvp === e.capacity ? D.red : D.green, borderRadius: 2 }} />
        </div>
      </div>
    ) : <span style={{ fontFamily: "monospace", fontSize: 11, color: D.muted }}>Free entry</span>,
    price:  <span style={{ fontFamily: "monospace", fontSize: 12, color: e.price === 0 ? D.green : D.gold }}>{e.price === 0 ? "Free" : `${e.price} EGP`}</span>,
    status: <StatusBadge status={e.status} />,
  }));

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="Events"
        breadcrumb={["Events"]}
        stats={[
          { label: "total", value: 6 },
          { label: "published", value: 4, color: D.green },
          { label: "RSVPs this month", value: 135, color: D.gold },
        ]}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {(["list", "calendar"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer",
              background: view === v ? D.gold + "18" : D.raised,
              border: `1px solid ${view === v ? D.gold + "40" : D.border}`,
              color: view === v ? D.gold : D.subtle,
              borderRadius: 6, padding: "6px 12px", margin: 0, textTransform: "capitalize",
            }}>{v}</button>
          ))}
        </div>
      </PageHeader>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { icon: Calendar,    label: "Events this month", value: "6",  color: D.blue   },
          { icon: Users,       label: "Total RSVPs",       value: "135",color: D.green  },
          { icon: Ticket,      label: "Ticketed events",   value: "3",  color: D.gold   },
          { icon: TrendingUp,  label: "Avg fill rate",     value: "78%",color: D.purple },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 600, color: D.heading, lineHeight: 1 }}>{value}</p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginTop: 2 }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {view === "calendar" ? (
        <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, padding: 24 }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.subtle, textAlign: "center", padding: "60px 0" }}>
            Calendar view — connect Plausible or a calendar API to populate
          </p>
        </div>
      ) : (
        <>
          <SearchBar placeholder="Search events..." />
          <DataTable columns={COLUMNS} rows={rows} />
        </>
      )}
    </div>
  );
}
