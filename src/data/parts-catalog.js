// Comprehensive Mechanical Keyboard Parts Catalog
// Contains Cases, PCBs, 7 Dampening Layers, Plates, Stabilizers, Switches (with acoustic specs), Keycaps & Prices

export const CASE_MATERIALS = {
  'abs': {
    id: 'abs',
    name: 'ABS Plastic Case',
    desc: 'Lightweight injection molded ABS. Produces bright, crisp, acoustic resonance.',
    price: 35,
    soundFactor: 1.15, // brighter, higher pitch
    weight: '0.6 kg',
    colors: ['black', 'white', 'beige', 'violet', 'pink']
  },
  'aluminum': {
    id: 'aluminum',
    name: 'CNC 6063 Aluminum',
    desc: 'Solid sandblasted anodized aluminum with internal silver weight bar. Substantial, cold, and deep thock.',
    price: 95,
    soundFactor: 0.82, // dense, deep thock
    weight: '1.8 kg',
    colors: ['black', 'white', 'rosegold', 'violet', 'green', 'smoke']
  },
  'acrylic': {
    id: 'acrylic',
    name: 'Frosted CNC Acrylic',
    desc: 'Multi-layer CNC acrylic with matte frosted finish. High RGB light diffusion and creamy clack.',
    price: 60,
    soundFactor: 0.98,
    weight: '0.9 kg',
    colors: ['smoke', 'white', 'violet']
  },
  'wood': {
    id: 'wood',
    name: 'Natural Walnut Wood',
    desc: 'Hand-carved premium natural walnut wood case. Warm, rich organic acoustic tones.',
    price: 80,
    soundFactor: 0.88,
    weight: '0.8 kg',
    colors: ['wood']
  }
};

export const CASE_COLORS = {
  'black': { id: 'black', name: 'Anodized Midnight Black', hex: '#161719', rimHex: '#25262a', label: 'Black' },
  'white': { id: 'white', name: 'Electrophoresis E-White', hex: '#f0f2f5', rimHex: '#ffffff', label: 'E-White' },
  'rosegold': { id: 'rosegold', name: 'Anodized Rose Gold', hex: '#c98a87', rimHex: '#db9d9a', label: 'Rose Gold' },
  'violet': { id: 'violet', name: 'Cyberpunk Violet', hex: '#4f3b78', rimHex: '#6a4c9c', label: 'Violet' },
  'beige': { id: 'beige', name: 'Retro Industrial Beige', hex: '#c8bfaf', rimHex: '#dbd2c3', label: 'Retro Beige' },
  'green': { id: 'green', name: 'Forest Matcha Green', hex: '#374b3d', rimHex: '#4a6251', label: 'Forest Green' },
  'pink': { id: 'pink', name: 'Sakura Blush Pink', hex: '#e8a9b3', rimHex: '#f5bdc6', label: 'Sakura Pink' },
  'smoke': { id: 'smoke', name: 'Frosted Smoke Grey', hex: '#32363e', rimHex: '#454a54', label: 'Smoke' },
  'wood': { id: 'wood', name: 'Natural Dark Walnut', hex: '#4a2f1c', rimHex: '#5e3c23', label: 'Walnut' }
};

export const PCB_TYPES = {
  'normal_wired': {
    id: 'normal_wired',
    name: 'PCB Normal Wired',
    desc: 'Standard 1.6mm solid FR4 PCB with USB Type-C daughterboard. Solid keystroke bottom-out and reliable stability.',
    price: 35,
    wireless: false,
    flexCut: false,
    thickness: 1.6,
    soundMod: 1.0
  },
  'normal_3conn': {
    id: 'normal_3conn',
    name: 'PCB Normal 3 Connection',
    desc: 'Tri-Mode wireless PCB (2.4GHz Dongle, Bluetooth 5.3 & Type-C wired). Includes 4000mAh battery connector.',
    price: 55,
    wireless: true,
    flexCut: false,
    thickness: 1.6,
    soundMod: 0.96
  },
  'flex_wired': {
    id: 'flex_wired',
    name: 'PCB Flex Cut Wired',
    desc: '1.2mm PCB with per-key horizontal flex-cuts. Delivers soft, cushiony bounce and high-pitched snappy clack.',
    price: 45,
    wireless: false,
    flexCut: true,
    thickness: 1.2,
    soundMod: 1.12
  },
  'flex_3conn': {
    id: 'flex_3conn',
    name: 'PCB Flex Cut 3 Connection',
    desc: '1.2mm Per-Key Flex Cut with Tri-Mode wireless connectivity. Ultimate bouncy typing feel with wireless freedom.',
    price: 68,
    wireless: true,
    flexCut: true,
    thickness: 1.2,
    soundMod: 1.08
  }
};

export const PCB_COLORS = {
  'black': {
    id: 'black',
    name: 'Stealth Matte Black',
    hex: '#141619',
    traceColor: '#ffffff', // White traces
    silkColor: '#ffffff',
    label: 'Hitam',
    desc: 'Solder Mask Hitam Matte • White Traces'
  },
  'red': {
    id: 'red',
    name: 'Classic Enthusiast Red',
    hex: '#8b181c',
    traceColor: '#ffffff', // White traces
    silkColor: '#ffffff',
    label: 'Merah',
    desc: 'Solder Mask Merah Klasik • White Traces'
  },
  'white': {
    id: 'white',
    name: 'Polar Matte White',
    hex: '#e2e7ec',
    traceColor: '#111111', // Black traces for White PCB
    silkColor: '#111111',
    label: 'Putih',
    desc: 'Solder Mask Putih Polar • Black Traces'
  },
  'green': {
    id: 'green',
    name: 'Retro Industrial Green',
    hex: '#115228',
    traceColor: '#ffffff', // White traces
    silkColor: '#ffffff',
    label: 'Hijau',
    desc: 'Solder Mask Hijau Retro • White Traces'
  },
  'blue': {
    id: 'blue',
    name: 'Royal Cobalt Blue',
    hex: '#123963',
    traceColor: '#ffffff', // White traces
    silkColor: '#ffffff',
    label: 'Biru',
    desc: 'Solder Mask Biru Kobalt • White Traces'
  }
};

// Exact 7 Layers of Dampening as requested by User
export const DAMPENING_LAYERS = {
  'case_foam': {
    id: 'case_foam',
    index: 1,
    name: '1. Poron 3mm Bottom Case Foam',
    desc: 'High-density Poron urethane foam placed at the bottom cavity of the case to absorb hollow acoustic reverberation.',
    price: 8,
    acousticCutoff: 1800, // filters out hollow high frequencies
    resonanceFactor: 0.75,
    color: '#1a1a1a'
  },
  'tape_mod': {
    id: 'tape_mod',
    index: 2,
    name: "2. Tempest Tape Mod (3 Layers)",
    desc: "3 layers of specialized painter's tape applied directly to the back of the PCB. Acts as an acoustic low-pass filter, boosting deep frequencies.",
    price: 5,
    acousticCutoff: 1400,
    resonanceFactor: 0.70,
    color: '#d4c28a'
  },
  'battery_pad': {
    id: 'battery_pad',
    index: 3,
    name: '3. Molded Silicone Base / Battery Pad',
    desc: 'Solid molded silicone dampener filling the lower chassis and securing wireless battery compartments. Adds weight and stops case rattle.',
    price: 12,
    acousticCutoff: 1600,
    resonanceFactor: 0.80,
    color: '#2a2d32'
  },
  'pcb_foam': {
    id: 'pcb_foam',
    index: 4,
    name: '4. Poron 3.5mm Plate-to-PCB Foam',
    desc: 'Precision laser-cut foam sandwiched between the plate and the PCB. Prevents vibration transfer and isolates individual switch strikes.',
    price: 10,
    acousticCutoff: 1200,
    resonanceFactor: 0.65,
    color: '#222224'
  },
  'ixpe_switch_pads': {
    id: 'ixpe_switch_pads',
    index: 5,
    name: '5. IXPE 0.5mm Switch Sheet Pads',
    desc: 'Pre-cut IXPE switch film installed on the top surface of the PCB. Responsible for the signature enthusiast "marbly pop" sound.',
    price: 8,
    acousticCutoff: 2200,
    resonanceFactor: 0.55, // adds marbly pop harmonic
    color: '#111111'
  },
  'pet_film': {
    id: 'pet_film',
    index: 6,
    name: '6. PET Acoustic Voice Film',
    desc: 'Ultra-thin PET reflective acoustic sheet installed under switches. Emphasizes clean, crisp, high-clarity bottom-out clacks.',
    price: 7,
    acousticCutoff: 2600,
    resonanceFactor: 0.60,
    color: '#d0e5f2'
  },
  'spacebar_foam': {
    id: 'spacebar_foam',
    index: 7,
    name: '7. Spacebar Cavity Dampening Foam',
    desc: 'Precision dual-insert foam strips placed directly inside the 6.25U / 7U spacebar keycap cavity to eliminate hollow boom.',
    price: 4,
    acousticCutoff: 1500,
    resonanceFactor: 0.70,
    color: '#1e1e1e'
  }
};

export const PLATE_MATERIALS = {
  'pom': {
    id: 'pom',
    name: 'POM Plate',
    desc: 'Flexible and soft polymer plate. Enhances deep, low-pitched "thocky" sound signature and reduces typing fatigue.',
    price: 24,
    pitchMod: 0.85,
    flex: 'High',
    color: '#f4f4f4'
  },
  'fr4': {
    id: 'fr4',
    name: 'FR4 Glass-Epoxy Plate',
    desc: 'Gold-traced PCB material plate. Delivers balanced flex with snappy, clean, poppy acoustics.',
    price: 22,
    pitchMod: 1.05,
    flex: 'Medium',
    color: '#1a1d1e'
  },
  'brass': {
    id: 'brass',
    name: 'Mirror Polished Brass Plate',
    desc: 'Heavy, ultra-stiff brass plate. Yields sharp, high-pitched crisp clacks and extremely consistent tactile feel.',
    price: 38,
    pitchMod: 1.35,
    flex: 'Very Stiff',
    color: '#d8b04e'
  },
  'pc': {
    id: 'pc',
    name: 'Polycarbonate (PC) Plate',
    desc: 'High-flexibility translucent PC plate. Produces a buttery, cushioned bottom-out and creamy acoustic sound.',
    price: 20,
    pitchMod: 0.90,
    flex: 'Very Soft',
    color: '#e2e8f0'
  },
  'aluminum': {
    id: 'aluminum',
    name: 'Anodized Aluminum Plate',
    desc: 'Lightweight and rigid aluminum. Delivers crisp tactile feedback and distinct metallic pop.',
    price: 25,
    pitchMod: 1.20,
    flex: 'Stiff',
    color: '#718096'
  }
};

export const STABILIZERS = {
  'durock_v2': {
    id: 'durock_v2',
    brand: 'Durock V2',
    name: 'Durock V2 Screw-In (Smokey Gold)',
    mount: 'pcb',
    desc: 'Industry gold standard PCB screw-in stabs with gold-plated wires and reverse-stem pop-out prevention.',
    price: 22,
    color: '#2a2a2a',
    wireColor: '#d4af37',
    rattleResistance: 0.95
  },
  'tx_ap': {
    id: 'tx_ap',
    brand: 'TX AP V4',
    name: 'TX AP Almost Perfect (Black 1.6T)',
    mount: 'pcb',
    desc: 'Ultra-tight stem tolerances and POM wire guides. Zero wire rattle right out of the box.',
    price: 25,
    color: '#1c1c1c',
    wireColor: '#c0c0c0',
    rattleResistance: 0.98
  },
  'staebies': {
    id: 'staebies',
    brand: 'Staebies V2',
    name: 'AEBoards x Zambumon Staebies V2',
    mount: 'pcb',
    desc: 'Designed for esports precision with nylon housing and POM stem. Crisp solid bottom-out.',
    price: 26,
    color: '#111111',
    wireColor: '#b0b0b0',
    rattleResistance: 0.96
  },
  'owlstab': {
    id: 'owlstab',
    brand: 'Owlstab V2',
    name: 'OwLab Owlstab V2 (Liquid Metal Wire)',
    mount: 'pcb',
    desc: 'Memory liquid metal wire that never bends or loses balance. Buttery smooth actuation.',
    price: 24,
    color: '#2f3542',
    wireColor: '#70a1ff',
    rattleResistance: 0.97
  },
  'akko_screw': {
    id: 'akko_screw',
    brand: 'Akko Screw-In',
    name: 'Akko Dual-Shot PCB Screw-In',
    mount: 'pcb',
    desc: 'High value nylon screw-in stabilizers with POM stems and nickel-plated wires.',
    price: 16,
    color: '#57606f',
    wireColor: '#e0e0e0',
    rattleResistance: 0.88
  },
  'cherry_plate': {
    id: 'cherry_plate',
    brand: 'Cherry Original',
    name: 'Cherry Original Plate-Mount Stabs',
    mount: 'plate',
    desc: 'Classic snap-in plate-mounted stabilizers. Convenient for tray-mount and plate-clip builds.',
    price: 12,
    color: '#181818',
    wireColor: '#a0a0a0',
    rattleResistance: 0.78
  }
};

export const STAB_TUNING_OPTIONS = {
  'stock': { id: 'stock', name: 'Stock (Unlubed)', desc: 'Direct from packaging. Prone to wire ticking.', rattle: 0.45 },
  'balanced': { id: 'balanced', name: 'Wire Balanced & Straightened', desc: 'Wires straightened on jeweler block.', rattle: 0.20 },
  'holee_mod': { id: 'holee_mod', name: 'Holee Mod + Band-Aid Under Pads', desc: 'Medical tape inserted inside stem core.', rattle: 0.08 },
  'fully_tuned': { id: 'fully_tuned', name: 'Krytox 205g0 + XHT-BDZ Tuned', desc: 'Professional hand lubed: 205g0 on stem, BDZ on wire tips. Pure thock, 0 rattle.', rattle: 0.01 }
};

export const SWITCHES = {
  'milky_yellow': {
    id: 'milky_yellow',
    name: 'Gateron Milky Yellow Pro',
    brand: 'Gateron',
    type: 'linear',
    pins: 5,
    force: '50g',
    travel: '4.0mm',
    desc: 'Legendary budget king. Smooth buttery nylon-housing glide with a deep, pleasing thock.',
    price: 18,
    housingColor: '#fff8dc',
    stemColor: '#f6b93b',
    soundProfile: { baseFreq: 140, clickGain: 0.1, thockGain: 0.85, Q: 3.2, decay: 0.06 }
  },
  'boba_u4t': {
    id: 'boba_u4t',
    name: 'Gazzew Boba U4T (Thock)',
    brand: 'Gazzew',
    type: 'tactile',
    pins: 5,
    force: '62g',
    travel: '3.6mm',
    desc: 'Enthusiast tactile benchmark. Huge rounded D-shaped tactile bump with a pronounced bass thock.',
    price: 36,
    housingColor: '#f1f2f6',
    stemColor: '#e58e26',
    soundProfile: { baseFreq: 110, clickGain: 0.35, thockGain: 0.95, Q: 4.5, decay: 0.08 }
  },
  'holy_panda': {
    id: 'holy_panda',
    name: 'Drop + Invyr Holy Panda',
    brand: 'Drop',
    type: 'tactile',
    pins: 3,
    force: '67g',
    travel: '3.8mm',
    desc: 'Iconic tactile punch with snappy bottom-out pop and distinct acoustic presence.',
    price: 42,
    housingColor: '#f8f9fa',
    stemColor: '#fa8231',
    soundProfile: { baseFreq: 190, clickGain: 0.45, thockGain: 0.75, Q: 3.8, decay: 0.07 }
  },
  'tangerine': {
    id: 'tangerine',
    name: 'C3 Equalz Tangerine 67g',
    brand: 'C3 Equalz',
    type: 'linear',
    pins: 5,
    force: '67g',
    travel: '4.0mm',
    desc: 'UHMWPE housing yields glassy frictionless smoothness and sharp, energetic clacks.',
    price: 38,
    housingColor: '#ff793f',
    stemColor: '#33d9b2',
    soundProfile: { baseFreq: 260, clickGain: 0.15, thockGain: 0.65, Q: 2.8, decay: 0.05 }
  },
  'oil_king': {
    id: 'oil_king',
    name: 'Gateron Oil King',
    brand: 'Gateron',
    type: 'linear',
    pins: 5,
    force: '55g',
    travel: '4.0mm',
    desc: 'Full nylon black housing with extended 20mm spring. Deep, dense marbly marble thock.',
    price: 39,
    housingColor: '#1e272e',
    stemColor: '#000000',
    soundProfile: { baseFreq: 95, clickGain: 0.05, thockGain: 0.98, Q: 5.0, decay: 0.09 }
  },
  'box_white': {
    id: 'box_white',
    name: 'Kailh Box White',
    brand: 'Kailh',
    type: 'clicky',
    pins: 3,
    force: '50g',
    travel: '3.6mm',
    desc: 'Torsional click-bar mechanism produces a sharp, crisp, clean snap on both press and return.',
    price: 22,
    housingColor: '#ffffff',
    stemColor: '#ecf0f1',
    soundProfile: { baseFreq: 1100, clickGain: 0.90, thockGain: 0.25, Q: 6.0, decay: 0.04 }
  },
  'box_jade': {
    id: 'box_jade',
    name: 'Kailh Box Jade',
    brand: 'Kailh',
    type: 'clicky',
    pins: 3,
    force: '50g',
    travel: '3.6mm',
    desc: 'Thickened 0.3mm click-bar delivers an explosive, shotgun-crack acoustic snap and heavy tactility.',
    price: 26,
    housingColor: '#ffffff',
    stemColor: '#20bf6b',
    soundProfile: { baseFreq: 1350, clickGain: 1.0, thockGain: 0.20, Q: 7.5, decay: 0.045 }
  },
  'silent_peach': {
    id: 'silent_peach',
    name: 'Outemu Silent Peach V3',
    brand: 'Outemu',
    type: 'silent',
    pins: 3,
    force: '40g',
    travel: '3.3mm',
    desc: 'Dual-silicone silencing pads absorb top and bottom out strikes. Quiet library whisper.',
    price: 20,
    housingColor: '#fed330',
    stemColor: '#fc5c65',
    soundProfile: { baseFreq: 320, clickGain: 0.02, thockGain: 0.16, Q: 1.2, decay: 0.03 }
  },
  'strawberry': {
    id: 'strawberry',
    name: 'KTT Strawberry',
    brand: 'KTT',
    type: 'linear',
    pins: 3,
    force: '43g',
    travel: '4.0mm',
    desc: 'Transparent polycarbonate pink housing. Crisp, bright, high-definition acoustic clack.',
    price: 24,
    housingColor: '#ff9ff3',
    stemColor: '#eb4d4b',
    soundProfile: { baseFreq: 240, clickGain: 0.12, thockGain: 0.70, Q: 3.0, decay: 0.05 }
  },
  'lavender_purple': {
    id: 'lavender_purple',
    name: 'Akko CS Lavender Purple',
    brand: 'Akko',
    type: 'tactile',
    pins: 3,
    force: '36g',
    travel: '4.0mm',
    desc: 'Early 0.5mm tactile bump with light spring. Poppy, responsive, and delightful.',
    price: 22,
    housingColor: '#a29bfe',
    stemColor: '#6c5ce7',
    soundProfile: { baseFreq: 210, clickGain: 0.30, thockGain: 0.72, Q: 3.5, decay: 0.06 }
  },
  'nk_cream': {
    id: 'nk_cream',
    name: 'NovelKeys Cream V2',
    brand: 'NovelKeys',
    type: 'linear',
    pins: 5,
    force: '55g',
    travel: '4.0mm',
    desc: 'Self-lubricating POM housing and stem. Becomes progressively smoother and creamier with use.',
    price: 38,
    housingColor: '#f7f1e3',
    stemColor: '#f7f1e3',
    soundProfile: { baseFreq: 175, clickGain: 0.12, thockGain: 0.88, Q: 3.4, decay: 0.07 }
  },
  'cherry_blue': {
    id: 'cherry_blue',
    name: 'Cherry MX Blue',
    brand: 'Cherry',
    type: 'clicky',
    pins: 3,
    force: '60g',
    travel: '4.0mm',
    desc: 'The original mechanical switch click-jacket. Vintage high-pitched tactile click.',
    price: 25,
    housingColor: '#1e272e',
    stemColor: '#0984e3',
    soundProfile: { baseFreq: 950, clickGain: 0.82, thockGain: 0.30, Q: 5.5, decay: 0.04 }
  },
  'cherry_black': {
    id: 'cherry_black',
    name: 'Cherry MX Black Hyperglide',
    brand: 'Cherry',
    type: 'linear',
    pins: 3,
    force: '60g',
    travel: '4.0mm',
    desc: 'Heavy vintage 60g spring with Hyperglide housing tooling. Deep, low, authoritative clack.',
    price: 28,
    housingColor: '#1e272e',
    stemColor: '#2f3542',
    soundProfile: { baseFreq: 130, clickGain: 0.08, thockGain: 0.90, Q: 3.9, decay: 0.08 }
  },
  'baby_kangaroo': {
    id: 'baby_kangaroo',
    name: 'Gateron Baby Kangaroo 2.0',
    brand: 'Gateron',
    type: 'tactile',
    pins: 5,
    force: '59g',
    travel: '3.4mm',
    desc: 'Dual-stage gold-plated spring with crisp tactile drop. Super poppy marbly audio signature.',
    price: 37,
    housingColor: '#70a1ff',
    stemColor: '#2ed573',
    soundProfile: { baseFreq: 195, clickGain: 0.40, thockGain: 0.85, Q: 4.0, decay: 0.065 }
  },
  'durock_t1': {
    id: 'durock_t1',
    name: 'Durock T1 Full Smokey',
    brand: 'Durock',
    type: 'tactile',
    pins: 5,
    force: '67g',
    travel: '4.0mm',
    desc: 'Punchy tactile feedback with smokey polycarbonate housing and teal POM stem.',
    price: 32,
    housingColor: '#2f3542',
    stemColor: '#1dd1a1',
    soundProfile: { baseFreq: 180, clickGain: 0.32, thockGain: 0.82, Q: 3.6, decay: 0.07 }
  },
  'vertex_v1': {
    id: 'vertex_v1',
    name: 'Vertex V1 Linear',
    brand: 'Vertex',
    type: 'linear',
    pins: 5,
    force: '50g',
    travel: '3.7mm',
    desc: 'Nylon blend with polished stem. Designed specifically for deep acoustic marble profile.',
    price: 36,
    housingColor: '#2c3e50',
    stemColor: '#bdc3c7',
    soundProfile: { baseFreq: 120, clickGain: 0.06, thockGain: 0.94, Q: 4.6, decay: 0.085 }
  }
};

export const KEYCAP_PROFILES = {
  'cherry': {
    id: 'cherry',
    name: 'Cherry Profile (Sculpted)',
    desc: 'Ergonomic sculpted staircase (R1-R4) dengan cylindrical dish fingertip cup yang legendaris.',
    baseH: 0.18,
    heightScale: 1.0,
    topRadius: 0.12,
    curve: 'sculpted'
  },
  'oem': {
    id: 'oem',
    name: 'OEM Profile (Standard)',
    desc: 'Profil silindris standar retail, ~20% lebih tinggi dari Cherry dengan sudut tangga tajam.',
    baseH: 0.22,
    heightScale: 1.22,
    topRadius: 0.14,
    curve: 'sculpted'
  },
  'xda': {
    id: 'xda',
    name: 'XDA Profile (Uniform Flat)',
    desc: 'Uniform datar di seluruh baris tombol (tanpa sudut) dengan mangkuk bulat (spherical) lebar.',
    baseH: 0.17,
    heightScale: 0.95,
    topRadius: 0.22,
    curve: 'uniform'
  },
  'sa': {
    id: 'sa',
    name: 'SA Profile (High Spherical Vintage)',
    desc: 'High-profile retro terminal (~16.5mm) sangat tinggi, dinding curam, dan spherical dish dalam.',
    baseH: 0.30,
    heightScale: 1.65,
    topRadius: 0.25,
    curve: 'spherical'
  },
  'moa': {
    id: 'moa',
    name: 'MOA Profile (Cute Mushroom Chibi)',
    desc: 'Profil marshmallow chibi imut seragam dengan dinding cembung membulat lembut seperti bantal.',
    baseH: 0.19,
    heightScale: 1.05,
    topRadius: 0.28,
    curve: 'mushroom'
  },
  'mt3': {
    id: 'mt3',
    name: 'MT3 Profile (Deep Dish Vintage)',
    desc: 'High-profile vintage beamspring IBM dengan deep dish spherical cup ekstra cekung memeluk jari.',
    baseH: 0.27,
    heightScale: 1.50,
    topRadius: 0.20,
    curve: 'deepdish'
  }
};

export const KEYCAP_THEMES = {
  'botanical': {
    id: 'botanical',
    name: 'GMK Botanical (Matcha Garden)',
    alphaBg: '#e3ece4',
    alphaText: '#233d32',
    modBg: '#2f4f3f',
    modText: '#d8e5db',
    accentBg: '#88a38c',
    accentText: '#ffffff',
    subText: '#5b826f',
    price: 45
  },
  'olivia': {
    id: 'olivia',
    name: 'GMK Olivia (Rose Gold Minimal)',
    alphaBg: '#f5f5f7',
    alphaText: '#1e2124',
    modBg: '#1f2022',
    modText: '#f5f5f7',
    accentBg: '#e09893',
    accentText: '#1f2022',
    subText: '#a3716d',
    price: 48
  },
  'samurai': {
    id: 'samurai',
    name: 'GMK Red Samurai (Bushido)',
    alphaBg: '#59121d',
    alphaText: '#e8c766',
    modBg: '#1a1f2b',
    modText: '#e8c766',
    accentBg: '#d69e2e',
    accentText: '#1a1f2b',
    subText: '#e8c766',
    price: 52
  },
  'mizu': {
    id: 'mizu',
    name: 'GMK Mizu (Ocean Water)',
    alphaBg: '#f0f5fa',
    alphaText: '#22384a',
    modBg: '#2a3b4c',
    modText: '#bfe3f2',
    accentBg: '#70b6d6',
    accentText: '#ffffff',
    subText: '#6aa3be',
    price: 46
  },
  'laser': {
    id: 'laser',
    name: 'GMK Laser (Cyberpunk Synthwave)',
    alphaBg: '#192440',
    alphaText: '#00f6ff',
    modBg: '#40174c',
    modText: '#ff007f',
    accentBg: '#ff0055',
    accentText: '#ffffff',
    subText: '#00e1d9',
    price: 50
  },
  'retro9009': {
    id: 'retro9009',
    name: 'Classic 9009 (Vintage Terminal)',
    alphaBg: '#ded8c8',
    alphaText: '#2e3033',
    modBg: '#b0a996',
    modText: '#2e3033',
    accentBg: '#769f83',
    accentText: '#ffffff',
    subText: '#d46565',
    price: 40
  },
  'taro': {
    id: 'taro',
    name: 'GMK Taro (Boba Purple Cream)',
    alphaBg: '#f8f4ff',
    alphaText: '#4e3d67',
    modBg: '#5f497a',
    modText: '#f5ee9e',
    accentBg: '#f5ee9e',
    accentText: '#4e3d67',
    subText: '#8770a8',
    price: 48
  },
  'shoko': {
    id: 'shoko',
    name: 'GMK Shoko (Soft Mint Aqua)',
    alphaBg: '#e8ecef',
    alphaText: '#37474f',
    modBg: '#8cb8b5',
    modText: '#f1f7f6',
    accentBg: '#518683',
    accentText: '#ffffff',
    subText: '#659693',
    price: 44
  },
  'dracula': {
    id: 'dracula',
    name: 'GMK Dracula (Nordic Dark Slate)',
    alphaBg: '#282a36',
    alphaText: '#f8f8f2',
    modBg: '#1e1f29',
    modText: '#ff79c6',
    accentBg: '#50fa7b',
    accentText: '#282a36',
    subText: '#8be9fd',
    price: 54
  },
  'honey': {
    id: 'honey',
    name: 'Milk & Honey (Cute Beehive)',
    alphaBg: '#fffdf5',
    alphaText: '#4a3b1a',
    modBg: '#f6d860',
    modText: '#4a3b1a',
    accentBg: '#e58e26',
    accentText: '#ffffff',
    subText: '#e58e26',
    price: 42
  },
  'wob': {
    id: 'wob',
    name: 'GMK White on Black (Minimalist WOB)',
    alphaBg: '#18191c',
    alphaText: '#f5f6f8',
    modBg: '#111214',
    modText: '#f5f6f8',
    accentBg: '#343840',
    accentText: '#ffffff',
    subText: '#8a909d',
    price: 38
  },
  'bow': {
    id: 'bow',
    name: 'GMK Black on White (Clean Arctic BOW)',
    alphaBg: '#fafbfc',
    alphaText: '#18191c',
    modBg: '#ebedf0',
    modText: '#18191c',
    accentBg: '#d0d4dc',
    accentText: '#18191c',
    subText: '#707784',
    price: 38
  }
};

export const ADDON_ACCESSORIES = {
  'rotary_knob': {
    id: 'rotary_knob',
    name: 'CNC Anodized Rotary Knob',
    desc: 'Heavy knurled aluminum encoder knob for fluid volume control, zoom, and multimedia scrub.',
    price: 15,
    colors: ['gold', 'silver', 'black', 'rose']
  },
  'tft_lcd': {
    id: 'tft_lcd',
    name: 'Mini TFT Smart Screen (GIF & Temp Display)',
    desc: '135x240 full-color smart LCD module. Displays animated mascot GIFs, system thermals, and clock.',
    price: 25
  }
};

export const ARTISAN_KEYCAPS = {
  'none': {
    id: 'none',
    name: 'Normal Keycap (Tanpa Artisan)',
    price: 0,
    desc: 'Keycap standar bawaan dari tema yang dipilih.'
  },
  'capybara_mikan': {
    id: 'capybara_mikan',
    name: 'Onsen Capybara with Mikan',
    price: 35,
    desc: 'Miniatur Capybara 3D lucu berendam air hangat dengan jeruk mikan di atas kepalanya.',
    sound: 'squeak'
  },
  'cat_paw': {
    id: 'cat_paw',
    name: 'Silicone Cat Paw (Soft Beans)',
    price: 28,
    desc: 'Bantalan kaki kucing silikon empuk warna pink pastel di atas dasar keycap putih.',
    sound: 'pop'
  },
  'koi_resin': {
    id: 'koi_resin',
    name: 'Crystal Koi Pond Resin',
    price: 32,
    desc: 'Resin sebening kristal dengan miniatur ikan koi oranye-putih berenang di air jernih.',
    sound: 'water'
  },
  'fuji_snow': {
    id: 'fuji_snow',
    name: 'Mount Fuji Snow Summit',
    price: 30,
    desc: 'Puncak Gunung Fuji bersalju abadi dengan aksen gradasi awan sakura.',
    sound: 'chime'
  }
};

export const COILED_CABLES = {
  'black_techflex': {
    id: 'black_techflex',
    name: 'Stealth Black Techflex',
    cableColor: '#1e2430',
    aviatorColor: '#c0c0c0',
    price: 18,
    desc: 'Double-sleeved kabel hitam dengan konektor aviator GX16 metal silver chrome.'
  },
  'polar_white': {
    id: 'polar_white',
    name: 'Polar White Paracord',
    cableColor: '#f8f9fa',
    aviatorColor: '#e0e0e0',
    price: 18,
    desc: 'Kabel spiral putih bersih dengan konektor aviator GX16 chrome mengkilap.'
  },
  'laser_cyber': {
    id: 'laser_cyber',
    name: 'Cyberpunk Neon Laser',
    cableColor: '#00f2fe',
    aviatorColor: '#ff007f',
    price: 22,
    desc: 'Kabel neon cyan menyala dengan konektor aviator pink anodized ala cyberpunk.'
  },
  'matcha_botanical': {
    id: 'matcha_botanical',
    name: 'Matcha Green Botanical',
    cableColor: '#2f4f3f',
    aviatorColor: '#d4af37',
    price: 20,
    desc: 'Anyaman hijau matcha alami dengan konektor aviator kuningan emas brass.'
  },
  'vintage_beige': {
    id: 'vintage_beige',
    name: 'Retro Industrial Beige',
    cableColor: '#dcd3b8',
    aviatorColor: '#2d3436',
    price: 18,
    desc: 'Kabel abu-beige vintage klasik dengan konektor aviator hitam industrial.'
  }
};

export const RGB_MODES = {
  'rainbow': { id: 'rainbow', name: 'Rainbow Wave', desc: 'Spektrum pelangi mengalir dinamis melintasi baris tuts' },
  'warm_amber': { id: 'warm_amber', name: 'Warm Amber Glow', desc: 'Pendaran hangat 2700K cozy cafe estetik' },
  'cyberpunk': { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Kombinasi kontras neon cyan dan hot magenta' },
  'matcha': { id: 'matcha', name: 'Matcha Forest', desc: 'Cahaya mint dan hijau segar yang menenangkan' },
  'off': { id: 'off', name: 'RGB Nonaktif', desc: 'Lampu RGB dimatikan untuk tampilan stealth minimalis' }
};

// Backward-compatibility aliases for legacy order keys
STABILIZERS['screw_in_durock'] = STABILIZERS['durock_v2'];
STABILIZERS['cherry_clip'] = STABILIZERS['cherry_plate'];
SWITCHES['gateron_red'] = SWITCHES['milky_yellow'];
CASE_MATERIALS['polycarbonate'] = CASE_MATERIALS['acrylic'];
PLATE_MATERIALS['polycarbonate'] = PLATE_MATERIALS['pc'];
KEYCAP_THEMES['chalk'] = KEYCAP_THEMES['retro9009'];
ADDON_ACCESSORIES['tft_screen'] = ADDON_ACCESSORIES['tft_lcd'];
