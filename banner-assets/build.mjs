// Banner generator — RU + UZ, desktop + mobile. Run: node banner-assets/build.mjs
// Sources live in banner-assets/. Outputs go to public/banners/.
import sharp from 'sharp'

const OUT = 'public/banners'
const suf = (lang) => (lang === 'uz' ? '-uz' : '')

const T = {
  classic: {
    ru: { pill: 'ПРОИЗВОДСТВО В УЗБЕКИСТАНЕ', h1: 'Спецодежда', h2: 'и Униформа', s1: 'Производим спецодежду, медицинскую одежду,', s2: 'промотекстиль и брендированную продукцию на заказ' },
    uz: { pill: "O'ZBEKISTONDA ISHLAB CHIQARILADI", h1: 'Maxsus kiyim', h2: 'va Uniforma', s1: 'Maxsus kiyim, tibbiy kiyim, promo-mahsulotlarni', s2: 'buyurtma asosida sifatli tikamiz' },
  },
  spec: { ru: ['КОЛЛЕКЦИЯ', 'НОВИНОК', 'СПЕЦОДЕЖДЫ'], uz: ['YANGI', 'MAXSUS KIYIM', 'KOLLEKSIYASI'] },
  med: { accent: '#00897B', head: '#00897B',
    ru: { corner: 'МЕДИЦИНА', h: ['МЕДИЦИНСКАЯ', 'ОДЕЖДА'], sub: 'Халаты · Хирургическая форма · Скрабы' },
    uz: { corner: 'TIBBIYOT', h: ['TIBBIY', 'KIYIM'], sub: 'Xalatlar · Jarrohlik formasi · Skrablar' } },
  srv: { accent: '#6D4C41', head: '#5D4037',
    ru: { corner: 'СЕРВИС', h: ['УНИФОРМА', 'ДЛЯ ПЕРСОНАЛА'], sub: 'Официанты · курьеры · бариста · хостес' },
    uz: { corner: 'XIZMAT', h: ['PERSONAL', 'UNIFORMASI'], sub: 'Ofitsiantlar · kuryerlar · barista · xostes' } },
  con: { accent: '#F57C00',
    ru: { corner: 'СТРОЙКА', h1: 'СПЕЦОДЕЖДА', h2: 'ДЛЯ СТРОИТЕЛЕЙ', sub: 'Сигнальная · защитная · рабочая одежда' },
    uz: { corner: 'QURILISH', h1: 'ISH KIYIMI', h2: 'QURUVCHILAR UCHUN', sub: 'Signal · himoya · ish kiyimi' } },
}

async function trimAlpha(p) { const b = await sharp(p).trim().png().toBuffer(); const m = await sharp(b).metadata(); return { b, m } }

// ---------- SPEC (cutout, 3-line heading, corner 2026) ----------
async function buildSpec(src) {
  for (const lang of ['ru', 'uz']) {
    const L = T.spec[lang]
    // desktop
    const DW = 1420, DH = 600, dH = 582, dW = Math.round(src.m.width * dH / src.m.height)
    const dMen = await sharp(src.b).resize({ height: dH }).toBuffer()
    const svgD = `<svg width="${DW}" height="${DH}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 340,0 0,236" fill="#D32F2F"/>
      <text x="42" y="88" fill="#fff" font-family="Arial" font-weight="900" font-size="54" letter-spacing="4">2026</text>
      <text x="58" y="296" fill="#D32F2F" font-family="Arial" font-weight="900" font-size="64">${L[0]}</text>
      <text x="58" y="370" fill="#D32F2F" font-family="Arial" font-weight="900" font-size="64">${L[1]}</text>
      <text x="58" y="444" fill="#D32F2F" font-family="Arial" font-weight="900" font-size="64">${L[2]}</text></svg>`
    await sharp({ create: { width: DW, height: DH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: dMen, left: DW - dW - 60, top: DH - dH - 9 }, { input: Buffer.from(svgD), left: 0, top: 0 }])
      .png().toFile(`${OUT}/banner-spec-2026${suf(lang)}.png`)
    // mobile
    const MW = 1080, MH = 1440, mW = 800, mH = Math.round(src.m.height * mW / src.m.width)
    const mMen = await sharp(src.b).resize({ width: mW }).toBuffer()
    const svgM = `<svg width="${MW}" height="${MH}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 320,0 0,210" fill="#D32F2F"/>
      <text x="34" y="80" fill="#fff" font-family="Arial" font-weight="900" font-size="48" letter-spacing="3">2026</text>
      <text x="56" y="340" fill="#D32F2F" font-family="Arial" font-weight="900" font-size="84">${L[0]}</text>
      <text x="56" y="438" fill="#D32F2F" font-family="Arial" font-weight="900" font-size="84">${L[1]}</text>
      <text x="56" y="536" fill="#D32F2F" font-family="Arial" font-weight="900" font-size="84">${L[2]}</text></svg>`
    await sharp({ create: { width: MW, height: MH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: mMen, left: Math.round((MW - mW) / 2), top: MH - mH - 14 }, { input: Buffer.from(svgM), left: 0, top: 0 }])
      .png().toFile(`${OUT}/banner-spec-2026-mobile${suf(lang)}.png`)
  }
}

// ---------- MED / SRV (cutout, corner label + 2-line heading + subtitle) ----------
async function buildCutout(key, src, fileBase) {
  const C = T[key]
  for (const lang of ['ru', 'uz']) {
    const L = C[lang]
    const DW = 1420, DH = 600, dH = 560, dW = Math.round(src.m.width * dH / src.m.height)
    const dMen = await sharp(src.b).resize({ height: dH }).toBuffer()
    const svgD = `<svg width="${DW}" height="${DH}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 360,0 0,236" fill="${C.accent}"/>
      <text x="40" y="84" fill="#fff" font-family="Arial" font-weight="900" font-size="28" letter-spacing="1">${L.corner}</text>
      <text x="58" y="300" fill="${C.head}" font-family="Arial" font-weight="900" font-size="62">${L.h[0]}</text>
      <text x="58" y="372" fill="${C.head}" font-family="Arial" font-weight="900" font-size="62">${L.h[1]}</text>
      <text x="60" y="430" fill="#444" font-family="Arial" font-weight="600" font-size="21">${L.sub}</text></svg>`
    await sharp({ create: { width: DW, height: DH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: dMen, left: DW - dW - 60, top: DH - dH - 9 }, { input: Buffer.from(svgD), left: 0, top: 0 }])
      .png().toFile(`${OUT}/${fileBase}${suf(lang)}.png`)
    const MW = 1080, MH = 1440, mW = 820, mH = Math.round(src.m.height * mW / src.m.width)
    const mMen = await sharp(src.b).resize({ width: mW }).toBuffer()
    const svgM = `<svg width="${MW}" height="${MH}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 320,0 0,210" fill="${C.accent}"/>
      <text x="32" y="76" fill="#fff" font-family="Arial" font-weight="900" font-size="30" letter-spacing="1">${L.corner}</text>
      <text x="56" y="360" fill="${C.head}" font-family="Arial" font-weight="900" font-size="80">${L.h[0]}</text>
      <text x="56" y="456" fill="${C.head}" font-family="Arial" font-weight="900" font-size="80">${L.h[1]}</text>
      <text x="58" y="524" fill="#444" font-family="Arial" font-weight="600" font-size="28">${L.sub}</text></svg>`
    await sharp({ create: { width: MW, height: MH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: mMen, left: Math.round((MW - mW) / 2), top: MH - mH - 14 }, { input: Buffer.from(svgM), left: 0, top: 0 }])
      .png().toFile(`${OUT}/${fileBase}-mobile${suf(lang)}.png`)
  }
}

// ---------- CONSTRUCTION (scene + gradient + text) ----------
async function buildCon() {
  const C = T.con
  for (const lang of ['ru', 'uz']) {
    const L = C[lang]
    const DW = 1420, DH = 600
    const bgD = await sharp('banner-assets/con-wide.png').resize({ width: DW, height: DH, fit: 'cover', position: 'right' }).toBuffer()
    const svgD = `<svg width="${DW}" height="${DH}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="rgba(0,0,0,0.72)"/><stop offset="0.45" stop-color="rgba(0,0,0,0.32)"/><stop offset="0.72" stop-color="rgba(0,0,0,0)"/></linearGradient></defs>
      <rect width="${DW}" height="${DH}" fill="url(#lg)"/>
      <polygon points="0,0 360,0 0,236" fill="${C.accent}"/>
      <text x="40" y="80" fill="#fff" font-family="Arial" font-weight="900" font-size="28" letter-spacing="1">${L.corner}</text>
      <text x="58" y="298" fill="#ffffff" font-family="Arial" font-weight="900" font-size="58">${L.h1}</text>
      <text x="58" y="368" fill="#FF9800" font-family="Arial" font-weight="900" font-size="58">${L.h2}</text>
      <text x="60" y="426" fill="rgba(255,255,255,0.9)" font-family="Arial" font-weight="600" font-size="21">${L.sub}</text></svg>`
    await sharp(bgD).composite([{ input: Buffer.from(svgD), left: 0, top: 0 }]).jpeg({ quality: 88 }).toFile(`${OUT}/banner-con${suf(lang)}.jpg`)
    const MW = 1080, MH = 1440
    const bgM = await sharp('banner-assets/con-portrait.png').resize({ width: MW, height: MH, fit: 'cover', position: 'bottom' }).toBuffer()
    const svgM = `<svg width="${MW}" height="${MH}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(0,0,0,0.6)"/><stop offset="0.42" stop-color="rgba(0,0,0,0.18)"/><stop offset="0.62" stop-color="rgba(0,0,0,0)"/></linearGradient></defs>
      <rect width="${MW}" height="${MH}" fill="url(#lg)"/>
      <polygon points="0,0 320,0 0,210" fill="${C.accent}"/>
      <text x="32" y="74" fill="#fff" font-family="Arial" font-weight="900" font-size="30" letter-spacing="1">${L.corner}</text>
      <text x="56" y="320" fill="#ffffff" font-family="Arial" font-weight="900" font-size="78">${L.h1}</text>
      <text x="56" y="412" fill="#FF9800" font-family="Arial" font-weight="900" font-size="64">${L.h2}</text>
      <text x="58" y="478" fill="rgba(255,255,255,0.92)" font-family="Arial" font-weight="600" font-size="28">${L.sub}</text></svg>`
    await sharp(bgM).composite([{ input: Buffer.from(svgM), left: 0, top: 0 }]).jpeg({ quality: 88 }).toFile(`${OUT}/banner-con-mobile${suf(lang)}.jpg`)
  }
}

// ---------- CLASSIC (red gradient + text) ----------
async function buildClassic() {
  const grad = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#C62828"/><stop offset="0.4" stop-color="#8B0000"/>
    <stop offset="0.7" stop-color="#D32F2F"/><stop offset="1" stop-color="#7B0000"/></linearGradient></defs>`
  for (const lang of ['ru', 'uz']) {
    const L = T.classic[lang]
    const pw = lang === 'uz' ? 432 : 372
    const deskSVG = `<svg width="1420" height="600" xmlns="http://www.w3.org/2000/svg">${grad}
      <rect width="1420" height="600" fill="url(#g)"/>
      <circle cx="1230" cy="110" r="190" fill="rgba(255,255,255,0.05)"/><circle cx="1080" cy="540" r="130" fill="rgba(255,255,255,0.04)"/><circle cx="1320" cy="430" r="7" fill="rgba(255,255,255,0.3)"/>
      <rect x="80" y="150" width="${pw}" height="40" rx="20" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)"/>
      <circle cx="106" cy="170" r="5" fill="#FF8A80"/>
      <text x="124" y="176" fill="rgba(255,255,255,0.92)" font-family="Arial" font-weight="700" font-size="14" letter-spacing="2">${L.pill}</text>
      <text x="78" y="296" fill="#ffffff" font-family="Arial" font-weight="900" font-size="62" letter-spacing="-1">${L.h1}</text>
      <text x="78" y="364" fill="rgba(255,255,255,0.72)" font-family="Arial" font-weight="900" font-size="62" letter-spacing="-1">${L.h2}</text>
      <text x="80" y="424" fill="rgba(255,255,255,0.82)" font-family="Arial" font-size="18">${L.s1}</text>
      <text x="80" y="452" fill="rgba(255,255,255,0.82)" font-family="Arial" font-size="18">${L.s2}</text></svg>`
    await sharp(Buffer.from(deskSVG)).jpeg({ quality: 90 }).toFile(`${OUT}/banner-hero-classic${suf(lang)}.jpg`)
    const pwm = lang === 'uz' ? 560 : 500
    const mobSVG = `<svg width="1080" height="1440" xmlns="http://www.w3.org/2000/svg">${grad}
      <rect width="1080" height="1440" fill="url(#g)"/>
      <circle cx="900" cy="220" r="250" fill="rgba(255,255,255,0.05)"/><circle cx="200" cy="1220" r="210" fill="rgba(255,255,255,0.04)"/>
      <rect x="70" y="500" width="${pwm}" height="54" rx="27" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)"/>
      <circle cx="104" cy="527" r="7" fill="#FF8A80"/>
      <text x="128" y="535" fill="rgba(255,255,255,0.92)" font-family="Arial" font-weight="700" font-size="19" letter-spacing="2">${L.pill}</text>
      <text x="68" y="700" fill="#ffffff" font-family="Arial" font-weight="900" font-size="84" letter-spacing="-1.5">${L.h1}</text>
      <text x="68" y="798" fill="rgba(255,255,255,0.72)" font-family="Arial" font-weight="900" font-size="84" letter-spacing="-1.5">${L.h2}</text>
      <text x="70" y="880" fill="rgba(255,255,255,0.82)" font-family="Arial" font-size="26">${L.s1}</text>
      <text x="70" y="920" fill="rgba(255,255,255,0.82)" font-family="Arial" font-size="26">${L.s2}</text></svg>`
    await sharp(Buffer.from(mobSVG)).jpeg({ quality: 90 }).toFile(`${OUT}/banner-hero-classic-mobile${suf(lang)}.jpg`)
  }
}

const spec = await trimAlpha('banner-assets/spec.png')
const med = await trimAlpha('banner-assets/med.png')
const srv = await trimAlpha('banner-assets/srv.png')
await buildClassic()
await buildSpec(spec)
await buildCutout('med', med, 'banner-med')
await buildCutout('srv', srv, 'banner-srv')
await buildCon()
console.log('ALL banners built (RU + UZ, desktop + mobile)')
