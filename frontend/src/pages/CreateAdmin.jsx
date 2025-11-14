import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function CreateAdmin() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await api.post('/dashboard/create-admin', form)
      setSuccess(res.data.message || 'Admin created')
      // navigate to admin dashboard after short delay so cookie is set
      setTimeout(() => navigate('/dashboard/admin'), 600)
    } catch (err) {
      console.error(err)
      const server = err?.response?.data
      setError(server?.message || err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Create Admin</h2>
        <p className="text-sm text-amber-700 mb-4">This will create the first Admin account for the local/dev instance. Only works if no Admin exists.</p>

        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}
        {success && <div className="mb-3 text-sm text-green-400">{success}</div>}

        <form onSubmit={submit}>
          <label className="block mb-3">
            <div className="text-sm text-amber-900 mb-1">Full name</div>
            <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border" placeholder="Admin name" />
          </label>

          <label className="block mb-3">
            <div className="text-sm text-amber-900 mb-1">Email</div>
            <input name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border" placeholder="admin@example.test" />
          </label>

          <label className="block mb-4">
            <div className="text-sm text-amber-900 mb-1">Password</div>
            <input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 rounded-lg border" placeholder="Choose a secure password" />
          </label>

          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-amber-500 text-white font-semibold">{loading ? 'Creating…' : 'Create Admin'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
