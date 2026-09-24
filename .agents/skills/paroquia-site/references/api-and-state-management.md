# Integração com API e Gerenciamento de Estado

Guia de consumo de dados da API backend, hooks com TanStack Query e stores Zustand no site público.

---

## 1. Cliente HTTP Centralizado (`src/lib/api/utils/api.ts`)

Todas as chamadas à API da Paróquia devem ser feitas pelo utilitário `api()`, que injeta automaticamente cabeçalhos de internacionalização e fuso horário a partir da store do usuário:

```typescript
export const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL as string;

export const api = async <ResponseData, K extends string = never>(
  path: string,
  init?: RequestInit,
  options?: { apiBaseUrl?: string; retry?: boolean }
): Promise<ResponseData & { statusCode: number; message?: string }>
```

### Cabeçalhos Injetados Automaticamente
- `Accept-Language`: obtido de `useLocaleConfigStore.getState().lang` (padrão `pt-BR`).
- `X-Timezone`: `America/Sao_Paulo`.
- `X-Timezone-Offset`: Offset atual em minutos/formato horário.
- `Content-Type`: `application/json`.

---

## 2. Estrutura dos Módulos de API (`src/lib/api/<feature>/`)

Cada recurso do backend possui sua respectiva pasta em `src/lib/api/`:

```text
src/lib/api/communities/
├── get.ts               # Chamada GET por slug ou ID
├── list.ts              # Chamada GET de listagem com revalidação
├── use-communities.ts   # Hook React Query + sincronização com Zustand
└── use-community-by-slug.ts
```

### Exemplo de Função Fetcher (`list.ts`)

```typescript
import type { Community } from "@/entities/Community";
import { communityApi } from "../utils/communityApi";

interface ListCommunitiesResponse {
  communities: Community[];
}

export const listCommunities = async () => {
  return await communityApi<ListCommunitiesResponse>("/", {
    method: "GET",
    next: { revalidate: 300 }, // Cache por 5 minutos no Next.js
  });
};
```

---

## 3. Padrão de Hooks TanStack Query (`useQuery`)

Os hooks encapsulam a chamada e sincronizam o cache do TanStack Query com as stores globais quando necessário:

```typescript
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { listCommunities } from "./list";
import useCommunitiesStore from "@/stores/useCommunitiesStore";

export const useCommunities = () => {
  const { communities, setCommunities } = useCommunitiesStore();

  const { data, isPending, error } = useQuery({
    queryKey: ["communities"],
    queryFn: listCommunities,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.communities) {
      setCommunities(data.communities);
    }
  }, [data?.communities, setCommunities]);

  return { communities: data?.communities ?? communities, isPending, error };
};
```

---

## 4. Stores Globais com Zustand (`src/stores/`)

O Zustand é utilizado para dados compartilhados entre múltiplas seções ou modais:

### 4.1. Store de Comunidades (`useCommunitiesStore.ts`)
Mantém a lista de comunidades carregadas para evitar refetch desnecessário em modais de navegação, seletores e mapas.

### 4.2. Store de Configuração Local (`useLocaleConfigStore.ts`)
Guarda informações de timezone e idioma preferido do visitante:
```typescript
{
  lang: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  timezoneOffset: '-03:00'
}
```

---

## 5. Resolução de URLs de Imagens / Anexos (Cloudflare R2)

Para exibir fotos, capas de comunidades e imagens de avisos urgentes vindas do Cloudflare R2:

```typescript
export const getAttachmentUrl = (idOrUrl?: string | null): string => {
  if (!idOrUrl) return "/images/placeholder.jpg";
  if (idOrUrl.startsWith("http") || idOrUrl.startsWith("/")) {
    return idOrUrl;
  }
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3333";
  return `${apiBaseUrl}/attachments/${idOrUrl}`;
};
```

Regras:
1. Se a API já enviar `coverUrl`, utilize diretamente.
2. Se a entidade possuir apenas `coverId` (ULID), resolva com `${apiBaseUrl}/attachments/${coverId}`.
3. Forneça fallbacks locais em `public/` para evitar quebras visuais em modo offline/desenvolvimento.
