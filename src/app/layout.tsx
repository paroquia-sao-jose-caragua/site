import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import AppProvider from "@/providers/AppProvider";
import { ParishSchema } from "@/components/seo/ParishSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const isProduction = process.env.APP_ENV === "production";

export const metadata: Metadata = {
  title: {
    default: "Paróquia São José | Caraguatatuba - SP",
    template: "%s | Paróquia São José",
  },

  description:
    "Site oficial da Paróquia São José em Caraguatatuba - SP. Consulte horários de missas, agenda de celebrações, eventos, sacramentos, comunidades e informações da nossa paróquia.",

  keywords: [
    "Paróquia São José",
    "Igreja São José Caraguatatuba",
    "Missa Caraguatatuba",
    "Horário de missa Caraguatatuba",
    "Comunidade católica Caraguatatuba",
    "Agenda paroquial",
  ],

  authors: [
    {
      name: "Paróquia São José",
    },
  ],

  creator: "Paróquia São José",

  metadataBase: new URL("https://paroquiasaojosecaragua.org.br"),

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://paroquiasaojosecaragua.org.br",
    siteName: "Paróquia São José",

    title: "Paróquia São José | Caraguatatuba - SP",

    description:
      "Acompanhe horários de missas, eventos, celebrações e tudo que acontece na comunidade da Paróquia São José.",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Paróquia São José - Caraguatatuba",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Paróquia São José | Caraguatatuba - SP",
    description:
      "Horários de missas, eventos e informações da comunidade paroquial.",

    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },

  alternates: {
    canonical: "https://paroquiasaojosecaragua.org.br",
  },

  robots: isProduction
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
          "max-video-preview": -1,
          "max-image-preview": "none",
          "max-snippet": -1,
        },
      },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.className} antialiased`}
      >
        <ParishSchema />

        <AppProvider>
          <div className="min-h-screen flex flex-col bg-[#f8f0e7]">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
