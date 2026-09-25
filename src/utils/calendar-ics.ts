/**
 * Generates and triggers download of an .ics calendar file for an appointment.
 */
export function downloadAppointmentIcs(appointment: {
  serviceTitle: string;
  agentName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  address?: string | null;
  description?: string | null;
}) {
  const [year, month, day] = appointment.date.split('-').map(Number);
  const [startH, startM] = appointment.startTime.split(':').map(Number);
  const [endH, endM] = appointment.endTime.split(':').map(Number);

  const formatIcsDate = (y: number, m: number, d: number, h: number, min: number) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${y}${pad(m)}${pad(d)}T${pad(h)}${pad(min)}00`;
  };

  const dtStart = formatIcsDate(year, month, day, startH, startM);
  const dtEnd = formatIcsDate(year, month, day, endH, endM);
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const title = `Atendimento Pastoral: ${appointment.serviceTitle} (${appointment.agentName})`;
  const location = appointment.address || 'Paróquia São José - Caraguatatuba';
  const desc = appointment.description || `Agendamento pastoral com ${appointment.agentName} na Paróquia São José.`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Paróquia São José Caraguatatuba//Agendamentos//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:appointment-${dtStart}-${Math.random().toString(36).substring(2)}@paroquiasaojosecaragua.org.br`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `agendamento-paroquia-${appointment.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
