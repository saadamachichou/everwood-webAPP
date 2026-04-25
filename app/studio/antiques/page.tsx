"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, DollarSign, Tag, Archive, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Antique {
  id: string;
  name: string;
  era: string;
  origin: string;
  price: number;
  category: string;
  condition: string;
  status: string;
  featured: boolean;
}

const EMPTY: Omit<Antique, "id"> = {
  name: "", era: "", origin: "", price: 1000,
  category: "Decorative", condition: "Good", status: "Available", featured: false,
};

const CATEGORIES  = ["Lighting", "Furniture", "Decorative", "Textile", "Music", "Mirrors", "Ceramics", "Art", "Books"];
const CONDITIONS  = ["Excellent", "Good", "Fair", "Restored"];
const STATUSES    = ["Available", "Reserved", "Sold"];

const CAT_COLORS: Record<string, string> = {
  Lighting: D.gold, Furniture: D.amber, Decorative: D.blue,
  Textile: D.purple, Music: D.green, Mirrors: D.subtle, Ceramics: D.green,
};
const CONDITION_COLOR: Record<string, string> = {
  Excellent: D.green, Good: D.blue, Fair: D.amber, Restored: D.purple,
};

const COLUMNS = [
  { key: "item",      label: "Item",      width: "2fr"   },
  { key: "category",  label: "Category",  width: "120px" },
  { key: "era",       label: "Era",       width: "100px", mono: true },
  { key: "origin",    label: "Origin",    width: "100px" },
  { key: "price",     label: "Price",     width: "110px", mono: true, align: "right" as const },
  { key: "condition", label: "Condition", width: "100px" },
  { key: "status",    label: "Status",    width: "110px" },
  { key: "actions",   label: "",          width: "80px"  },
];

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function AntiqueModal({ initial, onSave, onClose, saving }: {
  initial: Partial<Antique>;
  onSave: (d: Omit<Antique, "id">) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Omit<Antique, "id">>({ ...EMPTY, ...initial });
  const set = (k: keyof typeof form, v: string | number | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const labelStyle: React.CSSProperties = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginBottom: 4, display: "block" };
  const inputStyle: React.CSSProperties = { width: "100%", background: D.raised, border: `1px solid ${D.border}`, borderRadius: 6, padding: "7px 10px", color: D.body, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 14, padding: 28, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading }}>
            {initial.id ? "Edit Antique" : "New Antique"}
          </p>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 4, lineHeight: 0 }}><X size={18} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Name *</label>
            <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Item name" />
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
            <label style={labelStyle}>Era / Period</label>
            <input style={inputStyle} value={form.era} onChange={e => set("era", e.target.value)} placeholder="e.g. 1920s, 19th c." />
          </div>

          <div>
            <label style={labelStyle}>Country of origin</label>
            <input style={inputStyle} value={form.origin} onChange={e => set("origin", e.target.value)} placeholder="e.g. Morocco" />
          </div>

          <div>
            <label style={labelStyle}>Price (MAD)</label>
            <input style={inputStyle} type="number" value={form.price} onChange={e => set("price", +e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Condition</label>
            <select style={inputStyle} value={form.condition} onChange={e => set("condition", e.target.value)}>
              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: 10 }}>
            <input
              id="featured" type="checkbox" checked={form.featured}
              onChange={e => set("featured", e.target.checked)}
              style={{ width: 14, height: 14, accentColor: D.gold, cursor: "pointer" }}
            />
            <label htmlFor="featured" style={{ ...labelStyle, marginBottom: 0, cursor: "pointer", color: D.body }}>
              Feature this item on the public page
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.body, borderRadius: 7, padding: "8px 18px" }}>Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.name.trim()}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.gold, border: "none", color: "#000", borderRadius: 7, padding: "8px 22px", fontWeight: 600, opacity: saving || !form.name.trim() ? 0.6 : 1, display: "flex", alignItems: "center", gap: 6 }}>
            {saving && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
            {initial.id ? "Save changes" : "Add antique"}
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
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 8 }}>Remove antique?</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.subtle, marginBottom: 22 }}>
          <strong style={{ color: D.body }}>{name}</strong> will be permanently removed from the inventory.
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
export default function AntiquesPage() {
  const [items, setItems]       = useState<Antique[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState(0);
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [modal, setModal]       = useState<"create" | Antique | null>(null);
  const [toDelete, setToDelete] = useState<Antique | null>(null);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/v1/antiques");
    setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter(a => {
    const matchTab =
      tab === 1 ? a.status === "Available" :
      tab === 2 ? a.status === "Reserved"  :
      tab === 3 ? a.status === "Sold"      : true;
    const q = search.toLowerCase();
    return matchTab && (!q || a.name.toLowerCase().includes(q) || a.origin.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  });
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  async function handleSave(data: Omit<Antique, "id">) {
    setSaving(true);
    if (modal === "create") {
      await fetch("/api/v1/antiques", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else if (modal && typeof modal === "object") {
      await fetch(`/api/v1/antiques/${modal.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setSaving(false);
    setModal(null);
    await load();
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    await fetch(`/api/v1/antiques/${toDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    setToDelete(null);
    await load();
  }

  const available = items.filter(a => a.status !== "Sold");
  const totalValue = available.reduce((s, a) => s + a.price, 0);
  const featured   = items.filter(a => a.featured).length;

  const counts = {
    all:       items.length,
    available: items.filter(a => a.status === "Available").length,
    reserved:  items.filter(a => a.status === "Reserved").length,
    sold:      items.filter(a => a.status === "Sold").length,
  };

  const TABS = [
    { label: "All",       count: counts.all       },
    { label: "Available", count: counts.available },
    { label: "Reserved",  count: counts.reserved  },
    { label: "Sold",      count: counts.sold      },
  ];

  const rows = paginated.map(a => ({
    item: (
      <div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 2 }}>{a.name}</p>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{a.id}{a.featured ? " · Featured" : ""}</p>
      </div>
    ),
    category: (
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: CAT_COLORS[a.category] ?? D.subtle, background: (CAT_COLORS[a.category] ?? D.subtle) + "18", borderRadius: 20, padding: "2px 8px" }}>
        {a.category}
      </span>
    ),
    era:       <span style={{ fontFamily: "monospace", fontSize: 12, color: D.subtle }}>{a.era}</span>,
    origin:    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{a.origin}</span>,
    price:     <span style={{ fontFamily: "monospace", fontSize: 13, color: D.gold }}>{a.price.toLocaleString()} MAD</span>,
    condition: <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: CONDITION_COLOR[a.condition] ?? D.subtle }}>{a.condition}</span>,
    status:    <StatusBadge status={a.status} />,
    actions: (
      <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
        <button onClick={() => setModal(a)} title="Edit"
          style={{ background: D.raised, border: `1px solid ${D.border}`, borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: D.subtle, lineHeight: 0 }}>
          <Pencil size={13} />
        </button>
        <button onClick={() => setToDelete(a)} title="Delete"
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
          title="Antiques"
          breadcrumb={["Antiques"]}
          stats={[
            { label: "total items",      value: counts.all,                                   color: D.gold  },
            { label: "available",        value: counts.available,                             color: D.green },
            { label: "inventory value",  value: `${(totalValue / 1000).toFixed(0)}K MAD`,    color: D.gold  },
          ]}
          action={{ label: "Add Item", onClick: () => setModal("create") }}
        />

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { icon: Package,    label: "Total items",     value: String(counts.all),                          color: D.gold   },
            { icon: Tag,        label: "Available",       value: String(counts.available),                    color: D.green  },
            { icon: DollarSign, label: "Inventory value", value: `${(totalValue / 1000).toFixed(0)}K MAD`,   color: D.blue   },
            { icon: Archive,    label: "Featured",        value: String(featured),                            color: D.purple },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 600, color: D.heading, lineHeight: 1 }}>{value}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginTop: 2 }}>{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <TabBar tabs={TABS} active={tab} onChange={t => { setTab(t); setPage(1); }} />
        <SearchBar placeholder="Search by name, origin, category…" onSearch={setSearch} />

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: D.muted, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>Loading…</div>
        ) : (
          <DataTable columns={COLUMNS} rows={rows} />
        )}
        <Pagination total={filtered.length} perPage={PER_PAGE} page={page} onChange={setPage} />
      </div>

      <AnimatePresence>
        {modal && (
          <AntiqueModal
            initial={modal === "create" ? {} : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
            saving={saving}
          />
        )}
        {toDelete && (
          <DeleteConfirm
            name={toDelete.name}
            onConfirm={handleDelete}
            onCancel={() => setToDelete(null)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}
