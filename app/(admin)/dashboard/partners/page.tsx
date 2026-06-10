'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ logoUrl: '', name: '', website: '' })
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchPartners() }, [])

  const fetchPartners = () => {
    fetch('/api/partners').then(r => r.json()).then(setPartners).catch(() => {})
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setForm(f => ({ ...f, logoUrl: data.url }))
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.logoUrl) { toast.error('Logo yuklang'); return }
    const res = await fetch('/api/partners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('Qo\'shildi'); setModal(false); setForm({ logoUrl: '', name: '', website: '' }); fetchPartners() }
    else toast.error('Xatolik')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('O\'chirishga ishonchingiz komilmi?')) return
    const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('O\'chirildi'); fetchPartners() }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hamkorlar</h1>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
          <Plus size={16} /> Qo'shish
        </button>
      </div>

      {partners.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
          <div className="text-4xl mb-2">🤝</div>
          <p>Hamkorlar yo'q</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {partners.map((p: any) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center gap-2 relative">
              <button onClick={() => handleDelete(p.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              <img src={p.logoUrl} alt={p.name || ''} className="h-12 object-contain" />
              {p.name && <p className="text-xs text-gray-600 text-center">{p.name}</p>}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Yangi hamkor</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Logo *</label>
                <label className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-red-400 transition-colors">
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{uploading ? 'Yuklanmoqda...' : 'Logo yuklash'}</span>
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                </label>
                {form.logoUrl && <img src={form.logoUrl} alt="" className="h-12 object-contain mt-2 mx-auto" />}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Kompaniya nomi</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Veb-sayt</label>
                <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://example.com" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-red-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50">Bekor</button>
                <button type="submit" className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-red-700">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
