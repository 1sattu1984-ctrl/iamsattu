// Standard Reduction Potentials, Redox Equations, Battery Levels, and Electroplating Constants

export const electrodes = [
  {
    id: 'Mg',
    name: 'Magnesium',
    symbol: 'Mg',
    ion: 'Mg²⁺',
    ionSymbol: 'Mg2+',
    charge: 2,
    e0: -2.37,
    color: '#e2e8f0', // Silver-white
    ionColor: 'rgba(255, 255, 255, 0.1)', // Colorless
    description: 'A highly reactive alkaline earth metal. Excellent for generating high voltages but corrodes quickly.',
    funFact: 'Magnesium is used in flares and fireworks due to its bright white burn!'
  },
  {
    id: 'Al',
    name: 'Aluminum',
    symbol: 'Al',
    ion: 'Al³⁺',
    ionSymbol: 'Al3+',
    charge: 3,
    e0: -1.66,
    color: '#cbd5e1', // Light grey
    ionColor: 'rgba(255, 255, 255, 0.1)', // Colorless
    description: 'Lightweight and highly reactive, though it forms a protective oxide layer in air.',
    funFact: 'Aluminum was once more precious than gold because it was extremely difficult to refine.'
  },
  {
    id: 'Zn',
    name: 'Zinc',
    symbol: 'Zn',
    ion: 'Zn²⁺',
    ionSymbol: 'Zn2+',
    charge: 2,
    e0: -0.76,
    color: '#94a3b8', // Dull grey
    ionColor: 'rgba(255, 255, 255, 0.1)', // Colorless
    description: 'The classic anode metal. Widely used in alkaline batteries and galvanization (rust prevention).',
    funFact: 'Zinc is essential for human immune function and cell division!'
  },
  {
    id: 'Fe',
    name: 'Iron',
    symbol: 'Fe',
    ion: 'Fe²⁺',
    ionSymbol: 'Fe2+',
    charge: 2,
    e0: -0.44,
    color: '#707a8a', // Dark grey
    ionColor: 'rgba(187, 247, 208, 0.15)', // Pale green tint
    description: 'A common structural metal. Highly susceptible to rust via electrochemical oxidation.',
    funFact: 'Hemoglobin in your blood uses iron ions to carry oxygen throughout your body.'
  },
  {
    id: 'Ni',
    name: 'Nickel',
    symbol: 'Ni',
    ion: 'Ni²⁺',
    ionSymbol: 'Ni2+',
    charge: 2,
    e0: -0.25,
    color: '#a1a1aa', // Silver-grey yellow tint
    ionColor: 'rgba(134, 239, 172, 0.25)', // Beautiful emerald green tint
    description: 'Resistant to corrosion, nickel is widely used in electroplating and rechargeble NiMH/NiCd batteries.',
    funFact: 'Most of Earth\'s nickel is located in the core, along with iron!'
  },
  {
    id: 'Pb',
    name: 'Lead',
    symbol: 'Pb',
    ion: 'Pb²⁺',
    ionSymbol: 'Pb2+',
    charge: 2,
    e0: -0.13,
    color: '#6b7280', // Blue-grey
    ionColor: 'rgba(255, 255, 255, 0.1)', // Colorless
    description: 'A heavy, dense metal. Known for its historical use in pipes, paint, and car lead-acid batteries.',
    funFact: 'Lead-acid car batteries are one of the most highly recycled products in the world.'
  },
  {
    id: 'Cu',
    name: 'Copper',
    symbol: 'Cu',
    ion: 'Cu²⁺',
    ionSymbol: 'Cu2+',
    charge: 2,
    e0: 0.34,
    color: '#ea580c', // Reddish orange
    ionColor: 'rgba(14, 165, 233, 0.35)', // Vibrant blue
    description: 'An excellent conductor. Highly stable, making it a classic cathode when paired with reactive metals.',
    funFact: 'Copper naturally kills bacteria, viruses, and fungi on contact!'
  },
  {
    id: 'Ag',
    name: 'Silver',
    symbol: 'Ag',
    ion: 'Ag⁺',
    ionSymbol: 'Ag+',
    charge: 1,
    e0: 0.80,
    color: '#f1f5f9', // Bright shiny white
    ionColor: 'rgba(255, 255, 255, 0.1)', // Colorless
    description: 'The highest electrical conductivity of all metals. Excellent cathode material, though expensive.',
    funFact: 'Silver compounds were used in photography before digital cameras were invented.'
  },
  {
    id: 'Au',
    name: 'Gold',
    symbol: 'Au',
    ion: 'Au³⁺',
    ionSymbol: 'Au3+',
    charge: 3,
    e0: 1.50,
    color: '#eab308', // Yellow gold
    ionColor: 'rgba(234, 179, 8, 0.2)', // Yellow-gold tint
    description: 'Extremely noble metal, resisting oxidation and corrosion. Highly conductive and highly valuable.',
    funFact: 'Gold is so malleable that a single ounce can be beaten into a sheet covering 100 square feet!'
  }
];

export const batteryLevels = [
  {
    id: 1,
    title: 'Light Up the LED',
    description: 'Build a battery that can power a tiny red LED. If the voltage is too low, the LED won\'t turn on. If it\'s too high, it might burn out!',
    targetVoltageMin: 1.6,
    targetVoltageMax: 2.2,
    device: 'Red LED',
    deviceIcon: '💡',
    hint: 'Try pairing Zinc (E⁰ = -0.76V) with Silver (E⁰ = +0.80V) for a single cell, or stack two weaker cells together.'
  },
  {
    id: 2,
    title: 'The Pocket Radio',
    description: 'Power a portable radio receiver. It requires a stable 3.0V to 3.6V output.',
    targetVoltageMin: 3.0,
    targetVoltageMax: 3.6,
    device: 'FM Radio',
    deviceIcon: '📻',
    hint: 'Magnesium (E⁰ = -2.37V) is very reactive. If you pair it with Copper (E⁰ = +0.34V), how much voltage does one cell give? What if you use a stack of two cells?'
  },
  {
    id: 3,
    title: 'Smartphone Rescue',
    description: 'A smartphone needs exactly 5.0V to charge via its USB port. Build a battery array to charge the phone safely.',
    targetVoltageMin: 4.8,
    targetVoltageMax: 5.4,
    device: 'Smartphone',
    deviceIcon: '📱',
    hint: 'Connect multiple cells in series. The cell voltages add up. For example, three cells of ~1.7V in series would be perfect.'
  },
  {
    id: 4,
    title: 'Electric Go-Kart',
    description: 'Power a school project electric go-kart. It needs a high-power battery pack producing between 11.5V and 13.0V.',
    targetVoltageMin: 11.5,
    targetVoltageMax: 13.0,
    device: 'Electric Go-Kart',
    deviceIcon: '🏎️',
    hint: 'You will need to construct a larger array. Select a high-voltage cell configuration (like Mg-Au or multiple Zn-Cu cells) and put several in series.'
  }
];

export const redoxEquations = [
  {
    id: 1,
    difficulty: 'easy',
    unbalanced: 'Zn + Cu²⁺ → Zn²⁺ + Cu',
    balanced: 'Zn + Cu²⁺ → Zn²⁺ + Cu',
    text: 'A classic zinc-copper replacement reaction. Which elements are oxidized and reduced?',
    reactants: [
      { name: 'Zn', valency: 0, defaultCoeff: '', correctCoeff: 1 },
      { name: 'Cu²⁺', valency: 2, defaultCoeff: '', correctCoeff: 1 }
    ],
    products: [
      { name: 'Zn²⁺', valency: 2, defaultCoeff: '', correctCoeff: 1 },
      { name: 'Cu', valency: 0, defaultCoeff: '', correctCoeff: 1 }
    ],
    explanation: 'Zinc (Zn) is oxidized because it loses electrons (oxidation state increases from 0 to +2). Copper (Cu²⁺) is reduced because it gains electrons (oxidation state decreases from +2 to 0).'
  },
  {
    id: 2,
    difficulty: 'easy',
    unbalanced: 'Al + Ag⁺ → Al³⁺ + Ag',
    balanced: 'Al + 3Ag⁺ → Al³⁺ + 3Ag',
    text: 'Balance the charge! Aluminum loses 3 electrons, but Silver only gains 1. How many silver atoms are needed?',
    reactants: [
      { name: 'Al', defaultCoeff: '', correctCoeff: 1 },
      { name: 'Ag⁺', defaultCoeff: '', correctCoeff: 3 }
    ],
    products: [
      { name: 'Al³⁺', defaultCoeff: '', correctCoeff: 1 },
      { name: 'Ag', defaultCoeff: '', correctCoeff: 3 }
    ],
    explanation: 'To balance the charge, the total electrons lost by Aluminum (3) must equal the total electrons gained by Silver. Thus, we need 3 Silver ions/atoms for every 1 Aluminum.'
  },
  {
    id: 3,
    difficulty: 'medium',
    unbalanced: 'Fe²⁺ + MnO₄⁻ + H⁺ → Fe³⁺ + Mn²⁺ + H₂O',
    balanced: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O',
    text: 'Acidic medium. Manganese in Permanganate (MnO₄⁻) starts at +7 and is reduced to +2. Iron starts at +2 and is oxidized to +3.',
    reactants: [
      { name: 'Fe²⁺', defaultCoeff: '', correctCoeff: 5 },
      { name: 'MnO₄⁻', defaultCoeff: '', correctCoeff: 1 },
      { name: 'H⁺', defaultCoeff: '', correctCoeff: 8 }
    ],
    products: [
      { name: 'Fe³⁺', defaultCoeff: '', correctCoeff: 5 },
      { name: 'Mn²⁺', defaultCoeff: '', correctCoeff: 1 },
      { name: 'H₂O', defaultCoeff: '', correctCoeff: 4 }
    ],
    explanation: 'Manganese gains 5 electrons (reduced from +7 in MnO₄⁻ to +2). Iron loses 1 electron (oxidized from +2 to +3). To balance electrons, we multiply Iron by 5. The oxygen from MnO₄⁻ becomes water, requiring 8 H⁺ to balance the hydrogen.'
  },
  {
    id: 4,
    difficulty: 'medium',
    unbalanced: 'Cr₂O₇²⁻ + I⁻ + H⁺ → Cr³⁺ + I₂ + H₂O',
    balanced: 'Cr₂O₇²⁻ + 6I⁻ + 14H⁺ → 2Cr³⁺ + 3I₂ + 7H₂O',
    text: 'Acidic medium. Dichromate (Cr₂O₇²⁻) is a powerful oxidizing agent. Balanced by half-reactions.',
    reactants: [
      { name: 'Cr₂O₇²⁻', defaultCoeff: '', correctCoeff: 1 },
      { name: 'I⁻', defaultCoeff: '', correctCoeff: 6 },
      { name: 'H⁺', defaultCoeff: '', correctCoeff: 14 }
    ],
    products: [
      { name: 'Cr³⁺', defaultCoeff: '', correctCoeff: 2 },
      { name: 'I₂', defaultCoeff: '', correctCoeff: 3 },
      { name: 'H₂O', defaultCoeff: '', correctCoeff: 7 }
    ],
    explanation: 'Dichromate contains 2 chromium atoms at +6 state, which are reduced to 2 Cr³⁺ (gaining 6 electrons total). Iodine (I⁻) is oxidized to I₂ (each losing 1 electron, 6 total are lost). 14 H⁺ ions balance the 7 water molecules generated by oxygen.'
  },
  {
    id: 5,
    difficulty: 'hard',
    unbalanced: 'Cu + NO₃⁻ + H⁺ → Cu²⁺ + NO₂ + H₂O',
    balanced: 'Cu + 2NO₃⁻ + 4H⁺ → Cu²⁺ + 2NO₂ + 2H₂O',
    text: 'Oxidation of copper by nitric acid. Copper is oxidized, and nitrogen is reduced to nitrogen dioxide gas.',
    reactants: [
      { name: 'Cu', defaultCoeff: '', correctCoeff: 1 },
      { name: 'NO₃⁻', defaultCoeff: '', correctCoeff: 2 },
      { name: 'H⁺', defaultCoeff: '', correctCoeff: 4 }
    ],
    products: [
      { name: 'Cu²⁺', defaultCoeff: '', correctCoeff: 1 },
      { name: 'NO₂', defaultCoeff: '', correctCoeff: 2 },
      { name: 'H₂O', defaultCoeff: '', correctCoeff: 2 }
    ],
    explanation: 'Copper goes from 0 to +2 (loses 2e⁻). Nitrogen in NO₃⁻ goes from +5 to +4 in NO₂ (gains 1e⁻). Thus we need 2 nitrates. The 6 oxygens from nitrates result in 4 in NO₂ and 2 in water. 4 H⁺ are needed to form the water.'
  },
  {
    id: 6,
    difficulty: 'hard',
    unbalanced: 'MnO₄⁻ + C₂O₄²⁻ + H⁺ → Mn²⁺ + CO₂ + H₂O',
    balanced: '2MnO₄⁻ + 5C₂O₄²⁻ + 16H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O',
    text: 'Acidic medium. Reaction of permanganate with oxalate ions. Oxalate carbon is oxidized from +3 to +4 in carbon dioxide.',
    reactants: [
      { name: 'MnO₄⁻', defaultCoeff: '', correctCoeff: 2 },
      { name: 'C₂O₄²⁻', defaultCoeff: '', correctCoeff: 5 },
      { name: 'H⁺', defaultCoeff: '', correctCoeff: 16 }
    ],
    products: [
      { name: 'Mn²⁺', defaultCoeff: '', correctCoeff: 2 },
      { name: 'CO₂', defaultCoeff: '', correctCoeff: 10 },
      { name: 'H₂O', defaultCoeff: '', correctCoeff: 8 }
    ],
    explanation: 'Manganese gains 5e⁻ per ion (reduced +7 to +2). Oxalate (C₂O₄²⁻) has 2 carbons at +3, which oxidize to 2 CO₂ at +4 (losing 2e⁻ per oxalate). The lowest common multiple of 5e⁻ and 2e⁻ is 10. Thus, we multiply permanganate by 2, and oxalate by 5. 16 H⁺ are needed to balance the 8 water molecules formed by the 8 oxygen atoms.'
  }
];

export const electroplatingMetals = [
  {
    id: 'Cu',
    name: 'Copper',
    valency: 2,
    molarMass: 63.546,
    color: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    bathColor: 'rgba(14, 165, 233, 0.25)',
    density: 8.96,
    description: 'Commonly used for circuit boards and undercoating, giving a warm bronze-metallic finish.'
  },
  {
    id: 'Ag',
    name: 'Silver',
    valency: 1,
    molarMass: 107.8682,
    color: '#cbd5e1',
    glowColor: 'rgba(203, 213, 225, 0.4)',
    bathColor: 'rgba(255, 255, 255, 0.1)',
    density: 10.49,
    description: 'Imparts excellent electrical conductivity, lubrication, and a bright, shiny appearance. Ideal for jewelry and cutlery.'
  },
  {
    id: 'Au',
    name: 'Gold',
    valency: 3,
    molarMass: 196.9665,
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    bathColor: 'rgba(251, 191, 36, 0.25)',
    density: 19.30,
    description: 'Corrosion-resistant and highly valuable. Gold plating is used in high-end electronics, connectors, and jewelry.'
  },
  {
    id: 'Ni',
    name: 'Nickel',
    valency: 2,
    molarMass: 58.6934,
    color: '#a1a1aa',
    glowColor: 'rgba(161, 161, 170, 0.4)',
    bathColor: 'rgba(74, 222, 128, 0.2)',
    density: 8.90,
    description: 'Provides corrosion resistance, wear resistance, and a reflective silver-yellow tint. Often used on coins and keys.'
  }
];

export const electroplatingObjects = [
  { id: 'key', name: 'Iron Key', icon: '🔑', area: 15.2 },
  { id: 'spoon', name: 'Soup Spoon', icon: '🥄', area: 38.5 },
  { id: 'ring', name: 'Copper Ring', icon: '💍', area: 5.5 },
  { id: 'coin', name: 'Blank Coin', icon: '🪙', area: 12.0 }
];
