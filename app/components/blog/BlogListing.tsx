'use client';

import { useState, useMemo } from 'react';
import type { Campaign } from '../../../lib/supabase';
import { HeroCard } from './HeroCard';
import { PostCard } from './PostCard';
import { LanguageFilter } from './LanguageFilter';

export function BlogListing({ posts }: { posts: Campaign[] }) {
  const [selectedLang, setSelectedLang] = useState('all');

  /* Derive available languages from data */
  const languages = useMemo(
    () => [...new Set(posts.map((p) => p.language).filter(Boolean))].sort(),
    [posts],
  );

  /* Filtered list */
  const filtered = useMemo(
    () => (selectedLang === 'all' ? posts : posts.filter((p) => p.language === selectedLang)),
    [posts, selectedLang],
  );

  const [hero, post2, post3, ...remaining] = filtered;
  const bentoSide = [post2, post3].filter(Boolean) as Campaign[];

  return (
    <div>
      {/* ── Filter bar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <p className="text-[13px]" style={{ color: 'var(--color-subtle)' }}>
          {filtered.length}{' '}
          {filtered.length === 1 ? 'Artikel' : 'Artikel'}
          {selectedLang !== 'all' && (
            <> auf {selectedLang === 'de' ? 'Deutsch' : 'Englisch'}</>
          )}
        </p>
        {languages.length > 1 && (
          <LanguageFilter
            languages={languages}
            selected={selectedLang}
            onChange={setSelectedLang}
          />
        )}
      </div>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div
          className="rounded-2xl p-16 text-center"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--color-accent-dim)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 6h12M4 10h8M4 14h10"
                stroke="#f97316"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2
            className="text-[18px] font-semibold mb-2"
            style={{ color: 'var(--color-ink)' }}
          >
            Keine Artikel gefunden
          </h2>
          <p className="text-[14px] mb-5" style={{ color: 'var(--color-muted)' }}>
            {selectedLang !== 'all'
              ? 'Für diese Sprache gibt es noch keine Artikel.'
              : 'Noch keine Artikel veröffentlicht.'}
          </p>
          {selectedLang !== 'all' && (
            <button
              onClick={() => setSelectedLang('all')}
              className="text-[13px] font-semibold px-4 py-2 rounded-lg cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: 'var(--color-accent)', color: '#fff', border: 'none' }}
            >
              Alle anzeigen
            </button>
          )}
        </div>
      )}

      {/* ── DESKTOP Bento grid (lg+) ─────────────────────────────── */}
      {hero && (
        <div
          className="hidden lg:grid gap-4"
          style={
            bentoSide.length > 0
              ? {
                  gridTemplateColumns: '2fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  minHeight: 480,
                }
              : { gridTemplateColumns: '1fr' }
          }
        >
          {/* Hero — spans 2 rows */}
          <div style={bentoSide.length > 0 ? { gridRow: 'span 2' } : undefined}>
            <HeroCard post={hero} />
          </div>

          {/* Side cards */}
          {bentoSide.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* ── MOBILE / TABLET list (< lg) ─────────────────────────── */}
      {filtered.length > 0 && (
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* ── Remaining posts (desktop only, below bento) ─────────── */}
      {remaining.length > 0 && (
        <>
          <div
            className="hidden lg:flex items-center gap-3 mt-10 mb-5"
          >
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--color-subtle)' }}
            >
              Weitere Artikel
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {remaining.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
