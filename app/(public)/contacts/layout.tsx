import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с ART PRINT — производителем спецодежды в Ташкенте. Телефон, адрес, Telegram. Бесплатный расчёт стоимости заказа.",
  keywords: ["контакты спецодежда Ташкент", "заказать спецодежду", "ART PRINT телефон"],
  alternates: { canonical: "https://specodejda.uz/contacts" },
}

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children
}
