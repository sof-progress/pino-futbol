import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { PublicLayout } from "@/components/layout/PublicLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Pino Futbol - AIFB Río Gallegos",
  description: "Plataforma NO OFICIAL de la AIFB de Río Gallegos, Patagonia Argentina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.variable} ${outfit.variable} flex flex-col min-h-full bg-black text-brand-neon antialiased font-sans`}>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
