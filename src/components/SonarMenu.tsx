import React, { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import gsap from "gsap";

type ZoneInfo = {
  name: string;
  depth: number; // target depth in meters
  icon: string; // URL or imported SVG as texture
};

type SonarMenuProps = {
  zones: ZoneInfo[];
  onSelect: (depth: number) => void;
  radius?: number;
};

/**
 * Radial sonar navigation menu – three concentric rings with clickable sectors.
 * Each sector is an invisible mesh that receives pointer events.
 * The visual ring uses a transparent material so the scene behind remains visible.
 */
export const SonarMenu: React.FC<SonarMenuProps> = ({
  zones,
  onSelect,
  radius = 1.2,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  // Keep menu fixed in front of the camera
  useFrame(() => {
    if (!groupRef.current) return;
    const camPos = camera.position.clone();
    groupRef.current.position.set(camPos.x, camPos.y, camPos.z - 2);
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  const handleSectorClick = useCallback(
    (depth: number) => {
      // Animate camera to the selected depth
      gsap.to(camera.position, {
        z: depth,
        duration: 1,
        ease: "power2.out",
      });
      onSelect(depth);
    },
    [camera, onSelect]
  );

  // Helper to calculate sector angles
  const sectorAngle = (2 * Math.PI) / zones.length;

  return (
    <group ref={groupRef}>
      {zones.map((zone, i) => {
        const start = i * sectorAngle;
        const end = start + sectorAngle;
        const mid = (start + end) / 2;
        // Build a simple shape – half‑ring sector using a custom geometry
        const geometry = new THREE.RingGeometry(radius - 0.2, radius, 64, 1, start, sectorAngle);
        const material = new THREE.MeshBasicMaterial({
          color: "var(--ui-accent)",
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
        });

        // Hover animation – subtle pulse
        const onHover = () => {
          gsap.to(material, { opacity: 0.9, duration: 0.3 });
          gsap.to(material.color, { r: 1, g: 1, b: 1, duration: 0.3 });
        };
        const onLeave = () => {
          gsap.to(material, { opacity: 0.6, duration: 0.3 });
          gsap.to(material.color, { r: 0.5, g: 0.5, b: 0.5, duration: 0.3 });
        };

        return (
          <mesh
            key={zone.name}
            geometry={geometry}
            material={material}
            onPointerOver={onHover}
            onPointerOut={onLeave}
            onClick={() => handleSectorClick(zone.depth)}
            role="button"
            aria-label={`Go to ${zone.name}`}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") handleSectorClick(zone.depth);
            }}
          >
            {/* Optional icon label – rendered as HTML for crispness */}
            <Html
              position={[Math.cos(mid) * radius, Math.sin(mid) * radius, 0] as any}
              center
              style={{ pointerEvents: "none" }}
            >
              <span style={{ color: "var(--ui-primary)" }}>{zone.name}</span>
            </Html>
          </mesh>
        );
      })}
    </group>
  );
};
