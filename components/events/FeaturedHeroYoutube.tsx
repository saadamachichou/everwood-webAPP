"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_ID = "tqU3tsZ-Grk";

function postYoutubeCommand(iframe: HTMLIFrameElement | null, func: string, args: unknown[] = []) {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
}

/**
 * Featured hero clip: starts at 0s, muted autoplay (browser-safe),
 * loops when finished (loop + playlist=id required by YouTube),
 * unmutes while this browser tab is active, mutes + pauses when tab is hidden.
 */
export default function FeaturedHeroYoutube() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState("");

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setSrc(
      `https://www.youtube.com/embed/${VIDEO_ID}?enablejsapi=1&origin=${encodeURIComponent(origin)}&autoplay=1&mute=1&playsinline=1&rel=0&controls=1&loop=1&playlist=${VIDEO_ID}`
    );
  }, []);

  const syncAudioToTabVisibility = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    if (document.visibilityState === "visible") {
      postYoutubeCommand(iframe, "playVideo");
      postYoutubeCommand(iframe, "unMute");
    } else {
      postYoutubeCommand(iframe, "mute");
      postYoutubeCommand(iframe, "pauseVideo");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", syncAudioToTabVisibility);
    return () => document.removeEventListener("visibilitychange", syncAudioToTabVisibility);
  }, [syncAudioToTabVisibility]);

  useEffect(() => {
    if (!src) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      syncAudioToTabVisibility();
    };
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [src, syncAudioToTabVisibility]);

  /** First interaction anywhere on the page helps satisfy browser unmute policies */
  useEffect(() => {
    const unlock = () => {
      postYoutubeCommand(iframeRef.current, "playVideo");
      postYoutubeCommand(iframeRef.current, "unMute");
      document.removeEventListener("pointerdown", unlock, true);
    };
    document.addEventListener("pointerdown", unlock, true);
    return () => document.removeEventListener("pointerdown", unlock, true);
  }, []);

  if (!src) return null;

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title="Featured performance preview"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
}
