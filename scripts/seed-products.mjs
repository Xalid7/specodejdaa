import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  // ── KEPKALAR ──────────────────────────────────────────────
  { nameRu: 'Кепка серая',        nameUz: 'Kulrang kepka',         slug: 'kepka-seraya',        catSlug: 'kepka', isNew: true,
    img: '12e177f6-cf42-4318-8bf1-6f5dc4a05b0e.png' },
  { nameRu: 'Кепка оранжевая',    nameUz: "To'q sariq kepka",      slug: 'kepka-oranzhevaya',   catSlug: 'kepka',
    img: '5dd775d2-0ac0-42ac-9fcb-68cc407952ee.png' },
  { nameRu: 'Кепка чёрная',       nameUz: 'Qora kepka',            slug: 'kepka-chyornaya',     catSlug: 'kepka',
    img: '7ee57444-5aa0-44d0-b9ce-24033c9fef60.png' },
  { nameRu: 'Кепка красная',      nameUz: 'Qizil kepka',           slug: 'kepka-krasnaya',      catSlug: 'kepka',
    img: 'b7037a94-0399-4a41-ae4e-721c58ebfc63.png' },

  // ── FUTBOLKALAR ───────────────────────────────────────────
  { nameRu: 'Футболка красная',              nameUz: 'Qizil futbolka',                  slug: 'futbolka-krasnaya',          catSlug: 'futbolka', isNew: true,
    img: '374db40c-fa00-462d-a9ff-e1836ea1f0be.png' },
  { nameRu: 'Футболка чёрная',              nameUz: 'Qora futbolka',                   slug: 'futbolka-chyornaya',         catSlug: 'futbolka',
    img: '41987a58-cf15-47c4-b262-4f813888ba5a.png' },
  { nameRu: 'Футболка серая',               nameUz: 'Kulrang futbolka',                slug: 'futbolka-seraya',            catSlug: 'futbolka',
    img: 'a4484402-d056-4416-b540-d1980db7cbbc.png' },
  { nameRu: 'Футболка фиолетовая',          nameUz: 'Binafsha futbolka',               slug: 'futbolka-fioletovaya',       catSlug: 'futbolka',
    img: '0f979ffd8474e5538340b849dd6b0afd_1b311f67-7bdd-4e52-bb1f-dd9917ca98e3_500.jpg' },
  { nameRu: 'Футболка белая',               nameUz: 'Oq futbolka',                     slug: 'futbolka-belaya',            catSlug: 'futbolka',
    img: 'f6026152-a396-4bf2-a01a-58d580f41346.png' },
  { nameRu: 'Комплект: футболка голубая + кепка', nameUz: "Ko'k futbolka va kepka to'plami", slug: 'futbolka-golubuya-kepka', catSlug: 'futbolka', isCollection: true,
    img: '5f2ac962e40145581b7199271afe1174_5acaa244-31ac-4ff9-8e03-75d2a2553663_500.jpg' },

  // ── POLO (xizmat ko'rsatuvchi) ────────────────────────────
  { nameRu: 'Поло чёрное',                           nameUz: 'Qora polo',                           slug: 'polo-chyornoe',              catSlug: 'specodejda-obsluzhivayushchiy',
    img: '1be9f179-6cb6-437f-af85-d6eff616dcea.png' },
  { nameRu: 'Поло серое',                            nameUz: 'Kulrang polo',                        slug: 'polo-seroe',                 catSlug: 'specodejda-obsluzhivayushchiy',
    img: '77c29121-e8c2-4991-84d5-7d9099596f9a.png' },
  { nameRu: 'Поло белое',                            nameUz: 'Oq polo',                             slug: 'polo-beloe',                 catSlug: 'specodejda-obsluzhivayushchiy',
    img: 'afb4f1ab-c7d9-4c8c-9400-06d3554f397e.png' },
  { nameRu: 'Поло чёрное с зелёным воротником',     nameUz: 'Yashil yoqali qora polo',             slug: 'polo-chyornoe-zelyonyy-1',   catSlug: 'specodejda-obsluzhivayushchiy', isNew: true,
    img: 'a43a5663-04b5-401b-994a-88b2d1421591.png' },
  { nameRu: 'Поло чёрное с зелёным воротником (2)', nameUz: 'Yashil yoqali qora polo (2)',         slug: 'polo-chyornoe-zelyonyy-2',   catSlug: 'specodejda-obsluzhivayushchiy',
    img: 'c5c582fa7a50b012a9723171971189a2_cbe5f588-2938-4520-af38-f98d70825bff_500.jpg' },
  { nameRu: 'Комплект: поло тёмно-синее + кепка',   nameUz: "To'q ko'k polo va kepka to'plami",   slug: 'polo-temno-sinee-kepka',     catSlug: 'specodejda-obsluzhivayushchiy', isCollection: true,
    img: 'c28732ce82987edfe1b9c0c10461f82a_ae0d2bdd-a95c-48dd-a4ec-2c0e7831758a_500.jpg' },
  { nameRu: 'Комплект: поло красное на молнии + кепка', nameUz: "Zamkli qizil polo va kepka to'plami", slug: 'polo-krasnoe-molniya-kepka', catSlug: 'specodejda-obsluzhivayushchiy', isCollection: true,
    img: 'a0035e7c10c966020fbec325bbbf9f17_63636c52-3c85-43c5-9839-28dcd3261878_500.jpg' },
  { nameRu: 'Форма: поло бежевое + брюки',           nameUz: 'Bej polo va shim formasi',           slug: 'forma-polo-bezhevoe-bryuki', catSlug: 'specodejda-obsluzhivayushchiy', isCollection: true,
    img: '0527c847e0b20cfb8c0f07d00ebc5eec_8d54ce6f-0aa5-40d6-8618-b05c3d8c8feb_500.jpg' },
  { nameRu: 'Туника голубая (женская форма) + кепка', nameUz: "Ko'k tunika (ayollar formasi) va kepka", slug: 'tunika-golubuya-kepka', catSlug: 'specodejda-obsluzhivayushchiy',
    img: '1bff25991572c4bb5f91d938fdbc7e50_d166f356-5549-4909-be79-ef950398e90f_500.jpg' },

  // ── FORMA 103 ─────────────────────────────────────────────
  { nameRu: 'Форма 103 летняя (бело-красная)',        nameUz: '103 yozgi forma (oq-qizil)',         slug: 'forma-103-letnyaya-belo-kr', catSlug: 'forma-103', isNew: true,
    img: '0ca98844ec57e7d155e85033c12c4cce_b87e9d35-3771-47fc-8f2b-9131b7c13883_500.jpg' },
  { nameRu: 'Форма 103 зимняя (красная)',             nameUz: '103 qishki forma (qizil)',           slug: 'forma-103-zimnyaya-kr',      catSlug: 'forma-103',
    img: '0f8d07eb33bb4ca1803dfb0da84603cb_78351551-cbae-4e59-a9a2-a374995b1258_500.jpg' },
  { nameRu: 'Форма 103 (тёмно-синяя + красная) №1',  nameUz: "103 forma (to'q ko'k + qizil) №1",  slug: 'forma-103-sinaya-kr-1',      catSlug: 'forma-103',
    img: '11370d4d069ef54f893f4ac374fb0e20_3c223fd0-9ade-4a28-b5d6-9d221717408f_500.jpg' },
  { nameRu: 'Форма 103 (тёмно-синяя + красная) №2',  nameUz: "103 forma (to'q ko'k + qizil) №2",  slug: 'forma-103-sinaya-kr-2',      catSlug: 'forma-103',
    img: 'd454a44f74889f1910a8a28ac85d28cf_3e4c10e7-91c1-4f78-8418-8d67ca8e44e6_500.jpg' },
  { nameRu: 'Форма 103 с длинным рукавом',            nameUz: '103 uzun yengli forma',              slug: 'forma-103-dlinniy-rukav',    catSlug: 'forma-103',
    img: 'd670634cc9ef43e3d7206310bad9c834_c78bc339-91ad-44a5-a5ff-2431781bea52_500.jpg' },
  { nameRu: 'Форма 103 сигнальная',                   nameUz: '103 signal forma',                   slug: 'forma-103-signalnaya',       catSlug: 'forma-103',
    img: 'eddb21d32634f6dfdece477b28cef0d4_4618bbee-7eff-4156-94be-a41dccb7d925_500.jpg' },

  // ── TIBBIY XALATLAR ───────────────────────────────────────
  { nameRu: 'Халат медицинский с брюками', nameUz: 'Tibbiy xalat va shim', slug: 'halat-med-bryuki', catSlug: 'halat-med-muzhskoy', isNew: true,
    img: 'acd490d829992d693a87a1cc2caa5295_53d908c0-bc21-4dea-a2bc-425f491b70c5_500.jpg' },
  { nameRu: 'Халат медицинский белый',     nameUz: 'Oq tibbiy xalat',      slug: 'halat-med-belyy',  catSlug: 'halat-med-muzhskoy',
    img: 'f5dc94dc4ad7287f7d69a24894f63612_a55a4e72-a9eb-40d4-8052-9b76cf4b6410_500.jpg' },

  // ── ISHCHI KIYIM ──────────────────────────────────────────
  { nameRu: 'Рабочий костюм бежевый', nameUz: 'Bej ishchi kiyim',      slug: 'rabochiy-kostyum-bej',  catSlug: 'letnyaya-specodejda', isNew: true,
    img: '9fde25abae601e98458bdf18756803ab_58ed1da6-8fdb-4769-8972-b8087019fa40_500.jpg' },
  { nameRu: 'Рабочий костюм серый',   nameUz: 'Kulrang ishchi kiyim',  slug: 'rabochiy-kostyum-seryy', catSlug: 'letnyaya-specodejda',
    img: 'd3e5ea908e1d46aa69fd332f5ca1c5c6_e2767a24-185b-4e87-8f26-a5ba7ed89f74_500.jpg' },
  { nameRu: 'Форма сигнальная EPA',   nameUz: 'EPA signal formasi',    slug: 'forma-signalnaya-epa',   catSlug: 'signalnaya-odezhda',
    img: '0a882cfc2c9e0d9437797e49aa5acd82_ee70b284-3113-486c-8e8a-f76ab110b915_500.jpg' },

  // ── HUDI / KURTKA / JILET ─────────────────────────────────
  { nameRu: 'Худи бирюзовое на молнии',              nameUz: 'Zangori hudi (zamkli)',               slug: 'hudi-biryuzovoe',           catSlug: 'hudi', isNew: true,
    img: '64d740d441766d7a3f8467bb828ae068_15c0a3e5-e3ed-463e-b482-48fb5a77bc89_500.jpg' },
  { nameRu: 'Куртка тёмно-синяя с красными полосами', nameUz: "Qizil chiziqli to'q ko'k kurtka",  slug: 'kurtka-sinaya-krasnaya',    catSlug: 'kurtka-promo',
    img: 'df143ed67a425a5af326cf900e4eb841_bfb3b735-77cb-4011-ae57-27eeffdfbf72_500.jpg' },
  { nameRu: 'Жилет красный с капюшоном',             nameUz: 'Qizil kapyushonli jilet',             slug: 'zhilet-krasnyy-kapyushon',  catSlug: 'jiletka',
    img: 'fa07b15e3e8270bab9dea8df9e582345_9bf5476b-a5e0-46bb-8594-4eef446ba60c_500.jpg' },
  { nameRu: 'Комплект: жилет красный + кепка',       nameUz: "Qizil jilet va kepka to'plami",       slug: 'zhilet-krasnyy-kepka',      catSlug: 'jiletka', isCollection: true,
    img: 'c5efd6754e57ebc094d0a88fd1af1ad8_57b5dcfc-d4d6-406d-9b6d-49b956a6df37_500.jpg' },
]

async function main() {
  // Barcha eski mahsulotlarni o'chirish
  const deleted = await prisma.product.deleteMany({})
  console.log(`  🗑️  ${deleted.count} ta eski mahsulot o'chirildi`)

  // Kategoriyalarni slug bo'yicha map
  const allCats = await prisma.category.findMany({ select: { id: true, slug: true } })
  const catBySlug = {}
  allCats.forEach(c => { catBySlug[c.slug] = c.id })

  let created = 0
  for (const p of products) {
    const categoryId = catBySlug[p.catSlug]
    if (!categoryId) { console.log(`  ⚠️  Kategoriya topilmadi: ${p.catSlug}`); continue }
    await prisma.product.create({
      data: {
        nameRu: p.nameRu, nameUz: p.nameUz,
        slug: p.slug,
        images: JSON.stringify([`/uploads/${p.img}`]),
        isNew: p.isNew || false,
        isCollection: p.isCollection || false,
        isHoliday: false,
        categoryId,
      },
    })
    console.log(`  ✓ ${p.nameRu}`)
    created++
  }

  console.log(`\n✅ ${created} ta yangi mahsulot yaratildi!`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
