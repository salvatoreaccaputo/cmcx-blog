'use client';

const LANG_LABELS: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  it: 'Italiano',
  fr: 'Français',
};

interface Props {
  languages: string[];
  selected: string;
  onChange: (lang: string) => void;
}

export function LanguageFilter({ languages, selected, onChange }: Props) {
  const options = [
    { value: 'all', label: 'Alle' },
    ...languages.map((lang) => ({
      value: lang,
      label: LANG_LABELS[lang] ?? lang.toUpperCase(),
    })),
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Sprache filtern">
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className="text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer"
            style={
              isActive
                ? { background: 'var(--color-primary)', color: '#fff', border: '1px solid transparent' }
                : {
                    background: 'var(--color-surface)',
                    color: 'var(--color-muted)',
                    border: '1px solid var(--color-border)',
                  }
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
