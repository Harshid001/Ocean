import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useDepth } from "../hooks/useDepth";

/**
 * Simple HUD that shows the current depth in meters.
 * It is rendered as an HTML overlay anchored to the bottom‑left corner.
 */
export const DepthHUD: React.FC = () => {
  const { depth, zone } = useDepth();

  // Update a live‑region for screen readers
  useEffect(() => {
    const el = document.getElementById("depthLive");
    if (el) el.textContent = `Depth ${Math.round(depth)} meters – ${zone}`;
  }, [depth, zone]);

  // Optional: animate a visual bar based on depth (GSAP example)
  useEffect(() => {
    const bar = document.getElementById("depthBar");
    if (bar) {
      gsap.to(bar, { height: `${(depth / 1200) * 100}%`, duration: 0.3, ease: "power1.out" });
    }
  }, [depth]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        color: "var(--ui-text)",
        fontFamily: "var(--font-primary)",
        fontSize: "0.9rem",
        zIndex: 50,
      }}
    >
      <div id="depthLive" className="sr-only" aria-live="polite" />
      <div style={{ width: "6px", height: "80px", background: "rgba(255,255,255,0.2)", position: "relative" }}>
        <div
          id="depthBar"
          style={{
            width: "100%",
            height: "0%",
            background: "var(--ui-accent)",
          }}
        />
      </div>
      <div>{Math.round(depth)} m</div>
    </div>
  );
};
