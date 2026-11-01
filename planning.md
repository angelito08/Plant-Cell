# Bitácora de Planeación: Proyecto Célula Vegetal Interactiva (Scrollytelling)

## 1. Resumen Ejecutivo y Objetivos

* **Propósito:** Desarrollar una aplicación web interactiva y altamente visual basada en la técnica de *scrollytelling* (narración guiada por scroll), orientada a explicar la estructura y los organelos de la célula vegetal.
* **Audiencia Meta:** Proyecto escolar de educación básica (1° de secundaria).
* **Presentadora Oficial:** **Luna María Estrada Nieto** (12 años).
* **Institución Educativa:** **Escuela Secundaria Federal #60**.
* **Materia / Asignatura:** **Ciencias** (Ciencias Naturales / Biología).
* **Decisiones de Diseño Confirmadas (Evolución 3D Inmersiva):**
  * **Motor Gráfico 3D (WebGL / Three.js):** Representación tridimensional con volumen real, espesor de paredes, curvatura de organelos, iluminación direccional y materiales translúcidos (PBR). Todo optimizado para 60 FPS en iPads y tabletas.
  * **Experiencia a Pantalla Completa (Full Viewport Canvas):** El modelo 3D abarca el 100% de la pantalla, eliminando divisiones rígidas de columnas y ofreciendo un impacto visual cinematográfico tipo IMAX escolar.
  * **Secuencia Inicial "Macro a Micro" (De la Planta a la Célula):**
    1. Al inicio (0% scroll) se muestra una **planta 3D completa con hojas brillantes**.
    2. Al comenzar a hacer scroll, la cámara microscópica realiza un **zoom hipersuave hacia la superficie de una hoja**, atravesando los tejidos vegetales.
    3. Transición continua donde la cámara "penetra" a escala microscópica y revela la **Célula Vegetal 3D en corte transversal**.
  * **Texturizado Procedural 3D en Tiempo Real (Bump, Roughness & Detail Maps):** Generación algorítmica de texturas de alta resolución mediante canvas HTML5 en memoria (100% offline, carga instantánea, 0 KB de descargas externas):
    * *Pared Celular:* Textura fibrosa de microfibrillas entrelazadas de celulosa vegetal con relieve bump pronunciado.
    * *Vacuola Central:* Cáusticas acuosas fluidas con patrón de refracción líquida y brillo especular.
    * *Núcleo y Nucléolo:* Superficie porosa con poros nucleares visibles, cromatina granular y núcleo interno incandescente.
    * *Cloroplastos:* Membrana lipídica estromática con discos de tilacoides estriados y micrograna.
    * *Mitocondrias:* Bandas transversales de crestas mitocondriales con pliegues internos y bioluminiscencia de ATP.
    * *Aparato de Golgi & Retículo:* Relieve de cisternas membranosas túbulo-laminares y vesículas secretoras perladas.
  * **Sistema de Resaltado Dramático (Spotlight, Halo Beacon 3D y Dimming Selectivo):**
    * *Foco de Luz Dinámico (Dynamic 3D Spotlight):* Un haz de luz puntual potente que viaja en coordenadas 3D posicionándose sobre el organelo en foco, tiñéndolo de su color temático.
    * *Faro Indicador Bioluminiscente (Beacon Ring Halo):* Un marcador 3D animado formado por anillos concéntricos resplandecientes que levitan y pulsan sobre el organelo activo.
    * *Atenuación Selectiva de Fondo (Selective Dimming):* Al enfocar un organelo, todos los demás organelos reducen su opacidad al 25% y apagan su emisión, logrando que el organelo protagónico resalte con un contraste cinematográfico.
    * *Pulso Bioluminiscente Vivo:* El organelo seleccionado respira con una suave pulsación senoidal en su intensidad emisiva.
  * **Tarjetas Flotantes Inteligentes (HUD Overlay):**
    * Las tarjetas didácticas aparecen suavemente (*fade-in / translate*) únicamente cuando la cámara arriba al organelo en cuestión.
    * Desaparecen limpiamente (*fade-out*) en cuanto se continúa el scroll, dejando la pantalla despejada durante los vuelos de cámara entre organelos.
  * **Interactividad Táctil y Giro 3D:** Además del scroll guiado, la expositora puede inclinar o rotar ligeramente la célula con el dedo o mouse para mostrar su volumen desde diferentes ángulos.
  * **Disponibilidad 100% Offline:** Three.js empaquetado de forma local para garantizar que la presentación funcione sin conexión a internet en la escuela.
* **Requisitos Clave:**
  * **Lenguaje accesible:** Explicaciones claras, tono amigable y metáforas cotidianas (ej. "el núcleo es la oficina del director", "la vacuola es el tinaco de agua").
  * **Control por scroll:** El avance de la página desencadena animaciones, acercamientos (zoom) y resplandores en cada organelo correspondiente.
  * **Máximo rendimiento:** 60 FPS estables en navegadores de escritorio y tabletas (iPad / Android), optimizado para pantallas táctiles y Retina.
  * **Facilidad de uso en vivo:** Controles de apoyo para la expositora (barra de progreso, selector rápido de organelos por si el profesor pregunta por uno específico, y modo pantalla completa).

---

## 2. Metáfora Pedagógica Central: "La Ciudad Celular Autosustentable"

Para que la explicación sea natural, divertida y fácil de recordar tanto para la expositora como para sus compañeros, utilizaremos la analogía de una **ciudad autosustentable**:

| Organelo | Analogía Cotidiana | Función Simplificada | Dato Curioso Escolar |
| :--- | :--- | :--- | :--- |
| **Pared Celular** | La muralla del castillo | Da soporte y rigidez para que la planta se mantenga de pie sin huesos. | ¡Por eso el tronco de los árboles es tan duro! Está hecha de celulosa. |
| **Membrana Plasmática** | El policía en la puerta | Controla quién entra (agua, nutrientes) y quién sale (desechos). | Es flexible y se encuentra pegadita al interior de la pared celular. |
| **Citoplasma** | El agua de una alberca | Sustancia gelatinosa donde flotan y se mueven todos los organelos. | ¡Es casi 80% agua con sales y proteínas! |
| **Núcleo y Nucléolo** | El ayuntamiento / Cerebro | Guarda el libro secreto de instrucciones (ADN) que dice qué hacer a toda la célula. | Dentro tiene el nucléolo, que ayuda a fabricar obreros celulares. |
| **Cloroplastos** | Las cocinas solares | Tienen clorofila verde que atrapa la luz del sol para preparar comida (fotosíntesis). | ¡Solo las plantas los tienen! Gracias a ellos tenemos oxígeno para respirar. |
| **Vacuola Central** | El gran tinaco de agua | Almacena agua y nutrientes, e infla la célula como un globo para mantenerla firme. | Cuando olvidas regar tu planta, la vacuola se vacía y las hojas se marchitan. |
| **Mitocondrias** | Las plantas eléctricas | Queman azúcares para generar energía rápida que la célula usa día y noche. | Se conocen como las baterías recargables de la vida. |
| **Aparato de Golgi** | La oficina de paquetería | Empaca, clasifica y envía proteínas en pequeñas cajitas (vesículas). | Funciona exactamente como Amazon o Correos dentro de la célula. |
| **Retículo Endoplasmático** | La gran fábrica y autopista | Red de pasillos donde se ensamblan proteínas y grasas buenas. | Hay dos tipos: el Rugoso (con bolitas) y el Liso (sin bolitas). |
| **Ribosomas** | Los pequeños constructores | Mini-máquinas obreras que leen las instrucciones para ensamblar proteínas. | Son súper pequeñitos pero hay miles de ellos trabajando todo el tiempo. |

---

## 3. Arquitectura Técnica y Estrategia de Animación

### 3.1 Pila de Tecnologías
* **Estructura:** HTML5 semántico (`<article>`, `<section>`, `<figure>`, `<aside>`).
* **Estilos:** CSS3 nativo avanzado (Variables CSS, Glassmorphism, Flexbox, CSS Grid).
* **Lógica:** JavaScript ES6+ Vanilla (sin frameworks pesados, garantizando arranque instantáneo y mínimo consumo de RAM en tabletas).
* **Motor Gráfico:** Ilustración vectorial SVG interactiva con estructura de capas e identificadores por organelo, permitiendo:
  * Escalabilidad infinita sin perder nitidez en pantallas Retina.
  * Modificación directa de estilos (`fill`, `stroke`, `filter`, `opacity`, `transform`) mediante CSS/JS.
  * Peso pluma (< 50 KB frente a modelos 3D pesados que pueden trabar un iPad escolar).

### 3.2 Patrón de Scrollytelling
* **Contenedor Pegajoso (`position: sticky`):** En escritorio y tabletas horizontales, la célula vegetal se mantendrá centrada o a la izquierda en una ventana fija del 100vh.
* **Carril de Historia (Scroll Track):** A la derecha (o flotando sobre fondo traslúcido) se despliegan las tarjetas explicativas con espaciado generoso para permitir pausas cómodas al hablar.
* **Detección de Avance:**
  * Uso de `IntersectionObserver` con múltiples umbrales para sincronización milimétrica del organelo activo.
  * Soporte complementario para `@supports (animation-timeline: scroll())` donde esté disponible.
* **Cinemática de la Célula:**
  * Zoom focalizado y paneo suave (`viewBox` animado o transformaciones CSS 2D de `translate` y `scale`).
  * Atenuación de partes secundarias (`opacity: 0.25`) y resaltado brillante con pulso y contorno brillante en el organelo protagónico (`filter: drop-shadow(...)`).

---

## 4. Diseño de Experiencia de Usuario (UI/UX) y Soporte para Exposición

1. **Barra de Progreso y Marcador de Estado:**
   * Muestra visualmente qué porcentaje de la célula se ha explorado.
2. **Índice Rápido para la Expositora (Píldoras Flotantes / Dock):**
   * Botones discretos en pantalla que permiten saltar directamente a cualquier organelo si un compañero o profesor hace una pregunta fuera de orden.
3. **Tarjeta Didáctica "Tarjeta Escolar":**
   * Encabezado con ícono y nombre del organelo.
   * "En pocas palabras..." (La analogía cotidiana en 1 oración destacada).
   * "¿Cómo funciona?" (2-3 puntos breves con viñetas legibles y tipografía clara).
   * "¿Sabías qué?" (Dato curioso resaltado con fondo llamativo para cautivar a la clase).
4. **Modo Resumen y Quiz Dinámico al Final:**
   * Al finalizar el recorrido, la célula se ilumina por completo.
   * Una sección de "Mini Desafío": 3 preguntas interactivas donde la alumna puede invitar a un compañero a señalar el organelo correcto o responder una pregunta rápida de opción múltiple.
5. **Modo Pantalla Completa:**
   * Botón visible para ocultar barras de navegación del navegador en tabletas o proyector escolar.

---

## 5. Plan de Ejecución por Etapas

* **Paso 1: Fundamentos y Maquetación Base**
  * Crear la estructura de archivos (`index.html`, `css/styles.css`, `js/app.js`).
  * Establecer la paleta de colores botánica/bio-moderna (verdes esmeralda, menta, amarillos bioluminiscentes, fondos oscuros contrastantes o claros limpios).
* **Paso 2: Creación del Modelo Vectorial SVG de la Célula Vegetal**
  * Diseñar la célula vegetal completa en SVG con todas sus estructuras correctamente etiquetadas (`cell-wall`, `plasma-membrane`, `vacuole`, `chloroplasts`, `nucleus`, `nucleolus`, `mitochondria`, `golgi`, `endoplasmic-reticulum`, `ribosomes`, `cytoplasm`).
* **Paso 3: Desarrollo del Motor de Scrollytelling e Interactividad**
  * Implementar el observador de scroll para activar cambios de foco, zooms y brillos.
  * Implementar transiciones suaves aceleradas por hardware (`transform`, `opacity`).
* **Paso 4: Redacción y Estructuración de Contenido Didáctico**
  * Integrar las tarjetas informativas con las metáforas escolares, lenguaje adaptado a 12 años y llamadas visuales atractivas.
* **Paso 5: Controles de Apoyo para la Presentación y Mini Quiz Escolar**
  * Añadir el panel de salto rápido, modo pantalla completa y juego de repaso.
* **Paso 6: Optimización Táctil, Responsive y Pruebas en Navegador**
  * Validar fluidez en resoluciones de tableta (iPad landscape/portrait).
  * Verificar cumplimiento de accesibilidad y soporte de `prefers-reduced-motion`.
* **Paso 7: Documentación del Sistema (README.md en Inglés)**
  * Crear la documentación técnica completa del proyecto en inglés cumpliendo con las reglas del proyecto.

---

## 6. Registro de Mejoras Visuales: Texturizado Procedural y Resaltado Tridimensional Cinematográfico

### 6.1 Problema Identificado
Al presentar los organelos en 3D, estos requerían mayor textura táctil/biológica y un contraste visual más contundente cuando la cámara hace foco en cada uno de ellos, evitando superficies lisas o plásticas y logrando que el organelo activo capture inmediatamente la atención de la clase.

### 6.2 Soluciones Implementadas
1. **Generación de Texturas Procedurales en Tiempo Real (HTML5 Canvas):**
   * *0 KB de descargas externas:* Las texturas se generan en memoria al iniciar la aplicación, garantizando funcionamiento 100% offline y alta nitidez en pantallas Retina.
   * *Pared Celular:* Patrón de microfibrillas entrelazadas de celulosa en relieve (`bumpMap`) y variaciones de rugosidad (`roughnessMap`).
   * *Membrana Plasmática:* Patrón granular que emula las cabezas de la bicapa fosfolipídica.
   * *Vacuola Central:* Cáusticas acuosas fluidas con reflejos de refracción líquida.
   * *Núcleo y Nucléolo:* Poros nucleares circulares distribuidos y cromatina condensada en la envoltura nuclear.
   * *Cloroplastos:* Textura de estroma con estrías laminares de tilacoides.
   * *Mitocondrias:* Bandas alternadas transversales que simulan los pliegues de las crestas mitocondriales.
   * *Aparato de Golgi y Retículo:* Estrías membranosas túbulo-laminares y vesículas de transporte.

2. **Corte Anatómico Interior (Cross-Section Window):**
   * Se incorporó una ventana de corte transversal en el cloroplasto principal que revela en su interior monedas de granas tilacoidales apiladas en verde esmeralda brillante.
   * Se aplicó corte transversal a la mitocondria principal mostrando sus crestas interiores radiantes en tonos ámbar y rojo biológico.

3. **Sistema de Iluminación Focal Dinámica (Cinematic 3D Spotlight & PointLight):**
   * Un foco direccional 3D (`THREE.SpotLight`) y una luz puntual de acento (`THREE.PointLight`) viajan en coordenadas tridimensionales suaves (`lerp`) sincronizándose con la posición exacta del organelo activo.
   * Se calibró la intensidad para destacar los relieves de bump y mantener los colores saturados y vivos sin desaturación ni blanqueo.

4. **Faro Halo Bioluminiscente 3D (Beacon Marker):**
   * Marcador espacial compuesto por dos anillos concéntricos que giran en direcciones opuestas y cuatro diamantes orbitales pulsantes.
   * Se posiciona flotando suavemente sobre el organelo en foco, sirviendo como guía visual inmediata para la audiencia escolar.

5. **Atenuación Selectiva del Fondo (Selective Dimming):**
   * Cuando se activa un organelo, los demás organelos reducen su opacidad al 22% y disminuyen su emisión, creando un fondo contextual discreto.
   * El organelo en foco recupera el 100% de opacidad y recibe un pulso suave de bioluminiscencia viva.
   * Se implementó el método `cacheOriginalOrganelleMaterials()` para preservar de manera inmutable las propiedades originales de los materiales y evitar problemas de opacidad residual durante el scroll.

---

## 7. Resolución de Incidencia: Ocultamiento de Tarjeta de Ribosomas en Sección de Quiz

### 7.1 Causa Raíz
1. La sección interactiva del Quiz (`#step-quiz`) poseía únicamente la clase `quiz-section`, mientras que el motor de sincronización (`this.stepTriggers`) solo seleccionaba elementos con la clase `.scroll-step-trigger`.
2. Como resultado, `#step-quiz` nunca fue observado por el `IntersectionObserver`, impidiendo que se llamara a `activateStep('quiz')` tanto al hacer scroll como al hacer clic en el botón del dock.
3. El estado activo permanecía estancado en `'ribosomes'`, manteniendo la tarjeta HUD flotante de los Ribosomas con la clase `.is-active` visible y sobrepuesta sobre las preguntas del quiz.

### 7.2 Plan de Solución
1. Ampliar el selector de disparadores de scroll en `js/app.js` a `document.querySelectorAll('.scroll-step-trigger, #step-quiz, .quiz-section')`.
2. Agregar un disparador de scroll complementario o registrar directamente el elemento `#step-quiz` en el observer con un margen de intersección apropiado.
3. En `initPresenterDock()`, invocar explícitamente `this.activateStep(pill.dataset.step)` al hacer clic sobre cualquier píldora de navegación, garantizando respuesta instantánea del HUD, ocultado de tarjetas y reencuadre de cámara hacia la vista panorámica del quiz.
4. Validar visualmente en navegador mediante subagente que al llegar al Quiz la tarjeta de los Ribosomas se oculte por completo y la interfaz del quiz quede totalmente despejada.


