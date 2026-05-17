"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Check, ShoppingCart, X, Zap } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, products, type Product } from "@/lib/products";

export function AddToCartButton({
  productId,
  variant = "primary",
  fullWidth = false
}: {
  productId: string;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}) {
  const { addItem, count, subtotal } = useCart();
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const base =
    "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-lg";
  const styles =
    variant === "primary"
      ? "bg-[#202940] text-white hover:bg-[#12192b]"
      : "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--background)]";

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          addItem(productId);
          const localProduct = products.find((product) => product.id === productId);
          try {
            const response = await fetch(`/api/products/${productId}`, { cache: "no-store" });
            setAddedProduct(response.ok ? await response.json() : localProduct ?? null);
          } catch {
            setAddedProduct(localProduct ?? null);
          }
          setIsOpen(true);
        }}
        className={`${base} ${styles} ${fullWidth ? "w-full" : ""}`}
      >
        <ShoppingCart size={18} />
        Add to cart
      </button>
      {isOpen ? (
        <CartAddedModal
          product={addedProduct}
          count={count}
          subtotal={subtotal}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
}

export function BuyNowButton({ productId }: { productId: string }) {
  const { addItem } = useCart();
  return (
    <Link
      href="/checkout"
      onClick={() => addItem(productId)}
      className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[#BFC9D1] px-5 py-3 text-sm font-black text-[#202940] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
    >
      <Zap size={18} />
      Buy now
    </Link>
  );
}

function CartAddedModal({
  product,
  count,
  subtotal,
  onClose
}: {
  product: Product | null;
  count: number;
  subtotal: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] bg-black/55 p-4 text-[var(--foreground)]" onClick={onClose}>
      <div
        className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div className="flex items-center gap-3 text-sm font-black uppercase tracking-wide text-[#0f766e]">
            <Check size={20} />
            Product added to your shopping cart
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-[var(--background)]" aria-label="Close cart popup">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-[var(--background)]">
              {product ? (
                <Image src={product.image} alt={product.title} fill sizes="150px" className="object-cover" />
              ) : null}
            </div>
            <div>
              <h2 className="text-xl font-black">{product?.title ?? "Product"}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">Quantity: 1</p>
              <p className="mt-3 text-2xl font-black">{formatPrice(product?.price ?? 0)}</p>
              <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">Delivery charge: Free</p>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <h3 className="text-2xl font-black">
              There {count === 1 ? "is" : "are"} {count} item{count === 1 ? "" : "s"} in your cart.
            </h3>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between gap-4"><span className="font-bold">Total products</span><strong>{formatPrice(subtotal)}</strong></div>
              <div className="flex justify-between gap-4"><span className="font-bold">Total shipping</span><strong>Free</strong></div>
              <div className="border-t border-[var(--border)] pt-3 text-lg">
                <div className="flex justify-between gap-4"><span className="font-black">Total</span><strong>{formatPrice(subtotal)}</strong></div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-black">
                Continue shopping
              </button>
              <Link href="/checkout" className="rounded-lg bg-[#202940] px-5 py-3 text-center text-sm font-black text-white">
                Proceed to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
