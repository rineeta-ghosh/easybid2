import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
const Motion = motion
import api from '../lib/api'
import { getAdminDashboardMock } from '../lib/mockData'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import PageNav from '../components/PageNav'
import ActionButton from '../components/ActionButton'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState(null)

  // load function used both on mount and after seeding
  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/dashboard/admin')
      const dataSrc = res?.data && res.data.recentTenders ? res.data : getAdminDashboardMock().stats
      const days = (dataSrc.recentTenders || []).map((t, i) => ({ day: `T${i+1}`, tenders: 1 + (i % 3) }))
      setData({ stats: dataSrc, usage: days })
    } catch (err) {
      console.error(err)
      const mock = getAdminDashboardMock()
      const days = (mock.stats.recentTenders || []).map((t, i) => ({ day: `T${i+1}`, tenders: 1 + (i % 3) }))
      setData({ stats: mock.stats, usage: days })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])


  async function runSeed() {
    setSeeding(true)
    setSeedResult(null)
    try {
      const res = await api.post('/dashboard/seed')
      setSeedResult(res.data.created || res.data)
      // refresh admin stats after seeding
      await load()
    } catch (err) {
      console.error(err)
      const msg = err?.response?.data?.message || err.message || 'Seed failed'
      setSeedResult({ error: msg })
    } finally {
      setSeeding(false)
    }
  }

  if (loading) return <div className="p-8">Loading admin dashboard…</div>

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageNav title="Admin Dashboard" />
        
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-amber-200">Quick Actions</h2>
            <button onClick={runSeed} disabled={seeding} className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors">
              {seeding ? 'Seeding…' : 'Seed Mock Data'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton
              title="Approve Tenders"
              description="Review and approve pending tender submissions"
              icon="evaluate-bids"
              href="/admin/approval"
              gradient="from-orange-500 to-red-600"
              size="sm"
            />
            <ActionButton
              title="System Reports"
              description="View comprehensive system analytics and performance metrics"
              icon="reports"
              href="/admin/reports"
              gradient="from-green-500 to-emerald-600"
              size="sm"
            />
            <ActionButton
              title="User Management"
              description="Manage user accounts, roles, and permissions"
              icon="notifications" 
              href="/admin/users"
              gradient="from-emerald-500 to-teal-600"
              size="sm"
            />
            <ActionButton
              title="Tender Oversight"
              description="Monitor all tenders and evaluation processes"
              icon="evaluate-bids"
              href="/admin/tenders"
              gradient="from-teal-500 to-cyan-600"
              size="sm"
            />
            <ActionButton
              title="Platform Settings"
              description="Configure system settings and business rules"
              icon="create-tender"
              href="/admin/settings"
              gradient="from-cyan-500 to-blue-600"
              size="sm"
            />
          </div>
        </motion.div>
        
        {seedResult && (
          <div className="mb-4 p-3 rounded-lg bg-white/6 border border-white/10 text-amber-100">
            {seedResult.error ? (
              <div className="text-red-300">Error: {seedResult.error}</div>
            ) : (
              <div>
                <div className="font-medium">Seed completed</div>
                <div className="text-sm text-amber-300">Users: {seedResult.users ?? '—'}, Tenders: {seedResult.tenders ?? '—'}, Bids: {seedResult.bids ?? '—'}</div>
              </div>
            )}
          </div>
        )}

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div variants={item} className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="text-sm text-amber-300">Total Users</div>
            <div className="text-3xl font-bold text-amber-100">{data.stats.totalUsers}</div>
          </motion.div>
          <motion.div variants={item} className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="text-sm text-amber-300">Total Tenders</div>
            <div className="text-3xl font-bold text-amber-100">{data.stats.totalTenders}</div>
          </motion.div>
          <motion.div variants={item} className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="text-sm text-amber-300">Total Bids</div>
            <div className="text-3xl font-bold text-amber-100">{data.stats.totalBids}</div>
          </motion.div>
        </motion.div>

        <motion.div variants={item} initial="hidden" animate="show" className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
          <h3 className="text-lg text-amber-100 mb-3">Platform Usage</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={data.usage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tenders" stroke="#ff8a4c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
