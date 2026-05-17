import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Star, Truck } from "lucide-react";
import { AddToCartButton, BuyNowButton } from "@/components/products/add-to-cart-button";
import { ProductCard } from "@/components/products/product-card";
import { formatPrice, products } from "@/lib/products";
import { getAllServerProducts, getServerProduct } from "@/lib/server-store";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getServerProduct(id);

  if (!product) {
    return {
      title: "Product details",
      description: "View product details, pricing, delivery, and checkout options."
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: `${product.title} | MarketPro`,
      description: product.description,
      images: [{ url: product.image, alt: product.title }]
    }
  };
}

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getServerProduct(id);

  if (!product) {
    return (
      <div className="container-page py-16">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h1 className="text-4xl font-black">Product details are not available here yet</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-[var(--muted)]">
            If this was an owner-added product on Vercel, open the products page from the same browser where it was added. For permanent cross-device products, connect a database.
          </p>
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-[#202940] px-6 py-3 font-black text-white">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const allProducts = await getAllServerProducts();
  const related = allProducts
    .filter((item) => item.id !== product.id && item.category !== product.category)
    .slice(0, 3);

  return (
    <div className="container-page py-10">
      <nav className="text-sm text-[var(--muted)]" aria-label="Breadcrumb">
        <Link href="/products" className="hover:text-[var(--foreground)]">Products</Link>
        <span className="mx-2">/</span>
        <span>{product.category}</span>
      </nav>

      <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-[#202940] px-4 py-2 text-sm font-black text-white">
              {product.badge}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.gallery.map((image) => (
              <div key={image} className="relative aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                <Image src={image} alt={`${product.title} gallery view`} fill sizes="33vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[var(--muted)]">{product.category}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight">{product.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1 text-sm font-bold">
              <Star size={16} className="fill-yellow-400 text-yellow-400" /> {product.rating} ({product.reviews} reviews)
            </span>
            <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-black text-red-700 dark:bg-red-950 dark:text-red-200">
              Only {product.stock} left
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black">{formatPrice(product.price)}</span>
              <span className="text-lg text-[var(--muted)] line-through">{formatPrice(product.compareAt)}</span>
            </div>
            <p className="mt-2 text-sm font-black text-emerald-700 dark:text-emerald-300">
              Real price: {formatPrice(product.compareAt)} - Discount price: {formatPrice(product.price)} - Delivery charge: Free
            </p>
            <p className="mt-4 leading-7 text-[var(--muted)]">{product.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { Icon: ShieldCheck, label: "Secure payment" },
                { Icon: Truck, label: product.delivery },
                { Icon: CheckCircle2, label: product.seller }
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-lg bg-[var(--background)] p-3 text-sm font-bold">
                  <Icon size={18} className="text-[#202940] dark:text-[#BFC9D1]" />
                  {label}
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <AddToCartButton productId={product.id} fullWidth />
              <BuyNowButton productId={product.id} />
            </div>
          </div>

          <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-xl font-black">Specifications</h2>
            <dl className="mt-4 grid gap-3">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[120px_1fr] gap-3 rounded-lg bg-[var(--background)] p-3 text-sm">
                  <dt className="font-black">{key}</dt>
                  <dd className="text-[var(--muted)]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-3xl font-black">Customer reviews</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Shoppers highlight accurate descriptions, prompt shipping, and responsive seller support.
          </p>
        </div>
        <div className="grid gap-4">
          {["Arrived two days early and matched the photos exactly.", "The seller answered sizing questions quickly. Checkout was painless."].map((review) => (
            <article key={review} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} className="fill-current" />
                ))}
              </div>
              <p className="mt-3 leading-7 text-[var(--muted)]">{review}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 pb-12">
        <h2 className="text-3xl font-black">Related products</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)] p-3 md:hidden">
        <AddToCartButton productId={product.id} fullWidth />
      </div>
    </div>
  );
}
