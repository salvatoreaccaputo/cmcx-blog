import Image from 'next/image';
import type { Campaign } from '../../../lib/supabase';

function readingTime(text: string | null) {
  if (!text) return '1 Min.';
  return `${Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))} Min.`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function excerpt(text: string | null, max = 115) {
  if (!text) return '';
  const clean = text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
}

export function PostCard({ post }: { post: Campaign }) {
  return (
    <a href={`/artikel/${post.id}`} className="group block no-underline h-full">
      <article
        className="card-hover h-full flex flex-col rounded-xl overflow-hidden"
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Thumbnail */}
        {post.image_url ? (
          <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 192 }}>
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              height: 120,
              background: 'linear-gradient(135deg, var(--color-accent-glow), var(--color-surface-2))',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" opacity={0.3}>
              <rect x="3" y="5" width="22" height="3" rx="1.5" fill="var(--color-primary)" />
              <rect x="3" y="11" width="16" height="2.5" rx="1.25" fill="var(--color-primary)" />
              <rect x="3" y="16" width="19" height="2.5" rx="1.25" fill="var(--color-primary)" />
              <rect x="3" y="21" width="12" height="2.5" rx="1.25" fill="var(--color-primary)" />
            </svg>
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Tone label */}
          {post.tone && (
            <span className="label-caps" style={{ color: 'var(--color-secondary)' }}>
              {post.tone}
            </span>
          )}

          {/* Title */}
          <h3
            className="text-[15px] font-semibold leading-snug transition-colors group-hover:opacity-80"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p
            className="text-[13px] leading-relaxed line-clamp-3 flex-1"
            style={{ color: 'var(--color-muted)' }}
          >
            {excerpt(post.blog)}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: '1px solid var(--color-border)' }}>
            <time className="label-caps" style={{ color: 'var(--color-subtle)' }}>
              {formatDate(post.created_at)}
            </time>
            <span className="label-caps" style={{ color: 'var(--color-subtle)' }}>
              {readingTime(post.blog)} Lesezeit
            </span>
          </div>
        </div>
      </article>
    </a>
  );
}
