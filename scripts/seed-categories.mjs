import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { icon: '🦺', nameRu: 'Спецодежда',           nameUz: 'Maxsus kiyim',             slug: 'specodejda' },
  { icon: '👕', nameRu: 'Униформа',              nameUz: 'Forma',                    slug: 'uniforma' },
  { icon: '🥼', nameRu: 'Медицинская униформа',  nameUz: 'Tibbiy forma',             slug: 'medicinskaya-uniforma' },
  { icon: '🧵', nameRu: 'Промотекстиль',         nameUz: 'Promotekstil',             slug: 'promotekstil' },
  { icon: '🧶', nameRu: 'Трикотажные изделия',   nameUz: 'Trikotaj mahsulotlar',     slug: 'trikotajnye-izdeliya' },
  { icon: '🪡', nameRu: 'Тканевые изделия',      nameUz: "To'qima mahsulotlar",      slug: 'tkanevye-izdeliya' },
  { icon: '🧢', nameRu: 'Головные уборы',        nameUz: 'Bosh kiyimlar',            slug: 'golovnye-ubory' },
  { icon: '👔', nameRu: 'Сорочки, рубашки',      nameUz: "Ko'ylaklar",               slug: 'sorochki-rubashki' },
  { icon: '🛏️', nameRu: 'Постельное белье',      nameUz: "Yotoq to'shamalari",       slug: 'postelnoe-belye' },
  { icon: '🧺', nameRu: 'Полотенце',             nameUz: 'Sochiq',                   slug: 'polotence' },
  { icon: '🎒', nameRu: 'Сумки и рюкзаки',       nameUz: 'Sumkalar va ryukzaklar',   slug: 'sumki-ryukzaki' },
  { icon: '👢', nameRu: 'Спецобувь',             nameUz: 'Maxsus poyabzal',          slug: 'specobuvj' },
  { icon: '🧤', nameRu: 'СИЗ',                   nameUz: 'Shaxsiy himoya vositalari',slug: 'siz' },
  { icon: '🎁', nameRu: 'Сувенирная продукция',  nameUz: "Sovg'a mahsulotlar",       slug: 'suvenirnaya-produkciya' },
]

async function main() {
  console.log('Kategoriyalar qo\'shilmoqda/yangilanmoqda...')
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i]
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameRu: cat.nameRu, nameUz: cat.nameUz, icon: cat.icon, order: i },
      create: { ...cat, order: i },
    })
    console.log(`  ✓ ${cat.icon} ${cat.nameRu}`)
  }

  console.log(`\n✅ ${categories.length} ta kategoriya muvaffaqiyatli qo'shildi!`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
