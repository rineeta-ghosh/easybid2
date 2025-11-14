import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
const Motion = motion
import api from '../lib/api'
import { getBuyerDashboardMock } from '../lib/mockData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import PageNav from '../components/PageNav'
import ActionButton from '../components/ActionButton'

export default function BuyerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await api.get('/dashboard/buyer')
        const dataSrc = res?.data && (res.data.tenders || res.data.bids) ? res.data : getBuyerDashboardMock()
        
        // Enhanced data processing
        const mockData = getBuyerDashboardMock()
        const bidsData = dataSrc.bids || mockData.bids
        
        const processedData = {
          tenders: dataSrc.tenders || mockData.tenders,
          bids: bidsData,
          tenderHistory: mockData.tenderHistory,
          categoryStats: mockData.categoryStats,
          budgetDistribution: mockData.budgetDistribution,
          bidChart: bidsData.map((b) => ({ 
            name: String(b._id).slice(-6), 
            bids: b.count,
            avg: b.avgAmount || 0,
            min: b.minAmount || 0,
            max: b.maxAmount || 0
          })),
          bidAnalytics: {
            totalBidsReceived: bidsData.reduce((sum, b) => sum + b.count, 0),
            averageBidsPerTender: Math.round(bidsData.reduce((sum, b) => sum + b.count, 0) / bidsData.length),
            totalValueOfBids: bidsData.reduce((sum, b) => sum + (b.avgAmount * b.count), 0),
            competitionLevel: bidsData.length > 0 ? Math.round(bidsData.reduce((sum, b) => sum + b.count, 0) / bidsData.length) : 0,
            priceVariance: bidsData.map(b => ({
              tender: String(b._id).slice(-6),
              variance: b.maxAmount - b.minAmount,
              range: `$${b.minAmount?.toLocaleString()} - $${b.maxAmount?.toLocaleString()}`
            }))
          }
        }
        
        if (mounted) setData(processedData)
      } catch (err) {
        console.error(err)
        if (mounted) {
          const mock = getBuyerDashboardMock()
          const processedData = {
            tenders: mock.tenders,
            bids: mock.bids,
            tenderHistory: mock.tenderHistory,
            categoryStats: mock.categoryStats,
            budgetDistribution: mock.budgetDistribution,
            bidChart: mock.bids.map((b) => ({ 
              name: String(b._id).slice(-6), 
              bids: b.count,
              avg: b.avgAmount || 0,
              min: b.minAmount || 0,
              max: b.maxAmount || 0
            })),
            bidAnalytics: {
              totalBidsReceived: mock.bids.reduce((sum, b) => sum + b.count, 0),
              averageBidsPerTender: Math.round(mock.bids.reduce((sum, b) => sum + b.count, 0) / mock.bids.length),
              totalValueOfBids: mock.bids.reduce((sum, b) => sum + (b.avgAmount * b.count), 0),
              competitionLevel: mock.bids.length > 0 ? Math.round(mock.bids.reduce((sum, b) => sum + b.count, 0) / mock.bids.length) : 0,
              priceVariance: mock.bids.map(b => ({
                tender: String(b._id).slice(-6),
                variance: b.maxAmount - b.minAmount,
                range: `$${b.minAmount?.toLocaleString()} - $${b.maxAmount?.toLocaleString()}`
              }))
            }
          }
          setData(processedData)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="p-8">Loading buyer dashboard…</div>

  const container = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }
  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageNav title="Buyer Dashboard" />

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-amber-200 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionButton
              title="Create Tender"
              description="Post a new tender and start receiving bids from suppliers"
              icon="create-tender"
              href="/buyer/create-tender"
              gradient="from-amber-500 to-orange-600"
            />
            <ActionButton
              title="Evaluate Bids"
              description="Review and score supplier bids for your tenders"
              icon="evaluate-bids"
              href="/buyer/evaluate-bids"
              gradient="from-orange-500 to-red-600"
            />
            <ActionButton
              title="View Reports"
              description="Analyze tender performance and supplier metrics"
              icon="reports"
              href="/buyer/reports"
              gradient="from-red-500 to-pink-600"
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
                <p className="text-sm text-neutral-400">Active Tenders</p>
                <p className="text-2xl font-bold text-amber-200">{data.tenders.filter(t => t.status === 'Open').length}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/20">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Total Bids Received</p>
                <p className="text-2xl font-bold text-green-400">{data.bids.reduce((sum, b) => sum + b.count, 0)}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Success Rate</p>
                <p className="text-2xl font-bold text-blue-400">85%</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/20">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Avg. Savings</p>
                <p className="text-2xl font-bold text-purple-400">18%</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/20">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          variants={container} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
        >
          {/* Tender History Chart */}
          <motion.div variants={item} className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-amber-100">Tender Performance History</h3>
              <div className="text-xs text-neutral-400">Last 6 months</div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data.tenderHistory}>
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
                  <Line type="monotone" dataKey="created" stroke="#FF8A4C" strokeWidth={2} dot={{ fill: '#FF8A4C' }} />
                  <Line type="monotone" dataKey="completed" stroke="#4ECDC4" strokeWidth={2} dot={{ fill: '#4ECDC4' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div variants={item} className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <h3 className="text-lg text-amber-100 mb-4">Tender Categories</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.categoryStats.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-xs text-neutral-300">{cat.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Detailed Analytics */}
        <motion.div 
          variants={container} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
        >
          {/* Bid Analysis */}
          <motion.div variants={item} className="col-span-2 p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <h3 className="text-lg text-amber-100 mb-6">Comprehensive Bid Analysis</h3>
            
            {data?.bidAnalytics ? (
              <div className="space-y-6">
                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-500/20 backdrop-blur p-4 rounded-lg border border-blue-400/30">
                    <div className="text-2xl font-bold text-blue-300">{data.bidAnalytics.totalBidsReceived}</div>
                    <div className="text-xs text-blue-200">Total Bids</div>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur p-4 rounded-lg border border-green-400/30">
                    <div className="text-2xl font-bold text-green-300">{data.bidAnalytics.averageBidsPerTender}</div>
                    <div className="text-xs text-green-200">Avg/Tender</div>
                  </div>
                  <div className="bg-purple-500/20 backdrop-blur p-4 rounded-lg border border-purple-400/30">
                    <div className="text-2xl font-bold text-purple-300">${(data.bidAnalytics.totalValueOfBids / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-purple-200">Total Value</div>
                  </div>
                  <div className="bg-orange-500/20 backdrop-blur p-4 rounded-lg border border-orange-400/30">
                    <div className="text-2xl font-bold text-orange-300">{data.bidAnalytics.competitionLevel}</div>
                    <div className="text-xs text-orange-200">Competition</div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Bid Count Chart */}
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h4 className="text-sm text-amber-200 mb-3">Bids per Tender</h4>
                    <div style={{ width: '100%', height: 180 }}>
                      <ResponsiveContainer>
                        <BarChart data={data.bidChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#888" fontSize={12} />
                          <YAxis stroke="#888" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.9)', 
                              border: '1px solid #333',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                          />
                          <Bar dataKey="bids" fill="#FF8A4C" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Price Variance Chart */}
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h4 className="text-sm text-amber-200 mb-3">Price Variance</h4>
                    <div style={{ width: '100%', height: 180 }}>
                      <ResponsiveContainer>
                        <BarChart data={data.bidAnalytics.priceVariance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="tender" stroke="#888" fontSize={12} />
                          <YAxis stroke="#888" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.9)', 
                              border: '1px solid #333',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Variance']}
                          />
                          <Bar dataKey="variance" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Insights Section */}
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="text-sm text-amber-200 mb-3">Bidding Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="text-gray-300">
                      <span className="text-amber-200">Most Competitive:</span> 
                      {' '}{data.bidChart.reduce((max, tender) => 
                        tender.bids > max.bids ? tender : max, data.bidChart[0]
                      )?.name || 'N/A'} ({data.bidChart.reduce((max, tender) => 
                        tender.bids > max.bids ? tender : max, data.bidChart[0]
                      )?.bids || 0} bids)
                    </div>
                    <div className="text-gray-300">
                      <span className="text-amber-200">Highest Variance:</span> 
                      {' '}{data.bidAnalytics.priceVariance.reduce((max, tender) => 
                        tender.variance > max.variance ? tender : max, data.bidAnalytics.priceVariance[0]
                      )?.tender || 'N/A'} (${data.bidAnalytics.priceVariance.reduce((max, tender) => 
                        tender.variance > max.variance ? tender : max, data.bidAnalytics.priceVariance[0]
                      )?.variance?.toLocaleString() || 0})
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">📊</div>
                <div className="text-amber-200 text-lg font-medium">No Bid Data Available</div>
                <div className="text-gray-400 text-sm mt-2">Analytics will appear once tenders receive bids</div>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={item} className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg">
            <h3 className="text-lg text-amber-100 mb-4">Recent Tenders</h3>
            <div className="space-y-4">
              {data.tenders.slice(0, 6).map((t) => (
                <div key={t._id} className="flex items-start justify-between py-3 border-b border-white/10 last:border-0">
                  <div className="flex-1">
                    <div className="text-sm text-amber-200 font-medium line-clamp-1">{t.title}</div>
                    <div className="text-xs text-neutral-400 mt-1">{t.category}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        t.status === 'Open' ? 'bg-green-500/20 text-green-400' :
                        t.status === 'Closed' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {t.status}
                      </span>
                      {t.budget && (
                        <span className="text-xs text-amber-300">${t.budget.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      title="Generate QR Code"
                      className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors"
                      onClick={() => {
                        // Simple QR generation - could be enhanced with modal
                        fetch(`/api/qr/tender/${t._id}/generate`, {
                          method: 'POST',
                          credentials: 'include',
                        }).then(res => res.json()).then(data => {
                          if (data.qrUrl) {
                            window.open(data.qrUrl, '_blank');
                          }
                        }).catch(console.error);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Budget Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 shadow-lg"
        >
          <h3 className="text-lg text-amber-100 mb-4">Budget Distribution Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.budgetDistribution.map((range, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-black/20">
                <div className="text-2xl font-bold text-amber-200">{range.count}</div>
                <div className="text-sm text-neutral-400">{range.range}</div>
                <div className="text-xs text-amber-300">{range.percentage}% of total</div>
                <div className="w-full bg-neutral-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-linear-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                    style={{ width: `${range.percentage}%` }}
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
