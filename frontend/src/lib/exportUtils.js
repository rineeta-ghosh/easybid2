// Export utilities for CSV and PDF generation
export const exportToCSV = (data, filename) => {
  if (!data.length) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const cell = row[header]
      return typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
    }).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
}

export const exportToPDF = async (elementId, filename) => {
  // This is a placeholder for PDF export functionality
  // In a real app, you'd use libraries like jsPDF or Puppeteer
  console.log(`Exporting ${elementId} to PDF as ${filename}`)
  
  // Simple fallback - open print dialog
  window.print()
}

export const formatDataForExport = (data, type = 'tenders') => {
  switch (type) {
    case 'tenders':
      return data.map(tender => ({
        ID: tender._id,
        Title: tender.title,
        Category: tender.category,
        Budget: tender.budget,
        Status: tender.status,
        Deadline: new Date(tender.deadline).toLocaleDateString(),
        Created: new Date(tender.createdAt).toLocaleDateString(),
        'Created By': tender.createdBy?.name || 'Unknown'
      }))
    
    case 'bids':
      return data.map(bid => ({
        ID: bid._id,
        'Tender ID': bid.tenderId,
        Supplier: bid.supplier?.name || 'Unknown',
        Amount: bid.amount,
        Status: bid.status,
        Submitted: new Date(bid.createdAt).toLocaleDateString()
      }))
    
    case 'notifications':
      return data.map(notification => ({
        ID: notification._id,
        Title: notification.title,
        Message: notification.message,
        Type: notification.type,
        Priority: notification.priority,
        Read: notification.read ? 'Yes' : 'No',
        Created: new Date(notification.createdAt).toLocaleDateString()
      }))
    
    default:
      return data
  }
}