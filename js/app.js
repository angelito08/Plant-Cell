/**
 * Plant Cell Interactive Scrollytelling Presentation
 * Core JavaScript Application Controller
 * 
 * Features:
 * - Scrollytelling engine with IntersectionObserver
 * - Stage camera focus & organelle bioluminescent highlighting
 * - Presenter navigation dock & quick jump
 * - Interactive Plant Cell Quiz module
 * - Synthetic web audio sound effects for feedback
 * - Responsive optimizations for tablets & projectors
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollytelling();
  initPresenterDock();
  initSvgDirectInteractions();
  initProgressBar();
  initFullscreen();
  initQuizModule();
});

/* ==========================================================================
   Organelle Metadata & Camera Focus Coordinates
   ========================================================================== */
const ORGANELLE_CONFIG = {
  'overview': {
    name: 'Célula Vegetal Completa',
    scale: 1,
    originX: '50%',
    originY: '50%',
    color: '#38ef7d'
  },
  'cell-wall': {
    name: 'Pared Celular (Muralla)',
    scale: 1.05,
    originX: '50%',
    originY: '50%',
    color: '#38ef7d'
  },
  'membrane': {
    name: 'Membrana Plasmática (Filtro)',
    scale: 1.1,
    originX: '50%',
    originY: '50%',
    color: '#00f2fe'
  },
  'cytoplasm': {
    name: 'Citoplasma (Océano Celular)',
    scale: 1.08,
    originX: '50%',
    originY: '50%',
    color: '#4facfe'
  },
  'nucleus': {
    name: 'Núcleo y Nucléolo (Cerebro)',
    scale: 1.45,
    originX: '68%',
    originY: '38%',
    color: '#d946ef'
  },
  'chloroplasts': {
    name: 'Cloroplastos (Cocinas Solares)',
    scale: 1.42,
    originX: '30%',
    originY: '65%',
    color: '#10b981'
  },
  'vacuole': {
    name: 'Vacuola Central (Gran Tinaco)',
    scale: 1.25,
    originX: '42%',
    originY: '38%',
    color: '#06b6d4'
  },
  'mitochondria': {
    name: 'Mitocondrias (Central Eléctrica)',
    scale: 1.5,
    originX: '75%',
    originY: '68%',
    color: '#f97316'
  },
  'golgi': {
    name: 'Aparato de Golgi (Paquetería)',
    scale: 1.55,
    originX: '42%',
    originY: '75%',
    color: '#ec4899'
  },
  'er': {
    name: 'Retículo Endoplasmático (Fábrica)',
    scale: 1.4,
    originX: '62%',
    originY: '48%',
    color: '#8b5cf6'
  },
  'ribosomes': {
    name: 'Ribosomas (Mini Obreros)',
    scale: 1.45,
    originX: '60%',
    originY: '44%',
    color: '#facc15'
  }
};

/* ==========================================================================
   Scrollytelling Engine
   ========================================================================== */
function initScrollytelling() {
  const steps = document.querySelectorAll('.story-step');
  const svgGraphic = document.getElementById('cell-main-svg');
  const stageBadgeText = document.getElementById('stage-organelle-name');
  const stageBadgeDot = document.getElementById('stage-status-dot');
  const organelleGroups = document.querySelectorAll('.organelle-group');

  if (!steps.length || !svgGraphic) return;

  // IntersectionObserver configuration
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px',
    threshold: [0.1, 0.4, 0.7]
  };

  let activeStepId = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        const stepElement = entry.target;
        const targetOrganelle = stepElement.dataset.organelle;

        if (activeStepId === targetOrganelle) return;
        activeStepId = targetOrganelle;

        // 1. Highlight current step card
        steps.forEach((s) => s.classList.remove('is-current'));
        stepElement.classList.add('is-current');

        // 2. Focus organelle on the SVG
        focusOrganelle(targetOrganelle);

        // 3. Update presenter dock active pill
        updateDockActiveState(targetOrganelle);
      }
    });
  }, observerOptions);

  steps.forEach((step) => observer.observe(step));

  // Focus organelle helper function
  function focusOrganelle(organelleKey) {
    const config = ORGANELLE_CONFIG[organelleKey] || ORGANELLE_CONFIG['overview'];

    // Update Stage status badge
    if (stageBadgeText) stageBadgeText.textContent = config.name;
    if (stageBadgeDot) {
      stageBadgeDot.style.background = config.color;
      stageBadgeDot.style.boxShadow = `0 0 10px ${config.color}`;
    }

    // Apply Camera Transform
    svgGraphic.style.transformOrigin = `${config.originX} ${config.originY}`;
    svgGraphic.style.transform = `scale(${config.scale})`;

    // Reset organelle classes
    organelleGroups.forEach((group) => {
      group.classList.remove('is-active', 'is-dimmed');
    });

    if (organelleKey === 'overview') {
      // All visible
      return;
    }

    // Dim all except the selected organelle
    const targetElement = document.getElementById(`organelle-${organelleKey}`);
    organelleGroups.forEach((group) => {
      if (group === targetElement) {
        group.classList.add('is-active');
      } else {
        group.classList.add('is-dimmed');
      }
    });
  }

  // Expose focus function for click events
  window.focusCellOrganelle = focusOrganelle;
}

/* ==========================================================================
   Presenter Dock Navigation
   ========================================================================== */
function initPresenterDock() {
  const dockPills = document.querySelectorAll('.dock-pill');

  dockPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = pill.dataset.target;
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  });
}

function updateDockActiveState(activeOrganelleKey) {
  const dockPills = document.querySelectorAll('.dock-pill');
  dockPills.forEach((pill) => {
    if (pill.dataset.organelle === activeOrganelleKey) {
      pill.classList.add('is-active');
      // Ensure active pill is scrolled into view in horizontal overflow on small screens
      pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      pill.classList.remove('is-active');
    }
  });
}

/* ==========================================================================
   Direct SVG Interaction (Tapping on an organelle inside the SVG)
   ========================================================================== */
function initSvgDirectInteractions() {
  const organelleGroups = document.querySelectorAll('.organelle-group');

  organelleGroups.forEach((group) => {
    const organelleId = group.id.replace('organelle-', '');

    group.addEventListener('click', () => {
      const stepElement = document.getElementById(`step-${organelleId}`);
      if (stepElement) {
        stepElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  });
}

/* ==========================================================================
   Scroll Progress Bar
   ========================================================================== */
function initProgressBar() {
  const progressFill = document.getElementById('progress-fill');
  if (!progressFill) return;

  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    progressFill.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
  }, { passive: true });
}

/* ==========================================================================
   Fullscreen Mode Toggle
   ========================================================================== */
function initFullscreen() {
  const fullscreenBtn = document.getElementById('fullscreen-toggle-btn');
  if (!fullscreenBtn) return;

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen request failed: ${err.message}`);
      });
      fullscreenBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
        Salir
      `;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
          Pantalla Completa
        `;
      }
    }
  });
}

/* ==========================================================================
   Synthesized Audio Chimes (Web Audio API - Zero External Dependencies)
   ========================================================================== */
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
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
    osc1.frequency.setValueAtTime(1046.50, now + 0.3); // C6

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc1.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.7);
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

const soundManager = new SoundEffects();

/* ==========================================================================
   Interactive Quiz Module ("Desafío Celular")
   ========================================================================== */
function initQuizModule() {
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

  function loadQuestion(index) {
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
  }

  function handleOptionSelected(selectedOption, selectedBtn, questionObj) {
    const allOptionBtns = optionsGrid.querySelectorAll('.quiz-option-btn');
    allOptionBtns.forEach((btn) => (btn.disabled = true));

    if (selectedOption.correct) {
      score++;
      selectedBtn.classList.add('is-correct');
      feedbackBox.textContent = questionObj.explanation;
      feedbackBox.className = 'quiz-feedback is-visible is-correct';
      soundManager.playSuccess();
    } else {
      selectedBtn.classList.add('is-incorrect');
      // Show which one was correct
      allOptionBtns.forEach((btn) => {
        const matchingOpt = questionObj.options.find((o) => o.text === btn.textContent);
        if (matchingOpt && matchingOpt.correct) {
          btn.classList.add('is-correct');
        }
      });
      feedbackBox.textContent = `¡Casi! ${questionObj.explanation}`;
      feedbackBox.className = 'quiz-feedback is-visible is-incorrect';
      soundManager.playError();
    }

    if (currentQuestionIndex < quizData.length - 1) {
      nextBtn.textContent = 'Siguiente Pregunta →';
    } else {
      nextBtn.textContent = 'Ver Resultados Finales 🎉';
    }
    nextBtn.classList.add('is-visible');
  }

  nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      loadQuestion(currentQuestionIndex);
    } else {
      showFinalScore();
    }
  });

  function showFinalScore() {
    quizCard.style.display = 'none';
    scoreCard.classList.add('is-visible');
    scoreNumber.textContent = `${score} / ${quizData.length}`;

    if (score === quizData.length) {
      scoreMessage.innerHTML = '🌟 <strong>¡Increíble! ¡Puntaje perfecto!</strong> Eres un experto en la célula vegetal. ¡Felicidades!';
    } else if (score >= 2) {
      scoreMessage.innerHTML = '👏 <strong>¡Muy bien hecho!</strong> Demostraste un gran conocimiento sobre los organelos celulares.';
    } else {
      scoreMessage.innerHTML = '💪 <strong>¡Buen intento!</strong> Puedes volver a explorar la página y repasar para ser un maestro botánico.';
    }
    soundManager.playSuccess();
  }

  restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreCard.classList.remove('is-visible');
    quizCard.style.display = 'block';
    loadQuestion(0);
  });

  // Load first question
  loadQuestion(0);
}
