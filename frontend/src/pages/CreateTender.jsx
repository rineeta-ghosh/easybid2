import React, { useState } from 'react'
import PageNav from '../components/PageNav'
import TenderForm from '../components/TenderForm'
import api from '../lib/api'
import AlertMessage from '../components/AlertMessage'

export default function CreateTender() {
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  // saving state available for UX improvements
  const [saving, setSaving] = useState(false)

  async function handleSave(payload) {
    setMessage(null)
    setError(null)
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', payload.title)
      fd.append('description', payload.description)
      fd.append('category', payload.category)
      if (payload.customCategory) fd.append('customCategory', payload.customCategory)
      if (payload.budget) fd.append('budget', payload.budget)
      fd.append('deadline', payload.deadline)
      if (payload.file) fd.append('file', payload.file)

      const res = await api.post('/tenders', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (res.data?.success) {
        setMessage('Tender submitted successfully! It will be published after admin approval.')
      } else {
        setError(res.data?.message || 'Failed to save tender')
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Server error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <PageNav title="Create Tender" />
        <div className="mt-6">
          {message && <AlertMessage type="info" message={message} />}
          {error && <AlertMessage type="error" message={error} />}
        </div>

        <div className="mt-6">
          <TenderForm onCancel={() => window.history.back()} onSave={handleSave} saving={saving} />
        </div>
      </div>
    </div>
  )
}
