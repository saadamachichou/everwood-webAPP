"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

const RESERVATIONS = [
  { id: "R-2024-0241", guest: "Layla Mansour",  email: "layla@email.com",   date: "Sat 14 Jun", time: "8:00 PM", covers: 4, table: "T-5",  notes: "Anniversary dinner — roses",   status: "Confirmed" },
  { id: "R-2024-0240", guest: "Omar Benali",     email: "omar@email.com",    date: "Sat 14 Jun", time: "7:30 PM", covers: 2, table: "T-2",  notes: "",                              status: "Confirmed" },
  { id: "R-2024-0239", guest: "Nadia Chérif",    email: "nadia@email.com",   date: "Sat 14 Jun", time: "8:30 PM", covers: 6, table: "T-8",  notes: "Gluten-free options needed",    status: "Confirmed" },
  { id: "R-2024-0238", guest: "Youssef Haddad",  email: "youssef@email.com", date: "Sun 15 Jun", time: "1:00 PM", covers: 3, table: "T-4",  notes: "",                              status: "Pending"   },
  { id: "R-2024-0237", guest: "Sara El Fassi",   email: "sara@email.com",    date: "Sun 15 Jun", time: "2:00 PM", covers: 5, table: "T-6",  notes: "Birthday — cake allowed",       status: "Confirmed" },
  { id: "R-2024-0236", guest: "Karim Jalil",     email: "karim@email.com",   date: "Mon 16 Jun", time: "7:00 PM", covers: 2, table: "T-1",  notes: "",                              status: "Confirmed" },
  { id: "R-2024-0235", guest: "Amira Tazi",      email: "amira@email.com",   date: "Fri 13 Jun", time: "9:00 PM", covers: 4, table: "T-3",  notes: "",                              status: "Attended"  },
  { id: "R-2024-0234", guest: "Hassan Mrani",    email: "hassan@email.com",  date: "Thu 12 Jun", time: "8:00 PM", covers: 2, table: "T-7",  notes: "",                              status: "Cancelled" },
];

const TABS = [
  { label: "All",       count: 8 },
  { label: "Today",     count: 3 },
  { label: "Upcoming",  count: 4 },
  { label: "Past",      count: 1 },
];

const COLUMNS = [
  { key: "reservation", label: "Reservation",  width: "2fr"   },
  { key: "datetime",    label: "Date & Time",  width: "160px", mono: true },
  { key: "covers",      label: "Covers",       width: "70px",  mono: true, align: "right" as const },
  { key: "table",       label: "Table",        width: "70px",  mono: true },
  { key: "notes",       label: "Notes",        width: "180px" },
  { key: "status",      label: "Status",       width: "110px" },
];

export default function ReservationsPage() {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<typeof RESERVATIONS[0] | null>(null);
  const [page, setPage] = useState(1);

  const filtered = RESERVATIONS.filter(r => {
    if (tab === 1) return r.date.includes("14 Jun");
    if (tab === 2) return r.status === "Confirmed" || r.status === "Pending";
    if (tab === 3) return r.status === "Attended" || r.status === "Cancelled";
    return true;
  });

  const rows = filtered.map(r => ({
    reservation: (
      <div>
        <p style={{ fontFamily: "monospace", fontSize: 12, color: D.gold, marginBottom: 2 }}>{r.id}</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading }}>{r.guest}</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>{r.email}</p>
      </div>
    ),
    datetime: (
      <div>
        <p style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{r.date}</p>
        <p style={{ fontFamily: "monospace", fontSize: 11, color: D.subtle }}>{r.time}</p>
      </div>
    ),
    covers: <span style={{ fontFamily: "monospace", fontSize: 13, color: D.body }}>{r.covers}</span>,
    table:  <span style={{ fontFamily: "monospace", fontSize: 12, color: D.blue }}>{r.table}</span>,
    notes:  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: r.notes ? D.subtle : D.muted, fontStyle: r.notes ? "normal" : "italic" }}>{r.notes || "—"}</span>,
    status: <StatusBadge status={r.status} />,
  }));

  const todayCovers = RESERVATIONS.filter(r => r.date.includes("14 Jun")).reduce((s, r) => s + r.covers, 0);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 16 }}>
      <div>
        <PageHeader
          title="Table Reservations"
          breadcrumb={["Reservations"]}
          stats={[
            { label: "today",     value: 3,             color: D.gold  },
            { label: "covers",    value: todayCovers,   color: D.green },
            { label: "this week", value: 28,            color: D.gold  },
          ]}
          action={{ label: "New Reservation" }}
        >
          <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, background: D.raised, border: `1px solid ${D.border}`, borderRadius: 7, color: D.body, padding: "6px 14px", cursor: "pointer", margin: 0 }}>
            Floor View
          </button>
        </PageHeader>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { icon: CalendarDays, label: "Today",           value: "3",  color: D.gold   },
            { icon: Users,        label: "Covers today",    value: String(todayCovers),  color: D.green  },
            { icon: Clock,        label: "Pending confirm", value: "1",  color: D.amber  },
            { icon: XCircle,      label: "Cancelled today", value: "0",  color: D.red    },
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

        {/* Floor map placeholder */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading }}>Floor Plan — Tonight</p>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: D.muted }}>Sat 14 Jun · 8:00 PM</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8 }}>
            {Array.from({ length: 12 }, (_, i) => {
              const tableNum = `T-${i + 1}`;
              const res = RESERVATIONS.find(r => r.table === tableNum && r.date.includes("14 Jun"));
              return (
                <div key={tableNum} style={{
                  background: res ? (res.status === "Confirmed" ? D.gold + "18" : D.raised) : D.raised,
                  border: `1px solid ${res ? D.gold + "40" : D.border}`,
                  borderRadius: 8, padding: "10px 8px", textAlign: "center",
                  cursor: res ? "pointer" : "default",
                }} onClick={() => res && setSelected(res)}>
                  <p style={{ fontFamily: "monospace", fontSize: 11, color: res ? D.gold : D.muted, marginBottom: 2 }}>{tableNum}</p>
                  {res ? (
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: D.subtle }}>{res.covers} pax</p>
                  ) : (
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: D.muted }}>Free</p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <TabBar tabs={TABS} active={tab} onChange={setTab} />
        <SearchBar placeholder="Search by guest, ID, date..." />
        <DataTable columns={COLUMNS} rows={rows} onRowClick={(_, i) => setSelected(filtered[i])} />
        <Pagination total={filtered.length} perPage={20} page={page} onChange={setPage} />
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20, height: "fit-content", position: "sticky", top: 88 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 11, color: D.muted, marginBottom: 4 }}>{selected.id}</p>
                <StatusBadge status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 4, margin: 0 }}>✕</button>
            </div>
            {[
              ["Guest",   selected.guest],
              ["Email",   selected.email],
              ["Date",    selected.date],
              ["Time",    selected.time],
              ["Covers",  String(selected.covers)],
              ["Table",   selected.table],
              ["Notes",   selected.notes || "—"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${D.border}` }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>{label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {["Send Reminder", "Mark Attended", "Cancel"].map((a, i) => (
                <button key={a} style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, cursor: "pointer",
                  background: i === 2 ? "rgba(240,68,56,0.1)" : D.raised,
                  border: `1px solid ${i === 2 ? "rgba(240,68,56,0.3)" : D.border}`,
                  color: i === 2 ? D.red : D.body, borderRadius: 6, padding: "6px 12px", margin: 0,
                }}>{a}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
