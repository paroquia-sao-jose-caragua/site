import { api } from "../utils/api";

export interface ApiClergyMember {
  id: string;
  title?: string | null;
  name: string;
  slug: string;
  position: string;
  roleName?: string | null;
  shortIntro?: string | null;
  bio?: string | null;
  orderIndex?: number;
  isMain?: boolean;
  photoId?: string | null;
  photoUrl?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

interface ListClergyResponse {
  clergy: ApiClergyMember[];
}

export const listClergy = async () => {
  const result = await api<ListClergyResponse>("/clergy");
  return result;
};
