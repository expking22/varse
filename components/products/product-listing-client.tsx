"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { categories, products, type Product } from "@/lib/products";
import { getAdminProducts } from "@/lib/local-store";
import { EditableCopy } from "@/components/home/editable-copy";

export function ProductListingClient() {
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        if (response.ok) {
          const allProducts = (await response.json()) as Product[];
          setAdminProducts(allProducts.filter((product) => product.id.startsWith("admin-")));
          return;
        }
      } catch {
        // Fallback below.
      }
      setAdminProducts(getAdminProducts());
    }

    loadProducts();
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
  }, []);

  const allProducts = useMemo(() => [...adminProducts, ...products], [adminProducts]);
  const allCategories = useMemo(
    () => Array.from(new Set([...categories, ...adminProducts.map((product) => product.category)])),
    [adminProducts]
  );

  const visibleProducts = useMemo(() => {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Number.POSITIVE_INFINITY;

    return [...allProducts]
      .filter((product) => {
        const categoryMatch =
          selectedCategories.length === 0 || selectedCategories.includes(product.category);
        return (
          categoryMatch &&
          `${product.title} ${product.category} ${product.seller} ${product.description}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()) &&
          product.price >= min &&
          product.price <= max &&
          product.rating >= minRating
        );
      })
      .sort((a, b) => {
        if (sort === "low") return a.price - b.price;
        if (sort === "high") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }, [allProducts, maxPrice, minPrice, minRating, query, selectedCategories, sort]);

  useEffect(() => {
    setPage(1);
  }, [maxPrice, minPrice, minRating, query, selectedCategories, sort]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  const paginatedProducts = visibleProducts.slice((page - 1) * pageSize, page * pageSize);

  function toggleCategory(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[var(--muted)]"><EditableCopy field="productsEyebrow" /></p>
          <h1 className="mt-2 text-4xl font-black"><EditableCopy field="productsTitle" /></h1>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
            <EditableCopy field="productsDescription" />
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(240px,1fr)_auto]">
          <label className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-bold">
            <Search size={18} className="text-[var(--muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent outline-none"
              placeholder="Search products"
              aria-label="Search products"
            />
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-bold">
            Sort
            <select
              className="bg-transparent outline-none"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
            >
              <option value="popular">Popularity</option>
              <option value="low">Price low-high</option>
              <option value="high">Price high-low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} />
            <h2 className="text-lg font-black">Filters</h2>
          </div>
          <div className="mt-6 grid gap-6">
            <section>
              <h3 className="font-black">Category</h3>
              <div className="mt-3 grid gap-2">
                {allCategories.map((category) => (
                  <label key={category} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#202940]"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            </section>
            <section>
              <h3 className="font-black">Price</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  aria-label="Minimum price"
                  placeholder="Tk 30,000"
                  inputMode="numeric"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  className="focus-ring rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                />
                <input
                  aria-label="Maximum price"
                  placeholder="Tk 0"
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  className="focus-ring rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                />
              </div>
            </section>
            <section>
              <h3 className="font-black">Rating</h3>
              <div className="mt-3 grid gap-2">
                {[4, 3].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <input
                      type="radio"
                      name="rating"
                      className="h-4 w-4 accent-[#202940]"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                    />
                    <span className="flex items-center gap-1">
                      {rating}+ <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    </span>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setMinRating(0)}
                  className="mt-1 text-left text-sm font-bold text-[#202940] dark:text-[#BFC9D1]"
                >
                  Clear rating
                </button>
              </div>
            </section>
          </div>
        </aside>

        <section aria-label="Product grid">
          {visibleProducts.length ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-3 text-sm text-[var(--muted)]">
                <span>{visibleProducts.length} products found</span>
                <span>Page {page} of {totalPages}</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 2} />
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-black ${
                      pageNumber === page
                        ? "border-[#202940] bg-[#202940] text-white"
                        : "border-[var(--border)] bg-[var(--surface)]"
                    }`}
                    aria-label={`Go to page ${pageNumber}`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
              <h2 className="text-2xl font-black">No products found</h2>
              <p className="mt-2 text-[var(--muted)]">Try clearing filters or searching a broader category.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
