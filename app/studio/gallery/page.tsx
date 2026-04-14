"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, FileText, Eye, Star } from "lucide-react";
import { D, PageHeader, TabBar, SearchBar, DataTable, Pagination, StatusBadge } from "@/components/studio/StudioShell";

const ARTICLES = [
  { id: "ART-001", title: "The Art of Wabi-Sabi in Modern Spaces",   type: "Article", category: "Design",     author: "Everwood",     date: "Jun 5, 2025",  views: 1284, status: "Published", featured: true  },
  { id: "ART-002", title: "June Workshop Stories",                     type: "Gallery", category: "Workshops",  author: "Everwood",     date: "Jun 8, 2025",  views: 892,  status: "Published", featured: false },
  { id: "ART-003", title: "Behind the Clay — Pottery Diaries",         type: "Article", category: "Craft",      author: "Layla M.",    date: "May 28, 2025", views: 2140, status: "Published", featured: true  },
  { id: "ART-004", title: "Summer Collection 2025",                    type: "Gallery", category: "Antiques",   author: "Everwood",     date: "Jun 1, 2025",  views: 1560, status: "Published", featured: true  },
  { id: "ART-005", title: "Indigo Dreams — Shibori Workshop Recap",    type: "Article", category: "Workshops",  author: "Everwood",     date: "May 20, 2025", views: 743,  status: "Published", featured: false },
  { id: "ART-006", title: "Autumn Menu Reveal",                        type: "Article", category: "Menu",       author: "Everwood",     date: "—",            views: 0,    status: "Draft",     featured: false },
  { id: "ART-007", title: "Garden Light Series",                       type: "Gallery", category: "Events",     author: "Everwood",     date: "—",            views: 0,    status: "Draft",     featured: false },
  { id: "ART-008", title: "The Copper Route — Antique Origins",        type: "Article", category: "Antiques",   author: "Everwood",     date: "Apr 14, 2025", views: 3210, status: "Published", featured: true  },
];

const TYPE_COLORS: Record<string, string> = { Article: D.blue, Gallery: D.purple };
const CAT_COLORS: Record<string, string> = { Design: D.gold, Workshops: D.green, Craft: D.amber, Antiques: D.blue, Menu: D.purple, Events: D.gold };

const TABS = [
  { label: "All",       count: 8 },
  { label: "Published", count: 6 },
  { label: "Draft",     count: 2 },
  { label: "Featured",  count: 4 },
];

const COLUMNS = [
  { key: "content",  label: "Content",    width: "2fr"   },
  { key: "type",     label: "Type",       width: "90px"  },
  { key: "category", label: "Category",   width: "110px" },
  { key: "author",   label: "Author",     width: "100px" },
  { key: "date",     label: "Published",  width: "110px", mono: true },
  { key: "views",    label: "Views",      width: "80px",  mono: true, align: "right" as const },
  { key: "status",   label: "Status",     width: "110px" },
];

export default function GalleryPage() {
  const [tab, setTab] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);

  const filtered = ARTICLES.filter(a => {
    if (tab === 1) return a.status === "Published";
    if (tab === 2) return a.status === "Draft";
    if (tab === 3) return a.featured;
    return true;
  });

  const rows = filtered.map(a => ({
    content: (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: 8, background: (TYPE_COLORS[a.type] ?? D.blue) + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {a.type === "Gallery" ? <ImageIcon size={18} style={{ color: TYPE_COLORS[a.type] }} /> : <FileText size={18} style={{ color: TYPE_COLORS[a.type] }} />}
        </div>
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 2 }}>{a.title}</p>
          <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{a.id}{a.featured ? " · ★ Featured" : ""}</p>
        </div>
      </div>
    ),
    type:     <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: TYPE_COLORS[a.type], background: (TYPE_COLORS[a.type]) + "15", borderRadius: 20, padding: "2px 8px" }}>{a.type}</span>,
    category: <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: CAT_COLORS[a.category] ?? D.subtle, background: (CAT_COLORS[a.category] ?? D.subtle) + "15", borderRadius: 20, padding: "2px 8px" }}>{a.category}</span>,
    author:   <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body }}>{a.author}</span>,
    date:     <span style={{ fontFamily: "monospace", fontSize: 11, color: D.subtle }}>{a.date}</span>,
    views:    <span style={{ fontFamily: "monospace", fontSize: 12, color: a.views > 0 ? D.body : D.muted }}>{a.views > 0 ? a.views.toLocaleString() : "—"}</span>,
    status:   <StatusBadge status={a.status} />,
  }));

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="Gallery & Articles"
        breadcrumb={["Gallery"]}
        stats={[
          { label: "published", value: 6, color: D.green },
          { label: "drafts",    value: 2, color: D.amber },
          { label: "total views", value: "9.8K", color: D.gold },
        ]}
        action={{ label: "New Post" }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {(["list", "grid"] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)} style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer",
              background: viewMode === v ? D.gold + "18" : D.raised,
              border: `1px solid ${viewMode === v ? D.gold + "40" : D.border}`,
              color: viewMode === v ? D.gold : D.subtle,
              borderRadius: 6, padding: "6px 12px", margin: 0, textTransform: "capitalize",
            }}>{v}</button>
          ))}
        </div>
      </PageHeader>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { icon: FileText,  label: "Articles",    value: "5",    color: D.blue   },
          { icon: ImageIcon, label: "Galleries",   value: "3",    color: D.purple },
          { icon: Eye,       label: "Total views", value: "9.8K", color: D.green  },
          { icon: Star,      label: "Featured",    value: "4",    color: D.gold   },
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

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {viewMode === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 10, overflow: "hidden", cursor: "pointer" }}>
              <div style={{ height: 120, background: (TYPE_COLORS[a.type] ?? D.blue) + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {a.type === "Gallery" ? <ImageIcon size={32} style={{ color: TYPE_COLORS[a.type], opacity: 0.5 }} /> : <FileText size={32} style={{ color: TYPE_COLORS[a.type], opacity: 0.5 }} />}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: TYPE_COLORS[a.type], background: TYPE_COLORS[a.type] + "15", borderRadius: 20, padding: "1px 7px" }}>{a.type}</span>
                  <StatusBadge status={a.status} />
                </div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 4 }}>{a.title}</p>
                <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{a.views > 0 ? `${a.views.toLocaleString()} views · ` : ""}{a.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          <SearchBar placeholder="Search articles and galleries..." />
          <DataTable columns={COLUMNS} rows={rows} />
          <Pagination total={filtered.length} perPage={20} page={page} onChange={setPage} />
        </>
      )}
    </div>
  );
}
