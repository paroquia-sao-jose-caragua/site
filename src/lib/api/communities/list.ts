import { communityApi } from "../utils/communityApi";

interface ListCommunitiesResponse {
  communities: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    type: "parish_church" | "chapel";
    address: string;
    coverId: string;
    coverUrl: string;
  }[];
}

export const listCommunities = async () => {
  const result = await communityApi<ListCommunitiesResponse>("/", {
    method: "GET",
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  });

  return result;
};
