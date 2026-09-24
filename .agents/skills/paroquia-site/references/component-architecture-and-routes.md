# Arquitetura de Componentes, Rotas e SEO — Next.js 16 (Site)

Guia de organização do Next.js App Router, componentes, formulários e boas práticas de SEO.

---

## 1. Estrutura de Rotas (Next.js 16 App Router)

```text
src/app/
├── (inicio)/               # Grupo de rota da Home Page (URL raiz "/")
│   └── page.tsx            # Composição das seções da página inicial
├── agenda/                 # Página da agenda paroquial consolidada
│   └── page.tsx
├── clerigos/               # Página biográfica do clero paroquial
│   └── page.tsx
├── comunidades/            # Índice de comunidades
│   ├── page.tsx            # Redireciona para "/#comunidades"
│   └── [slug]/             # Página detalhada de cada comunidade
│       └── page.tsx
├── contato/                # Formulário de contato com a secretaria
│   └── page.tsx
├── liturgia/               # Liturgia diária católica
│   └── page.tsx
├── quero-contribuir/       # Informações sobre dízimo, ofertas e Pix
│   └── page.tsx
├── api/contact/route.ts    # Endpoint interno de envio de e-mails via Resend
├── globals.css             # Configurações globais de CSS e Tailwind v4
├── layout.tsx              # Root Layout, fontes e provedores
├── robots.ts               # Configuração dinâmica de robots.txt
└── sitemap.ts              # Geração dinâmica do sitemap XML
```

---

## 2. Server Components vs. Client Components

- **Server Components (Padrão)**:
  - Utilize para páginas com conteúdo estático ou geração de metadados (`layout.tsx`, páginas de redirecionamento, sitemap, robots).
  - Garante alta performance no primeiro carregamento e excelente indexação por motores de busca.
- **Client Components (`"use client"`)**:
  - Obrigatórios quando o componente utiliza hooks (`useState`, `useEffect`, `useQuery`), eventos do usuário (`onClick`, `onChange`) ou APIs do navegador (`sessionStorage`, `navigator.clipboard`).
  - Mantenha a fronteira `"use client"` o mais baixa possível na árvore de componentes.

### React 19: Desempacotamento de Parâmetros de Rota (`params`)
No Next.js 16 com React 19, `params` é uma `Promise`. Em Client Components, utilize o hook `use()` para desempacotar:

```typescript
"use client";

import { use } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CommunityPage({ params }: PageProps) {
  const { slug } = use(params);
  // ...
}
```

---

## 3. SEO e Dados Estruturados (JSON-LD)

O projeto prioriza indexação no Google para termos como *"Missa em Caraguatatuba"*, *"Paróquia São José"* e nomes de comunidades:

1. **Metadados Globais (`src/app/layout.tsx`)**:
   - `title.default` e `title.template` (`%s | Paróquia São José`).
   - `description`, `keywords`, `openGraph` e `twitter` tags.
   - `metadataBase: new URL("https://paroquiasaojosecaragua.org.br")`.
   - `robots`: indexação habilitada em produção e bloqueada com `noindex` em desenvolvimento/staging.
2. **Schema.org Católico (`src/components/seo/ParishSchema.tsx`)**:
   - Injeta JSON-LD com `@type: "CatholicChurch"`.
   - Informa endereço físico em Caraguatatuba, coordenadas geográficas, telefone e horários de celebração.
3. **Sitemap (`src/app/sitemap.ts`)**:
   - Gera rotas estáticas (`/`, `/agenda`, `/contato`, `/quero-contribuir`, `/liturgia`, `/clerigos`) e rotas dinâmicas de cada comunidade registrada.

---

## 4. Modais e Interações

Os modais são organizados como componentes dedicados em `src/components/`:
- **`UrgentAlertModal.tsx`**: Exibe o comunicado completo de avisos urgentes com imagem, descrição formatada e botão de ação externo.
- **`DirectionsModal.tsx`**: Apresenta rota, endereço detalhado e horário de atendimento de secretaria de cada capela.
- **`ScheduleModal.tsx`**: Exibe tabela detalhada de horários de missas semanais e celebrações.
- **`CommunityModal.tsx`**: Visualização rápida da comunidade sem sair da página inicial.

Convenções de UX:
- Salvar dismissals em `sessionStorage` quando o usuário dispensar avisos para não reexibir na mesma sessão de navegação.
- Animar abertura e fechamento com transições suaves (`transition-opacity`, `ease-out`).

---

## 5. Rota de Contato com Resend (`src/app/api/contact/route.ts`)

- Rota interna de API executada na edge.
- Valida campos obrigatórios (`name`, `email`, `phone`, `subject`, `message`).
- Utiliza a API do [Resend](https://resend.com) via `fetch("https://api.resend.com/emails")` com `RESEND_API_KEY`.
- Envia a notificação para `CONTACT_EMAIL_TO` configurada nas variáveis de ambiente.
