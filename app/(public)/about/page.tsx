'use client'
import { useEffect, useState } from 'react'

const services = [
  {
    icon: '🦺',
    ru: 'Спецодежда и СИЗ: всесезонные комплекты, камуфляж, химзащита, электрозащита',
    uz: 'Maxsus kiyim va SHV: barcha fasl to\'plamlari, kamuflaj, kimyoviy himoya, elektr himoya',
  },
  {
    icon: '👕',
    ru: 'Брендированный мерч: футболки, поло, худи, кепки, сумки и промо-продукция',
    uz: 'Brendlangan merch: futbolkalar, polo, xudi, kepkalar, sumkalar va promo-mahsulotlar',
  },
  {
    icon: '🩺',
    ru: 'Медицинская одежда: халаты, хирургическая форма, одноразовая одежда, колпаки',
    uz: 'Tibbiy kiyim: xalatlar, jarrohlik formasi, bir martalik kiyim, qalpoqlar',
  },
  {
    icon: '🧵',
    ru: 'Разнообразная швейная продукция: постельное бельё, полотенца, головные уборы',
    uz: 'Turli tikuvchilik mahsulotlari: to\'shak choyshablari, sochiqlar, bosh kiyimlar',
  },
  {
    icon: '🎨',
    ru: 'Нанесение логотипа: вышивка, шелкография, термотрансфер, DTF-печать',
    uz: 'Logo bosish: kashtadozlik, shyolkografiya, termotrransfer, DTF-bosma',
  },
  {
    icon: '👤',
    ru: 'Персональный менеджер и сопровождение на всех этапах заказа',
    uz: 'Shaxsiy menejer va buyurtmaning barcha bosqichlarida qo\'llab-quvvatlash',
  },
]

const content = {
  ru: {
    tag: 'ООО «ART PRINT AND TEXTILE»',
    hero: 'Ведущий производитель спецодежды в Узбекистане',
    heroSub: 'ООО «ART PRINT AND TEXTILE» — производитель спецодежды, uniform и брендированной продукции в Узбекистане.',
    p1: 'Компания ООО «ART PRINT AND TEXTILE» является одним из ведущих производителей швейной продукции в Узбекистане. Собственное производство и современное оборудование обеспечивают конкурентоспособную ценовую политику.',
    p2: 'Приоритетом нашей компании является высокий стандарт качества и быстрые сроки выполнения заказов. Каждому клиенту мы предлагаем решения «под ключ» — от подбора моделей и тканей до брендирования и упаковки.',
    p3: 'Каждому заказчику выделяется персональный менеджер, который отвечает за сроки и качество исполнения. Мы помогаем в разработке фирменного стиля и берём на себя все задачи по производству.',
    services: 'Наши услуги',
  },
  uz: {
    tag: 'ООО «ART PRINT AND TEXTILE»',
    hero: 'O\'zbekistondagi etakchi maxsus kiyim ishlab chiqaruvchi',
    heroSub: 'ООО «ART PRINT AND TEXTILE» — O\'zbekistonda maxsus kiyim, uniform va brendlangan mahsulotlar ishlab chiqaruvchi kompaniya.',
    p1: 'ООО «ART PRINT AND TEXTILE» kompaniyasi O\'zbekistondagi tikuvchilik mahsulotlarining yetakchi ishlab chiqaruvchilaridan biridir. O\'z ishlab chiqarish bazasi va zamonaviy uskunalar raqobatbardosh narx siyosatini ta\'minlaydi.',
    p2: 'Kompaniyamizning ustuvor yo\'nalishi — yuqori sifat standarti va buyurtmalarni tez bajarish. Har bir mijozga "kalit topshirish" yechimlarini taklif qilamiz — model va matolar tanlovidan brendlash va qadoqlashgacha.',
    p3: 'Har bir buyurtmachiga shaxsiy menejer ajratiladi, u muddatlar va ijro sifati uchun javob beradi. Korporativ uslub ishlab chiqishda yordam beramiz va barcha ishlab chiqarish vazifalarini o\'z zimmamizga olamiz.',
    services: 'Bizning xizmatlar',
  },
}

export default function AboutPage() {
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'ru' | 'uz' | null
    if (saved) setLang(saved)

    const onLangChange = () => {
      const l = localStorage.getItem('lang') as 'ru' | 'uz' | null
      if (l) setLang(l)
    }
    window.addEventListener('langchange', onLangChange)
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {})
    return () => window.removeEventListener('langchange', onLangChange)
  }, [])

  const t = content[lang]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 60px' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #D32F2F, #7B0000)', borderRadius: 20, padding: '36px 32px', color: '#fff', marginBottom: 40 }}>
        <p style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7, marginBottom: 10 }}>{t.tag}</p>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 14, letterSpacing: -0.5 }}>{t.hero}</h1>
        <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.6, maxWidth: 560 }}>
          {lang === 'ru' ? (settings?.aboutRu || t.heroSub) : (settings?.aboutUz || t.heroSub)}
        </p>
      </div>

      {/* Description */}
      <div style={{ display: 'grid', gap: 16, marginBottom: 40 }}>
        {[t.p1, t.p2, t.p3].map((text, i) => (
          <p key={i} style={{ fontSize: 15, color: '#444', lineHeight: 1.8 }}>{text}</p>
        ))}
      </div>

      {/* Services */}
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 20, letterSpacing: -0.3 }}>{t.services}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {services.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, padding: '16px' }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>{s.icon}</span>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{lang === 'ru' ? s.ru : s.uz}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
