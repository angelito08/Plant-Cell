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
    this.stepTriggers = document.querySelectorAll('.scroll-step-trigger');
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
    this.scene.fog = new THREE.FogExp2(0x060a0d, 0.018);

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
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x162638, 1.2);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(20, 30, 25);
    this.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00f2fe, 0.9);
    rimLight.position.set(-25, -15, -10);
    this.scene.add(rimLight);

    // Dynamic Colored Point Lights for Bioluminescence
    this.pointLights.emerald = new THREE.PointLight(0x10b981, 2.8, 45);
    this.pointLights.emerald.position.set(-12, 6, 12);
    this.scene.add(this.pointLights.emerald);

    this.pointLights.cyan = new THREE.PointLight(0x00f2fe, 2.6, 40);
    this.pointLights.cyan.position.set(6, -8, 10);
    this.scene.add(this.pointLights.cyan);

    this.pointLights.violet = new THREE.PointLight(0xd946ef, 3.0, 35);
    this.pointLights.violet.position.set(10, 8, -6);
    this.scene.add(this.pointLights.violet);

    // Floating Microscopic Spores / Dust Particles
    this.createAtmosphericParticles();

    // Window Resize Handling
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  createAtmosphericParticles() {
    const particleCount = 220;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x38ef7d);
    const color2 = new THREE.Color(0x00f2fe);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const mixed = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  /* ========================================================================
     Plant Model Construction (Macro Stage - Beginning)
     ======================================================================== */
  buildPlantModel() {
    this.plantGroup = new THREE.Group();
    this.plantGroup.position.set(0, -1, 0);

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

    // Modern Plant Pot / Base Pedestal
    const potGeom = new THREE.CylinderGeometry(1.8, 1.2, 2.5, 24);
    const potMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x064e3b,
      emissiveIntensity: 0.2,
      roughness: 0.25,
      metalness: 0.2
    });
    const pot = new THREE.Mesh(potGeom, potMat);
    pot.position.set(0, -6.2, 0);
    this.plantGroup.add(pot);

    // Pot Rim Glowing Accent
    const potRimGeom = new THREE.TorusGeometry(1.82, 0.06, 8, 32);
    const potRimMat = new THREE.MeshBasicMaterial({ color: 0x38ef7d });
    const potRim = new THREE.Mesh(potRimGeom, potRimMat);
    potRim.rotation.x = Math.PI / 2;
    potRim.position.set(0, -4.95, 0);
    this.plantGroup.add(potRim);

    // Soil
    const soilGeom = new THREE.CylinderGeometry(1.75, 1.75, 0.2, 24);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.95 });
    const soil = new THREE.Mesh(soilGeom, soilMat);
    soil.position.set(0, -5.0, 0);
    this.plantGroup.add(soil);

    // Leaves Creation
    const createLeaf = (x, y, z, rotX, rotY, rotZ, scale) => {
      const leafGroup = new THREE.Group();
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.quadraticCurveTo(1.4, 2.2, 0, 5.0);
      leafShape.quadraticCurveTo(-1.4, 2.2, 0, 0);

      const leafGeom = new THREE.ShapeGeometry(leafShape, 16);
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x065f46,
        emissiveIntensity: 0.25,
        roughness: 0.4,
        metalness: 0.15,
        side: THREE.DoubleSide
      });
      const leafMesh = new THREE.Mesh(leafGeom, leafMat);

      // Leaf Central Vein
      const veinGeom = new THREE.CylinderGeometry(0.06, 0.02, 4.8, 8);
      const veinMat = new THREE.MeshStandardMaterial({
        color: 0xa7f3d0,
        emissive: 0x34d399,
        emissiveIntensity: 0.5
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
     Plant Cell Cutaway 3D Model Construction (Micro Stage)
     ======================================================================== */
  buildPlantCellModel() {
    this.cellGroup = new THREE.Group();
    this.cellGroup.position.set(0, 0, 0);
    this.cellGroup.scale.set(0.01, 0.01, 0.01); // Initially collapsed; scales up as we zoom in
    this.cellGroup.visible = false;

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

    this.scene.add(this.cellGroup);
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

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x047857,
      emissiveIntensity: 0.25,
      roughness: 0.45,
      metalness: 0.15
    });

    const wallMesh = new THREE.Mesh(wallGeom, wallMat);
    wallGroup.add(wallMesh);

    // Middle Lamella Bright Accent Line (Outer boundary ring)
    const rimGeom = new THREE.RingGeometry(8.9, 9.2, 6);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x38ef7d,
      side: THREE.DoubleSide
    });
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.position.z = 3.0;
    wallGroup.add(rim);

    this.organelles['cell-wall'] = wallGroup;
    this.cellGroup.add(wallGroup);
  }

  build3DPlasmaMembrane() {
    const membraneGroup = new THREE.Group();

    // Thin luminous cyan interior border
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
      innerHole.push(new THREE.Vector2(Math.cos(angle) * 7.3, Math.sin(angle) * (7.3 * 0.85)));
    }
    shape.holes.push(new THREE.Path(innerHole));

    const geom = new THREE.ExtrudeGeometry(shape, { depth: 5.2, bevelEnabled: false });
    geom.center();

    const mat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.55,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85
    });

    const mesh = new THREE.Mesh(geom, mat);
    membraneGroup.add(mesh);

    this.organelles['membrane'] = membraneGroup;
    this.cellGroup.add(membraneGroup);
  }

  build3DCytoplasm() {
    const cytoGroup = new THREE.Group();

    // Semi-translucent gel mattress filling the lower half of the cell
    const geom = new THREE.CylinderGeometry(7.2, 7.2, 4.2, 32);
    geom.rotateX(Math.PI / 2);

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x082f49,
      emissive: 0x0369a1,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.35,
      roughness: 0.3,
      metalness: 0.05
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.z = -0.5;
    cytoGroup.add(mesh);

    this.organelles['cytoplasm'] = cytoGroup;
    this.cellGroup.add(cytoGroup);
  }

  build3DCentralVacuole() {
    const vacuoleGroup = new THREE.Group();

    // Massive glassy, bulbous organic reservoir occupying ~35% of interior
    const geom = new THREE.SphereGeometry(3.6, 32, 32);
    geom.scale(1.2, 0.95, 0.85);

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72,
      transmission: 0.65,
      ior: 1.33
    });

    const mesh = new THREE.Mesh(geom, mat);
    vacuoleGroup.add(mesh);

    // Specular highlight droplet inside
    const dropGeom = new THREE.SphereGeometry(0.6, 16, 16);
    const dropMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const drop = new THREE.Mesh(dropGeom, dropMat);
    drop.position.set(-1.2, 1.4, 1.5);
    vacuoleGroup.add(drop);

    vacuoleGroup.position.set(-2.5, 0.4, 0.2);
    this.organelles['vacuole'] = vacuoleGroup;
    this.cellGroup.add(vacuoleGroup);
  }

  build3DNucleus() {
    const nucleusGroup = new THREE.Group();

    // Outer Nucleus (Cutaway Sphere showing interior)
    const nucGeom = new THREE.SphereGeometry(2.1, 32, 32, 0, Math.PI * 1.6);
    const nucMat = new THREE.MeshStandardMaterial({
      color: 0x701a75,
      emissive: 0x4a044e,
      emissiveIntensity: 0.35,
      roughness: 0.4,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    const nucMesh = new THREE.Mesh(nucGeom, nucMat);
    nucleusGroup.add(nucMesh);

    // Inner Glowing Nucleolus Core
    const nucleolusGeom = new THREE.SphereGeometry(0.85, 24, 24);
    const nucleolusMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xec4899,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const nucleolusMesh = new THREE.Mesh(nucleolusGeom, nucleolusMat);
    nucleusGroup.add(nucleolusMesh);

    // Nuclear Pores Ring
    const poreGeom = new THREE.TorusGeometry(2.12, 0.05, 8, 32);
    const poreMat = new THREE.MeshBasicMaterial({ color: 0xfbcfe8 });
    const poreRing = new THREE.Mesh(poreGeom, poreMat);
    poreRing.rotation.x = Math.PI / 2;
    nucleusGroup.add(poreRing);

    nucleusGroup.position.set(3.4, 1.8, 0.5);
    this.organelles['nucleus'] = nucleusGroup;
    this.cellGroup.add(nucleusGroup);
  }

  build3DChloroplasts() {
    const chloroMasterGroup = new THREE.Group();

    const createSingleChloroplast = (x, y, z, rotX, rotY, rotZ, hasCutaway = false) => {
      const group = new THREE.Group();

      // Outer Lenticular Green Disc
      const geom = new THREE.SphereGeometry(1.4, 24, 24);
      geom.scale(1.3, 0.7, 0.9);

      const mat = new THREE.MeshStandardMaterial({
        color: 0x059669,
        emissive: 0x10b981,
        emissiveIntensity: 0.45,
        roughness: 0.35,
        metalness: 0.1
      });
      const outerMesh = new THREE.Mesh(geom, mat);
      group.add(outerMesh);

      // Thylakoid Stacks (Grana Discs) inside
      if (hasCutaway) {
        const granaGroup = new THREE.Group();
        const diskGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16);
        const diskMat = new THREE.MeshStandardMaterial({
          color: 0x34d399,
          emissive: 0x059669,
          emissiveIntensity: 0.6
        });

        // 3 Stacks of Grana
        [-0.5, 0, 0.5].forEach((offsetX) => {
          for (let k = -2; k <= 2; k++) {
            const disk = new THREE.Mesh(diskGeom, diskMat);
            disk.position.set(offsetX, k * 0.12, 0.45);
            granaGroup.add(disk);
          }
        });
        group.add(granaGroup);
      }

      group.position.set(x, y, z);
      group.rotation.set(rotX, rotY, rotZ);
      return group;
    };

    // Add 4 distinct chloroplasts
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

    const createSingleMito = (x, y, z, rotX, rotY, rotZ) => {
      const group = new THREE.Group();

      // Outer Orange Capsule
      const capGeom = new THREE.CylinderGeometry(0.65, 0.65, 2.0, 16);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xea580c,
        emissive: 0xc2410c,
        emissiveIntensity: 0.5,
        roughness: 0.35
      });
      const capMesh = new THREE.Mesh(capGeom, capMat);

      // Top & Bottom Rounded Hemispheres
      const capTopGeom = new THREE.SphereGeometry(0.65, 16, 16);
      const topHem = new THREE.Mesh(capTopGeom, capMat);
      topHem.position.y = 1.0;
      const botHem = new THREE.Mesh(capTopGeom, capMat);
      botHem.position.y = -1.0;

      group.add(capMesh);
      group.add(topHem);
      group.add(botHem);

      // Inner Folded Cristae Glowing Rings
      for (let j = -3; j <= 3; j++) {
        const ringGeom = new THREE.TorusGeometry(0.48, 0.05, 8, 16);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xfed7aa });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = j * 0.25;
        group.add(ring);
      }

      group.position.set(x, y, z);
      group.rotation.set(rotX, rotY, rotZ);
      return group;
    };

    mitoMasterGroup.add(createSingleMito(4.4, -2.8, 1.2, 0.6, 0.4, 0.8));
    mitoMasterGroup.add(createSingleMito(4.2, 3.8, 0.5, -0.5, 0.2, -0.6));
    mitoMasterGroup.add(createSingleMito(-1.5, -3.8, 0.8, 0.2, -0.4, 0.5));

    this.organelles['mitochondria'] = mitoMasterGroup;
    this.cellGroup.add(mitoMasterGroup);
  }

  build3DGolgi() {
    const golgiGroup = new THREE.Group();

    // Stack of 5 Curved Flattened Membranous Cisternae Arches
    for (let i = 0; i < 5; i++) {
      const radius = 2.4 - i * 0.18;
      const tubeGeom = new THREE.TorusGeometry(radius, 0.22, 12, 32, Math.PI * 0.65);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0xdb2777,
        emissive: 0xec4899,
        emissiveIntensity: 0.55,
        roughness: 0.3
      });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      tubeMesh.position.set(0, i * 0.32, 0);
      tubeMesh.rotation.z = -0.4;
      golgiGroup.add(tubeMesh);
    }

    // Budding Transport Vesicles (Spheres)
    const vesicleGeom = new THREE.SphereGeometry(0.22, 12, 12);
    const vesicleMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xf472b6,
      emissiveIntensity: 0.7
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

    // Undulating Ribbon Tubes wrapping around the Nucleus
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.4,
      roughness: 0.4
    });

    for (let i = 0; i < 4; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.2 + i * 0.4, 1.0, 0.2 * i),
        new THREE.Vector3(2.5 + i * 0.4, 3.2, 0.4),
        new THREE.Vector3(4.5 + i * 0.3, 3.8, -0.2),
        new THREE.Vector3(5.2 + i * 0.3, 2.0, 0.1)
      ]);
      const geom = new THREE.TubeGeometry(curve, 24, 0.22, 8, false);
      const mesh = new THREE.Mesh(geom, tubeMat);
      erGroup.add(mesh);
    }

    this.organelles['er'] = erGroup;
    this.cellGroup.add(erGroup);
  }

  build3DRibosomes() {
    const riboCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(riboCount * 3);

    // Scatter on ER and freely in cytoplasm
    for (let i = 0; i < riboCount; i++) {
      if (i < 120) {
        // Studded around ER & Nucleus
        positions[i * 3] = 2.4 + Math.random() * 3.0;
        positions[i * 3 + 1] = 0.8 + Math.random() * 3.0;
        positions[i * 3 + 2] = -0.4 + Math.random() * 1.5;
      } else {
        // Free cytoplasmic
        positions[i * 3] = (Math.random() - 0.5) * 8.0;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 6.0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfacc15,
      size: 0.28,
      transparent: true,
      opacity: 0.95
    });

    const riboPoints = new THREE.Points(geometry, material);
    this.organelles['ribosomes'] = riboPoints;
    this.cellGroup.add(riboPoints);
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
        camPos: { x: 0, y: 3, z: 28 },
        lookAt: { x: 0, y: 1.5, z: 0 },
        organelle: null
      },
      'zoom-leaf': {
        name: 'Zoom Microscópico: Atravesando la Hoja...',
        plantVisible: true,
        cellVisible: true,
        plantScale: 3.5,
        cellScale: 0.35,
        camPos: { x: 0.5, y: 2.2, z: 8.5 },
        lookAt: { x: 0.2, y: 2.0, z: 0 },
        organelle: null
      },
      'overview': {
        name: 'Célula Vegetal 3D (Corte Transversal)',
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
        camPos: { x: -7.5, y: 5.0, z: 17.0 },
        lookAt: { x: -3.5, y: 1.5, z: 0 },
        organelle: 'cell-wall'
      },
      'membrane': {
        name: 'Membrana Plasmática (El Filtro)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -6.5, y: 4.0, z: 15.0 },
        lookAt: { x: -3.0, y: 1.0, z: 0 },
        organelle: 'membrane'
      },
      'cytoplasm': {
        name: 'Citoplasma (El Océano Interior)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -1.0, y: 5.0, z: 18.0 },
        lookAt: { x: 0, y: -0.5, z: 0 },
        organelle: 'cytoplasm'
      },
      'nucleus': {
        name: 'Núcleo y Nucléolo (El Cerebro de la Célula)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: 3.8, y: 3.5, z: 11.5 },
        lookAt: { x: 3.2, y: 1.8, z: 0.5 },
        organelle: 'nucleus'
      },
      'chloroplasts': {
        name: 'Cloroplastos (Las Cocinas Solares)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -4.5, y: -1.0, z: 12.0 },
        lookAt: { x: -3.8, y: -2.4, z: 1.0 },
        organelle: 'chloroplasts'
      },
      'vacuole': {
        name: 'Vacuola Central (El Gran Tinaco de Agua)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -3.5, y: 2.5, z: 14.0 },
        lookAt: { x: -2.2, y: 0.4, z: 0.2 },
        organelle: 'vacuole'
      },
      'mitochondria': {
        name: 'Mitocondrias (Las Centrales Eléctricas)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: 4.8, y: -1.5, z: 11.5 },
        lookAt: { x: 4.2, y: -2.5, z: 1.0 },
        organelle: 'mitochondria'
      },
      'golgi': {
        name: 'Aparato de Golgi (Oficina de Paquetería)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: -0.5, y: -1.8, z: 12.0 },
        lookAt: { x: -0.5, y: -3.0, z: 1.0 },
        organelle: 'golgi'
      },
      'er': {
        name: 'Retículo Endoplasmático (La Fábrica)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: 3.8, y: 3.8, z: 12.5 },
        lookAt: { x: 3.4, y: 2.0, z: 0.4 },
        organelle: 'er'
      },
      'ribosomes': {
        name: 'Ribosomas (Los Mini Obreros)',
        plantVisible: false,
        cellVisible: true,
        plantScale: 0.01,
        cellScale: 1.0,
        camPos: { x: 3.2, y: 2.8, z: 9.5 },
        lookAt: { x: 3.0, y: 2.0, z: 0.2 },
        organelle: 'ribosomes'
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
      rootMargin: '-25% 0px -25% 0px',
      threshold: [0.15, 0.4, 0.7]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          const stepKey = entry.target.dataset.step;
          if (stepKey && stepKey !== this.activeStepKey) {
            this.activateStep(stepKey);
          }
        }
      });
    }, observerOptions);

    this.stepTriggers.forEach((trigger) => observer.observe(trigger));

    // Scroll Progress Bar Update
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      if (this.progressFill) {
        this.progressFill.style.width = `${progress}%`;
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
    this.hudCards.forEach((card) => {
      if (card.dataset.card === stepKey) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });

    // 4. Update Presenter Dock active pill
    this.dockPills.forEach((pill) => {
      if (pill.dataset.step === stepKey) {
        pill.classList.add('is-active');
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        pill.classList.remove('is-active');
      }
    });

    // 5. Update Organelle Highlights (Scale/Pulse Active Organelle)
    Object.keys(this.organelles).forEach((key) => {
      const obj = this.organelles[key];
      if (!obj) return;

      if (!config.organelle) {
        // Overview mode: all normal
        obj.visible = true;
      } else if (config.organelle === key) {
        // Protagonist organelle
        obj.visible = true;
      }
    });
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
      });
    });
  }

  /* ========================================================================
     Fullscreen Mode
     ======================================================================== */
  initFullscreen() {
    const btn = document.getElementById('fullscreen-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
          Salir
        `;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
            Pantalla Completa
          `;
        }
      }
    });
  }

  /* ========================================================================
     Animation Loop (Lerp Camera & Render)
     ======================================================================== */
  animate() {
    requestAnimationFrame(() => this.animate());

    const config = this.stepConfigs[this.activeStepKey] || this.stepConfigs['overview'];

    // Smooth Lerp Camera Position
    this.currentCamPos.x += (this.targetCamPos.x - this.currentCamPos.x) * 0.055;
    this.currentCamPos.y += (this.targetCamPos.y - this.currentCamPos.y) * 0.055;
    this.currentCamPos.z += (this.targetCamPos.z - this.currentCamPos.z) * 0.055;

    // Smooth Lerp LookAt Target
    this.currentLookAt.x += (this.targetLookAt.x - this.currentLookAt.x) * 0.055;
    this.currentLookAt.y += (this.targetLookAt.y - this.currentLookAt.y) * 0.055;
    this.currentLookAt.z += (this.targetLookAt.z - this.currentLookAt.z) * 0.055;

    // Smooth Tilt Dampening
    this.tiltX += (this.targetTiltX - this.tiltX) * 0.08;
    this.tiltY += (this.targetTiltY - this.tiltY) * 0.08;
    if (!this.isDragging) {
      this.targetTiltX *= 0.96;
      this.targetTiltY *= 0.96;
    }

    // Apply Camera Transform with tilt
    this.camera.position.set(
      this.currentCamPos.x + this.tiltY * 4.0,
      this.currentCamPos.y + this.tiltX * 3.0,
      this.currentCamPos.z
    );
    this.camera.lookAt(this.currentLookAt.x, this.currentLookAt.y, this.currentLookAt.z);

    // Cross-fade visibility between Plant & Cell groups
    if (this.plantGroup) {
      this.plantGroup.visible = config.plantVisible;
      const targetScale = config.plantScale;
      this.plantGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      // Gentle floating plant sway
      this.plantGroup.rotation.y = Math.sin(Date.now() * 0.0008) * 0.12 + this.tiltY * 0.5;
    }

    if (this.cellGroup) {
      this.cellGroup.visible = config.cellVisible;
      const targetScale = config.cellScale;
      this.cellGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      // Subtle organic breathing rotation
      this.cellGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.08 + this.tiltY * 0.4;
      this.cellGroup.rotation.x = this.tiltX * 0.4;
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
