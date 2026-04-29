"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Ticket, TrendingUp, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, StatusBadge } from "@/components/studio/StudioShell";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface StudioEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  capacity: number;
  rsvp: number;
  price: number;
  status: string;
  description: string;
}

const EMPTY: Omit<StudioEvent, "id"> = {
  title: "", type: "Live Music", date: "", time: "7:00 PM",
  capacity: 40, rsvp: 0, price: 0, status: "Draft", description: "",
};

const TYPES    = ["Live Music", "Dining", "Exhibition", "Community", "Workshop"];
const STATUSES = ["Published", "Draft", "Archived"];
const TYPE_COLOR: Record<string, string> = {
  "Dining": D.green, "Live Music": D.purple, "Exhibition": D.blue, "Community": D.amber, "Workshop": D.gold,
};

const COLUMNS = [
  { key: "title",  label: "Event",   width: "2fr"   },
  { key: "type",   label: "Type",    width: "120px" },
  { key: "date",   label: "Date",    width: "110px", mono: true },
  { key: "time",   label: "Time",    width: "90px",  mono: true },
  { key: "rsvp",   label: "RSVP",   width: "100px" },
  { key: "price",  label: "Price",  width: "90px",  mono: true, align: "right" as const },
  { key: "status", label: "Status", width: "110px" },
  { key: "actions",label: "",       width: "80px"  },
];

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function EventModal({ initial, onSave, onClose, saving }: {
  initial: Partial<StudioEvent>;
  onSave: (d: Omit<StudioEvent, "id">) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Omit<StudioEvent, "id">>({ ...EMPTY, ...initial });
  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const labelStyle: React.CSSProperties = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginBottom: 4, display: "block" };
  const inputStyle: React.CSSProperties = { width: "100%", background: D.raised, border: `1px solid ${D.border}`, borderRadius: 6, padding: "7px 10px", color: D.body, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 14, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading }}>
            {initial.id ? "Edit Event" : "New Event"}
          </p>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 4, lineHeight: 0 }}><X size={18} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Event title" />
          </div>

          <div>
            <label style={labelStyle}>Type</label>
            <select style={inputStyle} value={form.type} onChange={e => set("type", e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={e => set("status", e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Date</label>
            <input style={inputStyle} value={form.date} onChange={e => set("date", e.target.value)} placeholder="e.g. Fri 18 Apr" />
          </div>

          <div>
            <label style={labelStyle}>Time</label>
            <input style={inputStyle} value={form.time} onChange={e => set("time", e.target.value)} placeholder="e.g. 7:30 PM" />
          </div>

          <div>
            <label style={labelStyle}>Capacity (0 = free entry)</label>
            <input style={inputStyle} type="number" value={form.capacity} onChange={e => set("capacity", +e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>RSVPs so far</label>
            <input style={inputStyle} type="number" value={form.rsvp} onChange={e => set("rsvp", +e.target.value)} />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Price (MAD, 0 = free)</label>
            <input style={inputStyle} type="number" value={form.price} onChange={e => set("price", +e.target.value)} />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
              value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Short description for the public page" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.body, borderRadius: 7, padding: "8px 18px" }}>Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.title.trim()}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.gold, border: "none", color: "#000", borderRadius: 7, padding: "8px 22px", fontWeight: 600, opacity: saving || !form.title.trim() ? 0.6 : 1, display: "flex", alignItems: "center", gap: 6 }}>
            {saving && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
            {initial.id ? "Save changes" : "Create event"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteConfirm({ name, onConfirm, onCancel, deleting }: { name: string; onConfirm: () => void; onCancel: () => void; deleting: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 28, maxWidth: 380, width: "100%" }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 8 }}>Delete event?</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.subtle, marginBottom: 22 }}>
          <strong style={{ color: D.body }}>{name}</strong> will be permanently removed.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.body, borderRadius: 7, padding: "7px 16px" }}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.red + "20", border: `1px solid ${D.red}40`, color: D.red, borderRadius: 7, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6 }}>
            {deleting && <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />}
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function EventsPage() {
  const [items, setItems]       = useState<StudioEvent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState(0);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<"create" | StudioEvent | null>(null);
  const [toDelete, setToDelete] = useState<StudioEvent | null>(null);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/v1/events");
    setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter(e => {
    const matchTab =
      tab === 1 ? e.status === "Published" :
      tab === 2 ? e.status === "Draft" : true;
    const q = search.toLowerCase();
    return matchTab && (!q || e.title.toLowerCase().includes(q) || e.type.toLowerCase().includes(q));
  });

  async function handleSave(data: Omit<StudioEvent, "id">) {
    setSaving(true);
    if (modal === "create") {
      await fetch("/api/v1/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else if (modal && typeof modal === "object") {
      await fetch(`/api/v1/events/${modal.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setSaving(false);
    setModal(null);
    await load();
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    await fetch(`/api/v1/events/${toDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    setToDelete(null);
    await load();
  }

  const counts = {
    all:       items.length,
    published: items.filter(e => e.status === "Published").length,
    draft:     items.filter(e => e.status === "Draft").length,
  };

  const TABS = [
    { label: "All",      count: counts.all       },
    { label: "Published",count: counts.published },
    { label: "Draft",    count: counts.draft     },
  ];

  const totalRSVP    = items.reduce((s, e) => s + e.rsvp, 0);
  const ticketed     = items.filter(e => e.price > 0).length;
  const avgFillRate  = items.filter(e => e.capacity > 0).length
    ? Math.round(items.filter(e => e.capacity > 0).reduce((s, e) => s + e.rsvp / e.capacity, 0) / items.filter(e => e.capacity > 0).length * 100)
    : 0;

  const rows = filtered.map(e => ({
    title: (
      <div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 2 }}>{e.title}</p>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{e.id}</p>
      </div>
    ),
    type: (
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: TYPE_COLOR[e.type] ?? D.subtle, background: (TYPE_COLOR[e.type] ?? D.subtle) + "18", borderRadius: 20, padding: "2px 8px" }}>
        {e.type}
      </span>
    ),
    date:  <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{e.date}</span>,
    time:  <span style={{ fontFamily: "monospace", fontSize: 12, color: D.subtle }}>{e.time}</span>,
    rsvp:  e.capacity > 0 ? (
      <div>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: e.rsvp === e.capacity ? D.red : D.body }}>{e.rsvp}/{e.capacity}</span>
        <div style={{ width: 56, height: 3, background: D.border, borderRadius: 2, marginTop: 4 }}>
          <div style={{ width: `${Math.min(100, (e.rsvp / e.capacity) * 100)}%`, height: "100%", background: e.rsvp === e.capacity ? D.red : D.green, borderRadius: 2 }} />
        </div>
      </div>
    ) : <span style={{ fontFamily: "monospace", fontSize: 11, color: D.muted }}>Free entry</span>,
    price:  <span style={{ fontFamily: "monospace", fontSize: 12, color: e.price === 0 ? D.green : D.gold }}>{e.price === 0 ? "Free" : `${e.price} MAD`}</span>,
    status: <StatusBadge status={e.status} />,
    actions: (
      <div style={{ display: "flex", gap: 6 }} onClick={ev => ev.stopPropagation()}>
        <button onClick={() => setModal(e)} title="Edit"
          style={{ background: D.raised, border: `1px solid ${D.border}`, borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: D.subtle, lineHeight: 0 }}>
          <Pencil size={13} />
        </button>
        <button onClick={() => setToDelete(e)} title="Delete"
          style={{ background: D.red + "15", border: `1px solid ${D.red}30`, borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: D.red, lineHeight: 0 }}>
          <Trash2 size={13} />
        </button>
      </div>
    ),
  }));

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <PageHeader
          title="Events"
          breadcrumb={["Events"]}
          stats={[
            { label: "total",     value: counts.all                          },
            { label: "published", value: counts.published, color: D.green   },
            { label: "total RSVPs", value: totalRSVP,      color: D.gold    },
          ]}
          action={{ label: "New Event", onClick: () => setModal("create") }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { icon: Calendar,   label: "Total events",  value: String(counts.all),    color: D.blue   },
            { icon: Users,      label: "Total RSVPs",   value: String(totalRSVP),     color: D.green  },
            { icon: Ticket,     label: "Ticketed",      value: String(ticketed),      color: D.gold   },
            { icon: TrendingUp, label: "Avg fill rate", value: `${avgFillRate}%`,     color: D.purple },
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

        <TabBar tabs={TABS} active={tab} onChange={t => { setTab(t); }} />
        <SearchBar placeholder="Search events…" onSearch={setSearch} />

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: D.muted, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>Loading…</div>
        ) : (
          <DataTable columns={COLUMNS} rows={rows} />
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <EventModal
            initial={modal === "create" ? {} : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
            saving={saving}
          />
        )}
        {toDelete && (
          <DeleteConfirm
            name={toDelete.title}
            onConfirm={handleDelete}
            onCancel={() => setToDelete(null)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}
