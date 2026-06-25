import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог спецодежды и брендированной продукции ООО «ART PRINT AND TEXTILE». Рабочая одежда, медицинская форма, промотекстиль — заказать в Ташкенте.",
  keywords: ["каталог спецодежды", "купить спецодежду Ташкент", "рабочая одежда заказать", "медицинская форма Узбекистан"],
  alternates: { canonical: "https://www.specodejda.uz/catalog" },
}

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children
}
