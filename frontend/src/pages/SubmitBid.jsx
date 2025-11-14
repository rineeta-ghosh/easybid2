import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageNav from '../components/PageNav'
import api from '../lib/api'
import FileUploader from '../components/FileUploader'
import AlertMessage from '../components/AlertMessage'

export default function SubmitBid() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tender, setTender] = useState(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let mounted = true
    ;(async function load() {
      setLoading(true)
      try {
        const res = await api.get('/tenders', { params: { search: '', page: 1 } })
        const found = (res.data.tenders || []).find(t => t._id === id)
        if (!mounted) return
        setTender(found || null)
      } catch (err) {
        console.error(err)
      } finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [id])

  async function submit() {
    if (!amount) return setErr('Amount required')
    setErr(null); setMsg(null)
    const fd = new FormData()
    fd.append('tenderId', id)
    fd.append('amount', amount)
    fd.append('description', description)
    if (file) fd.append('file', file)
    try {
      const res = await api.post('/bids', fd, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: (ev)=>{
        if (ev.total) setProgress(Math.round((ev.loaded/ev.total)*100))
      } })
      if (res.data?.success) { setMsg('Bid submitted'); setTimeout(()=>navigate('/dashboard/supplier'),1200) }
      else setErr(res.data?.message || 'Failed')
    } catch (err) { setErr(err?.response?.data?.message || err.message || 'Server error') }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 antialiased p-8">
        <PageNav title="Submit Bid" />
        <div className="mt-6 space-y-3">
          <div className="h-6 w-3/4 rounded bg-white/6 animate-pulse" />
          <div className="h-6 w-1/2 rounded bg-white/6 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <PageNav title="Submit Bid" />
        <div className="mt-6">
          {msg && <AlertMessage message={msg} />}
          {err && <AlertMessage type="error" message={err} />}
        </div>

        <div className="mt-6 p-6 rounded-2xl bg-white/6 border border-white/10">
          <div className="mb-4">
            <div className="font-semibold text-amber-100">Tender</div>
            <div className="text-amber-300">{tender ? tender.title : id}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-amber-200 mb-1">Bid Amount</label>
              <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full p-2 rounded bg-black/20 text-amber-100" />
            </div>
            <div>
              <label className="block text-sm text-amber-200 mb-1">Attach file</label>
              <FileUploader onChange={setFile} />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm text-amber-200 mb-1">Description</label>
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full p-2 rounded bg-black/20 text-amber-100 h-24" />
          </div>

          {progress > 0 && <div className="mt-3 bg-white/10 rounded overflow-hidden"><div style={{ width: `${progress}%` }} className="h-2 bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e]" /></div>}

          <div className="mt-4 flex gap-3">
            <button onClick={submit} className="px-4 py-2 rounded bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white">Submit Bid</button>
            <button onClick={()=>navigate(-1)} className="px-4 py-2 rounded bg-black/30 text-amber-200">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
