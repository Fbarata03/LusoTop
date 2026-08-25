import type { ReactNode } from "react";

function Base({
  className,
  label,
  children,
}: {
  className?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} role="img" aria-label={label}>
      {children}
    </svg>
  );
}

export function DestinationIllustration({ className }: { className?: string }) {
  return (
    <Base className={className} label="Ilustração de um globo com um marcador de localização">
      <circle cx="42" cy="48" r="34" fill="#34D399" fillOpacity="0.15" />
      <circle cx="42" cy="48" r="34" stroke="#6EE7B7" strokeOpacity="0.4" strokeWidth="1.5" />
      <ellipse cx="42" cy="48" rx="34" ry="14" stroke="#6EE7B7" strokeOpacity="0.35" strokeWidth="1.2" />
      <ellipse cx="42" cy="48" rx="15" ry="34" stroke="#6EE7B7" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="8" y1="48" x2="76" y2="48" stroke="#6EE7B7" strokeOpacity="0.35" strokeWidth="1.2" />
      <g>
        <path
          d="M64 26c-8 0-14 6.4-14 14.3C50 51 64 68 64 68s14-17 14-27.7C78 32.4 72 26 64 26Z"
          fill="#059669"
          stroke="#ECFDF5"
          strokeWidth="2"
        />
        <circle cx="64" cy="40" r="6" fill="#ECFDF5" />
      </g>
    </Base>
  );
}

export function PhoneNumberIllustration({ className }: { className?: string }) {
  return (
    <Base className={className} label="Ilustração de um telemóvel a validar um número, com sinal">
      <defs>
        <filter id="phoneGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Arcos de sinal */}
      <path d="M68 20a14 14 0 0 1 0 20" stroke="#34D399" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 14a22 22 0 0 1 0 32" stroke="#34D399" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />

      <rect
        x="24"
        y="8"
        width="40"
        height="76"
        rx="10"
        fill="#0B1B2E"
        stroke="#34D399"
        strokeWidth="1.6"
        filter="url(#phoneGlow)"
      />
      <rect x="30" y="17" width="28" height="5" rx="2.5" fill="#34D399" fillOpacity="0.3" />

      {[
        { y: 30, ok: true },
        { y: 44, ok: true },
        { y: 58, ok: false },
      ].map((row) => (
        <g key={row.y}>
          <rect x="30" y={row.y} width="28" height="10" rx="3" fill="#ffffff" fillOpacity="0.06" />
          <circle cx="36" cy={row.y + 5} r="4.2" fill={row.ok ? "#34D399" : "#F87171"} />
          {row.ok ? (
            <path
              d={`M34 ${row.y + 5}l1.4 1.6L38.2 ${row.y + 3}`}
              stroke="#052e21"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : (
            <path
              d={`M34.3 ${row.y + 3.3}l3.4 3.4M37.7 ${row.y + 3.3}l-3.4 3.4`}
              stroke="#450a0a"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          )}
          <rect x="43" y={row.y + 3} width="11" height="4" rx="2" fill="#ffffff" fillOpacity="0.15" />
        </g>
      ))}
    </Base>
  );
}

export function PlanIllustration({ className }: { className?: string }) {
  return (
    <Base className={className} label="Ilustração de um cartão com moedas">
      <rect x="14" y="30" width="52" height="36" rx="8" fill="#0F2A44" stroke="#6EE7B7" strokeOpacity="0.4" strokeWidth="1.5" />
      <rect x="14" y="40" width="52" height="8" fill="#34D399" fillOpacity="0.3" />
      <rect x="22" y="54" width="16" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.3" />
      <circle cx="66" cy="58" r="18" fill="#34D399" />
      <path
        d="M58 58h16M66 50v16"
        stroke="#052e21"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </Base>
  );
}

export function SecurePaymentIllustration({ className }: { className?: string }) {
  return (
    <Base className={className} label="Ilustração de um escudo com um cadeado">
      <path
        d="M48 10 20 20v22c0 22 14 34.6 28 38 14-3.4 28-16 28-38V20L48 10Z"
        fill="#34D399"
        fillOpacity="0.15"
        stroke="#6EE7B7"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <rect x="36" y="44" width="24" height="18" rx="4" fill="#059669" />
      <path
        d="M40 44v-6a8 8 0 0 1 16 0v6"
        stroke="#059669"
        strokeWidth="3.5"
        fill="none"
      />
      <circle cx="48" cy="52" r="3" fill="#ECFDF5" />
    </Base>
  );
}
