// Mahsulotlarga unikal SEO tavsiflar (RU + UZ) — slug bo'yicha yangilaydi.
// Ishlatish: node prisma/seed-descriptions.mjs
// Mavjud mahsulotlarni o'chirmaydi, faqat descRu / descUz to'ldiradi.
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const DESC = {
  // ===== Кепки =====
  'kepka-seraya': {
    ru: 'Серая кепка из плотного хлопка с регулируемой застёжкой — практичный головной убор для рабочей формы и промоакций. Наносим логотип компании вышивкой или печатью, шьём на заказ любым тиражом в Ташкенте.',
    uz: 'Zich paxtadan tikilgan kulrang kep, sozlanadigan to‘qqili — ishchi forma va promoaksiyalar uchun qulay bosh kiyim. Logotipni tikuv yoki bosma orqali tushiramiz, Toshkentda har qanday tirajda buyurtmaga tikamiz.',
  },
  'kepka-oranzhevaya': {
    ru: 'Яркая оранжевая кепка хорошо заметна на производстве и привлекает внимание на промоакциях. Брендируем логотипом, изготавливаем под корпоративный заказ оптом по Узбекистану.',
    uz: 'Yorqin to‘q sariq kep ishlab chiqarishda yaxshi ko‘rinadi va promoaksiyalarda e’tibor tortadi. Logotip bilan brendlaymiz, O‘zbekiston bo‘ylab ulgurji korporativ buyurtmaga tayyorlaymiz.',
  },
  'kepka-chyornaya': {
    ru: 'Классическая чёрная кепка — универсальный аксессуар к униформе и повседневной корпоративной одежде. Нанесение логотипа вышивкой, пошив на заказ в собственном производстве ART PRINT.',
    uz: 'Klassik qora kep — uniforma va kundalik korporativ kiyimga mos universal aksessuar. Logotipni tikuv bilan tushiramiz, ART PRINT o‘z ishlab chiqarishida buyurtmaga tikadi.',
  },
  'kepka-krasnaya': {
    ru: 'Красная кепка с регулируемым размером добавит акцента фирменному стилю и форме персонала. Брендирование логотипом, любой тираж под заказ в Ташкенте.',
    uz: 'Sozlanadigan o‘lchamli qizil kep firma uslubi va xodimlar formasiga urg‘u qo‘shadi. Logotip bilan brendlash, Toshkentda har qanday tirajda buyurtma.',
  },

  // ===== Футболки =====
  'futbolka-krasnaya': {
    ru: 'Красная футболка из мягкого хлопка для корпоративной формы, спортивных команд и промокампаний. Печать и нанесение логотипа любого размера, пошив на заказ оптом в Ташкенте.',
    uz: 'Yumshoq paxtadan qizil futbolka — korporativ forma, sport jamoalari va promokampaniyalar uchun. Istalgan o‘lchamdagi logotip bosish, Toshkentda ulgurji buyurtmaga tikish.',
  },
  'futbolka-chyornaya': {
    ru: 'Чёрная хлопковая футболка — базовый элемент корпоративного гардероба и промотекстиля. Наносим логотип шелкографией или термопечатью, изготавливаем под заказ любым тиражом.',
    uz: 'Qora paxta futbolka — korporativ garderob va promo tekstilning asosiy elementi. Logotipni shelkografiya yoki termobosma bilan tushiramiz, har qanday tirajda tikamiz.',
  },
  'futbolka-seraya': {
    ru: 'Серая футболка нейтрального оттенка хорошо сочетается с фирменным логотипом и подходит для рабочей и промоодежды. Пошив на заказ и брендирование в собственном цехе в Ташкенте.',
    uz: 'Neytral kulrang futbolka firma logotipi bilan yaxshi uyg‘unlashadi, ishchi va promo kiyim uchun mos. Toshkentdagi o‘z sexida buyurtmaga tikish va brendlash.',
  },
  'futbolka-fioletovaya': {
    ru: 'Фиолетовая футболка для тех, кто хочет выделить бренд нестандартным цветом промоформы. Печать логотипа, корпоративный пошив на заказ по Узбекистану.',
    uz: 'Binafsha futbolka — promoformaning nostandart rangi bilan brendni ajratmoqchi bo‘lganlar uchun. Logotip bosish, O‘zbekiston bo‘ylab korporativ buyurtma.',
  },
  'futbolka-belaya': {
    ru: 'Белая футболка — идеальная основа для яркой печати логотипа и промодизайна. Шьём на заказ из качественного хлопка любым тиражом, брендируем под ключ.',
    uz: 'Oq futbolka — yorqin logotip bosish va promodizayn uchun ideal asos. Sifatli paxtadan har qanday tirajda tikamiz, kalit topshirish bilan brendlaymiz.',
  },
  'futbolka-golubuya-kepka': {
    ru: 'Готовый промокомплект: голубая футболка и кепка в едином фирменном стиле — выгодное решение для акций и команд. Нанесение логотипа на оба изделия, пошив на заказ в Ташкенте.',
    uz: 'Tayyor promokomplekt: yagona firma uslubidagi havorang futbolka va kep — aksiyalar va jamoalar uchun foydali yechim. Ikkala buyumga logotip, Toshkentda buyurtmaga tikish.',
  },

  // ===== Поло / обслуживающий персонал =====
  'polo-chyornoe': {
    ru: 'Чёрная рубашка поло с воротником — аккуратная униформа для обслуживающего персонала, кафе и магазинов. Вышивка логотипа, пошив на заказ оптом в Ташкенте.',
    uz: 'Yoqali qora polo ko‘ylak — kafe, do‘kon va xizmat ko‘rsatuvchi xodimlar uchun ozoda uniforma. Logotip tikuvi, Toshkentda ulgurji buyurtmaga tikish.',
  },
  'polo-seroe': {
    ru: 'Серое поло из дышащей ткани — комфортная форма для персонала в течение всего дня. Брендируем логотипом, изготавливаем корпоративный заказ любым тиражом.',
    uz: 'Nafas oladigan matodan kulrang polo — xodimlar uchun kun bo‘yi qulay forma. Logotip bilan brendlaymiz, har qanday tirajda korporativ buyurtma tayyorlaymiz.',
  },
  'polo-beloe': {
    ru: 'Белое поло — классика униформы для сферы услуг, презентабельно и универсально. Нанесение логотипа вышивкой, пошив на заказ в собственном производстве ART PRINT.',
    uz: 'Oq polo — xizmat ko‘rsatish sohasi uniformasining klassikasi, ko‘rkam va universal. Logotipni tikuv bilan tushiramiz, ART PRINT o‘z ishlab chiqarishida tikadi.',
  },
  'polo-chyornoe-zelyonyy-1': {
    ru: 'Чёрное поло с контрастным зелёным воротником — стильная форма с фирменным акцентом для персонала. Вышивка или печать логотипа, пошив на заказ в Ташкенте.',
    uz: 'Kontrast yashil yoqali qora polo — firma urg‘usiga ega xodimlar uchun zamonaviy forma. Logotip tikuvi yoki bosma, Toshkentda buyurtmaga tikish.',
  },
  'polo-chyornoe-zelyonyy-2': {
    ru: 'Поло чёрного цвета с зелёной отделкой воротника — второй вариант фирменной формы для команды обслуживания. Корпоративное брендирование логотипом, любой тираж на заказ.',
    uz: 'Yashil yoqa bezagiga ega qora polo — xizmat jamoasi uchun firma formasining ikkinchi varianti. Logotip bilan korporativ brendlash, istalgan tirajda buyurtma.',
  },
  'polo-temno-sinee-kepka': {
    ru: 'Комплект для персонала: тёмно-синее поло и кепка в одном стиле — готовая униформа под бренд. Наносим логотип на оба изделия, шьём на заказ оптом по Узбекистану.',
    uz: 'Xodimlar uchun komplekt: yagona uslubdagi to‘q ko‘k polo va kep — brend ostida tayyor uniforma. Ikkala buyumga logotip, O‘zbekiston bo‘ylab ulgurji buyurtma.',
  },
  'polo-krasnoe-molniya-kepka': {
    ru: 'Красное поло на молнии в комплекте с кепкой — практичная и заметная форма для активного персонала и промо. Брендирование логотипом, пошив на заказ в Ташкенте.',
    uz: 'Zamokli qizil polo va kep komplekti — faol xodimlar va promo uchun amaliy va ko‘zga tashlanadigan forma. Logotip bilan brendlash, Toshkentda buyurtmaga tikish.',
  },
  'forma-polo-bezhevoe-bryuki': {
    ru: 'Форма из бежевого поло и брюк — комплект делового вида для администраторов и сервисного персонала. Пошив на заказ, нанесение логотипа компании любым тиражом.',
    uz: 'Bej polo va shimdan iborat forma — administrator va servis xodimlari uchun ishbilarmon ko‘rinishdagi komplekt. Buyurtmaga tikish, kompaniya logotipini istalgan tirajda tushirish.',
  },
  'tunika-golubuya-kepka': {
    ru: 'Голубая женская туника в комплекте с кепкой — удобная и опрятная форма для женского персонала. Вышивка логотипа, корпоративный пошив на заказ в Ташкенте.',
    uz: 'Kep bilan to‘plamdagi havorang ayollar tunikasi — ayol xodimlar uchun qulay va ozoda forma. Logotip tikuvi, Toshkentda korporativ buyurtmaga tikish.',
  },

  // ===== Форма 103 =====
  'forma-103-letnyaya-belo-kr': {
    ru: 'Летняя форма 103 в бело-красной расцветке из лёгкой дышащей ткани — для работы в тёплый сезон. Сигнальные элементы, нанесение логотипа, пошив на заказ оптом в Ташкенте.',
    uz: 'Yengil nafas oladigan matodan oq-qizil rangli yozgi 103-forma — issiq mavsumda ishlash uchun. Signal elementlari, logotip tushirish, Toshkentda ulgurji buyurtmaga tikish.',
  },
  'forma-103-zimnyaya-kr': {
    ru: 'Зимняя форма 103 красного цвета с утеплителем защищает от холода на открытых объектах. Прочная рабочая одежда с возможностью брендирования, пошив на заказ по Узбекистану.',
    uz: 'Issiqlik qatlamli qizil qishki 103-forma ochiq obyektlarda sovuqdan himoya qiladi. Brendlash imkoniyatli mustahkam ishchi kiyim, O‘zbekiston bo‘ylab buyurtmaga tikish.',
  },
  'forma-103-sinaya-kr-1': {
    ru: 'Форма 103 в тёмно-синем с красными вставками — практичная рабочая одежда с контрастным дизайном (вариант №1). Наносим логотип, шьём на заказ любым тиражом в Ташкенте.',
    uz: 'To‘q ko‘k va qizil qo‘shimchali 103-forma — kontrast dizaynli amaliy ishchi kiyim (1-variant). Logotip tushiramiz, Toshkentda har qanday tirajda tikamiz.',
  },
  'forma-103-sinaya-kr-2': {
    ru: 'Второй вариант формы 103 тёмно-синего цвета с красной отделкой — надёжная спецодежда для бригад. Брендирование логотипом, корпоративный пошив на заказ.',
    uz: 'Qizil bezakli to‘q ko‘k 103-formaning ikkinchi varianti — brigadalar uchun ishonchli maxsus kiyim. Logotip bilan brendlash, korporativ buyurtmaga tikish.',
  },
  'forma-103-dlinniy-rukav': {
    ru: 'Форма 103 с длинным рукавом обеспечивает дополнительную защиту рук на производстве. Прочная ткань, нанесение логотипа, пошив на заказ оптом в Ташкенте.',
    uz: 'Uzun yengli 103-forma ishlab chiqarishda qo‘llarni qo‘shimcha himoya qiladi. Mustahkam mato, logotip tushirish, Toshkentda ulgurji buyurtmaga tikish.',
  },
  'forma-103-signalnaya': {
    ru: 'Сигнальная форма 103 с яркими светоотражающими полосами повышает видимость и безопасность на дороге и стройке. Соответствует требованиям спецодежды, пошив на заказ.',
    uz: 'Yorqin nur qaytaruvchi chiziqli signal 103-forma yo‘l va qurilishda ko‘rinish hamda xavfsizlikni oshiradi. Maxsus kiyim talablariga mos, buyurtmaga tikish.',
  },

  // ===== Медицинский халат =====
  'halat-med-bryuki': {
    ru: 'Медицинский халат в комплекте с брюками — удобная и гигиеничная форма для врачей и медперсонала. Качественная ткань, вышивка логотипа клиники, пошив на заказ в Ташкенте.',
    uz: 'Shim bilan to‘plamdagi tibbiy xalat — shifokorlar va tibbiyot xodimlari uchun qulay va gigienik forma. Sifatli mato, klinika logotipi tikuvi, Toshkentda buyurtmaga tikish.',
  },
  'halat-med-belyy': {
    ru: 'Белый медицинский халат классического кроя — аккуратная форма для клиник, аптек и лабораторий. Брендируем логотипом, изготавливаем под заказ любым тиражом по Узбекистану.',
    uz: 'Klassik bichimdagi oq tibbiy xalat — klinika, dorixona va laboratoriyalar uchun ozoda forma. Logotip bilan brendlaymiz, O‘zbekiston bo‘ylab har qanday tirajda tikamiz.',
  },

  // ===== Летняя спецодежда =====
  'rabochiy-kostyum-bej': {
    ru: 'Бежевый рабочий костюм из прочной ткани — лёгкая летняя спецодежда для строителей и производственных бригад. Карманы для инструмента, нанесение логотипа, пошив на заказ в Ташкенте.',
    uz: 'Mustahkam matodan bej ishchi kostyum — quruvchilar va ishlab chiqarish brigadalari uchun yengil yozgi maxsus kiyim. Asbob uchun cho‘ntaklar, logotip tushirish, Toshkentda buyurtma.',
  },
  'rabochiy-kostyum-seryy': {
    ru: 'Серый рабочий костюм — практичная спецодежда нейтрального цвета для повседневной работы. Износостойкая ткань, брендирование логотипом, корпоративный пошив на заказ оптом.',
    uz: 'Kulrang ishchi kostyum — kundalik ish uchun neytral rangdagi amaliy maxsus kiyim. Eskirishga chidamli mato, logotip brendlash, ulgurji korporativ buyurtmaga tikish.',
  },

  // ===== Сигнальная одежда =====
  'forma-signalnaya-epa': {
    ru: 'Сигнальная форма EPA с флуоресцентной тканью и светоотражающими лентами — для дорожных, строительных и складских работ. Высокая видимость и безопасность, пошив на заказ в Ташкенте.',
    uz: 'Fluoressent mato va nur qaytaruvchi lentali EPA signal formasi — yo‘l, qurilish va ombor ishlari uchun. Yuqori ko‘rinish va xavfsizlik, Toshkentda buyurtmaga tikish.',
  },

  // ===== Худи =====
  'hudi-biryuzovoe': {
    ru: 'Бирюзовое худи на молнии с капюшоном — тёплая и стильная толстовка для команды и промо. Мягкий начёс, нанесение логотипа, пошив на заказ любым тиражом в Ташкенте.',
    uz: 'Kapyushonli zamokli feruza xudi — jamoa va promo uchun issiq va zamonaviy tolstovka. Yumshoq ich qatlam, logotip tushirish, Toshkentda har qanday tirajda buyurtma.',
  },

  // ===== Куртка =====
  'kurtka-sinaya-krasnaya': {
    ru: 'Тёмно-синяя куртка с красными полосами — практичная рабочая верхняя одежда с контрастным дизайном. Защита от ветра, брендирование логотипом, пошив на заказ по Узбекистану.',
    uz: 'Qizil chiziqli to‘q ko‘k kurtka — kontrast dizaynli amaliy ustki ishchi kiyim. Shamoldan himoya, logotip brendlash, O‘zbekiston bo‘ylab buyurtmaga tikish.',
  },

  // ===== Жилетка =====
  'zhilet-krasnyy-kapyushon': {
    ru: 'Красный жилет с капюшоном — лёгкая и заметная верхняя одежда для персонала и промоакций. Нанесение логотипа, пошив на заказ оптом в собственном цехе в Ташкенте.',
    uz: 'Kapyushonli qizil jilet — xodimlar va promoaksiyalar uchun yengil va ko‘zga tashlanadigan ustki kiyim. Logotip tushirish, Toshkentdagi o‘z sexida ulgurji buyurtma.',
  },
  'zhilet-krasnyy-kepka': {
    ru: 'Комплект из красного жилета и кепки в едином фирменном стиле — готовое решение для промокоманд и мероприятий. Брендируем логотипом оба изделия, шьём на заказ в Ташкенте.',
    uz: 'Yagona firma uslubidagi qizil jilet va kep komplekti — promojamoalar va tadbirlar uchun tayyor yechim. Ikkala buyumni logotip bilan brendlaymiz, Toshkentda tikamiz.',
  },
}

const run = async () => {
  let ok = 0, miss = 0
  for (const [slug, d] of Object.entries(DESC)) {
    const res = await prisma.product.updateMany({ where: { slug }, data: { descRu: d.ru, descUz: d.uz } })
    if (res.count > 0) { ok++; } else { miss++; console.log('  ⚠️ topilmadi:', slug) }
  }
  console.log(`\n✅ Yangilandi: ${ok} ta | ⚠️ Topilmadi: ${miss} ta`)
  await prisma.$disconnect()
}
run().catch(e => { console.error(e); process.exit(1) })
