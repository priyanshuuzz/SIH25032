import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle, AlertTriangle, Scan } from 'lucide-react';
import { blockchainService, GuideVerification, ProductAuthenticity } from '../../lib/blockchain';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  scanType: 'guide' | 'product' | 'booking';
  onScanResult: (result: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, scanType, onScanResult }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (err) {
      setError('Camera access denied. Please enter QR code manually.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const handleManualVerification = async () => {
    if (!manualCode.trim()) {
      setError('Please enter a valid QR code');
      return;
    }

    await verifyCode(manualCode.trim());
  };

  const verifyCode = async (code: string) => {
    try {
      setError(null);
      let verificationResult = null;

      if (scanType === 'guide') {
        verificationResult = await blockchainService.verifyGuide(code);
        if (verificationResult) {
          setResult({
            type: 'guide',
            verified: true,
            data: verificationResult,
            message: `✅ Verified Government Tourist Guide`
          });
        } else {
          setResult({
            type: 'guide',
            verified: false,
            message: '❌ Guide not verified or invalid QR code'
          });
        }
      } else if (scanType === 'product') {
        verificationResult = await blockchainService.verifyProduct(code);
        if (verificationResult) {
          setResult({
            type: 'product',
            verified: true,
            data: verificationResult,
            message: `✅ Authentic Tribal Handicraft`
          });
        } else {
          setResult({
            type: 'product',
            verified: false,
            message: '❌ Product authenticity could not be verified'
          });
        }
      } else if (scanType === 'booking') {
        const bookingId = code.replace('BOOKING_', '');
        verificationResult = await blockchainService.verifyBooking(bookingId);
        if (verificationResult) {
          setResult({
            type: 'booking',
            verified: true,
            data: verificationResult,
            message: `✅ Booking Confirmed on Blockchain`
          });
        } else {
          setResult({
            type: 'booking',
            verified: false,
            message: '❌ Booking not found or invalid'
          });
        }
      }

      if (verificationResult) {
        onScanResult(verificationResult);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    }
  };

  // Simulate QR code detection (in production, use a proper QR scanner library)
  const simulateQRDetection = () => {
    const sampleCodes = {
      guide: 'GUIDE_G001_1703123456789',
      product: 'PRODUCT_P001_1703123456789',
      booking: 'BOOKING_B001_1703123456789'
    };
    
    verifyCode(sampleCodes[scanType]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Scan className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-semibold">
              Verify {scanType === 'guide' ? 'Guide' : scanType === 'product' ? 'Product' : 'Booking'}
            </h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-6">
          {!result ? (
            <>
              {/* Camera View */}
              <div className="relative mb-6">
                <div className="bg-gray-900 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                  {scanning ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm opacity-75">Camera not available</p>
                    </div>
                  )}
                </div>
                
                {/* Scanning Overlay */}
                <div className="absolute inset-4 border-2 border-emerald-400 rounded-lg">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400"></div>
                </div>
              </div>

              {/* Manual Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Or enter QR code manually:
                  </label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter QR code here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleManualVerification}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium"
                  >
                    Verify Code
                  </button>
                  <button
                    onClick={simulateQRDetection}
                    className="px-4 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 font-medium"
                  >
                    Demo
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </>
          ) : (
            /* Verification Result */
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                result.verified ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {result.verified ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                )}
              </div>

              <h4 className={`text-xl font-bold mb-2 ${
                result.verified ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </h4>

              {result.verified && result.data && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                  {result.type === 'guide' && (
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {result.data.name}</p>
                      <p><strong>Location:</strong> {result.data.location}</p>
                      <p><strong>ID:</strong> {result.data.guideId}</p>
                      <p><strong>Status:</strong> 
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Government Verified
                        </span>
                      </p>
                    </div>
                  )}
                  
                  {result.type === 'product' && (
                    <div className="space-y-2">
                      <p><strong>Product:</strong> {result.data.productName}</p>
                      <p><strong>Artisan:</strong> {result.data.artisanName}</p>
                      <p><strong>Location:</strong> {result.data.location}</p>
                      <p><strong>Craft Type:</strong> {result.data.craftType}</p>
                      <p><strong>Status:</strong> 
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Authentic Tribal Handicraft
                        </span>
                      </p>
                    </div>
                  )}

                  {result.type === 'booking' && (
                    <div className="space-y-2">
                      <p><strong>Booking ID:</strong> {result.data.bookingId}</p>
                      <p><strong>Service:</strong> {result.data.serviceType}</p>
                      <p><strong>Amount:</strong> ₹{result.data.amount}</p>
                      <p><strong>Status:</strong> 
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {result.data.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setResult(null);
                    setManualCode('');
                    setError(null);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium"
                >
                  Scan Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;