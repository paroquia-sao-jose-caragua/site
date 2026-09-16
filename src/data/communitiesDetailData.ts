export interface Devotion {
  title: string;
  schedule: string;
  image?: string;
}

export interface PastoralGroup {
  name: string;
  description: string;
}

export interface PhotoGalleryItem {
  url: string;
  caption: string;
}

export interface CommunityDetail {
  id: string;
  slug: string;
  name: string;
  type: "parish_church" | "chapel";
  coverUrl: string;
  heroSubtitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  historySummary: string;
  patronName: string;
  patronDescription: string;
  patronImage: string;
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  massSchedule: { day: string; times: string }[];
  devotions: Devotion[];
  photos: PhotoGalleryItem[];
  pastorals: PastoralGroup[];
}

export const communitiesDetailData: Record<string, CommunityDetail> = {
  "matriz-sao-jose": {
    id: "01KJKHF9C9TH7N3SRM50GM6K5V",
    slug: "matriz-sao-jose",
    name: "Igreja Matriz São José",
    type: "parish_church",
    coverUrl: "/communities/sao-jose.png",
    heroSubtitle:
      "Centro da nossa fé e casa de todos os filhos de Deus. Sob a proteção de São José, seguimos unidos na oração, na caridade e no serviço.",
    aboutParagraph1:
      "A Igreja Matriz São José é o coração da nossa paróquia e o centro da vida comunitária. Dedicada ao nosso padroeiro São José, esposo de Maria e modelo de fé, trabalho e obediência, somos chamados a viver o Evangelho com simplicidade, confiança e amor.",
    aboutParagraph2:
      "Aqui, você encontra um lugar de acolhida, oração e encontro com Deus para toda a família.",
    historySummary:
      "Sua trajetória começou como comunidade vinculada à Catedral Divino Espírito Santo e nas primeiras reuniões de oração em barracão no bairro. Com a dedicação dos moradores, diáconos e sacerdotes pioneiros, a estrutura física evoluiu até a construção do templo atual e sua instituição como matriz paroquial.",
    patronName: "São José",
    patronDescription: "Esposo de Maria e protetor da Igreja",
    patronImage: "/clergies/paroco.png",
    address: "R. Edson dos Santos, 30 - Morro do Algodão, Caraguatatuba - SP, 11671-180",
    phone: "(12) 3883-4888",
    email: "contato@paroquiasaojosecaragua.org.br",
    officeHours:
      "Segunda a Sexta: 08h às 12h e 13h às 17h\nSábado: 08h às 12h",
    massSchedule: [
      { day: "Domingo", times: "09h30  |  19h30" },
      { day: "Quarta-feira", times: "18h30" },
      { day: "Quinta-feira", times: "18h30" },
    ],
    devotions: [
      {
        title: "Devoção a São José",
        schedule: "Todo dia 19 de cada mês às 19h30",
      },
      {
        title: "Devoção a Nossa Senhora de Fátima",
        schedule: "Todo dia 13 de cada mês às 19h30",
      },
      {
        title: "Devoção ao Imaculado Coração de Maria",
        schedule: "Primeiro sábado de cada mês às 08h00",
      },
    ],
    photos: [
      { url: "/communities/sao-jose.png", caption: "Fachada Principal da Matriz" },
      { url: "/communities/igreja.png", caption: "Nossa Igreja" },
      { url: "/communities/presbitero-e-altar.png", caption: "Presbitério e Altar" },
      { url: "/communities/gruta-ns-de-fatima.png", caption: "Gruta Nossa Senhora de Fátima" },
      { url: "/communities/imagem-sao-jose.png", caption: "Imagem de São José" },
    ],
    pastorals: [
      {
        name: "Pastoral Litúrgica",
        description: "Servir nas celebrações com amor e dedicação.",
      },
      {
        name: "Catequese",
        description: "Formação para crianças, jovens e adultos.",
      },
      {
        name: "Pastoral da Acolhida",
        description: "Acolher bem para acolher melhor.",
      },
      {
        name: "Dízimo",
        description: "Partilhar é um ato de fé e gratidão.",
      },
      {
        name: "Ministros Extraordinários",
        description: "Servir a Eucaristia com reverência.",
      },
      {
        name: "Pascom",
        description: "Anunciar a boa nova através das mídias.",
      },
    ],
  },
  "nossa-senhora-do-rosario": {
    id: "01KJKHM9CPTQVBB572QSE118FN",
    slug: "nossa-senhora-do-rosario",
    name: "Capela Nossa Senhora do Rosário",
    type: "chapel",
    coverUrl: "/communities/nossa-senhora-do-rosario.jpeg",
    heroSubtitle:
      "Lugar de oração, devoção mariana e união comunitária na Praia das Palmeiras.",
    aboutParagraph1:
      "A Capela Nossa Senhora do Rosário acolhe com carinho os moradores e visitantes da Praia das Palmeiras, cultivando o amor ao Santo Terço e a vivência fraterna dos ensinamentos de Cristo.",
    aboutParagraph2:
      "Com celebrações e encontros marianos regulares, é uma casa de portas abertas para a oração familiar.",
    historySummary:
      "A comunidade teve seu início em reuniões de oração promovidas nas residências dos primeiros moradores do bairro. Com a doação do terreno e o trabalho dedicado dos fiéis, foi construída a capela dedicada a Nossa Senhora do Rosário.",
    patronName: "Nossa Senhora do Rosário",
    patronDescription: "Rainha do Santo Rosário e protetora das famílias",
    patronImage: "/communities/nossa-senhora-do-rosario.jpeg",
    address:
      "Av. Manoel Avelino dos Santos, 100 — Praia das Palmeiras, Caraguatatuba - SP, 11666-251",
    phone: "(12) 3883-4888",
    email: "contato@paroquiasaojosecaragua.org.br",
    officeHours: "Atendimento via Secretaria Paroquial (Matriz)",
    massSchedule: [
      { day: "Terça-feira", times: "19h30" },
      { day: "Sábado", times: "19h30" },
    ],
    devotions: [],
    photos: [
      { url: "/communities/nossa-senhora-do-rosario.jpeg", caption: "Capela Nossa Senhora do Rosário" },
      { url: "/pastoral-center.png", caption: "Espaço de Oração" },
      { url: "/communities/sao-jose.png", caption: "Altar Comunitário" },
    ],
    pastorals: [
      {
        name: "Pastoral Litúrgica",
        description: "Organização e zelo pelas celebrações.",
      },
      {
        name: "Catequese Infantil",
        description: "Iniciação à vida cristã.",
      },
      {
        name: "Grupo de Oração",
        description: "Louvar a Deus com cânticos e partilha.",
      },
    ],
  },
  "santa-edwiges": {
    id: "01KW9NFZQGFNR179YAQ2KNP5PN",
    slug: "santa-edwiges",
    name: "Capela Santa Edwiges",
    type: "chapel",
    coverUrl: "/communities/santa-edwiges.png",
    heroSubtitle:
      "Comunidade viva, acolhedora e atuante no bairro Porto Novo.",
    aboutParagraph1:
      "Dedicada a Santa Edwiges, a capela do Porto Novo é ponto de encontro e fraternidade, onde a fé se traduz em oração constante e auxílio aos necessitados.",
    aboutParagraph2:
      "Um espaço abençoado que acolhe crianças, jovens e adultos em momentos de formação e espiritualidade.",
    historySummary:
      "Surgiu da iniciativa dos moradores do bairro Porto Novo, que se reuniam inicialmente em residências e salas de aula de escolas locais. Graças ao esforço comunitário e eventos beneficentes, o terreno foi conquistado e a capela construída.",
    patronName: "Santa Edwiges",
    patronDescription: "Padroeira dos necessitados e protetora dos humildes",
    patronImage: "/communities/santa-edwiges.png",
    address:
      "Praça Engenheiro Marino Parolari, 40 — Porto Novo, Caraguatatuba - SP, 11667-255",
    phone: "(12) 3883-4888",
    email: "contato@paroquiasaojosecaragua.org.br",
    officeHours: "Atendimento via Secretaria Paroquial (Matriz)",
    massSchedule: [
      { day: "Domingo", times: "08h00" },
    ],
    devotions: [
      {
        title: "Devoção a Santa Edwiges",
        schedule: "Todo dia 16 de cada mês às 19h00",
      },
    ],
    photos: [
      { url: "/communities/santa-edwiges.png", caption: "Capela Santa Edwiges" },
    ],
    pastorals: [
      {
        name: "Pastoral Litúrgica",
        description: "Servir nas celebrações com amor e dedicação.",
      },
      {
        name: "Catequese",
        description: "Formação para crianças, jovens e adultos.",
      },
      {
        name: "Pastoral da Acolhida",
        description: "Acolher bem para acolher melhor.",
      },
      {
        name: "Dízimo",
        description: "Partilhar é um ato de fé e gratidão.",
      },
      {
        name: "Ministros Extraordinários",
        description: "Servir a Eucaristia com reverência.",
      },
      {
        name: "Pascom",
        description: "Anunciar a boa nova através das mídias.",
      },
    ],
  },
  "sagrada-familia": {
    id: "01KW9NJSPK2SB53QV4C9KPX5MA",
    slug: "sagrada-familia",
    name: "Capela Sagrada Família",
    type: "chapel",
    coverUrl: "/communities/sagrada-familia.jpeg",
    heroSubtitle:
      "Exemplo de fé, união e virtude no cotidiano familiar.",
    aboutParagraph1:
      "A Capela Sagrada Família busca ser espelho da Casa de Nazaré na Praia das Palmeiras, promovendo o amor, o respeito e o cultivo da fé nas famílias.",
    aboutParagraph2:
      "Espaço dedicado à espiritualidade familiar e à vivência fraterna na comunidade.",
    historySummary:
      "Estabelecida para servir aos moradores da Praia das Palmeiras, a capela nasceu do desejo de fortalecer os laços familiares e vivenciar os ensinamentos do Evangelho no dia a dia.",
    patronName: "Sagrada Família",
    patronDescription: "Jesus, Maria e José — Modelo supremo de família",
    patronImage: "/communities/sagrada-familia.jpeg",
    address:
      "Rua José de Almeida, 211 — Praia das Palmeiras, Caraguatatuba - SP, 11666-480",
    phone: "(12) 3883-4888",
    email: "contato@paroquiasaojosecaragua.org.br",
    officeHours: "Atendimento via Secretaria Paroquial (Matriz)",
    massSchedule: [{ day: "Sábado", times: "18h00" }],
    devotions: [],
    photos: [
      { url: "/communities/sagrada-familia.jpeg", caption: "Capela Sagrada Família" },
    ],
    pastorals: [
      {
        name: "Pastoral Litúrgica",
        description: "Servir nas celebrações com amor e dedicação.",
      },
      {
        name: "Catequese",
        description: "Formação para crianças, jovens e adultos.",
      },
      {
        name: "Pastoral da Acolhida",
        description: "Acolher bem para acolher melhor.",
      },
      {
        name: "Dízimo",
        description: "Partilhar é um ato de fé e gratidão.",
      },
      {
        name: "Ministros Extraordinários",
        description: "Servir a Eucaristia com reverência.",
      },
      {
        name: "Pascom",
        description: "Anunciar a boa nova através das mídias.",
      },
    ],
  },
  "sagrado-coracao-de-jesus": {
    id: "01KJKHGT3C2GHFGXF9V8498SRX",
    slug: "sagrado-coracao-de-jesus",
    name: "Capela Sagrado Coração de Jesus",
    type: "chapel",
    coverUrl: "/communities/sagrado-coracao-de-jesus.jpeg",
    heroSubtitle:
      "Refúgio de fé e amor divino no Pontal de Santa Marina.",
    aboutParagraph1:
      "A Capela Sagrado Coração de Jesus acolhe os fiéis do Pontal de Santa Marina, celebrando a misericórdia e o amor incondicional de Nosso Senhor.",
    aboutParagraph2:
      "Um lugar de oração contínua, adoração ao Santíssimo Sacramento e fraternidade.",
    historySummary:
      "Iniciada com o apoio pastoral e ações comunitárias da paróquia, a capela tornou-se centro de referência espiritual e social no bairro Pontal de Santa Marina.",
    patronName: "Sagrado Coração de Jesus",
    patronDescription: "Fonte inesgotável de amor, salvação e paz",
    patronImage: "/communities/sagrado-coracao-de-jesus.jpeg",
    address:
      "Av. Albert Charles Hanciau, 566 — Pontal de Santa Marina, Caraguatatuba - SP, 11672-050",
    phone: "(12) 3883-4888",
    email: "contato@paroquiasaojosecaragua.org.br",
    officeHours: "Atendimento via Secretaria Paroquial (Matriz)",
    massSchedule: [
      { day: "Domingo", times: "11h00" },
      { day: "1ª Sexta-feira do mês", times: "20h00" },
    ],
    devotions: [
      {
        title: "Missa do Sagrado Coração de Jesus",
        schedule: "Primeira sexta-feira de cada mês às 20h00",
      },
    ],
    photos: [
      { url: "/communities/sagrado-coracao-de-jesus.jpeg", caption: "Capela Sagrado Coração de Jesus" },
    ],
    pastorals: [
      {
        name: "Pastoral Litúrgica",
        description: "Servir nas celebrações com amor e dedicação.",
      },
      {
        name: "Catequese",
        description: "Formação para crianças, jovens e adultos.",
      },
      {
        name: "Pastoral da Acolhida",
        description: "Acolher bem para acolher melhor.",
      },
      {
        name: "Dízimo",
        description: "Partilhar é um ato de fé e gratidão.",
      },
      {
        name: "Ministros Extraordinários",
        description: "Servir a Eucaristia com reverência.",
      },
      {
        name: "Pascom",
        description: "Anunciar a boa nova através das mídias.",
      },
    ],
  },
};

export function getCommunityDetailBySlug(slug: string): CommunityDetail {
  const normalized = slug?.toLowerCase() || "";

  if (
    normalized === "matriz" ||
    normalized === "matriz-sao-jose" ||
    normalized === "igreja-matriz-sao-jose" ||
    normalized === "01kjkhf9c9th7n3srm50gm6k5v" ||
    normalized === "sao-jose"
  ) {
    return communitiesDetailData["matriz-sao-jose"];
  }

  if (
    normalized === "nossa-senhora-do-rosario" ||
    normalized === "rosario" ||
    normalized === "01kjkhm9cptqvbb572qse118fn"
  ) {
    return communitiesDetailData["nossa-senhora-do-rosario"];
  }

  if (
    normalized === "santa-edwiges" ||
    normalized === "edwiges" ||
    normalized === "01kw9nfzqgfnr179yaq2knp5pn"
  ) {
    return communitiesDetailData["santa-edwiges"];
  }

  if (
    normalized === "sagrada-familia" ||
    normalized === "familia" ||
    normalized === "01kw9njspk2sb53qv4c9kpx5ma"
  ) {
    return communitiesDetailData["sagrada-familia"];
  }

  if (
    normalized === "sagrado-coracao-de-jesus" ||
    normalized === "sagrado-coracao" ||
    normalized === "01kjkhgt3c2ghfgxf9v8498srx"
  ) {
    return communitiesDetailData["sagrado-coracao-de-jesus"];
  }

  return communitiesDetailData["matriz-sao-jose"];
}
