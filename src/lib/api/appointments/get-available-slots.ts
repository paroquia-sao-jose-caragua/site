import { api } from '../utils/api';
import type { AvailableSlot } from '@/entities/appointment';

interface GetAvailableSlotsParams {
  agentId: string;
  date: string;
  serviceId?: string;
}

interface AvailableSlotsResponse {
  date: string;
  dayOfWeek: number;
  slots: AvailableSlot[];
}

export const getAvailableSlots = async ({
  agentId,
  date,
  serviceId,
}: GetAvailableSlotsParams) => {
  const searchParams = new URLSearchParams({
    agentId,
    date,
  });
  if (serviceId) searchParams.append('serviceId', serviceId);

  const result = await api<AvailableSlotsResponse>(
    `/appointments/available-slots?${searchParams.toString()}`
  );

  return result.slots || [];
};
