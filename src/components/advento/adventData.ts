import type { AdventWeekData, AdventWeekId } from "./types";

/**
 * Rota futura para a página de Símbolos do Advento.
 * Enquanto permanecer `null`, o card de chamada para a página de símbolos fica oculto.
 */
export const ADVENT_SYMBOLS_HREF: string | null = null;

function getSaoPauloDateIso(now = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    // fallback
  }
  return now.toISOString().slice(0, 10);
}

/**
 * Seleciona automaticamente a semana vigente com base na data atual (America/Sao_Paulo).
 * Entre dois domingos, mantém selecionada a semana cujo domingo já ocorreu.
 */
export function getInitialAdventWeekId(now = new Date()): AdventWeekId {
  const today = getSaoPauloDateIso(now);

  if (today >= "2026-12-20") return 4;
  if (today >= "2026-12-13") return 3;
  if (today >= "2026-12-06") return 2;
  return 1;
}

export const ADVENT_WEEKS: AdventWeekData[] = [
  {
    id: 1,
    numberLabel: "01",
    sundayDateIso: "2026-11-29",
    displayDate: "29 de novembro",
    fullDateLabel: "29 DE NOVEMBRO DE 2026",
    eyebrow: "1º DOMINGO DO ADVENTO · 29 DE NOVEMBRO DE 2026",
    theme: "Esperança",
    sidebarSubtitle: "Primeiro domingo do Advento.",
    candleName: "Primeira vela — Esperança",
    candleColor: "purple",
    isPublished: true,
    title: "A esperança que nos mantém vigilantes",
    subtitle: "Primeira vela — Esperança",
    introParagraphs: [
      "No dia 29 de novembro de 2026, a Igreja Católica celebra o primeiro domingo do Advento, dando início a um novo Ano Litúrgico, o Ano B.",
      "A palavra Advento vem do latim Adventus, que significa chegada ou vinda. É um tempo de preparação espiritual para celebrarmos o nascimento de Jesus Cristo e renovarmos a esperança em sua segunda vinda.",
      "Durante esse período, somos convidados à oração, à conversão, à vigilância e à prática da caridade.",
    ],
    candleSection: {
      title: "Acendemos a primeira vela: a Esperança",
      paragraphs: [
        "Neste primeiro domingo, acendemos a primeira vela roxa da Coroa do Advento, conhecida como a vela da esperança. Em uma tradição devocional, também é chamada de vela dos profetas.",
        "Ela recorda as promessas de Deus e o anúncio da chegada do Salvador.",
        "Ao acendermos essa primeira vela, iniciamos nossa caminhada de preparação espiritual, renovando nossa confiança nas promessas de Deus.",
        "É um convite para despertar a fé, permanecer vigilantes e preparar nosso coração para acolher Jesus.",
      ],
      image: {
        src: "/destaques/advento/primeira-vela-esperanca.png",
        alt: "Primeira vela roxa acesa na Coroa do Advento, símbolo da esperança",
      },
    },
    gospelSection: {
      title: "O Evangelho deste domingo",
      reference: "Marcos 13,33-37",
      quote:
        "Vigiai! Ficai atentos, porque não sabeis quando chegará o momento.",
      reflectionParagraphs: [
        "O Evangelho nos convida a permanecer vigilantes e preparados para a vinda do Senhor.",
        "A vigilância cristã não significa viver com medo, mas manter o coração atento à presença de Deus, cultivando a fé e colocando o Evangelho em prática em nossas atitudes.",
      ],
    },
    symbolsSection: {
      title: "A Coroa do Advento e seus significados",
      intro:
        "A Coroa do Advento é um dos principais símbolos deste tempo litúrgico. Seus elementos nos ajudam a compreender a caminhada de preparação para o Natal.",
      items: [
        {
          label: "Formato circular",
          description:
            "representa a eternidade e o amor de Deus, que não têm princípio nem fim.",
        },
        {
          label: "Ramos verdes",
          description: "simbolizam a esperança e a vida.",
        },
        {
          label: "Quatro velas",
          description: "representam os quatro domingos do Advento.",
        },
        {
          label: "Velas roxas",
          description:
            "simbolizam a oração, a conversão e a preparação espiritual.",
        },
        {
          label: "Vela rosa",
          description:
            "representa a alegria pela proximidade do nascimento de Jesus.",
        },
        {
          label: "Luz das velas",
          description: "representa Jesus Cristo, a luz do mundo.",
        },
      ],
      closing:
        "A cada domingo, acendemos uma nova vela, mantendo acesas as anteriores. Assim, a luz cresce progressivamente, simbolizando a proximidade da chegada de Cristo.",
      callout: {
        title: "Conheça os símbolos do Advento",
        description:
          "Entenda o significado da Coroa, das velas, das cores e dos demais elementos que acompanham nossa caminhada.",
        imageSrc: "/destaques/advento/coroa-do-advento.png",
        imageAlt:
          "Coroa do Advento com três velas roxas e uma vela rosa acesas",
      },
    },
    familySection: {
      title: "Como viver esta primeira semana do Advento?",
      intro:
        "A preparação para o Natal começa dentro de nós. Neste primeiro domingo, somos convidados a cultivar a esperança e reservar momentos para Deus e para nossa família.",
      suggestions: [
        { icon: "prayer", text: "Reservar momentos de oração em família." },
        { icon: "church", text: "Participar das Santas Missas." },
        { icon: "book", text: "Meditar a Palavra de Deus." },
        { icon: "heart", text: "Realizar gestos concretos de solidariedade." },
        { icon: "home", text: "Preparar o presépio em casa." },
        { icon: "users", text: "Cultivar o perdão e a união familiar." },
      ],
    },
    reflectionSection: {
      title: "Para refletir nesta semana",
      questions: [
        "Tenho vivido com esperança e confiança nas promessas de Deus?",
        "Tenho reservado momentos para oração e preparação espiritual?",
        "Como posso levar esperança às pessoas que estão ao meu redor?",
      ],
      prayer:
        "Senhor, fortalecei nossa esperança e preparai nosso coração para a vossa chegada.",
    },
    nextWeek: {
      targetWeekId: 2,
      title: "Nossa caminhada continua: a Paz",
      description:
        "Na próxima semana, acenderemos a segunda vela da Coroa do Advento. Seremos convidados a preparar os caminhos do Senhor por meio da conversão, da reconciliação e da paz.",
      buttonLabel: "Conheça a segunda semana",
    },
  },
  {
    id: 2,
    numberLabel: "02",
    sundayDateIso: "2026-12-06",
    displayDate: "06 de dezembro",
    fullDateLabel: "06 DE DEZEMBRO DE 2026",
    eyebrow: "2º DOMINGO DO ADVENTO · 06 DE DEZEMBRO DE 2026",
    theme: "Paz",
    sidebarSubtitle: "Segundo domingo do Advento.",
    candleName: "Segunda vela — Paz",
    candleColor: "purple",
    isPublished: false,
    title: "Preparar os caminhos do Senhor",
    subtitle: "Segunda vela — Paz",
    introParagraphs: [
      "No segundo domingo do Advento, acendemos a segunda vela roxa, contemplando o chamado à conversão, à reconciliação e à paz.",
    ],
    candleSection: {
      title: "Segunda vela roxa: a Paz",
      paragraphs: [
        "A segunda vela roxa recorda o chamado de São João Batista à conversão e à preparação dos caminhos do Senhor.",
      ],
    },
    gospelSection: {
      title: "O Evangelho deste domingo",
      reference: "Marcos 1,1-8",
      reflectionParagraphs: [
        "São João Batista anuncia a necessidade da conversão para acolher Aquele que vem.",
      ],
    },
    previewTopics: [
      "Segunda vela roxa da Coroa do Advento.",
      "Conversão, reconciliação e preparação dos caminhos do Senhor.",
      "São João Batista anuncia a necessidade da conversão.",
    ],
    nextWeek: {
      targetWeekId: 3,
      title: "Nossa caminhada continua: a Alegria",
      description:
        "No terceiro domingo do Advento, celebraremos o Domingo Gaudete, acendendo a vela rosa da alegria pela proximidade do Natal.",
      buttonLabel: "Conheça a terceira semana",
    },
  },
  {
    id: 3,
    numberLabel: "03",
    sundayDateIso: "2026-12-13",
    displayDate: "13 de dezembro",
    fullDateLabel: "13 DE DEZEMBRO DE 2026",
    eyebrow: "3º DOMINGO DO ADVENTO · 13 DE DEZEMBRO DE 2026",
    theme: "Alegria",
    sidebarSubtitle: "Terceiro domingo do Advento.",
    candleName: "Terceira vela — Alegria",
    candleColor: "rose",
    isPublished: false,
    title: "Domingo Gaudete: alegrai-vos no Senhor",
    subtitle: "Terceira vela — Alegria",
    introParagraphs: [
      "No terceiro domingo do Advento, celebramos o Domingo Gaudete — expressão que significa 'alegrai-vos' —, acendendo a terceira vela, de cor rosa, pela proximidade do Natal.",
    ],
    candleSection: {
      title: "Terceira vela rosa: a Alegria",
      paragraphs: [
        "A cor rosa sinaliza a alegria pela proximidade do nascimento de Jesus, com São João Batista como testemunha da luz.",
      ],
    },
    gospelSection: {
      title: "O Evangelho deste domingo",
      reference: "João 1,6-8.19-28",
      reflectionParagraphs: [
        "João Batista dá testemunho da Luz que está prestes a brilhar entre nós.",
      ],
    },
    previewTopics: [
      "Terceira vela, de cor rosa.",
      "Domingo Gaudete, expressão que significa alegrai-vos.",
      "Alegria pela proximidade do Natal.",
      "João Batista como testemunha da luz.",
    ],
    nextWeek: {
      targetWeekId: 4,
      title: "Nossa caminhada continua: o Amor",
      description:
        "Na quarta semana do Advento, contemplaremos o amor de Deus pela humanidade e o 'sim' humilde da Virgem Maria.",
      buttonLabel: "Conheça a quarta semana",
    },
  },
  {
    id: 4,
    numberLabel: "04",
    sundayDateIso: "2026-12-20",
    displayDate: "20 de dezembro",
    fullDateLabel: "20 DE DEZEMBRO DE 2026",
    eyebrow: "4º DOMINGO DO ADVENTO · 20 DE DEZEMBRO DE 2026",
    theme: "Amor",
    sidebarSubtitle: "Quarto domingo do Advento.",
    candleName: "Quarta vela — Amor",
    candleColor: "purple",
    isPublished: false,
    title: "O amor de Deus revelado no 'sim' de Maria",
    subtitle: "Quarta vela — Amor",
    introParagraphs: [
      "No quarto domingo do Advento, acendemos a quarta vela roxa, contemplando o amor de Deus pela humanidade e a fé, humildade e disponibilidade da Virgem Maria diante da Anunciação do Anjo Gabriel.",
    ],
    candleSection: {
      title: "Quarta vela roxa: o Amor",
      paragraphs: [
        "Todas as quatro velas da Coroa do Advento brilham, preparando nosso coração para acolher Jesus no Natal.",
      ],
    },
    gospelSection: {
      title: "O Evangelho deste domingo",
      reference: "Lucas 1,26-38",
      reflectionParagraphs: [
        "Na Anunciação do Anjo Gabriel, Maria acolhe com fé e humildade o projeto de amor de Deus.",
      ],
    },
    previewTopics: [
      "Quarta vela roxa da Coroa do Advento.",
      "Amor de Deus pela humanidade.",
      "Fé, humildade e disponibilidade da Virgem Maria.",
      "Anunciação do Anjo Gabriel.",
    ],
  },
];
