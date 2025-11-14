// Enhanced mock data for rich dashboard visualizations
export function getBuyerDashboardMock() {
  const tenders = [
    { _id: 't1', title: 'Office Supplies Procurement', category: 'Goods', deadline: Date.now() + 7 * 24 * 3600 * 1000, status: 'Open', budget: 25000, approvalStatus: 'Approved' },
    { _id: 't2', title: 'IT Infrastructure Services', category: 'Services', deadline: Date.now() + 14 * 24 * 3600 * 1000, status: 'Open', budget: 150000, approvalStatus: 'Approved' },
    { _id: 't3', title: 'Corporate Catering Contract', category: 'Services', deadline: Date.now() + 3 * 24 * 3600 * 1000, status: 'Open', budget: 80000, approvalStatus: 'Approved' },
    { _id: 't4', title: 'Construction Materials', category: 'Construction', deadline: Date.now() - 5 * 24 * 3600 * 1000, status: 'Closed', budget: 200000, approvalStatus: 'Approved' },
    { _id: 't5', title: 'Marketing Services', category: 'Services', deadline: Date.now() - 10 * 24 * 3600 * 1000, status: 'Evaluated', budget: 75000, approvalStatus: 'Approved' },
  ]

  const bids = [
    { _id: 't1', count: 12, avgAmount: 22000, minAmount: 18000, maxAmount: 26000 },
    { _id: 't2', count: 8, avgAmount: 140000, minAmount: 120000, maxAmount: 165000 },
    { _id: 't3', count: 4, avgAmount: 78000, minAmount: 75000, maxAmount: 82000 },
    { _id: 't4', count: 15, avgAmount: 185000, minAmount: 170000, maxAmount: 210000 },
    { _id: 't5', count: 6, avgAmount: 72000, minAmount: 68000, maxAmount: 78000 },
  ]

  // Tender history over time
  const tenderHistory = [
    { month: 'Jan', created: 8, completed: 6, success_rate: 75 },
    { month: 'Feb', created: 12, completed: 10, success_rate: 83 },
    { month: 'Mar', created: 15, completed: 13, success_rate: 87 },
    { month: 'Apr', created: 10, completed: 8, success_rate: 80 },
    { month: 'May', created: 18, completed: 16, success_rate: 89 },
    { month: 'Jun', created: 14, completed: 12, success_rate: 86 },
  ]

  // Category breakdown
  const categoryStats = [
    { name: 'Construction', value: 35, color: '#FF8A4C' },
    { name: 'IT & Technology', value: 25, color: '#4ECDC4' },
    { name: 'Services', value: 20, color: '#45B7D1' },
    { name: 'Goods', value: 15, color: '#96CEB4' },
    { name: 'Other', value: 5, color: '#FECA57' }
  ]

  // Budget distribution
  const budgetDistribution = [
    { range: '0-50K', count: 15, percentage: 35 },
    { range: '50K-100K', count: 12, percentage: 28 },
    { range: '100K-200K', count: 8, percentage: 19 },
    { range: '200K+', count: 8, percentage: 18 }
  ]

  return { tenders, bids, tenderHistory, categoryStats, budgetDistribution }
}

export function getSupplierDashboardMock() {
  const openTenders = [
    { _id: 't1', title: 'Office Supplies Procurement', category: 'Goods', deadline: Date.now() + 7 * 24 * 3600 * 1000, budget: 25000, bidCount: 12 },
    { _id: 't4', title: 'Building Maintenance Contract', category: 'Services', deadline: Date.now() + 10 * 24 * 3600 * 1000, budget: 120000, bidCount: 8 },
    { _id: 't6', title: 'Road Infrastructure Project', category: 'Construction', deadline: Date.now() + 15 * 24 * 3600 * 1000, budget: 500000, bidCount: 6 },
    { _id: 't7', title: 'Healthcare Equipment Supply', category: 'Healthcare', deadline: Date.now() + 20 * 24 * 3600 * 1000, budget: 200000, bidCount: 4 },
  ]

  const submitted = [
    { _id: 's1', status: 'Won', amount: 85000, tender: 'IT Equipment Purchase', date: Date.now() - 15 * 24 * 3600 * 1000 },
    { _id: 's2', status: 'Lost', amount: 45000, tender: 'Office Renovation', date: Date.now() - 8 * 24 * 3600 * 1000 },
    { _id: 's3', status: 'Under Review', amount: 120000, tender: 'Software Development', date: Date.now() - 3 * 24 * 3600 * 1000 },
    { _id: 's4', status: 'Submitted', amount: 75000, tender: 'Marketing Campaign', date: Date.now() - 1 * 24 * 3600 * 1000 },
    { _id: 's5', status: 'Won', amount: 160000, tender: 'Construction Project', date: Date.now() - 25 * 24 * 3600 * 1000 },
  ]

  // Bid performance over time
  const bidPerformance = [
    { month: 'Jan', submitted: 12, won: 4, win_rate: 33 },
    { month: 'Feb', submitted: 15, won: 6, win_rate: 40 },
    { month: 'Mar', submitted: 10, won: 3, win_rate: 30 },
    { month: 'Apr', submitted: 18, won: 8, win_rate: 44 },
    { month: 'May', submitted: 14, won: 7, win_rate: 50 },
    { month: 'Jun', submitted: 16, won: 6, win_rate: 38 },
  ]

  // Revenue trends
  const revenueData = [
    { month: 'Jan', revenue: 150000, target: 180000 },
    { month: 'Feb', revenue: 220000, target: 200000 },
    { month: 'Mar', revenue: 180000, target: 190000 },
    { month: 'Apr', revenue: 280000, target: 250000 },
    { month: 'May', revenue: 320000, target: 300000 },
    { month: 'Jun', revenue: 250000, target: 280000 },
  ]

  // Category success rates
  const categoryPerformance = [
    { category: 'Construction', submitted: 25, won: 12, win_rate: 48, avg_amount: 185000 },
    { category: 'IT & Technology', submitted: 18, won: 7, win_rate: 39, avg_amount: 95000 },
    { category: 'Services', submitted: 22, won: 9, win_rate: 41, avg_amount: 120000 },
    { category: 'Healthcare', submitted: 8, won: 4, win_rate: 50, avg_amount: 150000 },
  ]

  return { openTenders, submitted, bidPerformance, revenueData, categoryPerformance }
}

export function getAdminDashboardMock() {
  const stats = { 
    totalUsers: 247, 
    totalTenders: 184, 
    totalBids: 1248, 
    pendingApprovals: 12,
    activeContracts: 45,
    totalValue: 15750000,
    recentTenders: Array.from({ length: 7 }).map((_, i) => ({ 
      id: `r${i+1}`, 
      title: `Infrastructure Project ${i+1}`,
      status: i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'Approved' : 'Active',
      value: Math.floor(Math.random() * 500000) + 50000
    })) 
  }

  // Platform growth metrics
  const platformGrowth = [
    { month: 'Jan', users: 180, tenders: 28, bids: 156, value: 2100000 },
    { month: 'Feb', users: 195, tenders: 35, bids: 198, value: 2800000 },
    { month: 'Mar', users: 210, tenders: 42, bids: 245, value: 3200000 },
    { month: 'Apr', users: 225, tenders: 38, bids: 220, value: 2950000 },
    { month: 'May', users: 240, tenders: 48, bids: 285, value: 3750000 },
    { month: 'Jun', users: 247, tenders: 45, bids: 267, value: 3500000 },
  ]

  // User activity distribution
  const userActivity = [
    { role: 'Buyers', active: 85, total: 92, percentage: 92 },
    { role: 'Suppliers', active: 142, total: 155, percentage: 92 },
    { role: 'Admins', active: 8, total: 8, percentage: 100 },
  ]

  // Tender status distribution
  const tenderStatusDistribution = [
    { name: 'Active', value: 45, color: '#4ECDC4' },
    { name: 'Completed', value: 128, color: '#45B7D1' },
    { name: 'Pending Approval', value: 12, color: '#FECA57' },
    { name: 'Cancelled', value: 8, color: '#FF6B6B' },
  ]

  // Category volume analysis
  const categoryVolume = [
    { category: 'Construction', tenders: 58, total_value: 8500000, avg_bids: 12 },
    { category: 'IT & Technology', tenders: 42, total_value: 3200000, avg_bids: 8 },
    { category: 'Healthcare', tenders: 28, total_value: 2100000, avg_bids: 6 },
    { category: 'Education', tenders: 24, total_value: 1450000, avg_bids: 5 },
    { category: 'Transportation', tenders: 32, total_value: 1800000, avg_bids: 7 },
  ]

  // Success metrics
  const successMetrics = {
    averageTimeToCompletion: 28, // days
    supplierSatisfaction: 4.2, // out of 5
    buyerSatisfaction: 4.5, // out of 5
    platformEfficiency: 87, // percentage
    costSavings: 22, // percentage average savings
  }

  return { stats, platformGrowth, userActivity, tenderStatusDistribution, categoryVolume, successMetrics }
}

export function getProfileMock() {
  return { user: { name: 'Demo User', role: 'Buyer' } }
}
