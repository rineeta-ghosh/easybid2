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
  const [existingBids, setExistingBids] = useState([])
  const [bidStats, setBidStats] = useState(null)
  const [amount, setAmount] = useState('')
  const [suggestedBid, setSuggestedBid] = useState(0)
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
        // Fetch tender details
        const res = await api.get('/tenders', { params: { search: '', page: 1 } })
        const found = (res.data.tenders || []).find(t => t._id === id)
        if (!mounted) return
        setTender(found || null)
        
        // Fetch existing bids for this tender
        try {
          const bidsRes = await api.get(`/bids/${id}`)
          if (mounted && bidsRes.data) {
            setExistingBids(bidsRes.data.bids || [])
            setBidStats(bidsRes.data.stats || null)
            
            // Calculate suggested bid (slightly lower than current lowest)
            if (bidsRes.data.stats?.lowestBid) {
              const suggested = Math.max(
                bidsRes.data.stats.lowestBid * 0.95, // 5% lower than lowest
                (found?.budget || 0) * 0.8 // or 80% of budget
              )
              setSuggestedBid(Math.round(suggested))
              setAmount(Math.round(suggested).toString())
            } else if (found?.budget) {
              // No bids yet, suggest 90% of budget
              const suggested = Math.round(found.budget * 0.9)
              setSuggestedBid(suggested)
              setAmount(suggested.toString())
            }
          }
        } catch (bidErr) {
          console.error('Error fetching bids:', bidErr)
        }
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
      if (res.data?.success) { 
        setMsg('Bid submitted successfully! Redirecting to dashboard...') 
        setTimeout(()=>navigate('/dashboard/supplier'),1500) 
      }
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
            {tender?.budget && (
              <div className="text-sm text-neutral-400 mt-1">Budget: ${tender.budget.toLocaleString()}</div>
            )}
          </div>

          {/* Bid Statistics */}
          {bidStats && bidStats.totalBids > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-black/20 border border-amber-500/20">
              <div className="text-sm font-semibold text-amber-200 mb-3">📊 Market Intelligence</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="text-xs text-neutral-400">Total Bids</div>
                  <div className="text-lg font-bold text-amber-300">{bidStats.totalBids}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Lowest Bid</div>
                  <div className="text-lg font-bold text-green-300">${bidStats.lowestBid?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Average Bid</div>
                  <div className="text-lg font-bold text-amber-300">${Math.round(bidStats.averageBid)?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Competitors</div>
                  <div className="text-lg font-bold text-amber-300">{bidStats.uniqueSuppliers}</div>
                </div>
              </div>
              {suggestedBid > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-neutral-400 mb-1">💡 Suggested Competitive Bid</div>
                  <div className="text-xl font-bold text-green-400">${suggestedBid.toLocaleString()}</div>
                  <button 
                    onClick={() => setAmount(suggestedBid.toString())}
                    className="mt-2 text-xs px-3 py-1 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30"
                  >
                    Use Suggested Amount
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-amber-200 mb-1">Bid Amount *</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e)=>setAmount(e.target.value)} 
                className="w-full p-2 rounded bg-black/20 text-amber-100 border border-white/10 focus:border-amber-500/50 outline-none"
                placeholder="Enter your bid amount"
                min="0"
              />
              {amount && tender?.budget && parseFloat(amount) > tender.budget && (
                <div className="text-xs text-red-400 mt-1">⚠️ Bid exceeds budget limit</div>
              )}
              {amount && bidStats?.lowestBid && parseFloat(amount) >= bidStats.lowestBid && (
                <div className="text-xs text-amber-400 mt-1">💡 Consider bidding lower to be competitive</div>
              )}
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

        {/* Current Bids Section */}
        {existingBids.length > 0 && (
          <div className="mt-6 p-6 rounded-2xl bg-white/6 border border-white/10">
            <h3 className="text-xl font-semibold text-amber-100 mb-4">
              🏆 Current Bids Leaderboard ({existingBids.length})
            </h3>
            <div className="space-y-3">
              {existingBids.map((bid, index) => (
                <div 
                  key={bid._id} 
                  className={`p-4 rounded-lg border ${
                    index === 0 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-black/20 border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {index === 0 && <span className="text-xl">🥇</span>}
                        {index === 1 && <span className="text-xl">🥈</span>}
                        {index === 2 && <span className="text-xl">🥉</span>}
                        <div className="text-amber-200 font-medium">
                          {bid.supplierName || 'Anonymous'}
                        </div>
                        {index === 0 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300">
                            Leading
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-neutral-400 mt-1">
                        Submitted: {new Date(bid.submittedAt).toLocaleString()}
                      </div>
                      {bid.comments && (
                        <div className="text-sm text-neutral-300 mt-2 p-2 rounded bg-black/20">
                          {bid.comments}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs text-neutral-400 mb-1">Rank #{bid.rank}</div>
                      <div className={`text-2xl font-bold ${
                        index === 0 ? 'text-green-300' : 'text-amber-300'
                      }`}>
                        ${bid.amount?.toLocaleString()}
                      </div>
                      <div className={`text-xs mt-1 px-2 py-1 rounded ${
                        bid.status === 'Accepted' ? 'bg-green-500/20 text-green-300' :
                        bid.status === 'Rejected' ? 'bg-red-500/20 text-red-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {bid.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
