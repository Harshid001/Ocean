import React, { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import gsap from "gsap";

export type InfoCardProps = {
  /** Title displayed in the card */
  title: string;
  /** Short description or excerpt */
  description: string;
  /** Called when the card is activated (click or enter) */
  onSelect: () => void;
  /** World position where the card should float */
  position: [number, number, number];
  /** Show an HTML overlay instead of 3D text when fog density > 0.15 */
  forceHtmlOverlay?: boolean;
};

/**
 * Floating information card that lives in the 3D world.
 * Uses a plane mesh for the background and an <Html> overlay for text.
 * Hover/focus triggers a subtle scale‑up and emissive glow.
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  onSelect,
  position,
  forceHtmlOverlay = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();

  // Ensure the card always faces the camera
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.lookAt(camera.position);
  });

  // Interaction handlers – shared for mouse and keyboard
  const handleEnter = useCallback(() => {
    // GSAP hover animation – scale + emissive increase
    gsap.to(meshRef.current.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 0.2,
      ease: "power1.out",
    });
    (meshRef.current.material as any).emissiveIntensity = 1.2;
  }, []);

  const handleLeave = useCallback(() => {
    gsap.to(meshRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.2,
      ease: "power1.out",
    });
    (meshRef.current.material as any).emissiveIntensity = 0.8;
  }, []);

  const handleClick = useCallback(() => {
    onSelect();
  }, [onSelect]);

  // Accessibility – expose a hidden button that mirrors the mesh behavior
  const buttonId = `info-card-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position as any}
        onPointerOver={handleEnter}
        onPointerOut={handleLeave}
        onClick={handleClick}
        // make the mesh focusable via a proxy "button" (see below)
        aria-labelledby={buttonId}
        role="button"
        tabIndex={0}
        onFocus={handleEnter}
        onBlur={handleLeave}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        {/* Simple plane – color comes from the theme (CSS var) */}
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial
          color={"var(--ui-primary)"}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* HTML overlay – shown when fog is heavy or forced */}
      {(forceHtmlOverlay || (document.documentElement.dataset.zone &&
        Number(document.documentElement.dataset.fogDensity) > 0.15)) && (
        <Html
          position={position as any}
          center
          distanceFactor={2}
          style={{ pointerEvents: "none" }}
        >
          <div className="info-card" id={buttonId}>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </Html>
      )}
    </group>
  );
};
