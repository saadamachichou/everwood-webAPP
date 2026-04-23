"use client";
import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Plus, Filter, ChevronRight, ChevronDown, MoreHorizontal, Check, X, AlertCircle } from "lucide-react";

export const D = {
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

// ── Status badge ───────────────────────────────────────────────────
const STATUS_MAP: Record<string, { color: string; bg: string; dot: string }> = {
  published:   { color: D.green,  bg: "rgba(61,214,140,0.10)",   dot: D.green  },
  live:        { color: D.green,  bg: "rgba(61,214,140,0.10)",   dot: D.green  },
  active:      { color: D.green,  bg: "rgba(61,214,140,0.10)",   dot: D.green  },
  confirmed:   { color: D.green,  bg: "rgba(61,214,140,0.10)",   dot: D.green  },
  attended:    { color: D.green,  bg: "rgba(61,214,140,0.10)",   dot: D.green  },
  available:   { color: D.green,  bg: "rgba(61,214,140,0.10)",   dot: D.green  },
  delivered:   { color: D.green,  bg: "rgba(61,214,140,0.10)",   dot: D.green  },
  draft:       { color: D.amber,  bg: "rgba(240,164,41,0.10)",   dot: D.amber  },
  pending:     { color: D.amber,  bg: "rgba(240,164,41,0.10)",   dot: D.amber  },
  reserved:    { color: D.amber,  bg: "rgba(240,164,41,0.10)",   dot: D.amber  },
  unassigned:  { color: D.amber,  bg: "rgba(240,164,41,0.10)",   dot: D.amber  },
  scheduled:   { color: D.blue,   bg: "rgba(75,141,219,0.10)",   dot: D.blue   },
  assigned:    { color: D.blue,   bg: "rgba(75,141,219,0.10)",   dot: D.blue   },
  "in transit":{ color: D.blue,   bg: "rgba(75,141,219,0.10)",   dot: D.blue   },
  featured:    { color: D.purple, bg: "rgba(155,109,255,0.10)",  dot: D.purple },
  archived:    { color: D.subtle, bg: "rgba(90,107,132,0.10)",   dot: D.subtle },
  cancelled:   { color: D.red,    bg: "rgba(240,68,56,0.10)",    dot: D.red    },
  failed:      { color: D.red,    bg: "rgba(240,68,56,0.10)",    dot: D.red    },
  sold:        { color: D.subtle, bg: "rgba(90,107,132,0.10)",   dot: D.subtle },
  unread:      { color: D.gold,   bg: "rgba(201,169,110,0.12)",  dot: D.gold   },
  replied:     { color: D.green,  bg: "rgba(61,214,140,0.10)",   dot: D.green  },
  bounced:     { color: D.red,    bg: "rgba(240,68,56,0.10)",    dot: D.red    },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status.toLowerCase()] ?? STATUS_MAP.archived;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      borderRadius: 20, padding: "2px 8px",
      fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 500,
      textTransform: "capitalize", letterSpacing: "0.02em",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

// ── Page header ────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  stats?: { label: string; value: string | number; color?: string }[];
  breadcrumb?: string[];
  action?: { label: string; href?: string; onClick?: () => void };
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, stats, breadcrumb, action, children }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 24 }}
    >
      {breadcrumb && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Link href="/studio" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, textDecoration: "none" }}>Studio</Link>
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ChevronRight size={11} style={{ color: D.muted }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: i === breadcrumb.length - 1 ? D.body : D.subtle }}>{crumb}</span>
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 600, color: D.heading, marginBottom: 4 }}>{title}</h1>
          {subtitle && (
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.subtle }}>{subtitle}</p>
          )}
          {stats && (
            <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
              {stats.map(({ label, value, color }) => (
                <span key={label} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>
                  <span style={{ fontFamily: "monospace", color: color ?? D.body, fontWeight: 600, marginRight: 4 }}>{value}</span>
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {children}
          {action && (
            action.href ? (
              <Link href={action.href} style={{ textDecoration: "none" }}>
                <ActionButton label={action.label} />
              </Link>
            ) : (
              <ActionButton label={action.label} onClick={action.onClick} />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ActionButton({ label, onClick, variant = "primary" }: { label: string; onClick?: () => void; variant?: "primary" | "ghost" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        background: variant === "primary" ? `linear-gradient(135deg, ${D.gold}, #D4943A)` : "transparent",
        border: variant === "ghost" ? `1px solid ${D.border}` : "none",
        borderRadius: 7, color: variant === "primary" ? "#1A120A" : D.body,
        padding: "0 14px", height: 34,
        fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600,
        cursor: "pointer", margin: 0,
      }}
    >
      <Plus size={13} />
      {label}
    </motion.button>
  );
}

// ── Tab bar ────────────────────────────────────────────────────────
interface Tab { label: string; count?: number }
export function TabBar({ tabs, active, onChange }: { tabs: Tab[]; active: number; onChange: (i: number) => void }) {
  return (
    <div style={{
      display: "flex", gap: 0,
      borderBottom: `1px solid ${D.border}`,
      marginBottom: 20,
    }}>
      {tabs.map(({ label, count }, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
            color: active === i ? D.gold : D.subtle,
            background: "transparent", border: "none",
            padding: "10px 16px", cursor: "pointer",
            position: "relative", margin: 0,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {label}
          {count !== undefined && (
            <span style={{
              fontFamily: "monospace", fontSize: 10,
              background: active === i ? D.gold + "20" : D.raised,
              color: active === i ? D.gold : D.muted,
              borderRadius: 10, padding: "1px 6px",
            }}>{count}</span>
          )}
          {active === i && (
            <motion.div
              layoutId="tabLine"
              style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 2, background: D.gold, borderRadius: "2px 2px 0 0" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Search + filter bar ────────────────────────────────────────────
export function SearchBar({ placeholder = "Search...", onSearch }: { placeholder?: string; onSearch?: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
      <motion.div
        animate={{ width: focused ? 320 : 260 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "relative", display: "flex", alignItems: "center", gap: 8,
          background: D.raised, border: `1px solid ${focused ? D.gold + "50" : D.border}`,
          borderRadius: 7, padding: "0 12px", height: 34,
          boxShadow: focused ? `0 0 0 3px ${D.gold}10` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <Search size={13} style={{ color: D.muted, flexShrink: 0 }} />
        <input
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onSearch?.(e.target.value)}
          style={{ background: "transparent", border: "none", outline: "none", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.body, width: "100%" }}
        />
      </motion.div>
      <button style={{
        display: "flex", alignItems: "center", gap: 6,
        background: D.raised, border: `1px solid ${D.border}`,
        borderRadius: 7, color: D.subtle,
        padding: "0 12px", height: 34, cursor: "pointer",
        fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, margin: 0,
      }}>
        <Filter size={12} /> Filters
      </button>
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────
interface Column { key: string; label: string; width?: string | number; mono?: boolean; align?: "left" | "right" | "center" }
interface Row { [key: string]: ReactNode }

export function DataTable({ columns, rows, onRowClick }: { columns: Column[]; rows: Row[]; onRowClick?: (row: Row, index: number) => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const toggleRow = (i: number) => {
    const s = new Set(selected);
    s.has(i) ? s.delete(i) : s.add(i);
    setSelected(s);
  };

  return (
    <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        display: "grid", gridTemplateColumns: `36px ${columns.map(c => c.width ?? "1fr").join(" ")} 80px`,
        background: D.raised, borderBottom: `1px solid ${D.border}`,
        padding: "0 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", height: 40 }}>
          <input type="checkbox" style={{ accentColor: D.gold, cursor: "pointer" }} />
        </div>
        {columns.map(col => (
          <div key={col.key} style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 500,
            color: D.subtle, textTransform: "uppercase", letterSpacing: "0.08em",
            display: "flex", alignItems: "center", height: 40,
            cursor: "pointer", userSelect: "none",
            justifyContent: col.align === "right" ? "flex-end" : "flex-start",
          }}>
            {col.label}
          </div>
        ))}
        <div />
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          onHoverStart={() => setHoveredRow(i)}
          onHoverEnd={() => setHoveredRow(null)}
          onClick={() => onRowClick?.(row, i)}
          style={{
            display: "grid",
            gridTemplateColumns: `36px ${columns.map(c => c.width ?? "1fr").join(" ")} 80px`,
            padding: "0 16px",
            background: selected.has(i) ? "rgba(201,169,110,0.05)" : hoveredRow === i ? D.raised : "transparent",
            borderBottom: i < rows.length - 1 ? `1px solid ${D.border}` : "none",
            borderLeft: selected.has(i) ? `2px solid ${D.gold}` : "2px solid transparent",
            cursor: onRowClick ? "pointer" : "default",
            transition: "background 0.1s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", height: 52 }} onClick={e => { e.stopPropagation(); toggleRow(i); }}>
            <input type="checkbox" checked={selected.has(i)} onChange={() => {}} style={{ accentColor: D.gold, cursor: "pointer" }} />
          </div>
          {columns.map(col => (
            <div key={col.key} style={{
              display: "flex", alignItems: "center", height: 52,
              fontFamily: col.mono ? "'DM Mono', monospace" : "'Space Grotesk', sans-serif",
              fontSize: col.mono ? 12 : 13, color: D.body,
              justifyContent: col.align === "right" ? "flex-end" : "flex-start",
              overflow: "hidden",
            }}>
              {row[col.key]}
            </div>
          ))}
          {/* Row actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", height: 52 }}>
            <AnimatePresence>
              {hoveredRow === i && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ background: D.raised, border: `1px solid ${D.border}`, borderRadius: 6, color: D.subtle, padding: "4px 8px", cursor: "pointer", margin: 0 }}
                >
                  <MoreHorizontal size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            style={{
              position: "sticky", bottom: 0,
              background: D.raised, borderTop: `1px solid ${D.border}`,
              padding: "10px 16px", display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.gold }}>{selected.size} selected</span>
            {["Publish All", "Archive", "Delete"].map(a => (
              <button key={a} style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer",
                background: a === "Delete" ? "rgba(240,68,56,0.12)" : D.surface,
                border: `1px solid ${a === "Delete" ? "rgba(240,68,56,0.3)" : D.border}`,
                color: a === "Delete" ? D.red : D.body, borderRadius: 6,
                padding: "5px 12px", margin: 0,
              }}>{a}</button>
            ))}
            <button onClick={() => setSelected(new Set())} style={{ marginLeft: "auto", background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 4, margin: 0 }}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────
export function Pagination({ total, perPage, page, onChange }: { total: number; perPage: number; page: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>
        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{
              width: 30, height: 30, borderRadius: 6, cursor: "pointer",
              background: page === p ? D.gold + "18" : "transparent",
              border: `1px solid ${page === p ? D.gold + "50" : D.border}`,
              color: page === p ? D.gold : D.subtle,
              fontFamily: "monospace", fontSize: 12, margin: 0,
            }}
          >{p}</button>
        ))}
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description: string; action?: { label: string; href: string } }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px", background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: D.raised, border: `1px solid ${D.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Icon size={20} style={{ color: D.muted }} />
      </div>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 6 }}>{title}</p>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.subtle, marginBottom: 20 }}>{description}</p>
      {action && (
        <Link href={action.href} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: `linear-gradient(135deg, ${D.gold}, #D4943A)`, borderRadius: 7,
          color: "#1A120A", padding: "8px 16px", textDecoration: "none",
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600,
        }}>
          <Plus size={12} /> {action.label}
        </Link>
      )}
    </div>
  );
}
