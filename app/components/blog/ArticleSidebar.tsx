import Image from 'next/image';
import type { Campaign } from '../../../lib/supabase';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function readingTime(text: string | null) {
  if (!text) return '1 Min.';
  return `${Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))} Min.`;
}

interface Props {
  posts: Campaign[];
  currentId: string;
}

export function ArticleSidebar({ posts, currentId }: Props) {
  const others = posts.filter((p) => p.id !== currentId);

  if (others.length === 0) return null;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--color-subtle)' }}
          >
            Weitere Artikel
          </span>
          <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
        </div>

        {/* Article list */}
        <div className="flex flex-col gap-3">
          {others.map((post) => (
            <a
              key={post.id}
              href={`/artikel/${post.id}`}
              className="group flex gap-3 no-underline rounded-xl p-3 transition-colors"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              {/* Thumbnail */}
              {post.image_url ? (
                <div
                  className="relative flex-shrink-0 rounded-lg overflow-hidden"
                  style={{ width: 64, height: 64 }}
                >
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="flex-shrink-0 rounded-lg flex items-center justify-center"
                  style={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(99,102,241,0.08))',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" opacity={0.4}>
                    <rect x="2" y="3" width="14" height="1.8" rx="0.9" fill="#f97316" />
                    <rect x="2" y="7" width="10" height="1.5" rx="0.75" fill="#f97316" />
                    <rect x="2" y="10.5" width="12" height="1.5" rx="0.75" fill="#f97316" />
                    <rect x="2" y="14" width="8" height="1.5" rx="0.75" fill="#f97316" />
                  </svg>
                </div>
              )}

              {/* Text */}
              <div className="flex flex-col gap-1 min-w-0">
                <p
                  className="text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
                >
                  {post.title}
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <time className="text-[11px]" style={{ color: 'var(--color-subtle)' }}>
                    {formatDate(post.created_at)}
                  </time>
                  <span style={{ color: 'var(--color-subtle)', fontSize: 10 }}>·</span>
                  <span className="text-[11px]" style={{ color: 'var(--color-subtle)' }}>
                    {readingTime(post.blog)}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase ml-auto px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-subtle)' }}
                  >
                    {post.language === 'de' ? 'DE' : 'EN'}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
