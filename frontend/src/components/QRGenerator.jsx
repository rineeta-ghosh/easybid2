import React, { useState } from 'react'

const QRGenerator = ({ tender, onGenerate, isLoading = false }) => {
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/qr/tender/${tender._id}/generate`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      setQrData(data);
      onGenerate?.(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = () => {
    if (qrData?.qrUrl) {
      const link = document.createElement('a');
      link.href = qrData.qrUrl;
      link.download = `tender-${tender._id}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-amber-100">QR Code Generator</h3>
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      </div>

      <div className="space-y-4">
        {/* Tender Info */}
        <div className="p-4 bg-black/20 rounded-lg">
          <h4 className="text-amber-200 font-medium mb-2">{tender.title}</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-neutral-300">
            <div>Category: {tender.category}</div>
            <div>Status: {tender.status}</div>
            <div>Budget: ${tender.budget?.toLocaleString() || 'N/A'}</div>
            <div>Deadline: {new Date(tender.deadline).toLocaleDateString()}</div>
          </div>
        </div>

        {/* QR Code Generation */}
        {!qrData ? (
          <div className="text-center">
            <p className="text-neutral-400 text-sm mb-4">
              Generate a QR code for this tender to enable easy mobile access and sharing.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Generate QR Code
                </>
              )}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            {/* QR Code Display */}
            <div className="inline-block p-4 bg-white rounded-lg">
              <img
                src={qrData.qrUrl}
                alt="Tender QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            {/* Success Message */}
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                QR Code Generated Successfully
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
              
              <button
                onClick={() => {
                  navigator.share({
                    title: `Tender: ${tender.title}`,
                    text: `Check out this tender: ${tender.title}`,
                    url: window.location.href,
                  }).catch(() => {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(window.location.href);
                  });
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            </div>

            {/* QR Code Info */}
            <div className="text-left p-4 bg-black/20 rounded-lg">
              <h5 className="text-amber-200 font-medium mb-2">QR Code Information:</h5>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>• Contains tender details and direct link</li>
                <li>• Can be scanned by any QR code reader</li>
                <li>• Includes mobile-optimized tender view</li>
                <li>• Automatically embedded in PDF documents</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default QRGenerator;