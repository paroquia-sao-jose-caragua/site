import type { CommunityMassSchedule } from "@/entities/Community";

const WEEKDAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAY_FULL = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function formatTimeLabel(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = Number.parseInt(h, 10);
  if (!m || m === "00") {
    return `${hour}h`;
  }
  return `${hour}h${m}`;
}

export function formatTimesList(times: string[]): string {
  if (!times || times.length === 0) return "";
  const formatted = times.map(formatTimeLabel).filter(Boolean);
  if (formatted.length === 0) return "";
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} e ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(", ")} e ${formatted[formatted.length - 1]}`;
}

/**
 * Retorna um resumo conciso dos horários regulares de missa da comunidade para os cards da home.
 * Exemplo: "Dom 8h, 10h e 19h | Sáb 19h30 | Qua 19h"
 */
export function formatCommunityMassScheduleSummary(
  massSchedules?: CommunityMassSchedule[],
  fallback = "Consulte a programação",
): string {
  if (!massSchedules || massSchedules.length === 0) {
    return fallback;
  }

  const activeSchedules = massSchedules.filter((s) => s.active !== false);
  if (activeSchedules.length === 0) {
    return fallback;
  }

  const parts: string[] = [];

  // 1. Agrupar missas semanais por dia da semana
  const weeklyMap = new Map<number, Set<string>>();
  for (const schedule of activeSchedules) {
    if (
      (schedule.recurrenceType === "weekly" || schedule.type === "ordinary") &&
      typeof schedule.dayOfWeek === "number"
    ) {
      if (!weeklyMap.has(schedule.dayOfWeek)) {
        weeklyMap.set(schedule.dayOfWeek, new Set());
      }
      for (const t of schedule.times || []) {
        if (t.startTime) {
          weeklyMap.get(schedule.dayOfWeek)!.add(t.startTime);
        }
      }
    }
  }

  // Ordenar dias: 0 (Dom) primeiro, depois 6 (Sáb), depois os outros dias (1, 2, 3, 4, 5)
  const orderedDays = Array.from(weeklyMap.keys()).sort((a, b) => {
    // Prioriza fim de semana
    if (a === 0 && b !== 0) return -1;
    if (b === 0 && a !== 0) return 1;
    if (a === 6 && b !== 6) return -1;
    if (b === 6 && a !== 6) return 1;
    return a - b;
  });

  for (const day of orderedDays) {
    const times = Array.from(weeklyMap.get(day)!).sort();
    if (times.length > 0) {
      parts.push(`${WEEKDAY_SHORT[day]} ${formatTimesList(times)}`);
    }
  }

  // 2. Missas mensais / devocionais
  for (const schedule of activeSchedules) {
    if (schedule.recurrenceType === "monthly" || schedule.type === "devotional") {
      const times = (schedule.times || []).map((t) => t.startTime).filter(Boolean).sort();
      if (times.length > 0) {
        if (typeof schedule.dayOfMonth === "number") {
          parts.push(`Dia ${schedule.dayOfMonth} às ${formatTimesList(times)}`);
        } else if (
          typeof schedule.weekOfMonth === "number" &&
          typeof schedule.dayOfWeek === "number"
        ) {
          const weekPrefix =
            schedule.weekOfMonth === 5
              ? "Último"
              : `${schedule.weekOfMonth}º`;
          parts.push(`${weekPrefix} ${WEEKDAY_SHORT[schedule.dayOfWeek]} às ${formatTimesList(times)}`);
        }
      }
    }
  }

  // 3. Missas anuais / solenes
  for (const schedule of activeSchedules) {
    if (schedule.recurrenceType === "yearly" || schedule.type === "solemnity") {
      const times = (schedule.times || []).map((t) => t.startTime).filter(Boolean).sort();
      if (times.length > 0 && typeof schedule.dayOfMonth === "number") {
        const monthStr =
          typeof schedule.monthOfYear === "number"
            ? ` de ${MONTHS_SHORT[schedule.monthOfYear - 1]}`
            : "";
        parts.push(`${schedule.dayOfMonth}${monthStr} às ${formatTimesList(times)}`);
      }
    }
  }

  if (parts.length === 0) {
    return fallback;
  }

  return parts.join(" | ");
}

/**
 * Retorna uma lista de strings formatadas para visualização detalhada em modais e páginas.
 */
export function formatCommunityMassScheduleDetails(
  massSchedules?: CommunityMassSchedule[],
): string[] {
  if (!massSchedules || massSchedules.length === 0) {
    return [];
  }

  const activeSchedules = massSchedules.filter((s) => s.active !== false);
  const lines: string[] = [];

  // Missas semanais agrupadas
  const weeklyMap = new Map<number, Set<string>>();
  for (const schedule of activeSchedules) {
    if (
      (schedule.recurrenceType === "weekly" || schedule.type === "ordinary") &&
      typeof schedule.dayOfWeek === "number"
    ) {
      if (!weeklyMap.has(schedule.dayOfWeek)) {
        weeklyMap.set(schedule.dayOfWeek, new Set());
      }
      for (const t of schedule.times || []) {
        if (t.startTime) {
          weeklyMap.get(schedule.dayOfWeek)!.add(t.startTime);
        }
      }
    }
  }

  const sortedDays = Array.from(weeklyMap.keys()).sort((a, b) => a - b);
  for (const day of sortedDays) {
    const times = Array.from(weeklyMap.get(day)!).sort();
    if (times.length > 0) {
      lines.push(`${WEEKDAY_FULL[day]}: ${formatTimesList(times)}`);
    }
  }

  // Missas mensais
  for (const schedule of activeSchedules) {
    if (schedule.recurrenceType === "monthly" || schedule.type === "devotional") {
      const times = (schedule.times || []).map((t) => t.startTime).filter(Boolean).sort();
      if (times.length > 0) {
        const titleSuffix = schedule.title ? ` (${schedule.title})` : "";
        if (typeof schedule.dayOfMonth === "number") {
          lines.push(`Todo dia ${schedule.dayOfMonth} do mês${titleSuffix}: ${formatTimesList(times)}`);
        } else if (
          typeof schedule.weekOfMonth === "number" &&
          typeof schedule.dayOfWeek === "number"
        ) {
          const weekPrefix =
            schedule.weekOfMonth === 5
              ? "Último"
              : `${schedule.weekOfMonth}º`;
          lines.push(`${weekPrefix} ${WEEKDAY_FULL[schedule.dayOfWeek]} do mês${titleSuffix}: ${formatTimesList(times)}`);
        }
      }
    }
  }

  return lines;
}
