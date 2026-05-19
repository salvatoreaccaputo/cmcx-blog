import Image from 'next/image';
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
    <div>
      {/* ── Hero stage ───────────────────────────────────────────── */}
      <section
        className="w-full"
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div
          className="mx-auto flex flex-col px-6 pt-8 pb-2"
          style={{ maxWidth: 1200 }}
        >
          {/* Teaser image — full width */}
          <div
            className="w-full overflow-hidden"
            style={{
              borderRadius: 16,
              border: '1px solid rgba(0,0,0,0.18)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <Image
              src="/blog-teaser.png"
              alt="New Kid on the Blog – Teaser"
              width={1280}
              height={720}
              className="w-full h-auto object-cover"
              style={{ display: 'block' }}
              priority
            />
          </div>

          {/* Intro text — below image */}
          <div className="py-10 flex flex-col gap-5">
            <p className="label-caps" style={{ color: 'var(--color-teal)' }}>
              Willkommen
            </p>
            <h2
              className="leading-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3vw, 34px)',
                fontWeight: 800,
                color: 'var(--color-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Willkommen bei „New Kid on the Blog"
            </h2>
            <div className="flex flex-col gap-4" style={{ color: '#334155', fontSize: 16, lineHeight: 1.8 }}>
              <p>
                Hier geht es um KI-Tools, Automationen und praktische Workflows: verständlich, direkt und mit Blick darauf, was im Alltag wirklich funktioniert.
              </p>
              <p>
                Dieser Blog ist zugleich Showcase und Experiment. Er zeigt, wie KI Inhalte, Prozesse und Ideen unterstützen kann — nicht nur theoretisch, sondern praktisch im Einsatz.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="ai-dot" />
              <span className="label-caps" style={{ color: 'var(--color-muted)' }}>
                KI-generierter Content · automatisch veröffentlicht
              </span>
            </div>
          </div>
        </div>
      </section>

    <div className="mx-auto px-6 py-12" style={{ maxWidth: 1200 }}>

      {/* ── Error state ──────────────────────────────────────────── */}
      {fetchError && (
        <div
          className="rounded-xl p-5 mb-10"
          style={{
            background: 'rgba(186,26,26,0.06)',
            border: '1px solid rgba(186,26,26,0.2)',
          }}
        >
          <p className="text-[14px]" style={{ color: '#ba1a1a' }}>
            Artikel konnten nicht geladen werden: {fetchError}
          </p>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────── */}
      {!fetchError && posts.length === 0 && (
        <div
          className="rounded-xl p-16 text-center"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(0,52,65,0.08)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 5v6M10 13v2"
                stroke="var(--color-primary)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2
            className="text-[18px] font-semibold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold no-underline transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            CMCx Tool öffnen →
          </a>
        </div>
      )}

      {/* ── Blog listing ─────────────────────────────────────────── */}
      {!fetchError && posts.length > 0 && <BlogListing posts={posts} />}

      {/* ── Count hint ───────────────────────────────────────────── */}
      {posts.length > 0 && (
        <p
          className="text-center label-caps mt-16"
          style={{ color: 'var(--color-subtle)' }}
        >
          Aktualisiert sich automatisch · {posts.length} Artikel verfügbar
        </p>
      )}
    </div>
    </div>
  );
}
