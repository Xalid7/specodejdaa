import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const tree = [
  {
    icon: 'HardHat', nameRu: 'Спецодежда', nameUz: 'Maxsus kiyim', slug: 'specodejda',
    children: [
      { nameRu: 'Летняя спецодежда',                          nameUz: 'Yozgi maxsus kiyim',         slug: 'letnyaya-specodejda' },
      { nameRu: 'Зимняя спецодежда',                          nameUz: 'Qishki maxsus kiyim',         slug: 'zimnyaya-specodejda' },
      { nameRu: 'Одежда для охранных структур',               nameUz: 'Qo\'riqchilar kiyimi',        slug: 'odezhda-dlya-ohrany' },
      { nameRu: 'Спецодежда для обслуживающего персонала',    nameUz: 'Xizmat ko\'rsatuvchi xodimlar kiyimi', slug: 'specodejda-obsluzhivayushchiy' },
      { nameRu: 'Сигнальная одежда',                          nameUz: 'Signal kiyimi',               slug: 'signalnaya-odezhda' },
      { nameRu: 'Одежда для поваров и официантов',            nameUz: 'Oshpaz va ofitsiantlar kiyimi', slug: 'odezhda-povary-oficianty' },
      { nameRu: 'Сорочки, рубашки',                           nameUz: 'Ko\'ylaklar',                 slug: 'sorochki-rubashki' },
      { nameRu: 'Влагозащитная одежда',                       nameUz: 'Nam o\'tkazmaydigan kiyim',   slug: 'vlagozashchitnaya-odezhda' },
      { nameRu: 'Одежда из огнестойких материалов',           nameUz: 'Olovbardosh materiallar kiyimi', slug: 'ognestoykaya-odezhda' },
      { nameRu: 'Одежда для защиты от нефти',                 nameUz: 'Neft va neft mahsulotlaridan himoya kiyimi', slug: 'odezhda-zashchita-neft' },
      { nameRu: 'Одежда для защиты от химических воздействий',nameUz: 'Kimyoviy ta\'sirdan himoya kiyimi', slug: 'odezhda-zashchita-ximiya' },
      { nameRu: 'Одежда для защиты от электрической дуги',    nameUz: 'Elektr yoyidan himoya kiyimi',slug: 'odezhda-zashchita-elektr' },
      { nameRu: 'Одежда от статического электричества',       nameUz: 'Statik elektr himoya kiyimi', slug: 'odezhda-staticheskoe-elektrichestvo' },
    ],
  },
  {
    icon: 'Footprints', nameRu: 'Спецобувь', nameUz: 'Maxsus poyabzal', slug: 'specobuvj',
    children: [],
  },
  {
    icon: 'Hand', nameRu: 'Средства защиты рук', nameUz: "Qo'l himoya vositalari", slug: 'sredstva-zaschity-ruk',
    children: [],
  },
  {
    icon: 'Stethoscope', nameRu: 'Медицинская одежда', nameUz: 'Tibbiy kiyim', slug: 'medicinskaya-odezhda',
    children: [
      { nameRu: 'Халат медицинский женский', nameUz: 'Ayollar tibbiy xalatи', slug: 'halat-med-zhenskiy' },
      { nameRu: 'Халат медицинский мужской', nameUz: 'Erkaklar tibbiy xalati', slug: 'halat-med-muzhskoy' },
      { nameRu: 'Хирургическая форма',       nameUz: 'Jarrohlik formasi',       slug: 'hirurgicheskaya-forma' },
      { nameRu: 'Форма 103',                 nameUz: 'Forma 103',               slug: 'forma-103' },
    ],
  },
  {
    icon: 'Crown', nameRu: 'Головные уборы', nameUz: 'Bosh kiyimlar', slug: 'golovnye-ubory',
    children: [
      { nameRu: 'Кепка',    nameUz: 'Kepka',   slug: 'kepka' },
      { nameRu: 'Шапка',    nameUz: 'Shapka',  slug: 'shapka' },
      { nameRu: 'Каскетка', nameUz: 'Kasketka',slug: 'kasketka' },
    ],
  },
  {
    icon: 'Shirt', nameRu: 'Промо текстиль', nameUz: 'Promo tekstil', slug: 'promotekstil',
    children: [
      { nameRu: 'Футболка',          nameUz: 'Futbolka',           slug: 'futbolka' },
      { nameRu: 'Сорочка',           nameUz: 'Ko\'ylak',           slug: 'sorochka-promo' },
      { nameRu: 'Свитшот',           nameUz: 'Svitshot',           slug: 'svitsho' },
      { nameRu: 'Худи',              nameUz: 'Hudi',               slug: 'hudi' },
      { nameRu: 'Ветровка',          nameUz: 'Vetrovka',           slug: 'vetrovka' },
      { nameRu: 'Куртка',            nameUz: 'Kurtkа',             slug: 'kurtka-promo' },
      { nameRu: 'Шарф',              nameUz: 'Sharf',              slug: 'sharf' },
      { nameRu: 'Фартук',            nameUz: 'Fartuk',             slug: 'fartuk' },
      { nameRu: 'Жилетка',           nameUz: 'Jiletka',            slug: 'jiletka' },
      { nameRu: 'Эко сумка, Шоппер', nameUz: 'Eko sumka, Shopper', slug: 'eko-sumka' },
      { nameRu: 'Панамка',           nameUz: 'Panama',             slug: 'panama' },
      { nameRu: 'Плед',              nameUz: 'Pled',               slug: 'pled' },
      { nameRu: 'Косметичка',        nameUz: 'Kosmetichka',        slug: 'kosmetichka' },
      { nameRu: 'Бандана',           nameUz: 'Bandana',            slug: 'bandana' },
      { nameRu: 'Рюкзак',            nameUz: 'Ryukzak',            slug: 'ryukzak' },
      { nameRu: 'Подушка',           nameUz: 'Yostiq',             slug: 'podushka' },
      { nameRu: 'Полотенце',         nameUz: 'Sochiq',             slug: 'polotence-promo' },
      { nameRu: 'Салфетка',          nameUz: 'Salfetka',           slug: 'salfetka' },
    ],
  },
  {
    icon: 'Bed', nameRu: 'Постельное белье', nameUz: "Yotoq to'shamalari", slug: 'postelnoe-belye',
    children: [],
  },
  {
    icon: 'Bath', nameRu: 'Полотенце', nameUz: 'Sochiq', slug: 'polotence',
    children: [
      { nameRu: 'Полотенце махровое', nameUz: 'Mahram sochiq',  slug: 'polotence-mahrovoe' },
      { nameRu: 'Полотенце вафельное',nameUz: 'Vafelli sochiq', slug: 'polotence-vafelnoe' },
    ],
  },
  {
    icon: 'Gift', nameRu: 'Сувенирная продукция', nameUz: "Sovg'a mahsulotlar", slug: 'suvenirnaya-produkciya',
    children: [
      { nameRu: 'Ручка',                        nameUz: 'Ruchka',                        slug: 'ruchka' },
      { nameRu: 'Кружка',                       nameUz: 'Krujka',                        slug: 'krujka' },
      { nameRu: 'Бокал',                        nameUz: 'Bokal',                         slug: 'bokal' },
      { nameRu: 'Термокружка',                  nameUz: 'Termokrujka',                   slug: 'termokrujka' },
      { nameRu: 'Медицинская сувенирная продукция', nameUz: 'Tibbiy sovg\'a mahsulotlar', slug: 'med-suvenirnaya' },
    ],
  },
  {
    icon: 'Printer', nameRu: 'Нанесение рисунка', nameUz: 'Naqsh bosish', slug: 'nanesenye-risunka',
    children: [
      { nameRu: 'Шелкография', nameUz: 'Shelkografiya', slug: 'shelkografiya' },
      { nameRu: 'ДТФ печать',  nameUz: 'DTF bosma',     slug: 'dtf-pechat' },
      { nameRu: 'Вышивка',     nameUz: 'Kashta',        slug: 'vyshivka' },
      { nameRu: 'Винил',       nameUz: 'Vinil',         slug: 'vinil' },
    ],
  },
]

async function main() {
  const allNewSlugs = []
  for (const cat of tree) {
    allNewSlugs.push(cat.slug)
    for (const sub of cat.children) allNewSlugs.push(sub.slug)
  }

  // Eski kategoriyalardagi mahsulotlarni birinchi yangi kategoriyaga ko'chirish
  const firstCat = await prisma.category.findFirst({ where: { slug: tree[0].slug } })
  if (firstCat) {
    const oldCats = await prisma.category.findMany({ where: { slug: { notIn: allNewSlugs } } })
    for (const old of oldCats) {
      const moved = await prisma.product.updateMany({ where: { categoryId: old.id }, data: { categoryId: firstCat.id } })
      if (moved.count) console.log(`  ↪ "${old.nameRu}" → "${firstCat.nameRu}" (${moved.count} mahsulot)`)
    }
  }

  // Eski kategoriyalarni o'chirish
  const deleted = await prisma.category.deleteMany({ where: { slug: { notIn: allNewSlugs } } })
  if (deleted.count) console.log(`  🗑️  ${deleted.count} ta eski kategoriya o'chirildi`)

  // Asosiy kategoriyalarni upsert
  for (let i = 0; i < tree.length; i++) {
    const { children, ...catData } = tree[i]
    const parent = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: { nameRu: catData.nameRu, nameUz: catData.nameUz, icon: catData.icon, order: i, parentId: null },
      create: { ...catData, order: i, parentId: null },
    })
    console.log(`  ✓ ${catData.icon} ${catData.nameRu}`)

    // Subkategoriyalarni upsert
    for (let j = 0; j < children.length; j++) {
      const sub = children[j]
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { nameRu: sub.nameRu, nameUz: sub.nameUz, order: j, parentId: parent.id },
        create: { ...sub, order: j, parentId: parent.id },
      })
      console.log(`      └ ${sub.nameRu}`)
    }
  }

  console.log('\n✅ Kategoriyalar muvaffaqiyatli yangilandi!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
