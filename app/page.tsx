import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditableCopy } from "@/components/home/editable-copy";
import { SiteAnnouncement } from "@/components/home/site-announcement";
import { ProductListingClient } from "@/components/products/product-listing-client";
import { SearchAssistant } from "@/components/products/search-assistant";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop Everything You Need in One Place",
  description:
    "Discover high-value products from trusted sellers with fast delivery, secure checkout, easy returns, and marketplace-wide deals.",
  openGraph: {
    title: "Shop Everything You Need in One Place | SPLAX",
    description: "Fast delivery, trusted sellers, sharp prices, and premium ecommerce discovery."
  }
};

export default function HomePage() {
  return (
    <>
      <section className="bg-[var(--surface)]">
        <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
          <div>
            <p className="inline-flex rounded-full bg-[var(--background)] px-4 py-2 text-sm font-black text-[#202940] dark:text-[#BFC9D1]">
              <SiteAnnouncement type="tagline" />
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              <EditableCopy field="heroTitle" />
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              <EditableCopy field="heroDescription" />
            </p>
            <p className="mt-3 text-sm font-bold text-[var(--muted)]">
              <SiteAnnouncement />
            </p>
            <div className="mt-7">
              <SearchAssistant />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {["10,000+ customers", "4.8 avg rating", "40% avg savings"].map((stat) => (
                <div key={stat} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                  <p className="text-sm font-black">{stat}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {products.slice(0, 2).map((product, index) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className={`${index === 0 ? "sm:row-span-2" : ""} group relative min-h-64 overflow-hidden rounded-xl bg-[#202940]`}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                  className="object-cover opacity-85 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/85 to-transparent" />
                <div className="absolute bottom-0 p-5 text-white">
                  <span className="rounded-full bg-[#BFC9D1] px-3 py-1 text-xs font-black text-[#202940]">{product.badge}</span>
                  <h2 className="mt-3 text-xl font-black">{product.title}</h2>
                  <p className="mt-1 text-sm text-slate-200">{product.delivery}</p>
                </div>
              </Link>
            ))}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h2 className="text-xl font-black">Today's protected deal</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Limited-stock picks with seller verification, secure checkout, and 30-day return support.
              </p>
              <Link href="/products" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#202940] dark:text-[#BFC9D1]">
                Explore deals <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10" id="products">
        <ProductListingClient />
      </section>
    </>
  );
}
