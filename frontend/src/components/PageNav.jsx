import React, { useState, useRef, useEffect } from 'react'
import { motion as Motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function PageNav({ title, user = { name: 'Signed in' }, notifications = 0 }) {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      localStorage.removeItem('token')
      navigate('/')
    } catch (err) {
      console.error('Logout error:', err)
      // Force logout even if API call fails
      localStorage.removeItem('token')
      navigate('/')
    }
  }
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
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded bg-black/10 text-amber-800 hover:bg-black/20 transition-colors"
          >
            <div className="text-sm font-medium">{user.name}</div>
            <svg 
              className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-neutral-200 py-1 z-50"
            >
              <div className="px-4 py-2 border-b border-neutral-200">
                <div className="text-xs text-neutral-500">Signed in as</div>
                <div className="text-sm font-medium text-neutral-900">{user.name}</div>
                {user.email && <div className="text-xs text-neutral-500">{user.email}</div>}
              </div>
              <button
                onClick={() => {
                  setShowDropdown(false)
                  navigate('/profile')
                }}
                className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </Motion.div>
          )}
        </div>
      </div>
    </Motion.div>
  )
}
