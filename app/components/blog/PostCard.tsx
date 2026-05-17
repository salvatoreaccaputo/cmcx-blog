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
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Thumbnail */}
        {post.image_url ? (
          <div className="relative flex-shrink-0" style={{ height: 158 }}>
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.22)' }}
            />
          </div>
        ) : (
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              height: 96,
              background:
                'linear-gradient(135deg, rgba(249,115,22,0.07), rgba(99,102,241,0.07))',
            }}
          >
            {/* Abstract document icon */}
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" opacity={0.35}>
              <rect x="3" y="4" width="20" height="2.5" rx="1.25" fill="#f97316" />
              <rect x="3" y="10" width="14" height="2" rx="1" fill="#f97316" />
              <rect x="3" y="15" width="17" height="2" rx="1" fill="#f97316" />
              <rect x="3" y="20" width="11" height="2" rx="1" fill="#f97316" />
            </svg>
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Top row: tone tag + language chip */}
          <div className="flex items-center justify-between gap-2">
            {post.tone && <span className="tag truncate max-w-[120px]">{post.tone}</span>}
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--color-muted)',
              }}
            >
              {post.language === 'de' ? 'DE' : 'EN'}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-[15px] font-semibold leading-snug group-hover:text-orange-400 transition-colors"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p
            className="text-[12px] leading-relaxed line-clamp-3 flex-1"
            style={{ color: 'var(--color-muted)' }}
          >
            {excerpt(post.blog)}
          </p>

          {/* Footer */}
          <div
            className="flex items-center justify-between pt-3 mt-auto"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <time className="text-[11px]" style={{ color: 'var(--color-subtle)' }}>
              {formatDate(post.created_at)}
            </time>
            <span className="text-[11px]" style={{ color: 'var(--color-subtle)' }}>
              {readingTime(post.blog)} Lesezeit
            </span>
          </div>
        </div>
      </article>
    </a>
  );
}
