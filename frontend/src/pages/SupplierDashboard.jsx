import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
const Motion = motion
import api from '../lib/api'
import { getSupplierDashboardMock } from '../lib/mockData'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts'
import PageNav from '../components/PageNav'
import ActionButton from '../components/ActionButton'

const COLORS = ['#FFBB28', '#FF8042', '#33CC99', '#8884d8']

export default function SupplierDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await api.get('/dashboard/supplier')
        // Use mock data with enhanced analytics
        const dataSrc = res?.data && (res.data.openTenders || res.data.submitted) ? res.data : getSupplierDashboardMock()
        const mockData = getSupplierDashboardMock()
        
        const submitted = dataSrc.submitted || mockData.submitted
        const counts = { Won: 0, Lost: 0, 'Under Review': 0, Submitted: 0 }
        submitted.forEach(s => counts[s.status] = (counts[s.status] || 0) + 1)
        const pie = Object.keys(counts).filter(k => counts[k] > 0).map(k => ({ name: k, value: counts[k] }))
        
        const processedData = {
          openTenders: dataSrc.openTenders || mockData.openTenders,
          submitted: submitted,
          pie: pie.length > 0 ? pie : [{ name: 'No Bids Yet', value: 1 }],
          bidPerformance: mockData.bidPerformance,
          revenueData: mockData.revenueData,
          categoryPerformance: mockData.categoryPerformance
        }
        
        if (mounted) setData(processedData)
      } catch (err) {
        console.error(err)
        if (mounted) {
          const mock = getSupplierDashboardMock()
          const submitted = mock.submitted || []
          const counts = { Won: 0, Lost: 0, 'Under Review': 0, Submitted: 0 }
          submitted.forEach(s => counts[s.status] = (counts[s.status] || 0) + 1)
          const pie = Object.keys(counts).filter(k => counts[k] > 0).map(k => ({ name: k, value: counts[k] }))
          
          setData({
            openTenders: mock.openTenders,
            submitted: mock.submitted,
            pie: pie.length > 0 ? pie : [{ name: 'No Bids Yet', value: 1 }],
            bidPerformance: mock.bidPerformance,
            revenueData: mock.revenueData,
            categoryPerformance: mock.categoryPerformance
          })
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="p-8">Loading supplier dashboard…</div>

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageNav title="Supplier Dashboard" />

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-amber-200 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionButton
              title="View Tenders"
              description="Browse and search available tenders to bid on"
              icon="view-tenders"
              href="/supplier/view-tenders"
              gradient="from-blue-500 to-indigo-600"
            />
            <ActionButton
              title="Submit Bid"
              description="Submit competitive bids for open tenders"
              icon="submit-bid"
              href="/supplier/submit-bid"
              gradient="from-indigo-500 to-purple-600"
            />
            <ActionButton
              title="My Bids"
              description="Track status and results of your submitted bids"
              icon="reports"
              href="/supplier/my-bids"
              gradient="from-purple-500 to-pink-600"
            />
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="p-6 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Total Bids</p>
                <p className="text-2xl font-bold text-amber-200">{data.submitted.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/20">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Bids Won</p>
                <p className="text-2xl font-bold text-green-400">{data.submitted.filter(s => s.status === 'Won').length}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Win Rate</p>
                <p className="text-2xl font-bold text-purple-400">
                  {data.submitted.length > 0 ? Math.round((data.submitted.filter(s => s.status === 'Won').length / data.submitted.length) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/20">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Avg Bid Amount</p>
                <p className="text-2xl font-bold text-amber-400">
                  ${data.submitted.length > 0 ? Math.round(data.submitted.reduce((sum, s) => sum + s.amount, 0) / data.submitted.length).toLocaleString() : '0'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/20">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Bid Success Rate */}
          <motion.div variants={item} className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-amber-100">Bid Success Rate</h3>
              <div className="text-xs text-neutral-400">Last 6 months</div>
            </div>
            {data.pie.length > 1 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie 
                      data={data.pie} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60}
                      outerRadius={100} 
                      paddingAngle={5}
                      fill="#8884d8"
                    >
                      {data.pie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-60 flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-full bg-amber-500/20 mb-4">
                  <svg className="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-amber-200 mb-2">Start Bidding!</h4>
                <p className="text-neutral-400 text-sm mb-4">Submit your first bid to see success analytics here</p>
                <button className="px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400 transition-colors">
                  View Available Tenders
                </button>
              </div>
            )}
            {data.pie.length > 1 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {data.pie.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-xs text-neutral-300">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Bid Performance Trends */}
          <motion.div variants={item} className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <h3 className="text-lg text-amber-100 mb-4">Bid Performance Trends</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={data.bidPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area type="monotone" dataKey="submitted" stackId="1" stroke="#FF8A4C" fill="#FF8A4C" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="won" stackId="1" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        {/* Revenue Analysis */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Revenue Trends */}
          <motion.div variants={item} className="col-span-2 p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <h3 className="text-lg text-amber-100 mb-4">Revenue vs Target</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={data.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Bar dataKey="target" fill="#666" radius={[2,2,0,0]} />
                  <Bar dataKey="revenue" fill="#FF8A4C" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Available Tenders */}
          <motion.div variants={item} className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <h3 className="text-lg text-amber-100 mb-4">Available Tenders</h3>
            <div className="space-y-4">
              {data.openTenders.slice(0, 5).map((t) => (
                <div key={t._id} className="p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm text-amber-200 font-medium line-clamp-2">{t.title}</div>
                      <div className="text-xs text-neutral-400 mt-1">{t.category}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-green-400">${t.budget?.toLocaleString()}</span>
                        <span className="text-xs text-blue-400">{t.bidCount} bids</span>
                      </div>
                    </div>
                    <button className="ml-2 p-1 text-amber-400 hover:text-amber-300 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {data.openTenders.length === 0 && (
                <div className="text-center py-8">
                  <div className="p-3 rounded-full bg-neutral-700 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-neutral-400 text-sm">No tenders available</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Category Performance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg"
        >
          <h3 className="text-lg text-amber-100 mb-4">Performance by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.categoryPerformance.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-black/20">
                <div className="text-lg font-bold text-amber-200">{cat.category}</div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <span className="text-neutral-400">Win Rate:</span>
                    <div className="text-green-400 font-medium">{cat.win_rate}%</div>
                  </div>
                  <div>
                    <span className="text-neutral-400">Avg Amount:</span>
                    <div className="text-amber-300 font-medium">${cat.avg_amount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-2 mt-3">
                  <div 
                    className="bg-linear-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${cat.win_rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
