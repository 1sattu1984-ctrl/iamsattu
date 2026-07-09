// Redox Balancing Game Module
import { redoxEquations } from './data.js';

export function initRedoxGame(playSound, addPoints, currentScore, updateHeaderStats) {
  const redoxEquationForm = document.getElementById('redox-equation-form');
  const btnCheckRedox = document.getElementById('btn-check-redox');
  const btnSkipRedox = document.getElementById('btn-skip-redox');
  
  const redoxFeedback = document.getElementById('redox-feedback');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackText = document.getElementById('feedback-text');
  const redoxExplanation = document.getElementById('redox-explanation');
  const btnNextRedox = document.getElementById('btn-next-redox');
  const redoxStreakVal = document.getElementById('redox-streak');
  
  const diffBtns = document.querySelectorAll('.difficulty-selectors button');
  
  let currentDifficulty = 'easy';
  let currentEquation = null;
  let streak = 0;
  
  // Set difficulty selection
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDifficulty = btn.getAttribute('data-difficulty');
      loadNewEquation();
    });
  });
  
  // Load equation
  function loadNewEquation() {
    // Filter equations by difficulty
    const pool = redoxEquations.filter(eq => eq.difficulty === currentDifficulty);
    
    if (pool.length === 0) return;
    
    // Choose one at random, trying not to select the current one if pool is larger than 1
    let nextEq = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && currentEquation && nextEq.id === currentEquation.id) {
      // Pick another
      const remaining = pool.filter(eq => eq.id !== currentEquation.id);
      nextEq = remaining[Math.floor(Math.random() * remaining.length)];
    }
    
    currentEquation = nextEq;
    
    // Reset inputs & feedback panel
    redoxFeedback.className = 'redox-feedback glass-inner hide';
    btnNextRedox.classList.add('hide');
    btnCheckRedox.disabled = false;
    btnSkipRedox.disabled = false;
    
    // Construct inputs form
    buildEquationUI();
  }
  
  function buildEquationUI() {
    redoxEquationForm.innerHTML = '';
    
    // Build Reactants
    currentEquation.reactants.forEach((r, idx) => {
      const termDiv = document.createElement('div');
      termDiv.className = 'eq-term';
      
      termDiv.innerHTML = `
        <div class="coeff-wrapper">
          <input type="text" class="coeff-input" id="reactant-${idx}" value="" placeholder="1">
        </div>
        <span>${formatFormula(r.name)}</span>
      `;
      
      redoxEquationForm.appendChild(termDiv);
      
      // Add '+' between reactants
      if (idx < currentEquation.reactants.length - 1) {
        const plusSpan = document.createElement('span');
        plusSpan.className = 'eq-plus';
        plusSpan.style.margin = '0 0.5rem';
        plusSpan.textContent = '+';
        redoxEquationForm.appendChild(plusSpan);
      }
    });
    
    // Reaction arrow
    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'eq-arrow';
    arrowSpan.innerHTML = '→';
    redoxEquationForm.appendChild(arrowSpan);
    
    // Build Products
    currentEquation.products.forEach((p, idx) => {
      const termDiv = document.createElement('div');
      termDiv.className = 'eq-term';
      
      termDiv.innerHTML = `
        <div class="coeff-wrapper">
          <input type="text" class="coeff-input" id="product-${idx}" value="" placeholder="1">
        </div>
        <span>${formatFormula(p.name)}</span>
      `;
      
      redoxEquationForm.appendChild(termDiv);
      
      // Add '+' between products
      if (idx < currentEquation.products.length - 1) {
        const plusSpan = document.createElement('span');
        plusSpan.className = 'eq-plus';
        plusSpan.style.margin = '0 0.5rem';
        plusSpan.textContent = '+';
        redoxEquationForm.appendChild(plusSpan);
      }
    });
    
    // Attach listener to validate only digits
    const inputs = redoxEquationForm.querySelectorAll('.coeff-input');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        // Only numbers allowed
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });
    });
  }
  
  // Format standard string chemical formula to clean superscripts/subscripts HTML
  function formatFormula(formula) {
    // Replace charges like 2+ or 2- or + or -
    let html = formula;
    
    // Replace numbers after atoms to subscript (e.g. H2O -> H₂O, MnO4- -> MnO₄⁻)
    // Subscripts: ₀₁₂₃₄₅₆₇₈₉
    const subs = { '0':'₀', '1':'₁', '2':'₂', '3':'₃', '4':'₄', '5':'₅', '6':'₆', '7':'₇', '8':'₈', '9':'₉' };
    html = html.replace(/([A-Z-a-z])([0-9]+)/g, (match, p1, p2) => {
      let subbed = '';
      for(let char of p2) {
        subbed += subs[char] || char;
      }
      return p1 + subbed;
    });
    
    // Superscripts for charges (e.g. MnO4-, Zn2+)
    // Superscripts: ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻
    const sups = { '0':'⁰', '1':'¹', '2':'²', '3':'³', '4':'⁴', '5':'⁵', '6':'⁶', '7':'⁷', '8':'⁸', '9':'⁹', '+':'⁺', '-':'⁻' };
    html = html.replace(/(\^[\d+-]+|[\d+-]+\^|[\d+-]+$|\+$|-$)/g, (match) => {
      let clean = match.replace('^', '');
      let subbed = '';
      for(let char of clean) {
        // Swap standard digit orders if needed
        subbed += sups[char] || char;
      }
      return `<sup>${subbed}</sup>`;
    });
    
    return html;
  }
  
  function checkAnswer() {
    if (!currentEquation) return;
    
    let isCorrect = true;
    const reactantsAnswers = [];
    const productsAnswers = [];
    
    // Reactants
    currentEquation.reactants.forEach((r, idx) => {
      const input = document.getElementById(`reactant-${idx}`);
      // Default empty input to 1 (standard notation)
      let val = input.value.trim();
      let coeff = val === '' ? 1 : parseInt(val, 10);
      
      reactantsAnswers.push({ input, userCoeff: coeff, correctCoeff: r.correctCoeff });
      
      if (coeff !== r.correctCoeff) {
        isCorrect = false;
        input.className = 'coeff-input incorrect';
      } else {
        input.className = 'coeff-input correct';
      }
    });
    
    // Products
    currentEquation.products.forEach((p, idx) => {
      const input = document.getElementById(`product-${idx}`);
      let val = input.value.trim();
      let coeff = val === '' ? 1 : parseInt(val, 10);
      
      productsAnswers.push({ input, userCoeff: coeff, correctCoeff: p.correctCoeff });
      
      if (coeff !== p.correctCoeff) {
        isCorrect = false;
        input.className = 'coeff-input incorrect';
      } else {
        input.className = 'coeff-input correct';
      }
    });
    
    redoxFeedback.classList.remove('hide');
    btnNextRedox.classList.remove('hide');
    btnCheckRedox.disabled = true;
    btnSkipRedox.disabled = true;
    
    if (isCorrect) {
      playSound('success');
      redoxFeedback.className = 'redox-feedback glass-inner success';
      feedbackTitle.innerHTML = '<i class="fa-solid fa-circle-check text-green"></i> Correct! Perfectly Balanced!';
      
      // Calculate scores
      let baseVal = currentDifficulty === 'easy' ? 25 : currentDifficulty === 'medium' ? 50 : 100;
      streak++;
      redoxStreakVal.textContent = streak.toString();
      
      const multiplier = Math.min(streak, 4); // Capped at x4 multiplier
      const totalPoints = baseVal * multiplier;
      
      addPoints(totalPoints);
      
      feedbackText.innerHTML = `Great job! You balanced both atoms and charge! <strong class="text-gold">+${totalPoints} Points Added</strong> (Multiplier: x${multiplier}).`;
    } else {
      playSound('error');
      redoxFeedback.className = 'redox-feedback glass-inner fail';
      feedbackTitle.innerHTML = '<i class="fa-solid fa-circle-xmark text-red"></i> Incorrect Coefficients';
      
      streak = 0;
      redoxStreakVal.textContent = streak.toString();
      feedbackText.innerHTML = 'Review the step-by-step balancing explanation below to see where you went wrong. You can always try another one!';
    }
    
    // Load explanation
    redoxExplanation.innerHTML = `
      <p><strong>Balanced Equation:</strong> ${formatFormula(currentEquation.balanced)}</p>
      <p>${currentEquation.explanation}</p>
      <div style="margin-top: 0.5rem; font-size: 0.8rem; border-top: 1px solid var(--border-glass); padding-top: 0.5rem; color: var(--text-muted);">
        <strong>Check of conservation:</strong><br>
        Reactant Side: ${explainConservation(currentEquation.reactants, true)}<br>
        Product Side: ${explainConservation(currentEquation.products, false)}
      </div>
    `;
  }
  
  function explainConservation(elements, isReactants) {
    // Show summary of atoms/charges
    return elements.map(el => `${el.correctCoeff} × ${el.name}`).join(' + ');
  }
  
  // Event listeners
  btnCheckRedox.addEventListener('click', () => {
    checkAnswer();
  });
  
  btnSkipRedox.addEventListener('click', () => {
    playSound('click');
    streak = 0;
    redoxStreakVal.textContent = streak.toString();
    loadNewEquation();
  });
  
  btnNextRedox.addEventListener('click', () => {
    playSound('chime');
    loadNewEquation();
  });
  
  // Initial load
  loadNewEquation();
}
