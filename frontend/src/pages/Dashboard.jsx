import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { getProfileMock } from '../lib/mockData'
import { motion } from 'framer-motion'
const Motion = motion
import PageNav from '../components/PageNav'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/auth/profile')
        setUser(res.data.user)
      } catch (error) {
        console.error(error)
        // fallback to mock profile when API is unavailable (local dev)
        const mock = getProfileMock()
        if (mock?.user) setUser(mock.user)
        else navigate('/login')
      }
    }
    load()
  }, [navigate])

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto" }} className="min-h-screen bg-black antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />

      <div className="relative">
        <img src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=60" alt="bg" className="w-full h-96 object-cover brightness-60" />
      </div>

      <div className="-mt-12 max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="p-8 rounded-3xl bg-white/8 backdrop-blur-md border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-3">
            <PageNav title="Dashboard" />
          </div>

          <div className="md:col-span-2">
            {user ? (
              <div className="mt-4 text-amber-200">
                <div className="text-2xl font-semibold">Hello, {user.name}</div>
                <div className="mt-1">Role: <span className="text-amber-100 font-medium">{user.role}</span></div>
                <p className="mt-3 text-amber-300 max-w-xl">This is your centralized place for creating and managing tenders, submitting and evaluating bids, and monitoring platform activity. Use the button to go to your role dashboard.</p>
              </div>
            ) : (
              <div className="text-amber-200">Loading...</div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            <motion.img initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }} src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60" alt="dashboard" className="w-40 h-40 object-cover rounded-xl shadow-lg border border-white/6" />
            {user && (
              <button onClick={() => {
                if (user.role === 'Buyer') navigate('/dashboard/buyer')
                else if (user.role === 'Supplier') navigate('/dashboard/supplier')
                else if (user.role === 'Admin') navigate('/dashboard/admin')
                else navigate('/dashboard')
              }} className="mt-4 w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold">Go to dashboard</button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
