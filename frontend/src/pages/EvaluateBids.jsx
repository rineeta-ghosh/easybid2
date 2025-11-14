import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import PageNav from '../components/PageNav'
import ConfirmModal from '../components/ConfirmModal'
import api from '../lib/api'
import AlertMessage from '../components/AlertMessage'

export default function EvaluateBids() {
  const { tenderId } = useParams()
  const [bids, setBids] = useState([])
  const [evaluations, setEvaluations] = useState({})
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [savingEval, setSavingEval] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const bRes = await api.get(`/bids/${tenderId}`)
        const eRes = await api.get(`/evaluations/${tenderId}`)
        if (!mounted) return
        const b = bRes.data.bids || []
        const evals = (eRes.data.evaluations || []).reduce((acc, x) => { acc[x.supplierId.toString()] = x; return acc }, {})
        setBids(b)
        setEvaluations(evals)
      } catch (err) { console.error(err); setErr('Failed to load bids') }
      finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [tenderId])

  function updateEvalLocally(supplierId, updates) {
    setEvaluations(prev => ({ ...prev, [supplierId]: { ...(prev[supplierId] || {}), ...updates } }))
  }

  async function saveEvaluation(supplierId) {
    setMsg(null); setErr(null)
    setSavingEval(supplierId)
    const e = evaluations[supplierId] || {}
    try {
      const res = await api.post('/evaluations', { tenderId, supplierId, score: e.score || 0, remarks: e.remarks || '' })
      if (res.data?.success) setMsg('Evaluation saved')
      else setErr('Failed to save')
    } catch (err) { console.error(err); setErr('Save failed') }
    finally { setSavingEval(null) }
  }

  async function confirmPublishResults() {
    setMsg(null); setErr(null)
    setShowPublishConfirm(false)
    try {
      const res = await api.post(`/evaluations/publish/${tenderId}`)
      if (res.data?.success) setMsg('Results published and tender marked Evaluated')
      else setErr('Publish failed')
    } catch (err) { console.error(err); setErr('Publish failed') }
  }

  // Sort bids by evaluation score (desc), fallback to amount
  const sorted = [...bids].sort((a,b) => {
    const sa = evaluations[a.supplier?._id || a.supplier]?._id ? Number(evaluations[a.supplier?._id]?.score || 0) : Number(evaluations[a.supplier]?.score || 0)
    const sb = evaluations[b.supplier?._id]?._id ? Number(evaluations[b.supplier?._id]?.score || 0) : Number(evaluations[b.supplier]?.score || 0)
    return sb - sa || (a.amount || 0) - (b.amount || 0)
  })

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <PageNav title="Evaluate Bids" />
        <div className="mt-6">
          {msg && <AlertMessage message={msg} />}
          {err && <AlertMessage type="error" message={err} />}
        </div>

        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-amber-200">Tender Evaluation</h2>
              <p className="text-sm text-neutral-400">ID: {tenderId}</p>
            </div>
            <div className="flex gap-3">
              <a 
                href={`${api.defaults.baseURL}/tenders/${tenderId}/pdf`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-amber-200 hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Tender PDF
              </a>
              <a 
                href={`${api.defaults.baseURL}/tenders/${tenderId}/bid-summary-pdf`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Bid Summary
              </a>
              <button 
                onClick={() => setShowPublishConfirm(true)} 
                className="px-4 py-2 rounded-lg bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white font-semibold hover:shadow-lg transition-all"
              >
                Publish Results
              </button>
            </div>
          </div>

          {loading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 rounded bg-white/6 animate-pulse" />)}</div> : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-amber-300 text-sm"><th>Supplier</th><th>Amount</th><th>Document</th><th>Score</th><th>Remarks</th><th></th></tr>
              </thead>
              <tbody>
                {sorted.map(b => {
                  const supId = b.supplier?._id || b.supplier
                  const ev = evaluations[supId] || {}
                  return (
                    <tr key={b._id} className="border-t border-white/6">
                      <td className="py-3 text-amber-100">{b.supplier?.name || b.supplier || 'Unknown'}</td>
                      <td className="py-3 text-amber-300">{b.amount}</td>
                      <td className="py-3 text-amber-300">{b.bidFile ? <a className="text-amber-100 underline" href={b.bidFile}>Download</a> : '—'}</td>
                      <td className="py-3">
                        <input type="number" value={ev.score ?? ''} onChange={(e) => updateEvalLocally(supId, { score: Number(e.target.value) })} className="w-20 p-1 rounded bg-black/20 text-amber-100" />
                      </td>
                      <td className="py-3">
                        <input value={ev.remarks || ''} onChange={(e) => updateEvalLocally(supId, { remarks: e.target.value })} className="w-full p-1 rounded bg-black/20 text-amber-100" />
                      </td>
                      <td className="py-3">
                        <button 
                          onClick={() => saveEvaluation(supId)} 
                          disabled={savingEval === supId}
                          className="px-3 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
                        >
                          {savingEval === supId ? 'Saving...' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </Motion.div>

        <ConfirmModal
          isOpen={showPublishConfirm}
          title="Publish Evaluation Results"
          message="Are you sure you want to publish the evaluation results? This will mark the tender as evaluated and notify all suppliers."
          confirmText="Publish Results"
          cancelText="Cancel"
          type="success"
          onConfirm={confirmPublishResults}
          onCancel={() => setShowPublishConfirm(false)}
        />
      </div>
    </div>
  )
}
