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
        {/* ── Header ───────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50 border-b"
          style={{ borderColor: 'var(--color-border)', background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(10px)' }}
        >
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 no-underline">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                style={{ background: 'linear-gradient(135deg, #1a56db, #6366f1)' }}
              >
                B
              </div>
              <span className="font-semibold text-[15px]" style={{ color: 'var(--color-ink)' }}>
                CMCx <span className="font-normal" style={{ color: 'var(--color-muted)' }}>Blog</span>
              </span>
            </a>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-[13px] font-medium no-underline" style={{ color: 'var(--color-muted)' }}>
                Alle Artikel
              </a>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-semibold px-3 py-1.5 rounded-lg no-underline"
                style={{ background: 'var(--color-ink)', color: '#fff' }}
              >
                ← Tool
              </a>
            </nav>
          </div>
        </header>

        {/* ── Main content ─────────────────────────────────────── */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="border-t mt-20" style={{ borderColor: 'var(--color-border)' }}>
          <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px]" style={{ color: 'var(--color-muted)' }}>
              Generiert mit CMCx · Content Orchestration Lab
            </p>
            <p className="text-[12px]" style={{ color: 'var(--color-border)' }}>
              {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
