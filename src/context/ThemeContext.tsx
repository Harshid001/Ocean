import React, { createContext, useContext, ReactNode, useMemo } from "react";

/**
 * Palette definitions per depth zone. Values are taken from the design system
 * (see DESIGN_SYSTEM.md). They can be overridden at runtime by updating the
 * CSS custom properties on the <html> element.
 */
export const zonePalettes = {
  surface: {
    primary: "#00B4D8",
    secondary: "#0077B6",
    accent: "#90E0EF",
    background: "#E0F7FA",
    text: "#001D3D",
    fogDensity: 0.02,
  },
  reef: {
    primary: "#FF6F61",
    secondary: "#FFB400",
    accent: "#FFEA00",
    background: "#FFF5E1",
    text: "#003566",
    fogDensity: 0.05,
  },
  life: {
    primary: "#4B8B3B",
    secondary: "#6C9A8B",
    accent: "#80FFDB",
    background: "#E8F5E9",
    text: "#001D3D",
    fogDensity: 0.10,
  },
  twilight: {
    primary: "#2C3E50",
    secondary: "#34495E",
    accent: "#90E0EF",
    background: "#1A252F",
    text: "#ECF0F1",
    fogDensity: 0.18,
  },
  deep: {
    primary: "#001D3D",
    secondary: "#0A3D62",
    accent: "#80FFDB",
    background: "#000A12",
    text: "#F1F8E9",
    fogDensity: 0.25,
  },
  abyss: {
    primary: "#8B5CF6",
    secondary: "#5B21B6",
    accent: "#FBBF24",
    background: "#1E1B4B",
    text: "#FFFFFF",
    fogDensity: 0.30,
  },
} as const;

export type Zone = keyof typeof zonePalettes;

interface ThemeContextProps {
  zone: Zone;
  palette: typeof zonePalettes[Zone];
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({
  zone = "surface",
  children,
}: { zone?: Zone; children: ReactNode }) => {
  const palette = useMemo(() => zonePalettes[zone], [zone]);
  // expose palette via CSS variables for non‑React parts (Three.js shaders)
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.zone = zone;
    Object.entries(palette).forEach(([key, value]) => {
      // numeric fogDensity is stored as a CSS variable as well
      const cssKey = `--ui-${key}`;
      root.style.setProperty(cssKey, String(value));
    });
  }, [zone, palette]);

  return (
    <ThemeContext.Provider value={{ zone, palette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
