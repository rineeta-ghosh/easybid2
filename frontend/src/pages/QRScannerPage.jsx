import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';

const QRScannerPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleScan = async (qrData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Parse QR code data
      const response = await fetch('/api/qr/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ qrData }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse QR code');
      }

      const result = await response.json();
      setScanResult(result);
      setIsScanning(false);

    } catch (err) {
      setError('Invalid QR code or server error');
      console.error('QR scan error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err) => {
    setError('Error scanning QR code');
    console.error('Scanner error:', err);
  };

  const handleViewTender = () => {
    if (scanResult?.data?.tender?._id) {
      navigate(`/tender/${scanResult.data.tender._id}`);
    }
  };

  const handleViewBid = () => {
    if (scanResult?.data?.bid?._id) {
      navigate(`/bid/${scanResult.data.bid._id}`);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-amber-100 mb-2">QR Code Scanner</h1>
          <p className="text-neutral-400">Scan QR codes to access tender and bid information</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Scanner Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            {!isScanning && !scanResult && (
              <button
                onClick={() => setIsScanning(true)}
                className="px-8 py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center gap-3 mx-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Start Scanning
              </button>
            )}

            {(isScanning || scanResult) && (
              <button
                onClick={resetScanner}
                className="px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {scanResult ? 'Scan Another' : 'Reset Scanner'}
              </button>
            )}
          </motion.div>

          {/* Scanner Component */}
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 flex justify-center"
            >
              <QRScanner
                isActive={isScanning}
                onScan={handleScan}
                onError={handleError}
              />
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-neutral-400">Processing QR code...</p>
            </motion.div>
          )}

          {/* Scan Results */}
          {scanResult && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Success Message */}
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="font-semibold">QR Code Scanned Successfully!</h3>
                </div>
              </div>

              {/* Tender Result */}
              {scanResult.type === 'tender' && scanResult.data.tender && (
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-amber-100 mb-2">
                        {scanResult.data.tender.title}
                      </h3>
                      <p className="text-neutral-400">Tender Information</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      scanResult.data.tender.status === 'Open' ? 'bg-green-500/20 text-green-400' :
                      scanResult.data.tender.status === 'Closed' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {scanResult.data.tender.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-neutral-400 text-sm">Category:</span>
                        <p className="text-amber-200">{scanResult.data.tender.category}</p>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-sm">Budget:</span>
                        <p className="text-amber-200">
                          ${scanResult.data.tender.budget?.toLocaleString() || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-neutral-400 text-sm">Deadline:</span>
                        <p className="text-amber-200">
                          {new Date(scanResult.data.tender.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-sm">Approval Status:</span>
                        <p className="text-amber-200">{scanResult.data.tender.approvalStatus}</p>
                      </div>
                    </div>
                  </div>

                  {scanResult.data.tender.description && (
                    <div className="mb-6">
                      <span className="text-neutral-400 text-sm">Description:</span>
                      <p className="text-neutral-200 mt-1">{scanResult.data.tender.description}</p>
                    </div>
                  )}

                  <button
                    onClick={handleViewTender}
                    className="w-full px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Full Tender
                  </button>
                </div>
              )}

              {/* Bid Result */}
              {scanResult.type === 'bid' && scanResult.data.bid && (
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-amber-100 mb-2">
                        Bid Information
                      </h3>
                      <p className="text-neutral-400">Tender: {scanResult.data.bid.tender?.title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-neutral-400 text-sm">Bid Amount:</span>
                        <p className="text-green-400 text-xl font-semibold">
                          ${scanResult.data.bid.amount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-sm">Supplier:</span>
                        <p className="text-amber-200">{scanResult.data.bid.supplier?.name}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-neutral-400 text-sm">Submitted:</span>
                        <p className="text-amber-200">
                          {new Date(scanResult.data.bid.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleViewBid}
                    className="w-full px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Full Bid
                  </button>
                </div>
              )}

              {/* URL Result */}
              {scanResult.type === 'url' && (
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <h3 className="text-xl font-semibold text-amber-100">URL Found</h3>
                  </div>
                  
                  <p className="text-neutral-300 mb-4 break-all">{scanResult.data.url}</p>
                  
                  <button
                    onClick={() => window.open(scanResult.data.url, '_blank')}
                    className="w-full px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Link
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;