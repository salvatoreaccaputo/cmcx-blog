'use client';

interface ExpertCTAProps {
  expertName: string;
  expertImageUrl: string;
  topic: string;
}

export function ExpertCTA({ expertName, expertImageUrl, topic }: ExpertCTAProps) {
  /* expertName may contain "Name\nShortTopic" — split and use both */
  const lines = expertName.split('\n').map((l) => l.trim()).filter(Boolean);
  const displayName = lines[0] ?? expertName;
  const shortTopic = lines[1] ?? topic;
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

      <div style={{ padding: '36px 40px', display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={expertImageUrl}
            alt={expertName}
            style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid var(--color-border)',
              display: 'block',
            }}
          />
          {/* Online dot */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#10b981',
              border: '3px solid white',
            }}
          />
        </div>

        {/* Text content */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--color-muted)',
              marginBottom: 8,
            }}
          >
            Sprechen Sie mit unserem Experten
          </p>
          <p
            style={{
              fontSize: 30,
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            {displayName}
          </p>
          <p style={{ fontSize: 16, color: 'var(--color-muted)', lineHeight: 1.5 }}>
            Experte für <strong style={{ color: 'var(--color-secondary)' }}>{shortTopic}</strong>
          </p>
        </div>

        {/* CTA Button */}
        <a
          href="#kontakt"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px 32px',
            borderRadius: 14,
            background: 'var(--color-primary)',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 17,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'opacity 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="17" height="17" viewBox="0 0 14 14" fill="none">
            <path d="M7 1C4.239 1 2 3.239 2 6c0 1.398.55 2.665 1.44 3.6L2 12l2.4-1.44A4.978 4.978 0 0 0 7 11c2.761 0 5-2.239 5-5S9.761 1 7 1Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          Jetzt anfragen
        </a>
      </div>
    </div>
  );
}
