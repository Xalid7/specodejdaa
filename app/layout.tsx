import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: "ART PRINT — Спецодежда и Униформа в Ташкенте",
    template: "%s | ART PRINT",
  },
  description: "Производство спецодежды, медицинской одежды, промотекстиля и брендированной продукции на заказ в Ташкенте. Быстро, качественно, любой тираж.",
  keywords: [
    "спецодежда Ташкент", "спецодежда Узбекистан", "униформа на заказ", "рабочая одежда", "медицинская одежда", "защитная одежда", "корпоративная одежда", "форменная одежда", "производственная одежда", "комбинезон", "спецовка", "халат медицинский", "роба",
    "uniforma Toshkent", "uniforma buyurtma", "maxsus kiyim Toshkent", "maxsus kiyim Uzbekiston", "ish kiyimi", "tibbiy kiyim", "himoya kiyimi", "forma kiyim", "korporativ kiyim", "ishchi kiyim", "sport forma", "maktab formasi", "oshpaz kiyimi", "xavfsizlik kiyimi", "kombinezon", "yaktaklar",
    "Toshkent buyurtma", "Uzbekiston arzon", "sifatli kiyim", "narx",
    // Kalit so'zlar ro'yxati (ключевые слова.docx)
    "рабочая одежда", "униформа", "летняя рабочая одежда", "зимняя рабочая одежда", "комбинезон", "полукомбинезон",
    "одежда для охранника", "костюм охранника", "сигнальная жилетка", "жилетка", "промо текстиль", "медицинская одежда",
    "хирургическая форма", "поварская одежда", "фартуки", "одежда для горничных", "футболка", "сорочка поло", "рубашка",
    "брюки", "костюм рабочий", "кепка", "бейсболка", "шапка", "косынка", "толстовка", "свитшоты",
    "бязевые сумки", "эко сумка", "сумка из ткани", "постельное белье", "панама", "колпак", "подушка", "наволочка",
    "плед", "скатерть", "салфетка", "полотенце", "вафельное полотенце", "полотенце махровое", "перчатки", "рукавицы",
    "костюм сварщика", "дождевик", "подушка для туризма и путешествий", "платок", "шарф", "зонтики", "зонты", "маска",
    // Targetlangan kombinatsiyalar
    "униформа Ташкент", "рабочая одежда Ташкент", "медицинская одежда Ташкент", "поварская одежда на заказ",
    "промо текстиль Узбекистан", "костюм сварщика Ташкент", "сигнальная жилетка купить", "постельное белье оптом Ташкент",
    "эко сумка с логотипом", "пошив спецодежды Ташкент",
    "soqchi kiyimi", "fartuk", "ko'rpa-to'shak", "sochiq", "qo'lqop", "soyabon", "eko sumka"
  ],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "ART PRINT — Спецодежда и Униформа",
  image: "https://specodejda.uz/logo.png",
  "@id": "https://specodejda.uz",
  url: "https://specodejda.uz",
  telephone: "+998981210909",
  email: "info@specodejda.uz",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Бунёдкор шох куча, 29",
    addressLocality: "Ташкент",
    addressRegion: "Чиланзарский район",
    addressCountry: "UZ",
  },
  areaServed: "Узбекистан",
  description:
    "Производство спецодежды, рабочей и медицинской одежды, униформы, промотекстиля и брендированной продукции на заказ в Ташкенте.",
  sameAs: ["https://t.me/+998981210909"],
  makesOffer: [
    "Рабочая одежда", "Униформа", "Спецодежда", "Медицинская одежда", "Поварская одежда",
    "Одежда для охранника", "Промо текстиль", "Постельное белье", "Эко сумки", "Костюм сварщика",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name } })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
