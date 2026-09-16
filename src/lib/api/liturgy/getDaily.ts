import { api } from "../utils/api";

export type DailyLiturgyResponse = {
  date: string;
  displayDate: string;
  liturgy: string;
  color: string;
  firstReading: {
    reference: string;
    title: string;
    text: string;
  };
  secondReading?: {
    reference: string;
    title: string;
    text: string;
  } | null;
  psalm: {
    reference: string;
    response: string;
    text: string;
  };
  gospel: {
    reference: string;
    title: string;
    text: string;
  };
  reflection?: {
    text: string;
  } | null;
  saint?: {
    name: string;
    description: string;
    image?: string | null;
  } | null;
};

export async function getDailyLiturgy(date?: string) {
  const query = date ? `?date=${date}` : "";
  return api<DailyLiturgyResponse>(`/liturgy${query}`);
}
