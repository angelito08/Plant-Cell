# Interactive Plant Cell Scrollytelling Experience

An interactive, high-performance 3D web presentation created for **Luna María Estrada Nieto** for her **Ciencias (Science)** class at **Escuela Secundaria Federal #60**. The application features an immersive **Three.js WebGL engine** that executes a smooth **macro-to-micro flight** from a 3D potted botanical plant directly into a cutaway 3D plant cell with true volume, thickness, and bioluminescent depth lighting.

* **Student Presenter:** Luna María Estrada Nieto
* **School:** Escuela Secundaria Federal #60
* **Subject:** Ciencias (Biology / Natural Sciences)
* **Target Audience:** Middle School / Secondary Education (12-year-old students)

---

## 🌟 Key Features

1. **Macro-to-Micro 3D Journey (Plant to Cell Zoom):**
   - Starts with a stylized 3D potted plant with glowing leaf blades and morning dew drops.
   - Scrolling triggers a cinematic microscope zoom diving through the leaf cuticle and plant tissue directly into the cellular cutaway.

2. **Full-Viewport 3D Plant Cell Cutaway:**
   - Real 3D volume, thick beveled walls showing structural layers, translucent glassy vacuole, spherical nucleus with glowing nucleolus, chloroplast discs with thylakoid grana stacks, mitochondria, Golgi cisternae, and golden ribosomes.
   - Built on pure Three.js with hardware-accelerated PBR shaders and dynamic point lights (emerald, cyan, violet, amber).

3. **Floating HUD Narrative Cards (On-Demand Appearance):**
   - Cards smoothly fade in and elevate when arriving at an organelle, and fade out cleanly during camera transitions between organelles, leaving the 3D view completely unobstructed.

4. **Interactive 3D Tilt & Orientation:**
   - The student presenter or teacher can gently touch or drag on the screen to tilt the cell in 3D (+- 25 degrees) to explore its volume from custom angles.

5. **Didactic & Age-Appropriate Content:**
   - Specifically tailored for a 12-year-old presenter to speak clearly and naturally without memorizing complex jargon.
   - Includes everyday analogies (*e.g., "The Castle Wall", "The Solar Kitchen", "The Water Tank"*), concise bullet points, and school fun facts (*"¿Sabías qué?"*).

6. **Presenter Quick-Jump Dock:**
   - Bottom pill dock for instant gliding to any organelle or the quiz if a teacher asks questions out of sequence.

7. **Interactive Classroom Quiz ("Desafío Celular"):**
   - 4-question review game with instant feedback and synthesized Web Audio victory chimes (100% offline, zero audio file dependencies).

8. **100% Offline Capable & Tablet-Optimized:**
   - Bundles local Three.js (`js/vendor/three.min.js`), ensuring flawless presentation performance even without internet connection at school.
   - Fluid 60 FPS guaranteed on iPads, Android tablets, and projection laptops.

---

## 🔬 Organelle Coverage & Educational Analogies

| Organelle | Spanish Name | Everyday Metaphor | Key Function |
| :--- | :--- | :--- | :--- |
| **Cell Wall** | Pared Celular | *La Muralla del Castillo* | Rigid cellulose armor providing structural support without bones. |
| **Plasma Membrane** | Membrana Plasmática | *El Guardia de la Puerta* | Intelligent barrier regulating what enters and leaves the cell. |
| **Cytoplasm** | Citoplasma | *La Alberca de Gelatina* | Aqueous gel supporting all organelles and enabling streaming flow. |
| **Nucleus & Nucleolus** | Núcleo y Nucléolo | *El Director y su Libro Secreto* | Central command center housing genetic DNA instructions. |
| **Chloroplasts** | Cloroplastos | *Las Cocinas Solares* | Photosynthetic green power plants converting sunlight into glucose and oxygen. |
| **Central Vacuole** | Vacuola Central | *El Gran Tinaco de Agua* | Massive fluid reservoir generating turgor pressure to keep the plant upright. |
| **Mitochondria** | Mitocondrias | *La Central Eléctrica* | Cellular power plants turning nutrients into ATP energy 24/7. |
| **Golgi Apparatus** | Aparato de Golgi | *La Oficina de Paquetería* | Modifies, packs, labels, and dispatches cellular proteins in vesicles. |
| **Endoplasmic Reticulum** | Retículo Endoplasmático | *La Gran Fábrica y Autopista* | Membrane labyrinth synthesizing proteins (Rough) and lipids (Smooth). |
| **Ribosomes** | Ribosomas | *Los Obreros Constructores* | Tiny molecular workers assembling proteins from DNA instructions. |

---

## 📁 Repository Structure

```text
/Applications/MAMP/htdocs/Plant-Cell/
├── index.html          # Semantic HTML5 structure & SVG vector cell illustration
├── css/
│   └── styles.css      # Bioluminescent theme, layout, glassmorphism & animation timings
├── js/
│   └── app.js          # IntersectionObserver engine, SVG camera controller, quiz & audio
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
- **Hardware Acceleration:** Animations prioritize `transform` and `opacity` properties to prevent CPU layout reflows and battery drain on portable devices.
- **Scalable Vector Graphics (SVG):** Crisp render on High-DPI / Retina displays at any zoom factor.
