import express from 'express'
import qrService from '../services/qrService.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import Tender from '../models/Tender.js'
import Bid from '../models/Bid.js'
import path from 'path'

const router = express.Router()

// Generate QR code for tender
router.post('/tender/:id/generate', authMiddleware, async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id).populate('createdBy buyerId');
    
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    // Check if user owns the tender or is admin
    if (tender.createdBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate QR code
    const qrFilename = await qrService.generateTenderQR(tender);
    
    // Update tender with QR code info
    tender.qrCode = qrFilename;
    tender.qrData = JSON.stringify({
      type: 'tender',
      id: tender._id,
      title: tender.title,
      category: tender.category,
      deadline: tender.deadline,
      budget: tender.budget,
      url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tender/${tender._id}`,
      generatedAt: new Date().toISOString()
    });
    
    await tender.save();

    res.json({
      message: 'QR code generated successfully',
      qrCode: qrFilename,
      qrUrl: `/api/qr/download/${qrFilename}`
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate QR code for bid
router.post('/bid/:id/generate', authMiddleware, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('supplier tender');
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Check if user owns the bid or is admin
    if (bid.supplier._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate QR code
    const qrFilename = await qrService.generateBidQR(bid);

    res.json({
      message: 'QR code generated successfully',
      qrCode: qrFilename,
      qrUrl: `/api/qr/download/${qrFilename}`
    });

  } catch (error) {
    console.error('Error generating bid QR code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download QR code image
router.get('/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = qrService.getQRFilePath(filename);
    
    // Check if file exists
    if (!(await qrService.qrExists(filename))) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    res.sendFile(path.resolve(filepath));

  } catch (error) {
    console.error('Error downloading QR code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Parse QR code data (for scanning)
router.post('/parse', authMiddleware, async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ message: 'QR data is required' });
    }

    const parsedData = qrService.parseQRData(qrData);
    
    // Validate and enrich the data based on type
    if (parsedData.type === 'tender') {
      const tender = await Tender.findById(parsedData.id)
        .populate('createdBy buyerId')
        .select('-__v');
      
      if (!tender) {
        return res.status(404).json({ message: 'Tender not found or may have been deleted' });
      }

      res.json({
        success: true,
        type: 'tender',
        data: {
          ...parsedData,
          tender: tender,
          isValid: true
        }
      });

    } else if (parsedData.type === 'bid') {
      const bid = await Bid.findById(parsedData.id)
        .populate('supplier tender')
        .select('-__v');
      
      if (!bid) {
        return res.status(404).json({ message: 'Bid not found or may have been deleted' });
      }

      res.json({
        success: true,
        type: 'bid',
        data: {
          ...parsedData,
          bid: bid,
          isValid: true
        }
      });

    } else {
      // Simple URL or unknown format
      res.json({
        success: true,
        type: 'url',
        data: parsedData
      });
    }

  } catch (error) {
    console.error('Error parsing QR code:', error);
    res.status(500).json({ message: 'Invalid QR code format' });
  }
});

// Get tender QR code
router.get('/tender/:id', authMiddleware, async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);
    
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    if (!tender.qrCode) {
      return res.status(404).json({ message: 'QR code not generated for this tender' });
    }

    // Check if QR file still exists
    if (!(await qrService.qrExists(tender.qrCode))) {
      return res.status(404).json({ message: 'QR code file not found' });
    }

    res.json({
      qrCode: tender.qrCode,
      qrData: tender.qrData,
      qrUrl: `/api/qr/download/${tender.qrCode}`
    });

  } catch (error) {
    console.error('Error getting tender QR code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate URL QR code
router.post('/url', authMiddleware, async (req, res) => {
  try {
    const { url, filename } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    const qrFilename = await qrService.generateURLQR(url, filename);

    res.json({
      message: 'QR code generated successfully',
      qrCode: qrFilename,
      qrUrl: `/api/qr/download/${qrFilename}`
    });

  } catch (error) {
    console.error('Error generating URL QR code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cleanup old QR codes (admin only)
router.delete('/cleanup', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const deletedCount = await qrService.cleanupOldQRCodes();

    res.json({
      message: 'QR code cleanup completed',
      deletedFiles: deletedCount
    });

  } catch (error) {
    console.error('Error cleaning up QR codes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router