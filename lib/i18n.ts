export type ContentLanguage = 'de' | 'en' | 'it' | 'fr';

export const LANGUAGE_META: Record<ContentLanguage, { label: string; code: string; locale: string }> = {
  de: { label: 'Deutsch', code: 'DE', locale: 'de-DE' },
  en: { label: 'English', code: 'EN', locale: 'en-GB' },
  it: { label: 'Italiano', code: 'IT', locale: 'it-IT' },
  fr: { label: 'Français', code: 'FR', locale: 'fr-FR' },
};

export function contentLanguage(value: string): ContentLanguage {
  return value === 'de' || value === 'it' || value === 'fr' ? value : 'en';
}

export const BLOG_COPY: Record<ContentLanguage, {
  allArticles: string;
  moreArticles: string;
  readMore: string;
  minutesRead: string;
  expertIntro: string;
  expertFor: string;
  inquire: string;
  generatedContent: string;
  generatedWith: string;
  backOverview: string;
  aiGenerated: string;
  quote: string;
  researchQuote: string;
  question: string;
  questions: string;
}> = {
  de: {
    allArticles: 'Alle Artikel',
    moreArticles: 'Weitere Artikel',
    readMore: 'Weiterlesen',
    minutesRead: 'Min. Lesezeit',
    expertIntro: 'Sprechen Sie mit unserem Experten',
    expertFor: 'Experte für',
    inquire: 'Jetzt anfragen',
    generatedContent: 'KI-generierter Inhalt',
    generatedWith: 'Erstellt mit dem CMCx Content Orchestration Tool',
    backOverview: 'Zurück zur Übersicht',
    aiGenerated: 'KI-GENERIERT',
    quote: 'Zitat',
    researchQuote: 'Zitat aus Recherche',
    question: 'Frage',
    questions: 'Fragen',
  },
  en: {
    allArticles: 'All articles',
    moreArticles: 'More articles',
    readMore: 'Read more',
    minutesRead: 'min read',
    expertIntro: 'Talk to our expert',
    expertFor: 'Expert in',
    inquire: 'Get in touch',
    generatedContent: 'AI-generated content',
    generatedWith: 'Created with the CMCx Content Orchestration Tool',
    backOverview: 'Back to overview',
    aiGenerated: 'AI-GENERATED',
    quote: 'Quote',
    researchQuote: 'Quote from research',
    question: 'question',
    questions: 'questions',
  },
  it: {
    allArticles: 'Tutti gli articoli',
    moreArticles: 'Altri articoli',
    readMore: 'Continua a leggere',
    minutesRead: 'min di lettura',
    expertIntro: 'Parli con il nostro esperto',
    expertFor: 'Esperto di',
    inquire: 'Richiedi informazioni',
    generatedContent: 'Contenuto generato con IA',
    generatedWith: 'Creato con CMCx Content Orchestration Tool',
    backOverview: 'Torna alla panoramica',
    aiGenerated: 'GENERATO CON IA',
    quote: 'Citazione',
    researchQuote: 'Citazione dalla ricerca',
    question: 'domanda',
    questions: 'domande',
  },
  fr: {
    allArticles: 'Tous les articles',
    moreArticles: 'Autres articles',
    readMore: 'Lire la suite',
    minutesRead: 'min de lecture',
    expertIntro: 'Échangez avec notre expert',
    expertFor: 'Expert en',
    inquire: 'Nous contacter',
    generatedContent: 'Contenu généré par IA',
    generatedWith: 'Créé avec CMCx Content Orchestration Tool',
    backOverview: 'Retour à la vue d’ensemble',
    aiGenerated: 'GÉNÉRÉ PAR IA',
    quote: 'Citation',
    researchQuote: 'Citation issue de la recherche',
    question: 'question',
    questions: 'questions',
  },
};

export function formatLocalizedDate(
  iso: string,
  language: string,
  month: 'short' | 'long' = 'long',
): string {
  const locale = LANGUAGE_META[contentLanguage(language)].locale;
  return new Date(iso).toLocaleDateString(locale, {
    day: '2-digit',
    month,
    year: 'numeric',
  });
}

export function readingMinutes(text: string | null, wordsPerMinute = 200): number {
  if (!text?.trim()) return 1;
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / wordsPerMinute));
}
