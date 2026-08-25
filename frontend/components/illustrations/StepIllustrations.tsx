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
    <Base className={className} label="Ilustração de um telemóvel com teclado numérico">
      <rect x="26" y="10" width="44" height="76" rx="10" fill="#0F2A44" stroke="#6EE7B7" strokeOpacity="0.4" strokeWidth="1.5" />
      <rect x="33" y="20" width="30" height="6" rx="3" fill="#34D399" fillOpacity="0.35" />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={38 + col * 10}
            cy={42 + row * 12}
            r="3.4"
            fill={row === 2 && col === 1 ? "#34D399" : "#ffffff"}
            fillOpacity={row === 2 && col === 1 ? 1 : 0.18}
          />
        ))
      )}
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
