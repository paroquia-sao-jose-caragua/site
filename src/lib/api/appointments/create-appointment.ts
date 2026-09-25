import { api } from '../utils/api';
import type { Appointment, CreateAppointmentInput } from '@/entities/appointment';

interface CreateAppointmentResponse {
  message?: string;
  error?: string;
  appointment?: Appointment;
}

export const createAppointment = async (input: CreateAppointmentInput) => {
  const result = await api<CreateAppointmentResponse>('/appointments', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  if (result.statusCode >= 400 || !result.appointment) {
    throw new Error(result.error || result.message || 'Erro ao realizar agendamento.');
  }

  return result.appointment;
};
