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
    <a href={`/artikel/${post.id}`} className="group block no-underline h-full">
      <article
        className="card-hover relative rounded-2xl overflow-hidden h-full flex flex-col"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          minHeight: 420,
        }}
      >
        {/* Background */}
        {post.image_url ? (
          <div className="absolute inset-0">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay — dark at bottom for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.65) 45%, rgba(9,9,11,0.15) 100%)',
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ background: 'var(--color-surface)' }}>
            {/* Abstract ambient light — decorative */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 20% 60%, rgba(249,115,22,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.14) 0%, transparent 50%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(255,255,255,0.5) 30px, rgba(255,255,255,0.5) 31px)',
              }}
            />
          </div>
        )}

        {/* Content layer */}
        <div className="relative flex flex-col h-full p-7 pt-6">
          {/* Top row: badges */}
          <div className="flex items-start justify-between gap-2">
            <span className="tag">Neuester Artikel</span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              {post.language === 'de' ? 'DE' : 'EN'}
            </span>
          </div>

          {/* Spacer pushes text to bottom */}
          <div className="flex-1" />

          {/* Bottom: editorial text block */}
          <div>
            {/* Tone chip */}
            {post.tone && (
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-accent)' }}
              >
                {post.tone}
              </p>
            )}

            {/* Title */}
            <h2
              className="text-[28px] sm:text-[32px] font-bold leading-tight mb-3 group-hover:text-orange-400 transition-colors"
              style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}
            >
              {post.title}
            </h2>

            {/* Excerpt */}
            <p
              className="text-[14px] leading-relaxed line-clamp-2 mb-5"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {excerpt(post.blog)}
            </p>

            {/* Footer row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <time
                  className="text-[12px]"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {formatDate(post.created_at)}
                </time>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                <span
                  className="text-[12px]"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {readingTime(post.blog)} Lesezeit
                </span>
              </div>
              <span
                className="flex items-center gap-1 text-[13px] font-semibold"
                style={{ color: 'var(--color-accent)' }}
              >
                Weiterlesen
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7h8M7.5 4l3.5 3-3.5 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}
