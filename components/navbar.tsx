"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, PackageCheck, ShoppingCart, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchAssistant } from "@/components/products/search-assistant";
import { useCart } from "@/lib/cart-context";
import { clearCustomer, getCustomer, type CustomerProfile } from "@/lib/local-store";

export function Navbar() {
  const { count } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    const syncUser = () => setUser(getCustomer());
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("splax-storage", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("splax-storage", syncUser);
    };
  }, []);

  function signOut() {
    clearCustomer();
    setUser(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl">
      <div className="container-page flex min-h-16 items-center gap-3 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="SPLAX home">
          <Image
            src="/splax-logo.webp"
            alt="SPLAX"
            width={150}
            height={48}
            priority
            className="h-12 w-auto rounded-lg object-contain"
          />
        </Link>

        <div className="mx-auto hidden max-w-xl flex-1 md:block">
          <SearchAssistant compact placeholder="Search headphones, shoes, kitchen tools..." />
        </div>

        <nav className="ml-auto flex items-center gap-2">
          <Link
            href="/products"
            className="hidden rounded-full px-4 py-2 text-sm font-bold text-[var(--foreground)] transition hover:bg-[var(--background)] lg:inline-flex"
          >
            Deals
          </Link>
          {user ? (
            <div className="group relative">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-black text-[var(--foreground)] transition hover:-translate-y-0.5 hover:shadow-md"
                aria-label="Customer menu"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#202940] text-xs text-white">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-28 truncate md:inline">{user.name}</span>
                <ChevronDown size={15} />
              </button>
              <div className="invisible absolute right-0 top-12 z-50 w-64 translate-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 opacity-0 shadow-2xl transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="border-b border-[var(--border)] p-3">
                  <p className="font-black">{user.name}</p>
                  <p className="truncate text-xs text-[var(--muted)]">{user.email || user.phone}</p>
                </div>
                <Link href="/dashboard" className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold hover:bg-[var(--background)]">
                  <LayoutDashboard size={17} /> Customer home
                </Link>
                <Link href="/dashboard#orders" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold hover:bg-[var(--background)]">
                  <PackageCheck size={17} /> View orders
                </Link>
                <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-[var(--background)]">
                  <LogOut size={17} /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-sm font-black text-[var(--foreground)] transition hover:-translate-y-0.5 hover:shadow-md md:w-auto md:px-4 md:py-2"
              aria-label="Sign in"
            >
              <UserRound size={18} />
              <span className="hidden md:inline">Sign in</span>
            </Link>
          )}
          <Link
            href="/dashboard"
            className="focus-ring hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] transition hover:-translate-y-0.5 hover:shadow-md lg:inline-flex"
            aria-label="Dashboard"
          >
            <UserRound size={18} />
          </Link>
          <ThemeToggle />
          <Link
            href="/cart"
            className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#202940] text-white transition hover:-translate-y-0.5 hover:bg-[#12192b] hover:shadow-md"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#BFC9D1] px-1 text-xs font-black text-[#202940]">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] md:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </nav>
      </div>
    </header>
  );
}
