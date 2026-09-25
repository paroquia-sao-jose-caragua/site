import { api } from '../utils/api';
import type { PastoralAgent } from '@/entities/appointment';

export const getPastoralAgents = async (serviceId?: string) => {
  const query = serviceId ? `?serviceId=${serviceId}` : '';
  const result = await api<{ agents: PastoralAgent[] }>(`/pastoral-agents${query}`);
  return result.agents || [];
};
