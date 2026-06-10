import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const services = [
  { nameRu: 'Шелкография',          nameUz: 'Shyolkografiya',       slug: 'shelkografiya' },
  { nameRu: 'Компьютерная вышивка', nameUz: 'Kompyuter kashtasi',   slug: 'kompyuternaya-vyshivka' },
  { nameRu: 'УФ-печать',            nameUz: 'UF-bosma',             slug: 'uf-pechat' },
  { nameRu: 'УФ-DTF печать',        nameUz: 'UF-DTF bosma',         slug: 'uf-dtf-pechat' },
  { nameRu: 'Тампопечать',          nameUz: 'Tampobosma',           slug: 'tampopechat' },
  { nameRu: 'Тиснение',             nameUz: 'Tisnenie',             slug: 'tisnenie' },
  { nameRu: 'Лазерная гравировка',  nameUz: 'Lazer gravirovka',     slug: 'lazernaya-gravirovka' },
  { nameRu: 'Сублимация',           nameUz: 'Sublimatsiya',         slug: 'sublimatsiya' },
]

async function main() {
  console.log('Xizmatlar qo\'shilmoqda...')
  for (let i = 0; i < services.length; i++) {
    const s = services[i]
    await prisma.navService.upsert({
      where: { slug: s.slug },
      update: { nameRu: s.nameRu, nameUz: s.nameUz, order: i },
      create: { ...s, order: i },
    })
    console.log(`  ✓ ${s.nameRu}`)
  }
  console.log(`\n✅ ${services.length} ta xizmat muvaffaqiyatli qo'shildi!`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
