"use client"
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function RobotModel() {
  const groupRef = useRef();
  const headRef = useRef();
  const bodyRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  // Animate the robot - subtle movements (throttled for performance)
  let lastUpdate = 0;
  useFrame((state) => {
    const now = performance.now();
    // Throttle to 30fps instead of 60fps
    if (now - lastUpdate < 33) return;
    lastUpdate = now;
    
    if (groupRef.current) {
      // Very subtle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    if (headRef.current) {
      // Minimal head movement
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
    if (leftArmRef.current) {
      // Arms in presentation pose - slight movement
      leftArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 0.2;
      leftArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 0.2;
      rightArmRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head - More rounded, sleek design */}
      <group ref={headRef} position={[0, 2.5, 0]}>
        <mesh>
          <boxGeometry args={[1.1, 1.2, 1.1]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            metalness={0.95} 
            roughness={0.05}
            emissive="#000000"
          />
        </mesh>
        {/* Eyes - Subtle white reflections */}
        <mesh position={[-0.25, 0.15, 0.56]}>
          <boxGeometry args={[0.15, 0.1, 0.05]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.25, 0.15, 0.56]}>
          <boxGeometry args={[0.15, 0.1, 0.05]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Body - Sleek, dark design */}
      <mesh ref={bodyRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 2.2, 0.9]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#000000"
        />
      </mesh>

      {/* Left Arm - Raised in presentation pose */}
      <group ref={leftArmRef} position={[-1.3, 0.8, 0.2]}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.35, 1.2, 0.35]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            metalness={0.95} 
            roughness={0.05}
          />
        </mesh>
        {/* Hand - Open, presenting */}
        <mesh position={[0, -1.4, 0]}>
          <boxGeometry args={[0.5, 0.4, 0.5]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            metalness={0.95} 
            roughness={0.05}
          />
        </mesh>
      </group>

      {/* Right Arm - Raised in presentation pose */}
      <group ref={rightArmRef} position={[1.3, 0.8, 0.2]}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.35, 1.2, 0.35]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            metalness={0.95} 
            roughness={0.05}
          />
        </mesh>
        {/* Hand - Open, presenting */}
        <mesh position={[0, -1.4, 0]}>
          <boxGeometry args={[0.5, 0.4, 0.5]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            metalness={0.95} 
            roughness={0.05}
          />
        </mesh>
      </group>

      {/* Legs - Only upper part visible */}
      <mesh position={[-0.45, -1.2, 0]}>
        <boxGeometry args={[0.45, 0.8, 0.45]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.95} 
          roughness={0.05}
        />
      </mesh>
      <mesh position={[0.45, -1.2, 0]}>
        <boxGeometry args={[0.45, 0.8, 0.45]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.95} 
          roughness={0.05}
        />
      </mesh>
    </group>
  );
}

export default function Robot3D({ className = "" }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 2.5, 7], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), 0);
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 2.5, 7]} />
        
        {/* Lighting - Soft, minimal lighting for dark aesthetic */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-5, 8, -5]} intensity={0.4} />
        <directionalLight position={[0, 10, 0]} intensity={0.6} />
        
        {/* Robot Model */}
        <RobotModel />
        
        {/* Controls - Subtle interaction */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={12}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}

