import { api } from '@/lib/api/utils/api';
import type { UrgentAlert } from '@/entities/UrgentAlert';

interface GetActiveUrgentAlertResponse {
  alert: UrgentAlert | null;
}

export const getActiveUrgentAlert = async (): Promise<GetActiveUrgentAlertResponse> => {
  const result = await api<GetActiveUrgentAlertResponse>('/urgent-alert/active');
  return result;
};
