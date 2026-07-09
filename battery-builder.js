// Battery Builder Game Module
import { electrodes, batteryLevels } from './data.js';

export function initBatteryBuilder(playSound, addPoints, currentScore, updateHeaderStats) {
  const levelList = document.getElementById('level-list');
  const levelDetailsBox = document.getElementById('level-details-box');
  const cellChemSelect = document.getElementById('cell-chem-select');
  const unitVoltageVal = document.getElementById('unit-voltage-val');
  const batteryGrid = document.getElementById('battery-grid');
  
  const builtVoltageFill = document.getElementById('built-voltage-fill');
  const builtVoltageVal = document.getElementById('built-voltage-val');
  const voltageTargetMarker = document.getElementById('voltage-target-marker');
  
  const btnClearGrid = document.getElementById('btn-clear-grid');
  const btnTestBattery = document.getElementById('btn-test-battery');
  const btnNextLevel = document.getElementById('btn-next-level');
  
  const testResultPanel = document.getElementById('test-result-panel');
  const resultIcon = document.getElementById('result-icon');
  const resultTitle = document.getElementById('result-title');
  const resultMessage = document.getElementById('result-message');
  const resultDetails = document.getElementById('result-details');
  
  let currentLevelIdx = 0;
  let selectedLevel = null;
  let activeCells = []; // List of voltages of placed cells in series
  let chemistriesList = []; // Formatted spontaneous cell configurations
  
  // Prepare chemistry list from electrodes data
  function prepareChemistries() {
    chemistriesList = [];
    // Combine all pairs where E0 > 0 (spontaneous galvanic pairs)
    for (let i = 0; i < electrodes.length; i++) {
      for (let j = 0; j < electrodes.length; j++) {
        const e0Val = electrodes[j].e0 - electrodes[i].e0;
        if (e0Val > 0) {
          chemistriesList.push({
            id: `${electrodes[i].id}-${electrodes[j].id}`,
            anode: electrodes[i],
            cathode: electrodes[j],
            voltage: parseFloat(e0Val.toFixed(2))
          });
        }
      }
    }
    // Sort by voltage ascending
    chemistriesList.sort((a, b) => a.voltage - b.voltage);
    
    // Populate select
    cellChemSelect.innerHTML = '';
    chemistriesList.forEach(chem => {
      const opt = document.createElement('option');
      opt.value = chem.id;
      opt.textContent = `${chem.anode.symbol}-${chem.cathode.symbol} Cell (${chem.voltage}V)`;
      cellChemSelect.appendChild(opt);
    });
    
    updateUnitVoltage();
  }
  
  function updateUnitVoltage() {
    const selectedChem = chemistriesList.find(c => c.id === cellChemSelect.value);
    if (selectedChem) {
      unitVoltageVal.textContent = `${selectedChem.voltage.toFixed(2)} V`;
    }
  }
  
  // Render challenges sidebar list
  function renderLevels() {
    levelList.innerHTML = '';
    batteryLevels.forEach((level, idx) => {
      const card = document.createElement('div');
      card.className = `level-card ${idx === currentLevelIdx ? 'active' : ''}`;
      
      // Load completed status from local storage or app state
      const isCompleted = localStorage.getItem(`battery-level-${level.id}-done`) === 'true';
      if (isCompleted) card.classList.add('completed');
      
      let iconHtml = '<i class="fa-regular fa-circle level-status-icon text-muted"></i>';
      if (isCompleted) {
        iconHtml = '<i class="fa-solid fa-circle-check level-status-icon text-green"></i>';
      } else if (idx === currentLevelIdx) {
        iconHtml = '<i class="fa-solid fa-play level-status-icon text-gold"></i>';
      }
      
      card.innerHTML = `
        <div class="level-card-info">
          <h5>Level ${level.id}: ${level.title}</h5>
          <span>Target: ${level.targetVoltageMin}V - ${level.targetVoltageMax}V</span>
        </div>
        ${iconHtml}
      `;
      
      card.addEventListener('click', () => {
        playSound('click');
        loadLevel(idx);
      });
      
      levelList.appendChild(card);
    });
  }
  
  function loadLevel(idx) {
    currentLevelIdx = idx;
    selectedLevel = batteryLevels[idx];
    
    // Highlight active card
    const cards = levelList.querySelectorAll('.level-card');
    cards.forEach((c, i) => {
      c.className = `level-card ${i === idx ? 'active' : ''}`;
      const isCompleted = localStorage.getItem(`battery-level-${batteryLevels[i].id}-done`) === 'true';
      if (isCompleted) c.classList.add('completed');
    });
    
    // Load specs
    levelDetailsBox.classList.remove('hide');
    document.getElementById('req-device').textContent = `${selectedLevel.device} ${selectedLevel.deviceIcon}`;
    document.getElementById('req-voltage').textContent = `${selectedLevel.targetVoltageMin.toFixed(1)}V - ${selectedLevel.targetVoltageMax.toFixed(1)}V`;
    document.getElementById('req-desc').textContent = selectedLevel.description;
    document.getElementById('req-hint-text').textContent = selectedLevel.hint;
    
    // Position target marker on slider
    // Voltage scale is 0V to 15V
    const minPct = (selectedLevel.targetVoltageMin / 15) * 100;
    const maxPct = (selectedLevel.targetVoltageMax / 15) * 100;
    voltageTargetMarker.style.left = `${minPct}%`;
    voltageTargetMarker.style.width = `${maxPct - minPct}%`;
    
    // Clear bench result
    testResultPanel.className = 'test-result-panel glass-inner hide';
    btnNextLevel.classList.add('hide');
    
    // Empty workspace cells
    clearGrid();
  }
  
  function renderGrid() {
    batteryGrid.innerHTML = '';
    
    // Up to 6 slots
    for (let i = 0; i < 6; i++) {
      const slot = document.createElement('div');
      slot.className = 'cell-slot';
      
      if (i < activeCells.length) {
        const cellData = activeCells[i];
        slot.classList.add('has-cell');
        
        slot.innerHTML = `
          <div class="cell-cap"></div>
          <div class="cell-present">
            <span class="cell-chem">${cellData.chemName}</span>
            <span class="cell-voltage">${cellData.voltage.toFixed(2)}V</span>
            <button class="cell-remove" data-index="${i}"><i class="fa-solid fa-xmark"></i> Remove</button>
          </div>
        `;
        
        // Remove button click
        slot.querySelector('.cell-remove').addEventListener('click', (e) => {
          e.stopPropagation();
          playSound('click');
          removeCell(i);
        });
      } else {
        slot.innerHTML = `
          <i class="fa-solid fa-plus" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
          <span style="font-size: 0.8rem; font-weight:600;">Add Cell</span>
        `;
        slot.addEventListener('click', () => {
          playSound('click');
          addCellToGrid();
        });
      }
      
      batteryGrid.appendChild(slot);
      
      // Wire connector in series (except after last element)
      if (i < 5) {
        const wire = document.createElement('div');
        wire.className = 'series-wire';
        // Active wire glow if we have cell on left and cell on right or slot
        if (i < activeCells.length - 1) {
          wire.style.opacity = '1';
          wire.style.background = '#10b981';
          wire.style.boxShadow = '0 0 10px #10b981';
        } else {
          wire.style.opacity = '0.2';
        }
        batteryGrid.appendChild(wire);
      }
    }
    
    // Recalculate totals
    updateTotals();
  }
  
  function addCellToGrid() {
    if (activeCells.length >= 6) {
      alert("Maximum of 6 cells in series reached!");
      return;
    }
    
    const selectedChem = chemistriesList.find(c => c.id === cellChemSelect.value);
    if (selectedChem) {
      activeCells.push({
        chemId: selectedChem.id,
        chemName: `${selectedChem.anode.symbol}-${selectedChem.cathode.symbol}`,
        voltage: selectedChem.voltage
      });
      renderGrid();
    }
  }
  
  function removeCell(idx) {
    activeCells.splice(idx, 1);
    renderGrid();
  }
  
  function clearGrid() {
    activeCells = [];
    renderGrid();
  }
  
  function updateTotals() {
    const totalVoltage = activeCells.reduce((sum, cell) => sum + cell.voltage, 0);
    builtVoltageVal.textContent = `${totalVoltage.toFixed(2)} V`;
    
    // Update meter fill (range 0 to 15V)
    let fillPct = (totalVoltage / 15) * 100;
    if (fillPct > 100) fillPct = 100;
    builtVoltageFill.style.width = `${fillPct}%`;
    
    // Change color based on comparison with selected level limits
    if (selectedLevel) {
      if (totalVoltage === 0) {
        builtVoltageFill.style.background = 'linear-gradient(90deg, var(--color-secondary) 0%, var(--color-primary) 100%)';
      } else if (totalVoltage < selectedLevel.targetVoltageMin) {
        builtVoltageFill.style.background = '#f59e0b'; // Amber - warning underpowered
      } else if (totalVoltage > selectedLevel.targetVoltageMax) {
        builtVoltageFill.style.background = '#f43f5e'; // Rose - overloaded
      } else {
        builtVoltageFill.style.background = '#10b981'; // Green - perfect!
      }
    }
  }
  
  function testBattery() {
    if (!selectedLevel) return;
    
    const totalVoltage = activeCells.reduce((sum, cell) => sum + cell.voltage, 0);
    
    testResultPanel.classList.remove('hide');
    btnNextLevel.classList.add('hide');
    
    if (activeCells.length === 0) {
      playSound('error');
      testResultPanel.className = 'test-result-panel glass-inner fail';
      resultIcon.textContent = '🔌';
      resultTitle.textContent = 'Disconnected';
      resultMessage.textContent = 'There are no battery cells in the workbench circuit. Please place at least one cell in the grid to connect the circuit.';
      resultDetails.textContent = '';
      return;
    }
    
    if (totalVoltage < selectedLevel.targetVoltageMin) {
      // Underpowered
      playSound('error');
      testResultPanel.className = 'test-result-panel glass-inner fail';
      resultIcon.textContent = '📴';
      resultTitle.textContent = 'Underpowered! (Voltage Too Low)';
      resultMessage.textContent = `The device requires at least ${selectedLevel.targetVoltageMin.toFixed(1)} V to operate. Your battery pack only outputted ${totalVoltage.toFixed(2)} V.`;
      resultDetails.innerHTML = `
        <strong>Diagnostic:</strong> The electrical force is insufficient to overcome the threshold resistance of the ${selectedLevel.device}.<br>
        <strong>Fix:</strong> Add more cells in series, or choose a metal pair with a higher standard potential (like Magnesium-Gold).
      `;
    } else if (totalVoltage > selectedLevel.targetVoltageMax) {
      // Overloaded / Exploded
      playSound('explosion');
      testResultPanel.className = 'test-result-panel glass-inner fail';
      resultIcon.textContent = '💥';
      resultTitle.textContent = 'Overloaded! Device Destroyed!';
      resultMessage.textContent = `CRITICAL FAILURE: Your battery pack supplied ${totalVoltage.toFixed(2)} V, which exceeds the absolute maximum tolerance of ${selectedLevel.targetVoltageMax.toFixed(1)} V.`;
      resultDetails.innerHTML = `
        <strong style="color: var(--color-red)">Damage Report:</strong> Excessive current flooded the circuit, causing thermal runway and burning out the internal junctions of the ${selectedLevel.device}.<br>
        <strong>Fix:</strong> Remove some cells in series, or use a metal pair with a lower cell potential.
      `;
    } else {
      // Success!
      playSound('success');
      testResultPanel.className = 'test-result-panel glass-inner success';
      resultIcon.textContent = '🎉';
      resultTitle.textContent = 'Mission Accomplished!';
      resultMessage.textContent = `Perfect! Your battery pack supplied a clean ${totalVoltage.toFixed(2)} V, powering the ${selectedLevel.device} successfully!`;
      
      const scoreAwarded = selectedLevel.id * 50;
      
      // Update completion details
      const alreadyCleared = localStorage.getItem(`battery-level-${selectedLevel.id}-done`) === 'true';
      if (!alreadyCleared) {
        localStorage.setItem(`battery-level-${selectedLevel.id}-done`, 'true');
        addPoints(scoreAwarded);
        resultDetails.innerHTML = `
          <strong>Result:</strong> Circuit activated successfully. Stable potential achieved. <br>
          <strong class="text-gold">+${scoreAwarded} Points Awarded!</strong>
        `;
      } else {
        resultDetails.innerHTML = `
          <strong>Result:</strong> Circuit activated successfully. Stable potential achieved. <br>
          <span class="text-muted">(Level already completed, no extra points awarded).</span>
        `;
      }
      
      // Show next level button if there is a next level
      if (currentLevelIdx < batteryLevels.length - 1) {
        btnNextLevel.classList.remove('hide');
      } else {
        resultDetails.innerHTML += `<br><span class="text-cyan font-bold"><i class="fa-solid fa-award"></i> Congratulations! You are now a Master Battery Engineer!</span>`;
      }
      
      // Re-render level list to show checkmarks
      renderLevels();
    }
  }
  
  // Event listeners
  cellChemSelect.addEventListener('change', () => {
    playSound('click');
    updateUnitVoltage();
  });
  
  btnClearGrid.addEventListener('click', () => {
    playSound('click');
    clearGrid();
  });
  
  btnTestBattery.addEventListener('click', () => {
    testBattery();
  });
  
  btnNextLevel.addEventListener('click', () => {
    playSound('chime');
    loadLevel(currentLevelIdx + 1);
  });
  
  // Initialize
  prepareChemistries();
  renderLevels();
  loadLevel(0);
}
