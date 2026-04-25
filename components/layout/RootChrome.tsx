"use client";

import dynamic from "next/dynamic";
import ScrollToTop from "@/components/layout/ScrollToTop";

const CustomCursor = dynamic(() => import("@/components/layout/CustomCursor"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/layout/ScrollProgress"), { ssr: false });
const WhatsAppFloat = dynamic(() => import("@/components/layout/WhatsAppFloat"), { ssr: false });
const AppToaster = dynamic(() => import("@/components/layout/AppToaster"), { ssr: false });

export default function RootChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      <ScrollProgress />
      <WhatsAppFloat />
      {children}
      <AppToaster />
    </>
  );
}
