import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '../../../lib/supabase';
import { ArticleSidebar } from '../../components/blog/ArticleSidebar';
import type { Metadata } from 'next';

export const revalidate = 60;

/* ── Generate static paths at build time ───────────────────── */
export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

/* ── Dynamic metadata ───────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) return { title: 'Artikel nicht gefunden' };
  return {
    title: post.title,
    description: post.idea?.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.idea?.slice(0, 160),
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function readingTime(text: string | null) {
  if (!text) return '1 Min.';
  return `${Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))} Min.`;
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function ArtikelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPost(id),
    getBlogPosts(),
  ]);
  if (!post) notFound();

  return (
    <div>
      {/* ── Hero image ───────────────────────────────────────── */}
      {post.image_url && (
        <div className="relative w-full" style={{ height: 420 }}>
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient fades into dark background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.35) 55%, transparent 100%)',
            }}
          />
        </div>
      )}

      {/* ── Two-column layout ───────────────────────────────── */}
      <div
        className="max-w-5xl mx-auto px-6 lg:grid lg:gap-10 lg:items-start"
        style={{
          marginTop: post.image_url ? -80 : 60,
          gridTemplateColumns: '1fr 300px',
        }}
      >

      {/* ── Article column ──────────────────────────────────── */}
      <div>
        {/* Back link */}
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium no-underline mb-8 relative z-10 transition-colors"
          style={{ color: 'var(--color-muted)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M9 6H3M5.5 3.5L3 6l2.5 2.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Alle Artikel
        </a>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5 relative z-10">
          {post.tone && (
            <span className="tag">{post.tone}</span>
          )}
          <time className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
            {formatDate(post.created_at)}
          </time>
          <span style={{ color: 'var(--color-subtle)' }}>·</span>
          <span className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
            {readingTime(post.blog)} Lesezeit
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.07)',
              color: 'var(--color-muted)',
            }}
          >
            {post.language === 'de' ? 'DE' : 'EN'}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-[34px] sm:text-[40px] font-bold leading-tight mb-6 relative z-10"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
        >
          {post.title}
        </h1>

        {/* Idea teaser */}
        {post.idea && (
          <div
            className="rounded-xl p-5 mb-10 border-l-4 relative z-10"
            style={{
              background: 'rgba(249,115,22,0.07)',
              borderColor: 'var(--color-accent)',
            }}
          >
            <p
              className="text-[14px] font-medium italic"
              style={{ color: 'var(--color-accent)' }}
            >
              „{post.idea}"
            </p>
          </div>
        )}

        {/* ── Blog content ──────────────────────────────────── */}
        {post.blog && (
          <article
            className="prose prose-lg max-w-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {post.blog.split('\n').map((line, i) => {
              if (line.startsWith('# '))
                return (
                  <h1
                    key={i}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-ink)',
                      fontSize: 28,
                      fontWeight: 700,
                      marginTop: 40,
                      marginBottom: 12,
                    }}
                  >
                    {line.slice(2)}
                  </h1>
                );
              if (line.startsWith('## '))
                return (
                  <h2
                    key={i}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-ink)',
                      fontSize: 22,
                      fontWeight: 600,
                      marginTop: 32,
                      marginBottom: 10,
                    }}
                  >
                    {line.slice(3)}
                  </h2>
                );
              if (line.startsWith('### '))
                return (
                  <h3
                    key={i}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-ink)',
                      fontSize: 18,
                      fontWeight: 600,
                      marginTop: 24,
                      marginBottom: 8,
                    }}
                  >
                    {line.slice(4)}
                  </h3>
                );

              if (line.trim() === '---')
                return (
                  <hr
                    key={i}
                    style={{
                      border: 'none',
                      borderTop: '1px solid var(--color-border)',
                      margin: '32px 0',
                    }}
                  />
                );

              if (line.startsWith('- ') || line.startsWith('* '))
                return (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span
                      style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }}
                    >
                      •
                    </span>
                    <span style={{ color: '#d4d4d8', fontSize: 16, lineHeight: 1.75 }}>
                      {line.slice(2).replace(/\*\*(.+?)\*\*/g, (_, t) => t)}
                    </span>
                  </div>
                );

              if (line.startsWith('> '))
                return (
                  <blockquote
                    key={i}
                    style={{
                      borderLeft: '3px solid var(--color-accent)',
                      paddingLeft: 16,
                      margin: '24px 0',
                      fontStyle: 'italic',
                      color: 'var(--color-muted)',
                    }}
                  >
                    {line.slice(2)}
                  </blockquote>
                );

              if (line.startsWith('**') && line.endsWith('**'))
                return (
                  <p
                    key={i}
                    style={{
                      fontWeight: 700,
                      color: 'var(--color-ink)',
                      marginBottom: 8,
                      fontSize: 16,
                    }}
                  >
                    {line.slice(2, -2)}
                  </p>
                );

              if (!line.trim()) return <div key={i} style={{ height: 12 }} />;

              return (
                <p
                  key={i}
                  style={{ color: '#d4d4d8', fontSize: 16, lineHeight: 1.8, marginBottom: 10 }}
                >
                  {line.replace(/\*\*(.+?)\*\*/g, (_, t) => t)}
                </p>
              );
            })}
          </article>
        )}

        {/* ── AI badge ─────────────────────────────────────── */}
        <div
          className="mt-16 mb-8 rounded-xl p-5 flex items-center gap-4"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-black"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            AI
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--color-ink)' }}>
              KI-generierter Inhalt
            </p>
            <p className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
              Erstellt mit dem CMCx Content Orchestration Tool · GPT-4o
            </p>
          </div>
        </div>

        {/* ── Back button ───────────────────────────────────── */}
        <div className="mt-4 mb-20">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-semibold no-underline px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            ← Zurück zur Übersicht
          </a>
        </div>
      </div>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <ArticleSidebar posts={allPosts} currentId={post.id} />

      </div>
    </div>
  );
}
