const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user — always upsert, never overwrite
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@artprint.uz' },
    update: {},
    create: { email: 'admin@artprint.uz', password: hash, name: 'Admin' },
  });

  // Settings — upsert with default address, preserve existing changes
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({ data: {
      telegram: "https://t.me/artprint_uz",
      email: "info@artprint.uz",
      phone: "+998 77 741 66 88",
      address: "Республика Узбекистан, г. Ташкент, Яккасарайский район, ул. Нукус, дом 12",
      mapLat: "41.2995",
      mapLng: "69.2401",
      aboutRu: "Art Print and Textile является одним из ведущих производителей швейной продукции в Узбекистане.",
      aboutUz: "Art Print and Textile — O'zbekistondagi etakchi tikuvchilik mahsulotlari ishlab chiqaruvchilaridan biri."
    }});
  }

  // Banner — create if none exist
  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    await prisma.banner.create({ data: { imageUrl: '/uploads/banner-main.png', order: 0 } });
  }

  // Skip seeding if data already exists — preserve admin changes
  const catCount = await prisma.category.count();
  if (catCount > 0) {
    console.log('Database already has data, skipping categories/products/services seed.');
    return;
  }
  const categoryMap = {};
  const cat_cmq8ejy170000kpkl4st4xpou = await prisma.category.create({ data: { nameRu: "Спецодежда", nameUz: "Maxsus kiyim", icon: "🦺", slug: "specodejda", order: 0 } });
  categoryMap["cmq8ejy170000kpkl4st4xpou"] = cat_cmq8ejy170000kpkl4st4xpou.id;
  const cat_cmq8ejy190001kpkl7ryf6dl3 = await prisma.category.create({ data: { nameRu: "futbolka", nameUz: "futbolka", icon: "👕", slug: "futbolka-1781094079542", order: 0 } });
  categoryMap["cmq8ejy190001kpkl7ryf6dl3"] = cat_cmq8ejy190001kpkl7ryf6dl3.id;
  const cat_cmq8ejy190002kpklet1oflhe = await prisma.category.create({ data: { nameRu: "Униформа", nameUz: "Forma", icon: "🧥", slug: "uniforma", order: 1 } });
  categoryMap["cmq8ejy190002kpklet1oflhe"] = cat_cmq8ejy190002kpklet1oflhe.id;
  const cat_cmq8ejy1a0003kpkl9oz28avi = await prisma.category.create({ data: { nameRu: "Медицинская униформа", nameUz: "Tibbiy forma", icon: "🥼", slug: "medicinskaya-uniforma", order: 2 } });
  categoryMap["cmq8ejy1a0003kpkl9oz28avi"] = cat_cmq8ejy1a0003kpkl9oz28avi.id;
  const cat_cmq8ejy1a0004kpklpg1qmfkj = await prisma.category.create({ data: { nameRu: "Промотекстиль", nameUz: "Promotekstil", icon: "🧵", slug: "promotekstil", order: 3 } });
  categoryMap["cmq8ejy1a0004kpklpg1qmfkj"] = cat_cmq8ejy1a0004kpklpg1qmfkj.id;
  const cat_cmq8ejy1b0005kpkl7zi2wwg1 = await prisma.category.create({ data: { nameRu: "Трикотажные изделия", nameUz: "Trikotaj mahsulotlar", icon: "🧶", slug: "trikotajnye-izdeliya", order: 4 } });
  categoryMap["cmq8ejy1b0005kpkl7zi2wwg1"] = cat_cmq8ejy1b0005kpkl7zi2wwg1.id;
  const cat_cmq8ejy1b0006kpklmj85pp5b = await prisma.category.create({ data: { nameRu: "Тканевые изделия", nameUz: "To'qima mahsulotlar", icon: "🪡", slug: "tkanevye-izdeliya", order: 5 } });
  categoryMap["cmq8ejy1b0006kpklmj85pp5b"] = cat_cmq8ejy1b0006kpklmj85pp5b.id;
  const cat_cmq8ejy1b0007kpklblszvif9 = await prisma.category.create({ data: { nameRu: "Головные уборы", nameUz: "Bosh kiyimlar", icon: "🧢", slug: "golovnye-ubory", order: 6 } });
  categoryMap["cmq8ejy1b0007kpklblszvif9"] = cat_cmq8ejy1b0007kpklblszvif9.id;
  const cat_cmq8ejy1c0008kpklp5dghrhe = await prisma.category.create({ data: { nameRu: "Сорочки, рубашки", nameUz: "Ko'ylaklar", icon: "👔", slug: "sorochki-rubashki", order: 7 } });
  categoryMap["cmq8ejy1c0008kpklp5dghrhe"] = cat_cmq8ejy1c0008kpklp5dghrhe.id;
  const cat_cmq8ejy1c0009kpklmflxen5s = await prisma.category.create({ data: { nameRu: "Постельное белье", nameUz: "Yotoq to'shamalari", icon: "🛏️", slug: "postelnoe-belye", order: 8 } });
  categoryMap["cmq8ejy1c0009kpklmflxen5s"] = cat_cmq8ejy1c0009kpklmflxen5s.id;
  const cat_cmq8ejy1c000akpklk0a3d7t4 = await prisma.category.create({ data: { nameRu: "Полотенце", nameUz: "Sochiq", icon: "🧺", slug: "polotence", order: 9 } });
  categoryMap["cmq8ejy1c000akpklk0a3d7t4"] = cat_cmq8ejy1c000akpklk0a3d7t4.id;
  const cat_cmq8ejy1d000bkpkl80jhvdz6 = await prisma.category.create({ data: { nameRu: "Сумки и рюкзаки", nameUz: "Sumkalar va ryukzaklar", icon: "🎒", slug: "sumki-ryukzaki", order: 10 } });
  categoryMap["cmq8ejy1d000bkpkl80jhvdz6"] = cat_cmq8ejy1d000bkpkl80jhvdz6.id;
  const cat_cmq8ejy1d000ckpkltv8vdrnv = await prisma.category.create({ data: { nameRu: "Спецобувь", nameUz: "Maxsus poyabzal", icon: "👢", slug: "specobuvj", order: 11 } });
  categoryMap["cmq8ejy1d000ckpkltv8vdrnv"] = cat_cmq8ejy1d000ckpkltv8vdrnv.id;
  const cat_cmq8ejy1e000dkpkly5lka4wn = await prisma.category.create({ data: { nameRu: "СИЗ", nameUz: "Shaxsiy himoya vositalari", icon: "🧤", slug: "siz", order: 12 } });
  categoryMap["cmq8ejy1e000dkpkly5lka4wn"] = cat_cmq8ejy1e000dkpkly5lka4wn.id;
  const cat_cmq8ejy1e000ekpkl2h3xdgow = await prisma.category.create({ data: { nameRu: "Сувенирная продукция", nameUz: "Sovg'a mahsulotlar", icon: "🎁", slug: "suvenirnaya-produkciya", order: 13 } });
  categoryMap["cmq8ejy1e000ekpkl2h3xdgow"] = cat_cmq8ejy1e000ekpkl2h3xdgow.id;

  // Products
  await prisma.product.create({ data: { nameRu: "Форма Тез тиббий ёрдам (летняя)", nameUz: "Tez tibbiy yordam forması (yozgi)", descRu: "Летний комплект скорой помощи: белое поло с красными вставками, брюки-карго с световозвращающими полосами, кепка с символикой 103.", descUz: "Yozgi tez tibbiy yordam to'plami: oq polo ko'ylak qizil qo'shimchalar bilan, aks ettiruvchi chiziqlari bo'lgan kargo shim, 103 belgili kepka.", images: "[\"/uploads/0ca98844ec57e7d155e85033c12c4cce_b87e9d35-3771-47fc-8f2b-9131b7c13883_500.jpg\"]", isNew: true, isCollection: false, isHoliday: false, slug: "forma-tez-tibbiy-yordam-yozgi", categoryId: categoryMap["cmq8ejy1a0003kpkl9oz28avi"] } });
  await prisma.product.create({ data: { nameRu: "Форма Тез тиббий ёрдам (зимняя)", nameUz: "Tez tibbiy yordam forması (qishki)", descRu: "Зимний комплект скорой помощи: красная куртка с капюшоном, брюки с световозвращающими полосами и надписью TEZ TIBBIY YORDAM.", descUz: "Qishki tez tibbiy yordam to'plami: qizil boshqopqali kurtka, aks ettiruvchi chiziqlari bo'lgan shim, TEZ TIBBIY YORDAM yozuvi.", images: "[\"/uploads/0f8d07eb33bb4ca1803dfb0da84603cb_78351551-cbae-4e59-a9a2-a374995b1258_500.jpg\"]", isNew: true, isCollection: false, isHoliday: false, slug: "forma-tez-tibbiy-yordam-qishki", categoryId: categoryMap["cmq8ejy1a0003kpkl9oz28avi"] } });
  await prisma.product.create({ data: { nameRu: "Форма Тез тиббий ёрдам (синяя)", nameUz: "Tez tibbiy yordam forması (ko'k)", descRu: "Комплект скорой помощи: тёмно-синее поло с красными деталями, красные брюки-карго, кепка с символикой.", descUz: "Tez tibbiy yordam to'plami: to'q ko'k polo ko'ylak qizil detallari bilan, qizil kargo shim, belgilik kepka.", images: "[\"/uploads/11370d4d069ef54f893f4ac374fb0e20_3c223fd0-9ade-4a28-b5d6-9d221717408f_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "forma-tez-tibbiy-yordam-kok", categoryId: categoryMap["cmq8ejy1a0003kpkl9oz28avi"] } });
  await prisma.product.create({ data: { nameRu: "Медицинский халат белый (без воротника)", nameUz: "Tibbiy xalat oq (yoqasiz)", descRu: "Белый медицинский халат без воротника, с застёжками на кнопках, два кармана внизу. Подходит для врачей и фармацевтов.", descUz: "Oq tibbiy xalat yoqasiz, tugmali yopish, pastda ikki cho'ntak. Shifokorlar va farmatsevtlar uchun mos.", images: "[\"/uploads/752f19164c723a77f0e8a28e39bb001e_8e2bfa18-c933-47e9-877a-3c66972eeca9.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "tibbiy-xalat-oq-yoqasiz", categoryId: categoryMap["cmq8ejy1a0003kpkl9oz28avi"] } });
  await prisma.product.create({ data: { nameRu: "Медицинская рубашка скорой помощи", nameUz: "Tez tibbiy yordam tibbiy ko'ylagi", descRu: "Красная медицинская рубашка с световозвращающими полосами, карманами и эмблемой скорой помощи, кепка в комплекте.", descUz: "Qizil tibbiy ko'ylak aks ettiruvchi chiziqlari, cho'ntaklari va tez tibbiy yordam emblemasi bilan, kepka komplektda.", images: "[\"/uploads/777c5e58c59f2c347f5f818e105f227c_236e72ae-8d4f-4724-8314-497672317a97_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "tibbiy-koylak-tez-yordam", categoryId: categoryMap["cmq8ejy1a0003kpkl9oz28avi"] } });
  await prisma.product.create({ data: { nameRu: "Медицинский халат с брюками", nameUz: "Tibbiy xalat shimli to'plam", descRu: "Полный медицинский комплект: белый халат на пуговицах с нагрудным карманом и тёмно-синими брюками.", descUz: "To'liq tibbiy to'plam: tugmali oq xalat ko'krak cho'ntagi va to'q ko'k shim bilan.", images: "[\"/uploads/acd490d829992d693a87a1cc2caa5295_53d908c0-bc21-4dea-a2bc-425f491b70c5_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "tibbiy-xalat-shimli-toplam", categoryId: categoryMap["cmq8ejy1a0003kpkl9oz28avi"] } });
  await prisma.product.create({ data: { nameRu: "Форма Тез тиббий ёрдам (синяя/красная с кепкой)", nameUz: "Tez tibbiy yordam forması (ko'k/qizil, kepkali)", descRu: "Комплект скорой помощи: синее поло, красные брюки 103, кепка с флагом Узбекистана.", descUz: "Tez tibbiy yordam to'plami: ko'k polo, 103 yozuvi qizil shim, O'zbekiston bayroqli kepka.", images: "[\"/uploads/d454a44f74889f1910a8a28ac85d28cf_3e4c10e7-91c1-4f78-8418-8d67ca8e44e6_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "forma-tez-yordam-kok-qizil-kepkali", categoryId: categoryMap["cmq8ejy1a0003kpkl9oz28avi"] } });
  await prisma.product.create({ data: { nameRu: "Форма Тез тиббий ёрдам (длинный рукав)", nameUz: "Tez tibbiy yordam forması (uzun yengli)", descRu: "Комплект скорой помощи с длинным рукавом: красное поло, брюки-карго, кепка с символикой 103.", descUz: "Uzun yengli tez tibbiy yordam to'plami: qizil polo ko'ylak, kargo shim, 103 belgili kepka.", images: "[\"/uploads/d670634cc9ef43e3d7206310bad9c834_c78bc339-91ad-44a5-a5ff-2431781bea52_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "forma-tez-yordam-uzun-yengli", categoryId: categoryMap["cmq8ejy1a0003kpkl9oz28avi"] } });
  await prisma.product.create({ data: { nameRu: "Форма Santal (голубая поло)", nameUz: "Santal forması (ko'k polo)", descRu: "Брендированная форма Santal: голубое поло с белым воротником, белая кепка в комплекте.", descUz: "Santal brendlangan forması: oq yoqali ko'k polo ko'ylak, oq kepka komplektda.", images: "[\"/uploads/199fa978872254d4c2697cc9fc8adfd8_d6e67cef-3f05-4f42-b6c5-469622dbd372_500.jpg\",\"/uploads/7b0f058703b5967cbe9780129cbc3cbe_aebe99fd-6654-4150-84fc-523962abc8db_500.jpg\"]", isNew: false, isCollection: true, isHoliday: false, slug: "forma-santal-kok-polo", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Форма Bellissimo Pizza", nameUz: "Bellissimo Pizza forması", descRu: "Брендированная форма для ресторана: красное поло на молнии с логотипом Bellissimo Pizza, кепка в комплекте.", descUz: "Restoran uchun brendlangan forma: Bellissimo Pizza logotipi bilan qizil fermuar polo, kepka komplektda.", images: "[\"/uploads/1f11e67c9b680fb781db2ba04954d4c0_ba10eead-acd3-44b1-afe3-bb86305b4544_500.jpg\"]", isNew: false, isCollection: true, isHoliday: false, slug: "forma-bellissimo-pizza", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Форма Yandex Lavka", nameUz: "Yandex Lavka forması", descRu: "Брендированная форма Yandex Lavka: голубая футболка с логотипом и тёмно-синими брюками.", descUz: "Yandex Lavka brendlangan forması: logotipi bilan ko'k futbolka va to'q ko'k shim.", images: "[\"/uploads/3c6e3e42931344510d42b358406a597c_b1e6df06-a68e-4916-a832-619268eff112_500.jpg\",\"/uploads/a2eedb39420d833258506646f4a1e768_bb48b88f-e3b1-4ecf-b646-49cf4b0146c5_500.jpg\"]", isNew: false, isCollection: true, isHoliday: false, slug: "forma-yandex-lavka", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Футболка Oscar (брендированная)", nameUz: "Oscar brendlangan futbolkasi", descRu: "Брендированная футболка Oscar \"We Paint Dreams\" — синяя с белым принтом и логотипом компании.", descUz: "Oscar \"We Paint Dreams\" brendlangan futbolka — oq print va kompaniya logotipi bilan ko'k.", images: "[\"/uploads/542a04b9c92242342a4654028be8e9dd_0f40ab1e-9288-4f4c-a332-8f76a1d19703_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "futbolka-oscar-brendlangan", categoryId: categoryMap["cmq8ejy1a0004kpklpg1qmfkj"] } });
  await prisma.product.create({ data: { nameRu: "Форма Tezkor (фиолетовая)", nameUz: "Tezkor forması (binafsha)", descRu: "Брендированная форма Tezkor: фиолетовая футболка с логотипом, кепка в комплекте.", descUz: "Tezkor brendlangan forması: logotipi bilan binafsha futbolka, kepka komplektda.", images: "[\"/uploads/8cf46a01cf8cb810fc709a024e2348d5_37d3461d-16a6-4971-a730-e16c53f393c5_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "forma-tezkor-binafsha", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Форма Blanc Bleu (туника)", nameUz: "Blanc Bleu forması (tunika)", descRu: "Женская брендированная туника Blanc Bleu: синяя с V-образным вырезом и белой отделкой, кепка в комплекте.", descUz: "Blanc Bleu ayollar brendlangan tunikasi: V-yoqa oq bezaklari bilan ko'k, kepka komplektda.", images: "[\"/uploads/af80eeea3930932268ac94e73cd3b289_3b6883cb-2a48-45a4-8921-8aa59210c231_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "forma-blanc-bleu-tunika", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Форма Pepsi (бежевая поло)", nameUz: "Pepsi forması (bej polo)", descRu: "Брендированная форма Pepsi: бежевое поло с логотипом и тёмно-синими брюками.", descUz: "Pepsi brendlangan forması: logotipi bilan bej polo va to'q ko'k shim.", images: "[\"/uploads/e528fdf8292786dd2f66998936324637_92b98658-58fd-4b45-ab96-dcb519f3d7cc_500.jpg\"]", isNew: false, isCollection: true, isHoliday: false, slug: "forma-pepsi-bej-polo", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Поло Axmad Oltin Joya", nameUz: "Axmad Oltin Joya polo ko'ylagi", descRu: "Чёрное поло с вышивкой Axmad Oltin Joya, зелёный воротник и манжеты с жёлтой отделкой.", descUz: "Axmad Oltin Joya kashtali qora polo, yashil yoqa va sariq bezakli manjetlar.", images: "[\"/uploads/IMAGE_2026-05-14_17:57:21.jpg\"]", isNew: false, isCollection: true, isHoliday: false, slug: "polo-axmad-oltin-joya", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Жилет Level UP 2.0", nameUz: "Level UP 2.0 jilet", descRu: "Брендированный жилет Level UP 2.0 с капюшоном, красный с чёрными рукавами.", descUz: "Level UP 2.0 brendlangan boshqopqali jilet, qora yengli qizil.", images: "[\"/uploads/IMAGE_2026-05-14_17:58:49.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "jilet-level-up-2", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Поло CCI Luxembourg (чёрная)", nameUz: "CCI Luxembourg polo (qora)", descRu: "Чёрное поло с длинным рукавом и логотипом CCI Luxembourg, кепка в комплекте.", descUz: "CCI Luxembourg logotipi bilan uzun yengli qora polo, kepka komplektda.", images: "[\"/uploads/IMAGE_2026-05-14_17:58:53.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "polo-cci-luxembourg-qora", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Жилет Akfa Lighting", nameUz: "Akfa Lighting jilet", descRu: "Тёмно-синий стёганый жилет с капюшоном и логотипом Akfa Lighting.", descUz: "Akfa Lighting logotipi bilan to'q ko'k boshqopqali to'qima jilet.", images: "[\"/uploads/IMAGE_2026-05-14_17:59:02.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "jilet-akfa-lighting", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Куртка Venttum (спортивная)", nameUz: "Venttum sport kurtkasi", descRu: "Спортивная куртка Venttum: тёмно-синяя с красными и серебристыми вставками, на молнии.", descUz: "Venttum sport kurtkasi: qizil va kumush qo'shimchalari bo'lgan to'q ko'k, fermuarli.", images: "[\"/uploads/IMAGE_2026-05-14_17:59:08.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "kurtka-venttum-sport", categoryId: categoryMap["cmq8ejy190002kpklet1oflhe"] } });
  await prisma.product.create({ data: { nameRu: "Кепка UZKABEL (вышивка)", nameUz: "UZKABEL kepkasi (kashtali)", descRu: "Тёмно-синяя кепка с вышитым логотипом UZKABEL — оранжевый круговой знак с белым текстом.", descUz: "UZKABEL logotipi kashtali to'q ko'k kepka — oq matnli to'garak belgi bilan.", images: "[\"/uploads/191152c40d587aecb13512f44700c855_b8770e3b-2783-4973-88bd-dee79ce4e760_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "kepka-uzkabel", categoryId: categoryMap["cmq8ejy1b0007kpklblszvif9"] } });
  await prisma.product.create({ data: { nameRu: "Кепка SEG Motol", nameUz: "SEG Motol kepkasi", descRu: "Красная кепка с принтом SEG Motol Engine Oil — корпоративный брендинг.", descUz: "SEG Motol Engine Oil printli qizil kepka — korporativ brendlash.", images: "[\"/uploads/3937b43c66a85762c7fc740429a46856_aa9b2f9d-944d-49e8-9160-2ad6a204cea2_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "kepka-seg-motol", categoryId: categoryMap["cmq8ejy1b0007kpklblszvif9"] } });
  await prisma.product.create({ data: { nameRu: "Коллекция брендированных кепок", nameUz: "Brendlangan kepkalar kolleksiyasi", descRu: "Большой выбор кепок с логотипами: UZKABEL, Hayat, Lucem, SEG Motol, Knauf и другие. Любой цвет под заказ.", descUz: "Katta kepkalar tanlovi logotiplar bilan: UZKABEL, Hayat, Lucem, SEG Motol, Knauf va boshqalar. Buyurtma bo'yicha istalgan rang.", images: "[\"/uploads/5339854d439b3df6e323e665693aeaa0_c1979c18-4431-4022-b838-64c1e6bee9ec_500.jpg\"]", isNew: false, isCollection: true, isHoliday: false, slug: "kolleksiya-brendlangan-kepkalar", categoryId: categoryMap["cmq8ejy1b0007kpklblszvif9"] } });
  await prisma.product.create({ data: { nameRu: "Кепка Lucem", nameUz: "Lucem kepkasi", descRu: "Белая кепка с логотипом Lucem — чёрный текст с жёлтой подчёркивающей линией.", descUz: "Lucem logotipi bilan oq kepka — sariq tagchiziq bilan qora matn.", images: "[\"/uploads/9b2f1cbb5f2056c40e209a4fef36a235_370ee71c-b5ba-40d0-9cde-608df19230a0_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "kepka-lucem", categoryId: categoryMap["cmq8ejy1b0007kpklblszvif9"] } });
  await prisma.product.create({ data: { nameRu: "Кепка Knauf (оранжевая)", nameUz: "Knauf kepkasi (to'q sariq)", descRu: "Оранжевая кепка с логотипом I ❤ KNAUF — синий текст с красным сердцем.", descUz: "I ❤ KNAUF logotipi bilan to'q sariq kepka — qizil yurak bilan ko'k matn.", images: "[\"/uploads/ae2f117838f9411ec798dbf6c5382814_a299ab24-432c-411c-8fe2-84696d375b2c_500.jpg\",\"/uploads/ba41b868f6b19a97ee37073da9a1006d_3948f7db-5a67-4b48-b108-34eac6b10f60_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "kepka-knauf-sariq", categoryId: categoryMap["cmq8ejy1b0007kpklblszvif9"] } });
  await prisma.product.create({ data: { nameRu: "Кепка Hayat", nameUz: "Hayat kepkasi", descRu: "Тёмно-синяя кепка с вышитым логотипом Hayat — белая вышивка с фигурой льва.", descUz: "Hayat logotipi kashtali to'q ko'k kepka — arslon figurasi bilan oq kashta.", images: "[\"/uploads/d4525eac795535d49accd950e68df11b_0f417ca9-d706-46b8-81f2-03f806fd207a_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "kepka-hayat", categoryId: categoryMap["cmq8ejy1b0007kpklblszvif9"] } });
  await prisma.product.create({ data: { nameRu: "Рабочий костюм (бежевый)", nameUz: "Ishchi kiyim to'plami (bej)", descRu: "Профессиональный рабочий костюм: бежевая куртка с карманами и световозвращающими вставками, брюки-карго, кепка.", descUz: "Professional ishchi kiyim to'plami: cho'ntakli va aks ettiruvchi qo'shimchalari bo'lgan bej kurtka, kargo shim, kepka.", images: "[\"/uploads/9fde25abae601e98458bdf18756803ab_58ed1da6-8fdb-4769-8972-b8087019fa40_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "ishchi-kiyim-bej", categoryId: categoryMap["cmq8ejy170000kpkl4st4xpou"] } });
  await prisma.product.create({ data: { nameRu: "Рабочий костюм (серый/чёрный)", nameUz: "Ishchi kiyim to'plami (kulrang/qora)", descRu: "Профессиональный рабочий костюм: серая куртка с чёрными вставками на молнии, световозвращающие полосы, тёмно-синие брюки.", descUz: "Professional ishchi kiyim: qora qo'shimchalari bilan kulrang fermuarli kurtka, aks ettiruvchi chiziqlar, to'q ko'k shim.", images: "[\"/uploads/d3e5ea908e1d46aa69fd332f5ca1c5c6_e2767a24-185b-4e87-8f26-a5ba7ed89f74_500.jpg\"]", isNew: false, isCollection: false, isHoliday: false, slug: "ishchi-kiyim-kulrang-qora", categoryId: categoryMap["cmq8ejy170000kpkl4st4xpou"] } });

  // NavServices
  const nav_cmq8ejy1p001zkpkledie868i = await prisma.navService.create({ data: { nameRu: "Шелкография", nameUz: "Shyolkografiya", slug: "shelkografiya", order: 0, imageUrl: "/uploads/svc-shelko.jpg" } });
  const nav_cmq8ejy1p0020kpkl8wj6gjhq = await prisma.navService.create({ data: { nameRu: "Компьютерная вышивка", nameUz: "Kompyuter kashtasi", slug: "kompyuternaya-vyshivka", order: 1, imageUrl: "/uploads/svc-vyshivka.jpg" } });
  const nav_cmq8ejy1q0021kpkltw86j0ei = await prisma.navService.create({ data: { nameRu: "УФ-печать", nameUz: "UF-bosma", slug: "uf-pechat", order: 2, imageUrl: "/uploads/svc-uf.jpg" } });
  const nav_cmq8ejy1q0022kpklbakkhp76 = await prisma.navService.create({ data: { nameRu: "УФ-DTF печать", nameUz: "UF-DTF bosma", slug: "uf-dtf-pechat", order: 3, imageUrl: "/uploads/svc-ufdtf.jpg" } });
  const nav_cmq8ejy1q0023kpklholb0ecv = await prisma.navService.create({ data: { nameRu: "Тампопечать", nameUz: "Tampobosma", slug: "tampopechat", order: 4, imageUrl: "/uploads/svc-tampo.jpg" } });
  const nav_cmq8ejy1r0024kpklfnm75sfs = await prisma.navService.create({ data: { nameRu: "Тиснение", nameUz: "Tisnenie", slug: "tisnenie", order: 5, imageUrl: "/uploads/svc-tisnenie.jpg" } });
  const nav_cmq8ejy1r0025kpkl3zyidwl6 = await prisma.navService.create({ data: { nameRu: "Лазерная гравировка", nameUz: "Lazer gravirovka", slug: "lazernaya-gravirovka", order: 6, imageUrl: "/uploads/svc-lazer.jpg" } });
  const nav_cmq8ejy1r0026kpkluobg8tmz = await prisma.navService.create({ data: { nameRu: "Сублимация", nameUz: "Sublimatsiya", slug: "sublimatsiya", order: 7, imageUrl: "/uploads/svc-sublim.jpg" } });


  console.log('Seeding complete!');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
