import Image from 'next/image';
import { getBlogPosts } from '../lib/supabase';
import type { Campaign } from '../lib/supabase';

export const revalidate = 60; // ISR — auto-refresh every 60s

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function readingTime(text: string | null) {
  if (!text) return '1 Min.';
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} Min.`;
}

function excerpt(text: string | null, max = 160) {
  if (!text) return '';
  const clean = text.replace(/#{1,6}\s/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
}

/* ── Hero card (latest post) ──────────────────────────────── */
function HeroCard({ post }: { post: Campaign }) {
  return (
    <a href={`/artikel/${post.id}`} className="group block no-underline">
      <article
        className="rounded-2xl overflow-hidden card-hover"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        {/* Hero image */}
        {post.image_url && (
          <div className="relative w-full" style={{ height: 340 }}>
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)' }} />
          </div>
        )}

        <div className="p-8">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="tag">Neuester Artikel</span>
            <span className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
              {readingTime(post.blog)} Lesezeit
            </span>
          </div>

          {/* Title */}
          <h2
            className="text-[28px] font-bold leading-tight mb-3 group-hover:underline"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', textDecorationColor: 'var(--color-accent)' }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-[15px] leading-relaxed mb-5" style={{ color: '#4b5563' }}>
            {excerpt(post.blog, 220)}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <time className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
              {formatDate(post.created_at)}
            </time>
            <span
              className="text-[13px] font-semibold flex items-center gap-1"
              style={{ color: 'var(--color-accent)' }}
            >
              Weiterlesen
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7.5 4l3.5 3-3.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </article>
    </a>
  );
}

/* ── Regular post card ────────────────────────────────────── */
function PostCard({ post }: { post: Campaign }) {
  return (
    <a href={`/artikel/${post.id}`} className="group block no-underline">
      <article
        className="rounded-xl overflow-hidden card-hover h-full flex flex-col"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: '0 1px 6px rgba(0,0,0,0.03)' }}
      >
        {/* Thumbnail */}
        {post.image_url ? (
          <div className="relative w-full flex-shrink-0" style={{ height: 180 }}>
            <Image src={post.image_url} alt={post.title} fill className="object-cover" />
          </div>
        ) : (
          <div
            className="w-full flex-shrink-0 flex items-center justify-center"
            style={{ height: 120, background: 'linear-gradient(135deg, #eff6ff, #eef2ff)' }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="6" width="24" height="3" rx="1.5" fill="#c7d2fe"/>
              <rect x="4" y="13" width="18" height="2.5" rx="1.25" fill="#c7d2fe"/>
              <rect x="4" y="19" width="21" height="2.5" rx="1.25" fill="#c7d2fe"/>
              <rect x="4" y="25" width="14" height="2.5" rx="1.25" fill="#e0e7ff"/>
            </svg>
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-3">
            <span className="tag">{post.tone}</span>
            <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
              {readingTime(post.blog)} Lesezeit
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-[17px] font-semibold leading-snug mb-2 group-hover:text-blue-700 transition-colors"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-[13px] leading-relaxed flex-1" style={{ color: '#6b7280' }}>
            {excerpt(post.blog, 120)}
          </p>

          {/* Date */}
          <time className="text-[11px] mt-4 block" style={{ color: 'var(--color-muted)' }}>
            {formatDate(post.created_at)}
          </time>
        </div>
      </article>
    </a>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function HomePage() {
  let posts: Campaign[] = [];
  let fetchError: string | null = null;

  try {
    posts = await getBlogPosts();
  } catch (e) {
    fetchError = e instanceof Error ? e.message : 'Fehler beim Laden der Artikel';
  }

  const [hero, ...rest] = posts;

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="mb-12">
        <p className="text-[12px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>
          Content Orchestration Lab
        </p>
        <h1 className="text-[40px] font-bold leading-tight mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
          Alle Artikel
        </h1>
        <p className="text-[16px]" style={{ color: 'var(--color-muted)' }}>
          KI-generierter Content · automatisch veröffentlicht
        </p>
      </div>

      {/* ── Error state ───────────────────────────────── */}
      {fetchError && (
        <div className="rounded-xl p-6 mb-10 border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
          <p className="text-[14px]" style={{ color: '#991b1b' }}>
            ⚠ Artikel konnten nicht geladen werden: {fetchError}
          </p>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────── */}
      {!fetchError && posts.length === 0 && (
        <div className="rounded-2xl p-16 text-center border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-[18px] font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>
            Noch keine Artikel vorhanden
          </h2>
          <p className="text-[14px]" style={{ color: 'var(--color-muted)' }}>
            Erstelle im CMCx-Tool einen Inhalt mit dem Kanal „Blog" — er erscheint hier automatisch.
          </p>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg text-[13px] font-semibold no-underline"
            style={{ background: 'var(--color-ink)', color: '#fff' }}
          >
            CMCx Tool öffnen →
          </a>
        </div>
      )}

      {/* ── Hero post ─────────────────────────────────── */}
      {hero && (
        <div className="mb-10">
          <HeroCard post={hero} />
        </div>
      )}

      {/* ── Post grid ─────────────────────────────────── */}
      {rest.length > 0 && (
        <>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--color-muted)' }}>
            Weitere Artikel
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}

      {/* ── Auto-refresh notice ───────────────────────── */}
      {posts.length > 0 && (
        <p className="text-center text-[11px] mt-16" style={{ color: 'var(--color-border)' }}>
          Aktualisiert sich automatisch · {posts.length} {posts.length === 1 ? 'Artikel' : 'Artikel'} verfügbar
        </p>
      )}
    </div>
  );
}
