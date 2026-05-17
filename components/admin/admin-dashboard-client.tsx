"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  FileText,
  Home,
  LayoutTemplate,
  Package,
  PackagePlus,
  Pencil,
  Plus,
  ReceiptText,
  Save,
  Settings,
  ShoppingBag,
  Trash2,
  Truck
} from "lucide-react";
import { products, type Product, formatPrice } from "@/lib/products";
import {
  defaultSiteSettings,
  getAdminProducts,
  getOrders,
  getSiteSettings,
  saveAdminProducts,
  saveSiteSettings,
  type OrderStatus,
  type SiteSettings,
  type StoredOrder
} from "@/lib/local-store";
import { siteConfig } from "@/lib/site";

const fieldClass =
  "focus-ring mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3";

type AdminTab =
  | "dashboard"
  | "orders"
  | "templates"
  | "products"
  | "sales"
  | "invoice"
  | "remaining"
  | "courier"
  | "settings";

type ProductForm = {
  id?: string;
  title: string;
  category: string;
  price: string;
  compareAt: string;
  stock: string;
  image: string;
  description: string;
};

const emptyForm: ProductForm = {
  title: "",
  category: "Electronics",
  price: "",
  compareAt: "",
  stock: "",
  image: "",
  description: ""
};

const orderStatuses: OrderStatus[] = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const tabs: Array<{ id: AdminTab; label: string; icon: typeof Home }> = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "products", label: "Add Product", icon: PackagePlus },
  { id: "sales", label: "Sales Graph", icon: BarChart3 },
  { id: "invoice", label: "Invoice", icon: ReceiptText },
  { id: "remaining", label: "Remaining Orders", icon: Package },
  { id: "courier", label: "Courier", icon: Truck },
  { id: "settings", label: "Footer Links", icon: Settings }
];

export function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [ordersResponse, productsResponse, settingsResponse] = await Promise.all([
          fetch("/api/admin/orders", { cache: "no-store" }),
          fetch("/api/admin/products", { cache: "no-store" }),
          fetch("/api/admin/settings", { cache: "no-store" })
        ]);

        setOrders(ordersResponse.ok ? await ordersResponse.json() : getOrders());
        setAdminProducts(productsResponse.ok ? await productsResponse.json() : getAdminProducts());
        setSettings(settingsResponse.ok ? await settingsResponse.json() : getSiteSettings());
      } catch {
        setOrders(getOrders());
        setAdminProducts(getAdminProducts());
        setSettings(getSiteSettings());
      }
    }

    loadDashboard();
  }, []);

  const allProducts = useMemo(() => [...adminProducts, ...products], [adminProducts]);
  const revenue = orders.reduce((total, order) => total + order.total, 0);
  const remainingOrders = orders.filter((order) => !["Delivered", "Cancelled"].includes(order.status));
  const monthlySales = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => ({
      month,
      total: orders.reduce((sum, order) => {
        const orderMonth = new Date(order.createdAt).getMonth();
        return orderMonth === index ? sum + order.total : sum;
      }, 0)
    }));
  }, [orders]);
  const maxMonthlySale = Math.max(1, ...monthlySales.map((item) => item.total));

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const product: Product = {
      id: form.id || `admin-${Date.now()}`,
      title: form.title,
      category: form.category,
      price: Number(form.price),
      compareAt: Number(form.compareAt || form.price),
      rating: 5,
      reviews: 0,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      gallery: [
        form.image ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
      ],
      badge: form.id ? "Owner Edited" : "Owner Added",
      stock: Number(form.stock),
      seller: "SPLAX Official",
      delivery: "Free delivery",
      description: form.description,
      specs: {
        Source: "Owner dashboard",
        Status: "Published product",
        Currency: "BDT"
      }
    };
    const nextProducts = form.id
      ? adminProducts.map((item) => (item.id === form.id ? product : item))
      : [product, ...adminProducts];
    setAdminProducts(nextProducts);
    saveAdminProducts(nextProducts);
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextProducts)
    });
    setForm(emptyForm);
  }

  function editProduct(product: Product) {
    setForm({
      id: product.id,
      title: product.title,
      category: product.category,
      price: String(product.price),
      compareAt: String(product.compareAt),
      stock: String(product.stock),
      image: product.image,
      description: product.description
    });
    setActiveTab("products");
  }

  async function removeProduct(productId: string) {
    const nextProducts = adminProducts.filter((product) => product.id !== productId);
    setAdminProducts(nextProducts);
    saveAdminProducts(nextProducts);
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextProducts)
    });
  }

  async function changeOrder(orderId: string, updates: Partial<StoredOrder>) {
    const nextOrders = orders.map((order) =>
      order.id === orderId ? { ...order, ...updates } : order
    );
    setOrders(nextOrders);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveSiteSettings(settings);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
  }

  return (
    <div className="container-page py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 lg:sticky lg:top-24 lg:self-start">
          <h1 className="px-2 text-2xl font-black">SPLAX Admin</h1>
          <p className="px-2 text-sm text-[var(--muted)]">{siteConfig.domain}</p>
          <nav className="mt-5 grid gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-black transition ${
                  activeTab === tab.id ? "bg-[#202940] text-white" : "hover:bg-[var(--background)]"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="grid gap-6">
          <section className="rounded-xl bg-[#202940] p-6 text-white">
            <p className="text-sm font-black uppercase tracking-wide text-[#BFC9D1]">Professional dashboard</p>
            <h2 className="mt-2 text-4xl font-black">{tabs.find((tab) => tab.id === activeTab)?.label}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-200">
              Manage orders, products, courier updates, invoices, sales analytics, content, and editable footer links.
            </p>
          </section>

          {activeTab === "dashboard" ? (
            <>
              <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Orders", String(orders.length), ShoppingBag],
                  ["Revenue", formatPrice(revenue), BarChart3],
                  ["Products", String(allProducts.length), PackagePlus],
                  ["Remaining", String(remainingOrders.length), Truck]
                ].map(([label, value, Icon]) => (
                  <article key={String(label)} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
                    <Icon className="text-[#202940] dark:text-[#BFC9D1]" size={24} />
                    <p className="mt-4 text-sm font-bold text-[var(--muted)]">{String(label)}</p>
                    <h3 className="mt-1 text-2xl font-black">{String(value)}</h3>
                  </article>
                ))}
              </section>
              <OrderTable orders={orders.slice(0, 5)} onChange={changeOrder} />
            </>
          ) : null}

          {activeTab === "orders" ? <OrderTable orders={orders} onChange={changeOrder} /> : null}

          {activeTab === "templates" ? (
            <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-2xl font-black">Website templates and editable text</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Edit the visible homepage copy, product heading, footer links, and customer flow text from one place.
                </p>
                <form onSubmit={saveSettings} className="mt-5 grid gap-4">
                  <label>
                    <span className="text-sm font-bold">Hero badge/tagline</span>
                    <input value={settings.heroTagline} onChange={(event) => setSettings({ ...settings, heroTagline: event.target.value })} className={fieldClass} />
                  </label>
                  <label>
                    <span className="text-sm font-bold">Homepage announcement</span>
                    <input value={settings.announcement} onChange={(event) => setSettings({ ...settings, announcement: event.target.value })} className={fieldClass} />
                  </label>
                  {Object.entries(settings.homeSections).map(([key, value]) => (
                    <label key={key}>
                      <span className="text-sm font-bold capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <textarea
                        rows={key.toLowerCase().includes("description") ? 3 : 2}
                        value={value}
                        onChange={(event) =>
                          setSettings({
                            ...settings,
                            homeSections: { ...settings.homeSections, [key]: event.target.value }
                          })
                        }
                        className={`${fieldClass} resize-none`}
                      />
                    </label>
                  ))}
                  <button type="submit" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#202940] px-6 py-3 font-black text-white">
                    <Save size={18} /> Save website template
                  </button>
                </form>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-2xl font-black">Store flowchart</h3>
                <div className="mt-6 grid gap-3">
                  {[
                    ["Visitor", "Searches products and opens product details"],
                    ["Cart", "Adds products, sees cart popup, reviews visible totals"],
                    ["Checkout", "Submits phone/address/payment method with human check"],
                    ["Admin", "Receives order in professional dashboard"],
                    ["Courier", "Updates courier, tracking, and order status"],
                    ["Customer", "Checks order status from dashboard"]
                  ].map(([title, copy], index, items) => (
                    <div key={title}>
                      <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                        <p className="text-sm font-black uppercase tracking-wide text-[var(--muted)]">Step {index + 1}</p>
                        <h4 className="mt-1 text-lg font-black">{title}</h4>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{copy}</p>
                      </div>
                      {index < items.length - 1 ? <div className="mx-auto h-6 w-px bg-[var(--border)]" /> : null}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {activeTab === "products" ? (
            <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
              <form onSubmit={saveProduct} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-2xl font-black">{form.id ? "Edit product" : "Add product"}</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="text-sm font-bold">Product title</span>
                    <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={fieldClass} />
                  </label>
                  <label>
                    <span className="text-sm font-bold">Category</span>
                    <input required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={fieldClass} />
                  </label>
                  <label>
                    <span className="text-sm font-bold">Stock</span>
                    <input required type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} className={fieldClass} />
                  </label>
                  <label>
                    <span className="text-sm font-bold">Discount price in taka</span>
                    <input required type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className={fieldClass} />
                  </label>
                  <label>
                    <span className="text-sm font-bold">Real price before discount</span>
                    <input type="number" min="0" value={form.compareAt} onChange={(event) => setForm({ ...form, compareAt: event.target.value })} className={fieldClass} />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="text-sm font-bold">Image URL</span>
                    <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className={fieldClass} />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="text-sm font-bold">Description</span>
                    <textarea required rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={`${fieldClass} resize-none`} />
                  </label>
                </div>
                <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#202940] px-6 py-3 font-black text-white">
                  {form.id ? <Pencil size={18} /> : <Plus size={18} />}
                  {form.id ? "Save product" : "Add product"}
                </button>
              </form>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-2xl font-black">Manage products</h3>
                <div className="mt-5 grid gap-3">
                  {allProducts.map((product) => (
                    <article key={product.id} className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 sm:grid-cols-[84px_1fr_auto] sm:items-center">
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <Image src={product.image} alt={product.title} fill sizes="84px" className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black">{product.title}</h4>
                        <p className="text-sm text-[var(--muted)]">
                          {product.category} - Stock {product.stock} - Real {formatPrice(product.compareAt)} - Discount {formatPrice(product.price)} - Delivery Free
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => editProduct(product)} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm font-bold">
                          Edit
                        </button>
                        {product.id.startsWith("admin-") ? (
                          <button type="button" onClick={() => removeProduct(product.id)} className="rounded-full border border-red-200 px-3 py-2 text-sm font-bold text-red-600">
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {activeTab === "sales" ? (
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="text-2xl font-black">Sales analytics</h3>
              <div className="mt-8 flex h-72 items-end gap-4 border-b border-l border-[var(--border)] p-4">
                {monthlySales.map((item) => (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-lg bg-[#202940]" style={{ height: `${Math.max(8, (item.total / maxMonthlySale) * 220)}px` }} />
                    <span className="text-xs font-bold">{item.month}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "invoice" ? (
            <section className="grid gap-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black">Invoice {order.id}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">{order.customer.name} - {order.customer.phone || order.customer.email}</p>
                    </div>
                    <FileText className="text-[#202940] dark:text-[#BFC9D1]" />
                  </div>
                  <div className="mt-5 grid gap-2 text-sm">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.productId}`} className="flex justify-between"><span>{item.title} x {item.quantity}</span><strong>{formatPrice(item.price * item.quantity)}</strong></div>
                    ))}
                    <div className="border-t border-[var(--border)] pt-3 text-lg font-black">Total: {formatPrice(order.total)}</div>
                  </div>
                </article>
              ))}
            </section>
          ) : null}

          {activeTab === "remaining" ? <OrderTable orders={remainingOrders} onChange={changeOrder} /> : null}

          {activeTab === "courier" ? (
            <section className="grid gap-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <h3 className="text-xl font-black">{order.id}</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <label>
                      <span className="text-sm font-bold">Courier</span>
                      <input defaultValue={order.courier} onBlur={(event) => changeOrder(order.id, { courier: event.target.value })} className={fieldClass} placeholder="Pathao, Steadfast, RedX" />
                    </label>
                    <label>
                      <span className="text-sm font-bold">Tracking number</span>
                      <input defaultValue={order.trackingNumber} onBlur={(event) => changeOrder(order.id, { trackingNumber: event.target.value })} className={fieldClass} />
                    </label>
                    <label>
                      <span className="text-sm font-bold">Status</span>
                      <select value={order.status} onChange={(event) => changeOrder(order.id, { status: event.target.value as OrderStatus })} className={fieldClass}>
                        {orderStatuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </label>
                  </div>
                </article>
              ))}
            </section>
          ) : null}

          {activeTab === "settings" ? (
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="text-2xl font-black">Editable footer social links</h3>
              <form onSubmit={saveSettings} className="mt-5 grid gap-4 sm:grid-cols-2">
                {Object.entries(settings.footerSocials).map(([key, value]) => (
                  <label key={key}>
                    <span className="text-sm font-bold capitalize">{key}</span>
                    <input value={value} onChange={(event) => setSettings({ ...settings, footerSocials: { ...settings.footerSocials, [key]: event.target.value } })} className={fieldClass} />
                  </label>
                ))}
                <button type="submit" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#202940] px-6 py-3 font-black text-white">
                  <Save size={18} /> Save footer links
                </button>
              </form>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function OrderTable({
  orders,
  onChange
}: {
  orders: StoredOrder[];
  onChange: (orderId: string, updates: Partial<StoredOrder>) => void;
}) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="text-2xl font-black">Manage orders</h3>
      <div className="mt-5 grid gap-3">
        {orders.length ? (
          orders.map((order) => (
            <article key={order.id} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_180px_170px_auto] lg:items-center">
                <div>
                  <h4 className="font-black">{order.id}</h4>
                  <p className="text-sm text-[var(--muted)]">{order.customer.name} - {order.customer.phone || order.customer.email || "No email"}</p>
                  <p className="mt-1 text-sm font-bold">{formatPrice(order.total)} - {order.paymentMethod}</p>
                </div>
                <select value={order.status} onChange={(event) => onChange(order.id, { status: event.target.value as OrderStatus })} className="focus-ring rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold">
                  {orderStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
                <input defaultValue={order.courier} onBlur={(event) => onChange(order.id, { courier: event.target.value })} className="focus-ring rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm" placeholder="Courier" />
                <button type="button" onClick={() => onChange(order.id, { status: "Cancelled" })} className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-bold text-red-600">
                  <Trash2 size={15} /> Cancel
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-lg bg-[var(--background)] p-8 text-center">
            <p className="font-black">No orders yet</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Customer checkout orders will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
