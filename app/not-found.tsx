export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-center">
      <p className="text-6xl mb-6">📄</p>
      <h1 className="text-[28px] font-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
        Artikel nicht gefunden
      </h1>
      <p className="text-[15px] mb-8" style={{ color: 'var(--color-muted)' }}>
        Dieser Beitrag existiert nicht oder wurde noch nicht veröffentlicht.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 text-[13px] font-semibold no-underline px-4 py-2 rounded-lg"
        style={{ background: 'var(--color-ink)', color: '#fff' }}
      >
        ← Zur Übersicht
      </a>
    </div>
  );
}
