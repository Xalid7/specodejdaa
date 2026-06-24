// Bo'sh tavsifli mahsulotlarga avtomatik unikal RU/UZ tavsif to'ldiradi (specodejda).
// Har deploy'da ishlaydi (start script, seed-descriptions'dan keyin).
// Faqat descRu yoki descUz bo'sh bo'lganlarni yangilaydi. lib/autodesc.ts mantig'ining nusxasi.
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
const pick = (arr, seed, salt = 0) => arr[(seed + salt) % arr.length]

function detectBucket(s) {
  const t = s.toLowerCase()
  if (/полотен|постел|плед|сумк|подушк|скатер|салфет|наволоч|sumka|sochiq|to‘shak|to'shak/.test(t)) return 'textile'
  if (/сигнал|signal|epa/.test(t)) return 'signal'
  if (/халат|медиц|хирург|tibbiy|jarroh|туник|tunika/.test(t)) return 'medical'
  if (/фартук|fartuk|apron/.test(t)) return 'apron'
  if (/жилет|jilet|vest/.test(t)) return 'vest'
  if (/кепка|бейсбол|панам|колпак|шапк|косынк|\bkep\b|panam/.test(t)) return 'cap'
  if (/поло|polo/.test(t)) return 'polo'
  if (/футбол|futbol|t-shirt|рубашк|сорочк|китель|kitel/.test(t)) return 'tshirt'
  if (/куртк|ветровк|худи|hudi|толстов|свитшот|бомбер|tolstovka|sweat|kurtka/.test(t)) return 'jacket'
  if (/форма|костюм|комбинезон|роба|kostyum|forma|kombinezon/.test(t)) return 'uniform'
  return 'generic'
}

const BENEFIT = {
  cap: { ru: ['практичный головной убор для рабочей формы и промоакций', 'удобный аксессуар с регулируемой застёжкой для команды и мероприятий', 'лёгкий головной убор, который дополнит фирменный стиль персонала'], uz: ['ishchi forma va promoaksiyalar uchun qulay bosh kiyim', 'jamoa va tadbirlar uchun sozlanadigan to‘qqili qulay aksessuar', 'xodimlar firma uslubini to‘ldiruvchi yengil bosh kiyim'] },
  tshirt: { ru: ['аккуратная рубашка для корпоративной формы и сферы обслуживания', 'удобная сорочка из дышащей ткани для персонала', 'качественная основа под нанесение логотипа компании'], uz: ['korporativ forma va xizmat sohasi uchun ozoda ko‘ylak', 'xodimlar uchun nafas oladigan matodan qulay ko‘ylak', 'kompaniya logotipini tushirish uchun sifatli asos'] },
  polo: { ru: ['аккуратная униформа с воротником для обслуживающего персонала, кафе и магазинов', 'презентабельная форма для сферы услуг из дышащей ткани', 'комфортное поло для персонала на весь рабочий день'], uz: ['kafe, do‘kon va xizmat xodimlari uchun yoqali ozoda uniforma', 'nafas oladigan matodan xizmat sohasi uchun ko‘rkam forma', 'xodimlar uchun kun bo‘yi qulay polo'] },
  uniform: { ru: ['прочная рабочая одежда для производственных бригад и строителей', 'надёжная спецодежда из износостойкой ткани с карманами для инструмента', 'практичная форма для повседневной работы на объектах'], uz: ['ishlab chiqarish brigadalari va quruvchilar uchun mustahkam ishchi kiyim', 'asbob cho‘ntaklari bilan eskirishga chidamli matodan ishonchli maxsus kiyim', 'obyektlarda kundalik ish uchun amaliy forma'] },
  medical: { ru: ['удобная и гигиеничная форма для врачей, клиник и аптек из качественной ткани', 'аккуратная медицинская одежда для лабораторий и медперсонала', 'практичная медицинская форма классического кроя'], uz: ['sifatli matodan shifokorlar, klinika va dorixonalar uchun qulay va gigienik forma', 'laboratoriya va tibbiyot xodimlari uchun ozoda tibbiy kiyim', 'klassik bichimdagi amaliy tibbiy forma'] },
  signal: { ru: ['сигнальная одежда с яркой тканью и светоотражающими полосами для дорожных и строительных работ', 'спецодежда повышенной видимости для безопасности на стройке и складе', 'яркая форма со светоотражателями для работы у дороги'], uz: ['yo‘l va qurilish ishlari uchun yorqin mato va nur qaytaruvchi chiziqli signal kiyim', 'qurilish va omborda xavfsizlik uchun yuqori ko‘rinishli maxsus kiyim', 'yo‘l yonida ishlash uchun nur qaytaruvchili yorqin forma'] },
  jacket: { ru: ['тёплая верхняя одежда для рабочих бригад, защищает от ветра и прохлады', 'практичная рабочая куртка с карманами и фирменным акцентом', 'надёжная верхняя одежда для работы на открытом воздухе'], uz: ['shamol va salqindan himoya qiluvchi ishchi brigadalar uchun issiq ustki kiyim', 'cho‘ntakli va firma urg‘usiga ega amaliy ishchi kurtka', 'ochiq havoda ishlash uchun ishonchli ustki kiyim'] },
  vest: { ru: ['лёгкая и заметная верхняя одежда для персонала и промоакций', 'практичный жилет для команд, мероприятий и наружных работ', 'удобный утеплённый жилет, который выделит сотрудников'], uz: ['xodimlar va promoaksiyalar uchun yengil va ko‘zga tashlanadigan ustki kiyim', 'jamoalar, tadbirlar va tashqi ishlar uchun amaliy jilet', 'xodimlarni ajratuvchi qulay issiqlik qatlamli jilet'] },
  apron: { ru: ['прочный фартук для поваров, официантов и сферы обслуживания', 'практичный фартук с карманами и нанесением логотипа заведения', 'аккуратный фартук для кафе, ресторанов и кухни'], uz: ['oshpaz, ofitsiant va xizmat sohasi uchun mustahkam fartuk', 'cho‘ntakli va muassasa logotipi bilan amaliy fartuk', 'kafe, restoran va oshxona uchun ozoda fartuk'] },
  textile: { ru: ['качественный текстиль для дома и промопродукции с нанесением логотипа', 'практичное изделие из мягкой ткани для дома, отелей и подарков', 'текстиль под брендирование для корпоративных наборов и промо'], uz: ['logotip bilan uy va promomahsulot uchun sifatli tekstil', 'uy, mehmonxona va sovg‘alar uchun yumshoq matodan amaliy buyum', 'korporativ to‘plam va promo uchun brendlanadigan tekstil'] },
  generic: { ru: ['качественное изделие с возможностью нанесения логотипа компании', 'практичный товар для корпоративного заказа и промо', 'изделие под брендирование любым тиражом'], uz: ['kompaniya logotipini tushirish imkoniyatli sifatli buyum', 'korporativ buyurtma va promo uchun amaliy mahsulot', 'har qanday tirajda brendlanadigan buyum'] },
}
const CLOSE_RU = [
  'Наносим логотип вышивкой или печатью, шьём на заказ любым тиражом в Ташкенте.',
  'Брендируем логотипом, изготавливаем под корпоративный заказ оптом по Узбекистану.',
  'Нанесение логотипа компании, пошив на заказ в собственном производстве ART PRINT.',
  'Любой тираж, нанесение логотипа и доставка по Ташкенту и Узбекистану.',
]
const CLOSE_UZ = [
  'Logotipni tikuv yoki bosma bilan tushiramiz, Toshkentda har qanday tirajda buyurtmaga tikamiz.',
  'Logotip bilan brendlaymiz, O‘zbekiston bo‘ylab ulgurji korporativ buyurtma tayyorlaymiz.',
  'Kompaniya logotipini tushiramiz, ART PRINT o‘z ishlab chiqarishida buyurtmaga tikadi.',
  'Har qanday tiraj, logotip bosish va Toshkent hamda O‘zbekiston bo‘ylab yetkazib berish.',
]

function generateDescription(nameRu, nameUz, categoryRu) {
  const basis = `${nameRu} ${categoryRu || ''}`
  const seed = hash(basis)
  const bucket = detectBucket(basis)
  const descRu = `${nameRu} — ${pick(BENEFIT[bucket].ru, seed)}. ${pick(CLOSE_RU, seed, 1)}`
  const descUz = `${nameUz || nameRu} — ${pick(BENEFIT[bucket].uz, seed)}. ${pick(CLOSE_UZ, seed, 1)}`
  return { descRu, descUz }
}

const run = async () => {
  const products = await prisma.product.findMany({
    where: { OR: [{ descRu: null }, { descRu: '' }, { descUz: null }, { descUz: '' }] },
    include: { category: { select: { nameRu: true } } },
  })
  let ok = 0
  for (const p of products) {
    const auto = generateDescription(p.nameRu, p.nameUz, p.category?.nameRu)
    await prisma.product.update({
      where: { id: p.id },
      data: { descRu: p.descRu?.trim() || auto.descRu, descUz: p.descUz?.trim() || auto.descUz },
    })
    ok++
  }
  console.log(`✅ Tavsif to'ldirildi: ${ok} ta mahsulot (bo'sh bo'lganlar)`)
  await prisma.$disconnect()
}
run().catch(e => { console.error('backfill xato:', e.message); process.exit(0) })
