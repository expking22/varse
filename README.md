# SPLAX Vercel Marketplace

A Next.js ecommerce marketplace prepared for Vercel hosting, with customer shopping flows, cart/checkout, admin dashboard protection, product management, social links, and searchable product pages.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Deployment

Deploy on Vercel by importing this GitHub repository as a Next.js project. Add these environment variables in Vercel before production use:

```text
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-admin-password
```

See `VERCEL_DEPLOYMENT.md` for the full deployment checklist.

## Pages

- `/` high-converting homepage
- `/products` product listing with filters and sorting UI
- `/product/[id]` product detail pages
- `/cart` cart with quantity controls and empty state
- `/checkout` checkout UI
- `/account` account dashboard UI
- `/auth` login/signup UI
- `/admin` protected admin dashboard
