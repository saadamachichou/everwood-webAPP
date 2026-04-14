"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, UtensilsCrossed, Leaf, Star } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

const MENU_ITEMS = [
  { id: "M-001", name: "Ethiopian Pour Over",   category: "Coffee",    price: 85,  status: "Available", tags: ["Single Origin", "Light Roast"], popular: true  },
  { id: "M-002", name: "Iced Jasmine Latte",    category: "Coffee",    price: 90,  status: "Available", tags: ["Seasonal"],                     popular: true  },
  { id: "M-003", name: "Cortado",               category: "Coffee",    price: 75,  status: "Available", tags: [],                               popular: false },
  { id: "M-004", name: "Cold Brew Tonic",       category: "Coffee",    price: 95,  status: "Available", tags: ["Seasonal"],                     popular: false },
  { id: "M-005", name: "Matcha Ceremonial",     category: "Tea",       price: 80,  status: "Available", tags: ["Organic"],                      popular: true  },
  { id: "M-006", name: "Rose Oolong",           category: "Tea",       price: 75,  status: "Available", tags: ["Organic"],                      popular: false },
  { id: "M-007", name: "Cardamom Chai",         category: "Tea",       price: 70,  status: "Available", tags: ["Vegan"],                        popular: false },
  { id: "M-008", name: "Almond Croissant",      category: "Pastry",    price: 65,  status: "Available", tags: [],                               popular: true  },
  { id: "M-009", name: "Cardamom Honey Cake",   category: "Pastry",    price: 80,  status: "Available", tags: ["Signature"],                    popular: true  },
  { id: "M-010", name: "Fig & Walnut Tart",     category: "Pastry",    price: 75,  status: "Seasonal",  tags: ["Seasonal"],                     popular: false },
  { id: "M-011", name: "Avocado Toast",         category: "Food",      price: 110, status: "Available", tags: ["Vegan"],                        popular: false },
  { id: "M-012", name: "Mushroom Bruschetta",   category: "Food",      price: 95,  status: "Available", tags: ["Vegetarian"],                   popular: true  },
  { id: "M-013", name: "Butternut Soup",        category: "Food",      price: 120, status: "Seasonal",  tags: ["Vegetarian", "Seasonal"],       popular: false },
  { id: "M-014", name: "Ceremonial Hibiscus",   category: "Drinks",    price: 65,  status: "Available", tags: ["Cold"],                         popular: false },
  { id: "M-015", name: "Turmeric Lemonade",     category: "Drinks",    price: 65,  status: "Draft",     tags: [],                               popular: false },
];

const CATEGORY_COLORS: Record<string, string> = {
  Coffee:  D.gold,
  Tea:     D.green,
  Pastry:  D.amber,
  Food:    D.blue,
  Drinks:  D.purple,
};

const TABS = [
  { label: "All",     count: 15 },
  { label: "Coffee",  count: 4  },
  { label: "Tea",     count: 3  },
  { label: "Pastry",  count: 3  },
  { label: "Food",    count: 3  },
  { label: "Drinks",  count: 2  },
];

const COLUMNS = [
  { key: "name",     label: "Item",      width: "2fr"   },
  { key: "category", label: "Category",  width: "110px" },
  { key: "price",    label: "Price",     width: "80px", mono: true, align: "right" as const },
  { key: "tags",     label: "Tags",      width: "160px" },
  { key: "status",   label: "Status",    width: "110px" },
];

export default function MenuPage() {
  const [tab, setTab] = useState(0);
  const [editItem, setEditItem] = useState<typeof MENU_ITEMS[0] | null>(null);

  const categories = ["Coffee", "Tea", "Pastry", "Food", "Drinks"];
  const filtered = MENU_ITEMS.filter(item => {
    if (tab === 0) return true;
    return item.category === categories[tab - 1];
  });

  const rows = filtered.map(item => ({
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
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: CATEGORY_COLORS[item.category] ?? D.subtle, background: (CATEGORY_COLORS[item.category] ?? D.subtle) + "15", borderRadius: 20, padding: "2px 8px" }}>
        {item.category}
      </span>
    ),
    price:  <span style={{ fontFamily: "monospace", fontSize: 13, color: D.gold }}>{item.price} EGP</span>,
    tags:   (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {item.tags.map(t => (
          <span key={t} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: D.subtle, background: D.raised, borderRadius: 20, padding: "1px 7px", border: `1px solid ${D.border}` }}>{t}</span>
        ))}
      </div>
    ),
    status: <StatusBadge status={item.status} />,
  }));

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: editItem ? "1fr 360px" : "1fr", gap: 16 }}>
      <div>
        <PageHeader
          title="Menu & Coffee"
          breadcrumb={["Menu"]}
          stats={[
            { label: "items", value: 15, color: D.gold },
            { label: "categories", value: 5 },
            { label: "seasonal", value: 3, color: D.amber },
          ]}
          action={{ label: "Add Item" }}
        />

        {/* Category KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { icon: Coffee,          label: "Coffee",  value: "4",  color: D.gold   },
            { icon: Leaf,            label: "Tea",     value: "3",  color: D.green  },
            { icon: UtensilsCrossed, label: "Food",    value: "3",  color: D.blue   },
            { icon: Coffee,          label: "Pastry",  value: "3",  color: D.amber  },
            { icon: Star,            label: "Popular", value: "6",  color: D.purple },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} style={{ color }} />
              </div>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 600, color: D.heading, lineHeight: 1 }}>{value}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: D.subtle, marginTop: 2 }}>{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <TabBar tabs={TABS} active={tab} onChange={setTab} />
        <SearchBar placeholder="Search menu items..." />
        <DataTable columns={COLUMNS} rows={rows} onRowClick={(_, i) => setEditItem(filtered[i])} />
        <Pagination total={filtered.length} perPage={20} page={1} onChange={() => {}} />
      </div>

      {/* Edit panel */}
      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20, height: "fit-content", position: "sticky", top: 88 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 11, color: D.muted, marginBottom: 4 }}>{editItem.id}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading }}>{editItem.name}</p>
              </div>
              <button onClick={() => setEditItem(null)} style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 4, margin: 0 }}>✕</button>
            </div>

            {[
              ["Category", editItem.category],
              ["Price",    `${editItem.price} EGP`],
              ["Status",   editItem.status],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${D.border}` }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>{label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: 12 }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle, marginBottom: 6 }}>Tags</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {editItem.tags.length > 0 ? editItem.tags.map(t => (
                  <span key={t} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.body, background: D.raised, borderRadius: 20, padding: "2px 10px", border: `1px solid ${D.border}` }}>{t}</span>
                )) : <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.muted }}>No tags</span>}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {["Edit Item", "Toggle Status"].map((a, i) => (
                <button key={a} style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, cursor: "pointer", flex: 1,
                  background: i === 0 ? D.gold + "18" : D.raised,
                  border: `1px solid ${i === 0 ? D.gold + "40" : D.border}`,
                  color: i === 0 ? D.gold : D.body, borderRadius: 6, padding: "8px 12px", margin: 0,
                }}>{a}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
