## Design System: The Deep Dive

### Pattern
- **Name:** Scroll-Triggered Storytelling
- **Conversion Focus:** Narrative increases time-on-page 3x. Use progress indicator. Mobile: simplify animations.
- **CTA Placement:** End of each chapter (mini) + Final climax CTA
- **Color Strategy:** Progressive reveal. Each chapter has distinct color. Building intensity.
- **Sections:** 1. Intro hook, 2. Chapter 1 (problem), 3. Chapter 2 (journey), 4. Chapter 3 (solution), 5. Climax CTA

### Style
- **Name:** Spatial UI (VisionOS)
- **Keywords:** Glass, depth, immersion, spatial, translucent, gaze, gesture, apple, vision-pro
- **Best For:** Spatial computing apps, VR/AR interfaces, immersive media, futuristic dashboards
- **Performance:** ⚠ Moderate (blur cost) | **Accessibility:** ⚠ Contrast risks

### Colors
| Role | Hex |
|------|-----|
| Primary | #7C2D12 |
| Secondary | #B91C1C |
| CTA | #CA8A04 |
| Background | #FEF2F2 |
| Text | #450A0A |

*Notes: Deep burgundy + craft gold*

### Typography
- **Heading:** Inter
- **Body:** Inter
- **Mood:** Spatial + Readable typography

### Key Effects
Parallax depth, dynamic lighting response, gaze-hover effects, smooth scale on focus

### Avoid (Anti-patterns)
- 2D design
- No spatial depth

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
