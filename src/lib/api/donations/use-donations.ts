import { useQuery } from "@tanstack/react-query";
import { getDonationsInfo } from "./get";
import type { DonationsInfo } from "@/entities/DonationsInfo";

export const useDonations = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["donations-info"],
    queryFn: getDonationsInfo,
    refetchOnWindowFocus: false,
  });

  return {
    donations: data?.donations || null,
    isPending,
    error,
  };
};

export type { DonationsInfo };
