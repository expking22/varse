"use client";

import { useEffect, useState } from "react";
import { defaultSiteSettings, getSiteSettings, type SiteSettings } from "@/lib/local-store";

export function EditableCopy({
  field
}: {
  field: keyof SiteSettings["homeSections"];
}) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    const syncSettings = async () => {
      try {
        const response = await fetch("/api/settings", { cache: "no-store" });
        if (response.ok) {
          setSettings(await response.json());
          return;
        }
      } catch {
        // Fallback below.
      }
      setSettings(getSiteSettings());
    };

    syncSettings();
    window.addEventListener("storage", syncSettings);
    window.addEventListener("splax-storage", syncSettings);
    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener("splax-storage", syncSettings);
    };
  }, []);

  return <>{settings.homeSections[field]}</>;
}
