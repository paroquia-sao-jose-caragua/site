import { useQuery } from "@tanstack/react-query";
import { getCommunityBySlug } from "./get";

export const useCommunityBySlug = (slug: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["community", slug],
    queryFn: () => getCommunityBySlug(slug),
    refetchOnWindowFocus: false,
    enabled: Boolean(slug),
  });

  return {
    community: data?.community,
    isPending,
    error,
  };
};
