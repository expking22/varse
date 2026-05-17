"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, LockKeyhole, MapPin, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { addOrder, getCustomer, saveCustomer, type CustomerProfile, type StoredOrder } from "@/lib/local-store";

const fieldClass =
  "focus-ring mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3";

export function CheckoutClient() {
  const router = useRouter();
  const { detailedItems, subtotal, clearCart } = useCart();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [saveDetails, setSaveDetails] = useState(true);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const captcha = useMemo(() => ({ a: 4, b: 7 }), []);
  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 120;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;
  const orderSummary = detailedItems
    .map((item) => `${item.product.title} x ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`)
    .join("\n");

  useEffect(() => {
    setProfile(getCustomer());
  }, []);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (Number(captchaAnswer) !== captcha.a + captcha.b) {
      form.reportValidity();
      return;
    }

    const customer: CustomerProfile = {
      name: String(data.get("name") || "SPLAX Shopper"),
      email: String(data.get("email") || "") || undefined,
      phone: String(data.get("phone") || "") || undefined,
      city: String(data.get("city") || "") || undefined,
      address: String(data.get("address") || "") || undefined,
      postalCode: String(data.get("postal_code") || "") || undefined,
      signedInAt: profile?.signedInAt || new Date().toISOString()
    };

    if (saveDetails) {
      saveCustomer(customer);
    }

    const order: StoredOrder = {
      id: `SPLAX-${Date.now().toString().slice(-8)}`,
      customer,
      items: detailedItems.map((item) => ({
        productId: item.productId,
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price
      })),
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: String(data.get("payment_method") || "Cash on delivery"),
      deliveryNote: String(data.get("delivery_note") || "") || undefined,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    addOrder(order);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });
    } catch {
      // The local order still remains visible if the server is temporarily unavailable.
    }
    clearCart();
    router.push("/order-success/");
  }

  if (!detailedItems.length) {
    return (
      <div className="container-page py-16">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <ShoppingCart className="mx-auto text-[#202940] dark:text-[#BFC9D1]" size={36} />
          <h1 className="mt-4 text-4xl font-black">Your cart is empty</h1>
          <p className="mx-auto mt-3 max-w-md leading-7 text-[var(--muted)]">
            Add products to your cart before starting the order process.
          </p>
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-[#202940] px-6 py-3 font-black text-white">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center gap-3">
        <LockKeyhole className="text-[#202940] dark:text-[#BFC9D1]" />
        <h1 className="text-4xl font-black">Secure checkout</h1>
      </div>
      <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
        Complete shipping and payment details. The order request will be sent to the SPLAX team for confirmation.
      </p>

      <form
        onSubmit={submitOrder}
        className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"
      >
        <input type="hidden" name="_subject" value="New SPLAX ecommerce order" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="true" />
        <input type="hidden" name="_autoresponse" value="Thank you for ordering from SPLAX. We received your order request and will confirm payment, stock, and delivery soon." />
        <input type="hidden" name="_next" value={`${siteConfig.url}/order-success/`} />
        <input type="hidden" name="order_items" value={orderSummary} />
        <input type="hidden" name="subtotal" value={formatPrice(subtotal)} />
        <input type="hidden" name="shipping" value={shipping ? formatPrice(shipping) : "Free"} />
        <input type="hidden" name="tax" value={formatPrice(tax)} />
        <input type="hidden" name="total" value={formatPrice(total)} />

        <div className="grid gap-6">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <h2 className="text-xl font-black">Shipping details</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-sm font-bold">Full name</span>
                <input name="name" required defaultValue={profile?.name} className={fieldClass} placeholder="Customer name" />
              </label>
              <label>
                <span className="text-sm font-bold">Email address <span className="text-[var(--muted)]">(optional)</span></span>
                <input type="email" name="email" defaultValue={profile?.email} className={fieldClass} placeholder="you@example.com" />
              </label>
              <label>
                <span className="text-sm font-bold">Phone number</span>
                <input name="phone" required defaultValue={profile?.phone} className={fieldClass} placeholder="+880 1XXXXXXXXX" />
              </label>
              <label>
                <span className="text-sm font-bold">City</span>
                <input name="city" required defaultValue={profile?.city} className={fieldClass} placeholder="Dhaka" />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-bold">Full address</span>
                <input name="address" required defaultValue={profile?.address} className={fieldClass} placeholder="House, road, area, district" />
              </label>
              <label>
                <span className="text-sm font-bold">Postal code</span>
                <input name="postal_code" defaultValue={profile?.postalCode} className={fieldClass} placeholder="1207" />
              </label>
              <label>
                <span className="text-sm font-bold">Delivery note</span>
                <input name="delivery_note" className={fieldClass} placeholder="Preferred delivery time" />
              </label>
              <label className="flex items-center gap-2 text-sm font-bold sm:col-span-2">
                <input type="checkbox" checked={saveDetails} onChange={(event) => setSaveDetails(event.target.checked)} className="h-4 w-4 accent-[#202940]" />
                Save these details for future orders
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2">
              <CreditCard size={20} />
              <h2 className="text-xl font-black">Payment method</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {["Cash on delivery", "bKash", "Nagad", "Rocket", "Card payment on confirmation"].map((method, index) => (
                <label key={method} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 font-bold">
                  <input type="radio" name="payment_method" value={method} defaultChecked={index === 0} className="h-4 w-4 accent-[#202940]" />
                  {method}
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} />
              <h2 className="text-xl font-black">Human verification</h2>
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-bold">What is {captcha.a} + {captcha.b}?</span>
              <input
                required
                inputMode="numeric"
                value={captchaAnswer}
                onChange={(event) => setCaptchaAnswer(event.target.value)}
                pattern={`${captcha.a + captcha.b}`}
                className={fieldClass}
                placeholder="Enter answer"
              />
            </label>
          </section>
        </div>

        <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-2xl font-black">Order summary</h2>
          <div className="mt-5 grid gap-3">
            {detailedItems.map((item) => (
              <div key={item.productId} className="rounded-lg bg-[var(--background)] p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="font-bold">{item.product.title}</span>
                  <strong>{formatPrice(item.product.price * item.quantity)}</strong>
                </div>
                <p className="mt-1 text-[var(--muted)]">Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between"><span className="text-[var(--muted)]">Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Shipping</span><strong>{shipping ? formatPrice(shipping) : "Free"}</strong></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Estimated tax</span><strong>{formatPrice(tax)}</strong></div>
            <div className="border-t border-[var(--border)] pt-3 text-lg">
              <div className="flex justify-between"><span className="font-black">Total</span><strong>{formatPrice(total)}</strong></div>
            </div>
          </div>
          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#202940] px-6 py-3 font-black text-white transition hover:bg-[#12192b]">
            <Truck size={18} />
            Place order
          </button>
          <p className="mt-4 text-center text-xs leading-5 text-[var(--muted)]">
            Orders are emailed to {siteConfig.supportEmail}. First submission may require FormSubmit confirmation.
          </p>
        </aside>
      </form>
    </div>
  );
}
