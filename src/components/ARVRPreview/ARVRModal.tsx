import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, ZoomIn, ZoomOut, Move3D, Eye, Headphones } from 'lucide-react';

interface ARVRModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'destination' | 'product' | 'experience';
  previewData: {
    images: string[];
    video360?: string;
    arModel?: string;
    vrScene?: string;
    audioGuide?: string;
  };
}

const ARVRModal: React.FC<ARVRModalProps> = ({ isOpen, onClose, title, type, previewData }) => {
  const [currentMode, setCurrentMode] = useState<'360' | 'ar' | 'vr'>('360');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentImageIndex(0);
      setZoom(1);
      setRotation({ x: 0, y: 0 });
      setIsPlaying(false);
      setAudioPlaying(false);
    }
  }, [isOpen]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (currentMode === '360' && isPlaying) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setRotation({
        x: (y - 0.5) * 60,
        y: (x - 0.5) * 360
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600">Immersive AR/VR Preview</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Mode Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentMode('360')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  currentMode === '360'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                360° View
              </button>
              <button
                onClick={() => setCurrentMode('ar')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  currentMode === 'ar'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                AR Preview
              </button>
              <button
                onClick={() => setCurrentMode('vr')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  currentMode === 'vr'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                VR Experience
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 flex">
          {/* Preview Canvas */}
          <div className="flex-1 relative bg-black">
            {currentMode === '360' && (
              <div 
                className="w-full h-full relative overflow-hidden cursor-move"
                onMouseMove={handleMouseMove}
              >
                <img
                  src={previewData.images[currentImageIndex]}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-100"
                  style={{
                    transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                
                {/* 360 Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {previewData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute top-4 left-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
              </div>
            )}

            {currentMode === 'ar' && (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Move3D className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">AR Preview Mode</h3>
                  <p className="text-lg mb-6">Experience {title} in Augmented Reality</p>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md mx-auto">
                    <p className="text-sm mb-4">
                      Point your device camera to see {title} overlaid in your real environment
                    </p>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold">
                      Launch AR Camera
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentMode === 'vr' && (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">VR Experience</h3>
                  <p className="text-lg mb-6">Immerse yourself completely in {title}</p>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md mx-auto">
                    <p className="text-sm mb-4">
                      Put on your VR headset for a fully immersive experience of {title}
                    </p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold">
                      Launch VR Mode
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="w-80 bg-gray-50 p-6 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Controls</h3>
            
            {/* Zoom Controls */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${(zoom - 0.5) / 1.5 * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reset Controls */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setZoom(1);
                  setRotation({ x: 0, y: 0 });
                }}
                className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </button>
            </div>

            {/* Audio Guide */}
            {previewData.audioGuide && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Audio Guide</label>
                <button
                  onClick={() => setAudioPlaying(!audioPlaying)}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    audioPlaying
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  {audioPlaying ? 'Stop Audio' : 'Play Audio Guide'}
                </button>
              </div>
            )}

            {/* Information Panel */}
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3">About This {type}</h4>
              {type === 'destination' && (
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Interactive 360° panoramic views</p>
                  <p>• AR location overlay features</p>
                  <p>• VR immersive exploration</p>
                  <p>• Audio-guided virtual tours</p>
                </div>
              )}
              {type === 'product' && (
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• 3D product visualization</p>
                  <p>• AR try-before-buy experience</p>
                  <p>• Detailed craftsmanship view</p>
                  <p>• Cultural context information</p>
                </div>
              )}
              {type === 'experience' && (
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Virtual cultural immersion</p>
                  <p>• Interactive activity preview</p>
                  <p>• Traditional music and sounds</p>
                  <p>• Community interaction simulation</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-semibold">
                Book Now
              </button>
              <button className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 px-4 rounded-lg font-semibold">
                Add to Itinerary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARVRModal;