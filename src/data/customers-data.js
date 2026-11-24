// Procedural Customer Generator with Endless Cute Animal Combinations & RNG Quests
import {
  CASE_MATERIALS,
  CASE_COLORS,
  PCB_TYPES,
  PCB_COLORS,
  DAMPENING_LAYERS,
  PLATE_MATERIALS,
  STABILIZERS,
  STAB_TUNING_OPTIONS,
  SWITCHES,
  KEYCAP_PROFILES,
  KEYCAP_THEMES,
  ARTISAN_KEYCAPS,
  COILED_CABLES
} from './parts-catalog.js';

export const ANIMAL_SPECIES = [
  { id: 'capybara', name: 'Capybara', defaultColor: '#8d6e63', snoutColor: '#5d4037', earColor: '#4e342e', hasMikan: true },
  { id: 'red_panda', name: 'Red Panda', defaultColor: '#d35400', snoutColor: '#ffffff', earColor: '#962d00', hasMask: true },
  { id: 'shiba', name: 'Shiba Inu', defaultColor: '#e58e26', snoutColor: '#fff5eb', earColor: '#b36200', hasEyebrows: true },
  { id: 'calico_cat', name: 'Calico Cat', defaultColor: '#f5f6fa', snoutColor: '#f8a5c2', earColor: '#e17055', hasWhiskers: true },
  { id: 'sea_otter', name: 'Sea Otter', defaultColor: '#795548', snoutColor: '#d7ccc8', earColor: '#4e342e', holdsShell: true },
  { id: 'bunny', name: 'Fluffy Bunny', defaultColor: '#ffffff', snoutColor: '#ffb8b8', earColor: '#ffd3d3', longEars: true },
  { id: 'bear_cub', name: 'Bear Cub', defaultColor: '#5c3a21', snoutColor: '#d2b48c', earColor: '#3e2411', roundEars: true },
  { id: 'penguin', name: 'Chibi Penguin', defaultColor: '#2f3542', snoutColor: '#ffa502', earColor: '#ffffff', flippers: true },
  { id: 'fox', name: 'Kitsune Fox', defaultColor: '#e67e22', snoutColor: '#fdfefe', earColor: '#2c3e50', pointedEars: true },
  { id: 'hamster', name: 'Puff Hamster', defaultColor: '#f1c40f', snoutColor: '#ffffff', earColor: '#e74c3c', chubbyCheeks: true }
];

export const ACCESSORY_HATS = [
  { id: 'none', name: 'None' },
  { id: 'chef', name: 'Chef Toque', color: '#ffffff' },
  { id: 'straw', name: 'Summer Straw Hat', color: '#eccc68' },
  { id: 'frog_beanie', name: 'Frog Eyes Beanie', color: '#2ed573' },
  { id: 'detective', name: 'Detective Sherlock Cap', color: '#747d8c' },
  { id: 'flower_crown', name: 'Floral Sakura Crown', color: '#ff6b81' },
  { id: 'top_hat', name: 'Gentleman Top Hat', color: '#2f3542' },
  { id: 'party_cone', name: 'Festive Party Cone', color: '#ff4757' }
];

export const ACCESSORY_GLASSES = [
  { id: 'none', name: 'None' },
  { id: 'round_specs', name: 'Round Gold Glasses', color: '#ffa502' },
  { id: 'cool_shades', name: 'Thug Life Sunglasses', color: '#1e272e' },
  { id: 'monocle', name: 'Brass Monocle', color: '#eccc68' }
];

export const ACCESSORY_NECK = [
  { id: 'none', name: 'None' },
  { id: 'red_scarf', name: 'Cozy Wool Scarf', color: '#ff4757' },
  { id: 'gold_bowtie', name: 'Silk Bowtie', color: '#ffa502' },
  { id: 'bandana', name: 'Adventure Bandana', color: '#3742fa' },
  { id: 'bell_collar', name: 'Jingle Bell Ribbon', color: '#2ed573' }
];

export const HEAD_ORNAME = [
  { id: 'none', name: 'None' },
  { id: 'mikan', name: 'Citrus Mikan Orange', color: '#ff793f' },
  { id: 'leaf_sprout', name: 'Fresh Plant Sprout', color: '#7bed9f' },
  { id: 'sakura_petal', name: 'Sakura Petal', color: '#ffb8b8' }
];

const CUSTOMER_FIRST_NAMES = [
  'Boba', 'Mochi', 'Matcha', 'Koko', 'Puff', 'Choco', 'Bubu', 'Nori',
  'Pochi', 'Taro', 'Milo', 'Luna', 'Simba', 'Clover', 'Pebble', 'Gudetama',
  'Yuki', 'Kuro', 'Waffle', 'Oatmeal', 'Chai', 'Bagel', 'Tofu', 'Peanut'
];

const CUSTOMER_TITLES = [
  'si Gamer Santai', 'si Programmer WFH', 'si Sound ASMR Lover',
  'si Mahasiswa Skripsi', 'si Desainer UI/UX', 'si Keyboard Enthusiast',
  'si Streamer Twitch', 'si Pegawai Kantoran', 'si Musisi Lo-Fi'
];

const DIALOGUES = [
  'Halo om juragan! Tolong rakitin custom keyboard impian gue dong, speknya udah gue siapin di samping!',
  'Pagi kak! Hari ini giliran gue yang mau dapet racikan keyboard terenak dari bengkel lu!',
  'Permisi bang master keyboard! Skripsi gue lagi stuck nih, butuh keyboard baru biar semangat ngetik!',
  'Hai juragan! Gue denger-denger buildan keyboard di sini punya suara paling renyah & thocky se-kota!',
  'Bro! Gue butuh keyboard buat stream turnamen besok lusa. Tolong pilihkan part terbaik sesuai catatanku ya!',
  'Halo sepuh mekanikal! Mau upgrade setup meja gue nih, tolong rakitin dengan penuh cinta yaa!'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubarray(arr, minCount, maxCount) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return shuffled.slice(0, count);
}

// Generates an endless, truly unique procedural customer with a randomized blueprint quest
export function generateProceduralCustomer() {
  const species = getRandomItem(ANIMAL_SPECIES);
  const firstName = getRandomItem(CUSTOMER_FIRST_NAMES);
  const title = getRandomItem(CUSTOMER_TITLES);
  const fullName = `${firstName} ${title}`;

  const hat = getRandomItem(ACCESSORY_HATS);
  const glasses = getRandomItem(ACCESSORY_GLASSES);
  const neck = getRandomItem(ACCESSORY_NECK);
  const headItem = getRandomItem(HEAD_ORNAME);

  // Layout choice (60, 65, 75, 80, 85, 100)
  const layoutChoices = ['60', '65', '75', '80', '85', '100'];
  const layout = getRandomItem(layoutChoices);

  // Case material & color
  const caseMaterialKeys = Object.keys(CASE_MATERIALS);
  const caseMatKey = getRandomItem(caseMaterialKeys);
  const allowedColors = CASE_MATERIALS[caseMatKey].colors;
  const caseColorKey = getRandomItem(allowedColors);

  // PCB choice & Color
  const pcbKeys = Object.keys(PCB_TYPES);
  const pcbKey = getRandomItem(pcbKeys);
  const pcbColorKey = getRandomItem(Object.keys(PCB_COLORS));

  // Dampening selection: 1 to 7 layers
  const dampeningKeys = Object.keys(DAMPENING_LAYERS);
  const dampCount = Math.floor(Math.random() * 7) + 1; // 1 to 7
  const requiredDampeners = getRandomSubarray(dampeningKeys, dampCount, dampCount);

  // Plate choice
  const plateKeys = Object.keys(PLATE_MATERIALS);
  const plateKey = getRandomItem(plateKeys);

  // Stabilizer choice
  const stabKeys = Object.keys(STABILIZERS);
  const stabKey = getRandomItem(stabKeys);
  const stabTuningKeys = ['stock', 'balanced', 'holee_mod', 'fully_tuned'];
  const stabTuningKey = getRandomItem(stabTuningKeys);

  // Switch choice
  const switchKeys = Object.keys(SWITCHES);
  const switchKey = getRandomItem(switchKeys);

  // Keycap profile & theme
  const profileKeys = Object.keys(KEYCAP_PROFILES);
  const profileKey = getRandomItem(profileKeys);
  const themeKeys = Object.keys(KEYCAP_THEMES);
  const themeKey = getRandomItem(themeKeys);

  // Addon for 75% or 65% layouts (Knob vs LCD Screen vs None)
  let requestedKnob = false;
  let requestedLcd = false;
  if (layout === '75') {
    const addonRoll = Math.random();
    if (addonRoll < 0.40) {
      requestedKnob = true;
    } else if (addonRoll < 0.75) {
      requestedLcd = true;
    }
  }

  // Optional Artisan Keycap & Coiled Cable for full enthusiast experience
  let requestedArtisan = 'none';
  if (Math.random() < 0.35) {
    const artisanKeys = Object.keys(ARTISAN_KEYCAPS).filter(k => k !== 'none');
    requestedArtisan = getRandomItem(artisanKeys);
  }

  let requestedCable = 'black_techflex';
  if (Math.random() < 0.65) {
    requestedCable = getRandomItem(Object.keys(COILED_CABLES));
  }

  // Calculate budget & rewards
  const baseCost =
    CASE_MATERIALS[caseMatKey].price +
    PCB_TYPES[pcbKey].price +
    PLATE_MATERIALS[plateKey].price +
    STABILIZERS[stabKey].price +
    SWITCHES[switchKey].price +
    KEYCAP_THEMES[themeKey].price +
    requiredDampeners.reduce((sum, dKey) => sum + DAMPENING_LAYERS[dKey].price, 0) +
    (requestedKnob ? 15 : 0) +
    (requestedLcd ? 25 : 0) +
    (ARTISAN_KEYCAPS[requestedArtisan] ? ARTISAN_KEYCAPS[requestedArtisan].price : 0) +
    (COILED_CABLES[requestedCable] ? COILED_CABLES[requestedCable].price : 0);

  const laborFee = 60 + Math.floor(Math.random() * 40);
  const totalPayout = baseCost + laborFee;

  return {
    id: `cust_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    orderType: 'new_build',
    name: fullName,
    species: species,
    dialogue: getRandomItem(DIALOGUES),
    appearance: {
      speciesId: species.id,
      bodyColor: species.defaultColor,
      snoutColor: species.snoutColor,
      earColor: species.earColor,
      hat: hat.id,
      hatColor: hat.color,
      glasses: glasses.id,
      glassesColor: glasses.color,
      neck: neck.id,
      neckColor: neck.color,
      headItem: headItem.id,
      headItemColor: headItem.color
    },
    specs: {
      layout: layout,
      caseMaterial: caseMatKey,
      caseColor: caseColorKey,
      pcb: pcbKey,
      pcbColor: pcbColorKey,
      dampeningLayers: requiredDampeners,
      plate: plateKey,
      stabilizer: stabKey,
      stabTuning: stabTuningKey,
      switch: switchKey,
      keycapProfile: profileKey,
      keycapTheme: themeKey,
      hasKnob: requestedKnob,
      hasLcd: requestedLcd,
      artisanKeycap: requestedArtisan,
      coiledCable: requestedCable
    },
    financials: {
      budget: totalPayout + 20,
      rewardCoins: laborFee,
      totalPayout: totalPayout
    }
  };
}

// Procedural Mod & Repair Service Orders (Customer brings their own keyboard for modding!)
export function generateModServiceCustomer() {
  const species = getRandomItem(ANIMAL_SPECIES);
  const firstName = getRandomItem(CUSTOMER_FIRST_NAMES);
  const title = getRandomItem(CUSTOMER_TITLES);
  const fullName = `${firstName} ${title}`;

  const hat = getRandomItem(ACCESSORY_HATS);
  const glasses = getRandomItem(ACCESSORY_GLASSES);
  const neck = getRandomItem(ACCESSORY_NECK);
  const headItem = getRandomItem(HEAD_ORNAME);

  // 3 Service Case Variants
  const serviceCases = [
    {
      type: 'rattle_fix',
      title: 'Reparasi Stabilizer Spacebar Rattling',
      issue: 'Kawat stabilizer kering & oblak, tombol Spasi berderak nyaring (rattling parah).',
      dialogue: 'Aduh nyet, keyboard kesayangan gue tombol Spasi sama Enter-nya rattling berisik banget kayak kaleng rombeng! Tolong dong balance kawatnya, pasangin Holee Mod, dan lumuri Krytox 205g0 + XHT-BDZ!',
      initial: {
        layout: '75',
        caseMaterial: 'aluminum',
        caseColor: 'black',
        pcb: 'normal_wired',
        pcbColor: 'black',
        dampeningLayers: ['case_foam'],
        plate: 'aluminum',
        stabilizer: 'cherry_plate',
        stabTuning: 'stock', // Problem: stock rattling
        switch: 'milky_yellow',
        keycapTheme: 'wob',
        keycapProfile: 'cherry',
        hasKnob: true,
        hasLcd: false,
        artisanKeycap: 'none',
        coiledCable: 'black_techflex'
      },
      targetTuning: 'fully_tuned',
      targetStab: 'durock_v2',
      fee: 80
    },
    {
      type: 'hollow_dampen',
      title: 'Modifikasi Peredam Akustik Hollow Case',
      issue: 'Casing kosong melompong (hollow), suara pantulan gema sangat nyaring dan cempreng.',
      dialogue: 'Halo master modder! Keyboard gue kalau diketik suaranya nyaring dan kopong banget menggema di dalam case. Tolong dong pasangin 3-Layer Tempest Tape Mod di belakang PCB dan kasih Poron Case Foam biar thocky padat!',
      initial: {
        layout: '65',
        caseMaterial: 'acrylic',
        caseColor: 'smoke',
        pcb: 'normal_wired',
        pcbColor: 'green',
        dampeningLayers: [], // Problem: zero dampening!
        plate: 'pc',
        stabilizer: 'cherry_plate',
        stabTuning: 'balanced',
        switch: 'milky_yellow',
        keycapTheme: 'botanical',
        keycapProfile: 'cherry',
        hasKnob: false,
        hasLcd: false,
        artisanKeycap: 'none',
        coiledCable: 'matcha_botanical'
      },
      targetDampening: ['case_foam', 'tape_mod'],
      fee: 90
    },
    {
      type: 'switch_artisan',
      title: 'Upgrade Switch Thocky & Artisan Keycap',
      issue: 'Switch bawaan scratchy seret & tombol ESC polos butuh sentuhan estetika lucu.',
      dialogue: 'Permisi nyet! Switch di keyboard gue seret dan bunyi pernya cempreng pas ditekan. Gue pengen upgrade ke Switch Boba U4T Tactile, plus pasangin Artisan Keycap Onsen Capy Mikan di tombol ESC biar makin gemoy!',
      initial: {
        layout: '80',
        caseMaterial: 'aluminum',
        caseColor: 'black',
        pcb: 'normal_3conn',
        pcbColor: 'black',
        dampeningLayers: ['case_foam'],
        plate: 'fr4',
        stabilizer: 'durock_v2',
        stabTuning: 'fully_tuned',
        switch: 'cherry_blue', // Problem: scratchy/clicky
        keycapTheme: 'retro9009',
        keycapProfile: 'cherry',
        hasKnob: false,
        hasLcd: false,
        artisanKeycap: 'none',
        coiledCable: 'polar_white'
      },
      targetSwitch: 'boba_u4t',
      targetArtisan: 'capybara_mikan',
      fee: 100
    }
  ];

  const sCase = getRandomItem(serviceCases);
  const targetSpecs = { ...sCase.initial };
  if (sCase.targetTuning) targetSpecs.stabTuning = sCase.targetTuning;
  if (sCase.targetStab) targetSpecs.stabilizer = sCase.targetStab;
  if (sCase.targetDampening) targetSpecs.dampeningLayers = [...sCase.targetDampening];
  if (sCase.targetSwitch) targetSpecs.switch = sCase.targetSwitch;
  if (sCase.targetArtisan) targetSpecs.artisanKeycap = sCase.targetArtisan;

  return {
    id: `serv_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    orderType: 'mod_service',
    serviceCase: sCase.type,
    serviceTitle: sCase.title,
    serviceIssue: sCase.issue,
    name: fullName,
    species: species,
    dialogue: sCase.dialogue,
    initialKeyboardSpecs: { ...sCase.initial },
    appearance: {
      speciesId: species.id,
      bodyColor: species.defaultColor,
      snoutColor: species.snoutColor,
      earColor: species.earColor,
      hat: hat.id,
      hatColor: hat.color,
      glasses: glasses.id,
      glassesColor: glasses.color,
      neck: neck.id,
      neckColor: neck.color,
      headItem: headItem.id,
      headItemColor: headItem.color
    },
    specs: targetSpecs,
    financials: {
      budget: sCase.fee + 50,
      rewardCoins: sCase.fee,
      totalPayout: sCase.fee
    }
  };
}
