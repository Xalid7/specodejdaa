import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с ООО «ART PRINT AND TEXTILE» — производителем спецодежды в Ташкенте. Телефон, адрес, Telegram. Бесплатный расчёт стоимости заказа.",
  keywords: ["контакты спецодежда Ташкент", "заказать спецодежду", "ООО «ART PRINT AND TEXTILE» телефон"],
  alternates: { canonical: "https://www.specodejda.uz/contacts" },
}

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children
}
