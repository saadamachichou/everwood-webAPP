"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Globe, Clock, MapPin, Phone, Mail, Bell, Lock, Palette } from "lucide-react";
import { D, PageHeader } from "@/components/studio/StudioShell";

const SECTIONS = [
  { id: "general",       label: "General",        icon: Store  },
  { id: "contact",       label: "Contact & Hours", icon: Phone  },
  { id: "notifications", label: "Notifications",  icon: Bell   },
  { id: "security",      label: "Security",        icon: Lock   },
  { id: "appearance",    label: "Appearance",      icon: Palette },
];

const inputStyle = {
  width: "100%", background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8,
  color: D.body, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box" as const,
};

const labelStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginBottom: 6, display: "block" as const,
};

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${D.border}` }}>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.body }}>{label}</span>
      <button onClick={onChange} style={{
        width: 44, height: 24, borderRadius: 12, background: checked ? D.gold : D.border, border: "none", cursor: "pointer",
        position: "relative", transition: "background 0.2s", padding: 0, margin: 0,
      }}>
        <span style={{
          position: "absolute", width: 18, height: 18, borderRadius: "50%", background: D.heading,
          top: 3, left: checked ? 23 : 3, transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [notifs, setNotifs] = useState({ bookings: true, reservations: true, newsletter: false, antiques: true, analytics: false });

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader title="Settings" breadcrumb={["Settings"]} />

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
        {/* Sidebar nav */}
        <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 8, height: "fit-content" }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8,
              background: activeSection === s.id ? D.gold + "15" : "transparent",
              border: "none", cursor: "pointer",
              color: activeSection === s.id ? D.gold : D.body,
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, margin: 0,
              transition: "all 0.15s",
            }}>
              <s.icon size={15} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <motion.div key={activeSection} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 28 }}>

          {activeSection === "general" && (
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading, marginBottom: 24 }}>General Settings</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <FormGroup label="Business Name">
                  <input defaultValue="Everwood" style={inputStyle} />
                </FormGroup>
                <FormGroup label="Tagline">
                  <input defaultValue="A Place of Craft, Culture & Coffee" style={inputStyle} />
                </FormGroup>
                <FormGroup label="Currency">
                  <select defaultValue="EGP" style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="EGP">EGP — Egyptian Pound</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                  </select>
                </FormGroup>
                <FormGroup label="Timezone">
                  <select defaultValue="Africa/Cairo" style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="Africa/Cairo">Africa/Cairo (GMT+3)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </FormGroup>
                <div style={{ gridColumn: "1 / -1" }}>
                  <FormGroup label="About / Bio">
                    <textarea defaultValue="Everwood is Cairo's creative sanctuary — a place where craft, culture, and coffee meet." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                  </FormGroup>
                </div>
              </div>
            </div>
          )}

          {activeSection === "contact" && (
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading, marginBottom: 24 }}>Contact & Hours</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <FormGroup label="Phone">
                  <input defaultValue="+20 10 0000 0000" style={inputStyle} />
                </FormGroup>
                <FormGroup label="Email">
                  <input defaultValue="hello@everwood.co" style={inputStyle} />
                </FormGroup>
                <div style={{ gridColumn: "1 / -1" }}>
                  <FormGroup label="Address">
                    <input defaultValue="12 Garden City Street, Cairo, Egypt" style={inputStyle} />
                  </FormGroup>
                </div>
                <FormGroup label="Google Maps Link">
                  <input placeholder="https://maps.google.com/..." style={inputStyle} />
                </FormGroup>
                <FormGroup label="Instagram Handle">
                  <input defaultValue="@everwoodcairo" style={inputStyle} />
                </FormGroup>
              </div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading, margin: "24px 0 16px" }}>Opening Hours</p>
              {["Monday–Thursday", "Friday", "Saturday–Sunday"].map((day, i) => (
                <div key={day} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.body, width: 160, flexShrink: 0 }}>{day}</span>
                  <input defaultValue={["9:00 AM – 11:00 PM", "Closed", "9:00 AM – 12:00 AM"][i]} style={{ ...inputStyle, flex: 1 }} />
                </div>
              ))}
            </div>
          )}

          {activeSection === "notifications" && (
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading, marginBottom: 24 }}>Notification Preferences</p>
              <Toggle label="New workshop booking"    checked={notifs.bookings}      onChange={() => setNotifs(n => ({ ...n, bookings: !n.bookings }))}      />
              <Toggle label="New table reservation"   checked={notifs.reservations}  onChange={() => setNotifs(n => ({ ...n, reservations: !n.reservations }))} />
              <Toggle label="Newsletter subscribers"  checked={notifs.newsletter}    onChange={() => setNotifs(n => ({ ...n, newsletter: !n.newsletter }))}   />
              <Toggle label="Antique enquiry"         checked={notifs.antiques}      onChange={() => setNotifs(n => ({ ...n, antiques: !n.antiques }))}       />
              <Toggle label="Weekly analytics digest" checked={notifs.analytics}     onChange={() => setNotifs(n => ({ ...n, analytics: !n.analytics }))}    />
            </div>
          )}

          {activeSection === "security" && (
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading, marginBottom: 24 }}>Security</p>
              <FormGroup label="Current Password">
                <input type="password" placeholder="••••••••" style={inputStyle} />
              </FormGroup>
              <FormGroup label="New Password">
                <input type="password" placeholder="••••••••" style={inputStyle} />
              </FormGroup>
              <FormGroup label="Confirm New Password">
                <input type="password" placeholder="••••••••" style={inputStyle} />
              </FormGroup>
              <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.gold + "18", border: `1px solid ${D.gold + "40"}`, color: D.gold, borderRadius: 8, padding: "10px 24px", margin: 0, marginTop: 8 }}>
                Update Password
              </button>
              <div style={{ marginTop: 32, padding: 16, borderRadius: 10, border: `1px solid ${D.border}`, background: D.raised }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: D.heading, marginBottom: 8 }}>Two-Factor Authentication</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginBottom: 12 }}>Add an extra layer of security to your account.</p>
                <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.body, borderRadius: 7, padding: "7px 16px", margin: 0 }}>
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading, marginBottom: 24 }}>Appearance</p>
              <FormGroup label="Primary Color">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["#C9A96E", "#2E4B3A", "#C9573A", "#4B8DDB", "#9B6DFF"].map(c => (
                    <div key={c} style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: "pointer", border: c === "#C9A96E" ? `2px solid ${D.heading}` : "2px solid transparent" }} />
                  ))}
                </div>
              </FormGroup>
              <FormGroup label="Studio Theme">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {["Dark (Default)", "Light (Coming soon)"].map((t, i) => (
                    <div key={t} style={{
                      padding: 16, borderRadius: 10, border: `2px solid ${i === 0 ? D.gold + "40" : D.border}`,
                      background: i === 0 ? D.gold + "08" : D.raised, cursor: i === 0 ? "pointer" : "not-allowed", opacity: i === 1 ? 0.4 : 1,
                    }}>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: i === 0 ? D.gold : D.subtle }}>{t}</p>
                    </div>
                  ))}
                </div>
              </FormGroup>
            </div>
          )}

          {/* Save button */}
          {activeSection !== "security" && (
            <div style={{ display: "flex", gap: 10, marginTop: 32, paddingTop: 20, borderTop: `1px solid ${D.border}` }}>
              <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.gold + "18", border: `1px solid ${D.gold + "40"}`, color: D.gold, borderRadius: 8, padding: "10px 24px", margin: 0 }}>
                Save Changes
              </button>
              <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.subtle, borderRadius: 8, padding: "10px 20px", margin: 0 }}>
                Discard
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
