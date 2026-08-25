export function HappyUserIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      role="img"
      aria-label="Ilustração de uma pessoa feliz a olhar para a lista de países"
    >
      <circle cx="48" cy="48" r="46" fill="currentColor" className="text-primary/10" />

      {/* Ombros */}
      <path
        d="M18 88c2-16 14-26 30-26s28 10 30 26"
        fill="#059669"
      />

      {/* Cabeca, ligeiramente inclinada a olhar para baixo/para a lista */}
      <g transform="rotate(-6 48 42)">
        <circle cx="48" cy="42" r="22" fill="#FBCFA0" />
        {/* Cabelo */}
        <path
          d="M27 38c-1-14 10-22 21-22s22 8 21 22c-4-6-12-8-21-8s-17 2-21 8Z"
          fill="#0F2A44"
        />
        {/* Olhos felizes (arco) */}
        <path d="M39 43c1.5-3 5-3 6.5 0" stroke="#0F2A44" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M51 43c1.5-3 5-3 6.5 0" stroke="#0F2A44" strokeWidth="2.4" strokeLinecap="round" />
        {/* Sorriso grande */}
        <path
          d="M38 50c3 5 8 7 10 7s7-2 10-7"
          stroke="#0F2A44"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* Bochechas */}
        <circle cx="36" cy="48" r="3" fill="#F59E0B" fillOpacity="0.25" />
        <circle cx="60" cy="48" r="3" fill="#F59E0B" fillOpacity="0.25" />
      </g>

      {/* Braco acenando */}
      <path
        d="M70 70c6-2 11-8 12-15"
        stroke="#059669"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="83" cy="53" r="6" fill="#FBCFA0" />
    </svg>
  );
}
