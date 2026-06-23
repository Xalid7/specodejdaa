import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TelegramFloat from '@/components/ui/TelegramFloat'

export const metadata: Metadata = {
  alternates: { canonical: "https://www.specodejda.uz" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "ART PRINT",
  "description": "Производство спецодежды, медицинской одежды, промотекстиля и брендированной продукции в Ташкенте",
  "url": "https://www.specodejda.uz",
  "telephone": "+998777416688",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ташкент",
    "addressCountry": "UZ"
  },
  "openingHours": "Mo-Sa 09:00-18:00",
  "priceRange": "$$",
  "sameAs": ["https://t.me/artprint_tashkent"]
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
      <TelegramFloat />
    </>
  )
}
