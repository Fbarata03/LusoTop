import { cn } from "@/lib/utils";

export function FlagIcon({
  isoCode,
  className,
}: {
  isoCode: string;
  className?: string;
}) {
  return (
    <span
      className={cn("fi", `fi-${isoCode.toLowerCase()}`, "rounded-[3px]", className)}
      role="img"
      aria-label={`Bandeira de ${isoCode}`}
    />
  );
}
