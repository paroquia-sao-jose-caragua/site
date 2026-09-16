import { api } from "../utils/api";
import type { Announcement } from "@/entities/Announcement";

export async function listActiveAnnouncements() {
  console.log('listActiveAnnouncements')
  return api<{ announcements: Announcement[] }>("/announcements/active");
}
