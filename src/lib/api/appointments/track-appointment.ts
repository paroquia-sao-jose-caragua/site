import { api } from '../utils/api';
import type { Appointment } from '@/entities/appointment';

export const trackAppointment = async (token: string) => {
  const result = await api<{ appointment: Appointment }>(`/appointments/track/${token}`);
  if (result.statusCode >= 400 || !result.appointment) {
    throw new Error('Agendamento não encontrado com o código fornecido.');
  }
  return result.appointment;
};

export const cancelAppointment = async (token: string, cancellationReason: string) => {
  const result = await api<{ message: string }>(`/appointments/track/${token}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ cancellationReason }),
  });
  if (result.statusCode >= 400) {
    throw new Error(result.message || 'Erro ao cancelar agendamento.');
  }
  return result;
};
