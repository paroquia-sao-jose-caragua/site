import { useQuery } from "@tanstack/react-query";
import { listClergy, type ApiClergyMember } from "./list";

export const useClergy = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["clergy"],
    queryFn: listClergy,
    refetchOnWindowFocus: false,
  });

  return {
    clergy: data?.clergy || [],
    isPending,
    error,
  };
};

export type { ApiClergyMember };
