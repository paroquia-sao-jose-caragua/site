import { api } from '@/lib/api/utils/api';
import type { Notice } from '@/entities/Notice';

interface GetActiveNoticesResponse {
  notices: Notice[];
}

export const getActiveNotices = async (): Promise<GetActiveNoticesResponse> => {
  return api<GetActiveNoticesResponse>('/notices/active');
};
