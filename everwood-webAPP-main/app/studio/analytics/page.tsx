"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Eye, MousePointer, Clock, Globe } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { D, PageHeader } from "@/components/studio/StudioShell";

const RANGE_OPTIONS = ["7D", "30D", "90D"] as const;
type Range = typeof RANGE_OPTIONS[number];

const TRAFFIC: Record<Range, { label: string; visits: number; unique: number }[]> = {
  "7D": Array.from({ length: 7 }, (_, i) => ({
    label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    visits: 180 + i * 30 + Math.round(Math.sin(i) * 40),
    unique: 140 + i * 20 + Math.round(Math.sin(i) * 30),
  })),
  "30D": Array.from({ length: 30 }, (_, i) => ({
    label: `Day ${i + 1}`,
    visits: 150 + i * 8 + Math.round(Math.sin(i * 0.6) * 50),
    unique: 110 + i * 6 + Math.round(Math.sin(i * 0.6) * 35),
  })),
  "90D": Array.from({ length: 12 }, (_, i) => ({
    label: `W${i + 1}`,
    visits: 1000 + i * 80 + Math.round(Math.sin(i * 0.4) * 200),
    unique: 780 + i * 60 + Math.round(Math.sin(i * 0.4) * 150),
  })),
};

const TOP_PAGES = [
  { path: "/",             label: "Home",       visits: 3120, bounce: "38%" },
  { path: "/workshops",    label: "Workshops",  visits: 1840, bounce: "22%" },
  { path: "/events",       label: "Events",     visits: 1250, bounce: "41%" },
  { path: "/antiques",     label: "Antiques",   visits: 980,  bounce: "55%" },
  { path: "/menu",         label: "Menu",       visits: 860,  bounce: "48%" },
  { path: "/gallery",      label: "Gallery",    visits: 720,  bounce: "31%" },
  { path: "/contact",      label: "Contact",    visits: 540,  bounce: "29%" },
];

const SOURCES = [
  { name: "Direct",    value: 38, color: D.gold    },
  { name: "Search",    value: 29, color: D.green   },
  { name: "Social",    value: 22, color: D.purple  },
  { name: "Referral",  value: 11, color: D.blue    },
];

const COUNTRIES = [
  { name: "Egypt",       visits: 2140, pct: 56 },
  { name: "UAE",         visits: 620,  pct: 16 },
  { name: "UK",          visits: 380,  pct: 10 },
  { name: "France",      visits: 280,  pct: 7  },
  { name: "Other",       visits: 430,  pct: 11 },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.muted, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontFamily: "monospace", fontSize: 12, color: p.color ?? D.gold }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30D");

  const data = TRAFFIC[range];
  const totalVisits = data.reduce((s, d) => s + d.visits, 0);
  const totalUnique = data.reduce((s, d) => s + d.unique, 0);
  const maxPage = Math.max(...TOP_PAGES.map(p => p.visits));

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="Analytics"
        breadcrumb={["Analytics"]}
        stats={[
          { label: "visits (30d)", value: "3,847",  color: D.gold  },
          { label: "unique (30d)", value: "2,940",  color: D.green },
          { label: "bounce rate",  value: "38%"                    },
        ]}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {RANGE_OPTIONS.map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              fontFamily: "monospace", fontSize: 11, cursor: "pointer",
              background: range === r ? D.gold + "18" : D.raised,
              border: `1px solid ${range === r ? D.gold + "40" : D.border}`,
              color: range === r ? D.gold : D.subtle,
              borderRadius: 6, padding: "6px 12px", margin: 0,
            }}>{r}</button>
          ))}
        </div>
      </PageHeader>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { icon: Eye,         label: "Total visits",  value: totalVisits.toLocaleString(), color: D.gold   },
          { icon: Users,       label: "Unique visitors",value: totalUnique.toLocaleString(), color: D.green  },
          { icon: MousePointer,label: "Bounce rate",   value: "38%",                         color: D.blue   },
          { icon: Clock,       label: "Avg session",   value: "2m 14s",                      color: D.purple },
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

      {/* Main traffic chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading, marginBottom: 16 }}>Traffic Overview</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={D.gold} stopOpacity={0.3} />
                <stop offset="100%" stopColor={D.gold} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gUnique" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={D.blue} stopOpacity={0.2} />
                <stop offset="100%" stopColor={D.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={D.border} vertical={false} />
            <XAxis dataKey="label" tick={{ fontFamily: "monospace", fontSize: 10, fill: D.muted }} axisLine={false} tickLine={false} interval={range === "30D" ? 5 : 0} />
            <YAxis tick={{ fontFamily: "monospace", fontSize: 10, fill: D.muted }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="visits" name="Visits"  stroke={D.gold} strokeWidth={2} fill="url(#gVisits)" dot={false} />
            <Area type="monotone" dataKey="unique" name="Unique"  stroke={D.blue} strokeWidth={2} fill="url(#gUnique)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px 280px", gap: 16 }}>
        {/* Top pages */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading, marginBottom: 16 }}>Top Pages</p>
          {TOP_PAGES.map(p => (
            <div key={p.path} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{p.label}</span>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: D.gold }}>{p.visits.toLocaleString()}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: D.subtle }}>{p.bounce}</span>
                </div>
              </div>
              <div style={{ height: 3, background: D.border, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${(p.visits / maxPage) * 100}%`, height: "100%", background: D.gold, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Traffic sources */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading, marginBottom: 16 }}>Traffic Sources</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={SOURCES} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={40} strokeWidth={0}>
                {SOURCES.map((s) => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8 }} labelStyle={{ color: D.body }} />
            </PieChart>
          </ResponsiveContainer>
          {SOURCES.map(s => (
            <div key={s.name} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{s.name}</span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: D.subtle }}>{s.value}%</span>
            </div>
          ))}
        </motion.div>

        {/* Countries */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading, marginBottom: 16 }}>
            <Globe size={14} style={{ display: "inline", marginRight: 6, color: D.blue }} />
            Countries
          </p>
          {COUNTRIES.map(c => (
            <div key={c.name} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{c.name}</span>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: D.subtle }}>{c.pct}%</span>
              </div>
              <div style={{ height: 3, background: D.border, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${c.pct}%`, height: "100%", background: D.blue, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
