"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { D, PageHeader } from "@/components/studio/StudioShell";

const RANGE_OPTIONS = ["7D", "30D", "90D"] as const;
type Range = typeof RANGE_OPTIONS[number];

const REVENUE_DATA: Record<Range, { label: string; workshops: number; dining: number; antiques: number }[]> = {
  "7D": [
    { label: "Mon", workshops: 2200, dining: 1400, antiques: 0     },
    { label: "Tue", workshops: 900,  dining: 1800, antiques: 4800  },
    { label: "Wed", workshops: 3100, dining: 1200, antiques: 0     },
    { label: "Thu", workshops: 1800, dining: 2100, antiques: 0     },
    { label: "Fri", workshops: 2700, dining: 3400, antiques: 12500 },
    { label: "Sat", workshops: 4500, dining: 4200, antiques: 2200  },
    { label: "Sun", workshops: 3200, dining: 3800, antiques: 0     },
  ],
  "30D": Array.from({ length: 30 }, (_, i) => ({
    label:     `Day ${i + 1}`,
    workshops: 1000 + i * 60 + Math.round(Math.sin(i * 0.8) * 400),
    dining:    800  + i * 40 + Math.round(Math.sin(i * 0.6) * 300),
    antiques:  i % 7 === 4 ? 5000 + Math.random() * 8000 : 0,
  })),
  "90D": Array.from({ length: 13 }, (_, i) => ({
    label:     `W${i + 1}`,
    workshops: 8000  + i * 400 + Math.round(Math.sin(i * 0.4) * 1500),
    dining:    6000  + i * 300 + Math.round(Math.sin(i * 0.4) * 1000),
    antiques:  i % 3 === 0 ? 12000 + Math.random() * 10000 : 2000,
  })),
};

const BREAKDOWN = [
  { name: "Workshop Bookings", value: 28600, pct: 59, color: D.gold,   change: +12 },
  { name: "Dining & Coffee",   value: 14200, pct: 29, color: D.blue,   change: +7  },
  { name: "Antique Sales",     value: 5800,  pct: 12, color: D.purple, change: -3  },
];

const TRANSACTIONS = [
  { id: "TXN-0891", desc: "Pottery Workshop × 2",        date: "Jun 14", amount: 900,   type: "Workshop", status: "Paid"    },
  { id: "TXN-0890", desc: "Shibori Dyeing × 1",          date: "Jun 15", amount: 380,   type: "Workshop", status: "Paid"    },
  { id: "TXN-0889", desc: "Moroccan Cedar Cabinet",       date: "Jun 13", amount: 12500, type: "Antique",  status: "Paid"    },
  { id: "TXN-0888", desc: "Table Reservation × 4 covers",date: "Jun 14", amount: 620,   type: "Dining",   status: "Paid"    },
  { id: "TXN-0887", desc: "Terrarium Workshop × 3",       date: "Jun 14", amount: 960,   type: "Workshop", status: "Pending" },
  { id: "TXN-0886", desc: "Ottoman Copper Tray Set",      date: "Jun 11", amount: 2200,  type: "Antique",  status: "Paid"    },
];

const TYPE_COLORS: Record<string, string> = { Workshop: D.gold, Dining: D.blue, Antique: D.purple };

function RevTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + p.value, 0);
  return (
    <div style={{ background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8, padding: "10px 14px" }}>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.muted, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontFamily: "monospace", fontSize: 12, color: p.color }}>{p.name}: {p.value.toLocaleString()} EGP</p>
      ))}
      <p style={{ fontFamily: "monospace", fontSize: 12, color: D.heading, marginTop: 4, borderTop: `1px solid ${D.border}`, paddingTop: 4 }}>Total: {total.toLocaleString()} EGP</p>
    </div>
  );
}

export default function RevenuePage() {
  const [range, setRange] = useState<Range>("30D");
  const data = REVENUE_DATA[range];

  const totalRev = BREAKDOWN.reduce((s, b) => s + b.value, 0);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="Revenue"
        breadcrumb={["Revenue"]}
        stats={[
          { label: "this month",   value: "48,600 EGP", color: D.gold  },
          { label: "vs last month",value: "+14%",       color: D.green },
          { label: "outstanding",  value: "3,200 EGP",  color: D.amber },
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
          { icon: DollarSign,  label: "Total revenue",   value: "48,600 EGP", change: +14, color: D.gold   },
          { icon: Wallet,      label: "Workshops",        value: "28,600 EGP", change: +12, color: D.green  },
          { icon: TrendingUp,  label: "Dining",           value: "14,200 EGP", change: +7,  color: D.blue   },
          { icon: TrendingDown,label: "Antiques",         value: "5,800 EGP",  change: -3,  color: D.purple },
        ].map(({ icon: Icon, label, value, change, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: change >= 0 ? D.green : D.red }}>{change >= 0 ? "+" : ""}{change}%</span>
            </div>
            <p style={{ fontFamily: "monospace", fontSize: 17, fontWeight: 600, color: D.heading, lineHeight: 1, marginTop: 10 }}>{value}</p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginTop: 3 }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading, marginBottom: 16 }}>Revenue by Stream</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={range === "90D" ? 16 : 8}>
            <CartesianGrid strokeDasharray="3 3" stroke={D.border} vertical={false} />
            <XAxis dataKey="label" tick={{ fontFamily: "monospace", fontSize: 10, fill: D.muted }} axisLine={false} tickLine={false} interval={range === "30D" ? 4 : 0} />
            <YAxis tick={{ fontFamily: "monospace", fontSize: 10, fill: D.muted }} axisLine={false} tickLine={false} />
            <Tooltip content={<RevTooltip />} />
            <Bar dataKey="workshops" name="Workshops" stackId="a" fill={D.gold}   radius={[0, 0, 0, 0]} />
            <Bar dataKey="dining"    name="Dining"    stackId="a" fill={D.blue}   radius={[0, 0, 0, 0]} />
            <Bar dataKey="antiques"  name="Antiques"  stackId="a" fill={D.purple} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        {/* Recent transactions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading, marginBottom: 16 }}>Recent Transactions</p>
          {TRANSACTIONS.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.04 }}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${D.border}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: (TYPE_COLORS[t.type] ?? D.subtle) + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: TYPE_COLORS[t.type] ?? D.subtle }}>{t.type[0]}</span>
                </div>
                <div>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.body }}>{t.desc}</p>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{t.id} · {t.date}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "monospace", fontSize: 13, color: D.gold }}>{t.amount.toLocaleString()} EGP</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: t.status === "Paid" ? D.green : D.amber }}>{t.status}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading, marginBottom: 20 }}>Revenue Breakdown</p>
          {BREAKDOWN.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.08 }}
              style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.body }}>{b.name}</span>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: b.color }}>{b.value.toLocaleString()} EGP</span>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: D.muted, marginLeft: 6 }}>{b.pct}%</span>
                </div>
              </div>
              <div style={{ height: 6, background: D.border, borderRadius: 3, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                  style={{ height: "100%", background: b.color, borderRadius: 3 }}
                />
              </div>
            </motion.div>
          ))}
          <div style={{ paddingTop: 16, borderTop: `1px solid ${D.border}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.subtle }}>Total</span>
            <span style={{ fontFamily: "monospace", fontSize: 14, color: D.heading, fontWeight: 600 }}>{totalRev.toLocaleString()} EGP</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
