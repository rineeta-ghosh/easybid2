import React, { useState } from 'react'
import AuthForm from '../components/AuthForm'
import { motion } from 'framer-motion'
const Motion = motion

export default function Auth({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)

  return (
    <div className="min-h-screen bg-black antialiased">
      <div className="relative">
        <img src="https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1600&q=60" alt="bg" className="w-full h-screen object-cover brightness-60" />
  {/* darker overlay, reduced/global blur removed so card and left panel read clearly */}
  <div className="absolute inset-0 bg-black/65"></div>

        <div className="absolute inset-0 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.995 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28 }} className="w-full max-w-2xl">

            {/* Central auth card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: informational panel to keep card from feeling full */}
                <div className="hidden md:flex flex-col justify-center p-8 bg-black/80 text-white">
                  <h3 className="text-3xl font-extrabold mb-3">Create an account</h3>
                  <p className="text-sm text-gray-200 mb-6 leading-relaxed wrap-break-word">Register to post and manage tenders. Get notifications, track bids, and collaborate with teams — everything in one dashboard.</p>

                  {/* horizontal feature chips to fill space and avoid an empty panel */}
                  <div className="flex flex-wrap gap-3 items-center">
                    {['Post Tenders', 'Manage Bids', 'Notifications', 'Teams', 'Analytics'].map((t) => (
                      <div key={t} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full text-sm text-white">
                        <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold">•</span>
                        <span className="whitespace-nowrap">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: form panel */}
                <div className="p-6 md:p-10">
                  <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-amber-900 mb-4">{mode === 'login' ? 'Login Form' : 'Signup Form'}</h2>

                    {/* Toggle pill */}
                    <div className="w-full max-w-sm rounded-full bg-white/90 border border-white/20 p-1 shadow-sm mb-6">
                      <div className="flex items-center rounded-full bg-transparent">
                        <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-full ${mode === 'login' ? 'bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white shadow' : 'text-amber-700'}`}>Login</button>
                        <button onClick={() => setMode('register')} className={`flex-1 py-2 rounded-full ${mode === 'register' ? 'bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white shadow' : 'text-amber-700'}`}>Signup</button>
                      </div>
                    </div>

                    {/* Form inserted without its own wrapper */}
                    <div className="w-full">
                      <AuthForm mode={mode} noWrapper />
                      <div className="mt-4 text-center">
                        <a href="/create-admin" className="text-sm text-amber-600 hover:underline">Create admin (first-time setup)</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
