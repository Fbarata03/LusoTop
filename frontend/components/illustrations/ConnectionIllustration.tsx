export function ConnectionIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 340"
      fill="none"
      className={className}
      role="img"
      aria-label="Ilustração de um telemóvel a enviar uma recarga para outro telemóvel, ligados por um sinal"
    >
      <circle cx="210" cy="170" r="168" fill="#ECFDF5" />
      <circle cx="210" cy="170" r="120" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="4 6" />

      {/* Arco de sinal entre os dois telemóveis */}
      <path
        d="M118 150C160 90 260 90 302 150"
        stroke="#34D399"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 14"
      />
      <circle cx="164" cy="104" r="5" fill="#34D399" />
      <circle cx="210" cy="92" r="5" fill="#6EE7B7" />
      <circle cx="256" cy="104" r="5" fill="#34D399" />

      {/* Telemovel esquerdo (a enviar) */}
      <g transform="translate(56 150)">
        <rect x="0" y="0" width="92" height="164" rx="18" fill="#0B1B2E" />
        <rect x="7" y="10" width="78" height="144" rx="10" fill="#ffffff" />
        <rect x="20" y="26" width="52" height="8" rx="4" fill="#0B1B2E" opacity="0.08" />
        <rect x="20" y="42" width="36" height="8" rx="4" fill="#0B1B2E" opacity="0.08" />
        <circle cx="43" cy="96" r="24" fill="#34D399" opacity="0.12" />
        <path
          d="M32 96h22m0 0-8-8m8 8-8 8"
          stroke="#059669"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Telemovel direito (a receber) */}
      <g transform="translate(272 132)">
        <rect x="0" y="0" width="92" height="164" rx="18" fill="#0B1B2E" />
        <rect x="7" y="10" width="78" height="144" rx="10" fill="#ffffff" />
        <rect x="20" y="26" width="52" height="8" rx="4" fill="#0B1B2E" opacity="0.08" />
        <rect x="20" y="42" width="30" height="8" rx="4" fill="#0B1B2E" opacity="0.08" />
        <circle cx="43" cy="98" r="26" fill="#34D399" />
        <path
          d="M31 98l8 8 16-18"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Pontos decorativos */}
      <circle cx="70" cy="70" r="4" fill="#6EE7B7" />
      <circle cx="350" cy="230" r="5" fill="#34D399" />
      <circle cx="60" cy="260" r="3" fill="#A7F3D0" />
    </svg>
  );
}
