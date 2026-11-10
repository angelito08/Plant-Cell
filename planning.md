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
---

## 8. Rediseño Cromático y Morfológico: Vacuola Central y Ribosomas

### 8.1 Diagnóstico Visual
1. **Vacuola Central:**
   - La vacuola presentaba una transparencia excesiva (`transmission: 0.65`) con un tono cian desaturado (`0x06b6d4`), haciendo que se percibiera como una masa grisácea, opaca y apagada, fusionándose con el fondo oscuro y el citoplasma en lugar de verse como un imponente depósito de agua cristalina viva.
2. **Ribosomas:**
   - Los ribosomas estaban representados mediante partículas 2D planas (`THREE.Points`) con un tamaño diminuto de punto que se perdía en pantallas de alta resolución.
   - Al no ser mallas 3D (`Mesh`), no interactuaban con los focos de iluminación, sombras ni mapas de material PBR.
   - Su color amarillo tenue (`#facc15`) carecía de contraste con las luces especulares del retículo y la vacuola.

### 8.2 Estrategia de Mejora

1. **Nueva Identidad Visual de la Vacuola Central:**
   - **Color:** Azul Zafiro Crystalline / Océano Eléctrico (`#0077b6` a `#00b4d8`, base `0x0099ff` y emisión interna `0x0044cc`).
   - **Material PBR Acuoso:** Se reduce la transmisión a un nivel balanceado (`transmission: 0.38`, `opacity: 0.88`, `roughness: 0.08`, `clearcoat: 1.0`) para conservar volumen tridimensional sólido y saturación cromática vibrante.
   - **Cáusticas Líquidas Refinadas:** Se intensifica el mapa procedural de cáusticas de agua (`createWaterCausticsTexture`) con líneas de refracción blancas y cian brillante que reflejan la turgencia del agua celular.
   - **Acento en UI:** Actualizar el color de la tarjeta y píldora a Azul Zafiro (`#00b4d8`).

2. **Nueva Identidad Visual de los Ribosomas:**
   - **Morfología 3D Real (`InstancedMesh`):** Reemplazar las partículas planas por cientos de **esferas tridimensionales de volumen físico real** (`THREE.SphereGeometry`), modeladas con brillo metálico y presencia tangible.
   - **Distribución Anatómica:** Organizados densamente sobre las membranas del Retículo Endoplasmático Rugoso (emulando la fabricación activa de proteínas) y dispersos en el citoplasma circundante.
   - **Color de Máximo Contraste:**
     - Rojo Rubí / Coral Neón Bioluminiscente (`#ff2a5f` / `0xff1744`), un color que contrasta de manera dramática contra el violeta del retículo endoplasmático (`#8b5cf6`), el azul zafiro de la vacuola y el verde esmeralda de la pared celular.
   - **Acento en UI:** Actualizar el color de la tarjeta de Ribosomas y su píldora en el dock a Rojo Coral / Rubí (`#ff2a5f`).

---

## 9. Optimización de Fluidez: Suavizado de Scroll, Eliminación de Jitter y Reparación de Pantalla Completa

### 9.1 Diagnóstico de la Experiencia de Usuario
1. **Scroll Torpe / Sensación Pesada:**
   * La propiedad global `scroll-behavior: smooth` en la etiqueta `html` entraba en conflicto con la inercia natural del trackpad y del scroll en macOS/iOS, provocando una doble amortiguación que retrasaba la respuesta del scroll e impedía un control fino del desplazamiento.
2. **Glitch / Jitter entre Pasos:**
   * En `IntersectionObserver`, al intersectar dos secciones adyacentes simultáneamente durante el desplazamiento, ambas se procesaban en el bucle `forEach`, activando y desactivando pasos en el mismo fotograma. Esto producía un salto errático de cámara, reseteos continuos de materiales y cambios bruscos en las tarjetas HUD.
   * La velocidad de interpolación de cámara (`lerp: 0.055`) era demasiado baja, lo que hacía que la cámara se quedara rezagada frente al scroll del usuario.
   * La visibilidad de la planta (`plantGroup`) y la célula (`cellGroup`) se conmutaba con un booleano brusco, causando un corte visual perceptible.
3. **Falla en el Botón de Pantalla Completa:**
   * En Safari (macOS / iPadOS), la API estándar `requestFullscreen()` no se invocaba con compatibilidad para prefijos webkit (`webkitRequestFullscreen`), provocando excepciones o rechazos silenciosos.
   * En iPads y navegadores móviles de Apple, el API de pantalla completa nativo para elementos DOM está restringido, dejando al usuario sin respuesta al pulsar el botón.
   * Faltaban observadores de evento `fullscreenchange` y `webkitfullscreenchange` para mantener sincronizado el texto del botón si el usuario salía mediante la tecla Escape o gestos del sistema.

### 9.2 Plan de Solución e Implementación
1. **Fluidez Natural del Scroll:**
   * Retirar `scroll-behavior: smooth` global de `html` en `css/styles.css`, permitiendo que el hardware responda de inmediato con 60 FPS estables. La navegación asistida mediante clics en el dock seguirá empleando `scrollIntoView({ behavior: 'smooth' })`.
2. **Eliminación Definitiva de Jitter (Paso Dominante Único por RAF):**
   * Implementar un mapa de proporciones de visibilidad (`triggerRatios = new Map()`).
   * En cada fotograma de animación (`requestAnimationFrame`), seleccionar exclusivamente la sección con **mayor porcentaje de intersección visible** en pantalla.
   * Aumentar el factor de seguimiento de la cámara a `0.085`, logrando un vuelo cinematográfico responsivo que sigue al scroll sin rezago.
   * Suavizar la transición entre la planta y la célula de modo que solo se desactiven cuando su escala se aproxime a cero.
3. **Sistema de Pantalla Completa Híbrido (Dual Mode):**
   * Soporte universal con prefijos: `requestFullscreen`, `webkitRequestFullscreen`, `mozRequestFullScreen`, `msRequestFullscreen`.
   * **Modo Presentación In-App Fallback:** Si el navegador (como Safari en iPad) rechaza o no soporta el fullscreen nativo, activar la clase `.is-fullscreen-app` en el `body`, fijando la interfaz en pantalla completa inmersiva (`100dvh`), ocultando distracciones y asegurando que Luna María pueda proyectar sin problemas.
   * Sincronización automática de estado con `fullscreenchange`, `webkitfullscreenchange` y tecla `Escape`.

---

## 10. Adaptabilidad Móvil y Tabletas: Coexistencia Óptima de Ilustración 3D y Tarjetas HUD

### 10.1 Diagnóstico de la Experiencia en Dispositivos Móviles y Tabletas
1. **Conflicto Espacial en Pantallas Verticales (Portrait):**
   * En escritorio (16:9 / 16:10), la célula vegetal 3D se proyecta a la izquierda y las tarjetas flotan a la derecha sin superposición.
   * En smartphones (360px–430px de ancho) y tabletas en orientación vertical (iPad 768px–834px), la relación de aspecto vertical (9:16 o 3:4) reduce el campo de visión horizontal de Three.js (FOV horizontal comprimido a ~22°), haciendo que el modelo 3D quede ampliado en el centro.
   * Al mismo tiempo, la tarjeta informativa HUD se posicionaba en la parte inferior/central con una altura de ~350px–420px, cubriendo directamente el 50% inferior del modelo 3D y tapando los organelos destacados y sus balizas luminosas.
2. **Falta de Control Táctil de Visibilidad para la Alumna:**
   * En una tableta escolar o teléfono, la alumna necesita leer la información pero también mostrar a sus compañeros y profesor la forma tridimensional, las texturas y rotar la célula con el dedo sin obstáculos visuales.
3. **Superposición de Dock de Navegación y Tarjeta:**
   * En pantallas con menor altura, el dock flotante inferior y la tarjeta HUD se encontraban demasiado próximos, restando espacio útil para el visor 3D.

### 10.2 Plan de Arquitectura y Solución

#### A. Encuadre Inteligente Adaptativo en Three.js (`js/app.js`):
1. **Detección Dinámica de Orientación Vertical:**
   * Detectar activamente si el dispositivo está en formato vertical o móvil (`window.innerWidth < 1024 && window.innerHeight >= window.innerWidth`).
2. **Elevación Visual de la Célula hacia el Tercio Superior:**
   * En pantallas verticales, desplazar el objetivo de la cámara (`camera.lookAt`) hacia abajo (`mobileLookAtY = currentLookAt.y - 2.8` en móviles, `-1.6` en tabletas) y elevar ligeramente la posición Y de la cámara.
   * Al enfocar un punto inferior en el espacio 3D, el modelo celular, la baliza luminosa y el organelo activo se elevan proyectándose limpiamente en el **tercio y mitad superior de la pantalla (12% a 55% del viewport)**, completamente fuera del área ocupada por la tarjeta.
3. **Compensación de FOV y Distancia Z:**
   * En pantallas móviles portrait, ampliar dinámicamente el FOV o la distancia Z (+4.0 en móviles, +2.0 en tabletas) para que las paredes celulares y las texturas no se corten en los laterales.
4. **Respuesta Inmediata al Giro (OrientationChange & Resize):**
   * Al girar el dispositivo entre horizontal (landscape) y vertical (portrait), recalcular automáticamente la matriz de proyección y el encuadre.

#### B. Rediseño de las Tarjetas HUD como "Glass Bottom Sheet Escolar" (`css/styles.css`):
1. **Ubicación Inferior sin Oclusión:**
   * Anclar las tarjetas en la zona inferior de la pantalla (`bottom: 4.4rem`), dejando el 55%–60% superior completamente despejado para el 3D.
   * Ancho máximo optimizado: `max-width: min(92vw, 420px)` en teléfonos y `max-width: min(85vw, 540px)` en tabletas portrait.
2. **Altura Máxima Controlada y Scroll Suave:**
   * Límite estricto de altura: `max-height: min(40dvh, 310px)` en teléfonos y `max-height: min(44dvh, 360px)` en tabletas.
   * `overflow-y: auto; overscroll-behavior: contain;` con barra de desplazamiento sutil translúcida, garantizando que nunca invada la mitad superior de la pantalla.
3. **Estética Glassmorphism Translúcida:**
   * Fondo de cristal esmerilado translúcido (`background: rgba(8, 14, 20, 0.76); backdrop-filter: blur(20px);`), permitiendo que el resplandor bioluminiscente de la célula 3D se trasluzca detrás de la tarjeta.
   * Borde temático luminiscente fino que identifica el color del organelo.
4. **Tipografía y Jerarquía Proporcional Escolar:**
   * Cabecera compacta con badge y número de paso.
   * Resumen rápido destacado en 1–2 líneas.
   * Viñetas educativas concisas con viñeta luminosa.
   * Dato curioso escolar integrado sin sobrecargar.

#### C. Modo "Ojo 3D / Minimizar Tarjeta" (Peek Mode Táctil):
1. **Botón Interactivo de Vista 3D en la Tarjeta:**
   * Añadir un botón táctil intuitivo `card-toggle-view-btn` en la tarjeta ("👁️ Ocultar" / "📖 Ver Info").
   * Al pulsar, la tarjeta se colapsa a una pequeña franja de 46px (sólo título y badge), liberando el 92% de la pantalla para interactuar y rotar libremente el 3D con el dedo.
   * Al hacer scroll hacia el siguiente organelo o al pulsar de nuevo, la tarjeta se expande automáticamente con los datos completos.

#### D. Adaptación del Presenter Dock y Controles en Móvil:
1. **Dock Táctil Compacto con Scroll Horizontal con Snap:**
   * Ubicado en `bottom: 0.6rem;` con altura contenida y `scroll-snap-type: x mandatory`.
   * Píldoras con tamaño táctil amigable para dedos (`min-height: 38px`).
2. **Header y Portada Optimizados:**
   * Header responsivo en teléfonos estrechos (< 420px), manteniendo el botón de Pantalla Completa accesible.
   * Portada con títulos escalados mediante `clamp()` para lucir la planta 3D antes de comenzar el zoom microscópico.

---

## 11. Refinamiento UX Móvil y Tablet: Tarjeta Compacta por Defecto y Expansión sin Scroll Interno

### 11.1 Requerimiento del Usuario
* En dispositivos móviles y tabletas, las tarjetas deben aparecer **al inicio en formato compacto/resumen** para priorizar la apreciación del modelo 3D, el organelo activo y su baliza luminosa.
* Cuando el usuario/alumna decida leer la información didáctica, debe poder hacer clic en un botón destacado para desplegar el contenido.
* La tarjeta desplegada debe tener **mayor altura disponible** (`max-height: 72dvh`), eliminando la necesidad de scroll interno y permitiendo leer todo el contenido (resumen, viñetas y dato curioso) de un solo vistazo.

### 11.2 Plan de Arquitectura y Cambios

1. **Estado Inicial en Móvil y Tableta (`is-compact` por defecto):**
   * En resoluciones menores a 1024px, al activarse cualquier paso (`activateStep`), la tarjeta se inicializa automáticamente en su modo compacto (`.is-compact`).
   * La tarjeta compacta actúa como una barra informativa estética con:
     * Número de paso (`05 / 10`)
     * Analogía escolar (`💧 El Gran Tinaco de Agua`)
     * Nombre del organelo (`Vacuola Central`)
     * Botón táctil destacado: `📖 Ver Información ▲` con microinteracción visual.
   * El 85%–90% de la pantalla permanece completamente libre para interactuar con el visor 3D, observar la iluminación bioluminiscente y rotar el modelo.

2. **Expansión Completa a Demanda (`.is-expanded`):**
   * Al pulsar el botón `📖 Ver Información` (o tocar la barra compacta), la tarjeta se expande con una transición suave (`cubic-bezier(0.16, 1, 0.3, 1)`).
   * La altura máxima se amplía a `max-height: min(72dvh, 560px)` en teléfonos y `min(70dvh, 620px)` en tabletas.
   * Al contar con suficiente altura vertical, todos los elementos (resumen, lista de viñetas con checks luminiscentes y caja de dato curioso escolar) caben perfectamente **sin requerir scroll interno**.
   * El botón cambia a `👁️ Ver 3D ▼`, permitiendo colapsar la tarjeta de inmediato para volver a la vista 3D despejada.

3. **Mantenimiento del Comportamiento en Escritorio:**
   * En pantallas de escritorio (`>= 1024px`), la tarjeta mantiene su despliegue lateral completo natural en el cuadrante derecho, ya que el viewport panorámico no sufre colisiones con el 3D.

---

## 12. Adaptación Estética a la Maqueta Física Escolar ("Gemelo Digital / Diorama Didáctico")

### 12.1 Análisis Visual de la Maqueta Física de Luna María
Se analizó la fotografía de la maqueta escolar artesanal elaborada para la materia de Ciencias (Luna María Estrada Nieto - 1° "D"):
1. **Cartel de Identificación Escolar:**
   * Letrero azul marino con marco celeste y papel blanco montado en dos palillos de madera verticales: *"CÉLULA VEGETAL - Presenta: Luna María Estrada Nieto - 1° 'D'"*.
2. **Pared Celular y Membrana Celular:**
   * Contenedor prismático/hexagonal de cartulina/foamy verde lima vibrante (`#4ade80`), con solapas en las esquinas en tono verde turquesa (`#0d9488` / `#10b981`) que simulan las uniones con células adyacentes.
   * Dos letreros en palillos: `MEMBRANA CELULAR` y `MEMBRANA PLASMÁTICA`.
3. **Citoplasma (Piso Interior):**
   * Base de verde pasto claro (`#86efac` / `#22c55e`). Letrerito: `CITOPLASMA`.
4. **Núcleo y Nucléolo:**
   * Semiesfera de unicel pintada de amarillo vivo (`#facc15`), con un corte transversal a 90°.
   * En el centro del corte, una esfera roja brillante (`#ef4444`) como Nucléolo. Letreros: `NÚCLEO` y `NUCLÉOLO`.
5. **Vacuola Central:**
   * Foamy azul cielo / celeste (`#38bdf8`) con ribete azul rey (`#1d4ed8`), de silueta lobulada/ameboide alargada en el centro. Letrero: `VACUOLA`.
6. **Mitocondrias:**
   * Estructuras ovaladas con borde exterior rosa fucsia (`#ec4899`) e interior plegado en zigzag con tiras de foamy rosa pastel emulando las crestas. Letrero: `MITOCONDRIA`.
7. **Cloroplastos:**
   * Óvalos verde bosque (`#166534`) con tapa verde medio y estrías grabadas de tilacoides/granas. Letrero: `CLOROPLASTO`.
8. **Aparato de Golgi:**
   * Tiras de foamy naranja intenso (`#f97316`) plegadas en capas horizontales onduladas. Letrero: `APARATO DE GOLGI`.
9. **Retículo Endoplasmático y Ribosomas:**
   * Láminas de foamy morado/violeta (`#7c3aed`) plegadas en acordeón alrededor del núcleo. Letrero: `RETÍCULA ENDOPLASMÁTICA` y `RIBOSOMAS`.
10. **Organelos Adicionales Presentes en la Maqueta:**
    * **Amiloplasto:** Espiral de foamy lila/morado (`#8b5cf6`). Letrero: `AMILOPLASTO`.
    * **Peroxisoma:** Estructura esférica con letrero: `PEROXISOMA`.
11. **Elemento Icónico Escolar:**
    * Cada estructura cuenta con un **letrerito rectangular blanco clavado en un palillo de madera**, con tipografía mayúscula negrita y borde de color.

### 12.2 Comparativa: Look Actual vs. Look Maqueta Física

| Aspecto | Look Actual (Digital) | Look Propuesto (Maqueta Física de Luna) |
| :--- | :--- | :--- |
| **Atmósfera / Fondo** | Espacial oscuro, negro cósmico (`#060a0d`), neones bioluminiscentes. | Estudio / Taller de Ciencias iluminado, limpio y cálido (fondo gris suave / menta claro o mesa de laboratorio). |
| **Materiales 3D** | Vidrio reflectivo, brillo metálico, emisión neón tipo ciencia ficción. | Texturas táctiles estilo foamy mate, unicel texturizado, plastilina y cartulina con sombras suaves y colores vivos. |
| **Pared Celular** | Cristal esmeralda translúcido con rejilla de celulosa futurista. | Prisma de foamy verde lima brillante con solapas en las esquinas como la maqueta física. |
| **Núcleo & Nucléolo** | Esfera violeta/rosa con poros luminosos. | Semiesfera amarilla de unicel con cuña abierta y esfera roja brillante en el centro. |
| **Mitocondrias** | Cápsulas naranjas transparentes con anillos de fuego. | Cápsulas rosa mexicano con acordeón interior rosa pastel. |
| **Identificadores Visuales** | Baliza láser circular abstracta flotante. | **Banderines 3D en palillos de madera** clavados en cada organelo (¡exactos a la maqueta!). |
| **Cobertura de Organelos** | 10 organelos base. | Añadir **Amiloplasto** y **Peroxisoma**, coincidiendo al 100% con los letreros de su maqueta. |
| **Cartel Principal** | Tipografía digital minimalista. | Cartel azul idéntico al de su maqueta: *"CÉLULA VEGETAL - Presenta: Luna María Estrada Nieto - 1° 'D'"*. |

### 12.3 Plan de Implementación por Fases

1. **Fase 1: Armonización de Paleta y Materiales 3D (Colores Exactos de la Maqueta):**
   * Ajustar colores base de Three.js a los tonos de foamy/cartulina de la maqueta (Amarillo en Núcleo, Rojo en Nucléolo, Rosa/Fucsia en Mitocondrias, Naranja en Golgi, Morado en Retículo y Amiloplasto, Azul cielo con borde azul marino en Vacuola, Verde lima con esquinas en Pared Celular).
   * Modificar shaders y materiales (`roughness: 0.7 - 0.85`, `metalness: 0.05 - 0.1`) para dar acabado táctil y cálido de maqueta escolar (foamy/clay), eliminando el exceso de brillo metálico.
2. **Fase 2: Banderines Didácticos 3D con Palillos de Madera:**
   * Modelar en Three.js los letreritos con palillo (`THREE.CylinderGeometry` color madera `#d4a373` + cartelito blanco con borde y texto) sobre cada organelo.
   * Cuando se hace scroll hacia un organelo, su letrerito hace una suave animación de saludo / elevación para guiar la atención de la clase.
3. **Fase 3: Nuevos Organelos Didácticos (Amiloplasto y Peroxisoma):**
   * Agregar la espiral de foamy del Amiloplasto y la vesícula del Peroxisoma en la célula 3D con sus respectivas tarjetas explicativas escolares.
4. **Fase 4: Entorno de Estudio Escolar y UI Didáctica:**
   * Ofrecer un interruptor de tema o cambiar la atmósfera general a un entorno luminoso, amigable y escolar, con el cartel principal azul de Luna María en la portada y header ("1° 'D'").### 12.4 Registro de Ejecución y Transformación Técnica

1. **Estructura HTML (`index.html`):**
   * Incorporación de las tarjetas HUD 11 (`Amiloplasto` - #8b5cf6) y 12 (`Peroxisoma` - #0d9488) con conteo unificado `01 / 12` a `12 / 12`.
   * Creación del cartel escolar con marco azul sobre dos palillos de madera en la sección hero: *"CÉLULA VEGETAL - Presenta: Luna María Estrada Nieto - 1° 'D'"*.
   * Actualización de secciones disparadoras (`#step-amyloplast` y `#step-peroxisome`) y botones de navegación rápida en `.presenter-dock`.

2. **Modelo 3D y Shaders en Three.js (`js/app.js`):**
   * Adaptación de materiales a texturas mate artesanales estilo foamy y unicel (`roughness: 0.70-0.85`, `metalness: 0.05`).
   * Remodelado de Pared Celular en prisma verde lima (`0x4ade80`) con 6 solapas exteriores en verde turquesa (`0x0d9488`).
   * Remodelado del Núcleo en semiesfera de unicel amarillo vibrante (`0xfacc15`) con corte transversal a 90° y esfera roja rubí de Nucléolo (`0xef4444`).
   * Remodelado de la Vacuola Central con silueta lobulada en azul cielo (`0x38bdf8`) y borde/ribete azul rey (`0x1d4ed8`).
   * Remodelado de Mitocondrias con cápsula exterior rosa fucsia (`0xec4899`) e interior en zigzag rosa pastel (`0xfbcfe8`).
   * Modelado del Amiloplasto como rollo en espiral de foamy morado (`0x8b5cf6`).
   * Modelado del Peroxisoma como vesícula esférica verde azulado (`0x0d9488`).
   * Implementación de Banderines 3D con Palillos de Madera (`build3DToothpickSignposts`) sobre cada organelo con letreros canvas texturizados en alta resolución.
   * Configuración de cámara e iluminación de estudio de ciencias cálido.

3. **Estilos y Ajustes Visuales (`css/styles.css`):**
   * Estilización del cartel escolar artesanal en `#step-hero` con marco azul tridimensional, cartulina blanca y palillos de bambú.
   * Ajuste de colores en variables CSS y dock navigation pills.

---

## 14. Soporte Dual de Modo Claro y Modo Oscuro (Light Mode & Dark Mode)

### 14.1 Contexto y Pregunta del Usuario
* **Pregunta:** *"está hecho para light mode o también tiene configurado para dark mode?"*
* **Diagnóstico:** Inicialmente la aplicación fue construida con una base oscura (primero negro espacial, luego slate moderno `#0f172a`) para maximizar el contraste de los organelos 3D. No contaba con un sistema dinámico de cambio entre Modo Claro y Modo Oscuro.
* **Justificación Didáctica y Escolar:**
  - En **proyectores escolares de aula** y pantallas en salones con luz natural o sol de mediodía, un **Modo Claro (Fondo blanco/marfil de laboratorio `#f8fafc`)** proporciona una legibilidad y contraste muy superiores para los compañeros y maestros sentados en filas traseras.
  - En **tablets personales, computadoras o salones con persianas cerradas**, el **Modo Oscuro (Slate Grafito `#0f172a`)** ofrece una experiencia moderna, inmersiva y de descanso visual.

### 14.2 Arquitectura del Sistema Dual de Temas
1. **Sincronización Web + Three.js WebGL:**
   * **Variables CSS:** Declaración de variables para `[data-theme="light"]` y `[data-theme="dark"]` (`--bg-primary`, `--bg-card`, `--text-primary`, `--text-secondary`, `--border-subtle`, sombras y estados de interacción).
   * **Canvas 3D WebGL:** Sincronización en tiempo real del color de niebla (`this.scene.fog.color`) y el color de borrado del renderer (`this.renderer.setClearColor`) entre `#f8fafc` (Claro) y `#0f172a` (Oscuro).
   * **Iluminación PBR:** Calibración de intensidad de luz ambiental y direccional para evitar sobreexposición en fondo claro o subexposición en fondo oscuro.
2. **Control en Barra Superior:**
   * Botón interactivo en el header con icono y texto (`☀️ Modo Claro` / `🌙 Modo Oscuro`).
   * Persistencia en `localStorage` (`plant_cell_theme`) y detección inteligente de la preferencia del sistema operativo del usuario (`prefers-color-scheme`).


### 14.3 Verificación y Estado
* Botón en header funcional con iconos intuitivos (☀️ / 🌙).
* Sincronización Three.js en caliente (`fog` y `clearColor`) sin necesidad de recargar la página.
* Compatibilidad total con proyectores escolares y pantallas móviles.


---

## 15. Rediseño Definitivo: Exclusividad en Light Mode, Cero Neón y Estética Táctil de Foamy

### 15.1 Requerimientos Específicos del Usuario
1. **Exclusividad de Modo Claro (Light Mode):**
   * Eliminación absoluta del Dark Mode y de su selector en la interfaz. La aplicación operará únicamente sobre un fondo blanco puro de laboratorio/estudio (`#ffffff`).
2. **Erradicación de Efectos Neón y Resplandores Cibernéticos:**
   * Cero luces fluorescentes, cero sombras o halos de color neón (`box-shadow: 0 0 ...`, `text-shadow`), cero destellos futuristas.
   * Supresión total de la propiedad `emissive` en todos los materiales de Three.js (`emissive: 0x000000`, `emissiveIntensity: 0`).
3. **Paleta y Textura Fiel a los Recortes de Foamy (Goma EVA) de la Maqueta:**
   * Materiales físicos PBR mate tipo foamy artesanal (`roughness: 0.7 - 0.85`, `metalness: 0.0`), con colores vivos, sólidos y saturados que contrasten de manera nítida sobre el fondo blanco:
     - **Pared Celular:** Verde manzana foamy (`#22c55e`) con borde lima (`#86efac`) y biseles verde hoja (`#15803d`).
     - **Citoplasma:** Plancha de foamy verde pasto limpio (`#86efac`).
     - **Núcleo y Nucléolo:** Rueda cilíndrica de foamy amarillo cálido (`#eab308`) y esfera roja central (`#dc2626`).
     - **Vacuola Central:** Charco de foamy azul cielo brillante (`#38bdf8`) con ribete azul rey (`#0284c7`).
     - **Mitocondrias:** Cápsula exterior de foamy magenta brillante (`#db2777`) con crestas interiores zigzag rosa pastel (`#fbcfe8`).
     - **Cloroplastos:** Cápsulas verde bosque (`#15803d`) con estrías de foamy verde limón (`#4ade80`).
     - **Aparato de Golgi:** Tiras dobladas de foamy naranja vivo (`#ea580c`).
     - **Retículo Endoplásmico:** Tiras dobladas de foamy morado real (`#7c3aed`).
     - **Ribosomas:** Cuentas/bolitas sólidas de foamy rojo (`#dc2626`).
     - **Amiloplasto:** Rollo en espiral de foamy violeta (`#8b5cf6`).
     - **Peroxisoma:** Esfera de foamy verde azulado / teal (`#0d9488`).
4. **Mecanismo de Transparencia Selectiva:**
   * Al enfocar un organelo particular:
     - El organelo protagónico permanece **100% sólido y opaco (`opacity: 1.0`, `transparent: false`)**, con su color vivo y textura mate.
     - **Todos los demás organelos se vuelven traslúcidos (`transparent: true`, `opacity: 0.15`)**, funcionando como una silueta o referencia espacial limpia sin estorbar ni distraer.
     - El citoplasma y la pared celular atenúan su opacidad (`opacity: 0.20 - 0.25`) para enmarcar la célula.
   * En vista general (Overview, Hero o Quiz):
     - Todos los organelos vuelven a su estado 100% sólido, opaco y colorido.
5. **Tipografía y UI de Alto Contraste:**
   * Textos en azul pizarra profundo / carbón (`#0f172a`, `#1e293b`) sobre tarjetas blancas limpias (`#ffffff`) con sutiles sombras neutras de elevación y bordes suaves.

### 15.2 Estado de Implementación y Verificación Técnica
1. **Eliminación Total de Modo Oscuro:**
   * Se retiró el botón `#theme-toggle-btn` del encabezado (`index.html`).
   * Se eliminaron las reglas `[data-theme="dark"]` y `[data-theme="light"]` en `css/styles.css`, consolidando un esquema limpio de variables CSS de modo claro nativo.
   * Se purgaron los métodos `initThemeEngine()` y `applyTheme()` en `js/app.js`.
2. **Materiales de Foamy Táctil (Sin Neón / Sin Emissive):**
   * En `buildPlantCellModel()` y cada función generadora de organelos, se eliminó toda asignación de `emissive` y `emissiveIntensity`, fijando valores de rugosidad física (`roughness: 0.75 - 0.85`) y colores mate inspirados directamente en la maqueta escolar de Luna.
3. **Mecanismo de Transparencia Selectiva en 3D:**
   * En `activateStep()`, cuando un organelo es activado, todos los organelos inactivos se vuelven semitransparentes (`opacity: 0.14`, citoplasma `0.18`, pared `0.22`), mientras que el organelo seleccionado se mantiene 100% opaco y sólido (`opacity: 1.0`).
   * La iluminación focal y el reflector cambian de tintes de color a luz blanca neutra natural (`0xffffff`), preservando la fidelidad cromática del foamy.
   * Al regresar a Planta, Célula General o Quiz, todos los organelos restauran su opacidad a 1.0.
4. **Verificación de Sintaxis y Rendimiento:**
   * Validación con `node -c js/app.js` exitosa (código de salida 0).
   * Servidor local activo en el puerto 8000 para pruebas visuales fluidas.

---

## 16. Corrección Crítica: Solución al Desplazamiento Automático (Runaway Scroll) y Contraste de Colores

### 16.1 Diagnóstico de los Dos Problemas
1. **Desplazamiento Automático al Final (Scroll Glitch / Runaway):**
   * **Causa Raíz:** En `activateStep()`, se ejecutaba `pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })` sobre los botones del dock flotante (`.dock-pill`). Al ser `.presenter-dock` un contenedor con `position: fixed` ubicado al final del `<body>`, la función nativa `scrollIntoView()` del navegador forzaba al documento entero (`window`) a desplazarse verticalmente hacia el final de la página. Esto desencadenaba un ciclo infinito con el `IntersectionObserver`, arrastrando al usuario de golpe hasta el Quiz.
   * **Solución:** Reemplazar `pill.scrollIntoView()` por un desplazamiento horizontal contenido exclusivamente dentro del elemento padre (`dock.scrollTo({ left: ..., behavior: 'smooth' })`), impidiendo que el scroll de la ventana principal sea alterado. Configurar además `history.scrollRestoration = 'manual'`.

2. **Falta de Contraste y Colores Lavados sobre Fondo Blanco:**
   * **Causa Raíz en Three.js:**
     - La presencia de niebla blanca `scene.fog = new THREE.FogExp2(0xffffff, 0.008)` mezclaba un 20% a 25% de blanco puro sobre todos los modelos 3D a la distancia de la cámara, dejando los objetos lechosos y pálidos.
     - La intensidad acumulada de iluminación (`ambientLight: 1.45`, `sunLight: 1.3`, `fillLight: 0.85`, total 3.6+) con mapeo de tonos ACESFilmic provocaba que los tonos claros (amarillos, verde lima, celeste) se sobreexpusieran y quemaran hacia el blanco.
     - Colores de materiales demasiado claros (`#86efac`, `#facc15`, `#38bdf8`) sin suficiente saturación cromática.
   * **Causa Raíz en UI / Tipografía:**
     - Varias tarjetas y elementos de texto utilizaban variables `--card-theme-color` con tonos claros como amarillo (`#facc15`), lima (`#4ade80`), o celeste (`#38bdf8`), haciéndose prácticamente invisibles sobre las tarjetas blancas (`#ffffff`).
   * **Solución Integral:**
     - **Three.js Lighting:** Retirar la niebla blanca de la escena. Bajar la luz ambiental a `0.65`, luz solar a `0.95`, luz de relleno a `0.35`, y añadir una luz de contra / rim light (`0.45`) para recortar y definir las siluetas 3D.
     - **Paleta de Foamy Saturada (600 - 800 shades):**
       - Citoplasma: Verde manzana vivo y sólido (`#16a34a` / `#22c55e`).
       - Pared Celular: Verde bosque profundo (`#15803d`) con biseles definidos y pestañas verde azuladas (`#0f766e`).
       - Núcleo: Ámbar dorado cálido profundo (`#d97706` / `#eab308`) y corte con núcleo rojo carmesí (`#b91c1c`).
       - Vacuola: Azul cerúleo profundo (`#0284c7`) con borde azul marino (`#1e3a8a`).
       - Mitocondrias: Magenta intenso (`#be185d`) con crestas rosa vivo (`#f472b6`).
       - Cloroplastos: Verde pino oscuro (`#14532d`) con bandas lima saturadas (`#22c55e`).
       - Golgi: Naranja mandarina tostado (`#c2410c`).
       - Retículo: Morado real profundo (`#6d28d9`).
       - Ribosomas: Rojo escarlata intenso (`#b91c1c`).
       - Amiloplasto: Violeta oscuro (`#581c87`) con espiral púrpura (`#9333ea`).
       - Peroxisoma: Verde azulado oscuro (`#0f766e`).
     - **Tipografía y UI en CSS:** Todos los textos principales, resúmenes rápidos y encabezados configurados en colores profundos y accesibles (carbón pizarra `#0f172a`, `#1e293b`), garantizando contraste WCAG AAA sobre fondo blanco. Las variables de acento de las tarjetas se actualizan a tonos oscuros y vibrantes (gama 700).

### 16.2 Verificación Final
* **Scroll:** Resuelto el bug del bucle de desplazamiento; la página inicia arriba en la Planta y se navega paso a paso suavemente sin saltos al final.
* **Contraste:** Los organelos 3D y los textos se leen con total nitidez, sombras suaves y colores de foamy vibrantes sobre el lienzo blanco.
* **Sintaxis:** Comprobada con `node -c js/app.js` (código de salida 0).

---

## 17. Corrección de la Barra de Navegación, Títulos Sólidos y Contraste del Ícono

### 17.1 Diagnóstico de los Puntos Solicitados por el Usuario
1. **Ruptura de la Navegación (Dock flotante vertical):**
   * **Causa:** En `css/styles.css`, en la línea 706-710 había un fragmento huérfano con una llave de cierre extra (`}`) sin selector que provocaba un error de parseo en el motor CSS del navegador. Esto provocaba que las reglas de `.presenter-dock` se descartaran, haciendo que la barra de navegación perdiera su `position: fixed` y su `display: flex; align-items: center;`, desplegando los botones apilados verticalmente a la izquierda.
   * **Solución:** Purgar el fragmento huérfano en `css/styles.css` y asegurar explícitamente `flex-direction: row; flex-wrap: nowrap;` en `.presenter-dock` para garantizar que la barra permanezca siempre horizontal, flotante y centrada en la parte inferior.

2. **Eliminación del Gradiente y de la palabra "3D" en el Encabezado:**
   * **Causa:** `.brand-title` tenía `background: linear-gradient(90deg, #15803d, #0284c7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;` y decía "Célula Vegetal 3D".
   * **Solución:** Retirar el gradiente y aplicar un color sólido de alto contraste (`#15803d` / verde botánico profundo). Modificar el texto en `index.html` a "Célula Vegetal" únicamente.

3. **Contraste del Ícono de la Planta en el Encabezado:**
   * **Causa:** El contenedor `.brand-icon` tenía fondo verde (`#16a34a`) y dentro un emoji `🌱` (brote verde). Al ser verde sobre verde, el brote era casi invisible.
   * **Solución:** Reemplazar el emoji por un ícono vectorial SVG nítido en blanco puro (`#ffffff`) sobre el fondo verde bosque (`#15803d`), logrando un contraste inmediato y definido de 4.8:1.

4. **Eliminación del Gradiente y de "3D" en el Título Principal (Hero):**
   * **Causa:** En `.hero-title span`, el texto "Célula Vegetal 3D" tenía un gradiente tricolor con relleno transparente.
   * **Solución:** Cambiar el texto a "Célula Vegetal" (sin "3D") y retirar el gradiente en CSS, fijándolo en un color verde sólido profundo (`#15803d`), haciendo pareja con la primera línea en carbón pizarra (`#0f172a`).

### 17.2 Estado de Verificación
* **Navegación:** `css/styles.css` reparado (0 llaves desparejadas). La barra flotante horizontal centrada en la parte inferior está 100% restaurada con `flex-direction: row` y `flex-wrap: nowrap`.
* **Títulos:** Removidos los gradientes y el sufijo "3D" tanto en el encabezado superior como en el título de la portada. Ambos textos se muestran en colores sólidos y contrastantes.
* **Ícono de Planta:** Reemplazado el emoji por un SVG de plántula blanca nítida sobre fondo verde bosque (`#15803d`).
* **Sintaxis:** Validación JS y CSS limpia. Servidor activo en puerto 8000.

---

## 18. Ajustes de Identidad Visual: Tonos Azules, Contraste de Quiz, Botones Planos y Favicon

### 18.1 Desglose de Puntos Requeridos
1. **Píldora Inicial en Tonos Azules (`.hero-badge`):**
   * Cambiar el fondo y borde a tonalidades azul cerúleo (`rgba(2, 132, 199, 0.09)`, borde `rgba(2, 132, 199, 0.3)`) y el texto a azul de alto contraste (`#0369a1`).
2. **Título "Célula Vegetal" en Azul:**
   * Cambiar `.hero-title span` y `.brand-title` al mismo azul cerúleo vibrante (`#0284c7`), despegándolo cromáticamente de las hojas verdes de la planta 3D en el fondo.
3. **Fondo del Avatar de la Alumna en Azul:**
   * Modificar `.presenter-avatar` de verde a azul (`#0284c7`) para unificar la identidad de la portada con la materia y el grupo.
4. **Tarjetas Didácticas ("Dato Curioso"):**
   * Reemplazar "💡 Dato Curioso Escolar" por "💡 Dato Curioso" en todas las tarjetas de organelos en `index.html`.
5. **Contraste de Aciertos y Errores en el Quiz:**
   * Reparar el texto del cuadro `.quiz-feedback`:
     - Aciertos: texto verde oscuro esmeralda (`#065f46`) sobre fondo verde menta suave (`#ecfdf5`), con borde sólido `#10b981`.
     - Errores: texto rojo carmesí oscuro (`#991b1b`) sobre fondo rosa pastel suave (`#fef2f2`), con borde sólido `#ef4444`.
     - Opciones seleccionadas con bordes y tipografía con peso 700 para máxima legibilidad.
6. **Botones Planos sin Gradientes:**
   * En `.quiz-next-btn` y `.btn-primary`, retirar `linear-gradient` y aplicar color plano sólido azul cerúleo (`#0284c7`), con hover a `#0369a1`.
7. **Ícono Plano y Favicon del Sitio:**
   * Retirar `box-shadow` de `.brand-icon` para dejarlo totalmente plano.
   * Incrustar en `<head>` de `index.html` el favicon SVG con la plántula blanca sobre el recuadro verde plano, eliminando errores 404 de `favicon.ico`.
8. **Pie de Página ("Presentado por..."):**
   * En `.footer-student`, cambiar el color de verde a azul (`#0284c7`), unificando la firma de Luna con la portada.

### 18.2 Verificación Final de los 8 Puntos
1. ✅ **Píldora inicial:** Actualizada a fondo celeste traslúcido y texto azul cerúleo profundo (`#0369a1`).
2. ✅ **Título "Célula Vegetal":** En color plano azul cerúleo (`#0284c7`), contrastando inmediatamente contra el verde de la planta 3D.
3. ✅ **Círculo de la Alumna:** Avatar en `#0284c7`, en sintonía con la píldora superior.
4. ✅ **Dato Curioso:** Actualizadas las 14 tarjetas retirando la palabra "Escolar".
5. ✅ **Quiz de Alto Contraste:** Textos de retroalimentación en verde bosque (`#065f46`) y rojo oscuro (`#991b1b`) con bordes sólidos y fondos contrastados.
6. ✅ **Botón Plano:** Retirado el gradiente en `.quiz-next-btn` y `.btn-primary`, aplicando color plano `#0284c7`.
7. ✅ **Ícono Plano y Favicon:** Retirada la sombra verde de `.brand-icon`; incrustado el favicon SVG nativo en el `<head>`.
8. ✅ **Firma en el Footer:** "Presentado por: Luna María Estrada Nieto - 1° 'D'" cambiado a azul `#0284c7`.
9. ✅ **Validación:** Sintaxis JS (`node -c js/app.js`) y balance de llaves CSS con 0 errores.

---

## 19. Análisis de Contraste, Accesibilidad WCAG 2.2 y Propuestas Cromáticas para la Portada

### 19.1 Diagnóstico Visual y Óptico de la Portada Actual
Al examinar la captura actual (`media_1794273077092_37bf687a.jpg`), se evidencia por qué la portada no resulta plenamente convincente ni cómoda a la vista:

1. **Colisión Espacial de Figura y Fondo (Texto vs. Hojas 3D):**
   * Las hojas de la planta 3D crecen verticalmente y se intersectan directamente detrás de la palabra `"Célula Vegetal"`. Específicamente, las letras `"Veg"` quedan partidas por la hoja verde media.
   * Cualquier texto que deba leerse simultáneamente sobre un fondo blanco puro (`#ffffff`) y una hoja verde tridimensional (`#16a34a`) sufre de confusión perceptiva: un color que contrasta bien sobre blanco pierde contraste sobre verde, y viceversa.
2. **Evaluación de Accesibilidad y Ratios de Contraste:**
   * El azul cerúleo actual (`#0284c7`) sobre fondo blanco ofrece un ratio de **4.64:1** (apenas por encima del mínimo WCAG AA de 4.5:1 para texto normal, pero insuficiente para dar peso e impacto rotundo).
   * Frente al verde de la hoja de la planta (`#15803d` / `#16a34a`), el ratio de contraste relativo cae a **1.8:1**, creando un choque cromático difuso donde la tipografía pierde definición en sus bordes.
3. **Falta de Solidez en Elementos Secundarios:**
   * La píldora superior y la tarjeta de Luna cuentan con bordes y fondos en cian/celeste muy claros que se sienten flotantes o desarticulados de la estética artesanal de la maqueta física de Luna.

### 19.2 Las 4 Propuestas Cromáticas de Alto Contraste y Accesibilidad (WCAG AAA)

#### Propuesta 1: "Azul Cobalto Escolar & Tinta Profunda" (Fiel al letrero físico de Luna - Recomendada)
* **Concepto:** Se basa directamente en el cartel artesanal de la maqueta de Luna (marco azul cobalto con texto en marcador oscuro sobre fondo blanco).
* **Valores Cromáticos:**
  * Línea 1 (*"Viaje al Interior de la"*): **Carbón Pizarra Profundo (`#0f172a`)** — Ratio: **16.5:1 (WCAG AAA)**.
  * Línea 2 (*"Célula Vegetal"*): **Azul Cobalto / Real Escolar (`#1e40af` o `#1d4ed8`)** — Ratio: **8.3:1 (WCAG AAA)** sobre blanco.
  * Píldora Superior: Fondo blanco con borde azul `#1e40af` y texto `#1e40af` (8.3:1).
  * Tarjeta de Luna: Borde nítido `#94a3b8`, avatar y texto en `#1e40af`.
  * Botón CTA (*"Comenzar Zoom"*): Fondo sólido `#1d4ed8` con texto blanco `#ffffff` (ratio 5.6:1).
* **Sensación:** Muy formal, escolar, limpio, con excelente jerarquía visual y gran fidelidad a la maqueta física.

#### Propuesta 2: "Tinta Pizarra Unificada & Acentos Botánicos" (Minimalista Editorial)
* **Concepto:** Unifica todo el título en un solo color oscuro de máxima legibilidad, eliminando la división bicolor que compite con la planta.
* **Valores Cromáticos:**
  * Título Completo (*"Viaje al Interior de la Célula Vegetal"*): **Carbón Pizarra Sólido (`#0f172a`)** al 100%, con la segunda línea en peso extra bold (`800`).
  * Ratio sobre blanco: **16.5:1 (Máximo nivel WCAG AAA)**.
  * Píldora Superior: Fondo marfil neutro `#f8fafc`, borde `#cbd5e1`, texto `#0f172a`.
  * Botón CTA y Acentos: Verde Bosque Botánico Sólido (`#15803d` - ratio 5.1:1).
* **Sensación:** Editorial de libro de ciencias premium, elegante, sin fatiga visual.

#### Propuesta 3: "Terracota Cálido / Ámbar Escolar" (Contraste Complementario)
* **Concepto:** Aprovecha el círculo cromático donde el complementario directo del verde de las hojas es el naranja/terracota (haciendo eco de la maceta de la planta y de la base de cartón de la maqueta).
* **Valores Cromáticos:**
  * Línea 1 (*"Viaje al Interior de la"*): **Carbón Pizarra (`#0f172a`)**.
  * Línea 2 (*"Célula Vegetal"*): **Terracota / Óxido Profundo (`#c2410c`)** o **Ámbar Escolar (`#b45309`)**.
  * Ratio sobre blanco: **5.8:1 a 6.2:1 (WCAG AA/AAA)**.
  * Ratio contra las hojas verdes: Alto contraste por temperatura (cálido vs. frío).
  * Botón CTA: `#c2410c` sólido con texto blanco.
* **Sensación:** Cálido, didáctico, biológico (tierra y vida vegetal), dinámico y alegre.

#### Propuesta 4: "Verde Bosque Siempreverde" (Monocromía Botánica Pura)
* **Concepto:** Tonalidad verde botánica pero en su versión más oscura y saturada posible para garantizar máxima legibilidad sobre blanco y diferenciarse de las hojas claras.
* **Valores Cromáticos:**
  * Línea 1: `#0f172a`.
  * Línea 2 (*"Célula Vegetal"*): **Verde Bosque Profundo (`#14532d` - Green 900)**.
  * Ratio sobre blanco: **9.2:1 (Certificado WCAG AAA)**.
  * Botón CTA: `#15803d` con texto blanco.
* **Sensación:** 100% natural, científico y coherente con el reino vegetal.

### 19.3 Solución Espacial Complementaria (Composición Limpia)
Para que cualquier paleta funcione al 100% sin importar el dispositivo:
* **Ajuste de Composición 3D Inicial:** Descender ligeramente la posición vertical de la planta en Three.js al inicio (`plantGroup.position.y = -7.4` en lugar de `-6.2`), de modo que las hojas sirvan de pedestal botánico justo por debajo del título, dejando el área del texto completamente libre sobre fondo blanco puro.
* **Halo de Respiro Tipográfico:** Un filtro sutil `drop-shadow(0 0 12px rgba(255, 255, 255, 0.95))` que asegure que ninguna hoja opaque los caracteres.

---

## 20. Implementación de la Opción 1: "Azul Cobalto Escolar & Tinta Profunda" y Encuadre 3D Libre de Colisiones

### 20.1 Decisión del Usuario
* El usuario seleccionó la **Opción 1**: Paleta inspirada en el letrero artesanal de la maqueta de Luna María, garantizando la máxima accesibilidad (WCAG AAA) y contraste rotundo sobre blanco.

### 20.2 Plan de Ejecución Técnica
1. **Actualización de Estilos en `css/styles.css`:**
   * `.hero-title span`: Color plano azul cobalto profundo (`#1e40af`, ratio de contraste 8.3:1 sobre blanco puro, grado WCAG AAA).
   * `.hero-title`: Sombra de halo blanco de alta dispersión (`text-shadow: 0 2px 14px rgba(255, 255, 255, 0.95), 0 0 28px rgba(255, 255, 255, 0.9)`) para blindar ópticamente las letras ante cualquier solapamiento.
   * `.hero-badge`: Fondo blanco suave con borde azul cobalto `rgba(30, 64, 175, 0.35)` y texto `#1e40af` en negrita.
   * `.brand-title`: Color `#1e40af`.
   * `.presenter-credit-card`: Hover con borde `#1e40af`, avatar en `#1e40af`, texto de escuela/grupo en `#1e40af`.
   * `.btn-primary` y `.quiz-next-btn`: Color de fondo azul real profundo `#1d4ed8` con hover a `#1e40af` y texto en blanco puro `#ffffff` (ratio 5.6:1).
   * `.quiz-score-number` y `.footer-student`: `#1e40af`.

2. **Ajuste Espacial en Three.js (`js/app.js`):**
   * Desplazar `plantGroup.position.y` a `-3.4` (anteriormente en `-1.0`).
   * Calibrar la cámara del paso `'plant'` (`camPos: { x: 0, y: 1.8, z: 27 }`, `lookAt: { x: 0, y: 0.5, z: 0 }`) para que las puntas de las hojas queden situadas en el área intermedia entre la descripción y la tarjeta de Luna, liberando el 100% del área del título en blanco puro.
   * Ajustar la cámara de `'zoom-leaf'` para seguir la nueva coordenada de la hoja objetivo (`camPos: { x: 0.5, y: -0.2, z: 8.5 }`, `lookAt: { x: 0.2, y: -0.4, z: 0 }`).

3. **Verificación y Pruebas:**
   * Comprobación sintáctica con `node -c js/app.js`.
   * Verificación del balance de llaves CSS.
   * Confirmación visual en el servidor local.

---

## 21. Refinamiento de la Tarjeta Colapsada (Compact Mode): Espaciados Proporcionales, Botones Concisos y Distribución Visual Armoniosa

### 21.1 Diagnóstico de la Tarjeta Colapsada Actual
A partir de la captura enviada por el usuario (`media_1794273461858_ed7de0b7.png`):
1. **Espaciados Asimétricos y Título Pegado al Borde Inferior:**
   * La propiedad `max-height: 80px` o `82px` con `overflow: hidden` forzaba una altura demasiado rígida. El título del organelo (*"Hacia la Hoja"*) quedaba literalmente pegado al borde inferior de la tarjeta, con padding inferior nulo o estrangulado.
2. **Texto Excesivamente Largo en el Botón:**
   * La etiqueta `"📖 Ver Información ▲"` (15 caracteres) ocupaba demasiado ancho horizontal (~140px), compitiendo con la insignia de analogía escolar y apretando la cabecera en pantallas de tablet o móviles.
3. **Distribución Dispersa de las Insignias:**
   * El número de paso (`ZOOM` / `01 / 12`) y el badge de analogía escolar (`🔬 Viaje Microscópico`) se separaban de forma irregular debido a `justify-content: space-between` con 3 elementos hijos directos en `.card-header`.

### 21.3 Verificación y Estado
* **Botones:** Actualizados a `"Mostrar"` (`📖 Mostrar ▲`) y `"Ocultar"` (`👁️ Ocultar ▼`) en todos los disparadores y controladores de estado en `js/app.js`.
* **Proporciones y Espaciado:** Symmetrical vertical centering con `display: flex; flex-direction: column; justify-content: center;`, eliminando cualquier corte o estrangulamiento del título.
* **Alineación:** Las insignias de número de paso y analogía escolar se agrupan ordenadamente a la izquierda, y el botón se alinea al extremo derecho.
* **Sintaxis:** JS (`node -c js/app.js`) y CSS balance con 0 errores.

---

## 22. Optimización del Indicador de Zoom (Pill HUD): Línea Única y Geometría Circular Fija del Indicador

### 22.1 Diagnóstico de la Incidencia Visual
A partir de la captura enviada por el usuario (`media_1794274162433_a49f38ad.png`):
1. **Salto de Línea Indeseado:**
   * La píldora indicadora superior (`.zoom-status-hud`) carecía de la regla `white-space: nowrap;` y `width: max-content;`. Al recibir títulos descriptivos extensos como `"Célula Vegetal (Corte Transversal)"`, el texto quebraba en dos líneas ("Célula Vegetal (Corte" y "Transversal)"), rompiendo la armonía horizontal del pill.
2. **Deformación Elíptica del Círculo Verde:**
   * El elemento `.zoom-status-dot` no contaba con `flex-shrink: 0`, `aspect-ratio: 1 / 1` ni límites de dimensión fijos (`min-width` / `min-height`). Al expandirse la altura del texto en dos líneas, el motor de renderizado flexbox estiraba el círculo verticalmente convirtiéndolo en un óvalo alargado.

### 22.2 Plan de Corrección Técnica
1. **Línea Única Forzada y Elipsis Inteligente:**
   * Aplicar `white-space: nowrap;`, `flex-wrap: nowrap;` y `width: max-content;` en `.zoom-status-hud`.
   * En `#zoom-stage-name`, aplicar `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` para garantizar que nunca quiebre en dos renglones bajo ninguna resolución o tamaño de pantalla.
2. **Fijación Geométrica Inmutable del Círculo:**
   * Configurar `.zoom-status-dot` con dimensiones estrictas: `width: 8px; height: 8px; min-width: 8px; min-height: 8px; max-width: 8px; max-height: 8px; aspect-ratio: 1 / 1; border-radius: 50%; flex-shrink: 0; display: block;`.
   * Garantizar que el punto verde permanezca siempre como una circunferencia perfecta, sin deformaciones por flexbox.
### 22.3 Verificación y Estado
* **Línea Única:** `.zoom-status-hud` y `#zoom-stage-name` configurados con `white-space: nowrap;`, `width: max-content;` y elipsis inteligente, impidiendo cualquier quiebre en dos líneas.
* **Círculo Verde Inmutable:** `.zoom-status-dot` fijado con `width: 8px; height: 8px; min-width: 8px; min-height: 8px; aspect-ratio: 1 / 1; border-radius: 50%; flex-shrink: 0;`, garantizando una forma circular 100% simétrica y constante sin deformación elíptica.
* **Sintaxis:** Validación CSS y JS con 0 errores.

---

## 23. Reducción y Optimización de Paddings en Tarjetas HUD (Compactas y Desplegadas)

### 23.1 Diagnóstico de la Inspección de Elementos
A partir de la captura del inspector de DevTools enviada por el usuario (`media_1794274458684_b2c80178.png`):
* El contenedor `article.hud-card.is-active.is-compact` (352.5px x 84px) presentaba un padding lateral excesivo (`1.25rem` / ~20px), restando ~40px de espacio útil a la cabecera.
* Como resultado, la insignia escolar (*"Las Cocinas Solares"*) y el botón (*"Mostrar"*) quedaban muy ajustados hacia el centro.
* El padding vertical (`0.75rem` / `0.85rem`) generaba una barra de 84px de alto, ocupando más espacio vertical del necesario.

### 23.3 Verificación y Estado
* **Modo Compacto:** Padding reducido a `0.4rem 0.75rem` en móviles y `0.45rem 0.85rem` en tablets, liberando más de 16px de espacio horizontal y reduciendo la altura de 84px a 66px–72px.
* **Modo Desplegado:** Padding optimizado a `0.85rem 1rem` en móviles y `1.4rem 1.7rem` en escritorio.
* **Sintaxis:** Validación CSS y JS con 0 errores.

---

## 24. Unificación Absoluta de Paddings (Tarjeta Abierta y Cerrada Idénticas)

### 24.1 Requerimiento Específico del Usuario
* *"que ese padding que ajustaste sea tanto para la card cerrada que abierta, por que ahora están diferentes, que sea igual"*
* La tarjeta compacta (`.is-compact`) y la tarjeta abierta/desplegada (`.is-expanded` / base `.hud-card`) deben compartir exactamente el mismo padding, eliminando cualquier discrepancia dimensional o salto horizontal durante la transición.

### 24.2 Plan de Unificación Cromática y Geométrica
1. **Paddings Idénticos en Todos los Estados:**
   * **Móvil (< 767px):**
     * Abierta (`.hud-card`, `.is-expanded`): `padding: 0.4rem 0.75rem;`
     * Cerrada (`.is-compact`): `padding: 0.4rem 0.75rem !important;`
   * **Tablets (768px - 1023px):**
     * Abierta (`.hud-card`, `.is-expanded`): `padding: 0.45rem 0.85rem;`
     * Cerrada (`.is-compact`): `padding: 0.45rem 0.85rem !important;`
   * **Escritorio / Base (> 1024px):**
     * Abierta (`.hud-card`, `.is-expanded`): `padding: 0.45rem 0.85rem;`
     * Cerrada (`.is-compact`): `padding: 0.45rem 0.85rem !important;`
### 24.3 Verificación y Estado
* **Paddings 100% Homogéneos:** Tanto en estado cerrado (`.is-compact`) como en estado abierto (`.is-expanded` / `.hud-card`), el padding asignado es rigurosamente el mismo (`0.4rem 0.75rem` en móviles y `0.45rem 0.85rem` en tablets y escritorio).
* **Transición Limpia:** Al expandir o colapsar con los botones `"Mostrar"` / `"Ocultar"`, el contenido mantiene su alineación horizontal estricta sin saltos ni desfasajes.
* **Sintaxis:** Validación CSS y JS con 0 errores.










