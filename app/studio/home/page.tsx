"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Save, RotateCcw, Layout } from "lucide-react";
import { D, PageHeader, StatusBadge } from "@/components/studio/StudioShell";

const SECTIONS = [
  { id: "hero",       label: "Hero / Landing",     enabled: true,  order: 1  },
  { id: "threshold",  label: "Welcome Statement",  enabled: true,  order: 2  },
  { id: "compass",    label: "Four Pillars",       enabled: true,  order: 3  },
  { id: "meridian",   label: "Signature Moment",   enabled: true,  order: 4  },
  { id: "cabinet",    label: "Object of the Day",  enabled: true,  order: 5  },
  { id: "workshops",  label: "Workshop Showcase",  enabled: true,  order: 6  },
  { id: "gathering",  label: "Upcoming Events",    enabled: true,  order: 7  },
  { id: "antiques",   label: "Antique Feature",    enabled: true,  order: 8  },
  { id: "newsletter", label: "Newsletter Signup",  enabled: true,  order: 9  },
];

const inputStyle = {
  width: "100%", background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8,
  color: D.body, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box" as const,
};
const labelStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginBottom: 6, display: "block" as const };

export default function HomePageEditor() {
  const [sections, setSections] = useState(SECTIONS);
  const [activeSection, setActiveSection] = useState("hero");
  const [saved, setSaved] = useState(false);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="Home Page CMS"
        breadcrumb={["Home"]}
        stats={[
          { label: "sections", value: sections.length,                         color: D.gold  },
          { label: "active",   value: sections.filter(s => s.enabled).length,  color: D.green },
        ]}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSave} style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer",
            background: saved ? D.green + "18" : D.gold + "18",
            border: `1px solid ${saved ? D.green + "40" : D.gold + "40"}`,
            color: saved ? D.green : D.gold,
            borderRadius: 7, padding: "7px 14px", margin: 0,
          }}>
            <Save size={13} />
            {saved ? "Saved!" : "Save Changes"}
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 6, textDecoration: "none",
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 12,
            background: D.raised, border: `1px solid ${D.border}`,
            color: D.body, borderRadius: 7, padding: "7px 14px",
          }}>
            <Eye size={13} /> Preview
          </a>
        </div>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
        {/* Section list */}
        <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, overflow: "hidden", height: "fit-content" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${D.border}` }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: D.heading }}>Page Sections</p>
          </div>
          {sections.map((section, i) => (
            <div key={section.id}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                background: activeSection === section.id ? D.raised : "transparent",
                borderBottom: i < sections.length - 1 ? `1px solid ${D.border}` : "none",
                cursor: "pointer",
              }}
              onClick={() => setActiveSection(section.id)}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: D.muted, width: 14, flexShrink: 0 }}>{section.order}</span>
              <p style={{ flex: 1, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: activeSection === section.id ? D.gold : section.enabled ? D.body : D.muted }}>{section.label}</p>
              <button onClick={e => { e.stopPropagation(); toggleSection(section.id); }} style={{
                width: 32, height: 18, borderRadius: 9, background: section.enabled ? D.gold : D.border,
                border: "none", cursor: "pointer", position: "relative", padding: 0, margin: 0, flexShrink: 0,
                transition: "background 0.2s",
              }}>
                <span style={{ position: "absolute", width: 12, height: 12, borderRadius: "50%", background: D.heading, top: 3, left: section.enabled ? 17 : 3, transition: "left 0.2s" }} />
              </button>
            </div>
          ))}
        </div>

        {/* Editor area */}
        <motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 28 }}>

          {activeSection === "hero" && (
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading, marginBottom: 24 }}>Hero Section</p>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Hero Video URL</label>
                <input defaultValue="/videos/hero.mp4" style={inputStyle} />
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.muted, marginTop: 4 }}>Upload video to /public/videos/</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Headline</label>
                  <input defaultValue="Where craft meets culture" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tagline</label>
                  <input defaultValue="A Place of Craft, Culture & Coffee" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Primary CTA Label</label>
                  <input defaultValue="Explore Workshops" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Primary CTA Link</label>
                  <input defaultValue="/workshops" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Secondary CTA Label</label>
                  <input defaultValue="View Menu" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Secondary CTA Link</label>
                  <input defaultValue="/menu" style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {activeSection === "threshold" && (
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading, marginBottom: 24 }}>Welcome Statement</p>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Statement Text</label>
                <textarea defaultValue="A space where the handmade and the thoughtfully sourced come together. Not just a café, not just a workshop—Everwood is a place to slow down, make something, and be moved by beauty." rows={5} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div>
                <label style={labelStyle}>Attributed Name (optional)</label>
                <input placeholder="— Everwood, Cairo" style={inputStyle} />
              </div>
            </div>
          )}

          {activeSection === "workshops" && (
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading, marginBottom: 24 }}>Workshop Showcase Section</p>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Section Heading</label>
                <input defaultValue="Workshops & Experiences" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Section Subheading</label>
                <input defaultValue="Learn something new. Make something beautiful." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Max workshops to show</label>
                <select defaultValue="6" style={{ ...inputStyle, cursor: "pointer" }}>
                  {[3, 4, 6, 8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          )}

          {!["hero", "threshold", "workshops"].includes(activeSection) && (
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading, marginBottom: 8 }}>
                {sections.find(s => s.id === activeSection)?.label}
              </p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.subtle, marginBottom: 24 }}>
                Full editor coming soon. This section is currently controlled by the codebase.
              </p>
              <div style={{ background: D.raised, borderRadius: 10, padding: 20, border: `1px solid ${D.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Layout size={16} style={{ color: D.blue }} />
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.body }}>Section is {sections.find(s => s.id === activeSection)?.enabled ? "visible" : "hidden"} on the homepage.</p>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.muted, marginTop: 2 }}>Toggle the switch in the left panel to show or hide it.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save bar */}
          <div style={{ display: "flex", gap: 10, marginTop: 32, paddingTop: 20, borderTop: `1px solid ${D.border}` }}>
            <button onClick={handleSave} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.gold + "18", border: `1px solid ${D.gold + "40"}`, color: D.gold, borderRadius: 8, padding: "10px 24px", margin: 0 }}>
              Save Section
            </button>
            <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.subtle, borderRadius: 8, padding: "10px 16px", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <RotateCcw size={12} /> Revert
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
