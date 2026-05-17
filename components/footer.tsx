"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { FacebookIcon, GmailIcon, InstagramIcon, MessengerIcon, WhatsAppIcon } from "@/components/social-brand-icons";
import { defaultSiteSettings, getSiteSettings, type SiteSettings } from "@/lib/local-store";

const trustItems = [
  { icon: ShieldCheck, label: "Verified sellers" },
  { icon: CreditCard, label: "Secure payments" },
  { icon: Truck, label: "Fast shipping" },
  { icon: RotateCcw, label: "Easy returns" }
];

export function Footer() {
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

  const socials = [
    ["Facebook", settings.footerSocials.facebook, FacebookIcon],
    ["Messenger", settings.footerSocials.messenger, MessengerIcon],
    ["Instagram", settings.footerSocials.instagram, InstagramIcon],
    ["WhatsApp", settings.footerSocials.whatsapp, WhatsAppIcon],
    ["Gmail", settings.footerSocials.gmail, GmailIcon]
  ] as const;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-page py-10">
        <div className="grid gap-6 rounded-xl bg-[#202940] p-6 text-white sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon size={22} className="text-[#BFC9D1]" />
              <span className="font-bold">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Image
              src="/splax-logo.webp"
              alt="SPLAX"
              width={150}
              height={48}
              className="h-12 w-auto rounded-lg object-contain"
            />
            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
              A premium ecommerce marketplace for trusted deals, quick discovery, and confident checkout.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide">Social</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {socials.map(([label, href, Icon]) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] transition hover:-translate-y-0.5"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
          {[
            ["Shop", "Electronics", "Fashion", "Home", "Best sellers"],
            ["Company", "About", "Sellers", "Careers", "Press"],
            ["Support", "Help center", "Returns", "Shipping", "Contact"]
          ].map(([title, ...links]) => (
            <div key={title}>
              <h2 className="text-sm font-black uppercase tracking-wide">{title}</h2>
              <div className="mt-3 grid gap-2">
                {links.map((link) => (
                  <Link
                    key={link}
                    href="/products"
                    className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-[var(--muted)]">Copyright 2026 SPLAX. Built for secure global commerce.</p>
      </div>
    </footer>
  );
}
