import type { Community } from "@/entities/Community";
import { communityApi } from "../utils/communityApi";

interface GetCommunityResponse {
  community: Community;
}

export const getCommunityBySlug = async (slug: string) => {
  const result = await communityApi<GetCommunityResponse>(`/${slug}`, {
    method: "GET",
    next: { revalidate: 60 },
  });

  return result;
};
