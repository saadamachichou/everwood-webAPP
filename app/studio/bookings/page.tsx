"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, XCircle, Clock, Mail } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

const BOOKINGS = [
  { id: "WB-2024-0891", guest: "Layla Mansour",   email: "layla@email.com",    workshop: "Pottery",           session: "Sat 14 Jun · 10am", guests: 2, total: 900,  payment: "Pending", status: "Confirmed"  },
  { id: "WB-2024-0890", guest: "Omar Benali",      email: "omar@email.com",     workshop: "Shibori Dyeing",    session: "Sun 15 Jun · 2pm",  guests: 1, total: 380,  payment: "Paid",    status: "Confirmed"  },
  { id: "WB-2024-0889", guest: "Nadia Chérif",     email: "nadia@email.com",    workshop: "Terrarium",         session: "Sat 21 Jun · 11am", guests: 3, total: 960,  payment: "Paid",    status: "Confirmed"  },
  { id: "WB-2024-0888", guest: "Youssef Haddad",   email: "youssef@email.com",  workshop: "Glass Painting",    session: "Sat 21 Jun · 3pm",  guests: 1, total: 280,  payment: "Paid",    status: "Confirmed"  },
  { id: "WB-2024-0887", guest: "Sara El Fassi",    email: "sara@email.com",     workshop: "Candle Making",     session: "Sun 22 Jun · 4pm",  guests: 2, total: 580,  payment: "Pending", status: "Confirmed"  },
  { id: "WB-2024-0886", guest: "Karim Jalil",      email: "karim@email.com",    workshop: "Pottery",           session: "Sat 14 Jun · 10am", guests: 1, total: 450,  payment: "Paid",    status: "Cancelled"  },
  { id: "WB-2024-0885", guest: "Amira Tazi",       email: "amira@email.com",    workshop: "Botanical Weaving", session: "Sat 28 Jun · 10am", guests: 2, total: 620,  payment: "Pending", status: "Confirmed"  },
  { id: "WB-2024-0884", guest: "Hassan Mrani",     email: "hassan@email.com",   workshop: "Terrarium",         session: "Sat 21 Jun · 11am", guests: 1, total: 320,  payment: "Paid",    status: "Attended"   },
];

const TABS = [
  { label: "All", count: 8 },
  { label: "Upcoming", count: 6 },
  { label: "Past", count: 1 },
  { label: "Cancelled", count: 1 },
];

const COLUMNS = [
  { key: "booking",   label: "Booking",       width: "2fr"   },
  { key: "workshop",  label: "Workshop",      width: "150px" },
  { key: "session",   label: "Session",       width: "160px", mono: true },
  { key: "guests",    label: "Guests",        width: "60px",  mono: true, align: "right" as const },
  { key: "total",     label: "Total",         width: "90px",  mono: true, align: "right" as const },
  { key: "payment",   label: "Payment",       width: "100px" },
  { key: "status",    label: "Status",        width: "110px" },
];

export default function BookingsPage() {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<typeof BOOKINGS[0] | null>(null);

  const filtered = BOOKINGS.filter(b => {
    if (tab === 1) return b.status === "Confirmed";
    if (tab === 2) return b.status === "Attended";
    if (tab === 3) return b.status === "Cancelled";
    return true;
  });

  const rows = filtered.map(b => ({
    booking: (
      <div>
        <p style={{ fontFamily: "monospace", fontSize: 12, color: D.gold, marginBottom: 2 }}>{b.id}</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading }}>{b.guest}</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>{b.email}</p>
      </div>
    ),
    workshop: <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{b.workshop}</span>,
    session:  <span style={{ fontFamily: "monospace", fontSize: 11, color: D.subtle }}>{b.session}</span>,
    guests:   <span style={{ fontFamily: "monospace", fontSize: 13, color: D.body }}>{b.guests}</span>,
    total:    <span style={{ fontFamily: "monospace", fontSize: 13, color: D.gold }}>{b.total.toLocaleString()} EGP</span>,
    payment: (
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif", fontSize: 11,
        color: b.payment === "Paid" ? D.green : D.amber,
        background: b.payment === "Paid" ? "rgba(61,214,140,0.1)" : "rgba(240,164,41,0.1)",
        borderRadius: 20, padding: "2px 8px",
        display: "flex", alignItems: "center", gap: 4, width: "fit-content",
      }}>
        {b.payment === "Paid" ? <CheckCircle size={9} /> : <Clock size={9} />}
        {b.payment}
      </span>
    ),
    status:   <StatusBadge status={b.status} />,
  }));

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 16 }}>
      <div>
        <PageHeader
          title="Workshop Bookings"
          breadcrumb={["Bookings"]}
          stats={[
            { label: "this month", value: 127, color: D.gold },
            { label: "confirmed", value: 118, color: D.green },
            { label: "revenue", value: "48,600 EGP", color: D.gold },
          ]}
        >
          <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, background: D.raised, border: `1px solid ${D.border}`, borderRadius: 7, color: D.body, padding: "6px 14px", cursor: "pointer", margin: 0 }}>
            Export CSV
          </button>
        </PageHeader>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { icon: BookOpen,     label: "New today",       value: "7",      color: D.gold   },
            { icon: CheckCircle,  label: "Confirmed",       value: "118",    color: D.green  },
            { icon: Clock,        label: "Pending payment", value: "9",      color: D.amber  },
            { icon: XCircle,      label: "Cancelled",       value: "6",      color: D.red    },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} style={{ color }} />
              </div>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 600, color: D.heading, lineHeight: 1 }}>{value}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginTop: 2 }}>{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <TabBar tabs={TABS} active={tab} onChange={setTab} />
        <SearchBar placeholder="Search by guest, ID, workshop..." />
        <DataTable columns={COLUMNS} rows={rows} onRowClick={(_, i) => setSelected(filtered[i])} />
        <Pagination total={filtered.length} perPage={20} page={1} onChange={() => {}} />
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20, height: "fit-content", position: "sticky", top: 88 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 12, color: D.gold, marginBottom: 4 }}>{selected.id}</p>
                <StatusBadge status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 4, margin: 0 }}>✕</button>
            </div>
            {[
              ["Workshop", selected.workshop],
              ["Session", selected.session],
              ["Guest", selected.guest],
              ["Email", selected.email],
              ["Guests", String(selected.guests)],
              ["Total", `${selected.total} EGP`],
              ["Payment", selected.payment],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${D.border}` }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>{label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {["Send reminder", "Mark paid", "Cancel"].map((a, i) => (
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
