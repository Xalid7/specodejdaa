import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "О компании",
  description: "ООО «ART PRINT AND TEXTILE» — производитель спецодежды, медицинской одежды и брендированной продукции в Ташкенте. Собственное производство с 2014 года.",
  keywords: ["спецодежда компания Ташкент", "производитель спецодежды Узбекистан", "о компании ООО «ART PRINT AND TEXTILE»"],
  alternates: { canonical: "https://www.specodejda.uz/about" },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
