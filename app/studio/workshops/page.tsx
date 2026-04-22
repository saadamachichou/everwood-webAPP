"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Clock, Users, Star, Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Workshop {
  id: string;
  title: string;
  category: string;
  duration: string;
  group: string;
  price: number;
  nextSession: string;
  spotsLeft: number;
  totalSpots: number;
  status: string;
  bookings: number;
  description: string;
}

const EMPTY: Omit<Workshop, "id"> = {
  title: "", category: "Nature & Earth", duration: "2 hrs", group: "4–10",
  price: 350, nextSession: "", spotsLeft: 8, totalSpots: 10,
  status: "Draft", bookings: 0, description: "",
};

const CATEGORIES = ["Nature & Earth", "Light & Wonder", "Imagination & Expression", "Making & Craft", "Imagination"];
const STATUSES   = ["Published", "Draft", "Archived"];

const CAT_COLORS: Record<string, string> = {
  "Nature & Earth": D.green, "Making & Craft": D.gold,
  "Light & Wonder": D.purple, "Imagination": D.blue, "Imagination & Expression": D.blue,
};

const COLUMNS = [
  { key: "title",       label: "Workshop",      width: "2fr"   },
  { key: "category",    label: "Category",      width: "150px" },
  { key: "duration",    label: "Duration",      width: "90px"  },
  { key: "price",       label: "Price",         width: "90px",  mono: true, align: "right" as const },
  { key: "session",     label: "Next Session",  width: "120px" },
  { key: "spots",       label: "Spots",         width: "80px",  mono: true },
  { key: "status",      label: "Status",        width: "110px" },
  { key: "actions",     label: "",              width: "80px"  },
];

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function WorkshopModal({
  initial, onSave, onClose, saving,
}: {
  initial: Partial<Workshop>;
  onSave: (data: Omit<Workshop, "id">) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Omit<Workshop, "id">>({ ...EMPTY, ...initial });
  const set = (k: keyof typeof form, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }));

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif", fontSize: 11,
    color: D.subtle, marginBottom: 4, display: "block",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", background: D.raised, border: `1px solid ${D.border}`,
    borderRadius: 6, padding: "7px 10px", color: D.body,
    fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        style={{
          background: D.surface, border: `1px solid ${D.border}`,
          borderRadius: 14, padding: 28, width: "100%", maxWidth: 540,
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading }}>
            {initial.id ? "Edit Workshop" : "New Workshop"}
          </p>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 4, lineHeight: 0 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Workshop name" />
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={e => set("status", e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Duration</label>
            <input style={inputStyle} value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="e.g. 2.5 hrs" />
          </div>

          <div>
            <label style={labelStyle}>Group size</label>
            <input style={inputStyle} value={form.group} onChange={e => set("group", e.target.value)} placeholder="e.g. 4–10" />
          </div>

          <div>
            <label style={labelStyle}>Price (MAD)</label>
            <input style={inputStyle} type="number" value={form.price} onChange={e => set("price", +e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Next session</label>
            <input style={inputStyle} value={form.nextSession} onChange={e => set("nextSession", e.target.value)} placeholder="e.g. Sat 19 Apr" />
          </div>

          <div>
            <label style={labelStyle}>Spots left</label>
            <input style={inputStyle} type="number" value={form.spotsLeft} onChange={e => set("spotsLeft", +e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Total spots</label>
            <input style={inputStyle} type="number" value={form.totalSpots} onChange={e => set("totalSpots", +e.target.value)} />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Short description shown on the public page"
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer",
            background: D.raised, border: `1px solid ${D.border}`, color: D.body,
            borderRadius: 7, padding: "8px 18px",
          }}>Cancel</button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.title.trim()}
            style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer",
              background: D.gold, border: "none", color: "#000",
              borderRadius: 7, padding: "8px 22px", fontWeight: 600,
              opacity: saving || !form.title.trim() ? 0.6 : 1,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {saving && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
            {initial.id ? "Save changes" : "Create workshop"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Delete confirmation ────────────────────────────────────────────────── */
function DeleteConfirm({ name, onConfirm, onCancel, deleting }: {
  name: string; onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
        zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 28, maxWidth: 380, width: "100%" }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 8 }}>Delete workshop?</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.subtle, marginBottom: 22 }}>
          <strong style={{ color: D.body }}>{name}</strong> will be permanently removed. This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.body, borderRadius: 7, padding: "7px 16px" }}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.red + "20", border: `1px solid ${D.red}40`, color: D.red, borderRadius: 7, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6 }}>
            {deleting && <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />}
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function WorkshopsPage() {
  const [items, setItems]         = useState<Workshop[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState(0);
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [modal, setModal]         = useState<"create" | Workshop | null>(null);
  const [toDelete, setToDelete]   = useState<Workshop | null>(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const PER_PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/v1/workshops");
    setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter(w => {
    const matchTab =
      tab === 1 ? w.status === "Published" :
      tab === 2 ? w.status === "Draft" :
      tab === 3 ? w.status === "Archived" : true;
    const q = search.toLowerCase();
    const matchQ = !q || w.title.toLowerCase().includes(q) || w.category.toLowerCase().includes(q);
    return matchTab && matchQ;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  async function handleSave(data: Omit<Workshop, "id">) {
    setSaving(true);
    if (modal === "create") {
      await fetch("/api/v1/workshops", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
    } else if (modal && typeof modal === "object") {
      await fetch(`/api/v1/workshops/${modal.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
    }
    setSaving(false);
    setModal(null);
    await load();
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    await fetch(`/api/v1/workshops/${toDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    setToDelete(null);
    await load();
  }

  const counts = {
    all:       items.length,
    published: items.filter(w => w.status === "Published").length,
    draft:     items.filter(w => w.status === "Draft").length,
    archived:  items.filter(w => w.status === "Archived").length,
  };

  const TABS = [
    { label: "All",      count: counts.all       },
    { label: "Published",count: counts.published },
    { label: "Draft",    count: counts.draft     },
    { label: "Archived", count: counts.archived  },
  ];

  const totalBookings = items.reduce((s, w) => s + w.bookings, 0);
  const avgDuration   = items.length
    ? (items.reduce((s, w) => s + parseFloat(w.duration), 0) / items.length).toFixed(1)
    : "0";
  const avgOccupancy  = items.filter(w => w.totalSpots > 0).length
    ? Math.round(
        items.filter(w => w.totalSpots > 0)
          .reduce((s, w) => s + (1 - w.spotsLeft / w.totalSpots), 0) /
        items.filter(w => w.totalSpots > 0).length * 100
      )
    : 0;

  const rows = paginated.map(w => ({
    title: (
      <div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 2 }}>{w.title}</p>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{w.id} · {w.bookings} bookings</p>
      </div>
    ),
    category: (
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: CAT_COLORS[w.category] ?? D.subtle, background: (CAT_COLORS[w.category] ?? D.subtle) + "18", borderRadius: 20, padding: "2px 8px" }}>
        {w.category}
      </span>
    ),
    duration:    <span style={{ fontFamily: "monospace", fontSize: 12, color: D.subtle }}>{w.duration}</span>,
    price:       <span style={{ fontFamily: "monospace", fontSize: 13, color: D.gold }}>{w.price} MAD</span>,
    session:     <span style={{ fontFamily: "monospace", fontSize: 11, color: w.nextSession ? D.body : D.muted }}>{w.nextSession || "—"}</span>,
    spots: (
      <span style={{ fontFamily: "monospace", fontSize: 12, color: w.spotsLeft === 0 ? D.red : D.body }}>
        {w.totalSpots > 0 ? `${w.spotsLeft}/${w.totalSpots}` : "—"}
      </span>
    ),
    status: <StatusBadge status={w.status} />,
    actions: (
      <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setModal(w)}
          title="Edit"
          style={{ background: D.raised, border: `1px solid ${D.border}`, borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: D.subtle, lineHeight: 0 }}
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => setToDelete(w)}
          title="Delete"
          style={{ background: D.red + "15", border: `1px solid ${D.red}30`, borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: D.red, lineHeight: 0 }}
        >
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
          title="Workshops"
          breadcrumb={["Workshops"]}
          stats={[
            { label: "total",     value: counts.all                                  },
            { label: "published", value: counts.published, color: D.green            },
            { label: "drafts",    value: counts.draft,     color: D.amber            },
            { label: "bookings",  value: totalBookings,    color: D.gold             },
          ]}
          action={{ label: "New Workshop", onClick: () => setModal("create") }}
        />

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { icon: Scissors, label: "Published",     value: String(counts.published),  color: D.gold   },
            { icon: Users,    label: "Total bookings", value: String(totalBookings),      color: D.green  },
            { icon: Clock,    label: "Avg duration",   value: `${avgDuration}h`,          color: D.blue   },
            { icon: Star,     label: "Avg occupancy",  value: `${avgOccupancy}%`,         color: D.amber  },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ borderColor: color + "40" }}
              style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, padding: "16px 18px", transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 600, color: D.heading, lineHeight: 1 }}>{value}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginTop: 2 }}>{label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <TabBar tabs={TABS} active={tab} onChange={t => { setTab(t); setPage(1); }} />
        <SearchBar placeholder="Search workshops…" onSearch={setSearch} />

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: D.muted, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>
            Loading…
          </div>
        ) : (
          <DataTable columns={COLUMNS} rows={rows} />
        )}

        <Pagination total={filtered.length} perPage={PER_PAGE} page={page} onChange={setPage} />
      </div>

      <AnimatePresence>
        {modal && (
          <WorkshopModal
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
