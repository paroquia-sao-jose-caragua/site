import useLocaleConfigStore from "@/stores/useLocaleConfigStore";

export const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL as string;

interface ResponseErrorFields<K extends string> {
  errors?: {
    field: K;
    message: string;
  }[];
}

export const api = async <ResponseData, K extends string = never>(
  path: string,
  init?: RequestInit,
  options?: {
    apiBaseUrl?: string;
    retry?: boolean;
  },
): Promise<
  ResponseErrorFields<K> &
    ResponseData & {
      statusCode: number;
      message?: string;
    }
> => {
  const { lang, timezoneOffset, timezone } = useLocaleConfigStore.getState();

  const endpoint = `${options?.apiBaseUrl || apiBaseUrl}${path}`;

  const headers = {
    "Accept-Language": lang,
    "Content-Type": "application/json",
    "X-Timezone-Offset": timezoneOffset,
    "X-Timezone": timezone,
    ...init?.headers,
  };

  const response = await fetch(endpoint, { ...init, headers });
  const data = (await response.json()) as ResponseErrorFields<K> & ResponseData;

  return { ...data, statusCode: response.status };
};
