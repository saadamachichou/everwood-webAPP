"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import {
  Users, Scissors, Coffee, Mail, TrendingUp, ArrowUpRight,
  ArrowDownRight, Calendar, Plus, Send, BookOpen,
  ChevronRight, Eye, Zap, Activity, FileText, Truck,
} from "lucide-react";

// ── Design tokens ──────────────────────────────────────────────────
const D = {
  ground:  "#0F1117",
  surface: "#161B24",
  raised:  "#1E2433",
  border:  "#2A3142",
  muted:   "#3D4B63",
  subtle:  "#5A6B84",
  body:    "#C8D0DC",
  heading: "#E8ECF2",
  gold:    "#C9A96E",
  green:   "#3DD68C",
  amber:   "#F0A429",
  red:     "#F04438",
  blue:    "#4B8DDB",
  purple:  "#9B6DFF",
} as const;

// ── Mock data ──────────────────────────────────────────────────────
function genTraffic(days: number) {
  const base = 85;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
    const label = d.toLocaleDateString("en", { month: "short", day: "numeric" });
    const noise = Math.sin(i * 0.8) * 22 + Math.random() * 18;
    const trend = i * 1.2;
    return { label, visitors: Math.round(Math.max(20, base + noise + trend)), pageviews: Math.round(Math.max(30, (base + noise + trend) * 1.7)) };
  });
}

const TRAFFIC_DATA = genTraffic(30);

const REVENUE_BY_CAT = [
  { label: "Nature & Earth", value: 18400, color: D.green },
  { label: "Making & Craft",  value: 14200, color: D.gold  },
  { label: "Light & Wonder",  value: 9800,  color: D.purple },
  { label: "Imagination",     value: 6200,  color: D.blue  },
];

const ACTIVITY = [
  { id: 1, user: "MA", action: "Published workshop", target: "Shibori Indigo Dyeing", time: "2m ago",  type: "created" },
  { id: 2, user: "SA", action: "Updated article",    target: "Summer Collection",      time: "14m ago", type: "updated" },
  { id: 3, user: "MA", action: "Received booking",   target: "#WB-2024-0891",          time: "28m ago", type: "created" },
  { id: 4, user: "SY", action: "New subscriber",     target: "hello@gmail.com",        time: "45m ago", type: "created" },
  { id: 5, user: "MA", action: "Cancelled session",  target: "Pottery · Jun 28",       time: "1h ago",  type: "deleted" },
  { id: 6, user: "SY", action: "Updated SMTP config",target: "smtp.google.com",        time: "2h ago",  type: "updated" },
  { id: 7, user: "⚙", action: "Auto-saved campaign", target: "June Newsletter",        time: "2h ago",  type: "system"  },
  { id: 8, user: "MA", action: "Added antique item", target: "Victorian Compass",      time: "3h ago",  type: "created" },
];

const UPCOMING = [
  { id: 1, type: "workshop", title: "Pottery Evening",       date: "Sat 14 Jun", time: "6pm–8pm", spots: 6, max: 10, color: D.amber },
  { id: 2, type: "event",    title: "Summer Tasting Night",  date: "Sun 15 Jun", time: "8pm",      spots: 28, max: 40, color: D.blue  },
  { id: 3, type: "workshop", title: "Shibori Dyeing",        date: "Sat 21 Jun", time: "10am–1pm", spots: 4, max: 8,  color: D.amber },
  { id: 4, type: "email",    title: "June Newsletter",       date: "Mon 16 Jun", time: "10am",     spots: null, max: null, color: D.purple },
  { id: 5, type: "workshop", title: "Candle Workshop",       date: "Sat 21 Jun", time: "4pm–6pm",  spots: 8, max: 12, color: D.amber },
];

// ── Animated number ────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = "", suffix = "", delay = 0 }: {
  value: number; prefix?: string; suffix?: string; delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 55, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => spring.set(value), delay);
      return () => clearTimeout(t);
    }
  }, [inView, value, delay, spring]);

  useEffect(() => {
    return spring.on("change", v => setDisplay(Math.round(v)));
  }, [spring]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

// ── KPI Card ───────────────────────────────────────────────────────
function KPICard({ icon: Icon, label, value, prefix, suffix, trend, trendUp, color, delay }:{
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string; value: number; prefix?: string; suffix?: string;
  trend: string; trendUp: boolean; color: string; delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: D.surface,
        border: `1px solid ${hovered ? color + "50" : D.border}`,
        borderRadius: 10,
        padding: "18px 20px",
        position: "relative", overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s",
        boxShadow: hovered ? `0 0 0 1px ${color}20, 0 8px 32px rgba(0,0,0,0.4)` : "none",
      }}
    >
      {/* Gradient glow on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{
          position: "absolute", inset: 0, margin: 0,
          background: `radial-gradient(ellipse at 0% 0%, ${color}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: color + "18",
          border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={17} style={{ color }} />
        </div>

        <motion.div
          animate={{ scale: hovered ? 1.05 : 1 }}
          style={{
            display: "flex", alignItems: "center", gap: 3,
            background: trendUp ? "rgba(61,214,140,0.12)" : "rgba(240,68,56,0.12)",
            border: `1px solid ${trendUp ? "rgba(61,214,140,0.25)" : "rgba(240,68,56,0.25)"}`,
            borderRadius: 20, padding: "2px 8px",
          }}
        >
          {trendUp ? <ArrowUpRight size={10} style={{ color: D.green }} /> : <ArrowDownRight size={10} style={{ color: D.red }} />}
          <span style={{ fontFamily: "monospace", fontSize: 11, color: trendUp ? D.green : D.red }}>{trend}</span>
        </motion.div>
      </div>

      {/* Value */}
      <p style={{
        fontFamily: "'JetBrains Mono', 'DM Mono', monospace",
        fontSize: 30, fontWeight: 500, color: D.heading,
        lineHeight: 1, marginBottom: 6,
      }}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} delay={delay * 1000} />
      </p>

      {/* Label */}
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 12, color: D.subtle, letterSpacing: "0.02em",
      }}>
        {label}
      </p>

      {/* Bottom accent line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 1, background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          transformOrigin: "left",
        }}
      />
    </motion.div>
  );
}

// ── Custom Recharts tooltip ────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: D.raised, border: `1px solid ${D.border}`,
      borderRadius: 8, padding: "10px 14px",
      boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
    }}>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ fontFamily: "monospace", fontSize: 13, color: p.dataKey === "visitors" ? D.gold : D.blue, margin: "2px 0" }}>
          {p.dataKey === "visitors" ? "Visitors" : "Page Views"}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

// ── Traffic chart ──────────────────────────────────────────────────
function TrafficChart() {
  const [range, setRange] = useState<"7D" | "30D" | "90D">("30D");
  const data = range === "7D" ? TRAFFIC_DATA.slice(-7) : range === "30D" ? TRAFFIC_DATA : TRAFFIC_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      style={{
        background: D.surface, border: `1px solid ${D.border}`,
        borderRadius: 12, padding: "20px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 2 }}>
            Site Traffic
          </p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>
            Unique visitors & page views
          </p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["7D", "30D", "90D"] as const).map(r => (
            <motion.button
              key={r}
              onClick={() => setRange(r)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 11,
                padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                border: `1px solid ${range === r ? D.gold + "60" : D.border}`,
                background: range === r ? D.gold + "12" : "transparent",
                color: range === r ? D.gold : D.subtle,
                margin: 0,
              }}
            >
              {r}
            </motion.button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={D.gold} stopOpacity={0.25} />
              <stop offset="100%" stopColor={D.gold} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gPageviews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={D.blue} stopOpacity={0.18} />
              <stop offset="100%" stopColor={D.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={D.border} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontFamily: "Space Grotesk", fontSize: 10, fill: D.subtle }}
            axisLine={false} tickLine={false}
            interval={range === "7D" ? 0 : 5}
          />
          <YAxis
            tick={{ fontFamily: "Space Grotesk", fontSize: 10, fill: D.subtle }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="pageviews"
            stroke={D.blue} strokeWidth={1.5}
            fill="url(#gPageviews)" dot={false}
          />
          <Area
            type="monotone" dataKey="visitors"
            stroke={D.gold} strokeWidth={2}
            fill="url(#gVisitors)" dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        {[{ color: D.gold, label: "Unique Visitors" }, { color: D.blue, label: "Page Views" }].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 2, borderRadius: 1, background: color }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Revenue by category ────────────────────────────────────────────
function RevenueBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      style={{
        background: D.surface, border: `1px solid ${D.border}`,
        borderRadius: 12, padding: "20px 24px",
      }}
    >
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 4 }}>Revenue by Category</p>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginBottom: 18 }}>This month · EGP</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {REVENUE_BY_CAT.map(({ label, value, color }, i) => {
          const pct = Math.round((value / Math.max(...REVENUE_BY_CAT.map(r => r.value))) * 100);
          return (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color }}>{value.toLocaleString()}</span>
              </div>
              <div style={{ height: 4, background: D.border, borderRadius: 2, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${pct}%` } : {}}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${color}80, ${color})` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Upcoming schedule ──────────────────────────────────────────────
function UpcomingSchedule() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      style={{
        background: D.surface, border: `1px solid ${D.border}`,
        borderRadius: 12, padding: "20px 0", overflow: "hidden",
      }}
    >
      <div style={{ padding: "0 20px 16px", borderBottom: `1px solid ${D.border}` }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 2 }}>Upcoming</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>Next 7 days</p>
      </div>

      <div>
        {UPCOMING.map(({ id, type, title, date, time, spots, max, color }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.08 }}
            whileHover={{ backgroundColor: D.raised }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 20px", cursor: "pointer",
              borderBottom: i < UPCOMING.length - 1 ? `1px solid ${D.border}` : "none",
            }}
          >
            {/* Type badge */}
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: color, flexShrink: 0,
              boxShadow: `0 0 6px ${color}80`,
            }} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>
              <p style={{ fontFamily: "monospace", fontSize: 11, color: D.subtle }}>{date} · {time}</p>
            </div>

            {spots !== null && max !== null && (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontFamily: "monospace", fontSize: 11, color, marginBottom: 3 }}>{spots}/{max}</p>
                <div style={{ width: 48, height: 3, background: D.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${(spots / max) * 100}%`, height: "100%", background: color, borderRadius: 2 }} />
                </div>
              </div>
            )}
            {spots === null && (
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 10,
                color: D.purple, background: "rgba(155,109,255,0.12)",
                border: "1px solid rgba(155,109,255,0.25)",
                borderRadius: 20, padding: "2px 8px",
              }}>Send</span>
            )}
          </motion.div>
        ))}
      </div>

      <div style={{ padding: "12px 20px 0", borderTop: `1px solid ${D.border}` }}>
        <Link href="/studio/events" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.gold, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
          View all schedule <ChevronRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Activity feed ──────────────────────────────────────────────────
const TYPE_CONFIG = {
  created: { color: D.green,  bg: "rgba(61,214,140,0.08)"  },
  updated: { color: D.amber,  bg: "rgba(240,164,41,0.08)"  },
  deleted: { color: D.red,    bg: "rgba(240,68,56,0.08)"   },
  system:  { color: D.blue,   bg: "rgba(75,141,219,0.08)"  },
} as const;

function ActivityFeed() {
  const [liveCount, setLiveCount] = useState(4);
  useEffect(() => {
    const id = setInterval(() => setLiveCount(n => n + Math.floor(Math.random() * 2)), 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      style={{
        background: D.surface, border: `1px solid ${D.border}`,
        borderRadius: 12, overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "18px 20px 16px", borderBottom: `1px solid ${D.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 2 }}>Activity</p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>Live feed · auto-refreshes</p>
        </div>
        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(61,214,140,0.08)", border: "1px solid rgba(61,214,140,0.2)", borderRadius: 20, padding: "4px 10px" }}>
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: D.green }}
          />
          <span style={{ fontFamily: "monospace", fontSize: 10, color: D.green }}>LIVE</span>
        </div>
      </div>

      {/* Feed */}
      <div style={{ maxHeight: 340, overflowY: "auto" }}>
        <AnimatePresence>
          {ACTIVITY.map(({ id, user, action, target, time, type }, i) => {
            const cfg = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.06 }}
                whileHover={{ backgroundColor: D.raised }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "11px 20px",
                  borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${D.border}` : "none",
                  cursor: "pointer",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: cfg.bg, border: `1px solid ${cfg.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: cfg.color }}>{user}</span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body, lineHeight: 1.4 }}>
                    <span>{action} </span>
                    <span style={{ color: D.heading, fontWeight: 500 }}>{target}</span>
                  </p>
                </div>

                {/* Time */}
                <span style={{ fontFamily: "monospace", fontSize: 10, color: D.muted, flexShrink: 0 }}>{time}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div style={{ padding: "12px 20px", borderTop: `1px solid ${D.border}` }}>
        <Link href="/studio/audit" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.gold, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
          Full audit log <ChevronRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Quick actions ──────────────────────────────────────────────────
const QUICK = [
  { icon: Plus,     label: "New Workshop",    sub: "Add to atelier",       href: "/studio/workshops/new", color: D.amber  },
  { icon: FileText, label: "New Article",     sub: "Publish to gallery",   href: "/studio/gallery/new",   color: D.blue   },
  { icon: Calendar, label: "New Event",       sub: "Add to the stage",     href: "/studio/events/new",    color: D.purple },
  { icon: Send,     label: "Send Newsletter", sub: "Compose campaign",     href: "/studio/newsletter",    color: D.green  },
  { icon: BookOpen, label: "View Bookings",   sub: "7 new today",          href: "/studio/bookings",      color: D.gold   },
  { icon: Truck,    label: "COD Dispatch",    sub: "Assign riders",        href: "/studio/cod",           color: D.blue   },
];

function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75, duration: 0.5 }}
      style={{
        background: D.surface, border: `1px solid ${D.border}`,
        borderRadius: 12, padding: "20px",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 2 }}>Quick Actions</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>Frequent operations</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {QUICK.map(({ icon: Icon, label, sub, href, color }, i) => (
          <Link key={label} href={href} style={{ textDecoration: "none" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.85 + i * 0.06 }}
              whileHover={{ scale: 1.03, borderColor: color + "50" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: D.raised, border: `1px solid ${D.border}`,
                borderRadius: 9, padding: "14px 14px",
                cursor: "pointer", position: "relative", overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: color + "18",
                border: `1px solid ${color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 8,
              }}>
                <Icon size={15} style={{ color }} />
              </div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 500, color: D.heading, marginBottom: 2 }}>{label}</p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>{sub}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ── Real-time pulse bar ─────────────────────────────────────────────
function LivePulse() {
  const [count, setCount] = useState(12);
  useEffect(() => {
    const id = setInterval(() => setCount(n => Math.max(5, n + Math.floor((Math.random() - 0.4) * 3))), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(61,214,140,0.08)", border: "1px solid rgba(61,214,140,0.2)",
        borderRadius: 20, padding: "5px 12px",
      }}
    >
      <motion.div
        animate={{ opacity: [1, 0.2, 1], scale: [1, 0.8, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{ width: 6, height: 6, borderRadius: "50%", background: D.green }}
      />
      <span style={{ fontFamily: "monospace", fontSize: 11, color: D.green }}>
        <AnimatedNumber value={count} /> live now
      </span>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────
export default function StudioOverview() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 24, fontWeight: 600, color: D.heading,
              marginBottom: 4, lineHeight: 1.2,
            }}>
              {greeting}, Sarvind.
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.subtle }}>
                {dateStr}
              </p>
              <span style={{ color: D.muted }}>·</span>
              <LivePulse />
            </div>
          </div>

          {/* Summary badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "7 new bookings", color: D.gold,   bg: "rgba(201,169,110,0.10)"  },
              { label: "4 submissions",  color: D.amber,  bg: "rgba(240,164,41,0.10)"  },
              { label: "3 drafts",       color: D.subtle, bg: "rgba(90,107,132,0.10)"  },
            ].map(({ label, color, bg }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                style={{
                  background: bg, border: `1px solid ${color}30`,
                  borderRadius: 20, padding: "5px 12px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 12, color, cursor: "pointer",
                }}
              >
                {label}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        <KPICard icon={Users}       label="Visitors this month"      value={3847}  trend="+18%"  trendUp color={D.blue}   delay={0.1} />
        <KPICard icon={Scissors}    label="Workshop bookings"        value={127}   trend="+12%"  trendUp color={D.amber}  delay={0.18} />
        <KPICard icon={Coffee}      label="Table reservations"       value={84}    trend="+7%"   trendUp color={D.green}  delay={0.26} />
        <KPICard icon={Mail}        label="Newsletter subscribers"   value={1240}  trend="+43"   trendUp color={D.purple} delay={0.34} />
        <KPICard icon={TrendingUp}  label="Revenue this month"       value={48600} prefix="EGP " trend="+22%" trendUp color={D.gold} delay={0.42} />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, marginBottom: 16 }}>
        <TrafficChart />
        <UpcomingSchedule />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <RevenueBar />
          <QuickActions />
        </div>
        <ActivityFeed />
      </div>

      {/* Bottom stat strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
          marginTop: 4,
        }}
      >
        {[
          { icon: Eye,      label: "Page views today",  value: "1,284",  color: D.blue   },
          { icon: Activity, label: "Avg session time",  value: "3m 42s", color: D.green  },
          { icon: Zap,      label: "Bounce rate",       value: "38.4%",  color: D.gold   },
          { icon: Users,    label: "Returning visitors",value: "62%",    color: D.purple },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + i * 0.07 }}
            whileHover={{ borderColor: color + "40" }}
            style={{
              background: D.surface, border: `1px solid ${D.border}`,
              borderRadius: 10, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 12,
              cursor: "pointer", transition: "border-color 0.2s",
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: color + "15",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Icon size={14} style={{ color }} />
            </div>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 500, color: D.heading, lineHeight: 1, marginBottom: 4 }}>{value}</p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
