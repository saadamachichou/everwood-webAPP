"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, Shield, Users, Plus } from "lucide-react";
import { D, PageHeader, StatusBadge } from "@/components/studio/StudioShell";

const TEAM = [
  { id: "USR-001", name: "Sarvind A.",     email: "sarvind@everwood.co",   role: "Owner",   access: "Full",      lastActive: "Now",           status: "Active", avatar: "SA" },
  { id: "USR-002", name: "Layla Mansour",  email: "layla@everwood.co",     role: "Manager", access: "Full",      lastActive: "2 hours ago",   status: "Active", avatar: "LM" },
  { id: "USR-003", name: "Omar Benali",    email: "omar@everwood.co",      role: "Staff",   access: "Workshops", lastActive: "Yesterday",     status: "Active", avatar: "OB" },
  { id: "USR-004", name: "Nadia Chérif",   email: "nadia@everwood.co",     role: "Staff",   access: "Bookings",  lastActive: "3 days ago",    status: "Active", avatar: "NC" },
  { id: "USR-005", name: "Guest Editor",   email: "guest@example.com",     role: "Editor",  access: "Gallery",   lastActive: "1 week ago",    status: "Invited", avatar: "GE" },
];

const ROLES = [
  { name: "Owner",   desc: "Full access to everything. Cannot be revoked.",    color: D.gold   },
  { name: "Manager", desc: "Full access except billing and team management.",  color: D.purple },
  { name: "Staff",   desc: "Access to assigned sections only.",                color: D.green  },
  { name: "Editor",  desc: "Gallery and content management only.",             color: D.blue   },
];

const ACCESS_SECTIONS = ["Workshops", "Bookings", "Reservations", "Newsletter", "Gallery", "Antiques", "Menu", "Events", "Analytics", "Revenue", "Settings", "Team"];

const ROLE_COLORS: Record<string, string> = { Owner: D.gold, Manager: D.purple, Staff: D.green, Editor: D.blue };

export default function TeamPage() {
  const [selected, setSelected] = useState<typeof TEAM[0] | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <PageHeader
        title="Team & Roles"
        breadcrumb={["Team"]}
        stats={[
          { label: "members", value: 4, color: D.gold },
          { label: "invited", value: 1, color: D.amber },
        ]}
      >
        <button onClick={() => setShowInvite(true)} style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer",
          background: D.gold + "18", border: `1px solid ${D.gold + "40"}`, color: D.gold,
          borderRadius: 7, padding: "7px 14px", margin: 0,
        }}>
          <Plus size={13} /> Invite Member
        </button>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div>
          {/* Team members */}
          <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${D.border}` }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading }}>Members</p>
            </div>
            {TEAM.map((member, i) => (
              <motion.div key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                onClick={() => setSelected(member)}
                style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "14px 20px",
                  borderBottom: i < TEAM.length - 1 ? `1px solid ${D.border}` : "none",
                  cursor: "pointer", transition: "background 0.15s",
                  background: selected?.id === member.id ? D.raised : "transparent",
                }}
                whileHover={{ background: D.raised }}
              >
                {/* Avatar */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: (ROLE_COLORS[member.role] ?? D.subtle) + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: ROLE_COLORS[member.role] ?? D.subtle }}>{member.avatar}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: D.heading }}>{member.name}</p>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: ROLE_COLORS[member.role], background: (ROLE_COLORS[member.role]) + "15", borderRadius: 20, padding: "1px 7px" }}>{member.role}</span>
                    {member.status === "Invited" && <StatusBadge status="Pending" />}
                  </div>
                  <p style={{ fontFamily: "monospace", fontSize: 11, color: D.muted }}>{member.email}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>Access: {member.access}</p>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: D.muted }}>{member.lastActive}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Role permissions */}
          <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20 }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading, marginBottom: 16 }}>Roles</p>
            {ROLES.map((r, i) => (
              <motion.div key={r.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < ROLES.length - 1 ? `1px solid ${D.border}` : "none" }}>
                <Shield size={14} style={{ color: r.color, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: r.color, marginBottom: 2 }}>{r.name}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Member detail */}
          <AnimatePresence>
            {selected && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: D.heading }}>{selected.name}</p>
                  <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 0, margin: 0 }}>✕</button>
                </div>
                {[["Role", selected.role], ["Email", selected.email], ["Access", selected.access], ["Last active", selected.lastActive]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${D.border}` }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle }}>{l}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: D.body }}>{v}</span>
                  </div>
                ))}
                {selected.role !== "Owner" && (
                  <button style={{ width: "100%", marginTop: 14, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer", background: "rgba(240,68,56,0.1)", border: "1px solid rgba(240,68,56,0.3)", color: D.red, borderRadius: 7, padding: "8px", margin: 0 }}>
                    Remove Member
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
            onClick={() => setShowInvite(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 16, padding: 28, width: 420 }}
              onClick={e => e.stopPropagation()}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: D.heading, marginBottom: 20 }}>Invite Team Member</p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginBottom: 6, display: "block" }}>Email</label>
                <input placeholder="colleague@example.com" style={{ width: "100%", background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8, color: D.body, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, padding: "10px 14px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: D.subtle, marginBottom: 6, display: "block" }}>Role</label>
                <select style={{ width: "100%", background: D.raised, border: `1px solid ${D.border}`, borderRadius: 8, color: D.body, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, padding: "10px 14px", outline: "none", boxSizing: "border-box", cursor: "pointer" }}>
                  <option>Staff</option>
                  <option>Manager</option>
                  <option>Editor</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ flex: 1, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.gold + "18", border: `1px solid ${D.gold + "40"}`, color: D.gold, borderRadius: 8, padding: "10px", margin: 0 }}>Send Invite</button>
                <button onClick={() => setShowInvite(false)} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: "pointer", background: D.raised, border: `1px solid ${D.border}`, color: D.subtle, borderRadius: 8, padding: "10px 20px", margin: 0 }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
