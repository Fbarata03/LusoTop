export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      role="img"
      aria-label="Logótipo LusoTop"
    >
      <defs>
        <linearGradient id="ltRing" x1="14" y1="80" x2="82" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0F5132" />
          <stop offset="0.45" stopColor="#22A559" />
          <stop offset="1" stopColor="#8BE04D" />
        </linearGradient>
        <linearGradient id="ltT" x1="46" y1="22" x2="80" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9BE84F" />
          <stop offset="1" stopColor="#2FA84A" />
        </linearGradient>
      </defs>

      <circle cx="48" cy="48" r="44" fill="#07150F" />

      {/* Anel com abertura, estilo "C" */}
      <path
        d="M76 33a34 34 0 1 0 3 15"
        stroke="url(#ltRing)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* L branco */}
      <path
        d="M31 24h13v34h16v12H31Z"
        fill="#F5FBF7"
      />
      <path
        d="M31 24h13v34h4V28h-8v30h-9Z"
        fill="#DCEFE3"
        opacity="0.6"
      />

      {/* T verde, sobreposto ao pé do L */}
      <path d="M44 34h30v11H67v25H55V45H44Z" fill="url(#ltT)" />
      <path d="M44 34h30v4H44Z" fill="#C8F29A" opacity="0.5" />
    </svg>
  );
}
