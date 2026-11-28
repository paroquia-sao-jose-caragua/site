import type { HighlightSlideConfig } from "./types";

const LIGHT_PARISH_BACKGROUND = "bg-[#fbf6ee]";

export const HIGHLIGHTS_SLIDES: HighlightSlideConfig[] = [
  {
    id: "tempo-do-advento",
    layout: "advent",
    ariaLabel: "Destaque: Tempo do Advento",
    backgroundClass: LIGHT_PARISH_BACKGROUND,
    eyebrow: "TEMPO DO ADVENTO",
    titleLines: ["Prepare o seu coração.", "Jesus está chegando!"],
    description:
      "O Advento é um tempo de espera e esperança, um convite para preparar o coração e renovar nossa fé na chegada de Jesus.",
    mobileDescription:
      "Um tempo de espera e esperança para preparar o coração para Jesus.",
    complementaryText: "Viva este tempo de fé e preparação conosco.",
    cta: {
      label: "Conheça o Advento",
      href: "/advento",
    },
    images: {
      mobileSrc: "/destaques/advento/coroa-do-advento.png",
      desktopSrc: "/destaques/advento/coroa-do-advento-desktop.png",
      alt: "Coroa do Advento com velas acesas",
      corners: {
        topLeft: "/destaques/advento/moldura-topo-esquerda.png",
        topRight: "/destaques/advento/moldura-topo-direita.png",
        bottomLeft: "/destaques/advento/moldura-base-esquerda.png",
        bottomRight: "/destaques/advento/moldura-base-direita.png",
      },
    },
  },
  {
    id: "festa-nossa-senhora-das-gracas",
    layout: "marian-feast",
    ariaLabel: "Destaque: Tríduo e Festa de Nossa Senhora das Graças",
    backgroundClass: LIGHT_PARISH_BACKGROUND,
    eyebrow: "FESTA EM HONRA À",
    title: "Nossa Senhora das Graças",
    description:
      "Copadroeira da Matriz São José, Nossa Senhora das Graças ocupa um lugar especial na fé e na devoção de nossa comunidade. Celebremos juntos este tempo de oração, gratidão e amor à Mãe da Graça.",
    mobileDescription:
      "Celebremos juntos a copadroeira da Matriz São José em oração e gratidão.",
    scheduleDates: [
      { label: "Tríduo", dates: "24 a 26 de novembro" },
      { label: "Festa Social", dates: "27 a 29 de novembro" },
    ],
    invocation: "Maria, Mãe da Divina Graça, rogai por nós!",
    cta: {
      label: "Confira a Programação",
      href: "/agenda",
    },
    image: {
      src: "/destaques/nossa-senhora-das-gracas/nossa-senhora-das-gracas-retrato.png",
      alt: "Imagem de Nossa Senhora das Graças com coroa de doze estrelas douradas",
    },
  },
];
