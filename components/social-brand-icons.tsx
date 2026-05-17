"use client";

type BrandIconProps = {
  className?: string;
};

export function FacebookIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}

export function MessengerIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.13 2 11.23c0 2.9 1.45 5.49 3.72 7.18V22l3.4-1.87c.91.25 1.88.38 2.88.38 5.52 0 10-4.13 10-9.28S17.52 2 12 2Zm1 12.45-2.55-2.72-4.98 2.72 5.47-5.81 2.61 2.72 4.92-2.72L13 14.45Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2A9.87 9.87 0 0 0 2.2 11.9c0 1.74.45 3.44 1.31 4.94L2 22l5.28-1.39a9.82 9.82 0 0 0 4.76 1.22h.01A9.87 9.87 0 0 0 21.9 11.93 9.9 9.9 0 0 0 12.04 2Zm5.79 14.13c-.25.72-1.45 1.39-2.03 1.48-.52.08-1.18.12-1.9-.12-.44-.14-1-.32-1.72-.63-3.03-1.31-5.01-4.36-5.16-4.56-.15-.2-1.23-1.64-1.23-3.13s.78-2.22 1.06-2.52c.28-.3.61-.38.82-.38h.59c.19.01.44-.07.69.53.25.6.85 2.09.92 2.24.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.32.39-.45.52-.15.15-.31.31-.13.61.17.3.77 1.27 1.65 2.06 1.13 1.01 2.09 1.32 2.39 1.47.3.15.48.13.66-.08.2-.23.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.79.84 2.09.99.3.15.5.23.58.36.07.12.07.77-.18 1.45Z" />
    </svg>
  );
}

export function GmailIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-.7 3.35-6.76 5.08a.9.9 0 0 1-1.08 0L4.7 8.35A.8.8 0 0 1 5.66 7L12 11.76 18.34 7a.8.8 0 1 1 .96 1.35Z" />
    </svg>
  );
}
