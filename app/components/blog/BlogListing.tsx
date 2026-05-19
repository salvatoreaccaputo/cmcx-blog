'use client';

import { useState, useMemo } from 'react';
import type { Campaign } from '../../../lib/supabase';
import { HeroCard } from './HeroCard';
import { PostCard } from './PostCard';
import { LanguageFilter } from './LanguageFilter';

export function BlogListing({ posts }: { posts: Campaign[] }) {
  const [selectedLang, setSelectedLang] = useState('all');

  const languages = useMemo(
    () => [...new Set(posts.map((p) => p.language).filter(Boolean))].sort(),
    [posts],
  );

  const filtered = useMemo(
    () => (selectedLang === 'all' ? posts : posts.filter((p) => p.language === selectedLang)),
    [posts, selectedLang],
  );

  const [hero, ...rest] = filtered;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ── Main content ──────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-8">
        {/* Filter bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="label-caps" style={{ color: 'var(--color-subtle)' }}>
            {filtered.length} {filtered.length === 1 ? 'Artikel' : 'Artikel'}
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

        {/* Empty state */}
        {filtered.length === 0 && (
          <div
            className="rounded-xl p-16 text-center"
            style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
          >
            <p className="text-[16px] font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>
              Keine Artikel gefunden
            </p>
            <p className="text-[14px] mb-5" style={{ color: 'var(--color-muted)' }}>
              {selectedLang !== 'all'
                ? 'Für diese Sprache gibt es noch keine Artikel.'
                : 'Noch keine Artikel veröffentlicht.'}
            </p>
            {selectedLang !== 'all' && (
              <button
                onClick={() => setSelectedLang('all')}
                className="text-[13px] font-semibold px-4 py-2 rounded-xl cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}
              >
                Alle anzeigen
              </button>
            )}
          </div>
        )}

        {/* Hero (featured article) */}
        {hero && <HeroCard post={hero} />}

        {/* Article grid */}
        {rest.length > 0 && (
          <>
            <div className="flex items-center gap-3">
              <span className="label-caps" style={{ color: 'var(--color-subtle)' }}>
                Weitere Artikel
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Right sidebar ─────────────────────────────────────── */}
      <aside className="w-full lg:w-72 shrink-0">
        <nav
          className="sticky top-24 rounded-xl p-5 flex flex-col gap-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          {/* Sidebar header */}
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 16, marginBottom: 4 }}>
            <h2
              className="font-bold text-[17px]"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
            >
              Navigation
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
              KI-Insights & News
            </p>
          </div>

          {/* Nav links */}
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="/"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl no-underline font-semibold text-[14px] transition-colors"
                style={{
                  background: 'rgba(0,52,65,0.08)',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="1.8" rx="0.9" fill="currentColor" />
                  <rect x="2" y="7" width="9" height="1.5" rx="0.75" fill="currentColor" />
                  <rect x="2" y="11" width="10" height="1.5" rx="0.75" fill="currentColor" />
                </svg>
                Alle Artikel
              </a>
            </li>
          </ul>

          {/* Promo box */}
          <div
            className="mt-2 p-4 rounded-xl text-center"
            style={{ background: 'var(--color-tertiary-container)' }}
          >
            <p className="label-caps mb-2" style={{ color: 'var(--color-teal-dim)', opacity: 0.9 }}>
              Automatisch generiert
            </p>
            <h4
              className="font-bold text-[16px] mb-3"
              style={{ fontFamily: 'var(--font-display)', color: '#fff' }}
            >
              CMCx Tool
            </h4>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2 rounded-lg text-[13px] font-bold no-underline transition-opacity hover:opacity-80"
              style={{ background: 'var(--color-teal)', color: 'var(--color-tertiary)' }}
            >
              Tool öffnen →
            </a>
          </div>
        </nav>
      </aside>
    </div>
  );
}
