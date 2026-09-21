import type { Community } from "@/entities/Community";
import { communityApi } from "../utils/communityApi";

interface ListCommunitiesResponse {
  communities: Community[];
}

export const listCommunities = async () => {
  const result = await communityApi<ListCommunitiesResponse>("/", {
    method: "GET",
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  });

  return result;
};
