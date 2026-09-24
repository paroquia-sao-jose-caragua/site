---
name: paroquia-site
description: >-
  Use this skill when developing, refactoring, styling, extending, or maintaining the Paróquia São José public frontend website
  (built with Next.js 16 App Router, React 19, Tailwind CSS 4, Radix UI, TanStack React Query, Zustand, OpenNext, and Cloudflare Workers).
  It enforces the project's ecclesiastical liturgical design system, API integration patterns, component hierarchy,
  state management, SEO standards, and Cloudflare OpenNext deployment guidelines.
---

# Paróquia São José Site — Frontend Architecture & Development Skill

Guia operacional para desenvolvimento, estilização e manutenção do site institucional da Paróquia São José de Caraguatatuba.

---

## 1. Visão Geral do Projeto

O site institucional é uma aplicação moderna desenvolvida com **Next.js 16 (App Router)** e **React 19**, adaptada para execução na edge da **Cloudflare** utilizando **OpenNext** (`@opennextjs/cloudflare`).

- **Framework**: Next.js 16.2+ com Turbopack em desenvolvimento (`next dev --turbopack`).
- **Runtime de Produção**: Cloudflare Workers via OpenNext.
- **Estilização**: Tailwind CSS v4 com paleta eclesiástica calorosa (tons de pergaminho, dourado litúrgico, vermelho solene e verde esperança).
- **Componentes**: Primitivas Radix UI estilizadas no padrão shadcn/ui (`src/components/ui/`).
- **Tipografia**: Lora (títulos serifados clássicos), Geist Sans e Geist Mono.
- **Data Fetching**: TanStack React Query v5 (`useQuery`) integrado com o cliente HTTP centralizado em `src/lib/api/utils/api.ts`.
- **Estado Global**: Zustand (`src/stores/`).
- **Envio de E-mails**: API Route interna (`src/app/api/contact/route.ts`) integrada com Resend.

---

## 2. Princípios e Regras Fundamentais

1. **Estética Sacra e Acolhedora**:
   - Utilize as cores do tema: fundo pergaminho (`#fbf6ee`), layout creme (`#f8f0e7`), texto escuro legível (`#171717`) e acentos em dourado litúrgico (`#d4a85c`).
   - Evite cores saturadas ou temas tecnológicos frios (como azuis fluorescentes ou cinzas neutros de dashboard).
2. **Cliente HTTP Centralizado**:
   - Sempre utilize `api()` de `@/lib/api/utils/api.ts` (ou helpers específicos como `communityApi`) para chamadas à API da Paróquia.
   - Cabeçalhos de idioma e fuso horário (`America/Sao_Paulo`) são injetados automaticamente a partir da store de configuração.
3. **Consistência de Cache e Dados**:
   - Novas consultas à API devem ser encapsuladas em funções tipadas dentro de `src/lib/api/<feature>/` com respectivo hook React Query em `use-<feature>.ts`.
   - Utilize a flag `next: { revalidate: <segundos> }` nas funções fetchers para balancear atualização e desempenho na edge.
4. **React 19 & App Router**:
   - Parâmetros dinâmicos de rota (`params`) são tratados como Promises. Utilize `const { slug } = use(params);` em Client Components.
   - Mantenha componentes puramente de layout/conteúdo como Server Components; use `"use client"` apenas onde houver estado, efeitos ou interações de navegador.
5. **Resolução de Imagens da API (R2)**:
   - Capas e fotos vindas da API podem conter `coverUrl` direta ou apenas `coverId` (ULID).
   - Utilize a resolução(`${apiBaseUrl}/attachments/${coverId}`) com fallback para imagens estáticas de `public/` caso a imagem não exista.

---

## 3. Estrutura do Workspace

```text
src/
├── @types/          # Tipos e extensões globais
├── app/             # Rotas e páginas do Next.js App Router
│   ├── (inicio)/    # Home page da Paróquia ("/")
│   ├── agenda/      # Calendário e horários de missas
│   ├── clerigos/    # Apresentação do clero
│   ├── comunidades/ # Informações e detalhes por comunidade ([slug])
│   ├── contato/     # Formulário de contato
│   ├── liturgia/    # Liturgia diária
│   ├── quero-contribuir/ # Dízimo e doações via Pix
│   ├── api/contact/ # Rota de e-mail via Resend
│   ├── globals.css  # Configuração Tailwind v4 e estilos globais
│   ├── layout.tsx   # Layout raiz, fontes e provedores
│   ├── robots.ts    # Configuração de SEO para robôs
│   └── sitemap.ts   # Sitemap XML dinâmico
├── components/      # Componentes de seção, modais e layouts
│   ├── icons/       # Ícones SVG personalizados (CrossIcon, etc.)
│   ├── seo/         # Schema JSON-LD (ParishSchema)
│   └── ui/          # Componentes Radix / shadcn (Button, Dialog, etc.)
├── data/            # Dados locais de fallback e mock
├── entities/        # Tipos TypeScript das entidades do domínio
├── lib/
│   ├── api/         # Módulos de consumo da API externa
│   └── utils/       # Formatadores (datas, missas, etc.)
├── providers/       # Provedores React (QueryClientProvider, etc.)
├── stores/          # Stores Zustand (useCommunitiesStore, useLocaleConfigStore)
└── utils/           # Utilitários gerais (Pix, formatação litúrgica)
```

---

## 4. Documentos de Referência Detalhados

Consulte os guias especializados na pasta `references/` para implementar ou estilizar componentes:

- **[Sistema de Design e Estilização](./references/design-system-and-styling.md)**: Paleta de cores litúrgica, tipografia, Tailwind v4 e componentes Radix.
- **[Integração com API e Estado](./references/api-and-state-management.md)**: Cliente HTTP, hooks TanStack Query, Zustand stores e resolução de anexos R2.
- **[Arquitetura de Componentes e Rotas](./references/component-architecture-and-routes.md)**: App Router, Server vs Client components, SEO/JSON-LD e envio de contato.

---

## 5. Comandos e Procedimentos Frequentes

### Desenvolvimento Local
```bash
# Iniciar servidor de desenvolvimento com Turbopack (porta padrão 3000)
npm run dev

# Gerar tipos do ambiente Cloudflare
npm run cf-typegen

# Executar verificação de linting
npm run lint
```

### Build e Preview Cloudflare
```bash
# Build de produção do Next.js
npm run build

# Build do OpenNext e preview local no runtime Cloudflare Workers
npm run preview
```

### Deploy
```bash
# Publicar no ambiente de Homologação (staging.paroquiasaojosecaragua.org.br)
npm run deploy:staging

# Publicar no ambiente de Produção (paroquiasaojosecaragua.org.br)
npm run deploy
```
