# Bitácora de Planeación: Proyecto Célula Vegetal Interactiva (Scrollytelling)

## 1. Resumen Ejecutivo y Objetivos

* **Propósito:** Desarrollar una aplicación web interactiva y altamente visual basada en la técnica de *scrollytelling* (narración guiada por scroll), orientada a explicar la estructura y los organelos de la célula vegetal.
* **Audiencia Meta:** Proyecto escolar de educación básica (estudiantes de ~12 años / 1° de secundaria).
* **Presentadora:** Niña de 12 años que expondrá frente a su clase y profesores.
* **Decisiones de Diseño Confirmadas:**
  * **Estilo Visual:** Modo Bioluminiscente / Noche Científica (Fondo oscuro tipo laboratorio espacial/microscopio `#090e11` / `#0f172a`, con organelos brillantes en tonos neón botánicos: esmeralda, cian, dorado, magenta y púrpura resplandecientes). Ideal para proyectores y pantallas de tabletas con alto contraste.
  * **Herramientas de Exposición:** Dock de navegación rápida por organelo para la expositora, botón de pantalla completa y Mini-Quiz interactivo al final ("Desafío Celular") con retroalimentación inmediata para involucrar al grupo.
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
