import React, { useState, useEffect } from 'react'
import { motion as Motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import PageNav from '../components/PageNav'
import ActionButton from '../components/ActionButton'
import { LoadingSpinner } from '../components/Loaders'
import { exportToCSV, formatDataForExport } from '../lib/exportUtils'

const COLORS = ['#ff8a4c', '#ff5c2e', '#ffbb28', '#8884d8', '#33cc99']

const StatCard = ({ title, value, icon, trend, color = 'from-amber-500 to-orange-600' }) => (
  <Motion.div
    whileHover={{ y: -2 }}
    className={`p-6 rounded-2xl bg-linear-to-br ${color} text-white shadow-lg`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-sm">
            <span className={trend > 0 ? 'text-green-200' : 'text-red-200'}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      <div className="text-white/60 text-3xl">{icon}</div>
    </div>
  </Motion.div>
)

export default function Reports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    loadReportsData()
  }, [])

  const loadReportsData = async () => {
    setLoading(true)
    try {
      // Mock data for demonstration
      const mockData = {
        stats: {
          totalTenders: 145,
          totalBids: 892,
          totalUsers: 67,
          avgBidsPerTender: 6.2
        },
        trends: {
          tenders: 12,
          bids: -5,
          users: 8
        },
        chartData: {
          monthly: [
            { month: 'Jan', tenders: 12, bids: 45 },
            { month: 'Feb', tenders: 18, bids: 67 },
            { month: 'Mar', tenders: 15, bids: 52 },
            { month: 'Apr', tenders: 22, bids: 89 },
            { month: 'May', tenders: 19, bids: 71 },
            { month: 'Jun', tenders: 25, bids: 95 }
          ],
          categories: [
            { name: 'IT Services', value: 35 },
            { name: 'Construction', value: 28 },
            { name: 'Consulting', value: 20 },
            { name: 'Supplies', value: 17 }
          ]
        }
      }
      setData(mockData)
    } catch (error) {
      console.error('Failed to load reports data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type) => {
    setExportLoading(true)
    try {
      let exportData = []
      let filename = 'report'
      
      switch (type) {
        case 'tenders':
          // In real app, fetch from API
          exportData = formatDataForExport([], 'tenders')
          filename = 'tenders-report'
          break
        case 'bids':
          exportData = formatDataForExport([], 'bids')
          filename = 'bids-report'
          break
        case 'summary':
          exportData = [
            { Metric: 'Total Tenders', Value: data.stats.totalTenders },
            { Metric: 'Total Bids', Value: data.stats.totalBids },
            { Metric: 'Total Users', Value: data.stats.totalUsers },
            { Metric: 'Avg Bids per Tender', Value: data.stats.avgBidsPerTender }
          ]
          filename = 'summary-report'
          break
      }
      
      exportToCSV(exportData, filename)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExportLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageNav title="Reports & Analytics" />

        {/* Export Actions */}
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-amber-200">Export Options</h2>
            <div className="flex gap-3">
              <button
                onClick={() => handleExport('summary')}
                disabled={exportLoading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {exportLoading ? 'Exporting...' : 'Export Summary'}
              </button>
              <button
                onClick={() => handleExport('tenders')}
                disabled={exportLoading}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-neutral-300 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Export Tenders
              </button>
              <button
                onClick={() => handleExport('bids')}
                disabled={exportLoading}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-neutral-300 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Export Bids
              </button>
            </div>
          </div>
        </Motion.div>

        {/* Stats Cards */}
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total Tenders"
            value={data.stats.totalTenders}
            icon="📋"
            trend={data.trends.tenders}
            color="from-blue-500 to-indigo-600"
          />
          <StatCard
            title="Total Bids"
            value={data.stats.totalBids}
            icon="💼"
            trend={data.trends.bids}
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Active Users"
            value={data.stats.totalUsers}
            icon="👥"
            trend={data.trends.users}
            color="from-purple-500 to-pink-600"
          />
          <StatCard
            title="Avg Bids/Tender"
            value={data.stats.avgBidsPerTender}
            icon="📊"
            color="from-orange-500 to-red-600"
          />
        </Motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10"
          >
            <h3 className="text-lg font-semibold text-amber-200 mb-4">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData.monthly}>
                <XAxis dataKey="month" stroke="#d1d5db" />
                <YAxis stroke="#d1d5db" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="tenders" stroke="#ff8a4c" strokeWidth={3} />
                <Line type="monotone" dataKey="bids" stroke="#8884d8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Motion.div>

          {/* Category Distribution */}
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/6 backdrop-blur-md border border-white/10"
          >
            <h3 className="text-lg font-semibold text-amber-200 mb-4">Tender Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.chartData.categories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.chartData.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Motion.div>
        </div>
      </div>
    </div>
  )
}