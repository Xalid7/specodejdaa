import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { icon: 'HardHat',     nameRu: 'Спецодежда',           nameUz: 'Maxsus kiyim',                slug: 'specodejda' },
  { icon: 'Footprints',  nameRu: 'Спецобувь',            nameUz: 'Maxsus poyabzal',             slug: 'specobuvj' },
  { icon: 'Hand',        nameRu: 'Средства защиты рук',  nameUz: "Qo'l himoya vositalari",      slug: 'sredstva-zaschity-ruk' },
  { icon: 'Stethoscope', nameRu: 'Медицинская одежда',   nameUz: 'Tibbiy kiyim',                slug: 'medicinskaya-odezhda' },
  { icon: 'Crown',       nameRu: 'Головные уборы',       nameUz: 'Bosh kiyimlar',               slug: 'golovnye-ubory' },
  { icon: 'Shirt',       nameRu: 'Промо текстиль',       nameUz: 'Promo tekstil',               slug: 'promotekstil' },
  { icon: 'Bed',         nameRu: 'Постельное белье',     nameUz: "Yotoq to'shamalari",          slug: 'postelnoe-belye' },
  { icon: 'Bath',        nameRu: 'Полотенце',            nameUz: 'Sochiq',                      slug: 'polotence' },
  { icon: 'Gift',        nameRu: 'Сувенирная продукция', nameUz: "Sovg'a mahsulotlar",          slug: 'suvenirnaya-produkciya' },
  { icon: 'Printer',     nameRu: 'Нанесение рисунка',    nameUz: 'Naqsh bosish',                slug: 'nanesenye-risunka' },
]

async function main() {
  const slugs = categories.map(c => c.slug)

  // Yangi kategoriyalarni avval upsert qilamiz (ID lar kerak bo'ladi)
  const newCats = []
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i]
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameRu: cat.nameRu, nameUz: cat.nameUz, icon: cat.icon, order: i },
      create: { ...cat, order: i },
    })
    newCats.push(result)
  }

  // Eski kategoriyalardagi mahsulotlarni birinchi yangi kategoriyaga ko'chirish
  const defaultCatId = newCats[0].id
  const oldCats = await prisma.category.findMany({ where: { slug: { notIn: slugs } } })
  for (const old of oldCats) {
    const moved = await prisma.product.updateMany({ where: { categoryId: old.id }, data: { categoryId: defaultCatId } })
    if (moved.count) console.log(`  ↪ "${old.nameRu}" → "${newCats[0].nameRu}" (${moved.count} mahsulot)`)
  }

  // Eski kategoriyalarni o'chirish
  const deleted = await prisma.category.deleteMany({ where: { slug: { notIn: slugs } } })
  if (deleted.count) console.log(`  🗑️  ${deleted.count} ta eski kategoriya o'chirildi`)

  console.log('Kategoriyalar yangilandi:')
  newCats.forEach(c => console.log(`  ✓ ${c.icon} ${c.nameRu}`))
  console.log(`\n✅ ${categories.length} ta kategoriya muvaffaqiyatli qo'shildi!`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
