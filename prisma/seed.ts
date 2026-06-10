import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@artprint.uz' },
    update: {},
    create: { email: 'admin@artprint.uz', password: hash, name: 'Admin' },
  })

  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      telegram: 'https://t.me/artprint_uz',
      email: 'info@artprint.uz',
      phone: '+998 77 741 66 88',
      address: 'Toshkent, Yakkasaroy tumani, Nukus ko\'chasi 12-uy',
      mapLat: '41.2995',
      mapLng: '69.2401',
      aboutRu: 'Art Print and Textile является одним из ведущих производителей швейной продукции в Узбекистане. Собственное производство и современное оборудование обеспечивают конкурентоспособную ценовую политику и позволяют выпускать широкий спектр текстильной продукции.',
      aboutUz: 'Art Print and Textile — O\'zbekistondagi etakchi tikuvchilik mahsulotlari ishlab chiqaruvchilaridan biri. O\'z ishlab chiqarishi va zamonaviy jihozlari raqobatbardosh narx siyosatini ta\'minlaydi.',
    },
  })

  const cat = await prisma.category.upsert({
    where: { slug: 'specodejda' },
    update: {},
    create: {
      nameRu: 'Спецодежда',
      nameUz: 'Maxsus kiyim',
      icon: '🦺',
      slug: 'specodejda',
      order: 0,
    },
  })

  console.log('Seed completed. Admin: admin@artprint.uz / admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
