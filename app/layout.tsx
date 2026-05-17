import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const lora  = Lora({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'CMCx Blog', template: '%s · CMCx Blog' },
  description: 'AI-generierte Inhalte — modern aufbereitet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${lora.variable}`}>
      <body>
        {/* ── Header ─────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50"
          style={{
            background: 'rgba(9,9,11,0.85)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 no-underline group">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-black"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              >
                B
              </div>
              <span className="font-semibold text-[15px]" style={{ color: 'var(--color-ink)' }}>
                CMCx{' '}
                <span className="font-normal" style={{ color: 'var(--color-muted)' }}>
                  Blog
                </span>
              </span>
            </a>

            {/* Nav */}
            <nav className="flex items-center gap-5">
              <a
                href="/"
                className="text-[13px] font-medium no-underline transition-colors"
                style={{ color: 'var(--color-muted)' }}
              >
                Alle Artikel
              </a>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-semibold px-3 py-1.5 rounded-lg no-underline transition-opacity hover:opacity-80"
                style={{ background: 'var(--color-accent)', color: '#fff' }}
              >
                ← Tool
              </a>
            </nav>
          </div>
        </header>

        {/* ── Content ─────────────────────────────────────────────── */}
        <main className="min-h-screen">{children}</main>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid var(--color-border)', marginTop: 80 }}>
          <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px]" style={{ color: 'var(--color-muted)' }}>
              Generiert mit CMCx · Content Orchestration Lab
            </p>
            <p className="text-[12px]" style={{ color: 'var(--color-subtle)' }}>
              {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
