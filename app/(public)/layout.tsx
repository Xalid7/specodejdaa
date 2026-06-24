import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  alternates: { canonical: "https://www.specodejda.uz" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": "https://www.specodejda.uz",
  "name": "ART PRINT — Спецодежда и Униформа",
  "description": "Производство спецодежды, рабочей и медицинской одежды, униформы, промотекстиля и брендированной продукции на заказ в Ташкенте.",
  "url": "https://www.specodejda.uz",
  "image": "https://www.specodejda.uz/logo.png",
  "telephone": "+998981210909",
  "email": "info@specodejda.uz",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Бунёдкор шох куча, 29",
    "addressLocality": "Ташкент",
    "addressRegion": "Чиланзарский район",
    "addressCountry": "UZ"
  },
  "areaServed": "Узбекистан",
  "openingHours": "Mo-Sa 09:00-18:00",
  "priceRange": "$$",
  "sameAs": ["https://t.me/+998981210909"],
  "knowsAbout": [
    "Рабочая одежда", "Униформа", "Спецодежда", "Медицинская одежда", "Поварская одежда",
    "Одежда для охранника", "Промотекстиль", "Постельное белье", "Эко сумки", "Костюм сварщика"
  ]
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
