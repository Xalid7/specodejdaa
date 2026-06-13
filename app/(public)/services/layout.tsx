import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Услуги",
  description: "Услуги ART PRINT: шелкография, вышивка, УФ-печать, сублимация, лазерная гравировка, тиснение. Нанесение логотипа на одежду в Ташкенте.",
  keywords: ["нанесение логотипа Ташкент", "шелкография Узбекистан", "вышивка на одежде", "УФ печать", "брендирование одежды"],
  alternates: { canonical: "https://specodejda.uz/services" },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
