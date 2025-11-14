import React, { useState, useEffect } from 'react'
import { motion as Motion } from 'framer-motion'
import PageNav from '../components/PageNav'
import AlertMessage from '../components/AlertMessage'
import api from '../lib/api'

export default function EmailPreferences() {
  const [preferences, setPreferences] = useState({
    tenderApproval: true,
    newBids: true,
    newTenders: true,
    systemUpdates: true,
    weeklyDigest: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPreferences()
  }, [loadPreferences])

  async function loadPreferences() {
    try {
      const res = await api.get('/auth/email-preferences')
      if (res.data.preferences) {
        setPreferences({ ...preferences, ...res.data.preferences })
      }
    } catch (error) {
      console.error('Failed to load email preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  async function savePreferences() {
    setSaving(true)
    setMessage(null)
    setError(null)
    
    try {
      await api.put('/auth/email-preferences', { preferences })
      setMessage('Email preferences updated successfully')
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to update preferences')
    } finally {
      setSaving(false)
    }
  }

  function handleToggle(key) {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) {
    return (
      <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100">
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <PageNav title="Email Preferences" />
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          </div>
        </div>
      </div>
    )
  }

  const preferenceOptions = [
    {
      key: 'tenderApproval', 
      title: 'Tender Approval Notifications',
      description: 'Get notified when your tenders are approved or require revisions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: 'newBids',
      title: 'New Bid Notifications', 
      description: 'Receive alerts when suppliers submit bids on your tenders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      key: 'newTenders',
      title: 'New Tender Opportunities',
      description: 'Stay informed about new tenders matching your business categories',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      key: 'systemUpdates',
      title: 'System Updates & Announcements',
      description: 'Important platform updates, maintenance notifications, and feature announcements',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    {
      key: 'weeklyDigest',
      title: 'Weekly Activity Digest',
      description: 'Weekly summary of your tender activity, bids, and platform insights',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ]

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <PageNav title="Email Preferences" />
        
        <div className="mt-6">
          {message && <AlertMessage type="info" message={message} />}
          {error && <AlertMessage type="error" message={error} />}
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-amber-200 mb-2">Manage Your Email Notifications</h2>
              <p className="text-neutral-300">Choose which email notifications you'd like to receive to stay informed about your tender activities.</p>
            </div>

            <div className="space-y-4">
              {preferenceOptions.map((option, index) => (
                <Motion.div
                  key={option.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start justify-between p-4 rounded-lg bg-black/20 border border-white/5 hover:bg-black/30 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="shrink-0 p-2 rounded-lg bg-orange-500/20 text-orange-400">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-200 mb-1">{option.title}</h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">{option.description}</p>
                    </div>
                  </div>
                  
                  <Motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggle(option.key)}
                    className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black ${
                      preferences[option.key] ? 'bg-orange-500' : 'bg-neutral-600'
                    }`}
                  >
                    <Motion.div
                      animate={{
                        x: preferences[option.key] ? 24 : 2
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </Motion.button>
                </Motion.div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={savePreferences}
                disabled={saving}
                className="px-6 py-3 rounded-lg bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </Motion.button>
              
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadPreferences}
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/10 text-amber-200 hover:bg-white/20 transition-colors"
              >
                Reset
              </Motion.button>
            </div>
          </div>
        </Motion.div>

        {/* Test Email Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <h3 className="text-lg font-semibold text-amber-200 mb-2">Test Email Configuration</h3>
            <p className="text-neutral-300 mb-4">Send a test email to verify your email notifications are working properly.</p>
            
            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={async () => {
                try {
                  await api.post('/auth/test-email')
                  setMessage('Test email sent successfully! Check your inbox.')
                } catch {
                  setError('Failed to send test email. Please check your email configuration.')
                }
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Send Test Email
            </Motion.button>
          </div>
        </Motion.div>
      </div>
    </div>
  )
}