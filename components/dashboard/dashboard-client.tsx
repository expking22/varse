"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { BarChart3, LogOut, PackageCheck, Save, ShieldCheck, ShoppingCart, Truck, UserRound } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { clearCustomer, getCustomer, getOrders, saveCustomer, type CustomerProfile, type StoredOrder } from "@/lib/local-store";

export function DashboardClient() {
  const { count, subtotal, detailedItems } = useCart();
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const customer = getCustomer();
      setUser(customer);
      const localOrders = getOrders();
      setOrders(localOrders);

      if (customer?.email || customer?.phone) {
        try {
          const params = new URLSearchParams();
          if (customer.email) params.set("email", customer.email);
          if (customer.phone) params.set("phone", customer.phone);
          const response = await fetch(`/api/orders?${params.toString()}`, { cache: "no-store" });
          if (response.ok) {
            const serverOrders = (await response.json()) as StoredOrder[];
            const mergedOrders = [
              ...serverOrders,
              ...localOrders.filter((localOrder) => !serverOrders.some((order) => order.id === localOrder.id))
            ];
            setOrders(mergedOrders);
          }
        } catch {
          setOrders(localOrders);
        }
      }
    }

    loadDashboard();
  }, []);

  function signOut() {
    clearCustomer();
    setUser(null);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextUser: CustomerProfile = {
      name: String(data.get("name") || "SPLAX Shopper"),
      email: String(data.get("email") || "") || undefined,
      phone: String(data.get("phone") || "") || undefined,
      city: String(data.get("city") || "") || undefined,
      address: String(data.get("address") || "") || undefined,
      postalCode: String(data.get("postal_code") || "") || undefined,
      signedInAt: user?.signedInAt || new Date().toISOString()
    };
    saveCustomer(nextUser);
    setUser(nextUser);
  }

  const stats = [
    { label: "Cart items", value: String(count), icon: ShoppingCart },
    { label: "Cart value", value: formatPrice(subtotal), icon: BarChart3 },
    { label: "Placed orders", value: String(orders.length), icon: PackageCheck },
    { label: "Buyer protection", value: "Active", icon: ShieldCheck }
  ];

  return (
    <div className="container-page py-10">
      <section className="grid gap-6 rounded-xl bg-[#202940] p-6 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#BFC9D1] text-[#202940]">
              <UserRound size={24} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-200">Professional dashboard</p>
              <h1 className="text-3xl font-black">
                {user ? `Welcome, ${user.name}` : "Welcome to your SPLAX dashboard"}
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl leading-7 text-slate-200">
            Manage cart activity, order progress, saved products, profile status, and support requests from one clean workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/products" className="rounded-full bg-[#BFC9D1] px-5 py-3 font-black text-[#202940]">
            Shop deals
          </Link>
          {user ? (
            <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 font-black text-white">
              <LogOut size={18} />
              Sign out
            </button>
          ) : (
            <Link href="/auth" className="rounded-full border border-white/20 px-5 py-3 font-black text-white">
              Sign in
            </Link>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <stat.icon size={22} className="text-[#202940] dark:text-[#BFC9D1]" />
            <p className="mt-4 text-sm font-bold text-[var(--muted)]">{stat.label}</p>
            <h2 className="mt-1 text-2xl font-black">{stat.value}</h2>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Order process</h2>
              <p className="mt-1 text-[var(--muted)]">A clear journey from cart to delivery.</p>
            </div>
            <PackageCheck className="text-[#202940] dark:text-[#BFC9D1]" />
          </div>
          <div className="mt-6 grid gap-4">
            {[
              ["Cart review", "Confirm product quantity and total before checkout."],
              ["Shipping details", "Customer address and phone number are collected securely."],
              ["Payment selection", "Cash on delivery, bKash, Nagad, Rocket, or card confirmation."],
              ["Order confirmation", "The order is saved here and sent to SPLAX for follow-up."],
              ["Delivery tracking", "Admin status and courier updates appear in your order list."]
            ].map(([title, copy], index) => (
              <div key={title} className="grid grid-cols-[40px_1fr] gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#202940] text-sm font-black text-white">{index + 1}</span>
                <div>
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Current cart</h2>
              <p className="mt-1 text-[var(--muted)]">Ready for checkout when the shopper is.</p>
            </div>
            <Truck className="text-[#202940] dark:text-[#BFC9D1]" />
          </div>
          <div className="mt-6 grid gap-3">
            {detailedItems.length ? (
              detailedItems.slice(0, 4).map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-4 rounded-lg bg-[var(--background)] p-3">
                  <div>
                    <p className="font-black">{item.product.title}</p>
                    <p className="text-sm text-[var(--muted)]">Quantity: {item.quantity}</p>
                  </div>
                  <strong>{formatPrice(item.product.price * item.quantity)}</strong>
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-[var(--background)] p-6 text-center">
                <p className="font-black">No cart items yet</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Products added to cart will appear here.</p>
              </div>
            )}
          </div>
          <Link href="/checkout" className="mt-6 inline-flex w-full justify-center rounded-full bg-[#202940] px-5 py-3 font-black text-white">
            Continue to checkout
          </Link>
        </div>
      </section>

      <section id="orders" className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-black">View Orders</h2>
            <p className="mt-1 text-[var(--muted)]">All orders placed from this browser with live status fields.</p>
          </div>
          <Link href="/products" className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-black">
            Place another order
          </Link>
        </div>
        <div className="mt-6 grid gap-4">
          {orders.length ? (
            orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="text-lg font-black">{order.id}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {new Date(order.createdAt).toLocaleString()} - {order.paymentMethod}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#202940] px-3 py-1 text-sm font-black text-white">{order.status}</span>
                </div>
                <div className="mt-4 grid gap-2 text-sm">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.productId}`} className="flex justify-between gap-3">
                      <span>{item.title} x {item.quantity}</span>
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 border-t border-[var(--border)] pt-4 text-sm sm:grid-cols-3">
                  <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                  <p><strong>Courier:</strong> {order.courier || "Pending"}</p>
                  <p><strong>Tracking:</strong> {order.trackingNumber || "Not assigned"}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg bg-[var(--background)] p-8 text-center">
              <p className="font-black">No placed orders yet</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Completed checkout orders will appear here.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center gap-2">
          <Save size={20} className="text-[#202940] dark:text-[#BFC9D1]" />
          <h2 className="text-2xl font-black">Saved personal details</h2>
        </div>
        <form onSubmit={saveProfile} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-bold">Full name</span>
            <input name="name" required defaultValue={user?.name} className="focus-ring mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3" />
          </label>
          <label>
            <span className="text-sm font-bold">Email address</span>
            <input name="email" type="email" defaultValue={user?.email} className="focus-ring mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3" />
          </label>
          <label>
            <span className="text-sm font-bold">Phone number</span>
            <input name="phone" defaultValue={user?.phone} className="focus-ring mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3" />
          </label>
          <label>
            <span className="text-sm font-bold">City</span>
            <input name="city" defaultValue={user?.city} className="focus-ring mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3" />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-bold">Address</span>
            <input name="address" defaultValue={user?.address} className="focus-ring mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3" />
          </label>
          <label>
            <span className="text-sm font-bold">Postal code</span>
            <input name="postal_code" defaultValue={user?.postalCode} className="focus-ring mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3" />
          </label>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-full bg-[#202940] px-6 py-3 font-black text-white">
              Save details
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
