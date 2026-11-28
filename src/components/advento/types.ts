export type AdventWeekId = 1 | 2 | 3 | 4;

export type AdventFamilySuggestionIcon =
  | "prayer"
  | "church"
  | "book"
  | "heart"
  | "home"
  | "users";

export interface AdventCandleSection {
  title: string;
  paragraphs: string[];
  image?: {
    src: string;
    alt: string;
  };
}

export interface AdventGospelSection {
  title: string;
  reference: string;
  quote?: string;
  reflectionParagraphs: string[];
}

export interface AdventSymbolMeaning {
  label: string;
  description: string;
}

export interface AdventSymbolsSection {
  title: string;
  intro: string;
  items: AdventSymbolMeaning[];
  closing: string;
  callout?: {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
  };
}

export interface AdventFamilySuggestion {
  icon: AdventFamilySuggestionIcon;
  text: string;
}

export interface AdventFamilySection {
  title: string;
  intro: string;
  suggestions: AdventFamilySuggestion[];
}

export interface AdventReflectionSection {
  title: string;
  questions: string[];
  prayer: string;
}

export interface AdventMediaSection {
  audioUrl?: string;
  videoUrl?: string;
}

export interface AdventNextWeekCallout {
  targetWeekId: AdventWeekId;
  title: string;
  description: string;
  buttonLabel: string;
}

export interface AdventWeekData {
  id: AdventWeekId;
  numberLabel: string;
  sundayDateIso: string; // YYYY-MM-DD
  displayDate: string; // e.g. "29 de novembro"
  fullDateLabel: string; // e.g. "29 DE NOVEMBRO DE 2026"
  eyebrow: string;
  theme: string;
  sidebarSubtitle: string;
  candleName: string;
  candleColor: "purple" | "rose";
  isPublished: boolean;
  title: string;
  subtitle: string;
  introParagraphs: string[];
  candleSection: AdventCandleSection;
  gospelSection: AdventGospelSection;
  symbolsSection?: AdventSymbolsSection;
  familySection?: AdventFamilySection;
  reflectionSection?: AdventReflectionSection;
  media?: AdventMediaSection;
  nextWeek?: AdventNextWeekCallout;
  previewTopics?: string[];
}
