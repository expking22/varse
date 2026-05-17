"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { products } from "@/lib/products";

export function SearchAssistant({
  compact = false,
  placeholder = "Search deals across categories"
}: {
  compact?: boolean;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return products
      .filter((product) =>
        `${product.title} ${product.category} ${product.seller} ${product.description}`
          .toLowerCase()
          .includes(normalizedQuery)
      )
      .slice(0, 5);
  }, [query]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = query.trim();
    router.push(nextQuery ? `/products/?q=${encodeURIComponent(nextQuery)}` : "/products/");
  }

  function chooseSuggestion(title: string) {
    setQuery(title);
    router.push(`/products/?q=${encodeURIComponent(title)}`);
  }

  return (
    <form
      onSubmit={submitSearch}
      className={`relative flex flex-col gap-3 border border-[var(--border)] bg-[var(--background)] p-2 sm:flex-row ${
        compact ? "w-full rounded-full" : "rounded-xl"
      }`}
    >
      <label className="flex flex-1 items-center gap-3 px-3">
        <Search size={20} className="text-[var(--muted)]" />
        <span className="sr-only">Search products</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={`${compact ? "min-h-9 text-sm" : "min-h-12"} w-full bg-transparent outline-none placeholder:text-[var(--muted)]`}
          placeholder={placeholder}
        />
      </label>
      <button
        type="submit"
        className={`inline-flex items-center justify-center gap-2 bg-[#202940] font-black text-white transition hover:-translate-y-0.5 hover:bg-[#12192b] ${
          compact ? "min-h-9 rounded-full px-5 text-sm" : "min-h-12 rounded-lg px-6"
        }`}
      >
        Search <ArrowRight size={compact ? 16 : 18} />
      </button>

      {suggestions.length ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
          {suggestions.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => chooseSuggestion(product.title)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition hover:bg-[var(--background)]"
            >
              <span>
                <strong>{product.title}</strong>
                <span className="ml-2 text-[var(--muted)]">{product.category}</span>
              </span>
              <ArrowRight size={15} className="text-[var(--muted)]" />
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
}
