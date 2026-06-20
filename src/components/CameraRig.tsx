import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import gsap from "gsap";

/**
 * Moves the Three.js camera based on the current scroll‑derived depth.
 * The `depth` prop should be a number in world units (meters) – the same
 * value the `useDepth` hook returns.
 */
export const CameraRig: React.FC<{ depth: number }> = ({ depth }) => {
  const { camera } = useThree();

  useEffect(() => {
    // Animate the camera smoothly whenever the depth changes.
    // Duration 0.8 s provides a fluid dive feeling without jank.
    gsap.to(camera.position, {
      z: depth,
      duration: 0.8,
      ease: "power2.out",
    });
  }, [depth, camera]);

  return null; // This component does not render anything.
};
