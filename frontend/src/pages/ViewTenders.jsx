import React, { useEffect, useState } from 'react'
import PageNav from '../components/PageNav'
import api from '../lib/api'
import { motion } from 'framer-motion'
const Motion = motion

export default function ViewTenders() {
  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let mounted = true
    ;(async function fetchList() {
      setLoading(true)
      try {
        const res = await api.get('/tenders', { params: { search, category, page, approvalStatus: 'Approved' } })
        if (!mounted) return
        setTenders(res.data.tenders || [])
        setTotal(res.data.total || 0)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [page, search, category])

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageNav title="View Tenders" />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search tenders" className="w-full p-3 rounded bg-black/20 text-amber-100" />
          </div>
          <div>
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full p-3 rounded bg-black/20 text-amber-100">
              <option value="">All categories</option>
              <option>IT</option>
              <option>Construction</option>
              <option>Services</option>
              <option>Goods</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_,i) => <div key={i} className="h-20 rounded bg-white/4 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tenders.length === 0 ? (
                <div className="p-6 rounded bg-white/6 text-amber-200">No tenders found</div>
              ) : tenders.map(t => (
                <motion.div whileHover={{ y: -4 }} key={t._id} className="p-4 rounded-2xl bg-white/6 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-amber-100">{t.title}</div>
                      <div className="text-sm text-amber-300">{t.category} • {t.createdBy?.name}</div>
                      <div className="text-sm text-amber-300">Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : '—'}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a href={`/supplier/submit-bid/${t._id}`} className="px-3 py-2 rounded bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white text-center">View Details</a>
                      <a 
                        href={`${api.defaults.baseURL}/tenders/${t._id}/pdf`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded bg-white/10 border border-white/10 text-amber-200 hover:bg-white/20 transition-colors text-center flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        PDF
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-amber-300">Total: {total}</div>
          <div className="flex gap-2">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-2 rounded bg-white/8">Prev</button>
            <div className="px-3 py-2 rounded bg-white/8">{page}</div>
            <button onClick={()=>setPage(p=>p+1)} className="px-3 py-2 rounded bg-white/8">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
