import { useId, type ReactNode } from "react";

function GlossyBase({
  className,
  label,
  children,
}: {
  className?: string;
  label: string;
  children: (gradientId: string) => ReactNode;
}) {
  const gradientId = `glossy-${useId()}`;
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} role="img" aria-label={label}>
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="55%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#${gradientId})`} />
      <ellipse cx="14" cy="12" rx="7" ry="4" fill="#ffffff" fillOpacity="0.35" />
      {children(gradientId)}
    </svg>
  );
}

export function GlossyBalanceIcon({ className }: { className?: string }) {
  return (
    <GlossyBase className={className} label="Saldo">
      {() => (
        <g>
          <rect x="11" y="15" width="18" height="12" rx="3" fill="#052e21" />
          <rect x="11" y="18" width="18" height="3" fill="#34D399" />
          <circle cx="24" cy="23.5" r="2.2" fill="#6EE7B7" />
        </g>
      )}
    </GlossyBase>
  );
}

export function GlossyDataIcon({ className }: { className?: string }) {
  return (
    <GlossyBase className={className} label="Dados móveis">
      {() => (
        <g fill="#052e21">
          <rect x="11" y="21" width="3.4" height="6" rx="1" />
          <rect x="16" y="18" width="3.4" height="9" rx="1" />
          <rect x="21" y="14" width="3.4" height="13" rx="1" />
          <rect x="26" y="10" width="3.4" height="17" rx="1" />
        </g>
      )}
    </GlossyBase>
  );
}

export function GlossyVoiceIcon({ className }: { className?: string }) {
  return (
    <GlossyBase className={className} label="Voz">
      {() => (
        <path
          d="M13 12c0-1 1-2 2-2h2c1 0 1.4.7 1.7 1.5l1 2.6c.3.8 0 1.5-.6 2l-1.3 1c1 2.3 2.8 4.1 5.1 5.1l1-1.3c.5-.6 1.2-.9 2-.6l2.6 1c.8.3 1.5.7 1.5 1.7v2c0 1-1 2-2 2-8.3 0-15-6.7-15-15Z"
          fill="#052e21"
        />
      )}
    </GlossyBase>
  );
}
