import { useClergy, type ApiClergyMember } from "./use-clergy";

export const useClergyBySlug = (slug: string) => {
  const { clergy, isPending, error } = useClergy();
  const member = clergy.find((item) => item.slug === slug);

  return {
    member: member || null,
    otherClergy: clergy.filter((item) => item.slug !== slug),
    allClergy: clergy,
    isPending,
    error,
  };
};

export type { ApiClergyMember };
