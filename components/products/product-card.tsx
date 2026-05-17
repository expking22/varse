"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { AddToCartButton } from "@/components/products/add-to-cart-button";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const discount = Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
  const productHref = `/product/${product.id}`;

  return (
    <article className="group overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={productHref} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--background)]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={priority}
          />
          <span className="absolute left-3 top-3 rounded-full bg-[#202940] px-3 py-1 text-xs font-black text-white">
            {product.badge}
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-[#202940]">
            -{discount}%
          </span>
        </div>
      </Link>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{product.category}</p>
          <Link href={productHref}>
            <h2 className="mt-1 min-h-12 text-base font-black leading-6 transition hover:text-[#202940] dark:hover:text-[#BFC9D1]">
              {product.title}
            </h2>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black">{formatPrice(product.price)}</span>
              <span className="text-sm text-[var(--muted)] line-through">{formatPrice(product.compareAt)}</span>
            </div>
            <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Delivery charge: Free
            </p>
            <div className="mt-1 flex items-center gap-1 text-sm text-[var(--muted)]">
              <Star size={15} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-[var(--foreground)]">{product.rating}</span>
              <span>({product.reviews})</span>
            </div>
          </div>
        </div>
        <AddToCartButton productId={product.id} fullWidth />
      </div>
    </article>
  );
}
