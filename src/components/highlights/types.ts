export interface HighlightCtaConfig {
  label: string;
  href: string;
}

export interface AdventHighlightSlide {
  id: string;
  layout: "advent";
  ariaLabel: string;
  backgroundClass: string;
  eyebrow: string;
  titleLines: [string, string];
  description: string;
  complementaryText: string;
  cta: HighlightCtaConfig;
  images: {
    mobileSrc: string;
    desktopSrc: string;
    alt: string;
    corners: {
      topLeft: string;
      topRight: string;
      bottomLeft: string;
      bottomRight: string;
    };
  };
}

export interface MarianFeastDateItem {
  label: string;
  dates: string;
}

export interface MarianFeastHighlightSlide {
  id: string;
  layout: "marian-feast";
  ariaLabel: string;
  backgroundClass: string;
  eyebrow: string;
  title: string;
  description: string;
  mobileDescription?: string;
  scheduleDates: MarianFeastDateItem[];
  invocation: string;
  cta: HighlightCtaConfig;
  image: {
    src: string;
    alt: string;
  };
}

export type HighlightSlideConfig =
  | AdventHighlightSlide
  | MarianFeastHighlightSlide;
