import { api } from '../utils/api';
import type { AppointmentService } from '@/entities/appointment';

export const getAppointmentServices = async () => {
  const result = await api<{ services: AppointmentService[] }>('/appointment-services');
  return result.services || [];
};
