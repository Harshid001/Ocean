import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import FocusLock from "react-focus-lock";

interface TreasureModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when the user closes the modal */
  onClose: () => void;
  /** Optional React node to render inside the modal */
  children?: React.ReactNode;
}

/**
 * Modal that appears when a 3D treasure chest is opened.
 * Uses GSAP for fade‑in/out and supports focus trapping for accessibility.
 */
export const TreasureModal: React.FC<TreasureModalProps> = ({ open, onClose, children }) => {
  const overlayRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (!open) return;
    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );
    return () => {
      tl.kill();
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <FocusLock>
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        className="treasure-modal"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
        onClick={e => {
          // close when clicking outside content area
          if (e.target === overlayRef.current) onClose();
        }}
      >
        <div
          style={{
            background: "var(--ui-background)",
            border: "1px solid var(--ui-accent)",
            borderRadius: "0.75rem",
            padding: "2rem",
            maxWidth: "90%",
            maxHeight: "80%",
            overflowY: "auto",
            backdropFilter: "blur(8px)",
          }}
        >
          {children}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "var(--ui-accent)",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </FocusLock>,
    document.body
  );
};
