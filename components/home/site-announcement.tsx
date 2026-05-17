"use client";

import { useEffect, useState } from "react";
import { defaultSiteSettings, getSiteSettings } from "@/lib/local-store";

export function SiteAnnouncement({ type = "announcement" }: { type?: "announcement" | "tagline" }) {
  const [text, setText] = useState(
    type === "tagline" ? defaultSiteSettings.heroTagline : defaultSiteSettings.announcement
  );

  useEffect(() => {
    const syncSettings = async () => {
      const settings = getSiteSettings();
      try {
        const response = await fetch("/api/settings", { cache: "no-store" });
        if (response.ok) {
          const serverSettings = await response.json();
          setText(type === "tagline" ? serverSettings.heroTagline : serverSettings.announcement);
          return;
        }
      } catch {
        // Local storage fallback keeps previews working if the API is unavailable.
      }
      setText(type === "tagline" ? settings.heroTagline : settings.announcement);
    };
    syncSettings();
    window.addEventListener("storage", syncSettings);
    window.addEventListener("splax-storage", syncSettings);
    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener("splax-storage", syncSettings);
    };
  }, [type]);

  return <>{text}</>;
}
