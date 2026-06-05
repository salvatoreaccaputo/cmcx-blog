import type { Metadata } from 'next';
import { Inter, Manrope, JetBrains_Mono } from 'next/font/google';
import Image from 'next/image';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'CMCx Blog', template: '%s · CMCx Blog' },
  description: 'AI-generierte Inhalte — modern aufbereitet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* ── Header ───────────────────────────────────────────── */}
        <header
          className="fixed top-0 z-50 w-full"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div
            className="flex justify-between items-center h-20 mx-auto px-6"
            style={{ maxWidth: 1200 }}
          >
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 no-underline">
              <Image
                src="/ryze-horizontal.png"
                alt="RYZE Digital"
                width={180}
                height={22}
                style={{ objectFit: 'contain', filter: 'brightness(0)' }}
                priority
              />
              <div className="ai-dot" />
            </a>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-10">
              <a
                href="/"
                className="text-[15px] font-semibold no-underline transition-colors"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-primary)',
                  borderBottom: '2px solid var(--color-primary)',
                  paddingBottom: 4,
                }}
              >
                Blog&apos;n&apos;Roll
              </a>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-semibold px-4 py-2 rounded-xl no-underline transition-opacity hover:opacity-80"
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                }}
              >
                ← Tool
              </a>
            </div>
          </div>
        </header>

        {/* ── Content ─────────────────────────────────────────── */}
        <main style={{ paddingTop: 80 }}>{children}</main>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
          <div
            className="py-8 px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ maxWidth: 1200 }}
          >
            <div className="flex flex-col gap-1 items-center md:items-start">
              <Image
                src="/ryze-horizontal.png"
                alt="RYZE Digital"
                width={120}
                height={15}
                style={{ objectFit: 'contain', filter: 'brightness(0)', opacity: 0.6 }}
              />
              <p className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
                © {new Date().getFullYear()} · KI-generierte Inhalte.
              </p>
            </div>
            <nav className="flex flex-wrap justify-center gap-6">
              {['Impressum', 'Datenschutz', 'Kontakt'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[13px] no-underline hover:underline transition-colors"
                  style={{ color: 'var(--color-muted)', textDecorationColor: 'var(--color-primary)' }}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
