// Avtomatik tavsif generatori (RU + UZ) — bepul, API kalit kerak emas.
// Mahsulot nomi + kategoriya nomidan rang va turni aniqlab, unikal tavsif tuzadi.
// Bir xil mahsulot uchun har doim bir xil natija beradi (hash orqali), random emas.

type Desc = { descRu: string; descUz: string }

// Barqaror tanlov uchun oddiy hash (slug/nom o'zgarmaguncha natija o'zgarmaydi)
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}
const pick = <T,>(arr: T[], seed: number, salt = 0): T => arr[(seed + salt) % arr.length]

// ---- Tur (bucket) aniqlash ----
type Bucket =
  | 'cap' | 'tshirt' | 'polo' | 'uniform' | 'medical'
  | 'signal' | 'jacket' | 'vest' | 'apron' | 'textile' | 'generic'

function detectBucket(s: string): Bucket {
  const t = s.toLowerCase()
  // Tartib muhim: aniqroq/uzunroq so'zlar avval tekshiriladi
  if (/полотен|постел|плед|сумк|подушк|скатер|салфет|наволоч|sumka|sochiq|to‘shak|to'shak/.test(t)) return 'textile'
  if (/сигнал|signal|epa/.test(t)) return 'signal'
  if (/халат|медиц|хирург|tibbiy|jarroh/.test(t)) return 'medical'
  if (/фартук|fartuk|apron/.test(t)) return 'apron'
  if (/жилет|jilet|vest/.test(t)) return 'vest'
  if (/кепка|бейсбол|панам|колпак|шапк|косынк|\bkep\b|panam/.test(t)) return 'cap'
  // 'поло' textiledan keyin tekshiriladi, shuning uchun 'полотенце' bu yerga yetib kelmaydi
  if (/поло|polo|туник|tunika/.test(t)) return 'polo'
  if (/футбол|futbol|t-shirt/.test(t)) return 'tshirt'
  if (/куртк|худи|hudi|толстов|свитшот|tolstovka|sweat/.test(t)) return 'jacket'
  if (/форма|костюм|комбинезон|роба|kostyum|forma|kombinezon/.test(t)) return 'uniform'
  return 'generic'
}

// ---- Bucket bo'yicha foyda jumlalari ----
const BENEFIT: Record<Bucket, { ru: string[]; uz: string[] }> = {
  cap: {
    ru: ['практичный головной убор для рабочей формы и промоакций', 'удобный аксессуар с регулируемой застёжкой для команды и мероприятий', 'лёгкий головной убор, который дополнит фирменный стиль персонала'],
    uz: ['ishchi forma va promoaksiyalar uchun qulay bosh kiyim', 'jamoa va tadbirlar uchun sozlanadigan to‘qqili qulay aksessuar', 'xodimlar firma uslubini to‘ldiruvchi yengil bosh kiyim'],
  },
  tshirt: {
    ru: ['базовый элемент корпоративного гардероба и промотекстиля из мягкого хлопка', 'удобная футболка для команд, спорта и промокампаний', 'дышащая хлопковая основа под яркую печать логотипа'],
    uz: ['yumshoq paxtadan korporativ garderob va promo tekstilning asosiy elementi', 'jamoalar, sport va promokampaniyalar uchun qulay futbolka', 'yorqin logotip bosish uchun nafas oladigan paxta asos'],
  },
  polo: {
    ru: ['аккуратная униформа с воротником для обслуживающего персонала, кафе и магазинов', 'презентабельная форма для сферы услуг из дышащей ткани', 'комфортное поло для персонала на весь рабочий день'],
    uz: ['kafe, do‘kon va xizmat xodimlari uchun yoqali ozoda uniforma', 'nafas oladigan matodan xizmat sohasi uchun ko‘rkam forma', 'xodimlar uchun kun bo‘yi qulay polo'],
  },
  uniform: {
    ru: ['прочная рабочая одежда для производственных бригад и строителей', 'надёжная спецодежда из износостойкой ткани с карманами для инструмента', 'практичная форма для повседневной работы на объектах'],
    uz: ['ishlab chiqarish brigadalari va quruvchilar uchun mustahkam ishchi kiyim', 'asbob cho‘ntaklari bilan eskirishga chidamli matodan ishonchli maxsus kiyim', 'obyektlarda kundalik ish uchun amaliy forma'],
  },
  medical: {
    ru: ['удобная и гигиеничная форма для врачей, клиник и аптек из качественной ткани', 'аккуратная медицинская одежда для лабораторий и медперсонала', 'практичная медицинская форма классического кроя'],
    uz: ['sifatli matodan shifokorlar, klinika va dorixonalar uchun qulay va gigienik forma', 'laboratoriya va tibbiyot xodimlari uchun ozoda tibbiy kiyim', 'klassik bichimdagi amaliy tibbiy forma'],
  },
  signal: {
    ru: ['сигнальная одежда с яркой тканью и светоотражающими полосами для дорожных и строительных работ', 'спецодежда повышенной видимости для безопасности на стройке и складе', 'яркая форма со светоотражателями для работы у дороги'],
    uz: ['yo‘l va qurilish ishlari uchun yorqin mato va nur qaytaruvchi chiziqli signal kiyim', 'qurilish va omborda xavfsizlik uchun yuqori ko‘rinishli maxsus kiyim', 'yo‘l yonida ishlash uchun nur qaytaruvchili yorqin forma'],
  },
  jacket: {
    ru: ['тёплая верхняя одежда для команды, защищает от ветра и прохлады', 'практичная куртка с фирменным акцентом для активной работы', 'мягкая толстовка для команды и промо'],
    uz: ['shamol va salqindan himoya qiluvchi jamoa uchun issiq ustki kiyim', 'faol ish uchun firma urg‘usiga ega amaliy kurtka', 'jamoa va promo uchun yumshoq tolstovka'],
  },
  vest: {
    ru: ['лёгкая и заметная верхняя одежда для персонала и промоакций', 'практичный жилет для команд, мероприятий и наружных работ', 'удобный жилет, который выделит сотрудников в толпе'],
    uz: ['xodimlar va promoaksiyalar uchun yengil va ko‘zga tashlanadigan ustki kiyim', 'jamoalar, tadbirlar va tashqi ishlar uchun amaliy jilet', 'xodimlarni olomonda ajratuvchi qulay jilet'],
  },
  apron: {
    ru: ['прочный фартук для поваров, официантов и сферы обслуживания', 'практичный фартук с карманами и нанесением логотипа заведения', 'аккуратный фартук для кафе, ресторанов и кухни'],
    uz: ['oshpaz, ofitsiant va xizmat sohasi uchun mustahkam fartuk', 'cho‘ntakli va muassasa logotipi bilan amaliy fartuk', 'kafe, restoran va oshxona uchun ozoda fartuk'],
  },
  textile: {
    ru: ['качественный текстиль для дома и промопродукции с нанесением логотипа', 'практичное изделие из мягкой ткани для дома, отелей и подарков', 'текстиль под брендирование для корпоративных наборов и промо'],
    uz: ['logotip bilan uy va promomahsulot uchun sifatli tekstil', 'uy, mehmonxona va sovg‘alar uchun yumshoq matodan amaliy buyum', 'korporativ to‘plam va promo uchun brendlanadigan tekstil'],
  },
  generic: {
    ru: ['качественное изделие с возможностью нанесения логотипа компании', 'практичный товар для корпоративного заказа и промо', 'изделие под брендирование любым тиражом'],
    uz: ['kompaniya logotipini tushirish imkoniyatli sifatli buyum', 'korporativ buyurtma va promo uchun amaliy mahsulot', 'har qanday tirajda brendlanadigan buyum'],
  },
}

// ---- Kirish va yakuniy (CTA) jumlalar ----
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

/**
 * Mahsulot nomi (+ ixtiyoriy kategoriya nomi) dan unikal RU/UZ tavsif yaratadi.
 */
export function generateDescription(nameRu: string, nameUz?: string, categoryRu?: string): Desc {
  const basis = `${nameRu} ${categoryRu || ''}`
  const seed = hash(basis)
  const bucket = detectBucket(basis)

  const benefitRu = pick(BENEFIT[bucket].ru, seed)
  const benefitUz = pick(BENEFIT[bucket].uz, seed)
  const closeRu = pick(CLOSE_RU, seed, 1)
  const closeUz = pick(CLOSE_UZ, seed, 1)

  // Nom o'zida rang va xususiyatni o'z ichiga oladi — shuni asos qilamiz
  const descRu = `${nameRu} — ${benefitRu}. ${closeRu}`
  const descUz = `${nameUz || nameRu} — ${benefitUz}. ${closeUz}`

  return { descRu, descUz }
}
