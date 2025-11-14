import React from 'react'
import { motion as Motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function PageNav({ title, user = { name: 'Signed in' }, notifications = 0 }) {
  const navigate = useNavigate()
  return (
    <Motion.div whileHover={{ y: -2 }} className="w-full rounded-2xl p-4 bg-amber-200/90 text-amber-900 shadow-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] p-1">
          <div className="bg-black/60 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">EB</div>
        </div>
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-amber-800/80">EasyBid — procurement dashboard</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/qr-scanner')}
          aria-label="QR Scanner" 
          title="Scan QR Codes"
          className="px-3 py-2 rounded bg-black/10 text-amber-800 hover:bg-black/20 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </button>
        <div className="relative">
          <button 
            onClick={() => navigate('/notifications')}
            aria-label="Notifications" 
            className="px-3 py-2 rounded bg-black/10 text-amber-800 hover:bg-black/20 transition-colors"
          >
            🔔
          </button>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center animate-pulse">
              {notifications > 99 ? '99+' : notifications}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-amber-800">{user.name}</div>
        </div>
      </div>
    </Motion.div>
  )
}
