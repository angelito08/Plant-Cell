/**
 * Plant Cell 3D Scrollytelling Experience
 * Three.js WebGL Controller & Scrollytelling Engine
 * 
 * Features:
 * - Macro to micro 3D flight (Plant -> Leaf -> 3D Plant Cell Cutaway)
 * - Full-screen 3D WebGL rendering with PBR materials & lighting
 * - Dynamic HUD narrative cards that appear and disappear per organelle
 * - Interactive touch/mouse tilt controls for live presentation
 * - Presenter quick-jump dock & fullscreen mode
 * - Integrated educational trivia quiz with Web Audio sound effects
 * 
 * Presenter: Luna María Estrada Nieto | Escuela Secundaria Federal #60
 */

document.addEventListener('DOMContentLoaded', () => {
  const cellApp = new PlantCell3DApp();
  cellApp.init();
});

class PlantCell3DApp {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.container = document.getElementById('webgl-canvas-container');
    this.hudCards = document.querySelectorAll('.hud-card');
    this.dockPills = document.querySelectorAll('.dock-pill');
    this.stepTriggers = document.querySelectorAll('.scroll-step-trigger, .quiz-section, #step-quiz');
    this.progressFill = document.getElementById('progress-fill');
    this.zoomHud = document.getElementById('zoom-status-hud');
    this.zoomText = document.getElementById('zoom-stage-name');

    // 3D Engine State
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.plantGroup = null;
    this.cellGroup = null;
    this.organelles = {};
    this.pointLights = {};
    this.textures = {};

    // Dynamic Organelle Spotlight & Minimalist Focus Marker
    this.organelleSpotlight = null;
    this.organelleFocusLight = null;
    this.spotlightTarget = null;
    this.beaconGroup = null;
    this.beaconInnerRing = null;
    this.beaconInnerMat = null;
    this.targetBeaconPos = new THREE.Vector3(0, 0, 0);

    // Camera Motion Coordinates (x, y, z)
    this.currentCamPos = { x: 0, y: 3, z: 28 };
    this.targetCamPos = { x: 0, y: 3, z: 28 };
    this.currentLookAt = { x: 0, y: 1, z: 0 };
    this.targetLookAt = { x: 0, y: 1, z: 0 };

    // Interactive Drag / Tilt State
    this.tiltX = 0;
    this.tiltY = 0;
    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;

    // Active Step State
    this.activeStepKey = 'hero';
    this.stepConfigs = this.getStepConfigurations();

    // Audio & Quiz
    this.soundManager = new SoundEffects();
  }

  init() {
    this.initThreeScene();
    this.buildPlantModel();
    this.buildPlantCellModel();
    this.initScrollEngine();
    this.initPointerInteractions();
    this.initPresenterDock();
    this.initFullscreen();
    this.initCardViewToggles();
    this.initQuizModule();
    this.animate();
  }

  /* ========================================================================
     Three.js Scene Setup & Lighting
     ======================================================================== */
  initThreeScene() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    // No white fog to prevent bleaching/washing out the 3D models against the light canvas
    this.scene.fog = null;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(this.currentCamPos.x, this.currentCamPos.y, this.currentCamPos.z);
    this.camera.lookAt(this.currentLookAt.x, this.currentLookAt.y, this.currentLookAt.z);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); // Transparent WebGL canvas to show subtle studio backdrop
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Pure Studio Lighting - Balanced contrast, natural shadows, saturated craft pigments
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffffff, 0.95);
    this.sunLight.position.set(18, 30, 22);
    this.scene.add(this.sunLight);

    this.fillLight = new THREE.DirectionalLight(0xf1f5f9, 0.35);
    this.fillLight.position.set(-18, -12, 14);
    this.scene.add(this.fillLight);

    // Rim / Back Light to give crisp silhouette separation from background
    this.rimLight = new THREE.DirectionalLight(0xe2e8f0, 0.45);
    this.rimLight.position.set(0, 15, -20);
    this.scene.add(this.rimLight);

    // Dedicated Dynamic Spotlight for Protagonist Organelle (Pure Neutral Clean Focus)
    this.organelleSpotlight = new THREE.SpotLight(0xffffff, 0, 45, Math.PI / 4, 0.45, 1.2);
    this.organelleSpotlight.position.set(0, 10, 22);
    this.spotlightTarget = new THREE.Object3D();
    this.scene.add(this.spotlightTarget);
    this.organelleSpotlight.target = this.spotlightTarget;
    this.scene.add(this.organelleSpotlight);

    // Dedicated Traveling Focus Point Light (gentle pure white fill on active organelle)
    this.organelleFocusLight = new THREE.PointLight(0xffffff, 0, 18, 1.2);
    this.scene.add(this.organelleFocusLight);

    // Floating Microscopic Spores / Dust Particles
    this.createAtmosphericParticles();

    // Dynamic Window Resize & Orientation Handling for Responsive Viewports
    this.handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const aspect = w / h;
      this.camera.aspect = aspect;

      // Adapt vertical FOV on tall aspect ratios to maintain adequate horizontal framing
      if (aspect < 0.7) {
        this.camera.fov = 50;
      } else if (aspect < 1.0) {
        this.camera.fov = 47;
      } else {
        this.camera.fov = 45;
      }

      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleResize(), 150);
    });

    // Run initial framing check
    this.handleResize();
  }

  createAtmosphericParticles() {
    const particleCount = 60;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const neutralColor = new THREE.Color(0x94a3b8);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      colors[i * 3] = neutralColor.r;
      colors[i * 3 + 1] = neutralColor.g;
      colors[i * 3 + 2] = neutralColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.particlesMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.NormalBlending
    });

    this.particles = new THREE.Points(geometry, this.particlesMaterial);
    this.scene.add(this.particles);
  }

  /* ========================================================================
     Plant Model Construction (Macro Stage - Beginning)
     ======================================================================== */
  buildPlantModel() {
    this.plantGroup = new THREE.Group();
    this.plantGroup.position.set(0, -3.2, 0);

    // Plant Stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -5, 0),
      new THREE.Vector3(0.2, -2, 0.2),
      new THREE.Vector3(-0.1, 2, -0.1),
      new THREE.Vector3(0.1, 5, 0.1)
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 32, 0.35, 12, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x047857,
      roughness: 0.6,
      metalness: 0.1
    });
    const stem = new THREE.Mesh(stemGeom, stemMat);
    this.plantGroup.add(stem);

    // Botanical Plant Pot / Terracotta Clay Base
    const potGeom = new THREE.CylinderGeometry(1.8, 1.2, 2.5, 24);
    const potMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.82,
      metalness: 0.0
    });
    const pot = new THREE.Mesh(potGeom, potMat);
    pot.position.set(0, -6.2, 0);
    this.plantGroup.add(pot);

    // Terracotta Pot Rim
    const potRimGeom = new THREE.TorusGeometry(1.82, 0.08, 8, 32);
    const potRimMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.85,
      metalness: 0.0
    });
    const potRim = new THREE.Mesh(potRimGeom, potRimMat);
    potRim.rotation.x = Math.PI / 2;
    potRim.position.set(0, -4.95, 0);
    this.plantGroup.add(potRim);

    // Soil
    const soilGeom = new THREE.CylinderGeometry(1.75, 1.75, 0.2, 24);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.95 });
    const soil = new THREE.Mesh(soilGeom, soilMat);
    soil.position.set(0, -5.0, 0);
    this.plantGroup.add(soil);

    // Leaves Creation (Natural Botanical Leaves - Zero Neon)
    const createLeaf = (x, y, z, rotX, rotY, rotZ, scale) => {
      const leafGroup = new THREE.Group();
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.quadraticCurveTo(1.4, 2.2, 0, 5.0);
      leafShape.quadraticCurveTo(-1.4, 2.2, 0, 0);

      const leafGeom = new THREE.ShapeGeometry(leafShape, 16);
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.68,
        metalness: 0.0,
        side: THREE.DoubleSide
      });
      const leafMesh = new THREE.Mesh(leafGeom, leafMat);

      // Leaf Central Vein
      const veinGeom = new THREE.CylinderGeometry(0.06, 0.02, 4.8, 8);
      const veinMat = new THREE.MeshStandardMaterial({
        color: 0x4ade80,
        roughness: 0.72,
        metalness: 0.0
      });
      const vein = new THREE.Mesh(veinGeom, veinMat);
      vein.position.set(0, 2.4, 0.04);

      // Morning Dewdrop on Leaf
      const dewGeom = new THREE.SphereGeometry(0.2, 16, 16);
      const dewMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        roughness: 0.05,
        transmission: 0.95,
        ior: 1.33
      });
      const dew = new THREE.Mesh(dewGeom, dewMat);
      dew.position.set(0.3, 3.2, 0.2);

      leafGroup.add(leafMesh);
      leafGroup.add(vein);
      leafGroup.add(dew);

      leafGroup.position.set(x, y, z);
      leafGroup.rotation.set(rotX, rotY, rotZ);
      leafGroup.scale.set(scale, scale, scale);
      return leafGroup;
    };

    // Add leaves radiating in 3D
    this.targetLeaf = createLeaf(0.1, 1.8, 0.2, 0.6, 0.2, -0.4, 1.35); // Focus leaf for zoom
    this.plantGroup.add(this.targetLeaf);
    this.plantGroup.add(createLeaf(-0.1, 0.5, 0.1, 0.5, -2.2, 0.3, 1.2));
    this.plantGroup.add(createLeaf(0.2, 3.4, -0.2, 0.4, 1.5, -0.3, 1.1));
    this.plantGroup.add(createLeaf(-0.2, 4.2, 0.2, 0.7, -1.0, 0.5, 0.95));
    this.plantGroup.add(createLeaf(0, 4.8, 0, 0.2, 0.5, 0, 0.8));

    this.scene.add(this.plantGroup);
  }

  /* ========================================================================
     Procedural Canvas Textures (High-Resolution Offline Biological Textures)
     ======================================================================== */
  initProceduralTextures() {
    this.textures.cellulose = this.createCelluloseTexture();
    this.textures.membrane = this.createMembraneTexture();
    this.textures.caustics = this.createWaterCausticsTexture();
    this.textures.nucleus = this.createPoreTexture();
    this.textures.chloroplast = this.createChloroplastTexture();
    this.textures.cristae = this.createCristaeTexture();
    this.textures.golgi = this.createGolgiTexture();
    this.textures.reticular = this.createReticularTexture();
  }

  createCelluloseTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base plant cell wall green gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#047857');
    grad.addColorStop(1, '#022c22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Cross-hatched cellulose microfibrils (layer 1)
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 280; i++) {
      ctx.beginPath();
      const x0 = Math.random() * 512;
      const y0 = Math.random() * 512;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4;
      const length = 70 + Math.random() * 150;
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + Math.cos(angle) * length, y0 + Math.sin(angle) * length);
      ctx.strokeStyle = Math.random() > 0.4 ? 'rgba(52, 211, 153, 0.45)' : 'rgba(16, 185, 129, 0.28)';
      ctx.stroke();
    }

    // Counter cross-fibers (layer 2 - perpendicular angle)
    for (let i = 0; i < 280; i++) {
      ctx.beginPath();
      const x0 = Math.random() * 512;
      const y0 = Math.random() * 512;
      const angle = (-Math.PI / 4) + (Math.random() - 0.5) * 0.4;
      const length = 70 + Math.random() * 150;
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + Math.cos(angle) * length, y0 + Math.sin(angle) * length);
      ctx.strokeStyle = Math.random() > 0.4 ? 'rgba(167, 243, 208, 0.35)' : 'rgba(6, 78, 59, 0.35)';
      ctx.stroke();
    }

    // Micro-granules / relief speckles
    for (let i = 0; i < 1500; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(gx, gy, 1.5, 1.5);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 3);
    return tex;
  }

  createPoreTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep purple base for nuclear envelope
    ctx.fillStyle = '#4a044e';
    ctx.fillRect(0, 0, 512, 512);

    // Fine chromatin grain
    for (let i = 0; i < 3500; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(162, 28, 175, 0.35)' : 'rgba(30, 4, 35, 0.45)';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    // Nuclear pores (octagonal/circular protein complexes)
    for (let i = 0; i < 75; i++) {
      const px = 20 + Math.random() * 472;
      const py = 20 + Math.random() * 472;
      const radius = 6 + Math.random() * 5;

      // Outer pore ring halo
      ctx.beginPath();
      ctx.arc(px, py, radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 114, 182, 0.75)';
      ctx.fill();

      // Middle pore membrane
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#701a75';
      ctx.fill();

      // Inner pore cavity
      ctx.beginPath();
      ctx.arc(px, py, radius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#1e0520';
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }

  createWaterCausticsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Radiant Royal Electric Sapphire aquatic gradient
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 320);
    grad.addColorStop(0, '#00d4ff');
    grad.addColorStop(0.35, '#0077ff');
    grad.addColorStop(0.75, '#0044cc');
    grad.addColorStop(1, '#001a66');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Liquid caustic light webbing with bright white and cyan waves
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 0; i < 70; i++) {
      ctx.beginPath();
      let cx = Math.random() * 512;
      let cy = Math.random() * 512;
      ctx.moveTo(cx, cy);
      for (let j = 0; j < 6; j++) {
        cx += (Math.random() - 0.5) * 120;
        cy += (Math.random() - 0.5) * 120;
        ctx.lineTo(cx, cy);
      }
      ctx.strokeStyle = Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(144, 224, 239, 0.6)';
      ctx.lineWidth = 2 + Math.random() * 3.5;
      ctx.stroke();
    }

    // Specular water bubble reflections
    for (let i = 0; i < 180; i++) {
      const bx = Math.random() * 512;
      const by = Math.random() * 512;
      const br = 1.5 + Math.random() * 3;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  createChloroplastTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich photosynthetic green
    ctx.fillStyle = '#065f46';
    ctx.fillRect(0, 0, 512, 512);

    // Horizontal stroma lamellae bands
    for (let y = 15; y < 512; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y + (Math.random() - 0.5) * 8);
      ctx.bezierCurveTo(170, y + 10, 340, y - 10, 512, y + (Math.random() - 0.5) * 8);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Thylakoid granum clusters (discs)
    for (let i = 0; i < 90; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      const gr = 5 + Math.random() * 6;

      ctx.beginPath();
      ctx.ellipse(gx, gy, gr, gr * 0.5, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(110, 231, 183, 0.55)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(4, 120, 87, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    return tex;
  }

  createCristaeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Warm deep amber/red mitochondrial matrix
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(0, 0, 512, 512);

    // Transverse undulating cristae folds
    for (let y = 10; y < 512; y += 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(150, y + 12, 350, y - 12, 512, y);
      ctx.strokeStyle = 'rgba(254, 215, 170, 0.65)';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, y + 5);
      ctx.bezierCurveTo(150, y + 17, 350, y - 7, 512, y + 5);
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // ATP synthase particle speckles
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = 'rgba(255, 237, 213, 0.7)';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 4);
    return tex;
  }

  createMembraneTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Luminous cyan fluid mosaic
    ctx.fillStyle = '#083344';
    ctx.fillRect(0, 0, 512, 512);

    // Phospholipid hydrophilic head granules
    for (let i = 0; i < 2200; i++) {
      const mx = Math.random() * 512;
      const my = Math.random() * 512;
      ctx.beginPath();
      ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(34, 211, 238, 0.55)' : 'rgba(6, 182, 212, 0.35)';
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }

  createGolgiTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep magenta base
    ctx.fillStyle = '#831843';
    ctx.fillRect(0, 0, 512, 512);

    // Parallel cisternae striations
    for (let y = 10; y < 512; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(170, y + 8, 340, y - 8, 512, y);
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Budding vesicle circles
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 207, 232, 0.6)';
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 3);
    return tex;
  }

  createReticularTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep violet base
    ctx.fillStyle = '#581c87';
    ctx.fillRect(0, 0, 512, 512);

    // Membranous folds and ribosome docking depressions
    for (let y = 12; y < 512; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    for (let i = 0; i < 400; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.5)';
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }

  /* ========================================================================
     Plant Cell Cutaway 3D Model Construction (Micro Stage)
     ======================================================================== */
  buildPlantCellModel() {
    this.cellGroup = new THREE.Group();
    this.cellGroup.position.set(0, 0, 0);
    this.cellGroup.scale.set(0.01, 0.01, 0.01); // Initially collapsed; scales up as we zoom in
    this.cellGroup.visible = false;

    // Initialize Procedural Biological Textures
    this.initProceduralTextures();

    // 1. 3D Cutaway Cell Wall (Prism with Open Interior & Thick Layers)
    this.build3DCellWall();

    // 2. Plasma Membrane Inner Boundary
    this.build3DPlasmaMembrane();

    // 3. Cytoplasm Gel Bed
    this.build3DCytoplasm();

    // 4. Central Vacuole (Huge Glassy Sphere)
    this.build3DCentralVacuole();

    // 5. Nucleus & Nucleolus (Cutaway Core)
    this.build3DNucleus();

    // 6. Chloroplasts (Photosynthetic Discs with Thylakoid Stacks)
    this.build3DChloroplasts();

    // 7. Mitochondria (Capsules with Cristae)
    this.build3DMitochondria();

    // 8. Golgi Apparatus (Curved Cisternae & Vesicles)
    this.build3DGolgi();

    // 9. Endoplasmic Reticulum (Tubular Network)
    this.build3DEndoplasmicReticulum();

    // 10. Ribosomes (Golden Granules)
    this.build3DRibosomes();

    // 11. Amyloplast (Purple Spiral Roll Foam Coil)
    this.build3DAmyloplast();

    // 12. Peroxisome (Teal Vesicle Sphere)
    this.build3DPeroxisome();

    // 13. Minimalist Focus Target Marker
    this.build3DBeaconMarker();

    // 14. Cache Pristine Original Materials (immune to scroll sequence mutations)
    this.cacheOriginalOrganelleMaterials();

    this.scene.add(this.cellGroup);
  }

  cacheOriginalOrganelleMaterials() {
    Object.keys(this.organelles).forEach((key) => {
      const obj = this.organelles[key];
      if (!obj) return;
      obj.traverse((child) => {
        if (child.isMesh && child.material) {
          child.userData.origOpacity = (child.material.opacity !== undefined) ? child.material.opacity : 1.0;
          child.userData.origTransparent = (child.material.transparent !== undefined) ? child.material.transparent : false;
        }
      });
    });
  }

  build3DBeaconMarker() {
    this.beaconGroup = new THREE.Group();
    this.beaconGroup.visible = false;
    this.targetBeaconPos = new THREE.Vector3(0, 0, 0);

    // Subtle clean target indicator (Zero neon)
    const ringGeom = new THREE.RingGeometry(1.65, 1.74, 36);
    this.beaconInnerMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    this.beaconInnerRing = new THREE.Mesh(ringGeom, this.beaconInnerMat);
    this.beaconGroup.add(this.beaconInnerRing);

    this.cellGroup.add(this.beaconGroup);
  }

  build3DCellWall() {
    const wallGroup = new THREE.Group();

    // Rounded Hexagonal Outer Shell Shape
    const outerPts = [];
    const hexRadius = 8.8;
    const sides = 6;
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const x = Math.cos(angle) * hexRadius;
      const y = Math.sin(angle) * (hexRadius * 0.85);
      outerPts.push(new THREE.Vector2(x, y));
    }
    const outerShape = new THREE.Shape(outerPts);

    // Inner Hole (Hollow interior cutaway)
    const innerPts = [];
    const innerRadius = 7.7;
    for (let i = sides; i >= 0; i--) {
      const angle = (i / sides) * Math.PI * 2;
      const x = Math.cos(angle) * innerRadius;
      const y = Math.sin(angle) * (innerRadius * 0.85);
      innerPts.push(new THREE.Vector2(x, y));
    }
    outerShape.holes.push(new THREE.Path(innerPts));

    const extrudeSettings = {
      depth: 5.5,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.45,
      bevelThickness: 0.45
    };

    const wallGeom = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);
    wallGeom.center();

    // Tactile Forest-Green Foamy Shell (High Contrast against White Canvas)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.82,
      metalness: 0.0,
      bumpMap: this.textures.cellulose,
      bumpScale: 0.08,
      roughnessMap: this.textures.cellulose
    });

    const wallMesh = new THREE.Mesh(wallGeom, wallMat);
    wallGroup.add(wallMesh);

    // Top Rim Emerald Green Border
    const rimGeom = new THREE.RingGeometry(8.8, 9.15, 6);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.75,
      side: THREE.DoubleSide
    });
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.position.z = 2.95;
    wallGroup.add(rim);

    // Outward Corner Craft Flaps (6 Solapas de Cartulina/Foamy Turquesa de la Maqueta)
    const flapGeom = new THREE.BoxGeometry(1.6, 5.0, 0.14);
    const flapMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      roughness: 0.85,
      metalness: 0.0
    });

    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const flap = new THREE.Mesh(flapGeom, flapMat);
      const vx = Math.cos(angle) * (hexRadius + 0.65);
      const vy = Math.sin(angle) * (hexRadius * 0.85 + 0.55);
      flap.position.set(vx, vy, 0);
      flap.rotation.z = angle + Math.PI / 4;
      wallGroup.add(flap);
    }

    this.organelles['cell-wall'] = wallGroup;
    this.cellGroup.add(wallGroup);
  }

  build3DPlasmaMembrane() {
    const membraneGroup = new THREE.Group();

    // Thin ocean-blue craft liner along the inner boundary
    const pts = [];
    const radius = 7.5;
    for (let i = 0; i <= 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      pts.push(new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * (radius * 0.85)));
    }
    const shape = new THREE.Shape(pts);
    const innerHole = [];
    for (let i = 6; i >= 0; i--) {
      const angle = (i / 6) * Math.PI * 2;
      innerHole.push(new THREE.Vector2(Math.cos(angle) * 7.28, Math.sin(angle) * (7.28 * 0.85)));
    }
    shape.holes.push(new THREE.Path(innerHole));

    const geom = new THREE.ExtrudeGeometry(shape, { depth: 5.2, bevelEnabled: false });
    geom.center();

    const mat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.8,
      metalness: 0.0,
      bumpMap: this.textures.membrane,
      bumpScale: 0.05
    });

    const mesh = new THREE.Mesh(geom, mat);
    membraneGroup.add(mesh);

    this.organelles['membrane'] = membraneGroup;
    this.cellGroup.add(membraneGroup);
  }

  build3DCytoplasm() {
    const cytoGroup = new THREE.Group();

    // Tactile rich grass-green foamy floor filling the base of the cell
    const geom = new THREE.CylinderGeometry(7.4, 7.4, 1.8, 32);
    geom.rotateX(Math.PI / 2);

    const mat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.85,
      metalness: 0.0
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.z = -1.8;
    cytoGroup.add(mesh);

    this.organelles['cytoplasm'] = cytoGroup;
    this.cellGroup.add(cytoGroup);
  }

  build3DCentralVacuole() {
    const vacuoleGroup = new THREE.Group();

    // Base Layer: Deep royal blue foamy border
    const baseGeom = new THREE.SphereGeometry(3.6, 32, 32);
    baseGeom.scale(1.26, 0.98, 0.5);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.82,
      metalness: 0.0
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.z = -0.15;
    vacuoleGroup.add(baseMesh);

    // Top Layer: Rich vibrant cerulean blue tactile foamy body with soft aquatic texture
    const topGeom = new THREE.SphereGeometry(3.4, 32, 32);
    topGeom.scale(1.22, 0.94, 0.65);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.68,
      metalness: 0.0,
      bumpMap: this.textures.caustics,
      bumpScale: 0.08
    });
    const topMesh = new THREE.Mesh(topGeom, topMat);
    topMesh.position.z = 0.2;
    vacuoleGroup.add(topMesh);

    vacuoleGroup.position.set(-2.5, 0.4, 0.2);
    this.organelles['vacuole'] = vacuoleGroup;
    this.cellGroup.add(vacuoleGroup);
  }

  build3DNucleus() {
    const nucleusGroup = new THREE.Group();

    // Warm Golden Amber Styrofoam Half-Sphere Cutaway (High Contrast)
    const nucGeom = new THREE.SphereGeometry(2.3, 32, 32, 0, Math.PI * 1.55);
    const nucMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.82,
      metalness: 0.0,
      side: THREE.DoubleSide,
      bumpMap: this.textures.nucleus,
      bumpScale: 0.12
    });
    const nucMesh = new THREE.Mesh(nucGeom, nucMat);
    nucleusGroup.add(nucMesh);

    // Deep warm amber cutaway flat cross-section faces
    const capGeom = new THREE.CircleGeometry(2.28, 24, 0, Math.PI / 2);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide
    });
    const cap1 = new THREE.Mesh(capGeom, capMat);
    cap1.rotation.y = Math.PI / 2;
    nucleusGroup.add(cap1);

    // Inner Deep Ruby Red Nucleolus Core
    const nucleolusGeom = new THREE.SphereGeometry(0.9, 24, 24);
    const nucleolusMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.75,
      metalness: 0.0
    });
    const nucleolusMesh = new THREE.Mesh(nucleolusGeom, nucleolusMat);
    nucleusGroup.add(nucleolusMesh);

    nucleusGroup.position.set(3.4, 1.8, 0.5);
    this.organelles['nucleus'] = nucleusGroup;
    this.cellGroup.add(nucleusGroup);
  }

  build3DChloroplasts() {
    const chloroMasterGroup = new THREE.Group();

    const createSingleChloroplast = (x, y, z, rotX, rotY, rotZ, hasCutaway = false) => {
      const group = new THREE.Group();

      // Deep Green Photosynthetic Foamy Disc
      const geom = hasCutaway
        ? new THREE.SphereGeometry(1.45, 32, 32, 0, Math.PI * 1.55)
        : new THREE.SphereGeometry(1.45, 24, 24);
      geom.scale(1.3, 0.7, 0.9);

      const mat = new THREE.MeshStandardMaterial({
        color: 0x14532d,
        roughness: 0.78,
        metalness: 0.0,
        side: hasCutaway ? THREE.DoubleSide : THREE.FrontSide,
        bumpMap: this.textures.chloroplast,
        bumpScale: 0.12
      });
      const outerMesh = new THREE.Mesh(geom, mat);
      group.add(outerMesh);

      // Thylakoid Stacks / Ridge Bands (Matching the vivid green lines in Luna's model)
      for (let r = -2; r <= 2; r++) {
        const ridgeGeom = new THREE.TorusGeometry(0.85 - Math.abs(r) * 0.15, 0.06, 6, 20);
        const ridgeMat = new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          roughness: 0.82,
          metalness: 0.0
        });
        const ridge = new THREE.Mesh(ridgeGeom, ridgeMat);
        ridge.position.set(0, r * 0.22, 0.42);
        group.add(ridge);
      }

      group.position.set(x, y, z);
      group.rotation.set(rotX, rotY, rotZ);
      return group;
    };

    this.featuredChloroplast = createSingleChloroplast(-4.2, -2.6, 1.2, 0.3, 0.4, -0.2, true);
    chloroMasterGroup.add(this.featuredChloroplast);
    chloroMasterGroup.add(createSingleChloroplast(-4.6, 2.5, 0.8, -0.4, 0.2, 0.5));
    chloroMasterGroup.add(createSingleChloroplast(2.2, -3.2, 1.0, 0.2, -0.5, 0.3));
    chloroMasterGroup.add(createSingleChloroplast(4.8, -1.2, 0.6, -0.3, 0.6, -0.4));

    this.organelles['chloroplasts'] = chloroMasterGroup;
    this.cellGroup.add(chloroMasterGroup);
  }

  build3DMitochondria() {
    const mitoMasterGroup = new THREE.Group();

    const createSingleMito = (x, y, z, rotX, rotY, rotZ, hasCutaway = false) => {
      const group = new THREE.Group();

      // Outer Deep Magenta Foamy Capsule (Matching Luna's Physical Model)
      const capGeom = hasCutaway
        ? new THREE.CylinderGeometry(0.68, 0.68, 2.0, 24, 1, false, 0, Math.PI * 1.55)
        : new THREE.CylinderGeometry(0.68, 0.68, 2.0, 16);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xbe185d,
        roughness: 0.78,
        metalness: 0.0,
        side: hasCutaway ? THREE.DoubleSide : THREE.FrontSide,
        bumpMap: this.textures.cristae,
        bumpScale: 0.12
      });
      const capMesh = new THREE.Mesh(capGeom, capMat);

      // Top & Bottom Rounded Hemispheres
      const capTopGeom = hasCutaway
        ? new THREE.SphereGeometry(0.68, 16, 16, 0, Math.PI * 1.55)
        : new THREE.SphereGeometry(0.68, 16, 16);
      const topHem = new THREE.Mesh(capTopGeom, capMat);
      topHem.position.y = 1.0;
      const botHem = new THREE.Mesh(capTopGeom, capMat);
      botHem.position.y = -1.0;

      group.add(capMesh);
      group.add(topHem);
      group.add(botHem);

      // Inner Pleated Accordion Cristae (Vivid Rose Pink Zigzag Folds Matching Luna's Model)
      const cristaeMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        roughness: 0.82,
        metalness: 0.0,
        side: THREE.DoubleSide
      });

      for (let j = -2; j <= 2; j++) {
        const foldCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.45, j * 0.35 - 0.1, 0.2),
          new THREE.Vector3(0.0, j * 0.35 + 0.12, 0.4),
          new THREE.Vector3(0.45, j * 0.35 - 0.1, 0.2)
        ]);
        const foldGeom = new THREE.TubeGeometry(foldCurve, 12, 0.09, 6, false);
        const fold = new THREE.Mesh(foldGeom, cristaeMat);
        group.add(fold);
      }

      group.position.set(x, y, z);
      group.rotation.set(rotX, rotY, rotZ);
      return group;
    };

    mitoMasterGroup.add(createSingleMito(4.4, -2.8, 1.2, 0.6, 0.4, 0.8, true));
    mitoMasterGroup.add(createSingleMito(4.2, 3.8, 0.5, -0.5, 0.2, -0.6));
    mitoMasterGroup.add(createSingleMito(-1.5, -3.8, 0.8, 0.2, -0.4, 0.5));

    this.organelles['mitochondria'] = mitoMasterGroup;
    this.cellGroup.add(mitoMasterGroup);
  }

  build3DGolgi() {
    const golgiGroup = new THREE.Group();

    // Stack of 5 Deep Tangerine Folded Foam Layers (Matching Luna's Physical Model)
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xc2410c,
      roughness: 0.78,
      metalness: 0.0,
      bumpMap: this.textures.golgi,
      bumpScale: 0.08
    });

    for (let i = 0; i < 5; i++) {
      const radius = 2.4 - i * 0.18;
      const tubeGeom = new THREE.TorusGeometry(radius, 0.24, 12, 32, Math.PI * 0.65);
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      tubeMesh.position.set(0, i * 0.32, 0);
      tubeMesh.rotation.z = -0.4;
      golgiGroup.add(tubeMesh);
    }

    // Budding Transport Vesicles
    const vesicleGeom = new THREE.SphereGeometry(0.24, 12, 12);
    const vesicleMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.8,
      metalness: 0.0
    });

    [
      [-1.8, 0.2, 0.3],
      [-2.1, 0.9, -0.2],
      [1.6, 0.4, 0.2],
      [1.8, 1.2, -0.3],
      [-0.2, 1.7, 0.4]
    ].forEach(([vx, vy, vz]) => {
      const ves = new THREE.Mesh(vesicleGeom, vesicleMat);
      ves.position.set(vx, vy, vz);
      golgiGroup.add(ves);
    });

    golgiGroup.position.set(-0.5, -3.2, 1.2);
    this.organelles['golgi'] = golgiGroup;
    this.cellGroup.add(golgiGroup);
  }

  build3DEndoplasmicReticulum() {
    const erGroup = new THREE.Group();

    // Undulating Royal Purple Foamy Ribbons Wrapping Around the Nucleus (Matching Luna's Model)
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x6d28d9,
      roughness: 0.8,
      metalness: 0.0,
      bumpMap: this.textures.reticular,
      bumpScale: 0.08
    });

    for (let i = 0; i < 4; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.2 + i * 0.4, 1.0, 0.2 * i),
        new THREE.Vector3(2.5 + i * 0.4, 3.2, 0.4),
        new THREE.Vector3(4.5 + i * 0.3, 3.8, -0.2),
        new THREE.Vector3(5.2 + i * 0.3, 2.0, 0.1)
      ]);
      const geom = new THREE.TubeGeometry(curve, 24, 0.24, 8, false);
      const mesh = new THREE.Mesh(geom, tubeMat);
      erGroup.add(mesh);
    }

    this.organelles['er'] = erGroup;
    this.cellGroup.add(erGroup);
  }

  build3DRibosomes() {
    const riboCount = 340;
    const sphereGeom = new THREE.SphereGeometry(0.18, 12, 10);
    
    // Vibrant Crimson-Red Craft Dots
    const riboMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.8,
      metalness: 0.0
    });

    const instancedMesh = new THREE.InstancedMesh(sphereGeom, riboMat, riboCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < riboCount; i++) {
      if (i < 250) {
        const t = i / 250;
        const tubeIdx = i % 4;
        const xBase = 2.4 + (tubeIdx * 0.72) + (Math.sin(t * 14) * 0.42);
        const yBase = 1.0 + (t * 2.8) + ((Math.random() - 0.5) * 0.35);
        const zBase = 0.25 + (Math.cos(t * 12) * 0.5) + ((Math.random() - 0.5) * 0.35);

        dummy.position.set(xBase, yBase, zBase);
        const s = 0.8 + Math.random() * 0.5;
        dummy.scale.set(s, s, s);
      } else {
        dummy.position.set(
          (Math.random() - 0.5) * 8.5,
          (Math.random() - 0.5) * 6.5,
          (Math.random() - 0.5) * 2.5
        );
        const s = 0.7 + Math.random() * 0.4;
        dummy.scale.set(s, s, s);
      }
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    this.organelles['ribosomes'] = instancedMesh;
    this.cellGroup.add(instancedMesh);
  }

  build3DAmyloplast() {
    const amyGroup = new THREE.Group();

    // Deep Violet Spiral Foam Coil Roll (From Luna's Physical Model)
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0x581c87,
      roughness: 0.8,
      metalness: 0.0
    });

    // Archimedean spiral ribbon curve
    const points = [];
    const turns = 3.5;
    const maxRadius = 1.35;
    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * turns * Math.PI * 2;
      const r = 0.25 + (i / 100) * (maxRadius - 0.25);
      points.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * (r * 0.75), 0));
    }
    const spiralCurve = new THREE.CatmullRomCurve3(points);
    const spiralGeom = new THREE.TubeGeometry(spiralCurve, 80, 0.16, 8, false);
    const spiralMesh = new THREE.Mesh(spiralGeom, coilMat);
    amyGroup.add(spiralMesh);

    // Starch core disc inside
    const coreGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.28, 16);
    coreGeom.rotateX(Math.PI / 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      roughness: 0.85,
      metalness: 0.0
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    amyGroup.add(coreMesh);

    amyGroup.position.set(3.2, -2.0, 0.6);
    amyGroup.rotation.set(0.2, -0.3, 0.4);

    this.organelles['amyloplast'] = amyGroup;
    this.cellGroup.add(amyGroup);
  }

  build3DPeroxisome() {
    const peroxGroup = new THREE.Group();

    // Deep Pine Teal Foamy Vesicle Sphere (From Luna's Physical Model)
    const geom = new THREE.SphereGeometry(0.85, 24, 24);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      roughness: 0.8,
      metalness: 0.0
    });
    const mesh = new THREE.Mesh(geom, mat);
    peroxGroup.add(mesh);

    // Protective Turquoise Collar Ring
    const ringGeom = new THREE.TorusGeometry(0.88, 0.07, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      roughness: 0.75,
      metalness: 0.0
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    peroxGroup.add(ring);

    peroxGroup.position.set(-3.4, 3.2, 0.8);
    this.organelles['peroxisome'] = peroxGroup;
    this.cellGroup.add(peroxGroup);
  }

  /* ========================================================================
     Step Camera Configurations & Organelle Focus Coordinates
     ======================================================================== */
  getStepConfigurations() {
    return {
      'hero': {
        name: 'Planta Viva Completa',
        plantVisible: true,
        cellVisible: false,
        plantScale: 1.0,
        cellScale: 0.01,
        camPos: { x: 0, y: 1.6, z: 27 },
        lookAt: { x: 0, y: 0.5, z: 0 },
        organelle: null
      },
      'zoom-leaf': {
        name: 'Zoom Microscópico: Atravesando la Hoja...',
        plantVisible: true,
        cellVisible: true,
        plantScale: 3.5,
        cellScale: 0.35,
        camPos: { x: 0.5, y: -0.0, z: 8.5 },
        lookAt: { x: 0.2, y: -0.8, z: 0 },
        organelle: null
      },
      'overview': {
        name: 'Célula Vegetal (Corte Transversal)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -2.5, y: 5.5, z: 23.0 },
        lookAt: { x: 0, y: 0, z: 0 },
        organelle: null
      },
      'cell-wall': {
        name: 'Pared Celular (La Muralla Rígida)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -6.5, y: 4.5, z: 16.5 },
        lookAt: { x: -3.5, y: 1.5, z: 0.5 },
        organelle: 'cell-wall',
        focusCoords: { x: -5.5, y: 2.2, z: 2.8 },
        themeColor: 0x15803d
      },
      'membrane': {
        name: 'Membrana Plasmática (El Filtro)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -5.8, y: 3.5, z: 14.5 },
        lookAt: { x: -3.0, y: 1.0, z: 0.5 },
        organelle: 'membrane',
        focusCoords: { x: -4.8, y: 1.8, z: 2.2 },
        themeColor: 0x0284c7
      },
      'cytoplasm': {
        name: 'Citoplasma (El Océano Interior)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -1.0, y: 4.5, z: 17.5 },
        lookAt: { x: 0, y: -0.5, z: 0 },
        organelle: 'cytoplasm',
        focusCoords: { x: 0.0, y: -0.6, z: 0.4 },
        themeColor: 0x16a34a
      },
      'nucleus': {
        name: 'Núcleo y Nucléolo (El Cerebro de la Célula)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: 1.2, y: 3.2, z: 12.8 },
        lookAt: { x: 3.2, y: 1.8, z: 0.5 },
        organelle: 'nucleus',
        focusCoords: { x: 3.4, y: 1.8, z: 1.2 },
        themeColor: 0xb45309
      },
      'chloroplasts': {
        name: 'Cloroplastos (Las Cocinas Solares)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -4.2, y: -0.8, z: 12.0 },
        lookAt: { x: -4.0, y: -2.4, z: 1.0 },
        organelle: 'chloroplasts',
        focusCoords: { x: -4.2, y: -2.6, z: 1.5 },
        themeColor: 0x15803d
      },
      'vacuole': {
        name: 'Vacuola Central (El Gran Tinaco de Agua)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -3.2, y: 2.2, z: 14.0 },
        lookAt: { x: -2.2, y: 0.4, z: 0.2 },
        organelle: 'vacuole',
        focusCoords: { x: -2.5, y: 0.4, z: 1.4 },
        themeColor: 0x0284c7
      },
      'mitochondria': {
        name: 'Mitocondrias (Las Centrales Eléctricas)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: 2.4, y: -1.2, z: 12.0 },
        lookAt: { x: 4.2, y: -2.5, z: 1.0 },
        organelle: 'mitochondria',
        focusCoords: { x: 4.4, y: -2.8, z: 1.5 },
        themeColor: 0xbe185d
      },
      'golgi': {
        name: 'Aparato de Golgi (Oficina de Paquetería)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -2.2, y: -1.6, z: 12.5 },
        lookAt: { x: -0.5, y: -3.0, z: 1.0 },
        organelle: 'golgi',
        focusCoords: { x: -0.5, y: -3.2, z: 1.5 },
        themeColor: 0xc2410c
      },
      'er': {
        name: 'Retículo Endoplasmático (La Fábrica)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: 1.6, y: 3.4, z: 13.0 },
        lookAt: { x: 3.4, y: 2.0, z: 0.4 },
        organelle: 'er',
        focusCoords: { x: 3.6, y: 2.6, z: 1.0 },
        themeColor: 0x6d28d9
      },
      'ribosomes': {
        name: 'Ribosomas (Los Mini Obreros)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: 1.2, y: 2.6, z: 10.0 },
        lookAt: { x: 3.2, y: 2.2, z: 0.3 },
        organelle: 'ribosomes',
        focusCoords: { x: 3.4, y: 2.4, z: 0.8 },
        themeColor: 0xb91c1c
      },
      'amyloplast': {
        name: 'Amiloplasto (El Almacén de Almidón)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: 2.2, y: -0.8, z: 12.0 },
        lookAt: { x: 3.2, y: -2.0, z: 0.6 },
        organelle: 'amyloplast',
        focusCoords: { x: 3.2, y: -2.0, z: 0.8 },
        themeColor: 0x6b21a8
      },
      'peroxisome': {
        name: 'Peroxisoma (Vesícula Desintoxicadora)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -2.2, y: 2.2, z: 12.0 },
        lookAt: { x: -3.4, y: 3.2, z: 0.8 },
        organelle: 'peroxisome',
        focusCoords: { x: -3.4, y: 3.2, z: 1.0 },
        themeColor: 0x0f766e
      },
      'quiz': {
        name: 'Desafío Escolar: Trivia Interactiva',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: 0, y: 5.0, z: 25.0 },
        lookAt: { x: 0, y: 0, z: 0 },
        organelle: null
      }
    };
  }

  /* ========================================================================
     Scroll Synchronization & Intersection Engine
     ======================================================================== */
  initScrollEngine() {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0.05, 0.15, 0.3, 0.5, 0.7]
    };

    const ratioMap = new Map();
    let scheduledUpdate = null;

    const evaluateDominantStep = () => {
      scheduledUpdate = null;
      let maxRatio = 0;
      let dominantKey = null;

      ratioMap.forEach((ratio, key) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          dominantKey = key;
        }
      });

      // Only switch if dominant step has clear presence and differs from current
      if (dominantKey && maxRatio >= 0.12 && dominantKey !== this.activeStepKey) {
        this.activateStep(dominantKey);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const stepKey = entry.target.dataset.step;
        if (!stepKey) return;
        if (entry.isIntersecting) {
          ratioMap.set(stepKey, entry.intersectionRatio);
        } else {
          ratioMap.delete(stepKey);
        }
      });

      if (!scheduledUpdate) {
        scheduledUpdate = requestAnimationFrame(evaluateDominantStep);
      }
    }, observerOptions);

    this.stepTriggers.forEach((trigger) => observer.observe(trigger));

    // Ensure manual scroll restoration so page doesn't automatically restore or jump to bottom
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Scroll Progress Bar Update & Edge Boundaries
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      if (this.progressFill) {
        this.progressFill.style.width = `${progress}%`;
      }

      // Edge boundary 1: Top of the page resets cleanly to hero
      if (scrollTop < 80 && this.activeStepKey !== 'hero') {
        this.activateStep('hero');
      }
      // Edge boundary 2: Scroll runway near bottom activates quiz
      else if (progress > 97 && this.activeStepKey !== 'quiz') {
        this.activateStep('quiz');
      }
    }, { passive: true });
  }

  activateStep(stepKey) {
    this.activeStepKey = stepKey;
    const config = this.stepConfigs[stepKey] || this.stepConfigs['overview'];

    // 1. Update 3D Camera Targets
    this.targetCamPos = { ...config.camPos };
    this.targetLookAt = { ...config.lookAt };

    // 2. Update Zoom Status HUD
    if (this.zoomHud && this.zoomText) {
      if (stepKey === 'hero') {
        this.zoomHud.classList.remove('is-visible');
      } else {
        this.zoomHud.classList.add('is-visible');
        this.zoomText.textContent = config.name;
      }
    }

    // 3. Update Floating HUD Narrative Cards (Fade in current, fade out rest)
    const isMobileOrTablet = window.innerWidth < 1024;
    this.hudCards.forEach((card) => {
      if (card.dataset.card === stepKey) {
        card.classList.add('is-active');

        // On mobile and tablet, start in compact mode so 3D organelle and beacon are 100% visible
        if (isMobileOrTablet) {
          card.classList.add('is-compact');
          card.classList.remove('is-expanded');
          const toggleBtn = card.querySelector('.card-toggle-view-btn');
          if (toggleBtn) {
            toggleBtn.innerHTML = '<span class="toggle-icon">📖</span> <span class="toggle-text">Mostrar</span> <span class="toggle-arrow">▲</span>';
            toggleBtn.setAttribute('aria-expanded', 'false');
          }
        } else {
          // On desktop, display full sidebar card by default
          card.classList.remove('is-compact');
          card.classList.add('is-expanded');
        }
      } else {
        card.classList.remove('is-active', 'is-expanded');
      }
    });

    // 4. Update Presenter Dock active pill (SAFE: only scrolls dock container horizontally, NEVER the window!)
    this.dockPills.forEach((pill) => {
      if (pill.dataset.step === stepKey) {
        pill.classList.add('is-active');
        const dock = pill.parentElement;
        if (dock && typeof dock.scrollTo === 'function') {
          const pillOffset = pill.offsetLeft;
          const pillWidth = pill.offsetWidth;
          const dockWidth = dock.clientWidth;
          dock.scrollTo({
            left: pillOffset - (dockWidth / 2) + (pillWidth / 2),
            behavior: 'smooth'
          });
        }
      } else {
        pill.classList.remove('is-active');
      }
    });

    // 5. Update Organelle Dramatic Highlighting & Selective Dimming
    const activeKey = config.organelle;

    if (activeKey && config.focusCoords) {
      // Move and show 3D Luminous Beacon Marker
      if (this.beaconGroup) {
        this.beaconGroup.visible = true;
        this.targetBeaconPos.set(config.focusCoords.x, config.focusCoords.y, config.focusCoords.z);

        const themeCol = new THREE.Color(config.themeColor || 0x15803d);
        if (this.beaconInnerMat) this.beaconInnerMat.color = themeCol;

        // Position dynamic spotlight directly onto the protagonist organelle with clean neutral illumination
        if (this.organelleSpotlight && this.spotlightTarget) {
          this.organelleSpotlight.color.setHex(0xffffff);
          this.organelleSpotlight.intensity = 1.15;
          this.spotlightTarget.position.set(config.focusCoords.x, config.focusCoords.y, config.focusCoords.z);
        }

        // Position traveling focus point light right over the organelle
        if (this.organelleFocusLight) {
          this.organelleFocusLight.color.setHex(0xffffff);
          this.organelleFocusLight.intensity = 0.75;
          this.organelleFocusLight.position.set(
            config.focusCoords.x,
            config.focusCoords.y,
            config.focusCoords.z + 1.8
          );
        }
      }

      // Selective Dimming / Transparency: Inactive organelles become translucent, active organelle is solid
      Object.keys(this.organelles).forEach((key) => {
        const obj = this.organelles[key];
        if (!obj) return;

        const isFocused = (key === activeKey);
        obj.traverse((child) => {
          if (child.isMesh && child.material) {
            if (isFocused) {
              child.material.transparent = child.userData.origTransparent || false;
              child.material.opacity = 1.0;
              child.userData.isFocused = true;
            } else {
              child.material.transparent = true;
              child.material.opacity = (key === 'cytoplasm') ? 0.15 : (key === 'cell-wall' ? 0.20 : 0.12);
              child.userData.isFocused = false;
            }
          }
        });
      });
    } else {
      // Overview, hero or quiz: restore all organelles to solid 100% opacity
      if (this.beaconGroup) this.beaconGroup.visible = false;
      if (this.organelleSpotlight) this.organelleSpotlight.intensity = 0;
      if (this.organelleFocusLight) this.organelleFocusLight.intensity = 0;

      Object.keys(this.organelles).forEach((key) => {
        const obj = this.organelles[key];
        if (!obj) return;
        obj.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = child.userData.origTransparent || false;
            child.material.opacity = 1.0;
            child.userData.isFocused = false;
          }
        });
      });
    }
  }

  /* ========================================================================
     Presenter Touch & Tilt Controls (Interactive View Angle)
     ======================================================================== */
  initPointerInteractions() {
    window.addEventListener('pointerdown', (e) => {
      // Don't hijack clicks on cards or buttons
      if (e.target.closest('.hud-card, .action-btn, .dock-pill, .quiz-section, .presenter-credit-card, .btn-primary')) return;
      this.isDragging = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.lastPointerX;
      const deltaY = e.clientY - this.lastPointerY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      this.targetTiltX += deltaY * 0.003;
      this.targetTiltY += deltaX * 0.003;

      // Clamp tilt range
      this.targetTiltX = Math.max(-0.45, Math.min(0.45, this.targetTiltX));
      this.targetTiltY = Math.max(-0.6, Math.min(0.6, this.targetTiltY));
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
  }

  /* ========================================================================
     Presenter Navigation Dock
     ======================================================================== */
  initPresenterDock() {
    this.dockPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = pill.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const stepKey = pill.dataset.step;
        if (stepKey) {
          this.activateStep(stepKey);
        }
      });
    });
  }

  /* ========================================================================
     Fullscreen Mode
     ======================================================================== */
  initFullscreen() {
    const btn = document.getElementById('fullscreen-toggle-btn');
    if (!btn) return;

    const isFsActive = () => {
      return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement ||
        document.body.classList.contains('is-fullscreen-app')
      );
    };

    const updateBtnUI = (active) => {
      if (active) {
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
          Salir
        `;
        btn.setAttribute('aria-label', 'Salir de pantalla completa');
      } else {
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
          Pantalla Completa
        `;
        btn.setAttribute('aria-label', 'Activar pantalla completa');
      }
    };

    btn.addEventListener('click', async () => {
      const active = isFsActive();

      if (!active) {
        // Attempt native Fullscreen API with vendor prefixes
        const docEl = document.documentElement;
        const requestMethod = docEl.requestFullscreen ||
                              docEl.webkitRequestFullscreen ||
                              docEl.mozRequestFullScreen ||
                              docEl.msRequestFullscreen;

        let nativeSuccess = false;
        if (requestMethod) {
          try {
            const promise = requestMethod.call(docEl);
            if (promise && typeof promise.then === 'function') {
              await promise;
            }
            nativeSuccess = true;
          } catch (err) {
            nativeSuccess = false;
          }
        }

        // If native fullscreen was blocked, rejected, or unsupported (e.g. iPadOS Safari)
        if (!nativeSuccess && !document.fullscreenElement && !document.webkitFullscreenElement) {
          document.body.classList.add('is-fullscreen-app');
          updateBtnUI(true);
        }
      } else {
        // Exit active fullscreen (either fallback or native)
        if (document.body.classList.contains('is-fullscreen-app')) {
          document.body.classList.remove('is-fullscreen-app');
          updateBtnUI(false);
        }

        const exitMethod = document.exitFullscreen ||
                           document.webkitExitFullscreen ||
                           document.mozCancelFullScreen ||
                           document.msExitFullscreen;

        if (exitMethod && (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
          try {
            const promise = exitMethod.call(document);
            if (promise && typeof promise.then === 'function') {
              await promise;
            }
          } catch (e) {}
        }
        updateBtnUI(false);
      }
    });

    // Listen to native fullscreen changes (e.g. user pressing ESC or hardware gestures)
    const onFsChange = () => {
      updateBtnUI(isFsActive());
    };

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
      document.addEventListener(evt, onFsChange);
    });

    // Keyboard ESC listener for in-app fallback
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('is-fullscreen-app')) {
        document.body.classList.remove('is-fullscreen-app');
        updateBtnUI(false);
      }
    });
  }

  /* ========================================================================
     Card Minimization & 3D Peek Toggle (Mobile & Tablet Experience)
     ======================================================================== */
  initCardViewToggles() {
    this.hudCards.forEach((card) => {
      const header = card.querySelector('.card-header');
      if (!header) return;

      let toggleBtn = card.querySelector('.card-toggle-view-btn');
      if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'card-toggle-view-btn';
        toggleBtn.setAttribute('aria-label', 'Alternar información del organelo');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '<span class="toggle-icon">📖</span> <span class="toggle-text">Mostrar</span> <span class="toggle-arrow">▲</span>';
        header.appendChild(toggleBtn);
      }

      const toggleCardState = (e) => {
        if (e) e.stopPropagation();
        const isCurrentlyCompact = card.classList.contains('is-compact');

        if (isCurrentlyCompact) {
          // Expand card to view full info without internal scroll
          card.classList.remove('is-compact');
          card.classList.add('is-expanded');
          toggleBtn.setAttribute('aria-expanded', 'true');
          toggleBtn.innerHTML = '<span class="toggle-icon">👁️</span> <span class="toggle-text">Ocultar</span> <span class="toggle-arrow">▼</span>';
        } else {
          // Collapse card back to compact bar
          card.classList.add('is-compact');
          card.classList.remove('is-expanded');
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.innerHTML = '<span class="toggle-icon">📖</span> <span class="toggle-text">Mostrar</span> <span class="toggle-arrow">▲</span>';
        }
      };

      toggleBtn.addEventListener('click', toggleCardState);

      // Tapping anywhere on the compact card bar expands it
      card.addEventListener('click', (e) => {
        if (card.classList.contains('is-compact') && !e.target.closest('.card-toggle-view-btn')) {
          toggleCardState(e);
        }
      });
    });
  }

  /* ========================================================================
     Animation Loop (Lerp Camera & Render)
     ======================================================================== */
  animate() {
    requestAnimationFrame(() => this.animate());

    const config = this.stepConfigs[this.activeStepKey] || this.stepConfigs['overview'];

    // Smooth Lerp Camera Position (Responsive 0.085 factor)
    this.currentCamPos.x += (this.targetCamPos.x - this.currentCamPos.x) * 0.085;
    this.currentCamPos.y += (this.targetCamPos.y - this.currentCamPos.y) * 0.085;
    this.currentCamPos.z += (this.targetCamPos.z - this.currentCamPos.z) * 0.085;

    // Smooth Lerp LookAt Target
    this.currentLookAt.x += (this.targetLookAt.x - this.currentLookAt.x) * 0.085;
    this.currentLookAt.y += (this.targetLookAt.y - this.currentLookAt.y) * 0.085;
    this.currentLookAt.z += (this.targetLookAt.z - this.currentLookAt.z) * 0.085;

    // Smooth Tilt Dampening
    this.tiltX += (this.targetTiltX - this.tiltX) * 0.08;
    this.tiltY += (this.targetTiltY - this.tiltY) * 0.08;
    if (!this.isDragging) {
      this.targetTiltX *= 0.96;
      this.targetTiltY *= 0.96;
    }

    // Viewport Adaptations for Mobile & Tablet Portrait Framing
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = width <= 1024 && height >= width;
    const isSmallPhone = width < 600;

    let portraitCamYOffset = 0;
    let portraitCamZOffset = 0;
    let portraitLookAtYOffset = 0;

    if (isPortrait) {
      if (this.activeStepKey === 'hero') {
        portraitCamZOffset = isSmallPhone ? 5.0 : 2.5;
        portraitLookAtYOffset = isSmallPhone ? -0.8 : -0.4;
      } else if (this.activeStepKey === 'zoom-leaf') {
        portraitCamZOffset = isSmallPhone ? 2.5 : 1.2;
        portraitLookAtYOffset = isSmallPhone ? -1.4 : -0.8;
      } else {
        // Elevate 3D cell into upper viewport (safely above the bottom sheet card)
        portraitCamYOffset = isSmallPhone ? 0.8 : 0.4;
        portraitCamZOffset = isSmallPhone ? 4.2 : 2.2;
        portraitLookAtYOffset = isSmallPhone ? -2.6 : -1.6;
      }
    }

    // Apply Camera Transform with tilt and portrait adaptations
    this.camera.position.set(
      this.currentCamPos.x + this.tiltY * 4.0,
      this.currentCamPos.y + this.tiltX * 3.0 + portraitCamYOffset,
      this.currentCamPos.z + portraitCamZOffset
    );
    this.camera.lookAt(
      this.currentLookAt.x,
      this.currentLookAt.y + portraitLookAtYOffset,
      this.currentLookAt.z
    );

    // Cross-fade visibility between Plant & Cell groups without abrupt popping
    if (this.plantGroup) {
      const targetScale = config.plantScale;
      this.plantGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.085);
      this.plantGroup.visible = config.plantVisible || (this.plantGroup.scale.x > 0.05);
      // Gentle floating plant sway
      this.plantGroup.rotation.y = Math.sin(Date.now() * 0.0008) * 0.12 + this.tiltY * 0.5;
    }

    if (this.cellGroup) {
      const targetScale = config.cellScale;
      this.cellGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.085);
      this.cellGroup.visible = config.cellVisible || (this.cellGroup.scale.x > 0.05);
      // Subtle organic breathing rotation
      this.cellGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.08 + this.tiltY * 0.4;
      this.cellGroup.rotation.x = this.tiltX * 0.4;
    }

    // Minimalist Focus Marker Animation
    if (this.beaconGroup && this.beaconGroup.visible) {
      this.beaconGroup.position.lerp(this.targetBeaconPos, 0.08);
      const bPulse = 1.0 + Math.sin(Date.now() * 0.003) * 0.04;
      this.beaconGroup.scale.set(bPulse, bPulse, bPulse);
    }

    // Atmospheric Particle Floating
    if (this.particles) {
      this.particles.rotation.y += 0.0004;
      this.particles.rotation.x += 0.0002;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /* ========================================================================
     Interactive Quiz Module ("Desafío Celular")
     ======================================================================== */
  initQuizModule() {
    const quizData = [
      {
        question: "¿Cuál de estos organelos es exclusivo de las plantas y se encarga de atrapar la luz del sol para preparar comida?",
        options: [
          { text: "A) Mitocondria", correct: false },
          { text: "B) Cloroplasto", correct: true },
          { text: "C) Núcleo celular", correct: false }
        ],
        explanation: "¡Correcto! Los cloroplastos contienen clorofila verde y hacen la fotosíntesis. ¡Solo las células vegetales los tienen!"
      },
      {
        question: "Si olvidas regar tu plantita y sus hojas se marchitan y se ponen débiles, ¿qué organelo se quedó sin agua?",
        options: [
          { text: "A) La Vacuola Central", correct: true },
          { text: "B) El Aparato de Golgi", correct: false },
          { text: "C) La Pared Celular", correct: false }
        ],
        explanation: "¡Exacto! La gran vacuola central almacena agua y actúa como un tinaco inflado que mantiene firme a la planta."
      },
      {
        question: "¿Qué estructura es como una 'muralla exterior de castillo' que le da rigidez y soporte para que la planta no necesite huesos?",
        options: [
          { text: "A) Membrana Celular", correct: false },
          { text: "B) Citoplasma", correct: false },
          { text: "C) Pared Celular", correct: true }
        ],
        explanation: "¡Muy bien! La pared celular está hecha de celulosa resistente y protege toda la célula por fuera."
      },
      {
        question: "¿Quién es el 'director' de la célula que guarda el libro con las instrucciones secretas (ADN)?",
        options: [
          { text: "A) El Núcleo", correct: true },
          { text: "B) El Ribosoma", correct: false },
          { text: "C) La Mitocondria", correct: false }
        ],
        explanation: "¡Excelente! El núcleo es el centro de comando donde reside el ADN con todas las órdenes de la vida."
      }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const questionCounter = document.getElementById('quiz-counter');
    const questionText = document.getElementById('quiz-question-text');
    const optionsGrid = document.getElementById('quiz-options-grid');
    const feedbackBox = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('quiz-next-btn');
    const quizCard = document.getElementById('quiz-active-card');
    const scoreCard = document.getElementById('quiz-score-card');
    const scoreNumber = document.getElementById('quiz-final-score');
    const scoreMessage = document.getElementById('quiz-final-message');
    const restartBtn = document.getElementById('quiz-restart-btn');

    if (!questionText || !optionsGrid) return;

    const loadQuestion = (index) => {
      const q = quizData[index];
      questionCounter.textContent = `Pregunta ${index + 1} de ${quizData.length}`;
      questionText.textContent = q.question;
      optionsGrid.innerHTML = '';
      feedbackBox.className = 'quiz-feedback';
      feedbackBox.textContent = '';
      nextBtn.classList.remove('is-visible');

      q.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = opt.text;

        btn.addEventListener('click', () => {
          handleOptionSelected(opt, btn, q);
        });

        optionsGrid.appendChild(btn);
      });
    };

    const handleOptionSelected = (selectedOption, selectedBtn, questionObj) => {
      const allOptionBtns = optionsGrid.querySelectorAll('.quiz-option-btn');
      allOptionBtns.forEach((btn) => (btn.disabled = true));

      if (selectedOption.correct) {
        score++;
        selectedBtn.classList.add('is-correct');
        feedbackBox.textContent = questionObj.explanation;
        feedbackBox.className = 'quiz-feedback is-visible is-correct';
        this.soundManager.playSuccess();
      } else {
        selectedBtn.classList.add('is-incorrect');
        allOptionBtns.forEach((btn) => {
          const matchingOpt = questionObj.options.find((o) => o.text === btn.textContent);
          if (matchingOpt && matchingOpt.correct) {
            btn.classList.add('is-correct');
          }
        });
        feedbackBox.textContent = `¡Casi! ${questionObj.explanation}`;
        feedbackBox.className = 'quiz-feedback is-visible is-incorrect';
        this.soundManager.playError();
      }

      if (currentQuestionIndex < quizData.length - 1) {
        nextBtn.textContent = 'Siguiente Pregunta →';
      } else {
        nextBtn.textContent = 'Ver Resultados Finales 🎉';
      }
      nextBtn.classList.add('is-visible');
    };

    nextBtn.addEventListener('click', () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizData.length) {
        loadQuestion(currentQuestionIndex);
      } else {
        showFinalScore();
      }
    });

    const showFinalScore = () => {
      quizCard.style.display = 'none';
      scoreCard.classList.add('is-visible');
      scoreNumber.textContent = `${score} / ${quizData.length}`;

      if (score === quizData.length) {
        scoreMessage.innerHTML = '🌟 <strong>¡Increíble! ¡Puntaje perfecto!</strong> Eres un experto en la célula vegetal. ¡Muchas gracias por participar en la presentación de Luna María Estrada Nieto!';
      } else if (score >= 2) {
        scoreMessage.innerHTML = '👏 <strong>¡Muy bien hecho!</strong> Demostraste un gran conocimiento sobre los organelos celulares. ¡Gracias por participar con Luna María!';
      } else {
        scoreMessage.innerHTML = '💪 <strong>¡Buen intento!</strong> Puedes volver a explorar la página y repasar para convertirte en un experto botánico.';
      }
      this.soundManager.playSuccess();
    };

    restartBtn.addEventListener('click', () => {
      currentQuestionIndex = 0;
      score = 0;
      scoreCard.classList.remove('is-visible');
      quizCard.style.display = 'block';
      loadQuestion(0);
    });

    loadQuestion(0);
  }
}

/* ========================================================================
   Synthesized Audio Chimes (Web Audio API - Zero External Dependencies)
   ======================================================================== */
class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.1);
    osc.frequency.setValueAtTime(783.99, now + 0.2);
    osc.frequency.setValueAtTime(1046.50, now + 0.3);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  playError() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(180, now + 0.15);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }
}
