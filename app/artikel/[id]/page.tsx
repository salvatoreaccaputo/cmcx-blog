import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '../../../lib/supabase';
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
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
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

/* ── Markdown → basic HTML renderer (no extra deps) ─────────── */
function renderMarkdown(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|u|b|l|h])/gm, '')
    .trim();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function readingTime(text: string | null) {
  if (!text) return '1 Min.';
  return `${Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))} Min.`;
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function ArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) notFound();

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      {post.image_url && (
        <div className="relative w-full" style={{ height: 420 }}>
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(250,250,248,1) 0%, rgba(250,250,248,0.3) 50%, transparent 100%)' }} />
        </div>
      )}

      {/* ── Article container ───────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6" style={{ marginTop: post.image_url ? -80 : 60 }}>

        {/* Back link */}
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium no-underline mb-8 relative z-10"
          style={{ color: 'var(--color-muted)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M9 6H3M5.5 3.5L3 6l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Alle Artikel
        </a>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5 relative z-10">
          <span
            className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: '#eff6ff', color: 'var(--color-accent)' }}
          >
            {post.tone}
          </span>
          <time className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
            {formatDate(post.created_at)}
          </time>
          <span className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
            · {readingTime(post.blog)} Lesezeit
          </span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full"
            style={{ background: '#f3f4f6', color: '#6b7280' }}
          >
            {post.language === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-[36px] font-bold leading-tight mb-6 relative z-10"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
        >
          {post.title}
        </h1>

        {/* Idea teaser */}
        {post.idea && (
          <div
            className="rounded-xl p-5 mb-10 border-l-4 relative z-10"
            style={{ background: '#f0f9ff', borderColor: 'var(--color-accent)' }}
          >
            <p className="text-[14px] font-medium italic" style={{ color: '#1e40af' }}>
              „{post.idea}"
            </p>
          </div>
        )}

        {/* ── Blog content ──────────────────────────────── */}
        {post.blog && (
          <article
            className="prose prose-lg max-w-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {post.blog.split('\n').map((line, i) => {
              /* Headings */
              if (line.startsWith('# '))  return <h1  key={i} style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', fontSize: 28, fontWeight: 700, marginTop: 40, marginBottom: 12 }}>{line.slice(2)}</h1>;
              if (line.startsWith('## ')) return <h2  key={i} style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', fontSize: 22, fontWeight: 600, marginTop: 32, marginBottom: 10 }}>{line.slice(3)}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', fontSize: 18, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>{line.slice(4)}</h3>;

              /* Horizontal rule */
              if (line.trim() === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '32px 0' }} />;

              /* List item */
              if (line.startsWith('- ') || line.startsWith('* ')) return (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }}>•</span>
                  <span style={{ color: '#374151', fontSize: 16, lineHeight: 1.75 }}>
                    {line.slice(2).replace(/\*\*(.+?)\*\*/g, (_, t) => t)}
                  </span>
                </div>
              );

              /* Blockquote */
              if (line.startsWith('> ')) return (
                <blockquote key={i} style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: 16, margin: '24px 0', fontStyle: 'italic', color: '#4b5563' }}>
                  {line.slice(2)}
                </blockquote>
              );

              /* Bold inline */
              if (line.startsWith('**') && line.endsWith('**')) return (
                <p key={i} style={{ fontWeight: 700, color: 'var(--color-ink)', marginBottom: 8, fontSize: 16 }}>
                  {line.slice(2, -2)}
                </p>
              );

              /* Empty line */
              if (!line.trim()) return <div key={i} style={{ height: 12 }} />;

              /* Regular paragraph */
              return (
                <p key={i} style={{ color: '#374151', fontSize: 16, lineHeight: 1.8, marginBottom: 10 }}>
                  {line.replace(/\*\*(.+?)\*\*/g, (_, t) => t)}
                </p>
              );
            })}
          </article>
        )}

        {/* ── AI badge ─────────────────────────────────── */}
        <div
          className="mt-16 mb-8 rounded-xl p-5 flex items-center gap-4 border"
          style={{ background: '#f9fafb', borderColor: 'var(--color-border)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-black"
            style={{ background: 'linear-gradient(135deg, #1a56db, #6366f1)' }}
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

        {/* ── Back button ───────────────────────────────── */}
        <div className="mt-4 mb-20">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-semibold no-underline px-4 py-2 rounded-lg"
            style={{ background: 'var(--color-ink)', color: '#fff' }}
          >
            ← Zurück zur Übersicht
          </a>
        </div>
      </div>
    </div>
  );
}
