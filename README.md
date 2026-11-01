# Interactive Plant Cell Scrollytelling Experience

An interactive, high-performance web presentation designed for middle-school science education (primary/secondary school, presented by a 12-year-old student). The application combines **scrollytelling**, hardware-accelerated SVG animations, and a bioluminescent dark laboratory theme to make learning plant cytology intuitive, memorable, and visually engaging.

---

## 🌟 Key Features

1. **Scroll-Driven Storytelling (Scrollytelling):**
   - Seamlessly synchronizes narrative didactic cards with a pinned, dynamic SVG plant cell graphic.
   - Automatically focuses, zooms, and highlights each active organelle while smoothly dimming peripheral structures.

2. **Bioluminescent Laboratory Visual Aesthetic:**
   - Deep midnight background (`#080d11`) paired with vivid neon botanical accents (emerald, cyan, violet, amber, and gold).
   - High contrast optimized for classrooms, school digital projectors, and tablet displays.

3. **Didactic & Age-Appropriate Content:**
   - Specifically written for a 12-year-old presenter to speak with confidence.
   - Every organelle includes:
     - **Everyday Analogy** (*e.g., "The Castle Wall", "The Solar Kitchen", "The Water Tank"*).
     - **Quick Concept Summary** in simple everyday language.
     - **Key Functions** bulleted concisely.
     - **School Fun Fact** (*"¿Sabías qué?"*) to captivate classmates and teachers.

4. **Presenter Quick-Jump Dock:**
   - A sticky, touch-friendly pill dock at the bottom of the viewport allowing the student to instantly glide to any specific organelle if a teacher or classmate asks a question out of order.

5. **Interactive Classroom Quiz ("Desafío Celular"):**
   - 4-question interactive review game with immediate feedback and synthesized celebratory chime sound effects generated in real-time via the Web Audio API (zero external audio file dependencies).

6. **Tablet & Fullscreen Optimization:**
   - Responsive split layout for desktop and tablet landscape; pinned viewport layout for tablet portrait.
   - Built-in full-screen mode toggle to eliminate distracting browser chrome during presentations.
   - Zero heavy WebGL or unoptimized 3D assets: ultra-lightweight footprint (< 60 KB total code), guaranteeing 60 FPS on iPads and budget school devices.

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
