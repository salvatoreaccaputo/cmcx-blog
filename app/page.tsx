import { getBlogPosts } from '../lib/supabase';
import type { Campaign } from '../lib/supabase';
import { BlogListing } from './components/blog/BlogListing';

export const revalidate = 10;

export default async function HomePage() {
  let posts: Campaign[] = [];
  let fetchError: string | null = null;

  try {
    posts = await getBlogPosts();
  } catch (e) {
    fetchError = e instanceof Error ? e.message : 'Unbekannter Fehler';
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="mb-12">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3"
          style={{ color: 'var(--color-accent)' }}
        >
          Content Orchestration Lab
        </p>
        <h1
          className="text-[44px] sm:text-[56px] font-bold leading-[1.05] mb-4"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
        >
          Alle Artikel
        </h1>
        <p className="text-[16px]" style={{ color: 'var(--color-muted)' }}>
          KI-generierter Content · automatisch veröffentlicht
        </p>
      </div>

      {/* ── Error state ──────────────────────────────────────────── */}
      {fetchError && (
        <div
          className="rounded-xl p-5 mb-10"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <p className="text-[14px]" style={{ color: '#f87171' }}>
            Artikel konnten nicht geladen werden: {fetchError}
          </p>
        </div>
      )}

      {/* ── Empty state (no posts at all) ────────────────────────── */}
      {!fetchError && posts.length === 0 && (
        <div
          className="rounded-2xl p-16 text-center"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--color-accent-dim)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 5v6M10 13v2"
                stroke="#f97316"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2
            className="text-[18px] font-semibold mb-2"
            style={{ color: 'var(--color-ink)' }}
          >
            Noch keine Artikel vorhanden
          </h2>
          <p className="text-[14px] mb-6" style={{ color: 'var(--color-muted)' }}>
            Erstelle im CMCx-Tool einen Inhalt mit dem Kanal „Blog" —{' '}
            er erscheint hier automatisch.
          </p>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold no-underline transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            CMCx Tool öffnen →
          </a>
        </div>
      )}

      {/* ── Blog listing ─────────────────────────────────────────── */}
      {!fetchError && posts.length > 0 && <BlogListing posts={posts} />}

      {/* ── Auto-refresh hint ────────────────────────────────────── */}
      {posts.length > 0 && (
        <p
          className="text-center text-[11px] mt-16"
          style={{ color: 'var(--color-subtle)' }}
        >
          Aktualisiert sich automatisch · {posts.length}{' '}
          {posts.length === 1 ? 'Artikel' : 'Artikel'} verfügbar
        </p>
      )}
    </div>
  );
}
