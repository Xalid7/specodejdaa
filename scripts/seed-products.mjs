import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get category IDs
  const cats = await prisma.category.findMany({ select: { id: true, slug: true } })
  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]))

  const med   = catMap['medicinskaya-uniforma']
  const uni   = catMap['uniforma']
  const spec  = catMap['specodejda']
  const cap   = catMap['golovnye-ubory']
  const promo = catMap['promotekstil']

  console.log('Kategoriyalar:', { med, uni, spec, cap, promo })

  const products = [
    // ─── Медицинская uniforима ───
    {
      nameRu: 'Форма Тез тиббий ёрдам (летняя)',
      nameUz: 'Tez tibbiy yordam forması (yozgi)',
      descRu: 'Летний комплект скорой помощи: белое поло с красными вставками, брюки-карго с световозвращающими полосами, кепка с символикой 103.',
      descUz: 'Yozgi tez tibbiy yordam to\'plami: oq polo ko\'ylak qizil qo\'shimchalar bilan, aks ettiruvchi chiziqlari bo\'lgan kargo shim, 103 belgili kepka.',
      slug: 'forma-tez-tibbiy-yordam-yozgi',
      categoryId: med,
      images: ['0ca98844ec57e7d155e85033c12c4cce_b87e9d35-3771-47fc-8f2b-9131b7c13883_500.jpg'],
      isNew: true,
    },
    {
      nameRu: 'Форма Тез тиббий ёрдам (зимняя)',
      nameUz: 'Tez tibbiy yordam forması (qishki)',
      descRu: 'Зимний комплект скорой помощи: красная куртка с капюшоном, брюки с световозвращающими полосами и надписью TEZ TIBBIY YORDAM.',
      descUz: 'Qishki tez tibbiy yordam to\'plami: qizil boshqopqali kurtka, aks ettiruvchi chiziqlari bo\'lgan shim, TEZ TIBBIY YORDAM yozuvi.',
      slug: 'forma-tez-tibbiy-yordam-qishki',
      categoryId: med,
      images: ['0f8d07eb33bb4ca1803dfb0da84603cb_78351551-cbae-4e59-a9a2-a374995b1258_500.jpg'],
      isNew: true,
    },
    {
      nameRu: 'Форма Тез тиббий ёрдам (синяя)',
      nameUz: 'Tez tibbiy yordam forması (ko\'k)',
      descRu: 'Комплект скорой помощи: тёмно-синее поло с красными деталями, красные брюки-карго, кепка с символикой.',
      descUz: 'Tez tibbiy yordam to\'plami: to\'q ko\'k polo ko\'ylak qizil detallari bilan, qizil kargo shim, belgilik kepka.',
      slug: 'forma-tez-tibbiy-yordam-kok',
      categoryId: med,
      images: ['11370d4d069ef54f893f4ac374fb0e20_3c223fd0-9ade-4a28-b5d6-9d221717408f_500.jpg'],
    },
    {
      nameRu: 'Медицинский халат белый (без воротника)',
      nameUz: 'Tibbiy xalat oq (yoqasiz)',
      descRu: 'Белый медицинский халат без воротника, с застёжками на кнопках, два кармана внизу. Подходит для врачей и фармацевтов.',
      descUz: 'Oq tibbiy xalat yoqasiz, tugmali yopish, pastda ikki cho\'ntak. Shifokorlar va farmatsevtlar uchun mos.',
      slug: 'tibbiy-xalat-oq-yoqasiz',
      categoryId: med,
      images: ['752f19164c723a77f0e8a28e39bb001e_8e2bfa18-c933-47e9-877a-3c66972eeca9.jpg'],
    },
    {
      nameRu: 'Медицинская рубашка скорой помощи',
      nameUz: 'Tez tibbiy yordam tibbiy ko\'ylagi',
      descRu: 'Красная медицинская рубашка с световозвращающими полосами, карманами и эмблемой скорой помощи, кепка в комплекте.',
      descUz: 'Qizil tibbiy ko\'ylak aks ettiruvchi chiziqlari, cho\'ntaklari va tez tibbiy yordam emblemasi bilan, kepka komplektda.',
      slug: 'tibbiy-koylak-tez-yordam',
      categoryId: med,
      images: ['777c5e58c59f2c347f5f818e105f227c_236e72ae-8d4f-4724-8314-497672317a97_500.jpg'],
    },
    {
      nameRu: 'Медицинский халат с брюками',
      nameUz: 'Tibbiy xalat shimli to\'plam',
      descRu: 'Полный медицинский комплект: белый халат на пуговицах с нагрудным карманом и тёмно-синими брюками.',
      descUz: 'To\'liq tibbiy to\'plam: tugmali oq xalat ko\'krak cho\'ntagi va to\'q ko\'k shim bilan.',
      slug: 'tibbiy-xalat-shimli-toplam',
      categoryId: med,
      images: ['acd490d829992d693a87a1cc2caa5295_53d908c0-bc21-4dea-a2bc-425f491b70c5_500.jpg'],
    },
    {
      nameRu: 'Форма Тез тиббий ёрдам (синяя/красная с кепкой)',
      nameUz: 'Tez tibbiy yordam forması (ko\'k/qizil, kepkali)',
      descRu: 'Комплект скорой помощи: синее поло, красные брюки 103, кепка с флагом Узбекистана.',
      descUz: 'Tez tibbiy yordam to\'plami: ko\'k polo, 103 yozuvi qizil shim, O\'zbekiston bayroqli kepka.',
      slug: 'forma-tez-yordam-kok-qizil-kepkali',
      categoryId: med,
      images: ['d454a44f74889f1910a8a28ac85d28cf_3e4c10e7-91c1-4f78-8418-8d67ca8e44e6_500.jpg'],
    },
    {
      nameRu: 'Форма Тез тиббий ёрдам (длинный рукав)',
      nameUz: 'Tez tibbiy yordam forması (uzun yengli)',
      descRu: 'Комплект скорой помощи с длинным рукавом: красное поло, брюки-карго, кепка с символикой 103.',
      descUz: 'Uzun yengli tez tibbiy yordam to\'plami: qizil polo ko\'ylak, kargo shim, 103 belgili kepka.',
      slug: 'forma-tez-yordam-uzun-yengli',
      categoryId: med,
      images: ['d670634cc9ef43e3d7206310bad9c834_c78bc339-91ad-44a5-a5ff-2431781bea52_500.jpg'],
    },

    // ─── Uniforима ───
    {
      nameRu: 'Форма Santal (голубая поло)',
      nameUz: 'Santal forması (ko\'k polo)',
      descRu: 'Брендированная форма Santal: голубое поло с белым воротником, белая кепка в комплекте.',
      descUz: 'Santal brendlangan forması: oq yoqali ko\'k polo ko\'ylak, oq kepka komplektda.',
      slug: 'forma-santal-kok-polo',
      categoryId: uni,
      images: [
        '199fa978872254d4c2697cc9fc8adfd8_d6e67cef-3f05-4f42-b6c5-469622dbd372_500.jpg',
        '7b0f058703b5967cbe9780129cbc3cbe_aebe99fd-6654-4150-84fc-523962abc8db_500.jpg',
      ],
      isCollection: true,
    },
    {
      nameRu: 'Форма Bellissimo Pizza',
      nameUz: 'Bellissimo Pizza forması',
      descRu: 'Брендированная форма для ресторана: красное поло на молнии с логотипом Bellissimo Pizza, кепка в комплекте.',
      descUz: 'Restoran uchun brendlangan forma: Bellissimo Pizza logotipi bilan qizil fermuar polo, kepka komplektda.',
      slug: 'forma-bellissimo-pizza',
      categoryId: uni,
      images: ['1f11e67c9b680fb781db2ba04954d4c0_ba10eead-acd3-44b1-afe3-bb86305b4544_500.jpg'],
      isCollection: true,
    },
    {
      nameRu: 'Форма Yandex Lavka',
      nameUz: 'Yandex Lavka forması',
      descRu: 'Брендированная форма Yandex Lavka: голубая футболка с логотипом и тёмно-синими брюками.',
      descUz: 'Yandex Lavka brendlangan forması: logotipi bilan ko\'k futbolka va to\'q ko\'k shim.',
      slug: 'forma-yandex-lavka',
      categoryId: uni,
      images: [
        '3c6e3e42931344510d42b358406a597c_b1e6df06-a68e-4916-a832-619268eff112_500.jpg',
        'a2eedb39420d833258506646f4a1e768_bb48b88f-e3b1-4ecf-b646-49cf4b0146c5_500.jpg',
      ],
      isCollection: true,
    },
    {
      nameRu: 'Футболка Oscar (брендированная)',
      nameUz: 'Oscar brendlangan futbolkasi',
      descRu: 'Брендированная футболка Oscar "We Paint Dreams" — синяя с белым принтом и логотипом компании.',
      descUz: 'Oscar "We Paint Dreams" brendlangan futbolka — oq print va kompaniya logotipi bilan ko\'k.',
      slug: 'futbolka-oscar-brendlangan',
      categoryId: promo,
      images: ['542a04b9c92242342a4654028be8e9dd_0f40ab1e-9288-4f4c-a332-8f76a1d19703_500.jpg'],
    },
    {
      nameRu: 'Форма Tezkor (фиолетовая)',
      nameUz: 'Tezkor forması (binafsha)',
      descRu: 'Брендированная форма Tezkor: фиолетовая футболка с логотипом, кепка в комплекте.',
      descUz: 'Tezkor brendlangan forması: logotipi bilan binafsha futbolka, kepka komplektda.',
      slug: 'forma-tezkor-binafsha',
      categoryId: uni,
      images: ['8cf46a01cf8cb810fc709a024e2348d5_37d3461d-16a6-4971-a730-e16c53f393c5_500.jpg'],
    },
    {
      nameRu: 'Форма Blanc Bleu (туника)',
      nameUz: 'Blanc Bleu forması (tunika)',
      descRu: 'Женская брендированная туника Blanc Bleu: синяя с V-образным вырезом и белой отделкой, кепка в комплекте.',
      descUz: 'Blanc Bleu ayollar brendlangan tunikasi: V-yoqa oq bezaklari bilan ko\'k, kepka komplektda.',
      slug: 'forma-blanc-bleu-tunika',
      categoryId: uni,
      images: ['af80eeea3930932268ac94e73cd3b289_3b6883cb-2a48-45a4-8921-8aa59210c231_500.jpg'],
    },
    {
      nameRu: 'Форма Pepsi (бежевая поло)',
      nameUz: 'Pepsi forması (bej polo)',
      descRu: 'Брендированная форма Pepsi: бежевое поло с логотипом и тёмно-синими брюками.',
      descUz: 'Pepsi brendlangan forması: logotipi bilan bej polo va to\'q ko\'k shim.',
      slug: 'forma-pepsi-bej-polo',
      categoryId: uni,
      images: ['e528fdf8292786dd2f66998936324637_92b98658-58fd-4b45-ab96-dcb519f3d7cc_500.jpg'],
      isCollection: true,
    },
    {
      nameRu: 'Поло Axmad Oltin Joya',
      nameUz: 'Axmad Oltin Joya polo ko\'ylagi',
      descRu: 'Чёрное поло с вышивкой Axmad Oltin Joya, зелёный воротник и манжеты с жёлтой отделкой.',
      descUz: 'Axmad Oltin Joya kashtali qora polo, yashil yoqa va sariq bezakli manjetlar.',
      slug: 'polo-axmad-oltin-joya',
      categoryId: uni,
      images: ['IMAGE 2026-05-14 17:57:21.jpg'],
      isCollection: true,
    },
    {
      nameRu: 'Жилет Level UP 2.0',
      nameUz: 'Level UP 2.0 jilet',
      descRu: 'Брендированный жилет Level UP 2.0 с капюшоном, красный с чёрными рукавами.',
      descUz: 'Level UP 2.0 brendlangan boshqopqali jilet, qora yengli qizil.',
      slug: 'jilet-level-up-2',
      categoryId: uni,
      images: ['IMAGE 2026-05-14 17:58:49.jpg'],
    },
    {
      nameRu: 'Поло CCI Luxembourg (чёрная)',
      nameUz: 'CCI Luxembourg polo (qora)',
      descRu: 'Чёрное поло с длинным рукавом и логотипом CCI Luxembourg, кепка в комплекте.',
      descUz: 'CCI Luxembourg logotipi bilan uzun yengli qora polo, kepka komplektda.',
      slug: 'polo-cci-luxembourg-qora',
      categoryId: uni,
      images: ['IMAGE 2026-05-14 17:58:53.jpg'],
    },
    {
      nameRu: 'Жилет Akfa Lighting',
      nameUz: 'Akfa Lighting jilet',
      descRu: 'Тёмно-синий стёганый жилет с капюшоном и логотипом Akfa Lighting.',
      descUz: 'Akfa Lighting logotipi bilan to\'q ko\'k boshqopqali to\'qima jilet.',
      slug: 'jilet-akfa-lighting',
      categoryId: uni,
      images: ['IMAGE 2026-05-14 17:59:02.jpg'],
    },
    {
      nameRu: 'Куртка Venttum (спортивная)',
      nameUz: 'Venttum sport kurtkasi',
      descRu: 'Спортивная куртка Venttum: тёмно-синяя с красными и серебристыми вставками, на молнии.',
      descUz: 'Venttum sport kurtkasi: qizil va kumush qo\'shimchalari bo\'lgan to\'q ko\'k, fermuarli.',
      slug: 'kurtka-venttum-sport',
      categoryId: uni,
      images: ['IMAGE 2026-05-14 17:59:08.jpg'],
    },

    // ─── Головные уборы ───
    {
      nameRu: 'Кепка UZKABEL (вышивка)',
      nameUz: 'UZKABEL kepkasi (kashtali)',
      descRu: 'Тёмно-синяя кепка с вышитым логотипом UZKABEL — оранжевый круговой знак с белым текстом.',
      descUz: 'UZKABEL logotipi kashtali to\'q ko\'k kepka — oq matnli to\'garak belgi bilan.',
      slug: 'kepka-uzkabel',
      categoryId: cap,
      images: ['191152c40d587aecb13512f44700c855_b8770e3b-2783-4973-88bd-dee79ce4e760_500.jpg'],
    },
    {
      nameRu: 'Кепка SEG Motol',
      nameUz: 'SEG Motol kepkasi',
      descRu: 'Красная кепка с принтом SEG Motol Engine Oil — корпоративный брендинг.',
      descUz: 'SEG Motol Engine Oil printli qizil kepka — korporativ brendlash.',
      slug: 'kepka-seg-motol',
      categoryId: cap,
      images: ['3937b43c66a85762c7fc740429a46856_aa9b2f9d-944d-49e8-9160-2ad6a204cea2_500.jpg'],
    },
    {
      nameRu: 'Коллекция брендированных кепок',
      nameUz: 'Brendlangan kepkalar kolleksiyasi',
      descRu: 'Большой выбор кепок с логотипами: UZKABEL, Hayat, Lucem, SEG Motol, Knauf и другие. Любой цвет под заказ.',
      descUz: 'Katta kepkalar tanlovi logotiplar bilan: UZKABEL, Hayat, Lucem, SEG Motol, Knauf va boshqalar. Buyurtma bo\'yicha istalgan rang.',
      slug: 'kolleksiya-brendlangan-kepkalar',
      categoryId: cap,
      images: ['5339854d439b3df6e323e665693aeaa0_c1979c18-4431-4022-b838-64c1e6bee9ec_500.jpg'],
      isCollection: true,
    },
    {
      nameRu: 'Кепка Lucem',
      nameUz: 'Lucem kepkasi',
      descRu: 'Белая кепка с логотипом Lucem — чёрный текст с жёлтой подчёркивающей линией.',
      descUz: 'Lucem logotipi bilan oq kepka — sariq tagchiziq bilan qora matn.',
      slug: 'kepka-lucem',
      categoryId: cap,
      images: ['9b2f1cbb5f2056c40e209a4fef36a235_370ee71c-b5ba-40d0-9cde-608df19230a0_500.jpg'],
    },
    {
      nameRu: 'Кепка Knauf (оранжевая)',
      nameUz: 'Knauf kepkasi (to\'q sariq)',
      descRu: 'Оранжевая кепка с логотипом I ❤ KNAUF — синий текст с красным сердцем.',
      descUz: 'I ❤ KNAUF logotipi bilan to\'q sariq kepka — qizil yurak bilan ko\'k matn.',
      slug: 'kepka-knauf-sariq',
      categoryId: cap,
      images: [
        'ae2f117838f9411ec798dbf6c5382814_a299ab24-432c-411c-8fe2-84696d375b2c_500.jpg',
        'ba41b868f6b19a97ee37073da9a1006d_3948f7db-5a67-4b48-b108-34eac6b10f60_500.jpg',
      ],
    },
    {
      nameRu: 'Кепка Hayat',
      nameUz: 'Hayat kepkasi',
      descRu: 'Тёмно-синяя кепка с вышитым логотипом Hayat — белая вышивка с фигурой льва.',
      descUz: 'Hayat logotipi kashtali to\'q ko\'k kepka — arslon figurasi bilan oq kashta.',
      slug: 'kepka-hayat',
      categoryId: cap,
      images: ['d4525eac795535d49accd950e68df11b_0f417ca9-d706-46b8-81f2-03f806fd207a_500.jpg'],
    },

    // ─── Спецодежда ───
    {
      nameRu: 'Рабочий костюм (бежевый)',
      nameUz: 'Ishchi kiyim to\'plami (bej)',
      descRu: 'Профессиональный рабочий костюм: бежевая куртка с карманами и световозвращающими вставками, брюки-карго, кепка.',
      descUz: 'Professional ishchi kiyim to\'plami: cho\'ntakli va aks ettiruvchi qo\'shimchalari bo\'lgan bej kurtka, kargo shim, kepka.',
      slug: 'ishchi-kiyim-bej',
      categoryId: spec,
      images: ['9fde25abae601e98458bdf18756803ab_58ed1da6-8fdb-4769-8972-b8087019fa40_500.jpg'],
    },
    {
      nameRu: 'Рабочий костюм (серый/чёрный)',
      nameUz: 'Ishchi kiyim to\'plami (kulrang/qora)',
      descRu: 'Профессиональный рабочий костюм: серая куртка с чёрными вставками на молнии, световозвращающие полосы, тёмно-синие брюки.',
      descUz: 'Professional ishchi kiyim: qora qo\'shimchalari bilan kulrang fermuarli kurtka, aks ettiruvchi chiziqlar, to\'q ko\'k shim.',
      slug: 'ishchi-kiyim-kulrang-qora',
      categoryId: spec,
      images: ['d3e5ea908e1d46aa69fd332f5ca1c5c6_e2767a24-185b-4e87-8f26-a5ba7ed89f74_500.jpg'],
    },
  ]

  console.log(`\n${products.length} ta mahsulot qo'shilmoqda...\n`)

  for (const p of products) {
    const images = JSON.stringify(p.images.map(f => `/uploads/${f}`))
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        nameRu: p.nameRu, nameUz: p.nameUz,
        descRu: p.descRu, descUz: p.descUz,
        images, categoryId: p.categoryId,
        isNew: p.isNew || false,
        isCollection: p.isCollection || false,
        isHoliday: p.isHoliday || false,
      },
      create: {
        nameRu: p.nameRu, nameUz: p.nameUz,
        descRu: p.descRu, descUz: p.descUz,
        images, categoryId: p.categoryId,
        slug: p.slug,
        isNew: p.isNew || false,
        isCollection: p.isCollection || false,
        isHoliday: p.isHoliday || false,
      },
    })
    console.log(`  ✓ ${p.nameRu}`)
  }

  console.log(`\n✅ ${products.length} ta mahsulot muvaffaqiyatli qo'shildi!`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
