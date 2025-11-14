import React, { useState, useEffect } from 'react'
import { motion as Motion } from 'framer-motion'
import PageNav from '../components/PageNav'
import AlertMessage from '../components/AlertMessage'
import api from '../lib/api'

export default function AdminApproval() {
  const [pendingTenders, setPendingTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [selectedTender, setSelectedTender] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  useEffect(() => {
    loadPendingTenders()
  }, [])

  async function loadPendingTenders() {
    try {
      setLoading(true)
      const res = await api.get('/tenders/pending')
      setPendingTenders(res.data.tenders || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load pending tenders')
    } finally {
      setLoading(false)
    }
  }

  async function approveTender(tenderId) {
    try {
      setMessage(null)
      setError(null)
      await api.put(`/tenders/${tenderId}/approve`)
      setMessage('Tender approved successfully')
      loadPendingTenders() // Refresh list
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to approve tender')
    }
  }

  async function rejectTender() {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason')
      return
    }
    
    try {
      setMessage(null)
      setError(null)
      await api.put(`/tenders/${selectedTender}/reject`, { reason: rejectionReason })
      setMessage('Tender rejected')
      setShowRejectModal(false)
      setRejectionReason('')
      setSelectedTender(null)
      loadPendingTenders() // Refresh list
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reject tender')
    }
  }

  function openRejectModal(tenderId) {
    setSelectedTender(tenderId)
    setShowRejectModal(true)
  }

  if (loading) {
    return (
      <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100">
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <PageNav title="Tender Approvals" />
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <PageNav title="Tender Approvals" />
        
        <div className="mt-6">
          {message && <AlertMessage type="info" message={message} />}
          {error && <AlertMessage type="error" message={error} />}
        </div>

        <div className="mt-8">
          {pendingTenders.length === 0 ? (
            <Motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-amber-200 mb-2">All Caught Up!</h3>
              <p className="text-neutral-400">No pending tenders require approval at this time.</p>
            </Motion.div>
          ) : (
            <div className="space-y-6">
              {pendingTenders.map((tender, index) => (
                <Motion.div
                  key={tender._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-amber-200">{tender.title}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          {tender.category === 'Other' && tender.customCategory ? tender.customCategory : tender.category}
                        </span>
                      </div>
                      
                      <p className="text-neutral-300 mb-3 line-clamp-2">{tender.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-neutral-500">Submitted by:</span>
                          <p className="text-amber-200 font-medium">{tender.createdBy?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Budget:</span>
                          <p className="text-amber-200 font-medium">
                            {tender.budget ? `$${tender.budget.toLocaleString()}` : 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Deadline:</span>
                          <p className="text-amber-200 font-medium">
                            {new Date(tender.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-48">
                      <Motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={`${api.defaults.baseURL}/tenders/${tender._id}/pdf`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                      </Motion.a>
                      
                      <Motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => approveTender(tender._id)}
                        className="px-4 py-2 rounded-lg bg-linear-to-r from-green-600 to-green-700 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </Motion.button>
                      
                      <Motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openRejectModal(tender._id)}
                        className="px-4 py-2 rounded-lg bg-linear-to-r from-red-600 to-red-700 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </Motion.button>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-amber-200 mb-4">Reject Tender</h3>
            <p className="text-neutral-300 mb-4">Please provide a reason for rejection:</p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/20 text-amber-100 border border-white/10 focus:border-orange-400 focus:outline-none h-24 resize-none"
              placeholder="Enter rejection reason..."
            />

            <div className="flex gap-3 mt-6">
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={rejectTender}
                className="flex-1 px-4 py-2 rounded-lg bg-linear-to-r from-red-600 to-red-700 text-white font-semibold"
              >
                Confirm Rejection
              </Motion.button>
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                  setSelectedTender(null)
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-amber-200"
              >
                Cancel
              </Motion.button>
            </div>
          </Motion.div>
        </div>
      )}
    </div>
  )
}