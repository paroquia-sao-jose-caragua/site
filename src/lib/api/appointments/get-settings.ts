import { api } from '../utils/api';

export interface AppointmentSettings {
  id: string;
  enabled: boolean;
  suspendedTitle: string;
  suspendedMessage: string;
  updatedAt?: string;
}

export const getAppointmentSettings = async (): Promise<AppointmentSettings> => {
  const result = await api<{ settings: AppointmentSettings }>('/appointment-settings');
  return result.settings;
};
