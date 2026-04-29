"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Globe, Share2, FileText, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { D, PageHeader, StatusBadge } from "@/components/studio/StudioShell";

const PAGES = [
  { path: "/",           title: "Everwood — Craft, Culture & Coffee in Cairo",    desc: "A creative sanctuary in Cairo where craft, culture, and coffee come together. Workshops, events, dining, and antiques.",   score: 94, issues: 0,  status: "Good"    },
  { path: "/workshops",  title: "Craft Workshops in Cairo | Everwood",             desc: "Explore pottery, shibori dyeing, terrarium building, and more. Book your spot at Everwood's creative workshops.",            score: 88, issues: 1,  status: "Good"    },
  { path: "/events",     title: "Events at Everwood Cairo",                        desc: "From jazz nights to artisan markets — discover upcoming events at Everwood.",                                                 score: 81, issues: 2,  status: "Good"    },
  { path: "/antiques",   title: "Curated Antiques | Everwood Cairo",               desc: "Browse our curated collection of Moroccan, Egyptian, and European antiques.",                                               score: 72, issues: 3,  status: "Warning" },
  { path: "/menu",       title: "Menu | Everwood Café",                            desc: "Specialty coffee, artisan pastries, and seasonal food at Everwood Café, Cairo.",                                            score: 79, issues: 1,  status: "Good"    },
  { path: "/gallery",    title: "Gallery & Stories | Everwood",                   desc: "",                                                                                                                            score: 41, issues: 5,  status: "Error"   },
  { path: "/about",      title: "About Everwood",                                  desc: "The story of Everwood — who we are and why we do what we do.",                                                               score: 90, issues: 0,  status: "Good"    },
  { path: "/contact",    title: "Contact | Everwood Cairo",                        desc: "Get in touch with the Everwood team.",                                                                                       score: 85, issues: 1,  status: "Good"    },
];

const SCORE_COLOR = (s: number) => s >= 85 ? D.green : s >= 65 ? D.amber : D.red;
const STATUS_ICON = (s: string) => s === "Good" ? CheckCircle : s === "Warning" ? AlertTriangle : XCircle;

const inputStyle = {
  width: "100%", background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8,
  color: D.body, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box" as const,
};
const labelStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginBottom: 6, display: "block" as const };

export default function SeoPage() {
  const [selectedPage, setSelectedPage] = useState(PAGES[0]);

  const avgScore = Math.round(PAGES.reduce((s, p) => s + p.score, 0) / PAGES.length);
  const totalIssues = PAGES.reduce((s, p) => s + p.issues, 0);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="SEO Settings"
        breadcrumb={["SEO"]}
        stats={[
          { label: "avg score",   value: `${avgScore}/100`, color: SCORE_COLOR(avgScore) },
          { label: "total issues", value: totalIssues,       color: totalIssues > 3 ? D.red : D.amber },
          { label: "pages",       value: PAGES.length },
        ]}
      />

      {/* Global SEO settings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Globe size={15} style={{ color: D.blue }} />
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading }}>Global Settings</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Site Name</label>
            <input defaultValue="Everwood" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Default Meta Description</label>
            <textarea defaultValue="Everwood is Cairo's creative sanctuary — workshops, events, antiques, and specialty coffee." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle}>Canonical Domain</label>
            <input defaultValue="https://everwood.co" style={inputStyle} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Share2 size={15} style={{ color: D.purple }} />
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading }}>Open Graph / Social</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>OG Title</label>
            <input defaultValue="Everwood — Craft, Culture & Coffee in Cairo" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>OG Description</label>
            <textarea defaultValue="A creative sanctuary where craft, culture, and coffee meet." rows={2} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle}>OG Image URL</label>
            <input placeholder="/images/og-cover.jpg" style={inputStyle} />
          </div>
        </motion.div>
      </div>

      {/* Per-page SEO */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
        {/* Page list */}
        <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, overflow: "hidden", height: "fit-content" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${D.border}` }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: D.heading }}>Pages</p>
          </div>
          {PAGES.map((page, i) => {
            const StatusIco = STATUS_ICON(page.status);
            return (
              <button key={page.path} onClick={() => setSelectedPage(page)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 16px", background: selectedPage.path === page.path ? D.raised : "transparent",
                border: "none", borderBottom: i < PAGES.length - 1 ? `1px solid ${D.border}` : "none",
                cursor: "pointer", textAlign: "left",
              }}>
                <StatusIco size={13} style={{ color: SCORE_COLOR(page.score), flexShrink: 0 }} />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{ fontFamily: "monospace", fontSize: 11, color: selectedPage.path === page.path ? D.gold : D.body, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{page.path}</p>
                </div>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: SCORE_COLOR(page.score), flexShrink: 0 }}>{page.score}</span>
              </button>
            );
          })}
        </div>

        {/* Page editor */}
        <motion.div key={selectedPage.path} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 12, color: D.gold, marginBottom: 4 }}>{selectedPage.path}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: SCORE_COLOR(selectedPage.score) + "20", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${SCORE_COLOR(selectedPage.score)}` }}>
                    <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: SCORE_COLOR(selectedPage.score) }}>{selectedPage.score}</span>
                  </div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>SEO Score</span>
                </div>
                {selectedPage.issues > 0 && (
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.red, background: "rgba(240,68,56,0.1)", borderRadius: 20, padding: "2px 8px" }}>
                    {selectedPage.issues} issue{selectedPage.issues > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Meta Title <span style={{ color: D.muted, fontWeight: 400 }}>({selectedPage.title.length}/60 chars)</span></label>
            <input defaultValue={selectedPage.title} style={{ ...inputStyle, borderColor: selectedPage.title.length > 60 ? D.red : D.border }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Meta Description <span style={{ color: D.muted, fontWeight: 400 }}>({selectedPage.desc.length}/160 chars)</span></label>
            <textarea defaultValue={selectedPage.desc} rows={3} placeholder="Write a compelling meta description..." style={{ ...inputStyle, resize: "vertical", borderColor: selectedPage.desc.length === 0 ? D.red : D.border }} />
          </div>

          {/* SERP preview */}
          <div style={{ background: D.raised, borderRadius: 10, padding: 16, marginBottom: 20, border: `1px solid ${D.border}` }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.muted, marginBottom: 10 }}>SERP Preview</p>
            <p style={{ fontFamily: "arial, sans-serif", fontSize: 18, color: "#8ab4f8", marginBottom: 2 }}>{selectedPage.title || "No title set"}</p>
            <p style={{ fontFamily: "monospace", fontSize: 11, color: "#34a853", marginBottom: 4 }}>everwood.co{selectedPage.path}</p>
            <p style={{ fontFamily: "arial, sans-serif", fontSize: 13, color: "#bdc1c6", lineHeight: 1.5 }}>{selectedPage.desc || "No description set."}</p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.gold + "18", border: `1px solid ${D.gold + "40"}`, color: D.gold, borderRadius: 8, padding: "10px 24px", margin: 0 }}>
              Save Page SEO
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
