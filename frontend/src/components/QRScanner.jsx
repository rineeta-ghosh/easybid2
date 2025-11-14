import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRScanner = ({ onScan, onError, isActive = false }) => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [codeReader, setCodeReader] = useState(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    setCodeReader(reader);

    return () => {
      if (reader) {
        reader.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && codeReader) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => stopScanning();
  }, [isActive, codeReader, startScanning, stopScanning]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Start scanning
        codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
          if (result) {
            const qrData = result.getText();
            console.log('QR Code detected:', qrData);
            onScan(qrData);
            stopScanning(); // Stop after successful scan
          }
          
          if (error && error.name !== 'NotFoundException') {
            console.error('QR Scanner error:', error);
            setError('Error scanning QR code');
            onError?.(error);
          }
        });
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      setError('Camera access denied. Please allow camera permissions.');
      setIsScanning(false);
      onError?.(err);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    if (codeReader) {
      codeReader.reset();
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Camera Access Required</h3>
        <p className="text-sm text-red-600 text-center">
          Please allow camera access to scan QR codes. You may need to refresh the page and grant permissions.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-sm h-64 object-cover"
        />
        
        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 border-2 border-amber-400">
            <div className="absolute inset-4 border border-amber-400/50">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400"></div>
              
              {/* Scanning line animation */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-amber-400 animate-pulse"></div>
            </div>
            
            {/* Status text */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                Scanning for QR code...
              </div>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {!isScanning && isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
              <div className="text-sm">Starting camera...</div>
            </div>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      {isActive && !error && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-amber-700">
              <p className="font-medium mb-1">How to scan:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Position the QR code within the scanning area</li>
                <li>Hold your device steady</li>
                <li>Ensure good lighting</li>
                <li>The code will be detected automatically</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;