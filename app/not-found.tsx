export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 8v6M14 17v2"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="14" cy="14" r="10" stroke="#f97316" strokeWidth="1.5" opacity={0.4} />
        </svg>
      </div>
      <h1
        className="text-[28px] font-bold mb-3"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
      >
        Artikel nicht gefunden
      </h1>
      <p className="text-[15px] mb-8" style={{ color: 'var(--color-muted)' }}>
        Dieser Beitrag existiert nicht oder wurde noch nicht veröffentlicht.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 text-[13px] font-semibold no-underline px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
        style={{ background: 'var(--color-accent)', color: '#fff' }}
      >
        ← Zur Übersicht
      </a>
    </div>
  );
}
