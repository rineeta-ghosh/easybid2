import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import qrService from './qrService.js'

// Ensure PDF directory exists
const pdfDir = path.resolve('./pdfs')
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true })

// Helper function to format currency
function formatCurrency(amount) {
  return amount ? `$${amount.toLocaleString()}` : 'Not specified'
}

// Helper function to format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Generate comprehensive tender PDF
export async function generateTenderPDF(tender, bids = []) {
  return new Promise(async (resolve, reject) => {
    try {
      const filename = `tender-${tender._id}-${Date.now()}.pdf`
      const filepath = path.join(pdfDir, filename)
      
      // Generate QR code buffer for PDF embedding
      const qrBuffer = await qrService.generateTenderQRBuffer(tender)
      
      // Create PDF document
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        info: {
          Title: `Tender: ${tender.title}`,
          Author: 'EasyBid Platform',
          Subject: 'Tender Document',
          Creator: 'EasyBid PDF Service'
        }
      })
      
      // Stream to file
      const stream = fs.createWriteStream(filepath)
      doc.pipe(stream)

      // Header with logo space and title
      doc.fontSize(24)
         .fillColor('#FF8A4C')
         .text('EasyBid Platform', 50, 50)
         .fontSize(12)
         .fillColor('#666666')
         .text('Tender Management System', 50, 80)

      // Main title
      doc.fontSize(20)
         .fillColor('#000000')
         .text('TENDER DOCUMENT', 50, 120, { align: 'center' })

      // Tender details section
      let yPosition = 170
      
      // Title and basic info
      doc.fontSize(16)
         .fillColor('#FF8A4C')
         .text('Tender Information', 50, yPosition)
      
      yPosition += 30
      doc.fontSize(12)
         .fillColor('#000000')
         .text(`Title: ${tender.title}`, 50, yPosition, { width: 500 })
      
      yPosition += 20
      doc.text(`ID: ${tender._id}`, 50, yPosition)
      
      yPosition += 20
      const categoryText = tender.category === 'Other' && tender.customCategory 
        ? `${tender.category} (${tender.customCategory})` 
        : tender.category
      doc.text(`Category: ${categoryText}`, 50, yPosition)
      
      yPosition += 20
      doc.text(`Budget: ${formatCurrency(tender.budget)}`, 50, yPosition)
      
      yPosition += 20
      doc.text(`Status: ${tender.status} (${tender.approvalStatus})`, 50, yPosition)
      
      yPosition += 20
      doc.text(`Deadline: ${formatDate(tender.deadline)}`, 50, yPosition)
      
      yPosition += 20
      doc.text(`Created: ${formatDate(tender.createdAt)}`, 50, yPosition)
      
      if (tender.approvedAt) {
        yPosition += 20
        doc.text(`Approved: ${formatDate(tender.approvedAt)}`, 50, yPosition)
      }

      // Description section
      if (tender.description) {
        yPosition += 40
        doc.fontSize(16)
           .fillColor('#FF8A4C')
           .text('Description', 50, yPosition)
        
        yPosition += 25
        doc.fontSize(12)
           .fillColor('#000000')
           .text(tender.description, 50, yPosition, { width: 500, align: 'justify' })
        
        // Calculate text height to adjust yPosition
        const descriptionHeight = doc.heightOfString(tender.description, { width: 500 })
        yPosition += descriptionHeight + 20
      }

      // Buyer information
      if (tender.buyerId || tender.createdBy) {
        yPosition += 30
        doc.fontSize(16)
           .fillColor('#FF8A4C')
           .text('Buyer Information', 50, yPosition)
        
        yPosition += 25
        doc.fontSize(12)
           .fillColor('#000000')
        
        const buyer = tender.buyerId || tender.createdBy
        if (buyer.name) {
          doc.text(`Name: ${buyer.name}`, 50, yPosition)
          yPosition += 20
        }
        if (buyer.email) {
          doc.text(`Email: ${buyer.email}`, 50, yPosition)
          yPosition += 20
        }
      }

      // Bids section (if provided)
      if (bids && bids.length > 0) {
        yPosition += 30
        
        // Check if we need a new page
        if (yPosition > 700) {
          doc.addPage()
          yPosition = 50
        }
        
        doc.fontSize(16)
           .fillColor('#FF8A4C')
           .text('Submitted Bids', 50, yPosition)
        
        yPosition += 25
        
        bids.forEach((bid, index) => {
          // Check if we need a new page for each bid
          if (yPosition > 650) {
            doc.addPage()
            yPosition = 50
          }
          
          doc.fontSize(14)
             .fillColor('#333333')
             .text(`Bid #${index + 1}`, 50, yPosition)
          
          yPosition += 20
          doc.fontSize(12)
             .fillColor('#000000')
             .text(`Amount: ${formatCurrency(bid.amount)}`, 70, yPosition)
          
          yPosition += 15
          if (bid.supplier?.name) {
            doc.text(`Supplier: ${bid.supplier.name}`, 70, yPosition)
            yPosition += 15
          }
          
          if (bid.comments) {
            doc.text(`Comments: ${bid.comments}`, 70, yPosition, { width: 450 })
            const commentsHeight = doc.heightOfString(bid.comments, { width: 450 })
            yPosition += commentsHeight + 15
          }
          
          doc.text(`Submitted: ${formatDate(bid.createdAt)}`, 70, yPosition)
          yPosition += 25
        })
      }

      // Footer
      const pageCount = doc.bufferedPageRange().count
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i)
        doc.fontSize(10)
           .fillColor('#888888')
           .text(
             `Generated on ${formatDate(new Date())} | Page ${i + 1} of ${pageCount} | EasyBid Platform`,
             50,
             doc.page.height - 50,
             { align: 'center', width: doc.page.width - 100 }
           )
      }

      // Add QR Code to first page
      doc.switchToPage(0)
      doc.image(qrBuffer, 450, 50, { width: 100, height: 100 })
      doc.fontSize(8)
         .fillColor('#888888')
         .text('Scan for mobile access', 450, 160, { width: 100, align: 'center' })

      // Finalize the PDF
      doc.end()

      stream.on('finish', () => {
        resolve({
          filename,
          filepath,
          url: `/pdfs/${filename}`
        })
      })

      stream.on('error', reject)

    } catch (error) {
      reject(error)
    }
  })
}

// Generate bid summary PDF
export async function generateBidSummaryPDF(tender, bids) {
  return new Promise((resolve, reject) => {
    try {
      const filename = `bid-summary-${tender._id}-${Date.now()}.pdf`
      const filepath = path.join(pdfDir, filename)
      
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const stream = fs.createWriteStream(filepath)
      doc.pipe(stream)

      // Header
      doc.fontSize(24)
         .fillColor('#FF8A4C')
         .text('EasyBid Platform', 50, 50)
         .fontSize(12)
         .fillColor('#666666')
         .text('Bid Summary Report', 50, 80)

      // Title
      doc.fontSize(18)
         .fillColor('#000000')
         .text('BID SUMMARY REPORT', 50, 120, { align: 'center' })

      // Tender info
      let y = 160
      doc.fontSize(14)
         .fillColor('#FF8A4C')
         .text('Tender Details', 50, y)
      
      y += 25
      doc.fontSize(12)
         .fillColor('#000000')
         .text(`Title: ${tender.title}`, 50, y)
      
      y += 20
      doc.text(`Total Bids Received: ${bids.length}`, 50, y)
      
      if (bids.length > 0) {
        const amounts = bids.map(b => b.amount).filter(a => a)
        if (amounts.length > 0) {
          y += 20
          doc.text(`Lowest Bid: ${formatCurrency(Math.min(...amounts))}`, 50, y)
          y += 15
          doc.text(`Highest Bid: ${formatCurrency(Math.max(...amounts))}`, 50, y)
          y += 15
          doc.text(`Average Bid: ${formatCurrency(amounts.reduce((a, b) => a + b, 0) / amounts.length)}`, 50, y)
        }
      }

      // Bids table
      y += 40
      doc.fontSize(14)
         .fillColor('#FF8A4C')
         .text('Bid Details', 50, y)

      if (bids.length === 0) {
        y += 25
        doc.fontSize(12)
           .fillColor('#666666')
           .text('No bids have been submitted yet.', 50, y)
      } else {
        y += 25
        
        // Table headers
        doc.fontSize(10)
           .fillColor('#333333')
           .text('Supplier', 50, y)
           .text('Amount', 200, y)
           .text('Date', 300, y)
           .text('Comments', 400, y)
        
        y += 20
        
        // Table data
        bids.forEach((bid, index) => {
          if (y > 700) {
            doc.addPage()
            y = 50
          }
          
          const supplierName = bid.supplier?.name || 'Unknown'
          const amount = formatCurrency(bid.amount)
          const date = new Date(bid.createdAt).toLocaleDateString()
          const comments = bid.comments ? bid.comments.substring(0, 30) + '...' : 'None'
          
          doc.fontSize(9)
             .fillColor('#000000')
             .text(supplierName, 50, y)
             .text(amount, 200, y)
             .text(date, 300, y)
             .text(comments, 400, y)
          
          y += 15
        })
      }

      // Footer
      const pageCount = doc.bufferedPageRange().count
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i)
        doc.fontSize(10)
           .fillColor('#888888')
           .text(
             `Generated on ${formatDate(new Date())} | Page ${i + 1} of ${pageCount}`,
             50,
             doc.page.height - 50,
             { align: 'center', width: doc.page.width - 100 }
           )
      }

      doc.end()

      stream.on('finish', () => {
        resolve({
          filename,
          filepath,
          url: `/pdfs/${filename}`
        })
      })

      stream.on('error', reject)

    } catch (error) {
      reject(error)
    }
  })
}

// Clean up old PDF files (call this periodically)
export function cleanupOldPDFs(daysOld = 7) {
  try {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000)
    
    fs.readdir(pdfDir, (err, files) => {
      if (err) {
        console.error('Error reading PDF directory:', err)
        return
      }
      
      files.forEach(file => {
        const filepath = path.join(pdfDir, file)
        fs.stat(filepath, (err, stats) => {
          if (!err && stats.mtime.getTime() < cutoffTime) {
            fs.unlink(filepath, (err) => {
              if (!err) {
                console.log(`Cleaned up old PDF: ${file}`)
              }
            })
          }
        })
      })
    })
  } catch (error) {
    console.error('Error cleaning up PDFs:', error)
  }
}

export default {
  generateTenderPDF,
  generateBidSummaryPDF,
  cleanupOldPDFs
}