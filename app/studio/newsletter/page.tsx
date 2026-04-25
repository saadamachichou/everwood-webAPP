"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Users, TrendingUp, MousePointer } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

const growth = Array.from({ length: 30 }, (_, i) => ({
  label: `Day ${i + 1}`,
  subscribers: 800 + i * 14 + Math.round(Math.sin(i * 0.9) * 25),
}));

const CAMPAIGNS = [
  { id: "C-007", name: "June Newsletter",        status: "Draft",     sent: "—",          recipients: 0,    opens: "—",   clicks: "—"   },
  { id: "C-006", name: "May Workshop Spotlight", status: "Sent",      sent: "May 15",     recipients: 1180, opens: "34%", clicks: "8%"  },
  { id: "C-005", name: "Mother's Day Special",   status: "Sent",      sent: "May 11",     recipients: 1165, opens: "41%", clicks: "12%" },
  { id: "C-004", name: "New Antiques — April",   status: "Sent",      sent: "Apr 22",     recipients: 1140, opens: "29%", clicks: "6%"  },
  { id: "C-003", name: "Spring Opening",         status: "Sent",      sent: "Mar 31",     recipients: 1090, opens: "52%", clicks: "18%" },
];

const SUBSCRIBERS = [
  { email: "layla@example.com",   name: "Layla M.", source: "Website", date: "Jun 2025", status: "Active",       tags: ["workshop"] },
  { email: "omar@example.com",    name: "Omar B.",  source: "Booking", date: "May 2025", status: "Active",       tags: ["pottery"]  },
  { email: "nadia@example.com",   name: "Nadia C.", source: "Website", date: "May 2025", status: "Active",       tags: []           },
  { email: "test@example.com",    name: "—",        source: "Import",  date: "Apr 2025", status: "Unsubscribed", tags: []           },
  { email: "bounce@example.com",  name: "—",        source: "Import",  date: "Mar 2025", status: "Bounced",      tags: []           },
];

const CAM_COLS = [
  { key: "name",       label: "Campaign",    width: "2fr"   },
  { key: "status",     label: "Status",      width: "110px" },
  { key: "sent",       label: "Sent",        width: "90px",  mono: true },
  { key: "recipients", label: "Recipients",  width: "100px", mono: true, align: "right" as const },
  { key: "opens",      label: "Open rate",   width: "90px",  mono: true, align: "right" as const },
  { key: "clicks",     label: "Click rate",  width: "90px",  mono: true, align: "right" as const },
];

const SUB_COLS = [
  { key: "email",  label: "Email",   width: "2fr",   mono: true },
  { key: "name",   label: "Name",    width: "120px" },
  { key: "source", label: "Source",  width: "90px"  },
  { key: "date",   label: "Joined",  width: "90px",  mono: true },
  { key: "status", label: "Status",  width: "120px" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ fontFamily: "monospace", fontSize: 13, color: D.gold }}>{payload[0].value.toLocaleString()} subscribers</p>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>{label}</p>
    </div>
  );
}

export default function NewsletterPage() {
  const [section, setSection] = useState<"campaigns" | "subscribers">("campaigns");
  const [tab, setTab] = useState(0);

  const camRows = CAMPAIGNS.map(c => ({
    name: <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading }}>{c.name}</p>,
    status: <StatusBadge status={c.status} />,
    sent: <span style={{ fontFamily: "monospace", fontSize: 12, color: D.subtle }}>{c.sent}</span>,
    recipients: <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{c.recipients > 0 ? c.recipients.toLocaleString() : "—"}</span>,
    opens: <span style={{ fontFamily: "monospace", fontSize: 12, color: Number(c.opens?.replace("%", "")) > 35 ? D.green : D.body }}>{c.opens}</span>,
    clicks: <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{c.clicks}</span>,
  }));

  const subRows = SUBSCRIBERS.map(s => ({
    email:  <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{s.email}</span>,
    name:   <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>{s.name}</span>,
    source: <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, background: D.raised, borderRadius: 10, padding: "2px 8px" }}>{s.source}</span>,
    date:   <span style={{ fontFamily: "monospace", fontSize: 11, color: D.subtle }}>{s.date}</span>,
    status: <StatusBadge status={s.status} />,
  }));

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="Newsletter"
        breadcrumb={["Newsletter"]}
        stats={[{ label: "subscribers", value: "1,240", color: D.gold }, { label: "avg open rate", value: "38%", color: D.green }]}
        action={{ label: "New Campaign" }}
      />

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { icon: Users,       label: "Total subscribers",  value: "1,240", color: D.gold   },
          { icon: Mail,        label: "Campaigns sent",     value: "12",    color: D.blue   },
          { icon: TrendingUp,  label: "Avg open rate",      value: "38%",   color: D.green  },
          { icon: MousePointer,label: "Avg click rate",     value: "9.4%",  color: D.purple },
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

      {/* Growth chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading, marginBottom: 4 }}>Subscriber Growth</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginBottom: 16 }}>Last 30 days</p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={growth}>
            <defs>
              <linearGradient id="gSubs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={D.gold} stopOpacity={0.3} />
                <stop offset="100%" stopColor={D.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={D.border} vertical={false} />
            <XAxis dataKey="label" tick={{ fontFamily: "Space Grotesk", fontSize: 10, fill: D.muted }} axisLine={false} tickLine={false} interval={6} />
            <YAxis tick={{ fontFamily: "Space Grotesk", fontSize: 10, fill: D.muted }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="subscribers" stroke={D.gold} strokeWidth={2} fill="url(#gSubs)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Section toggle */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {(["campaigns", "subscribers"] as const).map(s => (
          <button key={s} onClick={() => setSection(s)} style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer",
            background: section === s ? D.gold + "18" : D.raised,
            border: `1px solid ${section === s ? D.gold + "40" : D.border}`,
            color: section === s ? D.gold : D.subtle, borderRadius: 7,
            padding: "7px 16px", margin: 0, textTransform: "capitalize",
          }}>{s}</button>
        ))}
      </div>

      {section === "campaigns" ? (
        <DataTable columns={CAM_COLS} rows={camRows} />
      ) : (
        <>
          <SearchBar placeholder="Search subscribers..." />
          <DataTable columns={SUB_COLS} rows={subRows} />
          <Pagination total={1240} perPage={20} page={1} onChange={() => {}} />
        </>
      )}
    </div>
  );
}
