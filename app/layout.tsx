import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "ART PRINT — Maxsus kiyim ishlab chiqarish",
  description: "O'zbekistonda maxsus kiyim, uniform va brendlangan mahsulotlar ishlab chiqaruvchi kompaniya",
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
