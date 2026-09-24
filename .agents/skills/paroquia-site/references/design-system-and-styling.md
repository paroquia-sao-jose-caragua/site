# Sistema de Design e Estilização — Paróquia São José (Site)

Guia de estilo visual, paleta de cores litúrgica, tipografia e convenções de interface do site público.

---

## 1. Identidade Visual e Estética Sacra

O site transmite solenidade, acolhimento e reverência por meio de tons terrosos, pergaminho claro, dourado e cores litúrgicas da Igreja Católica.

### Paleta Principal de Cores

| Nome / Uso | Código Hex / Classes | Aplicação |
| :--- | :--- | :--- |
| **Fundo Primário (Pergaminho Claro)** | `#fbf6ee` / `bg-[#fbf6ee]` | Fundo principal da página (`<main>`) e seções abertas |
| **Fundo Secundário (Creme Acolhedor)**| `#f8f0e7` / `bg-[#f8f0e7]` | Fundo do layout base, cabeçalho e rodapé |
| **Texto Primário (Carvão Litúrgico)** | `#171717` / `text-[#171717]` | Títulos, textos corridos de alta legibilidade |
| **Texto Suave / Muted** | `#525252` / `#737373` / `text-stone-600` | Subtítulos, horários auxiliares, legendas |
| **Bordas e Divisores Sutis** | `#e7ded1` / `border-[#e7ded1]` | Divisores de seções e cartões |
| **Dourado Litúrgico (Accents & Buttons)** | `#d4a85c` / `#c89b43` / `hover:bg-[#e2bb76]` | Botões de ação, badges e destaques |
| **Vermelho Solene / Alerta Urgente** | `#701710` ➔ `#85261d` (Gradiente) | Faixa de aviso urgente, avisos de missas especiais |
| **Verde Litúrgico / Esperança** | `#0f2617` ➔ `#153422` (Gradiente) | Comunicados paroquiais e solenidades festivas |
| **Dourado / Solenidade** | `#523912` ➔ `#6e4e1a` (Gradiente) | Notificações de festas de padroeiros e solenidades |

---

## 2. Tipografia

O projeto utiliza o sistema de fontes do Next.js configurado no `src/app/layout.tsx`:

- **Lora (`lora.className`)**: Fonte serifada elegante aplicada ao `<body>` e utilizada em títulos (`<h1>`, `<h2>`, `<h3>`), conferindo o tom eclesiástico.
- **Geist Sans (`--font-geist-sans`)**: Fonte sem serifa moderna para leitura densa, formulários, botões, dados tabulares e chips.
- **Geist Mono (`--font-geist-mono`)**: Fonte monoespaçada para horários, códigos Pix e dados numéricos.
- **Cormorant Garamond**: Declarada como fallback no `globals.css` para estilos clássicos.

---

## 3. Tailwind CSS v4

O projeto utiliza a nova geração do Tailwind CSS v4 com imports diretos:

```css
@import "tailwindcss";

:root {
  --background: #fbf6ee;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

### Boas Práticas de Classes
- Prefira as variáveis temáticas e tons quentes (`stone-800`, `stone-600`, `amber-100`, `amber-400`).
- Evite cores primárias puras ou saturadas (evite `blue-500` genérico; use variações eclesiásticas).
- Para cards com bordas suaves: `rounded-2xl border border-[#e7ded1] bg-white shadow-sm`.
- Efeitos de hover elegantes: `transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`.

---

## 4. Componentes UI (Radix + Tailwind)

Localizados em `src/components/ui/`, baseados no padrão shadcn/ui:

- **Button (`button.tsx`)**: Variantes `default`, `outline`, `ghost`, `secondary`, com suporte a estados `disabled` e ícones `lucide-react`.
- **Dialog / Modal (`dialog.tsx`, `CommunityModal.tsx`, `UrgentAlertModal.tsx`)**: Modais acessíveis com backdrop escurecido, controle de foco e fechamento em tecla `Escape`.
- **Drawer (`drawer.tsx`)**: Gavetas deslizantes (Vaul) especialmente adaptadas para mobile.
- **Accordion (`accordion.tsx`)**: Para perguntas frequentes, detalhes pastorais e expansões de conteúdo.
- **Carousel (`carousel.tsx` / Embla)**: Carrossel com navegação por setas e suporte a gestos touch.
- **Badge (`badge.tsx`)**: Tags de status (ex: `AVISO URGENTE`, `COMUNICADO`, `SOLENIDADE`, `Missas de Domingo`).

---

## 5. Ícones e Recursos Gráficos

- **Lucide React (`lucide-react`)**: Ícones vetoriais modernos (`Calendar`, `Clock`, `MapPin`, `Phone`, `Mail`, `AlertTriangle`, `Sparkles`, etc.).
- **Ícones Customizados (`src/components/icons/`)**:
  - `CrossIcon.tsx`: Cruz latina estilizada usada em cabeçalhos, títulos de seção e detalhes de comunidades.
- **Imagens e Backgrounds Decorativos**:
  - `public/inicio/lady-of-fatima.png`: Marca d'água estilizada na seção do clero.
  - Imagens de capa de comunidades: Resolvidas via endpoint `/attachments/{id}` ou fallback local em `public/communities/`.
