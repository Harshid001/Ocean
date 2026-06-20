import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

/**
 * Sets up the Three.js fog and background based on the current depth zone.
 * The `ThemeProvider` updates the palette (including `background` and
 * `fogDensity`) whenever the zone changes, so this component reacts to those
 * values and applies them to the WebGL scene.
 */
export const OceanEnvironment: React.FC = () => {
  const { scene } = useThree();
  const { palette } = useTheme();

  useEffect(() => {
    // Apply fog – exponential fog works well for underwater depth.
    // The color is derived from the zone's background color.
    const fogColor = new THREE.Color(palette.background);
    scene.fog = new THREE.FogExp2(fogColor, Number(palette.fogDensity));
    // Set background to match fog colour for seamless transition.
    scene.background = fogColor;
    // Adjust ambient light intensity according to depth (deeper = dimmer).
    // This is a simple linear mapping; you can replace with more complex.
    scene.traverse(obj => {
      if (obj.type === "AmbientLight") {
        const light = obj as THREE.AmbientLight;
        // surface = 1, abyss = 0.3 (example)
        const intensity = THREE.MathUtils.lerp(1, 0.3, Number(palette.fogDensity));
        light.intensity = intensity;
      }
    });
  }, [scene, palette]);

  return null;
};
