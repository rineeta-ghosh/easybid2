import QRCode from 'qrcode'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class QRService {
    constructor() {
        this.qrDir = path.join(__dirname, '../../public/qr-codes');
        this.ensureQRDirectory();
    }

    async ensureQRDirectory() {
        try {
            await fs.access(this.qrDir);
        } catch {
            await fs.mkdir(this.qrDir, { recursive: true });
        }
    }

    /**
     * Generate QR code for tender
     * @param {Object} tender - Tender object
     * @returns {Promise<string>} - QR code filename
     */
    async generateTenderQR(tender) {
        try {
            const qrData = {
                type: 'tender',
                id: tender._id,
                title: tender.title,
                category: tender.category,
                deadline: tender.deadline,
                budget: tender.budget,
                url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tender/${tender._id}`,
                generatedAt: new Date().toISOString()
            };

            const qrString = JSON.stringify(qrData);
            const filename = `tender-${tender._id}-${Date.now()}.png`;
            const filepath = path.join(this.qrDir, filename);

            // Generate QR code with custom styling
            await QRCode.toFile(filepath, qrString, {
                type: 'png',
                quality: 0.92,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 300
            });

            return filename;
        } catch (error) {
            console.error('Error generating tender QR code:', error);
            throw new Error('Failed to generate QR code');
        }
    }

    /**
     * Generate QR code buffer for PDF embedding
     * @param {Object} tender - Tender object
     * @returns {Promise<Buffer>} - QR code image buffer
     */
    async generateTenderQRBuffer(tender) {
        try {
            const qrData = {
                type: 'tender',
                id: tender._id,
                title: tender.title,
                category: tender.category,
                deadline: tender.deadline,
                budget: tender.budget,
                url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tender/${tender._id}`,
                generatedAt: new Date().toISOString()
            };

            const qrString = JSON.stringify(qrData);

            // Generate QR code as buffer
            const qrBuffer = await QRCode.toBuffer(qrString, {
                type: 'png',
                quality: 0.92,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 200
            });

            return qrBuffer;
        } catch (error) {
            console.error('Error generating tender QR buffer:', error);
            throw new Error('Failed to generate QR buffer');
        }
    }

    /**
     * Generate QR code for bid tracking
     * @param {Object} bid - Bid object
     * @returns {Promise<string>} - QR code filename
     */
    async generateBidQR(bid) {
        try {
            const qrData = {
                type: 'bid',
                id: bid._id,
                tenderId: bid.tender,
                amount: bid.amount,
                supplier: bid.supplier,
                url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/bid/${bid._id}`,
                generatedAt: new Date().toISOString()
            };

            const qrString = JSON.stringify(qrData);
            const filename = `bid-${bid._id}-${Date.now()}.png`;
            const filepath = path.join(this.qrDir, filename);

            await QRCode.toFile(filepath, qrString, {
                type: 'png',
                quality: 0.92,
                margin: 2,
                color: {
                    dark: '#1a1a1a',
                    light: '#FFFFFF'
                },
                width: 250
            });

            return filename;
        } catch (error) {
            console.error('Error generating bid QR code:', error);
            throw new Error('Failed to generate bid QR code');
        }
    }

    /**
     * Generate simple URL QR code
     * @param {string} url - URL to encode
     * @param {string} filename - Custom filename
     * @returns {Promise<string>} - QR code filename
     */
    async generateURLQR(url, filename = null) {
        try {
            const qrFilename = filename || `url-${Date.now()}.png`;
            const filepath = path.join(this.qrDir, qrFilename);

            await QRCode.toFile(filepath, url, {
                type: 'png',
                quality: 0.92,
                margin: 2,
                color: {
                    dark: '#FF8A4C',
                    light: '#FFFFFF'
                },
                width: 200
            });

            return qrFilename;
        } catch (error) {
            console.error('Error generating URL QR code:', error);
            throw new Error('Failed to generate URL QR code');
        }
    }

    /**
     * Get QR code file path
     * @param {string} filename - QR code filename
     * @returns {string} - Full file path
     */
    getQRFilePath(filename) {
        return path.join(this.qrDir, filename);
    }

    /**
     * Check if QR code file exists
     * @param {string} filename - QR code filename
     * @returns {Promise<boolean>} - File exists
     */
    async qrExists(filename) {
        try {
            await fs.access(this.getQRFilePath(filename));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Delete QR code file
     * @param {string} filename - QR code filename
     * @returns {Promise<boolean>} - Success status
     */
    async deleteQR(filename) {
        try {
            await fs.unlink(this.getQRFilePath(filename));
            return true;
        } catch (error) {
            console.error('Error deleting QR code:', error);
            return false;
        }
    }

    /**
     * Parse QR code data
     * @param {string} qrString - QR code string data
     * @returns {Object} - Parsed QR data
     */
    parseQRData(qrString) {
        try {
            return JSON.parse(qrString);
        } catch {
            // If not JSON, treat as simple URL
            return { type: 'url', url: qrString };
        }
    }

    /**
     * Clean up old QR codes (older than 30 days)
     * @returns {Promise<number>} - Number of files deleted
     */
    async cleanupOldQRCodes() {
        try {
            const files = await fs.readdir(this.qrDir);
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            let deletedCount = 0;

            for (const file of files) {
                const filepath = path.join(this.qrDir, file);
                const stats = await fs.stat(filepath);
                
                if (stats.mtime.getTime() < thirtyDaysAgo) {
                    await fs.unlink(filepath);
                    deletedCount++;
                }
            }

            return deletedCount;
        } catch (error) {
            console.error('Error cleaning up QR codes:', error);
            return 0;
        }
    }
}

const qrService = new QRService()
export default qrService