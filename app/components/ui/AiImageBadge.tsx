export function AiImageBadge({ label }: { label: string }) {
  return (
    <span
      aria-label={label}
      style={{
        position: 'absolute',
        right: 14,
        bottom: 14,
        zIndex: 4,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 11px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.94)',
        border: '1px solid rgba(0,0,0,0.18)',
        boxShadow: '0 3px 12px rgba(0,0,0,0.22)',
        color: '#111827',
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: '0.06em',
        lineHeight: 1,
        pointerEvents: 'none',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 9 }}>AI</span>
      {label}
    </span>
  );
}
