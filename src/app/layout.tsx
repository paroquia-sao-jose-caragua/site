import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google"; // Importação adicionada
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import AppProvider from "@/providers/AppProvider";

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

export const metadata: Metadata = {
  title: "Paróquia São José - Caraguatatuba",
  description:
    "Site oficial da Paróquia São José, localizada em Caraguatatuba. Encontre informações sobre missas, eventos, sacramentos e atividades comunitárias. Junte-se a nós para celebrar a fé e fortalecer nossa comunidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.className} antialiased`}
      >
        <AppProvider>
          <div className="min-h-screen flex flex-col bg-white">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
