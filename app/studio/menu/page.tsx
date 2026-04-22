"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, UtensilsCrossed, Leaf, Star, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  status: string;
  tags: string[];
  popular: boolean;
}

const EMPTY: Omit<MenuItem, "id"> = {
  name: "", category: "Coffee", price: 70, status: "Available", tags: [], popular: false,
};

const CATEGORIES = ["Coffee", "Tea", "Pastry", "Food", "Drinks"];
const STATUSES   = ["Available", "Seasonal", "Draft", "Unavailable"];
const CATEGORY_COLORS: Record<string, string> = {
  Coffee: D.gold, Tea: D.green, Pastry: D.amber, Food: D.blue, Drinks: D.purple,
};

const COLUMNS = [
  { key: "name",     label: "Item",     width: "2fr"   },
  { key: "category", label: "Category", width: "110px" },
  { key: "price",    label: "Price",    width: "80px",  mono: true, align: "right" as const },
  { key: "tags",     label: "Tags",     width: "160px" },
  { key: "status",   label: "Status",   width: "110px" },
  { key: "actions",  label: "",         width: "80px"  },
];

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function MenuModal({ initial, onSave, onClose, saving }: {
  initial: Partial<MenuItem>;
  onSave: (d: Omit<MenuItem, "id">) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Omit<MenuItem, "id">>({ ...EMPTY, ...initial });
  const [tagInput, setTagInput] = useState(initial.tags?.join(", ") ?? "");
  const set = (k: keyof typeof form, v: string | number | boolean | string[]) =>
    setForm(f => ({ ...f, [k]: v }));

  const labelStyle: React.CSSProperties = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginBottom: 4, display: "block" };
  const inputStyle: React.CSSProperties = { width: "100%", background: D.raised, border: `1px solid ${D.border}`, borderRadius: 6, padding: "7px 10px", color: D.body, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" };

  function handleTagsChange(v: string) {
    setTagInput(v);
    set("tags", v.split(",").map(t => t.trim()).filter(Boolean));
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 14, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading }}>
            {initial.id ? "Edit Menu Item" : "New Menu Item"}
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
            <label style={labelStyle}>Price (MAD)</label>
            <input style={inputStyle} type="number" value={form.price} onChange={e => set("price", +e.target.value)} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 20 }}>
            <input
              id="popular" type="checkbox" checked={form.popular}
              onChange={e => set("popular", e.target.checked)}
              style={{ width: 14, height: 14, accentColor: D.gold, cursor: "pointer" }}
            />
            <label htmlFor="popular" style={{ ...labelStyle, marginBottom: 0, cursor: "pointer", color: D.body }}>
              Mark as popular
            </label>
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input style={inputStyle} value={tagInput} onChange={e => handleTagsChange(e.target.value)} placeholder="e.g. Organic, Vegan, Seasonal" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.body, borderRadius: 7, padding: "8px 18px" }}>Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.name.trim()}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.gold, border: "none", color: "#000", borderRadius: 7, padding: "8px 22px", fontWeight: 600, opacity: saving || !form.name.trim() ? 0.6 : 1, display: "flex", alignItems: "center", gap: 6 }}>
            {saving && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
            {initial.id ? "Save changes" : "Add item"}
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
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 8 }}>Remove item?</p>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.subtle, marginBottom: 22 }}>
          <strong style={{ color: D.body }}>{name}</strong> will be permanently removed from the menu.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.body, borderRadius: 7, padding: "7px 16px" }}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.red + "20", border: `1px solid ${D.red}40`, color: D.red, borderRadius: 7, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6 }}>
            {deleting && <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />}
            Remove
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function MenuPage() {
  const [items, setItems]       = useState<MenuItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState(0);
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [modal, setModal]       = useState<"create" | MenuItem | null>(null);
  const [toDelete, setToDelete] = useState<MenuItem | null>(null);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/v1/menu");
    setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const categories = ["Coffee", "Tea", "Pastry", "Food", "Drinks"];
  const filtered = items.filter(item => {
    const matchTab = tab === 0 || item.category === categories[tab - 1];
    const q = search.toLowerCase();
    return matchTab && (!q || item.name.toLowerCase().includes(q));
  });
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  async function handleSave(data: Omit<MenuItem, "id">) {
    setSaving(true);
    if (modal === "create") {
      await fetch("/api/v1/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else if (modal && typeof modal === "object") {
      await fetch(`/api/v1/menu/${modal.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setSaving(false);
    setModal(null);
    await load();
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    await fetch(`/api/v1/menu/${toDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    setToDelete(null);
    await load();
  }

  const catCounts = categories.reduce<Record<string, number>>((acc, c) => {
    acc[c] = items.filter(i => i.category === c).length;
    return acc;
  }, {});

  const TABS = [
    { label: "All",    count: items.length },
    ...categories.map(c => ({ label: c, count: catCounts[c] ?? 0 })),
  ];

  const rows = paginated.map(item => ({
    name: (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 1 }}>{item.name}</p>
          <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{item.id}</p>
        </div>
        {item.popular && (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: D.gold, background: D.gold + "15", borderRadius: 20, padding: "1px 7px" }}>
            <Star size={9} /> Popular
          </span>
        )}
      </div>
    ),
    category: (
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: CATEGORY_COLORS[item.category] ?? D.subtle, background: (CATEGORY_COLORS[item.category] ?? D.subtle) + "18", borderRadius: 20, padding: "2px 8px" }}>
        {item.category}
      </span>
    ),
    price:  <span style={{ fontFamily: "monospace", fontSize: 13, color: D.gold }}>{item.price} MAD</span>,
    tags: (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {item.tags.map(t => (
          <span key={t} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: D.subtle, background: D.raised, borderRadius: 20, padding: "1px 7px", border: `1px solid ${D.border}` }}>{t}</span>
        ))}
      </div>
    ),
    status: <StatusBadge status={item.status} />,
    actions: (
      <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
        <button onClick={() => setModal(item)} title="Edit"
          style={{ background: D.raised, border: `1px solid ${D.border}`, borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: D.subtle, lineHeight: 0 }}>
          <Pencil size={13} />
        </button>
        <button onClick={() => setToDelete(item)} title="Delete"
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
          title="Menu & Coffee"
          breadcrumb={["Menu"]}
          stats={[
            { label: "items",      value: items.length,                                        color: D.gold   },
            { label: "categories", value: categories.length                                                    },
            { label: "popular",    value: items.filter(i => i.popular).length,                 color: D.amber  },
            { label: "seasonal",   value: items.filter(i => i.status === "Seasonal").length,   color: D.green  },
          ]}
          action={{ label: "Add Item", onClick: () => setModal("create") }}
        />

        {/* Category KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { icon: Coffee,          label: "Coffee",  color: D.gold   },
            { icon: Leaf,            label: "Tea",     color: D.green  },
            { icon: Coffee,          label: "Pastry",  color: D.amber  },
            { icon: UtensilsCrossed, label: "Food",    color: D.blue   },
            { icon: Star,            label: "Drinks",  color: D.purple },
          ].map(({ icon: Icon, label, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} style={{ color }} />
              </div>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 600, color: D.heading, lineHeight: 1 }}>{catCounts[label] ?? 0}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: D.subtle, marginTop: 2 }}>{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <TabBar tabs={TABS} active={tab} onChange={t => { setTab(t); setPage(1); }} />
        <SearchBar placeholder="Search menu items…" onSearch={setSearch} />

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: D.muted, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>Loading…</div>
        ) : (
          <DataTable columns={COLUMNS} rows={rows} />
        )}
        <Pagination total={filtered.length} perPage={PER_PAGE} page={page} onChange={setPage} />
      </div>

      <AnimatePresence>
        {modal && (
          <MenuModal
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
