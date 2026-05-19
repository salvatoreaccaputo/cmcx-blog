import Image from 'next/image';
import type { Campaign } from '../../../lib/supabase';

function readingTime(text: string | null) {
  if (!text) return '1 Min.';
  return `${Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))} Min.`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function excerpt(text: string | null, max = 200) {
  if (!text) return '';
  const clean = text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
}

export function HeroCard({ post }: { post: Campaign }) {
  return (
    <a href={`/artikel/${post.id}`} className="group block no-underline">
      <article
        className="card-hover rounded-xl overflow-hidden flex flex-col xl:flex-row"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Image — full-width on mobile, left 60% on xl */}
        <div
          className="xl:w-[60%] overflow-hidden flex-shrink-0"
          style={{ minHeight: 300 }}
        >
          {post.image_url ? (
            <Image
              src={post.image_url}
              alt={post.title}
              width={1200}
              height={800}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ height: '100%', minHeight: 300, display: 'block' }}
              priority
              sizes="(max-width: 1280px) 100vw, 60vw"
            />
          ) : (
            <div
              className="w-full flex items-center justify-center"
              style={{
                minHeight: 300,
                height: '100%',
                background: 'linear-gradient(135deg, var(--color-accent-glow), var(--color-surface-2))',
              }}
            >
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" opacity={0.25}>
                <rect x="8" y="12" width="40" height="5" rx="2.5" fill="var(--color-primary)" />
                <rect x="8" y="22" width="28" height="4" rx="2" fill="var(--color-primary)" />
                <rect x="8" y="30" width="34" height="4" rx="2" fill="var(--color-primary)" />
                <rect x="8" y="38" width="22" height="4" rx="2" fill="var(--color-primary)" />
              </svg>
            </div>
          )}
        </div>

        {/* Text — right 40% on xl */}
        <div className="xl:w-[40%] p-7 flex flex-col justify-center gap-4">
          {/* Label row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="label-caps" style={{ color: 'var(--color-primary)' }}>
              {post.tone ?? 'Artikel'}
            </span>
            <span className="label-caps" style={{ color: 'var(--color-subtle)' }}>
              · {formatDate(post.created_at)}
            </span>
          </div>

          {/* Title */}
          <h1
            className="leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 800,
              color: 'var(--color-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          <p
            className="text-[16px] leading-relaxed line-clamp-3"
            style={{ color: 'var(--color-muted)' }}
          >
            {excerpt(post.blog)}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-between mt-2">
            <span
              className="inline-flex items-center gap-1.5 text-[14px] font-bold transition-opacity group-hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}
            >
              Weiterlesen
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M3 8h10M9 5l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="label-caps" style={{ color: 'var(--color-subtle)' }}>
              {readingTime(post.blog)} Lesezeit
            </span>
          </div>
        </div>
      </article>
    </a>
  );
}
