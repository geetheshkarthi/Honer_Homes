# Honer Homes — Luxury Architectural Walkthrough

A premium, interactive real-estate web application designed to showcase a luxury residential township through a high-performance, frame-scrubbed 3D walkthrough experience.

---

## 🌟 Visual & Interactive Features

- **1000-Frame Cinematic Walkthrough:** Leverages canvas-based rendering to smooth-scrub a 1000-frame 3D walkthrough video as the user scrolls, creating a premium and alive interactive presentation.
- **15-Section Dynamic Narrative:** Seamlessly transitions through 15 key amenity cards mapped to exact timeline frame ranges:
  - **Overview (Hero View):** Elegant overlay header with floating mouse scroll animation.
  - **Towers & Location:** Frame range 59–84 (Soaring towers perspective).
  - **Retail Boulevard:** Frame range 123–160 (High-street shopping arcade).
  - **Welcome Gate:** Frame range 180–215 (Grand royal entrance).
  - **Smart Parking:** Frame range 240–269 (Subterranean vehicle concierge).
  - **Luxury Interiors:** Frame range 273–458 (Curated art of interior rooms).
  - **Private Balcony:** Frame range 460–500 (Double-height private balcony).
  - **Private Sun Deck:** Frame range 512–575 (Panoramic city vistas).
  - **Adventure Park:** Frame range 576–660 (Children's play park).
  - **Meditation Courtyard:** Frame range 663–740 (Courtyard exercise & open lawns).
  - **Infinity Pool:** Frame range 750–815 (Infinity-edge swimming pool).
  - **Fitness Gym:** Frame range 817–840 (State-of-the-art health club).
  - **Mini Theater:** Frame range 842–859 (Private cinema screen).
  - **Temple Sanctuary:** Frame range 860–876 (Sacred zen temple sanctuary).
  - **Skyline Outro:** Frame range 890–995 (Final skyline with Floor Plan CTA).
- **Premium Glassmorphic Design:** Standardized intermediate detail cards styled with a high-transparency overlay (`rgba(10, 10, 12, 0.45)`), massive backdrop blur filter (`40px`), and custom text drop-shadows to ensure high legibility on any moving video background.
- **Blueprint Room Inspector:** Interactive blueprint layout under the **Architectural Blueprints** section. Users can hover over individual rooms (2 BHK, 3 BHK, 4 BHK) on the blueprint layout maps to inspect dimensions and structural specifications dynamically.
- **Seamless Section Transitions:** Custom GSAP ScrollTrigger unpinning coordinates to transition smoothly from the skyline outro section directly into the floor plans segment, eliminating empty bottom scroll gaps.
- **Floating Dot Navigator:** A custom floating dot indicator that updates highlight state relative to walkthrough progression, allowing clicking on any dot to smooth-scroll directly to the exact timeline midpoint of that amenity.

---

## 🛠️ Technology Stack

- **Core Structure:** HTML5 Semantic Markup & Canvas API
- **Design System:** Custom CSS (Modern typography, HSL tailored color palette, glassmorphism, responsive grid & flexbox layouts, micro-animations)
- **Animation Engine:** GreenSock Animation Platform (GSAP) & ScrollTrigger plugin
- **Asset Optimization:** WebP image sequence (1000 frames) compressed for fast loading
- **Iconography:** FontAwesome 6 (Pro icons and brands)

---

## 🚀 Local Development Setup

To run this application locally without CORS blocking, you must use a local server:

1. Clone or download the repository files.
2. Open your terminal in the directory and run a local HTTP server. For example, using Python:
   ```bash
   python -m http.server 8000
   ```
3. Open your web browser and navigate to:
   ```
   http://localhost:8000
   ```
4. The page will load the preloader, cache the 1000 cinematic frames in RAM, and start the immersive scroll-based walkthrough.
