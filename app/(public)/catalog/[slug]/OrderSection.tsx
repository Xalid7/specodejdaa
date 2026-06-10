'use client'

interface Props {
  telegram: string | null
  phone: string | null
  email: string | null
  productName: string
}

export default function OrderSection({ telegram, phone, email, productName }: Props) {
  return (
    <>
      <style>{`
        .order-tg:hover { background: #006699 !important; }
        .order-phone:hover { background: #B71C1C !important; }
        .order-email:hover { border-color: #D32F2F !important; color: #D32F2F !important; }
      `}</style>
      <div style={{ background: '#FAFAFA', border: '1.5px solid #F0F0F0', borderRadius: 16, padding: '20px' }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 4 }}>Buyurtma berish</p>
        <p style={{ fontSize: 13, color: '#aaa', marginBottom: 16 }}>Biz bilan bog'laning — narx va miqdor bo'yicha maslahatlashamiz</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {telegram && (
            <a href={telegram} target="_blank" rel="noreferrer" className="order-tg"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#0088cc', color: '#fff', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', transition: 'background .2s' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.03 9.57c-.15.666-.544.83-1.103.517l-3.053-2.248-1.47 1.417c-.163.163-.3.3-.614.3l.219-3.106 5.656-5.108c.245-.219-.054-.34-.381-.121L7.27 14.748l-2.978-.929c-.648-.2-.66-.648.135-.959l11.627-4.484c.54-.196 1.013.131.508.872z"/></svg>
              Telegram orqali buyurtma
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="order-phone"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#D32F2F', color: '#fff', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', transition: 'background .2s' }}
            >
              📞 {phone}
            </a>
          )}
          {email && (
            <a href={`mailto:${email}?subject=Buyurtma: ${productName}`} className="order-email"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: '#555', padding: '13px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1.5px solid #E0E0E0', transition: 'all .2s' }}
            >
              ✉ {email}
            </a>
          )}
        </div>
      </div>
    </>
  )
}
