import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook that synchronises scroll position with a simulated ocean depth.
 * Returns the current depth (in meters) and the active zone name.
 */
export const useDepth = (maxDepth = 1200) => {
  const [depth, setDepth] = useState(0);
  const [zone, setZone] = useState<string>("surface");

  useEffect(() => {
    const update = (self: any) => {
      const d = gsap.utils.mapRange(0, 1, 0, maxDepth, self.progress);
      setDepth(d);
      // Determine zone thresholds – these match the CSS variables
      if (d < 20) setZone("surface");
      else if (d < 100) setZone("reef");
      else if (d < 300) setZone("life");
      else if (d < 1000) setZone("twilight");
      else if (d < 1500) setZone("deep");
      else setZone("abyss");
    };

    const st = ScrollTrigger.create({
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: update,
    });

    return () => st.kill();
  }, [maxDepth]);

  return { depth, zone };
};
