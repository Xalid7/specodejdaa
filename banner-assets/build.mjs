// Banner generator — RU + UZ, desktop + mobile. Run: node banner-assets/build.mjs
// Sources in banner-assets/. Outputs to public/banners/.
// Dimensions are 10% shorter than original: desktop 1420x540, mobile 1080x1296.
import sharp from 'sharp'

const OUT = 'public/banners'
const DW = 1420, DH = 540, MW = 1080, MH = 1296
const suf = (lang) => (lang === 'uz' ? '-uz' : '')
const tr = async (p) => { const b = await sharp(p).trim().png().toBuffer(); const m = await sharp(b).metadata(); return { b, m } }

const T = {
  all: { accent: '#D32F2F', head: '#D32F2F', corner: { ru: 'УНИФОРМА', uz: 'UNIFORMA' }, dMenH: 470, mMenW: 1040, dHeadSize: 48,
    h: { ru: ['ОДЕЖДА ДЛЯ', 'ВСЕХ ПРОФЕССИЙ'], uz: ['BARCHA KASB', 'EGALARI UCHUN'] },
    sub: { ru: 'Строители · медики · повара · охрана · сервис', uz: 'Quruvchilar · shifokorlar · oshpazlar · xizmat' } },
  spec: { accent: '#D32F2F', head: '#D32F2F', corner: { ru: '2026', uz: '2026' }, cornerBig: true, dMenH: 512, mMenW: 800,
    three: { ru: ['КОЛЛЕКЦИЯ', 'НОВИНОК', 'СПЕЦОДЕЖДЫ'], uz: ['YANGI', 'MAXSUS KIYIM', 'KOLLEKSIYASI'] } },
  med: { accent: '#00897B', head: '#00897B', corner: { ru: 'МЕДИЦИНА', uz: 'TIBBIYOT' }, dMenH: 504, mMenW: 820,
    h: { ru: ['МЕДИЦИНСКАЯ', 'ОДЕЖДА'], uz: ['TIBBIY', 'KIYIM'] },
    sub: { ru: 'Халаты · Хирургическая форма · Скрабы', uz: 'Xalatlar · Jarrohlik formasi · Skrablar' } },
  srv: { accent: '#6D4C41', head: '#5D4037', corner: { ru: 'СЕРВИС', uz: 'XIZMAT' }, dMenH: 504, mMenW: 820,
    h: { ru: ['УНИФОРМА', 'ДЛЯ ПЕРСОНАЛА'], uz: ['PERSONAL', 'UNIFORMASI'] },
    sub: { ru: 'Официанты · курьеры · бариста · хостес', uz: 'Ofitsiantlar · kuryerlar · barista · xostes' } },
}

// ----- cutout banner (models on transparent) -----
async function cutout(key, src, fileBase) {
  const C = T[key]
  for (const lang of ['ru', 'uz']) {
    const corner = C.corner[lang]
    const cSize = C.cornerBig ? 50 : 28
    // DESKTOP
    const dW = Math.round(src.m.width * C.dMenH / src.m.height)
    const dMen = await sharp(src.b).resize({ height: C.dMenH }).toBuffer()
    let txtD
    if (C.three) {
      const L = C.three[lang]
      txtD = `<text x="58" y="224" fill="${C.head}" font-family="Arial" font-weight="900" font-size="58">${L[0]}</text>
        <text x="58" y="292" fill="${C.head}" font-family="Arial" font-weight="900" font-size="58">${L[1]}</text>
        <text x="58" y="360" fill="${C.head}" font-family="Arial" font-weight="900" font-size="58">${L[2]}</text>`
    } else {
      const L = C.h[lang]
      const hs = C.dHeadSize || 56
      txtD = `<text x="58" y="248" fill="${C.head}" font-family="Arial" font-weight="900" font-size="${hs}">${L[0]}</text>
        <text x="58" y="${248 + hs + 12}" fill="${C.head}" font-family="Arial" font-weight="900" font-size="${hs}">${L[1]}</text>
        <text x="60" y="${248 + hs + 72}" fill="#444" font-family="Arial" font-weight="600" font-size="19">${C.sub[lang]}</text>`
    }
    const svgD = `<svg width="${DW}" height="${DH}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 330,0 0,214" fill="${C.accent}"/>
      <text x="40" y="${C.cornerBig ? 82 : 76}" fill="#fff" font-family="Arial" font-weight="900" font-size="${cSize}" letter-spacing="${C.cornerBig ? 4 : 1}">${corner}</text>
      ${txtD}</svg>`
    await sharp({ create: { width: DW, height: DH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: dMen, left: DW - dW - 55, top: DH - C.dMenH - 8 }, { input: Buffer.from(svgD), left: 0, top: 0 }])
      .png().toFile(`${OUT}/${fileBase}${suf(lang)}.png`)
    // MOBILE
    const mH = Math.round(src.m.height * C.mMenW / src.m.width)
    const mMen = await sharp(src.b).resize({ width: C.mMenW }).toBuffer()
    let txtM
    if (C.three) {
      const L = C.three[lang]
      txtM = `<text x="56" y="252" fill="${C.head}" font-family="Arial" font-weight="900" font-size="78">${L[0]}</text>
        <text x="56" y="344" fill="${C.head}" font-family="Arial" font-weight="900" font-size="78">${L[1]}</text>
        <text x="56" y="436" fill="${C.head}" font-family="Arial" font-weight="900" font-size="78">${L[2]}</text>`
    } else {
      const L = C.h[lang]
      txtM = `<text x="56" y="300" fill="${C.head}" font-family="Arial" font-weight="900" font-size="76">${L[0]}</text>
        <text x="56" y="392" fill="${C.head}" font-family="Arial" font-weight="900" font-size="76">${L[1]}</text>
        <text x="58" y="450" fill="#444" font-family="Arial" font-weight="600" font-size="26">${C.sub[lang]}</text>`
    }
    const svgM = `<svg width="${MW}" height="${MH}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 300,0 0,196" fill="${C.accent}"/>
      <text x="32" y="${C.cornerBig ? 74 : 72}" fill="#fff" font-family="Arial" font-weight="900" font-size="${C.cornerBig ? 46 : 30}" letter-spacing="${C.cornerBig ? 3 : 1}">${corner}</text>
      ${txtM}</svg>`
    await sharp({ create: { width: MW, height: MH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: mMen, left: Math.round((MW - C.mMenW) / 2), top: MH - mH - 14 }, { input: Buffer.from(svgM), left: 0, top: 0 }])
      .png().toFile(`${OUT}/${fileBase}-mobile${suf(lang)}.png`)
  }
}

// ----- construction (scene + gradient) -----
async function buildCon() {
  const c = { accent: '#F57C00', corner: { ru: 'СТРОЙКА', uz: 'QURILISH' },
    h1: { ru: 'СПЕЦОДЕЖДА', uz: 'ISH KIYIMI' }, h2: { ru: 'ДЛЯ СТРОИТЕЛЕЙ', uz: 'QURUVCHILAR UCHUN' },
    sub: { ru: 'Сигнальная · защитная · рабочая одежда', uz: 'Signal · himoya · ish kiyimi' } }
  for (const lang of ['ru', 'uz']) {
    const bgD = await sharp('banner-assets/con-wide.png').resize({ width: DW, height: DH, fit: 'cover', position: 'right' }).toBuffer()
    const svgD = `<svg width="${DW}" height="${DH}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(0,0,0,0.72)"/><stop offset="0.45" stop-color="rgba(0,0,0,0.32)"/><stop offset="0.72" stop-color="rgba(0,0,0,0)"/></linearGradient></defs>
      <rect width="${DW}" height="${DH}" fill="url(#lg)"/>
      <polygon points="0,0 330,0 0,214" fill="${c.accent}"/>
      <text x="40" y="76" fill="#fff" font-family="Arial" font-weight="900" font-size="28" letter-spacing="1">${c.corner[lang]}</text>
      <text x="58" y="250" fill="#fff" font-family="Arial" font-weight="900" font-size="54">${c.h1[lang]}</text>
      <text x="58" y="316" fill="#FF9800" font-family="Arial" font-weight="900" font-size="54">${c.h2[lang]}</text>
      <text x="60" y="370" fill="rgba(255,255,255,0.9)" font-family="Arial" font-weight="600" font-size="19">${c.sub[lang]}</text></svg>`
    await sharp(bgD).composite([{ input: Buffer.from(svgD), left: 0, top: 0 }]).jpeg({ quality: 88 }).toFile(`${OUT}/banner-con${suf(lang)}.jpg`)
    const bgM = await sharp('banner-assets/con-portrait.png').resize({ width: MW, height: MH, fit: 'cover', position: 'bottom' }).toBuffer()
    const svgM = `<svg width="${MW}" height="${MH}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(0,0,0,0.6)"/><stop offset="0.42" stop-color="rgba(0,0,0,0.18)"/><stop offset="0.62" stop-color="rgba(0,0,0,0)"/></linearGradient></defs>
      <rect width="${MW}" height="${MH}" fill="url(#lg)"/>
      <polygon points="0,0 300,0 0,196" fill="${c.accent}"/>
      <text x="32" y="72" fill="#fff" font-family="Arial" font-weight="900" font-size="30" letter-spacing="1">${c.corner[lang]}</text>
      <text x="56" y="300" fill="#fff" font-family="Arial" font-weight="900" font-size="76">${c.h1[lang]}</text>
      <text x="56" y="388" fill="#FF9800" font-family="Arial" font-weight="900" font-size="62">${c.h2[lang]}</text>
      <text x="58" y="448" fill="rgba(255,255,255,0.92)" font-family="Arial" font-weight="600" font-size="26">${c.sub[lang]}</text></svg>`
    await sharp(bgM).composite([{ input: Buffer.from(svgM), left: 0, top: 0 }]).jpeg({ quality: 88 }).toFile(`${OUT}/banner-con-mobile${suf(lang)}.jpg`)
  }
}

const all = await tr('banner-assets/all.png')
const spec = await tr('banner-assets/spec.png')
const med = await tr('banner-assets/med.png')
const srv = await tr('banner-assets/srv.png')
await cutout('all', all, 'banner-all')
await cutout('spec', spec, 'banner-spec-2026')
await cutout('med', med, 'banner-med')
await cutout('srv', srv, 'banner-srv')
await buildCon()
console.log('ALL banners built (RU+UZ, desktop+mobile, 10% shorter)')
