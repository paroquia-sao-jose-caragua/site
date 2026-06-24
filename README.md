# Site Institucional da Paróquia São José

Projeto do site institucional da Paróquia São José, em Caraguatatuba/SP. A aplicação publica informações da paróquia, comunidades, agenda, horários de missas, formas de contribuição e canal de contato.

## Tecnologias utilizadas

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI
- Zustand
- TanStack React Query
- OpenNext para Cloudflare
- Cloudflare Workers e Wrangler
- Resend para envio de mensagens do formulário de contato

## Manual de instalação

### Pré-requisitos

- Node.js 20 ou superior
- npm
- Conta Cloudflare configurada, apenas para preview/deploy em ambiente Cloudflare
- Chave da API Resend, apenas para envio real de e-mails pelo formulário de contato

### Passo a passo

1. Acesse a pasta do projeto:

```bash
cd site
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

4. Ajuste as variáveis no arquivo `.env`:

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:3001
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL="Paróquia São José <contato@seudominio.com.br>"
CONTACT_EMAIL_TO=secretaria@seudominio.com.br
```

5. Para testar localmente com o runtime da Cloudflare, também copie o arquivo de variáveis do Wrangler:

```bash
cp .dev.vars.example .dev.vars
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

7. Abra o site no navegador:

```text
http://localhost:3000
```

## Scripts disponíveis

| Script | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento com Next.js e Turbopack. |
| `npm run build` | Gera a build de produção do Next.js. |
| `npm run start` | Executa a build de produção localmente. |
| `npm run lint` | Executa a verificação de padrão do código. |
| `npm run preview` | Gera a build OpenNext e executa preview local no runtime Cloudflare. |
| `npm run deploy:staging` | Publica a aplicação no ambiente de homologação. |
| `npm run deploy` | Publica a aplicação no ambiente de produção. |
| `npm run upload` | Gera e envia a build OpenNext para a Cloudflare. |
| `npm run cf-typegen` | Gera os tipos TypeScript do ambiente Cloudflare. |

## Estrutura do projeto

```text
site/
├── public/                  # Imagens, ícones e arquivos estáticos
├── src/
│   ├── app/                 # Rotas, páginas e API routes do Next.js
│   ├── components/          # Componentes visuais reutilizáveis
│   ├── data/                # Dados locais usados na interface
│   ├── entities/            # Esquemas TypeScript do domínio
│   ├── lib/api/             # Cliente HTTP e funções de acesso à API
│   ├── providers/           # Provedores globais da aplicação
│   └── stores/              # Estados globais com Zustand
├── .env.example             # Exemplo de variáveis locais
├── .dev.vars.example        # Exemplo de variáveis para Wrangler
├── next.config.ts           # Configuração do Next.js
├── open-next.config.ts      # Configuração do OpenNext
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração TypeScript
└── wrangler.jsonc           # Configuração de deploy Cloudflare
```

## Esquemas

Os principais esquemas de dados do site estão definidos em `src/entities`.

### Comunidade

```ts
export type Community = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  type: "parish_church" | "chapel";
  address: string;
  coverId: string;
  coverUrl: string;
};
```

### Agenda

```ts
export type CalendarSchedule = {
  date: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dayOfWeekLabel: string;
  schedules: {
    active: Schedule[];
    exceptions: ExceptionSchedule[];
  };
};
```

### Exceção de horário de missa

```ts
export type MassScheduleException = {
  id: string;
  scheduleId: string;
  exceptionDate: string;
  startTime: string;
  reason: string;
  createdBy: string;
  createdAt: string;
};
```

## Códigos principais

### Cliente HTTP

O arquivo `src/lib/api/utils/api.ts` centraliza as chamadas HTTP para a API, incluindo idioma e fuso horário nos cabeçalhos.

```ts
export const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL as string;

export const api = async <ResponseData, K extends string = never>(
  path: string,
  init?: RequestInit,
  options?: {
    apiBaseUrl?: string;
    retry?: boolean;
  },
) => {
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
  const data = await response.json();

  return { ...data, statusCode: response.status };
};
```

### Rotas de consulta

As funções abaixo organizam o acesso aos recursos da API externa.

```ts
export const communityApi = async <ResponseData, K extends string = never>(
  path = "",
  init?: RequestInit
) => api<ResponseData, K>(`/communities${path}`, init);

export const calendarApi = async <ResponseData, K extends string = never>(
  path = "",
  init?: RequestInit
) => api<ResponseData, K>(`/calendar${path}`, init);
```

### Formulário de contato

A rota `src/app/api/contact/route.ts` recebe mensagens do formulário, valida os campos e envia e-mail pelo Resend.

```ts
export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!resendApiKey || !from || !to) {
    return NextResponse.json(
      { message: "Serviço de e-mail não configurado." },
      { status: 500 }
    );
  }

  const payload = await request.json();

  return NextResponse.json({ ok: true });
}
```

## Páginas do site

- `/`: página inicial com apresentação da paróquia, destaques, clero e comunidades.
- `/agenda`: agenda paroquial com missas, eventos e exceções de horário.
- `/contato`: formulário de contato enviado por e-mail.
- `/quero-contribuir`: página com informações para contribuição.
- `/api/contact`: rota interna usada pelo formulário de contato.

## Deploy

O deploy é configurado pelo arquivo `wrangler.jsonc`.

- Homologação: `staging.paroquiasaojosecaragua.org.br`
- Produção: `paroquiasaojosecaragua.org.br`

Para publicar em homologação:

```bash
npm run deploy:staging
```

Para publicar em produção:

```bash
npm run deploy
```

## Licença

Este projeto é distribuído sob a licença GNU General Public License v3.0. Consulte o arquivo `LICENSE` para o texto completo da licença.
