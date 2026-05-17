"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { saveCustomer } from "@/lib/local-store";

type Mode = "signin" | "signup";

export function AuthFormClient() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const displayName = name.trim() || email.split("@")[0] || phone || "SPLAX Shopper";
    saveCustomer({
      name: displayName,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      signedInAt: new Date().toISOString()
    });
    router.push("/dashboard");
  }

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="grid grid-cols-2 rounded-full bg-[var(--background)] p-1">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`rounded-full px-4 py-2 text-sm font-black transition ${
            mode === "signin" ? "bg-[#202940] text-white" : "text-[var(--muted)]"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-full px-4 py-2 text-sm font-black transition ${
            mode === "signup" ? "bg-[#202940] text-white" : "text-[var(--muted)]"
          }`}
        >
          Create account
        </button>
      </div>

      <h2 className="mt-6 text-3xl font-black">
        {mode === "signin" ? "Welcome back" : "Create your SPLAX account"}
      </h2>
      <p className="mt-2 text-[var(--muted)]">
        {mode === "signin"
          ? "Sign in to access your dashboard, cart, and order history."
          : "Start saving products, tracking orders, and checking out faster."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        {mode === "signup" ? (
          <label>
            <span className="text-sm font-bold">Full name</span>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
              <UserRound size={18} className="text-[var(--muted)]" />
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="Your name"
              />
            </div>
          </label>
        ) : null}

        <label>
          <span className="text-sm font-bold">Email address</span>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <Mail size={18} className="text-[var(--muted)]" />
            <input
              type="email"
              name="email"
              required={mode === "signin" && !phone}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-transparent outline-none"
              placeholder={mode === "signup" ? "you@example.com (optional)" : "you@example.com"}
            />
          </div>
        </label>

        <label>
          <span className="text-sm font-bold">Phone number</span>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <Phone size={18} className="text-[var(--muted)]" />
            <input
              name="phone"
              required={!email}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full bg-transparent outline-none"
              placeholder="+880 1XXXXXXXXX"
            />
          </div>
        </label>

        <label>
          <span className="text-sm font-bold">Password</span>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <LockKeyhole size={18} className="text-[var(--muted)]" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full bg-transparent outline-none"
              placeholder="Enter password"
            />
          </div>
        </label>

        <button
          type="submit"
          className="mt-2 rounded-full bg-[#202940] px-6 py-3 font-black text-white transition hover:bg-[#12192b]"
        >
          {mode === "signin" ? "Sign in securely" : "Create account"}
        </button>
        <p className="text-xs leading-5 text-[var(--muted)]">
          Use either email or phone. Your session stays signed in on this browser until you sign out.
        </p>
      </form>
    </section>
  );
}
