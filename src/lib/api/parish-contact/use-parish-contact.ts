import { useQuery } from "@tanstack/react-query";
import { getParishContact } from "./get";
import type { ParishContact } from "@/entities/ParishContact";

export const useParishContact = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["parish-contact"],
    queryFn: getParishContact,
    refetchOnWindowFocus: false,
  });

  return {
    contact: data?.contact || null,
    isPending,
    error,
  };
};

export type { ParishContact };
