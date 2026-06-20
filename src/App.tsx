import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ThemeProvider } from "./context/ThemeContext";
import { useDepth } from "./hooks/useDepth";
import { InfoCard } from "./components/InfoCard";
import { SonarMenu } from "./components/SonarMenu";
import { DepthHUD } from "./components/DepthHUD";
import { TreasureModal } from "./components/TreasureModal";
import { ContactChest } from "./components/ContactChest";

/**
 * Demo application that wires the underwater UI kit together.
 * Scroll the page (or use the mouse wheel) to dive deeper – the
 * `useDepth` hook maps scroll progress to a depth value, which drives
 * the ThemeProvider zone, the camera position, and the HUD.
 */
export const App: React.FC = () => {
  const { depth, zone } = useDepth();
  const [contactOpen, setContactOpen] = useState(false);

  // Example zones for SonarMenu – you can extend this array.
  const sonarZones = [
    { name: "Surface", depth: 0, icon: "" },
    { name: "Reef", depth: 50, icon: "" },
    { name: "Life", depth: 200, icon: "" },
    { name: "Twilight", depth: 600, icon: "" },
    { name: "Deep", depth: 1200, icon: "" },
    { name: "Abyss", depth: 1800, icon: "" },
  ];

  return (
    <ThemeProvider zone={zone as any}>
      {/* The Canvas takes the whole viewport */}
      <Canvas camera={{ position: [0, 0, depth], near: 0.1, far: 5000 }}>
        {/* Add lighting for a basic look */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />

        {/* Demo floating card */}
        <InfoCard
          title="Our Story"
          description="Dive into the oceanic narrative"
          position={[0, 1, -5]}
          onSelect={() => console.log("InfoCard selected")}
        />

        {/* Sonar navigation menu */}
        <SonarMenu zones={sonarZones} onSelect={(d: number) => console.log("Navigate to", d)} />

        {/* Contact chest that opens the modal */}
        <ContactChest onOpen={() => setContactOpen(true)} />
      </Canvas>

      {/* HUD and modal are regular React components */}
      <DepthHUD />
      <TreasureModal open={contactOpen} onClose={() => setContactOpen(false)}>
        <h2>Contact Us</h2>
        <form>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" required />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required />
          <button type="submit">Send</button>
        </form>
      </TreasureModal>
    </ThemeProvider>
  );
};
