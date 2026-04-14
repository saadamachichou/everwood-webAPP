"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Inbox, Reply, Archive, Trash2 } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

const SUBMISSIONS = [
  { id: "SUB-0041", name: "Layla Mansour",  email: "layla@email.com",   subject: "Workshop Collaboration Inquiry",       message: "Hi, I'm a ceramics artist and would love to propose a joint workshop series for the autumn season. Would love to chat!", type: "Inquiry",     date: "Jun 10, 2025", status: "Unread"  },
  { id: "SUB-0040", name: "Omar Benali",    email: "omar@email.com",    subject: "Private Event Catering Question",       message: "We're planning a 40-person birthday gathering and were wondering if Everwood caters for private events?",          type: "Inquiry",     date: "Jun 9, 2025",  status: "Replied" },
  { id: "SUB-0039", name: "Nadia Chérif",   email: "nadia@email.com",   subject: "Feedback — Spring Workshop",            message: "The terrarium workshop was absolutely beautiful. The space, the instruction, everything was perfect. Thank you!",   type: "Feedback",    date: "Jun 8, 2025",  status: "Replied" },
  { id: "SUB-0038", name: "Youssef H.",     email: "youssef@email.com", subject: "Press / Media Request",                 message: "We're working on a feature for a local lifestyle magazine and would love to visit Everwood for a shoot.",           type: "Press",       date: "Jun 7, 2025",  status: "Unread"  },
  { id: "SUB-0037", name: "Sara El Fassi",  email: "sara@email.com",    subject: "Gift Voucher Question",                 message: "Can I purchase a workshop gift voucher as a birthday present? Is there an option for a monetary value?",           type: "Inquiry",     date: "Jun 6, 2025",  status: "Replied" },
  { id: "SUB-0036", name: "Karim Jalil",    email: "karim@email.com",   subject: "Antiques — Valuation Request",          message: "I have an old Moroccan piece I'd like to have valued. Is this something Everwood offers?",                         type: "Inquiry",     date: "Jun 5, 2025",  status: "Archived" },
  { id: "SUB-0035", name: "Amira Tazi",     email: "amira@email.com",   subject: "Accessibility Info",                    message: "Hello, I use a wheelchair. Is the workshop space fully accessible? Thank you.",                                     type: "Inquiry",     date: "Jun 4, 2025",  status: "Replied" },
  { id: "SUB-0034", name: "Hassan Mrani",   email: "hassan@email.com",  subject: "Website Bug Report",                    message: "The booking calendar doesn't seem to load on Safari iOS. Might be worth checking!",                                 type: "Tech",        date: "Jun 3, 2025",  status: "Replied" },
];

const TYPE_COLORS: Record<string, string> = {
  Inquiry: D.blue, Feedback: D.green, Press: D.purple, Tech: D.amber,
};

const TABS = [
  { label: "All",      count: 8 },
  { label: "Unread",   count: 2 },
  { label: "Replied",  count: 5 },
  { label: "Archived", count: 1 },
];

const COLUMNS = [
  { key: "sender",  label: "Sender",   width: "180px" },
  { key: "subject", label: "Subject",  width: "2fr"   },
  { key: "type",    label: "Type",     width: "90px"  },
  { key: "date",    label: "Date",     width: "110px", mono: true },
  { key: "status",  label: "Status",   width: "110px" },
];

export default function SubmissionsPage() {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<typeof SUBMISSIONS[0] | null>(null);
  const [page, setPage] = useState(1);

  const filtered = SUBMISSIONS.filter(s => {
    if (tab === 1) return s.status === "Unread";
    if (tab === 2) return s.status === "Replied";
    if (tab === 3) return s.status === "Archived";
    return true;
  });

  const rows = filtered.map(s => ({
    sender: (
      <div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: s.status === "Unread" ? 600 : 400, color: s.status === "Unread" ? D.heading : D.body }}>{s.name}</p>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{s.email}</p>
      </div>
    ),
    subject: (
      <div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: s.status === "Unread" ? 600 : 400, color: s.status === "Unread" ? D.heading : D.body, marginBottom: 2 }}>{s.subject}</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 400 }}>{s.message}</p>
      </div>
    ),
    type:   <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: TYPE_COLORS[s.type] ?? D.subtle, background: (TYPE_COLORS[s.type] ?? D.subtle) + "15", borderRadius: 20, padding: "2px 8px" }}>{s.type}</span>,
    date:   <span style={{ fontFamily: "monospace", fontSize: 11, color: D.subtle }}>{s.date}</span>,
    status: <StatusBadge status={s.status} />,
  }));

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 16 }}>
      <div>
        <PageHeader
          title="Contact Submissions"
          breadcrumb={["Submissions"]}
          stats={[
            { label: "unread",  value: 2, color: D.gold  },
            { label: "total",   value: 8             },
            { label: "replied", value: 5, color: D.green },
          ]}
        />

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { icon: Inbox,   label: "Unread",    value: "2", color: D.gold   },
            { icon: Reply,   label: "Replied",   value: "5", color: D.green  },
            { icon: Archive, label: "Archived",  value: "1", color: D.subtle },
            { icon: Mail,    label: "This week", value: "8", color: D.blue   },
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
        <SearchBar placeholder="Search by name, subject..." />
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

            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 4 }}>{selected.subject}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>{selected.name}</span>
              <span style={{ color: D.muted }}>·</span>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: D.muted }}>{selected.email}</span>
            </div>

            <div style={{ background: D.raised, borderRadius: 8, padding: 14, marginBottom: 16, border: `1px solid ${D.border}` }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.body, lineHeight: 1.65 }}>{selected.message}</p>
            </div>

            {[
              ["Type", selected.type],
              ["Date", selected.date],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${D.border}` }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>{label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{value}</span>
              </div>
            ))}

            {/* Reply box */}
            <div style={{ marginTop: 16 }}>
              <textarea
                placeholder="Write a reply..."
                rows={4}
                style={{
                  width: "100%", background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8,
                  color: D.body, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                  padding: "10px 12px", resize: "vertical", outline: "none", boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button style={{ flex: 1, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer", background: D.gold + "18", border: `1px solid ${D.gold + "40"}`, color: D.gold, borderRadius: 6, padding: "8px", margin: 0 }}>
                  Send Reply
                </button>
                <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.subtle, borderRadius: 6, padding: "8px 12px", margin: 0 }}>
                  Archive
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
