'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.ok) router.push('/dashboard')
    else { setError('Email yoki parol noto\'g\'ri'); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A1A 0%, #2D1515 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: '#D32F2F', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(211,47,47,0.4)' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 13, textAlign: 'center', lineHeight: 1.3 }}>Art<br/>Print</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>Admin Panel</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Kirish uchun ma'lumotlarni kiriting</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Email manzil</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@artprint.uz"
                required
                style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: 10, padding: '12px 14px', fontSize: 14, outline: 'none', transition: 'border-color .2s', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#D32F2F')}
                onBlur={e => (e.target.style.borderColor = '#E0E0E0')}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Parol</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: 10, padding: '12px 14px', fontSize: 14, outline: 'none', transition: 'border-color .2s', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#D32F2F')}
                onBlur={e => (e.target.style.borderColor = '#E0E0E0')}
              />
            </div>

            {error && (
              <div style={{ background: '#FFF5F5', border: '1px solid #FFCDD2', borderRadius: 10, padding: '12px 14px', color: '#C62828', fontSize: 13, fontWeight: 500 }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ background: loading ? '#ccc' : '#D32F2F', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background .2s', marginTop: 4, boxShadow: '0 4px 16px rgba(211,47,47,0.3)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#B71C1C' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#D32F2F' }}
            >
              {loading ? 'Kirish...' : 'Kirish →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
