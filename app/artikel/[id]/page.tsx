import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '../../../lib/supabase';
import { ArticleSidebar } from '../../components/blog/ArticleSidebar';
import { BlogContent } from '../../components/blog/BlogContent';
import { ExpertCTA } from '../../components/blog/ExpertCTA';
import type { Metadata } from 'next';
import { BLOG_COPY, contentLanguage, formatLocalizedDate, LANGUAGE_META, readingMinutes } from '../../../lib/i18n';
import { AiImageBadge } from '../../components/ui/AiImageBadge';

export const revalidate = 10;

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
  const language = contentLanguage(post.language);
  const copy = BLOG_COPY[language];
  const languageMeta = LANGUAGE_META[language];

  return (
    <div lang={language}>
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
          <AiImageBadge label={copy.aiGenerated} />
          {/* Gradient fades into light background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
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
          {copy.allArticles}
        </a>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5 relative z-10">
          {post.tone && (
            <span className="tag">{post.tone}</span>
          )}
          <time className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
            {formatLocalizedDate(post.created_at, post.language)}
          </time>
          <span style={{ color: 'var(--color-subtle)' }}>·</span>
          <span className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
            {readingMinutes(post.blog)} {copy.minutesRead}
          </span>
          <span
            className="label-caps px-2.5 py-0.5 rounded-full"
            style={{
              background: 'rgba(0,52,65,0.08)',
              color: 'var(--color-secondary)',
            }}
          >
            {languageMeta.code}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-[34px] sm:text-[40px] font-bold leading-tight mb-6 relative z-10"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}
        >
          {post.title}
        </h1>

        {/* Divider */}
        <hr
          className="mb-10 relative z-10"
          style={{ borderColor: 'var(--color-border)', borderTopWidth: 1 }}
        />

        {/* ── Blog content ──────────────────────────────────── */}
        {post.blog && <BlogContent content={post.blog} language={post.language} />}

        {/* ── Expert CTA (always shown, falls back to default expert) ── */}
        <ExpertCTA
          expertName={post.expert_name}
          expertImageUrl={post.expert_image_url}
          topic={post.title}
          language={post.language}
        />

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
            style={{ background: 'var(--color-primary)' }}
          >
            AI
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--color-ink)' }}>
              {copy.generatedContent}
            </p>
            <p className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
              {copy.generatedWith} · GPT-4o
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
            ← {copy.backOverview}
          </a>
        </div>
      </div>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <ArticleSidebar posts={allPosts} currentId={post.id} language={post.language} />

      </div>
    </div>
  );
}
