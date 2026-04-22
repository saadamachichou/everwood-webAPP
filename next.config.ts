import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next build` defaults to Turbopack in Next 16; an empty config acknowledges we still
  // use a `webpack` hook for dev source maps (`npm run dev`).
  turbopack: {},

  // Production: emit separate .map files (Lighthouse / debugging).
  productionBrowserSourceMaps: true,

  // Development: Next.js normally forces eval-based devtool and reverts overrides.
  // With NEXT_WEBPACK_ALLOW_DEVTOOL=1 (see package.json "dev") and patches/next+*.patch,
  // the client bundle uses file-based source maps so Lighthouse stops flagging dev chunks.
  webpack: (config, { dev, isServer }) => {
    // Full `source-map` includes complete sourcesContent (fewer Lighthouse warnings than cheap-module).
    if (dev && process.env.NEXT_WEBPACK_ALLOW_DEVTOOL === "1" && !isServer) {
      config.devtool = "source-map";
    }
    return config;
  },
};

export default nextConfig;
