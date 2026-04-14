"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, AlertTriangle, Server } from "lucide-react";
import { D, PageHeader } from "@/components/studio/StudioShell";

const inputStyle = {
  width: "100%", background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8,
  color: D.body, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
  padding: "10px 14px", outline: "none", boxSizing: "border-box" as const,
};
const labelStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginBottom: 6, display: "block" as const };

const TEMPLATES = [
  { id: "booking-confirm",   name: "Booking Confirmation",    subject: "Your Everwood workshop is confirmed ✓",       status: "Active"   },
  { id: "booking-reminder",  name: "Workshop Reminder",        subject: "Your Everwood session is tomorrow",            status: "Active"   },
  { id: "booking-cancel",    name: "Booking Cancellation",     subject: "Your booking has been cancelled",              status: "Active"   },
  { id: "reservation-confirm",name: "Reservation Confirmation",subject: "Your table is reserved at Everwood",           status: "Active"   },
  { id: "newsletter-welcome",name: "Newsletter Welcome",       subject: "Welcome to the Everwood circle",               status: "Active"   },
  { id: "contact-receipt",   name: "Contact Auto-Reply",       subject: "We've received your message — Everwood",       status: "Active"   },
  { id: "gift-voucher",      name: "Gift Voucher",             subject: "Your Everwood gift voucher is enclosed",        status: "Draft"    },
];

const EMAIL_LOGS = [
  { to: "layla@email.com",   subject: "Your Everwood workshop is confirmed ✓", template: "booking-confirm",   date: "Jun 10, 10:42 AM", status: "Delivered" },
  { to: "omar@email.com",    subject: "Your table is reserved at Everwood",    template: "reservation-confirm",date: "Jun 9, 2:10 PM",   status: "Delivered" },
  { to: "nadia@email.com",   subject: "We've received your message — Everwood",template: "contact-receipt",   date: "Jun 8, 4:30 PM",   status: "Delivered" },
  { to: "bounce@example.com",subject: "Welcome to the Everwood circle",        template: "newsletter-welcome",date: "Jun 7, 9:00 AM",   status: "Bounced"   },
  { to: "youssef@email.com", subject: "Your Everwood session is tomorrow",     template: "booking-reminder",  date: "Jun 6, 8:00 AM",   status: "Delivered" },
];

const STATUS_COLORS: Record<string, string> = { Delivered: D.green, Bounced: D.red, Failed: D.red, Pending: D.amber };

export default function EmailPage() {
  const [smtpSaved, setSmtpSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"smtp" | "templates" | "logs">("smtp");

  const tabs = [
    { id: "smtp",      label: "SMTP Config"   },
    { id: "templates", label: "Email Templates"},
    { id: "logs",      label: "Send Log"       },
  ] as const;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="Email Configuration"
        breadcrumb={["Email"]}
        stats={[
          { label: "templates", value: 7,     color: D.gold  },
          { label: "sent today", value: 14                   },
          { label: "bounced",    value: 1,    color: D.red   },
        ]}
      />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer",
            background: activeTab === t.id ? D.gold + "18" : D.raised,
            border: `1px solid ${activeTab === t.id ? D.gold + "40" : D.border}`,
            color: activeTab === t.id ? D.gold : D.subtle,
            borderRadius: 7, padding: "8px 18px", margin: 0,
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "smtp" && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
          <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <Server size={16} style={{ color: D.blue }} />
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: D.heading }}>SMTP Settings</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>SMTP Host</label>
                <input defaultValue="smtp.resend.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Port</label>
                <input defaultValue="465" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Encryption</label>
                <select defaultValue="SSL" style={{ ...inputStyle, cursor: "pointer" }}>
                  <option>SSL</option>
                  <option>TLS</option>
                  <option>None</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Username</label>
                <input defaultValue="hello@everwood.co" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" defaultValue="••••••••••••" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>From Name</label>
                <input defaultValue="Everwood" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>From Email</label>
                <input defaultValue="hello@everwood.co" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setSmtpSaved(true)} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.gold + "18", border: `1px solid ${D.gold + "40"}`, color: D.gold, borderRadius: 8, padding: "10px 24px", margin: 0 }}>
                Save Settings
              </button>
              <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.body, borderRadius: 8, padding: "10px 20px", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <Send size={13} /> Send Test Email
              </button>
            </div>
            {smtpSaved && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, color: D.green }}>
                <CheckCircle size={14} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12 }}>Settings saved successfully.</span>
              </motion.div>
            )}
          </div>

          {/* Connection status */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20 }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: D.heading, marginBottom: 16 }}>Connection Status</p>
              {[
                { label: "SMTP Host",   status: "Connected",    ok: true  },
                { label: "Auth",        status: "Authenticated",ok: true  },
                { label: "Send quota",  status: "980 / 1000",   ok: true  },
                { label: "Last tested", status: "Jun 9, 11:00 AM", ok: true },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${D.border}` }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>{item.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {item.ok ? <CheckCircle size={11} style={{ color: D.green }} /> : <AlertTriangle size={11} style={{ color: D.amber }} />}
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: item.ok ? D.green : D.amber }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20 }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: D.heading, marginBottom: 12 }}>Quick Stats (30d)</p>
              {[
                { label: "Sent",      value: "248", color: D.gold  },
                { label: "Delivered", value: "242", color: D.green },
                { label: "Bounced",   value: "6",   color: D.red   },
                { label: "Open rate", value: "38%", color: D.blue  },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${D.border}` }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>{s.label}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      {activeTab === "templates" && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, overflow: "hidden" }}>
          {TEMPLATES.map((t, i) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: i < TEMPLATES.length - 1 ? `1px solid ${D.border}` : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: D.gold + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Mail size={14} style={{ color: D.gold }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading, marginBottom: 2 }}>{t.name}</p>
                <p style={{ fontFamily: "monospace", fontSize: 11, color: D.muted }}>{t.subject}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: t.status === "Active" ? D.green : D.amber, background: (t.status === "Active" ? D.green : D.amber) + "15", borderRadius: 20, padding: "2px 8px" }}>{t.status}</span>
                <button style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.body, borderRadius: 6, padding: "5px 12px", margin: 0 }}>Edit</button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === "logs" && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", borderBottom: `1px solid ${D.border}`, display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: D.heading }}>Recent Send Log</p>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: D.muted }}>{EMAIL_LOGS.length} entries</span>
          </div>
          {EMAIL_LOGS.map((log, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderBottom: i < EMAIL_LOGS.length - 1 ? `1px solid ${D.border}` : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[log.status] ?? D.subtle, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: D.body, marginBottom: 2 }}>{log.subject}</p>
                <p style={{ fontFamily: "monospace", fontSize: 11, color: D.muted }}>{log.to}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: STATUS_COLORS[log.status], marginBottom: 2 }}>{log.status}</p>
                <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{log.date}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
