// Galvanic Cell Simulator Module
import { electrodes } from './data.js';

export function initSimulator(playSound) {
  const anodeSelect = document.getElementById('anode-select');
  const cathodeSelect = document.getElementById('cathode-select');
  const voltageValue = document.getElementById('voltage-value');
  const overallReaction = document.getElementById('overall-reaction');
  const anodeReaction = document.getElementById('anode-reaction');
  const cathodeReaction = document.getElementById('cathode-reaction');
  const cellFacts = document.getElementById('cell-facts');
  
  const anodeLabel = document.getElementById('anode-label');
  const cathodeLabel = document.getElementById('cathode-label');
  
  const anodeElectrode = document.getElementById('anode-electrode');
  const cathodeElectrode = document.getElementById('cathode-electrode');
  const leftElectrolyte = document.getElementById('left-electrolyte');
  const rightElectrolyte = document.getElementById('right-electrolyte');
  
  const voltmeterNeedle = document.getElementById('voltmeter-needle');
  const voltmeterScreen = document.getElementById('voltmeter-screen');
  
  const btnPauseSim = document.getElementById('btn-pause-sim');
  const btnResetSim = document.getElementById('btn-reset-sim');
  
  let isSimPaused = false;
  let electronInterval = null;
  let ionInterval = null;
  
  // Populate dropdowns
  function populateSelects() {
    anodeSelect.innerHTML = '';
    cathodeSelect.innerHTML = '';
    
    electrodes.forEach((el, index) => {
      const optAnode = document.createElement('option');
      optAnode.value = el.id;
      optAnode.textContent = `${el.name} (${el.symbol})`;
      
      const optCathode = document.createElement('option');
      optCathode.value = el.id;
      optCathode.textContent = `${el.name} (${el.symbol})`;
      
      // Default selects: Anode = Zinc (idx 2), Cathode = Copper (idx 6)
      if (el.id === 'Zn') optAnode.selected = true;
      if (el.id === 'Cu') optCathode.selected = true;
      
      anodeSelect.appendChild(optAnode);
      cathodeSelect.appendChild(optCathode);
    });
  }
  
  // Get currently selected electrodes
  function getSelectedElectrodes() {
    const anodeId = anodeSelect.value;
    const cathodeId = cathodeSelect.value;
    const anodeData = electrodes.find(el => el.id === anodeId);
    const cathodeData = electrodes.find(el => el.id === cathodeId);
    return { anodeData, cathodeData };
  }
  
  // Calculate potential and update formulas
  function updateCell() {
    const { anodeData, cathodeData } = getSelectedElectrodes();
    
    if (!anodeData || !cathodeData) return;
    
    // Potentials
    const e0Anode = anodeData.e0;
    const e0Cathode = cathodeData.e0;
    
    // Anode is left, Cathode is right in this visual representation
    // E0_cell = E0_cathode - E0_anode
    const e0Cell = e0Cathode - e0Anode;
    
    // Update labels and potentials
    document.getElementById('anode-potential').textContent = `E⁰ = ${e0Anode.toFixed(2)} V`;
    document.getElementById('cathode-potential').textContent = `E⁰ = ${e0Cathode.toFixed(2)} V`;
    
    voltageValue.textContent = `${e0Cell.toFixed(2)} V`;
    voltmeterScreen.textContent = `${e0Cell.toFixed(2)} V`;
    
    // Style values based on spontaneity
    if (e0Cell > 0) {
      voltageValue.className = 'voltage-value text-green';
      voltmeterScreen.style.color = '#10b981';
      voltmeterScreen.style.textShadow = '0 0 10px rgba(16,185,129,0.8)';
    } else if (e0Cell < 0) {
      voltageValue.className = 'voltage-value text-red';
      voltmeterScreen.style.color = '#f43f5e';
      voltmeterScreen.style.textShadow = '0 0 10px rgba(244,63,94,0.8)';
    } else {
      voltageValue.className = 'voltage-value text-muted';
      voltmeterScreen.style.color = '#64748b';
      voltmeterScreen.style.textShadow = 'none';
    }
    
    // Needle rotation (voltmeter: -3V to +3V mapped to -60deg to +60deg)
    // angle = voltage * 20 degrees
    let needleAngle = e0Cell * 20;
    if (needleAngle > 65) needleAngle = 65;
    if (needleAngle < -65) needleAngle = -65;
    voltmeterNeedle.style.transform = `rotate(${needleAngle}deg)`;
    
    // Update SVGs metal colors
    anodeElectrode.setAttribute('fill', anodeData.color);
    cathodeElectrode.setAttribute('fill', cathodeData.color);
    anodeLabel.textContent = `${anodeData.name} (Anode)`;
    cathodeLabel.textContent = `${cathodeData.name} (Cathode)`;
    
    // Update electrolyte liquid colors
    leftElectrolyte.setAttribute('fill', anodeData.ionColor);
    rightElectrolyte.setAttribute('fill', cathodeData.ionColor);
    
    // Generate equations
    generateEquations(anodeData, cathodeData, e0Cell);
    
    // Update Fun facts
    updateFacts(anodeData, cathodeData, e0Cell);
    
    // Restart animation flow
    restartAnimations(anodeData, cathodeData, e0Cell);
  }
  
  function generateEquations(anode, cathode, e0Cell) {
    const aSym = anode.symbol;
    const cSym = cathode.symbol;
    const aChg = anode.charge;
    const cChg = cathode.charge;
    
    // Formatting charge superscript
    const aSup = aChg === 1 ? '+' : `${aChg}+`;
    const cSup = cChg === 1 ? '+' : `${cChg}+`;
    
    // Reactants coefficients for LCM
    // Anode reaction: M1 -> M1^a+ + a e-
    // Cathode reaction: M2^c+ + c e- -> M2
    // LCM of a and c electrons
    const lcm = getLCM(aChg, cChg);
    const aCoeff = lcm / aChg;
    const cCoeff = lcm / cChg;
    
    // Anode Oxidation
    anodeReaction.textContent = `${aSym} → ${aSym}${aSup} + ${aChg}e⁻`;
    
    // Cathode Reduction
    cathodeReaction.textContent = `${cSym}${cSup} + ${cChg}e⁻ → ${cSym}`;
    
    // Overall Balanced Equation
    const aCoeffStr = aCoeff === 1 ? '' : `${aCoeff}`;
    const cCoeffStr = cCoeff === 1 ? '' : `${cCoeff}`;
    
    if (anode.id === cathode.id) {
      overallReaction.textContent = 'No overall reaction (same electrodes)';
    } else if (e0Cell > 0) {
      overallReaction.innerHTML = `${aCoeffStr}${aSym} + ${cCoeffStr}${cSym}<sup>${cSup}</sup> → ${aCoeffStr}${aSym}<sup>${aSup}</sup> + ${cCoeffStr}${cSym}`;
    } else {
      // Non-spontaneous reaction: runs backwards in reality
      overallReaction.innerHTML = `<span style="color: var(--color-red)">${aCoeffStr}${aSym} + ${cCoeffStr}${cSym}<sup>${cSup}</sup> ↛ ${aCoeffStr}${aSym}<sup>${aSup}</sup> + ${cCoeffStr}${cSym}</span>`;
    }
  }
  
  function getLCM(x, y) {
    return (!x || !y) ? 0 : Math.abs((x * y) / getGCD(x, y));
  }
  
  function getGCD(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
      var t = y;
      y = x % y;
      x = t;
    }
    return x;
  }
  
  function updateFacts(anode, cathode, e0Cell) {
    if (anode.id === cathode.id) {
      cellFacts.innerHTML = `
        <h5><i class="fa-solid fa-circle-info text-cyan"></i> Dead Battery</h5>
        <p>Both electrodes are made of <strong>${anode.name}</strong>. Because the chemical potential is identical on both sides, the cell potential is <strong>0.00 V</strong> and no current flows.</p>
      `;
      return;
    }
    
    let spontText = '';
    if (e0Cell > 0) {
      spontText = `This reaction is <strong>spontaneous</strong> (\u0394G < 0). Electrons flow naturally from the active <strong>${anode.name} anode</strong> to the noble <strong>${cathode.name} cathode</strong>.`;
    } else {
      spontText = `This configuration is <strong>non-spontaneous</strong> (\u0394G > 0). Electrons will not flow from Left to Right. In a real cell, this reaction would require a power supply of at least <strong>${Math.abs(e0Cell).toFixed(2)} V</strong> to proceed (electrolysis).`;
    }
    
    cellFacts.innerHTML = `
      <h5><i class="fa-solid fa-circle-nodes text-cyan"></i> Cell Analysis</h5>
      <p>${spontText}</p>
      <div style="margin-top: 0.75rem; font-size: 0.8rem; border-top: 1px solid var(--border-glass); padding-top: 0.5rem;">
        <strong>Anode Fact:</strong> ${anode.funFact}<br>
        <strong>Cathode Fact:</strong> ${cathode.funFact}
      </div>
    `;
  }
  
  // Animation management
  function restartAnimations(anode, cathode, e0Cell) {
    clearInterval(electronInterval);
    clearInterval(ionInterval);
    
    // Clear old visual particles
    const electronsGroup = document.getElementById('electrons-group');
    const bridgeIonsGroup = document.getElementById('bridge-ions-group');
    const electrolyteIonsGroup = document.getElementById('electrolyte-ions-group');
    
    electronsGroup.innerHTML = '';
    bridgeIonsGroup.innerHTML = '';
    electrolyteIonsGroup.innerHTML = '';
    
    const wirePath = document.getElementById('cell-wire');
    
    if (anode.id === cathode.id || isSimPaused) return;
    
    // Electron Flow Direction
    const reverse = e0Cell < 0;
    
    // Wire flow animation using path length and stroke-dashoffset
    wirePath.style.strokeDasharray = '8 8';
    wirePath.style.animation = reverse 
      ? 'flow-right 1.5s infinite linear' 
      : 'flow-left 1.5s infinite linear';
      
    // Spawn electron particles along the wire
    let electronTick = 0;
    electronInterval = setInterval(() => {
      if (isSimPaused) return;
      spawnElectron(reverse);
      electronTick++;
    }, 400);
    
    // Spawn ions in solution and salt bridge
    ionInterval = setInterval(() => {
      if (isSimPaused) return;
      // Anode dissolves: spawn metal ions into left electrolyte
      spawnDissolvingIon(anode, 'left');
      
      // Cathode plates: spawn metal ions moving towards cathode
      spawnPlatingIon(cathode, 'right');
      
      // Salt bridge migration: anions move to anode (left), cations move to cathode (right)
      spawnSaltBridgeIon(reverse);
    }, 800);
  }
  
  function spawnElectron(reverse) {
    const group = document.getElementById('electrons-group');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '4');
    circle.setAttribute('fill', '#fbbf24');
    circle.setAttribute('filter', 'drop-shadow(0 0 4px #fbbf24)');
    
    const animateMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    animateMotion.setAttribute('dur', '2s');
    animateMotion.setAttribute('repeatCount', '1');
    animateMotion.setAttribute('fill', 'freeze');
    
    // Wire path goes: Anode (150, 160) -> (150, 80) -> (450, 80) -> Cathode (450, 160)
    const forwardPath = 'M 150 160 L 150 80 L 450 80 L 450 160';
    const reversePath = 'M 450 160 L 450 80 L 150 80 L 150 160';
    
    animateMotion.setAttribute('path', reverse ? reversePath : forwardPath);
    circle.appendChild(animateMotion);
    group.appendChild(circle);
    
    // Remove after completion
    setTimeout(() => {
      if (circle.parentNode === group) {
        group.removeChild(circle);
      }
    }, 2050);
  }
  
  function spawnDissolvingIon(metal, side) {
    const group = document.getElementById('electrolyte-ions-group');
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = metal.ion;
    text.setAttribute('font-family', 'JetBrains Mono');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', metal.id === 'Cu' ? '#0ea5e9' : metal.id === 'Ni' ? '#4ade80' : '#94a3b8');
    text.setAttribute('opacity', '0.9');
    
    // Starting on the anode surface (around x=140 to 160, y=170 to 240)
    const startX = 145 + (Math.random() * 10 - 5);
    const startY = 170 + Math.random() * 80;
    
    text.setAttribute('x', startX.toString());
    text.setAttribute('y', startY.toString());
    
    // Animate moving away from electrode (e.g. towards left or down)
    const animateX = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateX.setAttribute('attributeName', 'x');
    animateX.setAttribute('from', startX.toString());
    animateX.setAttribute('to', (startX - 40 - Math.random() * 40).toString());
    animateX.setAttribute('dur', '3s');
    animateX.setAttribute('fill', 'freeze');
    
    const animateY = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateY.setAttribute('attributeName', 'y');
    animateY.setAttribute('from', startY.toString());
    animateY.setAttribute('to', (startY + 20 + Math.random() * 40).toString());
    animateY.setAttribute('dur', '3s');
    animateY.setAttribute('fill', 'freeze');
    
    const animateO = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateO.setAttribute('attributeName', 'opacity');
    animateO.setAttribute('from', '0.9');
    animateO.setAttribute('to', '0');
    animateO.setAttribute('dur', '3s');
    animateO.setAttribute('fill', 'freeze');
    
    text.appendChild(animateX);
    text.appendChild(animateY);
    text.appendChild(animateO);
    group.appendChild(text);
    
    setTimeout(() => {
      if (text.parentNode === group) {
        group.removeChild(text);
      }
    }, 3050);
  }
  
  function spawnPlatingIon(metal, side) {
    const group = document.getElementById('electrolyte-ions-group');
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = metal.ion;
    text.setAttribute('font-family', 'JetBrains Mono');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', metal.id === 'Cu' ? '#0ea5e9' : metal.id === 'Ni' ? '#4ade80' : '#94a3b8');
    text.setAttribute('opacity', '0');
    
    // Target position is cathode surface (x = 430 to 445, y=170 to 240)
    const targetX = 435 + (Math.random() * 5);
    const targetY = 170 + Math.random() * 80;
    
    // Start somewhere in electrolyte (x = 385 to 425)
    const startX = 390 + Math.random() * 30;
    const startY = 220 + (Math.random() * 60 - 30);
    
    text.setAttribute('x', startX.toString());
    text.setAttribute('y', startY.toString());
    
    const animateX = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateX.setAttribute('attributeName', 'x');
    animateX.setAttribute('from', startX.toString());
    animateX.setAttribute('to', targetX.toString());
    animateX.setAttribute('dur', '3.5s');
    animateX.setAttribute('fill', 'freeze');
    
    const animateY = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateY.setAttribute('attributeName', 'y');
    animateY.setAttribute('from', startY.toString());
    animateY.setAttribute('to', targetY.toString());
    animateY.setAttribute('dur', '3.5s');
    animateY.setAttribute('fill', 'freeze');
    
    const animateO = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateO.setAttribute('attributeName', 'opacity');
    animateO.setAttribute('values', '0; 0.9; 0.9; 0');
    animateO.setAttribute('keyTimes', '0; 0.2; 0.9; 1');
    animateO.setAttribute('dur', '3.5s');
    animateO.setAttribute('fill', 'freeze');
    
    text.appendChild(animateX);
    text.appendChild(animateY);
    text.appendChild(animateO);
    group.appendChild(text);
    
    setTimeout(() => {
      if (text.parentNode === group) {
        group.removeChild(text);
      }
    }, 3550);
  }
  
  function spawnSaltBridgeIon(reverse) {
    const group = document.getElementById('bridge-ions-group');
    
    // Anions (e.g. NO₃⁻) flow to Anode (Left) to neutralize positive ions dissolving
    // Cations (e.g. K⁺) flow to Cathode (Right) to neutralize loss of positive plating ions
    // If reverse, they flow opposite
    
    // Let's spawn an anion (NO₃⁻) going left
    const anion = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    anion.textContent = reverse ? 'Na⁺' : 'NO₃⁻';
    anion.setAttribute('font-family', 'JetBrains Mono');
    anion.setAttribute('font-size', '9');
    anion.setAttribute('fill', reverse ? '#cbd5e1' : '#f43f5e');
    
    const anionMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    anionMotion.setAttribute('dur', '4s');
    anionMotion.setAttribute('fill', 'freeze');
    
    // Salt bridge path: Left (220, 220) <- (220, 140) <- arc <- (380, 140) <- Right (380, 220)
    const goLeftBridge = 'M 360 210 L 360 140 A 60 60 0 0 0 240 140 L 240 210';
    const goRightBridge = 'M 240 210 L 240 140 A 60 60 0 0 1 360 140 L 360 210';
    
    anionMotion.setAttribute('path', reverse ? goRightBridge : goLeftBridge);
    anion.appendChild(anionMotion);
    group.appendChild(anion);
    
    // Also spawn a cation going right
    const cation = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    cation.textContent = reverse ? 'NO₃⁻' : 'K⁺';
    cation.setAttribute('font-family', 'JetBrains Mono');
    cation.setAttribute('font-size', '9');
    cation.setAttribute('fill', reverse ? '#f43f5e' : '#10b981');
    
    const cationMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    cationMotion.setAttribute('dur', '4s');
    cationMotion.setAttribute('fill', 'freeze');
    
    cationMotion.setAttribute('path', reverse ? goLeftBridge : goRightBridge);
    cation.appendChild(cationMotion);
    group.appendChild(cation);
    
    setTimeout(() => {
      if (anion.parentNode === group) group.removeChild(anion);
      if (cation.parentNode === group) group.removeChild(cation);
    }, 4050);
  }
  
  // Event listeners
  anodeSelect.addEventListener('change', () => {
    playSound('click');
    updateCell();
  });
  
  cathodeSelect.addEventListener('change', () => {
    playSound('click');
    updateCell();
  });
  
  btnPauseSim.addEventListener('click', () => {
    playSound('click');
    isSimPaused = !isSimPaused;
    if (isSimPaused) {
      btnPauseSim.innerHTML = '<i class="fa-solid fa-play"></i> Resume Sim';
      document.getElementById('cell-wire').style.animationPlayState = 'paused';
    } else {
      btnPauseSim.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Sim';
      document.getElementById('cell-wire').style.animationPlayState = 'running';
      updateCell();
    }
  });
  
  btnResetSim.addEventListener('click', () => {
    playSound('chime');
    anodeSelect.value = 'Zn';
    cathodeSelect.value = 'Cu';
    isSimPaused = false;
    btnPauseSim.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Sim';
    document.getElementById('cell-wire').style.animationPlayState = 'running';
    updateCell();
  });
  
  // Initial draw
  populateSelects();
  updateCell();
}
