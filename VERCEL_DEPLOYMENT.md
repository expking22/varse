# SPLAX Vercel Deployment

Use Vercel for the website now. Do not use the Ubuntu/Nginx/domain setup for this version.

## 1. Push the code to GitHub

```bash
git add .
git commit -m "Make SPLAX Vercel friendly"
git push
```

## 2. Import the project in Vercel

1. Open Vercel.
2. Add New Project.
3. Import the GitHub repository.
4. Keep the framework as Next.js.
5. Build command: `npm run build`.
6. Output settings: leave default.

## 3. Add admin environment variables

In Vercel Project Settings > Environment Variables, add:

```text
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-long-random-password
```

Redeploy after adding them.

## 4. Admin access

Your admin page will be:

```text
https://your-vercel-project.vercel.app/admin/
```

The browser will ask for the admin username and password from the Vercel environment variables.

## 5. Data note

This version is Vercel-safe, but serverless storage is temporary. Customer orders, owner-added products, and editable templates should be connected to a real database before serious use.

Recommended upgrade:

- Vercel Postgres or Supabase for orders/products/settings.
- Real auth provider for customers/admin.
- Official bKash/Nagad/Rocket gateway for real payments.

Until then, the app uses browser local storage and temporary server fallback data for demo/testing.
