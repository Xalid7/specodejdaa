import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: "ART PRINT — Спецодежда и Униформа в Ташкенте",
    template: "%s | ART PRINT",
  },
  description: "Производство спецодежды, медицинской одежды, промотекстиля и брендированной продукции на заказ в Ташкенте. Быстро, качественно, любой тираж.",
  keywords: ["спецодежда Ташкент", "униформа на заказ", "спецодежда Узбекистан", "maxsus kiyim Toshkent", "рабочая одежда", "медицинская одежда", "брендированная одежда"],
  authors: [{ name: "ART PRINT" }],
  creator: "ART PRINT",
  metadataBase: new URL("https://specodejda.uz"),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "ART PRINT",
    title: "ART PRINT — Спецодежда и Униформа в Ташкенте",
    description: "Производство спецодежды, медицинской одежды, промотекстиля и брендированной продукции на заказ в Ташкенте.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
