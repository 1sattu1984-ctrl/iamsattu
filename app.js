// ElectroLab Master App Shell
import { electrodes } from './data.js';
import { initSimulator } from './simulator.js';
import { initBatteryBuilder } from './battery-builder.js';
import { initRedoxGame } from './redox-game.js';
import { initPlatingLab } from './plating-lab.js';

// App States
let score = parseInt(localStorage.getItem('electrolab-score') || '0', 10);
let userLevel = 1;
let soundEnabled = localStorage.getItem('electrolab-sound') !== 'false';

// Web Audio API Synthesizer Context
let audioCtx = null;

// Tab headers mapping
const tabHeaders = {
  'dashboard': { title: 'Welcome to ElectroLab', subtitle: 'Learn the chemistry of electricity and electron transfer' },
  'simulator': { title: 'Galvanic Cell Lab', subtitle: 'Simulate standard cell potentials and electron flow' },
  'battery-builder': { title: 'Battery Builder Challenge', subtitle: 'Engineer chemical cells in series and power gadgets' },
  'redox-game': { title: 'Redox Rush Game', subtitle: 'Test your balancing skills on chemical oxidation-reduction equations' },
  'plating-lab': { title: 'Electroplating Workshop', subtitle: 'Deposit metals onto substrates using Faraday\'s Law calculations' },
  'reference': { title: 'Reduction Potentials Reference', subtitle: 'Standard reduction potential table values at 25 °C' }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupSoundControl();
  setupReferenceTable();
  
  // Update header stats on launch
  updateStatsDisplay();
  
  // Initialize sub-modules
  initSimulator(playSound);
  initBatteryBuilder(playSound, addPoints, score, updateStatsDisplay);
  initRedoxGame(playSound, addPoints, score, updateStatsDisplay);
  initPlatingLab(playSound, addPoints);
});

// Navigation Controller
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      playSound('click');
      
      // Update active nav button
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      
      // Update active tab pane
      tabPanes.forEach(pane => {
        if (pane.id === tabId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
      
      // Update top header titles
      const headers = tabHeaders[tabId];
      if (headers) {
        document.getElementById('current-page-title').textContent = headers.title;
        document.getElementById('current-page-subtitle').textContent = headers.subtitle;
      }
      
      // Scroll to top of content
      document.querySelector('.main-content').scrollTop = 0;
    });
  });
}

// Sound Controller & Synthesizer
function setupSoundControl() {
  const soundBtn = document.getElementById('sound-toggle');
  
  function updateSoundButton() {
    if (soundEnabled) {
      soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Sound ON</span>';
      soundBtn.className = 'control-btn footer-btn';
    } else {
      soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>Sound OFF</span>';
      soundBtn.className = 'control-btn footer-btn text-muted';
    }
  }
  
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('electrolab-sound', soundEnabled ? 'true' : 'false');
    updateSoundButton();
    if (soundEnabled) {
      // Warm up audio context on user interaction
      initAudioCtx();
      playSound('click');
    }
  });
  
  updateSoundButton();
}

function initAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Synthesize diverse sounds utilizing OscillatorNodes & GainNodes
function playSound(type) {
  if (!soundEnabled) return;
  
  try {
    initAudioCtx();
    const t = audioCtx.currentTime;
    
    if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(1000, t + 0.05);
      
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } 
    else if (type === 'chime') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, t); // D5
      osc.frequency.setValueAtTime(880.00, t + 0.05); // A5
      
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    } 
    else if (type === 'success') {
      // Arpeggio chord sweep (C major)
      const freqs = [261.63, 329.63, 392.00, 523.25];
      freqs.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + index * 0.06);
        
        gain.gain.setValueAtTime(0.12, t + index * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + index * 0.06 + 0.2);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t + index * 0.06);
        osc.stop(t + index * 0.06 + 0.2);
      });
    } 
    else if (type === 'error') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(90, t + 0.2);
      
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    } 
    else if (type === 'explosion') {
      // White noise generator
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, t);
      filter.frequency.exponentialRampToValueAtTime(30, t + 0.4);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(t);
      noise.stop(t + 0.4);
    }
  } catch (err) {
    console.warn('Audio Context creation failed or blocked by autoplay permissions:', err);
  }
}

// User Progression Management
function addPoints(amount) {
  score += amount;
  localStorage.setItem('electrolab-score', score.toString());
  
  // Calculate Level:
  // Lvl 1: 0 - 199
  // Lvl 2: 200 - 499
  // Lvl 3: 500 - 899
  // Lvl 4: 900 - 1399
  // Lvl 5: 1400+
  const oldLevel = userLevel;
  if (score < 200) userLevel = 1;
  else if (score < 500) userLevel = 2;
  else if (score < 900) userLevel = 3;
  else if (score < 1400) userLevel = 4;
  else userLevel = 5;
  
  updateStatsDisplay();
  
  // If leveled up, trigger special celebration chime
  if (userLevel > oldLevel) {
    setTimeout(() => {
      playSound('success');
      alert(`🎉 Level Up! You reached Level ${userLevel}!`);
    }, 500);
  }
}

function updateStatsDisplay() {
  document.getElementById('user-score').textContent = score.toString();
  document.getElementById('user-level').textContent = userLevel.toString();
}

// Populate Standard Reduction Potentials reference page
function setupReferenceTable() {
  const tableBody = document.getElementById('reference-table-body');
  const searchInput = document.getElementById('ref-search');
  
  // Sort electrodes in standard potential format: descending order (least active to most active)
  const sorted = [...electrodes].sort((a, b) => b.e0 - a.e0);
  
  function renderTable(filterQuery = '') {
    tableBody.innerHTML = '';
    
    const query = filterQuery.toLowerCase().trim();
    const filtered = sorted.filter(el => 
      el.name.toLowerCase().includes(query) || 
      el.symbol.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No metals found matching "${filterQuery}"
          </td>
        </tr>
      `;
      return;
    }
    
    filtered.forEach(el => {
      const row = document.createElement('tr');
      
      const chargeSup = el.charge === 1 ? '+' : `${el.charge}+`;
      const sign = el.e0 >= 0 ? '+' : '';
      const potClass = el.e0 >= 0 ? 'positive' : 'negative';
      
      // Behavior summaries
      let behavior = '';
      if (el.e0 > 0.5) behavior = 'Strong oxidizing agent (Cathodic). Resists corrosion.';
      else if (el.e0 > 0.0) behavior = 'Moderate cathode material. Fairly stable.';
      else if (el.e0 > -0.8) behavior = 'Active metal. Easily oxidized (Anodic).';
      else behavior = 'Highly reactive reducing agent. Strong anode material.';
      
      row.innerHTML = `
        <td class="ref-half-reaction">${el.ionSymbol} + ${el.charge}e⁻ ⇌ ${el.symbol}(s)</td>
        <td class="ref-potential ${potClass}">${sign}${el.e0.toFixed(2)} V</td>
        <td class="ref-behavior">${behavior}</td>
        <td>
          <button class="btn btn-sm btn-secondary btn-fact" data-fact="${el.funFact}" data-name="${el.name}">
            <i class="fa-solid fa-lightbulb"></i> Fact
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Attach details click listeners
    tableBody.querySelectorAll('.btn-fact').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        const metalName = btn.getAttribute('data-name');
        const fact = btn.getAttribute('data-fact');
        alert(`💡 Interesting Fact about ${metalName}:\n\n${fact}`);
      });
    });
  }
  
  // Bind search events
  searchInput.addEventListener('input', (e) => {
    renderTable(e.target.value);
  });
  
  // Initial draw
  renderTable();
}
