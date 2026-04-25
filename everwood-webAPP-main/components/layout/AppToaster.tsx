"use client";

import { Toaster } from "sonner";

/** Split from root layout so `layout.js` stays smaller for initial load. */
export default function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--color-iron)",
          color: "var(--color-ivory)",
          border: "1px solid rgba(201,169,110,0.15)",
          fontFamily: "var(--font-grotesk)",
          fontSize: "0.8rem",
          letterSpacing: "0.05em",
        },
      }}
    />
  );
}
