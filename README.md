# Interactive Plant Cell Scrollytelling Experience — Minimalist & Didactic 3D

An interactive, high-performance 3D web presentation created collaboratively by **Angel Estrada** and his daughter **Luna María Estrada Nieto** for her **Ciencias (Science)** class at **Escuela Secundaria Federal #60** (Group **1° "D"**). This is a school science project built exclusively for **educational and didactic purposes**. An AI Large Language Model (LLM) was utilized throughout the development process as a learning and educational tool.

* **Authors & Developers:** Angel Estrada & Luna María Estrada Nieto
* **Student Presenter:** Luna María Estrada Nieto
* **Grade & Group:** 1° "D"
* **School:** Escuela Secundaria Federal #60
* **Subject:** Ciencias (Biology / Natural Sciences)
* **Target Audience:** Middle School / Secondary Education (12-year-old students)
* **Educational Purpose:** School project designed strictly for non-commercial didactic and educational learning
* **AI Tooling Disclosure:** Developed with the educational assistance of a Large Language Model (LLM) for pair programming and pedagogy

---

## 🌟 Key Features

1. **Strict 100% Light Mode & White Studio Canvas:**
   - Designed exclusively for daylight classrooms and educational projectors on a clean, bright white background (`#ffffff`).
   - Zero dark mode toggles or fallbacks, ensuring total aesthetic consistency and crisp readability.

2. **Physical Craft "Foamy" (EVA Foam) Materials & Zero Neon:**
   - Eradicates all sci-fi neon glows, emissive blooms, and laser lighting.
   - Every organelle is rendered with high-roughness physical PBR materials (`roughness: 0.75 - 0.85`, `metalness: 0.0`) recreating the tactile, vivid cutouts of EVA foam (foamy) from Luna's handcrafted diorama.

3. **Accurate Craft Color Palette from Luna's Model (Rich Saturated Contrast):**
   - **Hexagonal Prism Cell Wall:** Forest-green foamy walls (`#15803d`) with emerald-green rim (`#22c55e`) and deep teal corner tabs (`#0f766e`).
   - **Cytoplasm Floor:** Vivid grass-green foamy base (`#16a34a`).
   - **Nucleus & Nucleolus:** Deep golden amber cylinder cutaway (`#d97706` / `#b45309`) with a solid crimson nucleolus core (`#b91c1c`).
   - **Central Vacuole:** Vibrant cerulean blue foam body (`#0284c7`) with a deep royal navy base outline (`#1e3a8a`).
   - **Mitochondria:** Deep magenta foam capsules (`#be185d`) with vivid rose-pink cristae folds (`#f472b6`).
   - **Chloroplasts:** Dark pine green foam discs (`#14532d`) with saturated lime ridge bands (`#22c55e`).
   - **Golgi Apparatus:** Warm tangerine orange foam layers (`#c2410c`) with budding transport vesicles.
   - **Endoplasmic Reticulum:** Royal purple folded foam ribbons (`#6d28d9`) surrounding the nucleus.
   - **Ribosomes:** Vibrant scarlet red foam beads (`#b91c1c`).
   - **Amyloplast:** Deep violet coiled foam roll (`#581c87`) with purple core (`#9333ea`).
   - **Peroxisome:** Deep pine teal foam sphere (`#0f766e`) with turquoise collar ring (`#14b8a6`).

4. **Dynamic Selective Transparency on Focus:**
   - When any organelle is selected/focused, all inactive organelles automatically become translucent (`opacity: 0.14 - 0.22`), leaving an elegant structural silhouette.
   - The active organelle remains 100% solid and opaque (`opacity: 1.0`), illuminated with neutral white spotlighting (`0xffffff`) for maximum visual contrast.
   - In overview, hero, or quiz stages, all organelles automatically return to 100% solid opacity.

5. **Smooth Macro-to-Micro 3D Flight (Plant to Cell Zoom):**
   - Starts with a stylized potted botanical plant with terracotta pot and leafy green foliage.
   - Scrolling triggers a smooth microscope flight traveling through the leaf tissue directly into the cellular interior.

6. **Universal Responsive Architecture (Tablets & Smartphones):**
   - **Compact by Default:** On mobile and tablet devices, HUD cards open in compact mode (`is-compact`), keeping over 85% of the screen free to rotate and explore the 3D cell.
   - **Full Expand without Scroll:** Tapping the card expands it with ample vertical room (`max-height: min(72dvh, 560px)`), allowing students to read the full summary, bullet points, and fun fact without needing internal scrolling.
   - **One-Tap Peek:** Quick toggle between full educational text and unobstructed 3D viewing.

7. **Interactive 3D Tilt & Orientation:**
   - Touch and drag gestures allow the student or teacher to orbit the cell in 3D (±25 degrees) to explore its depth and structure from custom angles.

8. **Presenter Quick-Jump Dock (12 Organelles + Quiz):**
   - Color-coded bottom dock pills for instant gliding between organelles and the interactive quiz.

9. **Interactive Classroom Quiz ("Desafío Celular"):**
   - 4-question review game with instant feedback and synthesized Web Audio victory chimes (100% offline, zero audio file dependencies).

---

## 🔬 Complete Organelle Coverage (12 Organelles)

| Organelle | Spanish Name | Model Color & Form | Everyday Metaphor | Key Function |
| :--- | :--- | :--- | :--- | :--- |
| **Cell Wall** | Pared Celular | Lime-green beveled hexagonal prism (`#4ade80`) | *La Muralla del Castillo* | Rigid cellulose armor providing structural support without bones. |
| **Plasma Membrane** | Membrana Plasmática | Sky-blue inner boundary liner (`#0284c7`) | *El Guardia de la Puerta* | Intelligent barrier regulating what enters and leaves the cell. |
| **Cytoplasm** | Citoplasma | Light grass-green base floor (`#86efac`) | *La Alberca de Gelatina* | Aqueous gel supporting all organelles and enabling streaming flow. |
| **Nucleus** | Núcleo | Canary-yellow half-sphere cutaway (`#facc15`) | *El Director y su Libro Secreto* | Central command center housing genetic DNA instructions. |
| **Nucleolus** | Nucléolo | Bright ruby-red sphere inside core (`#ef4444`) | *El Taller del Núcleo* | Synthesizes ribosomal RNA and initiates ribosome production. |
| **Chloroplasts** | Cloroplastos | Deep-green oval discs with ridges (`#15803d` / `#4ade80`) | *Las Cocinas Solares* | Photosynthetic green power plants converting sunlight into glucose and oxygen. |
| **Central Vacuole** | Vacuola Central | Sky-blue lobed reservoir with blue base (`#38bdf8` / `#1d4ed8`) | *El Gran Tinaco de Agua* | Massive fluid reservoir generating turgor pressure to keep the plant upright. |
| **Mitochondria** | Mitocondrias | Magenta capsule with light-pink folds (`#ec4899` / `#fbcfe8`) | *La Central Eléctrica* | Cellular power plants turning nutrients into ATP energy 24/7. |
| **Golgi Apparatus** | Aparato de Golgi | 5 horizontal corrugated orange layers (`#f97316`) | *La Oficina de Paquetería* | Modifies, packs, labels, and dispatches cellular proteins in vesicles. |
| **Endoplasmic Reticulum** | Retículo Endoplasmático | Purple accordion strips around nucleus (`#7c3aed`) | *La Gran Fábrica y Autopista* | Membrane labyrinth synthesizing proteins (Rough) and lipids (Smooth). |
| **Ribosomes** | Ribosomas | Coral-red dots studded on ER folds (`#f43f5e`) | *Los Obreros Constructores* | Tiny molecular workers assembling proteins from DNA instructions. |
| **Amyloplast** | Amiloplasto | Violet/purple spiral rolled coil (`#8b5cf6`) | *El Almacén de Almidón* | Synthesizes and stores compact starch granules for energy reserve. |
| **Peroxisome** | Peroxisoma | Teal vesicle sphere with collar ring (`#0d9488`) | *El Filtro de Desintoxicación* | Neutralizes hazardous peroxides and aids photorespiration in green leaves. |

---

## 📁 Repository Structure

```text
/Applications/MAMP/htdocs/Plant-Cell/
├── index.html          # Semantic HTML5 structure, HUD cards (00-12), and clean presentation header
├── css/
│   └── styles.css      # Minimalist didactic theme, responsive bottom sheet cards & smooth timings
├── js/
│   ├── app.js          # Three.js 3D WebGL controller, clean museum lighting, quiz & audio
│   └── vendor/
│       └── three.min.js# Offline Three.js r128 WebGL library
├── planning.md         # Spanish project log & pedagogical breakdown
└── README.md           # Technical system documentation (English)
```

---

## 🚀 Getting Started & Local Usage

### Option 1: Direct File Access
Simply open [index.html](file:///Applications/MAMP/htdocs/Plant-Cell/index.html) in any modern web browser (Safari, Chrome, Edge, Firefox).

### Option 2: Local HTTP Server (Recommended)
Run Python's built-in static HTTP server or Node `serve` within the project directory:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node npx
npx serve -l 8000
```
Then visit:
```
http://localhost:8000/
```

### Option 3: MAMP / Local Web Server
Because the project is located inside `/Applications/MAMP/htdocs/Plant-Cell`, start MAMP and access:
```
http://localhost:8888/Plant-Cell/
```

---

## 📱 Tablet & iPad Presentation Tips

1. **Fullscreen Presentation:**
   - Tap the **"Pantalla Completa"** button in the top right corner to hide browser toolbars for a distraction-free presentation.
2. **Presenter Navigation:**
   - Slide with your finger to follow the narrative sequence.
   - Use the bottom pill dock to jump directly between organelles when answering audience questions.
3. **Sound Effects:**
   - Web Audio sounds will trigger when interacting with the quiz. Ensure tablet media volume is turned on.

---

## ♿ Accessibility & Performance

- **`prefers-reduced-motion`:** Supports accessibility media query by suppressing intensive looping animations and continuous transitions for sensitive users.
- **Hardware Acceleration:** WebGL and CSS animations prioritize `transform` and `opacity` properties to prevent CPU layout reflows and battery drain on portable devices.

---

## 🎓 Educational Purpose & AI Disclosure

* **Educational Context:** This application was developed as a family collaboration between **Angel Estrada** and his daughter **Luna María Estrada Nieto** to present her physical model and study the organelles of the plant cell in her middle school science class at **Escuela Secundaria Federal #60**.
* **Non-Commercial License:** All 3D assets, procedural textures, interactive quizzes, and educational content are provided exclusively for academic and learning purposes.
* **AI Assistance:** An AI Large Language Model (LLM) was utilized as an educational pair-programming tool, assisting in code optimization, pedagogical clarity, and accessible design.
