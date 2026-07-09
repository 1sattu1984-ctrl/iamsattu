// Electroplating Lab Simulation Module
import { electroplatingMetals, electroplatingObjects } from './data.js';

export function initPlatingLab(playSound, addPoints) {
  const metalSelect = document.getElementById('plating-metal');
  const objectSelect = document.getElementById('plating-object');
  const currentSlider = document.getElementById('plating-current');
  const timeSlider = document.getElementById('plating-time');
  
  const currentVal = document.getElementById('current-val');
  const timeVal = document.getElementById('time-val');
  const metalDesc = document.getElementById('plating-metal-desc');
  const objectDesc = document.getElementById('plating-object-desc');
  
  const btnStartPlating = document.getElementById('btn-start-plating');
  const psCurrent = document.getElementById('ps-current');
  const bubblesFlag = document.getElementById('bubbles-flag');
  
  const platedObjectContainer = document.getElementById('plated-object-container');
  const tankSolution = document.getElementById('tank-solution');
  const platingAnode = document.getElementById('plating-anode');
  const anodeTxt = document.getElementById('anode-txt');
  const cathodeTxt = document.getElementById('cathode-txt');
  const countdownOverlay = document.getElementById('countdown-overlay');
  const timerDigits = document.getElementById('timer-digits');
  
  const platingMathBox = document.getElementById('plating-math-box');
  const mathCharge = document.getElementById('math-charge');
  const mathMass = document.getElementById('math-mass');
  const mathThickness = document.getElementById('math-thickness');
  const mathExplanation = document.getElementById('math-explanation');
  
  // FARADAY CONSTANT
  const FARADAY = 96485.33; // C/mol
  
  // Object SVG templates
  const objectSVGs = {
    key: `
      <!-- Head -->
      <circle cx="20" cy="50" r="16" fill="#475569" stroke="#334155" stroke-width="2" class="substrate-shape" />
      <circle cx="20" cy="50" r="6" fill="#1e293b" />
      <!-- Shaft -->
      <rect x="36" y="46" width="45" height="8" fill="#475569" stroke="#334155" stroke-width="2" class="substrate-shape" />
      <!-- Teeth -->
      <rect x="63" y="54" width="8" height="8" fill="#475569" class="substrate-shape" />
      <rect x="73" y="54" width="8" height="10" fill="#475569" class="substrate-shape" />
    `,
    spoon: `
      <!-- Handle -->
      <rect x="0" y="47" width="60" height="6" rx="2" fill="#475569" stroke="#334155" stroke-width="1.5" class="substrate-shape" />
      <!-- Bowl -->
      <ellipse cx="75" cy="50" rx="20" ry="14" fill="#475569" stroke="#334155" stroke-width="1.5" class="substrate-shape" />
    `,
    ring: `
      <!-- Band -->
      <circle cx="50" cy="50" r="22" fill="none" stroke="#475569" stroke-width="6" class="substrate-shape" />
      <!-- Gem base -->
      <rect x="42" y="20" width="16" height="8" rx="1" fill="#475569" stroke="#334155" stroke-width="1.5" class="substrate-shape" />
      <!-- Gem -->
      <polygon points="50,8 38,20 62,20" fill="#06b6d4" stroke="#0891b2" stroke-width="1" />
    `,
    coin: `
      <!-- Outer circle -->
      <circle cx="50" cy="50" r="28" fill="#475569" stroke="#334155" stroke-width="3" class="substrate-shape" />
      <!-- Inner detail -->
      <circle cx="50" cy="50" r="22" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="3 3" />
      <text x="50" y="56" font-family="Outfit" font-weight="bold" font-size="16" fill="#334155" text-anchor="middle">e⁻</text>
    `
  };
  
  // Populate dropdowns
  function populateControls() {
    metalSelect.innerHTML = '';
    electroplatingMetals.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.name} (z = +${m.valency})`;
      metalSelect.appendChild(opt);
    });
    
    objectSelect.innerHTML = '';
    electroplatingObjects.forEach(obj => {
      const opt = document.createElement('option');
      opt.value = obj.id;
      opt.textContent = `${obj.name} (${obj.icon})`;
      objectSelect.appendChild(opt);
    });
    
    updateMetalDetails();
    updateObjectDetails();
  }
  
  function updateMetalDetails() {
    const metal = electroplatingMetals.find(m => m.id === metalSelect.value);
    if (metal) {
      metalDesc.textContent = `Molar Mass: ${metal.molarMass.toFixed(2)} g/mol | Valency: +${metal.valency}`;
      
      // Update Anode visuals in tank
      platingAnode.setAttribute('fill', metal.color);
      platingAnode.setAttribute('filter', `drop-shadow(0 0 5px ${metal.glowColor})`);
      anodeTxt.textContent = `${metal.name} Anode (+)`;
      
      // Change electrolyte solution color to match metal ion color
      tankSolution.setAttribute('fill', metal.bathColor);
    }
  }
  
  function updateObjectDetails() {
    const obj = electroplatingObjects.find(o => o.id === objectSelect.value);
    if (obj) {
      objectDesc.textContent = `Surface Area: ${obj.area.toFixed(1)} cm²`;
      cathodeTxt.textContent = `${obj.name} (-)`;
      
      // Render SVG shape
      platedObjectContainer.innerHTML = objectSVGs[obj.id] || '';
      
      // Reset color of substrate to base grey
      const shapes = platedObjectContainer.querySelectorAll('.substrate-shape');
      shapes.forEach(shape => {
        shape.setAttribute('fill', '#475569');
        shape.setAttribute('stroke', '#334155');
        shape.style.transition = 'none';
      });
    }
  }
  
  // Run plating calculations using Faraday's Law
  function getPlatingCalculations() {
    const metal = electroplatingMetals.find(m => m.id === metalSelect.value);
    const obj = electroplatingObjects.find(o => o.id === objectSelect.value);
    
    const I = parseFloat(currentSlider.value); // Amps
    const minutes = parseFloat(timeSlider.value);
    const t = minutes * 60; // seconds
    
    // Q = I * t
    const Q = I * t;
    
    // m = (Q * M) / (z * F)
    const M = metal.molarMass;
    const z = metal.valency;
    const m = (Q * M) / (z * FARADAY);
    
    // Thickness = Volume / Area -> V = m / density
    const volume = m / metal.density; // cm³
    const thicknessCm = volume / obj.area; // cm
    const thicknessUm = thicknessCm * 10000; // micro-meters
    
    return { Q, m, thicknessUm, I, t, minutes, metal, obj };
  }
  
  // Start simulation loops
  function runPlating() {
    const calc = getPlatingCalculations();
    
    // Disable inputs
    btnStartPlating.disabled = true;
    metalSelect.disabled = true;
    objectSelect.disabled = true;
    currentSlider.disabled = true;
    timeSlider.disabled = true;
    
    // Reset math display
    platingMathBox.classList.add('hide');
    
    // Set power supply current visual
    psCurrent.textContent = calc.I.toFixed(2);
    bubblesFlag.classList.remove('hide');
    
    // Start bubbles animation
    const bubblesInterval = startBubbling();
    
    // Overlay countdown
    countdownOverlay.classList.remove('hide');
    playSound('chime');
    
    // Simulation speeds up: 1 minute = 300ms of real-time
    const simDurationMs = calc.minutes * 300;
    const startTime = Date.now();
    
    // Transition color of substrate shape slowly to metal color
    const shapes = platedObjectContainer.querySelectorAll('.substrate-shape');
    shapes.forEach(shape => {
      shape.style.transition = `fill ${simDurationMs}ms ease-out, stroke ${simDurationMs}ms ease-out`;
      shape.setAttribute('fill', calc.metal.color);
      shape.setAttribute('stroke', adjustColorBrightness(calc.metal.color, -30));
    });
    
    // Timer ticker
    const timerInterval = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const progress = Math.min(elapsedMs / simDurationMs, 1);
      
      // Calculate remaining sim-minutes
      const remainingSimSec = Math.max(calc.t * (1 - progress), 0);
      const remMins = Math.floor(remainingSimSec / 60);
      const remSecs = Math.floor(remainingSimSec % 60);
      
      timerDigits.textContent = `${remMins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
      
      if (progress >= 1) {
        clearInterval(timerInterval);
        clearInterval(bubblesInterval);
        endPlating(calc);
      }
    }, 50);
  }
  
  function endPlating(calc) {
    playSound('success');
    
    // Stop simulation states
    countdownOverlay.classList.add('hide');
    bubblesFlag.classList.add('hide');
    psCurrent.textContent = '0.00';
    
    // Enable inputs
    btnStartPlating.disabled = false;
    metalSelect.disabled = false;
    objectSelect.disabled = false;
    currentSlider.disabled = false;
    timeSlider.disabled = false;
    
    // Display Math
    platingMathBox.classList.remove('hide');
    mathCharge.textContent = `${calc.Q.toLocaleString(undefined, {maximumFractionDigits: 1})} C`;
    mathMass.textContent = `${calc.m.toFixed(4)} g`;
    mathThickness.textContent = `${calc.thicknessUm.toFixed(2)} μm`;
    
    // Explain math step-by-step
    mathExplanation.innerHTML = `
      <p><strong>Step-by-step calculation:</strong></p>
      <ol class="bal-steps" style="margin-top:0.5rem; margin-left:1.25rem;">
        <li><strong>Calculate charge (Q):</strong> <br>
          \\(Q = I \\cdot t = ${calc.I.toFixed(2)}\\text{ A} \\times ${calc.t}\\text{ s} = ${calc.Q.toFixed(1)}\\text{ Coulombs}\\)
        </li>
        <li><strong>Calculate moles of electrons:</strong> <br>
          \\(n_{e^-} = \\frac{Q}{F} = \\frac{${calc.Q.toFixed(1)}}{96485.3} = ${(calc.Q / FARADAY).toFixed(6)}\\text{ moles of electrons}\\)
        </li>
        <li><strong>Relate to moles of plated metal (M):</strong> <br>
          Each metal ion requires \\(${calc.metal.valency}\\) electrons to reduce: \\(M^{${calc.metal.valency}+} + ${calc.metal.valency}e^- \\rightarrow M\\). <br>
          \\(n_{metal} = \\frac{n_{e^-}}{z} = \\frac{${(calc.Q / FARADAY).toFixed(6)}}{${calc.metal.valency}} = ${(calc.Q / FARADAY / calc.metal.valency).toFixed(6)}\\text{ moles of }\\text{${calc.metal.name}}\\)
        </li>
        <li><strong>Calculate deposited mass (m):</strong> <br>
          \\(m = n_{metal} \\cdot \\text{Molar Mass} = ${(calc.Q / FARADAY / calc.metal.valency).toFixed(6)} \\times ${calc.metal.molarMass.toFixed(2)} = ${calc.m.toFixed(4)}\\text{ grams}\\)
        </li>
        <li><strong>Calculate thickness:</strong> <br>
          Density of ${calc.metal.name} is \\(${calc.metal.density}\\text{ g/cm}^3\\). <br>
          \\(\\text{Volume} = \\frac{m}{\\text{density}} = \\frac{${calc.m.toFixed(4)}}{${calc.metal.density}} = ${(calc.m / calc.metal.density).toFixed(4)}\\text{ cm}^3\\). <br>
          \\(\\text{Thickness} = \\frac{\\text{Volume}}{\\text{Surface Area}} = \\frac{${(calc.m / calc.metal.density).toFixed(4)}}{${calc.obj.area.toFixed(1)}\\text{ cm}^2} = ${calc.thicknessUm.toFixed(2)}\\text{ }\\mu\\text{m}\\)
        </li>
      </ol>
      <div style="margin-top: 1rem; color: var(--color-accent); font-weight: bold;">
        <i class="fa-solid fa-circle-check"></i> Plating complete! Target substrate successfully coated with ${calc.thicknessUm.toFixed(2)} microns of high-purity ${calc.metal.name}.
      </div>
    `;
    
    // Award points
    const comboKey = `plated-${calc.metal.id}-${calc.obj.id}`;
    const alreadyCleared = localStorage.getItem(comboKey) === 'true';
    if (!alreadyCleared) {
      localStorage.setItem(comboKey, 'true');
      addPoints(40);
    }
    
    // Force MathJax to re-render equations in explanation block
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([mathExplanation]).catch(err => console.log('MathJax error:', err));
    }
  }
  
  function startBubbling() {
    const svg = document.getElementById('tank-svg');
    const group = document.getElementById('plating-particles-group');
    group.innerHTML = '';
    
    // Spawn bubbles (hydrogen gas bubbles forming on the cathode object / right side)
    return setInterval(() => {
      const bubble = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      
      // Position around cathode coordinates (x=330 to 370, y=100 to 220)
      const x = 320 + Math.random() * 60;
      const y = 130 + Math.random() * 80;
      const r = 1.5 + Math.random() * 2.5;
      
      bubble.setAttribute('cx', x.toString());
      bubble.setAttribute('cy', y.toString());
      bubble.setAttribute('r', r.toString());
      bubble.className.baseVal = 'bubble';
      
      // Randomize animation duration slightly
      bubble.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;
      
      group.appendChild(bubble);
      
      setTimeout(() => {
        if (bubble.parentNode === group) {
          group.removeChild(bubble);
        }
      }, 2000);
    }, 150);
  }
  
  // Helper to adjust hex color brightness
  function adjustColorBrightness(hex, percent) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);
    
    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);
    
    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;
    
    R = R > 0 ? R : 0;
    G = G > 0 ? G : 0;
    B = B > 0 ? B : 0;
    
    const rHex = R.toString(16).padStart(2, '0');
    const gHex = G.toString(16).padStart(2, '0');
    const bHex = B.toString(16).padStart(2, '0');
    
    return `#${rHex}${gHex}${bHex}`;
  }
  
  // Event listeners
  metalSelect.addEventListener('change', () => {
    playSound('click');
    updateMetalDetails();
  });
  
  objectSelect.addEventListener('change', () => {
    playSound('click');
    updateObjectDetails();
  });
  
  currentSlider.addEventListener('input', (e) => {
    currentVal.textContent = parseFloat(e.target.value).toFixed(1);
  });
  
  timeSlider.addEventListener('input', (e) => {
    timeVal.textContent = parseFloat(e.target.value).toFixed(1);
  });
  
  btnStartPlating.addEventListener('click', () => {
    runPlating();
  });
  
  // Initialize
  populateControls();
}
