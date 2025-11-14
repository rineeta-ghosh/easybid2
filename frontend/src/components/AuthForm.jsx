import React, { useState } from 'react'
import InputField from './InputField'
import RoleSelector from './RoleSelector'
import AlertMessage from './AlertMessage'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function AuthForm({ mode = 'login', noWrapper = false }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Buyer', remember: false })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }) }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await api.post('/auth/login', { email: form.email, password: form.password })
        setSuccess(res.data.message)
        // Success: redirect to dashboard
        navigate('/dashboard')
      } else {
        // client-side quick checks to give faster feedback
        if (form.password !== form.confirm) throw new Error('Passwords do not match')
        if ((form.password || '').length < 6) throw new Error('Password must be at least 6 characters')
        const res = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password, role: form.role })
        setSuccess(res.data.message)
        navigate('/dashboard')
      }
    } catch (err) {
      console.error(err)
      // Prefer server-side validation errors where present
      const server = err?.response?.data
      let msg = err?.message || 'Request failed'
      if (server) {
        if (server.message) msg = server.message
        else if (Array.isArray(server.errors)) {
          // express-validator errors: join param + msg
          msg = server.errors.map(e => (e.param ? `${e.param}: ${e.msg}` : e.msg)).join('; ')
        }
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const formContents = (
    <form onSubmit={submit}>
      <h3 className="text-2xl font-bold mb-4 text-amber-900 text-center">{mode === 'login' ? 'Sign In' : 'Create account'}</h3>
      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

      {mode === 'register' && (
        <InputField label="Name" id="name" value={form.name} onChange={(e) => onChange(e)} name="name" placeholder="Your full name" />
      )}

      <div className="mt-4">
        <InputField label="Email" id="email" value={form.email} onChange={(e) => onChange(e)} name="email" placeholder="you@company.com" />
      </div>

      <div className="mt-4">
        <InputField label="Password" id="password" type="password" value={form.password} onChange={(e) => onChange(e)} name="password" placeholder="••••••" />
      </div>

      {mode === 'register' && (
        <div className="mt-4">
          <InputField label="Confirm Password" id="confirm" type="password" value={form.confirm} onChange={(e) => onChange(e)} name="confirm" placeholder="••••••" />
        </div>
      )}

      {mode === 'register' && (
        <div className="mt-4">
          <RoleSelector value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <label className="flex items-center gap-2 text-amber-900">
          <input type="checkbox" name="remember" checked={form.remember} onChange={onChange} className="w-4 h-4" /> Remember me
        </label>
        <a className="text-sm text-amber-600 hover:underline" href="#">Forgot password?</a>
      </div>

      <div className="mt-6">
        <button type="submit" disabled={loading} className="w-full px-4 py-2 rounded-lg bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white font-bold">{mode === 'login' ? 'Login' : 'Create account'}</button>
      </div>
    </form>
  )

  if (noWrapper) return formContents

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 shadow-xl">
      {formContents}
    </div>
  )
}
