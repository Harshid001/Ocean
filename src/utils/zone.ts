/**
 * Utility helpers for depth‑zone calculations.
 * These are pure TypeScript functions used by hooks and components.
 */

export type Zone = "surface" | "reef" | "life" | "twilight" | "deep" | "abyss";

/** Map a numeric depth (meters) to a named zone. */
export const depthToZone = (depth: number): Zone => {
  if (depth < 20) return "surface";
  if (depth < 100) return "reef";
  if (depth < 300) return "life";
  if (depth < 1000) return "twilight";
  if (depth < 1500) return "deep";
  return "abyss";
};

/** Linear interpolation helper. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
