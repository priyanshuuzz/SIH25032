import React, { useState } from 'react';
import { Shield, Scan, Package, User, Calendar, QrCode } from 'lucide-react';
import QRScanner from '../QRScanner/QRScanner';

const VerificationPortal = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanType, setScanType] = useState<'guide' | 'product' | 'booking'>('guide');
  const [verificationHistory, setVerificationHistory] = useState<any[]>([]);

  const handleScanResult = (result: any) => {
    setVerificationHistory(prev => [
      {
        id: Date.now(),
        type: scanType,
        result,
        timestamp: new Date().toLocaleString()
      },
      ...prev.slice(0, 4) // Keep only last 5 results
    ]);
  };

  const openScanner = (type: 'guide' | 'product' | 'booking') => {
    setScanType(type);
    setScannerOpen(true);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <span className="text-blue-600 font-semibold text-lg">Blockchain Verification</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trust Through Technology
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Verify guides, authenticate products, and confirm bookings using our tamper-proof blockchain system
          </p>
        </div>

        {/* Verification Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Guide Verification */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Verify Tourist Guide</h3>
            <p className="text-gray-600 mb-6">
              Scan QR code to verify if your guide is government-registered and certified
            </p>
            <div className="space-y-3">
              <button
                onClick={() => openScanner('guide')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center"
              >
                <Scan className="w-5 h-5 mr-2" />
                Scan Guide QR
              </button>
              <div className="text-sm text-gray-500">
                ✅ Government Verified<br/>
                ✅ Certified & Licensed<br/>
                ✅ Tamper-Proof Record
              </div>
            </div>
          </div>

          {/* Product Authenticity */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Verify Product Authenticity</h3>
            <p className="text-gray-600 mb-6">
              Confirm the authenticity of tribal handicrafts and local products
            </p>
            <div className="space-y-3">
              <button
                onClick={() => openScanner('product')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center"
              >
                <Scan className="w-5 h-5 mr-2" />
                Scan Product QR
              </button>
              <div className="text-sm text-gray-500">
                ✅ Authentic Tribal Craft<br/>
                ✅ Verified Artisan<br/>
                ✅ Origin Guaranteed
              </div>
            </div>
          </div>

          {/* Booking Verification */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Verify Booking</h3>
            <p className="text-gray-600 mb-6">
              Confirm your booking details stored securely on blockchain
            </p>
            <div className="space-y-3">
              <button
                onClick={() => openScanner('booking')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center"
              >
                <Scan className="w-5 h-5 mr-2" />
                Verify Booking
              </button>
              <div className="text-sm text-gray-500">
                ✅ Immutable Record<br/>
                ✅ Transparent Status<br/>
                ✅ Fraud Prevention
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Blockchain Verification Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Registration</h4>
              <p className="text-gray-600 text-sm">Government registers guides/products on blockchain</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">QR Generation</h4>
              <p className="text-gray-600 text-sm">Unique QR code created for each verified entity</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Tourist Scans</h4>
              <p className="text-gray-600 text-sm">You scan QR code using our app</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Verification</h4>
              <p className="text-gray-600 text-sm">Blockchain confirms authenticity in seconds</p>
            </div>
          </div>
        </div>

        {/* Recent Verifications */}
        {verificationHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Verifications</h3>
            <div className="space-y-4">
              {verificationHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      item.type === 'guide' ? 'bg-blue-100' :
                      item.type === 'product' ? 'bg-emerald-100' : 'bg-purple-100'
                    }`}>
                      {item.type === 'guide' ? <User className="w-5 h-5 text-blue-600" /> :
                       item.type === 'product' ? <Package className="w-5 h-5 text-emerald-600" /> :
                       <Calendar className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{item.type} Verification</p>
                      <p className="text-sm text-gray-600">{item.timestamp}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.result.verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.result.verified ? 'Verified' : 'Not Verified'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Blockchain Verification?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Tamper-Proof</h4>
              <p className="text-gray-600">Records cannot be altered or faked once stored on blockchain</p>
            </div>
            <div className="text-center">
              <QrCode className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Instant Verification</h4>
              <p className="text-gray-600">Get verification results in seconds with QR code scanning</p>
            </div>
            <div className="text-center">
              <User className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Government Backed</h4>
              <p className="text-gray-600">All verifications are backed by Jharkhand Tourism Department</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        scanType={scanType}
        onScanResult={handleScanResult}
      />
    </section>
  );
};

export default VerificationPortal;