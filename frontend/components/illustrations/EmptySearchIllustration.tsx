export function EmptySearchIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      className={className}
      role="img"
      aria-label="Ilustração de uma lupa sem resultados"
    >
      <circle cx="80" cy="60" r="52" fill="currentColor" className="text-primary/10" />
      <circle cx="70" cy="55" r="26" stroke="#A7F3D0" strokeWidth="6" />
      <line
        x1="89"
        y1="74"
        x2="108"
        y2="93"
        stroke="#A7F3D0"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M61 55h18M70 46v18"
        stroke="#34D399"
        strokeWidth="4"
        strokeLinecap="round"
        transform="rotate(45 70 55)"
      />
    </svg>
  );
}
