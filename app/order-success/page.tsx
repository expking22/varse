import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order Submitted",
  description: "Your SPLAX order request has been submitted for confirmation.",
  openGraph: {
    title: "Order Submitted | SPLAX",
    description: "SPLAX received your order request and will confirm it soon."
  }
};

export default function OrderSuccessPage() {
  return (
    <div className="container-page py-16">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
        <CheckCircle2 className="mx-auto text-green-600" size={44} />
        <h1 className="mt-4 text-4xl font-black">Order request submitted</h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-[var(--muted)]">
          Thank you for shopping with SPLAX. Your order details were sent to {siteConfig.supportEmail}, and the team can now confirm availability, payment, and delivery.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="rounded-full bg-[#202940] px-6 py-3 font-black text-white">
            Back to Home
          </Link>
          <Link href="/cart" className="rounded-full border border-[var(--border)] px-6 py-3 font-black">
            Return to Cart
          </Link>
          <Link href="/dashboard" className="rounded-full bg-[#202940] px-6 py-3 font-black text-white">
            View Orders
          </Link>
          <Link href="/products" className="rounded-full border border-[var(--border)] px-6 py-3 font-black">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
