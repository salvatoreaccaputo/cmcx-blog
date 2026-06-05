interface ExpertCTAProps {
  expertName: string;
  expertImageUrl: string;
  topic: string;
}

export function ExpertCTA({ expertName, expertImageUrl, topic }: ExpertCTAProps) {
  return (
    <div
      style={{
        margin: '48px 0 32px',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(0,52,65,0.03) 100%)',
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }} />

      <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={expertImageUrl}
            alt={expertName}
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--color-border)',
              display: 'block',
            }}
          />
          {/* Online dot */}
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid white',
            }}
          />
        </div>

        {/* Text content */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-muted)',
              marginBottom: 4,
            }}
          >
            Sprechen Sie mit unserem Experten
          </p>
          <p
            style={{
              fontSize: 20,
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: 4,
            }}
          >
            {expertName}
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
            Experte für <em>{topic}</em>
          </p>
        </div>

        {/* CTA Button */}
        <a
          href="#kontakt"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 12,
            background: 'var(--color-primary)',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'opacity 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1C4.239 1 2 3.239 2 6c0 1.398.55 2.665 1.44 3.6L2 12l2.4-1.44A4.978 4.978 0 0 0 7 11c2.761 0 5-2.239 5-5S9.761 1 7 1Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          Jetzt anfragen
        </a>
      </div>
    </div>
  );
}
