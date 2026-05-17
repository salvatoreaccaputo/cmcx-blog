import type { ReactNode } from 'react';

/* ── Inline bold renderer ───────────────────────────────────── */
function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} style={{ color: 'var(--color-ink)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      : part,
  );
}

/* ── Block types ────────────────────────────────────────────── */
type Block =
  | { type: 'h1' | 'h2' | 'h3'; text: string }
  | { type: 'hr' }
  | { type: 'li'; text: string }
  | { type: 'blockquote'; text: string }
  | { type: 'p'; text: string }
  | { type: 'blank' }
  | { type: 'faq'; items: { question: string; answer: string[] }[] };

/* ── Parser ─────────────────────────────────────────────────── */
function parseBlocks(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* FAQ section */
    if (/^## (FAQ|Häufig|Fragen)/i.test(line)) {
      i++;
      const items: { question: string; answer: string[] }[] = [];
      let currentQ: string | null = null;
      let currentA: string[] = [];

      while (i < lines.length) {
        const l = lines[i];
        /* next top-level heading ends FAQ */
        if (l.startsWith('## ') && !/^## (FAQ|Häufig|Fragen)/i.test(l)) {
          break;
        }
        if (l.startsWith('### ')) {
          if (currentQ !== null) items.push({ question: currentQ, answer: currentA });
          currentQ = l.slice(4).trim();
          currentA = [];
        } else if (currentQ !== null && l.trim()) {
          currentA.push(l.trim());
        }
        i++;
      }
      if (currentQ !== null) items.push({ question: currentQ, answer: currentA });
      if (items.length > 0) blocks.push({ type: 'faq', items });
      continue;
    }

    if (line.startsWith('# '))   { blocks.push({ type: 'h1', text: line.slice(2).trim() }); i++; continue; }
    if (line.startsWith('## '))  { blocks.push({ type: 'h2', text: line.slice(3).trim() }); i++; continue; }
    if (line.startsWith('### ')) { blocks.push({ type: 'h3', text: line.slice(4).trim() }); i++; continue; }
    if (line.trim() === '---')   { blocks.push({ type: 'hr' }); i++; continue; }
    if (line.startsWith('- ') || line.startsWith('* ')) { blocks.push({ type: 'li', text: line.slice(2) }); i++; continue; }
    if (line.startsWith('> '))   { blocks.push({ type: 'blockquote', text: line.slice(2) }); i++; continue; }
    if (!line.trim())            { blocks.push({ type: 'blank' }); i++; continue; }
    blocks.push({ type: 'p', text: line });
    i++;
  }

  return blocks;
}

/* ── Render ─────────────────────────────────────────────────── */
export function BlogContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <article className="prose prose-lg max-w-none" style={{ fontFamily: 'var(--font-serif)' }}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h1':
            return <h1 key={i} style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', fontSize: 28, fontWeight: 700, marginTop: 40, marginBottom: 12 }}>{block.text}</h1>;
          case 'h2':
            return <h2 key={i} style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', fontSize: 22, fontWeight: 600, marginTop: 32, marginBottom: 10 }}>{block.text}</h2>;
          case 'h3':
            return <h3 key={i} style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', fontSize: 18, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>{block.text}</h3>;
          case 'hr':
            return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '32px 0' }} />;
          case 'li':
            return (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }}>•</span>
                <span style={{ color: '#d4d4d8', fontSize: 16, lineHeight: 1.75 }}>{renderInline(block.text)}</span>
              </div>
            );
          case 'blockquote':
            return (
              <blockquote key={i} style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: 16, margin: '24px 0', fontStyle: 'italic', color: 'var(--color-muted)' }}>
                {block.text}
              </blockquote>
            );
          case 'blank':
            return <div key={i} style={{ height: 12 }} />;
          case 'p':
            return (
              <p key={i} style={{ color: '#d4d4d8', fontSize: 16, lineHeight: 1.8, marginBottom: 10 }}>
                {renderInline(block.text)}
              </p>
            );

          case 'faq':
            return (
              <section
                key={i}
                style={{
                  margin: '40px 0',
                  borderRadius: 16,
                  border: '1px solid rgba(249,115,22,0.25)',
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(99,102,241,0.04) 100%)',
                  overflow: 'hidden',
                }}
              >
                {/* FAQ header */}
                <div style={{
                  padding: '16px 24px 14px',
                  borderBottom: '1px solid rgba(249,115,22,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--color-accent)', fontFamily: 'var(--font-sans)',
                  }}>
                    FAQ
                  </span>
                  <span style={{ color: 'rgba(249,115,22,0.3)', fontSize: 12 }}>·</span>
                  <span style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>
                    {block.items.length} {block.items.length === 1 ? 'Frage' : 'Fragen'}
                  </span>
                </div>

                {/* FAQ items */}
                {block.items.map((item, j) => (
                  <details
                    key={j}
                    style={{
                      borderBottom: j < block.items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}
                  >
                    <summary style={{
                      padding: '16px 24px',
                      cursor: 'pointer',
                      listStyle: 'none',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 12,
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 600,
                      fontSize: 15,
                      color: 'var(--color-ink)',
                      userSelect: 'none',
                    }}>
                      <span style={{ flex: 1 }}>{item.question}</span>
                      {/* Chevron icon */}
                      <svg
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                        style={{ flexShrink: 0, marginTop: 2, color: 'var(--color-accent)', transition: 'transform 0.2s' }}
                        className="faq-chevron"
                      >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>
                    <div style={{ padding: '0 24px 18px 24px' }}>
                      {item.answer.map((line, k) => (
                        <p key={k} style={{ fontSize: 14, lineHeight: 1.75, color: '#a1a1aa', marginBottom: k < item.answer.length - 1 ? 8 : 0, fontFamily: 'var(--font-sans)' }}>
                          {renderInline(line)}
                        </p>
                      ))}
                    </div>
                  </details>
                ))}
              </section>
            );
        }
      })}
    </article>
  );
}
