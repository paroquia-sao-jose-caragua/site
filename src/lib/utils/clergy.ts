import { apiBaseUrl } from "@/lib/api/utils/api";

export interface ClergyPhotoResolvable {
  photoUrl?: string | null;
  photoId?: string | null;
  position?: string | null;
}

export const getClergyFallbackPhoto = (position?: string | null) => {
  if (position === "parish_priest") return "/clergies/paroco.png";
  if (position === "permanent_deacon") return "/clergies/diacono.png";
  if (position === "diocesan_bishop") return "/clergies/bispo.png";
  if (position === "supreme_pontiff") return "/clergies/papa.png";
  return "/clergies/paroco.png";
};

export const getClergyPhotoUrl = (member: ClergyPhotoResolvable) => {
  if (member.photoUrl) return member.photoUrl;

  if (member.photoId) {
    if (
      member.photoId.startsWith("http://") ||
      member.photoId.startsWith("https://") ||
      member.photoId.startsWith("/")
    ) {
      return member.photoId;
    }
    return `${apiBaseUrl}/attachments/${member.photoId}`;
  }

  return getClergyFallbackPhoto(member.position);
};

export const getClergyRoleLabel = (
  position?: string | null,
  roleName?: string | null,
  title?: string | null,
) => {
  if (roleName) return roleName;
  if (title && title !== "Padre" && title !== "Dom" && title !== "Diácono") return title;

  switch (position) {
    case "parish_priest":
      return "Pároco";
    case "permanent_deacon":
      return "Diácono Permanente";
    case "diocesan_bishop":
      return "Bispo Diocesano";
    case "supreme_pontiff":
      return "Sumo Pontífice";
    case "vicar":
      return "Vigário Paroquial";
    default:
      return "Ministro Ordenado";
  }
};
