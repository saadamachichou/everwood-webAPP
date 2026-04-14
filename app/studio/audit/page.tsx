"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Filter } from "lucide-react";
import { D, PageHeader, SearchBar, DataTable, Pagination } from "@/components/studio/StudioShell";

const AUDIT_LOG = [
  { id: "LOG-0541", user: "Sarvind A.",    action: "Published workshop",      target: "Wheel Throwing Pottery",      ip: "197.32.x.x", date: "Jun 10, 10:42 AM", type: "Create"  },
  { id: "LOG-0540", user: "Layla M.",      action: "Replied to submission",   target: "SUB-0041 — Layla Mansour",    ip: "196.14.x.x", date: "Jun 10, 10:31 AM", type: "Update"  },
  { id: "LOG-0539", user: "Sarvind A.",    action: "Updated menu item",       target: "Iced Jasmine Latte",          ip: "197.32.x.x", date: "Jun 10, 10:15 AM", type: "Update"  },
  { id: "LOG-0538", user: "Sarvind A.",    action: "Added antique",           target: "Hand-painted Silk Suzani",    ip: "197.32.x.x", date: "Jun 9, 6:04 PM",   type: "Create"  },
  { id: "LOG-0537", user: "Omar B.",       action: "Confirmed booking",       target: "WB-2024-0891 — Layla M.",    ip: "102.45.x.x", date: "Jun 9, 4:22 PM",   type: "Update"  },
  { id: "LOG-0536", user: "Layla M.",      action: "Created event",           target: "Jazz in the Garden",          ip: "196.14.x.x", date: "Jun 9, 2:10 PM",   type: "Create"  },
  { id: "LOG-0535", user: "Sarvind A.",    action: "Sent newsletter campaign","target": "May Workshop Spotlight",    ip: "197.32.x.x", date: "Jun 9, 11:00 AM",  type: "Send"    },
  { id: "LOG-0534", user: "System",        action: "Auto-archived submission", target: "SUB-0036 — Karim J.",        ip: "—",          date: "Jun 9, 9:00 AM",   type: "System"  },
  { id: "LOG-0533", user: "Sarvind A.",    action: "Updated SEO settings",    target: "/workshops",                  ip: "197.32.x.x", date: "Jun 8, 7:44 PM",   type: "Update"  },
  { id: "LOG-0532", user: "Nadia C.",      action: "Marked reservation attended","target": "R-2024-0235 — Amira T.", ip: "41.67.x.x",  date: "Jun 8, 11:22 PM",  type: "Update"  },
  { id: "LOG-0531", user: "Sarvind A.",    action: "Invited team member",     target: "guest@example.com",           ip: "197.32.x.x", date: "Jun 8, 3:30 PM",   type: "Create"  },
  { id: "LOG-0530", user: "Sarvind A.",    action: "Cancelled booking",       target: "WB-2024-0886 — Karim J.",    ip: "197.32.x.x", date: "Jun 7, 2:00 PM",   type: "Delete"  },
];

const TYPE_COLORS: Record<string, string> = {
  Create: D.green, Update: D.blue, Delete: D.red, Send: D.purple, System: D.subtle,
};

const COLUMNS = [
  { key: "id",     label: "Log ID",  width: "100px", mono: true },
  { key: "user",   label: "User",    width: "120px" },
  { key: "action", label: "Action",  width: "2fr"   },
  { key: "type",   label: "Type",    width: "90px"  },
  { key: "ip",     label: "IP",      width: "110px", mono: true },
  { key: "date",   label: "Date",    width: "150px", mono: true },
];

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("All");

  const types = ["All", "Create", "Update", "Delete", "Send", "System"];
  const filtered = AUDIT_LOG.filter(l => typeFilter === "All" || l.type === typeFilter);

  const rows = filtered.map(l => ({
    id:     <span style={{ fontFamily: "monospace", fontSize: 11, color: D.muted }}>{l.id}</span>,
    user:   (
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: l.user === "System" ? D.border : D.gold + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: l.user === "System" ? D.muted : D.gold }}>{l.user === "System" ? "SYS" : l.user.split(" ").map(w => w[0]).join("")}</span>
        </div>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{l.user}</span>
      </div>
    ),
    action: (
      <div>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.body }}>{l.action}: </span>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: D.subtle }}>{l.target}</span>
      </div>
    ),
    type:   <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: TYPE_COLORS[l.type] ?? D.subtle, background: (TYPE_COLORS[l.type] ?? D.subtle) + "15", borderRadius: 20, padding: "2px 8px" }}>{l.type}</span>,
    ip:     <span style={{ fontFamily: "monospace", fontSize: 11, color: D.muted }}>{l.ip}</span>,
    date:   <span style={{ fontFamily: "monospace", fontSize: 11, color: D.subtle }}>{l.date}</span>,
  }));

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="Audit Log"
        breadcrumb={["Audit"]}
        stats={[
          { label: "events today", value: 8, color: D.gold },
          { label: "total",        value: AUDIT_LOG.length },
        ]}
      />

      {/* Type filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <Filter size={14} style={{ color: D.subtle, alignSelf: "center" }} />
        {types.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer",
            background: typeFilter === t ? (TYPE_COLORS[t] ? TYPE_COLORS[t] + "18" : D.gold + "18") : D.raised,
            border: `1px solid ${typeFilter === t ? (TYPE_COLORS[t] ? TYPE_COLORS[t] + "50" : D.gold + "40") : D.border}`,
            color: typeFilter === t ? (TYPE_COLORS[t] ?? D.gold) : D.subtle,
            borderRadius: 20, padding: "5px 14px", margin: 0,
          }}>{t}</button>
        ))}
      </div>

      <SearchBar placeholder="Search log entries..." />
      <DataTable columns={COLUMNS} rows={rows} />
      <Pagination total={filtered.length} perPage={20} page={page} onChange={setPage} />
    </div>
  );
}
