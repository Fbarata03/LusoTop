"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function OperatorLogo({
  name,
  logoUrl,
  className,
}: {
  name: string;
  logoUrl: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary",
          className
        )}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={name}
      className={cn(
        "shrink-0 rounded-full border border-border bg-white object-contain p-1",
        className
      )}
      onError={() => setFailed(true)}
    />
  );
}
