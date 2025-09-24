import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface ARVRViewerProps {
  mode: '360' | 'ar' | 'vr';
  imageUrl: string;
  onInteraction?: (data: any) => void;
}

const SphereViewer = ({ imageUrl }: { imageUrl: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (loadedTexture) => {
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.repeat.x = -1;
      setTexture(loadedTexture);
    });
  }, [imageUrl]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

const ARVRViewer: React.FC<ARVRViewerProps> = ({ mode, imageUrl, onInteraction }) => {
  const [isVRMode, setIsVRMode] = useState(false);

  const handleVRToggle = () => {
    setIsVRMode(!isVRMode);
    if (onInteraction) {
      onInteraction({ type: 'vr_toggle', enabled: !isVRMode });
    }
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        style={{ background: '#000' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 0.1]} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={0.5}
        />
        
        {mode === '360' && <SphereViewer imageUrl={imageUrl} />}
        
        {mode === 'ar' && (
          <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh position={[0, 0, -5]}>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          </>
        )}
        
        {mode === 'vr' && (
          <>
            <Environment preset="sunset" />
            <SphereViewer imageUrl={imageUrl} />
            <ambientLight intensity={0.3} />
          </>
        )}
      </Canvas>

      {/* VR Controls */}
      {mode === 'vr' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleVRToggle}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isVRMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isVRMode ? 'Exit VR' : 'Enter VR'}
          </button>
        </div>
      )}

      {/* AR Overlay */}
      {mode === 'ar' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 bg-black/50 text-white p-3 rounded-lg">
            <p className="text-sm">AR Mode Active</p>
            <p className="text-xs opacity-80">Move device to explore</p>
          </div>
          
          {/* AR Markers */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 border-2 border-white rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ARVRViewer;