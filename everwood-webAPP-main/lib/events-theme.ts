/**
 * /events palette — role-based usage:
 * · EV.bg — page canvas (#0f1115)
 * · EV.cream — primary readable text (#e6c49a)
 * · EV.violet — elevated panels / cards (#3a2b44)
 * · EV.bronze — CTAs, links-on-hover emphasis (#b97a3e) — use sparingly
 * · EV.burgundy — accents only: dividers, icons, thin borders (#6b1e2f)
 * Avoid burgundy-filled chips with burgundy body copy on violet (low contrast).
 */

export const EV = {
  bg: "#0f1115",
  burgundy: "#6b1e2f",
  bronze: "#b97a3e",
  violet: "#3a2b44",
  cream: "#e6c49a",
} as const;

/** Label text on bronze buttons */
export const onBronze = EV.bg;

export const evR = {
  bronze: (a: number) => `rgba(185, 122, 62, ${a})`,
  cream: (a: number) => `rgba(230, 196, 154, ${a})`,
  violet: (a: number) => `rgba(58, 43, 68, ${a})`,
  burgundy: (a: number) => `rgba(107, 30, 47, ${a})`,
};

/** Secondary body — slightly transparent beige */
export const evMuted = "rgba(230, 196, 154, 0.58)";
export const evMuted65 = "rgba(230, 196, 154, 0.65)";
export const evSoftLine = "rgba(230, 196, 154, 0.08)";
/** Dividers / modal chrome — slightly stronger than evSoftLine for visibility on dark panels */
export const evPanelLine = "rgba(230, 196, 154, 0.14)";

/** Subtle bronze halo for primary buttons */
export const bronzeButtonGlow = `0 0 32px ${evR.bronze(0.22)}`;

/** Background wash: deep base → whisper of violet → base */
export const washNightToViolet = `linear-gradient(180deg, ${EV.bg} 0%, ${evR.violet(0.14)} 42%, ${EV.bg} 100%)`;
