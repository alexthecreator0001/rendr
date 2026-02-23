"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckoutButton({
  plan,
  children,
  variant = "default",
  className,
}: {
  plan: string;
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={variant}
      className={cn("gap-1.5", className)}
    >
      {!loading && <Zap className="h-3.5 w-3.5" />}
      {loading ? "Redirecting to Stripe…" : children}
    </Button>
  );
}

export function PortalButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant="outline"
      className={cn("gap-1.5", className)}
    >
      <Settings className="h-3.5 w-3.5" />
      {loading ? "Redirecting…" : "Manage subscription"}
    </Button>
  );
}
