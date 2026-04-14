"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, DollarSign, Tag, Archive } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

const ANTIQUES = [
  { id: "ANT-001", name: "Art Deco Brass Lamp",          era: "1920s",  origin: "France",    price: 4800, category: "Lighting",   condition: "Excellent", status: "Available", featured: true  },
  { id: "ANT-002", name: "Moroccan Cedar Cabinet",       era: "Early 20th c.", origin: "Morocco", price: 12500, category: "Furniture", condition: "Good",      status: "Reserved",  featured: true  },
  { id: "ANT-003", name: "Ottoman Copper Tray Set",      era: "19th c.", origin: "Turkey",   price: 2200, category: "Decorative", condition: "Good",      status: "Available", featured: false },
  { id: "ANT-004", name: "Persian Silk Rug 3×2m",       era: "1940s",  origin: "Iran",      price: 18000, category: "Textile",    condition: "Excellent", status: "Available", featured: true  },
  { id: "ANT-005", name: "Vintage Oud & Case",           era: "1960s",  origin: "Egypt",     price: 9500, category: "Music",      condition: "Fair",      status: "Available", featured: false },
  { id: "ANT-006", name: "Art Nouveau Vanity Mirror",    era: "1900s",  origin: "Belgium",   price: 3600, category: "Mirrors",    condition: "Good",      status: "Sold",      featured: false },
  { id: "ANT-007", name: "Copper Coffee Service Set",    era: "1950s",  origin: "Egypt",     price: 1800, category: "Ceramics",   condition: "Excellent", status: "Available", featured: false },
  { id: "ANT-008", name: "Tunisian Mosaic Side Table",   era: "1930s",  origin: "Tunisia",   price: 5200, category: "Furniture",  condition: "Good",      status: "Available", featured: true  },
  { id: "ANT-009", name: "Antique Compass Collection",   era: "1880s",  origin: "England",   price: 7800, category: "Decorative", condition: "Fair",      status: "Available", featured: false },
  { id: "ANT-010", name: "Hand-painted Silk Suzani",     era: "1900s",  origin: "Uzbekistan",price: 8400, category: "Textile",    condition: "Good",      status: "Available", featured: false },
];

const CAT_COLORS: Record<string, string> = {
  Lighting: D.gold, Furniture: D.amber, Decorative: D.blue, Textile: D.purple, Music: D.green, Mirrors: D.subtle, Ceramics: D.green,
};

const TABS = [
  { label: "All",       count: 10 },
  { label: "Available", count: 7  },
  { label: "Reserved",  count: 1  },
  { label: "Sold",      count: 1  },
];

const COLUMNS = [
  { key: "item",      label: "Item",       width: "2fr"   },
  { key: "category",  label: "Category",   width: "120px" },
  { key: "era",       label: "Era",        width: "100px", mono: true },
  { key: "origin",    label: "Origin",     width: "100px" },
  { key: "price",     label: "Price",      width: "100px", mono: true, align: "right" as const },
  { key: "condition", label: "Condition",  width: "100px" },
  { key: "status",    label: "Status",     width: "110px" },
];

const CONDITION_COLOR: Record<string, string> = {
  Excellent: D.green, Good: D.blue, Fair: D.amber,
};

export default function AntiquesPage() {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<typeof ANTIQUES[0] | null>(null);
  const [page, setPage] = useState(1);

  const filtered = ANTIQUES.filter(a => {
    if (tab === 1) return a.status === "Available";
    if (tab === 2) return a.status === "Reserved";
    if (tab === 3) return a.status === "Sold";
    return true;
  });

  const rows = filtered.map(a => ({
    item: (
      <div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 2 }}>{a.name}</p>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{a.id}{a.featured ? " · Featured" : ""}</p>
      </div>
    ),
    category: (
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: CAT_COLORS[a.category] ?? D.subtle, background: (CAT_COLORS[a.category] ?? D.subtle) + "15", borderRadius: 20, padding: "2px 8px" }}>
        {a.category}
      </span>
    ),
    era:       <span style={{ fontFamily: "monospace", fontSize: 12, color: D.subtle }}>{a.era}</span>,
    origin:    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{a.origin}</span>,
    price:     <span style={{ fontFamily: "monospace", fontSize: 13, color: D.gold }}>{a.price.toLocaleString()} EGP</span>,
    condition: (
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: CONDITION_COLOR[a.condition] ?? D.subtle }}>
        {a.condition}
      </span>
    ),
    status: <StatusBadge status={a.status} />,
  }));

  const totalValue = ANTIQUES.filter(a => a.status !== "Sold").reduce((s, a) => s + a.price, 0);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 16 }}>
      <div>
        <PageHeader
          title="Antiques"
          breadcrumb={["Antiques"]}
          stats={[
            { label: "total items", value: 10, color: D.gold },
            { label: "available",   value: 7,  color: D.green },
            { label: "inventory value", value: `${(totalValue / 1000).toFixed(0)}K EGP`, color: D.gold },
          ]}
          action={{ label: "Add Item" }}
        >
          <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, background: D.raised, border: `1px solid ${D.border}`, borderRadius: 7, color: D.body, padding: "6px 14px", cursor: "pointer", margin: 0 }}>
            Export
          </button>
        </PageHeader>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { icon: Package,     label: "Total items",     value: "10",                              color: D.gold   },
            { icon: Tag,         label: "Available",       value: "7",                               color: D.green  },
            { icon: DollarSign,  label: "Inventory value", value: `${(totalValue/1000).toFixed(0)}K EGP`, color: D.blue   },
            { icon: Archive,     label: "Featured",        value: "4",                               color: D.purple },
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

        <TabBar tabs={TABS} active={tab} onChange={setTab} />
        <SearchBar placeholder="Search by name, origin, category..." />
        <DataTable columns={COLUMNS} rows={rows} onRowClick={(_, i) => setSelected(filtered[i])} />
        <Pagination total={filtered.length} perPage={20} page={page} onChange={setPage} />
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20, height: "fit-content", position: "sticky", top: 88 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 11, color: D.muted, marginBottom: 4 }}>{selected.id}</p>
                <StatusBadge status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 4, margin: 0 }}>✕</button>
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading, marginBottom: 16 }}>{selected.name}</p>
            {[
              ["Category",  selected.category],
              ["Era",       selected.era],
              ["Origin",    selected.origin],
              ["Condition", selected.condition],
              ["Price",     `${selected.price.toLocaleString()} EGP`],
              ["Featured",  selected.featured ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${D.border}` }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>{label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {["Edit", "Mark Reserved", "Mark Sold"].map((a, i) => (
                <button key={a} style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, cursor: "pointer", flex: 1,
                  background: i === 2 ? "rgba(61,214,140,0.1)" : D.raised,
                  border: `1px solid ${i === 2 ? "rgba(61,214,140,0.3)" : D.border}`,
                  color: i === 2 ? D.green : D.body, borderRadius: 6, padding: "6px 8px", margin: 0,
                }}>{a}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
