import React, { useRef, useEffect, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import gsap from "gsap";

/**
 * The final "abyss chest" that reveals the contact form.
 * It renders a simple box with an emissive material that lights up on hover.
 * Clicking it opens a full‑screen contact overlay.
 */
export const ContactChest: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();

  const handleHover = useCallback(() => {
    gsap.to(meshRef.current.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.2, ease: "power1.out" });
    (meshRef.current.material as any).emissiveIntensity = 2.0;
  }, []);

  const handleLeave = useCallback(() => {
    gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.2, ease: "power1.out" });
    (meshRef.current.material as any).emissiveIntensity = 0.8;
  }, []);

  const handleClick = useCallback(() => {
    // Light explosion effect – spawn particles (simplified here)
    const particles = new THREE.Group();
    meshRef.current.parent?.add(particles);
    for (let i = 0; i < 30; i++) {
      const p = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 6, 6),
        new THREE.MeshBasicMaterial({ color: "#FBBF24" })
      );
      p.position.copy(meshRef.current.position);
      particles.add(p);
      gsap.to(p.position, {
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * 2,
        z: (Math.random() - 0.5) * 2,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => particles.remove(p),
      });
    }
    onOpen();
  }, [onOpen]);

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[0, -0.5, -5] as any}
        onPointerOver={handleHover}
        onPointerOut={handleLeave}
        onClick={handleClick}
        role="button"
        aria-label="Open contact form"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        {/* Simple chest shape – a box with a lid */}
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial
          color="var(--ui-primary)"
          emissive="var(--ui-accent)"
          emissiveIntensity={0.8}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Optional HTML overlay showing a hint while fog is heavy */}
      <Html position={[0, 0, -5] as any} center distanceFactor={2} style={{ pointerEvents: "none" }}>
        <div style={{ color: "var(--ui-accent)", fontFamily: "var(--font-primary)" }}>
          Click to contact
        </div>
      </Html>
    </group>
  );
};
