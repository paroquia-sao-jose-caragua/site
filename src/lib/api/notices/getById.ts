import { api } from '@/lib/api/utils/api';
import type { Notice } from '@/entities/Notice';

interface GetNoticeByIdResponse {
  notice: Notice;
}

export const getNoticeById = async (id: string): Promise<GetNoticeByIdResponse> => {
  return api<GetNoticeByIdResponse>(`/notices/${id}`);
};
