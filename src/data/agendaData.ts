export interface Community {
  id: string;
  name: string;
  shortName: string;
  address: string;
}

export interface AgendaEvent {
  id: number | string;
  title: string;
  startTime: string;
  endTime?: string;
  communityId: string;
  recurring: boolean;
  date: string; // "YYYY-MM-DD"
  description?: string;
  communityName?: string;
  communityShortName?: string;
  communityCoverUrl?: string;
  communityAddress?: string;
}

export const communities: Community[] = [
  {
    id: "psj",
    name: "Paróquia Matriz São José",
    shortName: "São José",
    address:
      "R. Edson dos Santos, 30 — Morro do Algodão, Caraguatatuba - SP, 11671-180",
  },
  {
    id: "cse",
    name: "Capela Santa Edwiges",
    shortName: "Sta. Edwiges",
    address: "R. Santa Edwiges, 120 — Pegorelli, Caraguatatuba - SP",
  },
  {
    id: "cnsr",
    name: "Capela Nossa Sra. do Rosário",
    shortName: "N. Sra. Rosário",
    address: "Av. Guilherme de Abreu Sodré, 500 — Indaiá, Caraguatatuba - SP",
  },
  {
    id: "csf",
    name: "Capela Sagrada Família",
    shortName: "Sagrada Família",
    address: "R. das Orquídeas, 45 — Jaraguazinho, Caraguatatuba - SP",
  },
  {
    id: "cscj",
    name: "Capela Sagrado Coração de Jesus",
    shortName: "Sag. Coração",
    address:
      "R. José Benedito de Oliveira, 80 — Martim de Sá, Caraguatatuba - SP",
  },
];

// Generate a date string for a specific day offset from a base date
function dateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export const agendaEvents: AgendaEvent[] = [
  // ─── Junho 2026 ───────────────────────────────────────────────
  // Domingo 14/06
  {
    id: 1,
    title: "Santa Missa",
    startTime: "09:30",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 14),
  },
  {
    id: 2,
    title: "Santa Missa",
    startTime: "11:00",
    endTime: "12:00",
    communityId: "cscj",
    recurring: true,
    date: dateStr(2026, 6, 14),
  },
  {
    id: 3,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 14),
  },

  // Terça 16/06
  {
    id: 4,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 16),
  },
  {
    id: 5,
    title: "Terço dos Homens",
    startTime: "20:30",
    endTime: "21:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 16),
  },

  // Quarta 17/06
  {
    id: 6,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 17),
  },

  // Quinta 18/06
  {
    id: 7,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 18),
  },
  {
    id: 8,
    title: "Grupo de Oração",
    startTime: "20:00",
    endTime: "21:30",
    communityId: "cse",
    recurring: false,
    date: dateStr(2026, 6, 18),
  },

  // Sexta 19/06
  {
    id: 9,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 19),
  },

  // Sábado 20/06
  {
    id: 10,
    title: "Santa Missa",
    startTime: "08:00",
    endTime: "09:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 20),
  },
  {
    id: 11,
    title: "Santa Missa",
    startTime: "09:00",
    endTime: "10:00",
    communityId: "cse",
    recurring: true,
    date: dateStr(2026, 6, 20),
  },
  {
    id: 12,
    title: "Catequese Infantil",
    startTime: "09:00",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 20),
  },

  // Domingo 21/06
  {
    id: 13,
    title: "Santa Missa",
    startTime: "09:30",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 21),
  },
  {
    id: 14,
    title: "Santa Missa",
    startTime: "11:00",
    endTime: "12:00",
    communityId: "cscj",
    recurring: true,
    date: dateStr(2026, 6, 21),
  },
  {
    id: 15,
    title: "Missa do Dízimo",
    startTime: "17:00",
    endTime: "18:00",
    communityId: "psj",
    recurring: false,
    date: dateStr(2026, 6, 21),
  },
  {
    id: 16,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 21),
  },

  // Terça 23/06
  {
    id: 17,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 23),
  },
  {
    id: 18,
    title: "Retiro Espiritual",
    startTime: "09:00",
    endTime: "17:00",
    communityId: "csf",
    recurring: false,
    date: dateStr(2026, 6, 23),
  },

  // Quarta 24/06 — Festa São João
  {
    id: 19,
    title: "Santa Missa — Natividade de São João Batista",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: false,
    date: dateStr(2026, 6, 24),
  },

  // Quinta 25/06
  {
    id: 20,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 25),
  },

  // Sexta 26/06
  {
    id: 21,
    title: "Via-Sacra",
    startTime: "19:00",
    endTime: "19:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 26),
  },
  {
    id: 22,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 26),
  },

  // Sábado 27/06
  {
    id: 23,
    title: "Santa Missa",
    startTime: "08:00",
    endTime: "09:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 27),
  },
  {
    id: 24,
    title: "Pastoral da Criança",
    startTime: "09:00",
    endTime: "11:00",
    communityId: "cnsr",
    recurring: false,
    date: dateStr(2026, 6, 27),
  },

  // Domingo 28/06
  {
    id: 25,
    title: "Santa Missa",
    startTime: "09:30",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 28),
  },
  {
    id: 26,
    title: "Santa Missa",
    startTime: "11:00",
    endTime: "12:00",
    communityId: "cscj",
    recurring: true,
    date: dateStr(2026, 6, 28),
  },
  {
    id: 27,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 28),
  },

  // Terça 30/06
  {
    id: 28,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 6, 30),
  },

  // ─── Julho 2026 ───────────────────────────────────────────────
  // Quarta 01/07
  {
    id: 29,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 1),
  },

  // Quinta 02/07
  {
    id: 30,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 2),
  },

  // Sexta 03/07
  {
    id: 31,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 3),
  },
  {
    id: 32,
    title: "Momento de Espiritualidade",
    startTime: "20:30",
    endTime: "21:30",
    communityId: "psj",
    recurring: false,
    date: dateStr(2026, 7, 3),
    description: "Logo após a Santa Missa das 19h30",
  },

  // Sábado 04/07
  {
    id: 33,
    title: "Santa Missa",
    startTime: "08:00",
    endTime: "09:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 4),
  },
  {
    id: 34,
    title: "Santa Missa",
    startTime: "09:00",
    endTime: "10:00",
    communityId: "cse",
    recurring: true,
    date: dateStr(2026, 7, 4),
  },

  // Domingo 05/07
  {
    id: 35,
    title: "Santa Missa",
    startTime: "09:30",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 5),
  },
  {
    id: 36,
    title: "Santa Missa",
    startTime: "11:00",
    endTime: "12:00",
    communityId: "cscj",
    recurring: true,
    date: dateStr(2026, 7, 5),
  },
  {
    id: 37,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 5),
  },

  // Terça 07/07
  {
    id: 38,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 7),
  },
  {
    id: 39,
    title: "Terço dos Homens",
    startTime: "20:30",
    endTime: "21:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 7),
  },

  // Quarta 08/07
  {
    id: 40,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 8),
  },

  // Quinta 09/07 — Feriado Independência SP
  {
    id: 41,
    title: "Santa Missa Solene",
    startTime: "10:00",
    endTime: "11:30",
    communityId: "psj",
    recurring: false,
    date: dateStr(2026, 7, 9),
  },

  // Sexta 10/07
  {
    id: 42,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 10),
  },

  // Sábado 11/07
  {
    id: 43,
    title: "Santa Missa",
    startTime: "08:00",
    endTime: "09:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 11),
  },
  {
    id: 44,
    title: "Confissões",
    startTime: "09:00",
    endTime: "12:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 11),
  },

  // Domingo 12/07
  {
    id: 45,
    title: "Santa Missa",
    startTime: "09:30",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 12),
  },
  {
    id: 46,
    title: "Santa Missa",
    startTime: "11:00",
    endTime: "12:00",
    communityId: "cscj",
    recurring: true,
    date: dateStr(2026, 7, 12),
  },
  {
    id: 47,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 12),
  },

  // Terça 14/07
  {
    id: 48,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 14),
  },

  // Quarta 15/07
  {
    id: 49,
    title: "Santa Missa",
    startTime: "17:00",
    endTime: "18:30",
    communityId: "cse",
    recurring: true,
    date: dateStr(2026, 7, 15),
  },
  {
    id: 50,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 15),
  },

  // Quinta 16/07 — Nossa Senhora do Carmo
  {
    id: 51,
    title: "Santa Missa — N. Sra. do Carmo",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: false,
    date: dateStr(2026, 7, 16),
  },

  // Sexta 17/07
  {
    id: 52,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 17),
  },

  // Sábado 18/07
  {
    id: 53,
    title: "Santa Missa",
    startTime: "08:00",
    endTime: "09:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 18),
  },
  {
    id: 54,
    title: "Pastoral da Família",
    startTime: "14:00",
    endTime: "16:00",
    communityId: "csf",
    recurring: false,
    date: dateStr(2026, 7, 18),
  },

  // Domingo 19/07
  {
    id: 55,
    title: "Santa Missa",
    startTime: "09:30",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 19),
  },
  {
    id: 56,
    title: "Santa Missa",
    startTime: "11:00",
    endTime: "12:00",
    communityId: "cscj",
    recurring: true,
    date: dateStr(2026, 7, 19),
  },
  {
    id: 57,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 19),
  },

  // Terça 29/07
  {
    id: 58,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 29),
  },
  {
    id: 59,
    title: "Terço dos Homens",
    startTime: "20:30",
    endTime: "21:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 29),
  },

  // Quarta 30/07
  {
    id: 60,
    title: "Santa Missa",
    startTime: "17:00",
    endTime: "18:30",
    communityId: "cse",
    recurring: true,
    date: dateStr(2026, 7, 30),
  },
  {
    id: 61,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 7, 30),
  },

  // ─── Agosto 2026 ──────────────────────────────────────────────
  // Sábado 01/08
  {
    id: 62,
    title: "Santa Missa",
    startTime: "08:00",
    endTime: "09:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 1),
  },
  {
    id: 63,
    title: "Catequese",
    startTime: "09:00",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 1),
  },

  // Domingo 02/08
  {
    id: 64,
    title: "Santa Missa",
    startTime: "09:30",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 2),
  },
  {
    id: 65,
    title: "Santa Missa",
    startTime: "11:00",
    endTime: "12:00",
    communityId: "cscj",
    recurring: true,
    date: dateStr(2026, 8, 2),
  },
  {
    id: 66,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 2),
  },

  // Quarta 05/08
  {
    id: 67,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 5),
  },

  // Sexta 07/08
  {
    id: 68,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 7),
  },

  // Sábado 08/08
  {
    id: 69,
    title: "Santa Missa",
    startTime: "08:00",
    endTime: "09:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 8),
  },

  // Domingo 09/08
  {
    id: 70,
    title: "Santa Missa",
    startTime: "09:30",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 9),
  },
  {
    id: 71,
    title: "Santa Missa",
    startTime: "11:00",
    endTime: "12:00",
    communityId: "cscj",
    recurring: true,
    date: dateStr(2026, 8, 9),
  },
  {
    id: 72,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 9),
  },

  // Terça 11/08
  {
    id: 73,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 11),
  },
  {
    id: 74,
    title: "Terço dos Homens",
    startTime: "20:30",
    endTime: "21:00",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 11),
  },

  // Sexta 14/08 — Véspera Assunção
  {
    id: 75,
    title: "Vigília da Assunção",
    startTime: "19:30",
    endTime: "21:00",
    communityId: "psj",
    recurring: false,
    date: dateStr(2026, 8, 14),
  },

  // Sábado 15/08 — Assunção de Nossa Senhora
  {
    id: 76,
    title: "Santa Missa Solene — Assunção de N. Sra.",
    startTime: "09:00",
    endTime: "10:30",
    communityId: "psj",
    recurring: false,
    date: dateStr(2026, 8, 15),
  },
  {
    id: 77,
    title: "Santa Missa Solene — Assunção de N. Sra.",
    startTime: "19:30",
    endTime: "21:00",
    communityId: "psj",
    recurring: false,
    date: dateStr(2026, 8, 15),
  },

  // Domingo 16/08
  {
    id: 78,
    title: "Santa Missa",
    startTime: "09:30",
    endTime: "10:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 16),
  },
  {
    id: 79,
    title: "Santa Missa",
    startTime: "11:00",
    endTime: "12:00",
    communityId: "cscj",
    recurring: true,
    date: dateStr(2026, 8, 16),
  },
  {
    id: 80,
    title: "Santa Missa",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: true,
    date: dateStr(2026, 8, 16),
  },

  // Quarta 19/08 — Missa São José
  {
    id: 81,
    title: "Santa Missa em Honra a São José",
    startTime: "19:30",
    endTime: "20:30",
    communityId: "psj",
    recurring: false,
    date: dateStr(2026, 8, 19),
  },
];
