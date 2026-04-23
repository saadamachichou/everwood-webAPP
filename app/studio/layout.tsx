"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Coffee, Scissors, Image, Archive,
  Calendar, BookOpen, Mail, BarChart2, Settings, Users, Shield,
  Search, Bell, Plus, ExternalLink, ChevronRight, X, Menu,
  Zap, TrendingUp, Globe, Layers, Inbox, Receipt, Truck,
} from "lucide-react";

// ── Design tokens ──────────────────────────────────────────────────
const D = {
  ground:   "#0F1117",
  surface:  "#161B24",
  raised:   "#1E2433",
  border:   "#2A3142",
  muted:    "#3D4B63",
  subtle:   "#5A6B84",
  body:     "#C8D0DC",
  heading:  "#E8ECF2",
  gold:     "#C9A96E",
  goldGlow: "rgba(201,169,110,0.12)",
  green:    "#3DD68C",
  amber:    "#F0A429",
  red:      "#F04438",
  blue:     "#4B8DDB",
  purple:   "#9B6DFF",
} as const;

// ── Nav structure ──────────────────────────────────────────────────
const NAV = [
  { group: "OVERVIEW",     items: [
    { href: "/studio",              icon: LayoutDashboard, label: "Dashboard",       badge: null },
  ]},
  { group: "CONTENT",      items: [
    { href: "/studio/home",         icon: Globe,           label: "Home Page",       badge: null },
    { href: "/studio/menu",         icon: Coffee,          label: "Menu & Coffee",   badge: 2    },
    { href: "/studio/workshops",    icon: Scissors,        label: "Workshops",       badge: 3    },
    { href: "/studio/gallery",      icon: Image,           label: "Gallery",         badge: null },
    { href: "/studio/antiques",     icon: Archive,         label: "Antiques",        badge: null },
    { href: "/studio/events",       icon: Calendar,        label: "Events",          badge: 1    },
  ]},
  { group: "OPERATIONS",   items: [
    { href: "/studio/bookings",     icon: BookOpen,        label: "Bookings",        badge: 7    },
    { href: "/studio/reservations", icon: Receipt,         label: "Reservations",    badge: null },
    { href: "/studio/cod",          icon: Truck,           label: "COD Dispatch",    badge: 5    },
  ]},
  { group: "COMMUNICATION",items: [
    { href: "/studio/newsletter",   icon: Mail,            label: "Newsletter",      badge: null },
    { href: "/studio/submissions",  icon: Inbox,           label: "Submissions",     badge: 4    },
    { href: "/studio/email",        icon: Zap,             label: "Email / SMTP",    badge: null },
  ]},
  { group: "ANALYTICS",    items: [
    { href: "/studio/analytics",    icon: BarChart2,       label: "Traffic",         badge: null },
    { href: "/studio/revenue",      icon: TrendingUp,      label: "Revenue",         badge: null },
  ]},
  { group: "SYSTEM",       items: [
    { href: "/studio/settings",     icon: Settings,        label: "Settings",        badge: null },
    { href: "/studio/team",         icon: Users,           label: "Team & Roles",    badge: null },
    { href: "/studio/seo",          icon: Layers,          label: "SEO",             badge: null },
    { href: "/studio/audit",        icon: Shield,          label: "Audit Log",       badge: null },
  ]},
];

// ── Sidebar ────────────────────────────────────────────────────────
function Sidebar({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed", top: 56, left: 0, bottom: 0,
        background: D.raised, borderRight: `1px solid ${D.border}`,
        zIndex: 200, display: "flex", flexDirection: "column",
        overflowX: "hidden", overflowY: "auto",
      }}
    >
      {/* Mobile close */}
      {onClose && (
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 4 }}>
          <X size={16} />
        </button>
      )}

      <div style={{ padding: collapsed ? "8px 0" : "8px 0", flex: 1 }}>
        {NAV.map(({ group, items }) => (
          <div key={group} style={{ marginBottom: 4 }}>
            {/* Group label */}
            {!collapsed && (
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 10, fontWeight: 500, letterSpacing: "0.12em",
                color: D.muted, textTransform: "uppercase",
                padding: "12px 16px 4px",
              }}>
                {group}
              </p>
            )}
            {collapsed && <div style={{ height: 12 }} />}

            {items.map(({ href, icon: Icon, label, badge }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} style={{ textDecoration: "none", display: "block" }}>
                  <motion.div
                    whileHover={{ backgroundColor: "rgba(201,169,110,0.06)" }}
                    style={{
                      display: "flex", alignItems: "center",
                      gap: 10, padding: collapsed ? "10px 20px" : "9px 12px",
                      position: "relative", cursor: "pointer",
                      justifyContent: collapsed ? "center" : "flex-start",
                      background: active ? "rgba(201,169,110,0.08)" : "transparent",
                    }}
                  >
                    {/* Active left border */}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: "absolute", left: 0, top: 4, bottom: 4,
                          width: 2, borderRadius: "0 2px 2px 0",
                          background: D.gold,
                        }}
                      />
                    )}

                    <Icon
                      size={16}
                      style={{ color: active ? D.gold : D.subtle, flexShrink: 0 }}
                    />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.18 }}
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 13, fontWeight: active ? 500 : 400,
                            color: active ? D.body : D.subtle,
                            flex: 1, whiteSpace: "nowrap",
                          }}
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Badge */}
                    {badge && !collapsed && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          background: "rgba(240,164,41,0.15)",
                          color: D.amber, borderRadius: 9,
                          fontSize: 10, fontWeight: 600,
                          padding: "1px 6px", lineHeight: "16px",
                          fontFamily: "monospace",
                        }}
                      >
                        {badge}
                      </motion.span>
                    )}
                    {badge && collapsed && (
                      <div style={{
                        position: "absolute", top: 6, right: 8,
                        width: 6, height: 6, borderRadius: "50%",
                        background: D.amber,
                      }} />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: live status */}
      <div style={{ padding: collapsed ? "12px 0" : "12px 16px", borderTop: `1px solid ${D.border}` }}>
        {!collapsed ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: D.green, flexShrink: 0 }}
              />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: D.subtle }}>Site is live</span>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: D.subtle, display: "flex" }}>
              <ExternalLink size={11} />
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: D.green }}
            />
          </div>
        )}
      </div>
    </motion.aside>
  );
}

// ── Top Bar ────────────────────────────────────────────────────────
function TopBar({ onMenuToggle, sidebarCollapsed }: { onMenuToggle: () => void; sidebarCollapsed: boolean }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <motion.header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 56,
        background: D.surface, borderBottom: `1px solid ${D.border}`,
        zIndex: 300, display: "flex", alignItems: "center",
        padding: "0 20px", gap: 12, margin: 0,
      }}
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left: Logo + collapse toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 220 }}>
        <button
          onClick={onMenuToggle}
          style={{ background: "transparent", border: "none", color: D.subtle, cursor: "pointer", padding: 6, display: "flex", borderRadius: 6, margin: 0 }}
        >
          <Menu size={16} />
        </button>
        <Link href="/studio" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: `linear-gradient(135deg, ${D.gold}, rgba(212,148,58,0.7))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#1A120A", flexShrink: 0,
          }}>E</div>
          <div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: D.heading }}>Everwood</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 300, color: D.subtle }}> Studio</span>
          </div>
        </Link>
      </div>

      {/* Center: Search */}
      <motion.div
        animate={{ width: searchFocused ? 360 : 280 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "relative", flex: "0 0 auto",
          background: D.raised,
          border: `1px solid ${searchFocused ? "rgba(201,169,110,0.4)" : D.border}`,
          borderRadius: 8, display: "flex", alignItems: "center", gap: 8,
          padding: "0 12px", height: 34,
          boxShadow: searchFocused ? `0 0 0 3px rgba(201,169,110,0.08)` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <Search size={13} style={{ color: D.muted, flexShrink: 0 }} />
        <input
          placeholder="Search everything..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            background: "transparent", border: "none", outline: "none",
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
            color: D.body, width: "100%",
          }}
        />
        <kbd style={{
          fontFamily: "monospace", fontSize: 10, color: D.muted,
          border: `1px solid ${D.border}`, borderRadius: 4,
          padding: "1px 5px", flexShrink: 0,
        }}>⌘K</kbd>
      </motion.div>

      {/* Right: Actions */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>

        {/* + New button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: `linear-gradient(135deg, ${D.gold}, #D4943A)`,
            border: "none", borderRadius: 7, color: "#1A120A",
            padding: "0 14px", height: 32,
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600,
            cursor: "pointer", letterSpacing: "0.02em", margin: 0,
          }}
        >
          <Plus size={13} />
          New
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ backgroundColor: D.raised }}
          onClick={() => setNotifOpen(!notifOpen)}
          style={{
            position: "relative", background: "transparent", border: `1px solid ${D.border}`,
            borderRadius: 7, color: D.subtle, cursor: "pointer",
            width: 32, height: 32, display: "flex", alignItems: "center",
            justifyContent: "center", margin: 0,
          }}
        >
          <Bell size={14} />
          <span style={{
            position: "absolute", top: -3, right: -3,
            width: 14, height: 14, borderRadius: "50%",
            background: D.red, color: "#fff",
            fontSize: 9, fontWeight: 700, fontFamily: "monospace",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `2px solid ${D.surface}`,
          }}>3</span>
        </motion.button>

        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "transparent", border: `1px solid ${D.border}`,
            borderRadius: 7, color: D.subtle, textDecoration: "none",
            padding: "0 12px", height: 32,
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 12,
          }}
        >
          <ExternalLink size={11} />
          <span>Site</span>
        </a>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${D.gold}40, rgba(212,148,58,0.2))`,
            border: `1px solid ${D.gold}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, color: D.gold }}>SA</span>
        </motion.div>
      </div>
    </motion.header>
  );
}

// ── Root Layout ────────────────────────────────────────────────────
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 64 : 240);

  return (
    <div style={{ background: D.ground, minHeight: "100dvh", position: "relative" }}>
      <TopBar
        onMenuToggle={() => isMobile ? setMobileSidebarOpen(!mobileSidebarOpen) : setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Desktop sidebar */}
      {!isMobile && <Sidebar collapsed={sidebarCollapsed} />}

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobile && mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 199, margin: 0 }}
            />
            <Sidebar collapsed={false} onClose={() => setMobileSidebarOpen(false)} />
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.main
        animate={{ paddingLeft: sidebarWidth }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          paddingTop: 56, minHeight: "100dvh",
          paddingLeft: sidebarWidth,
        }}
      >
        <div style={{ padding: "32px", maxWidth: "none" }}>
          {children}
        </div>
      </motion.main>
    </div>
  );
}
