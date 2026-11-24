// Step-by-Step Interactive Assembly Flow State Machine
// 7 authentic stages of building a mechanical keyboard from unboxing to typing test & customer handover

import { inventory } from './inventory.js';
import { orderSystem } from './order-system.js';
import { audioManager } from '../engine/audio.js';
import confetti from 'canvas-confetti';

export const ASSEMBLY_STEPS = [
  {
    id: 'case_prep',
    stepNumber: 1,
    title: '1. Case & Bottom Chassis Preparation',
    desc: 'Unbox the keyboard casing, inspect CNC aluminum / ABS edges, and install internal silver acoustic weight.',
    tool: 'obeng',
    cameraView: 'workbench'
  },
  {
    id: 'dampening_bottom',
    stepNumber: 2,
    title: '2. Multi-Layer Bottom Dampening & Tape Mod',
    desc: 'Apply Poron bottom case foam, molded silicone base pad, and 3-layer Tempest tape mod on back of PCB.',
    tool: 'pinset',
    cameraView: 'workbench'
  },
  {
    id: 'pcb_stabilizers',
    stepNumber: 3,
    title: '3. PCB Mount & Stabilizer Tuning',
    desc: 'Seat PCB into case, balance stainless steel wires, and tune stabilizers with Krytox 205g0 + XHT-BDZ.',
    tool: 'brush',
    cameraView: 'workbench'
  },
  {
    id: 'plate_ixpe',
    stepNumber: 4,
    title: '4. IXPE Switch Pads, PET Film & Plate Mount',
    desc: 'Apply IXPE switch pads for signature marbly pop, layer PET voice film, and mount the POM/FR4 plate.',
    tool: 'pinset',
    cameraView: 'workbench'
  },
  {
    id: 'switches_plug',
    stepNumber: 5,
    title: '5. Mechanical Switches Installation',
    desc: 'Plug 3-Pin / 5-Pin mechanical switches firmly into hotswap sockets until satisfying tactile snaps occur.',
    tool: 'switch_puller',
    cameraView: 'workbench'
  },
  {
    id: 'keycaps_addons',
    stepNumber: 6,
    title: '6. Keycaps & Rotary Knob / LCD Assembly',
    desc: 'Mount sculpted keycap set with crisp sub-legends and install the CNC rotary knob or mini TFT screen.',
    tool: 'keycap_puller',
    cameraView: 'workbench'
  },
  {
    id: 'typing_test',
    stepNumber: 7,
    title: '7. ASMR Typing Sound Test & Inspection',
    desc: 'Type on your mechanical keyboard to experience its acoustic sound profile and verify 100% blueprint specs.',
    tool: 'none',
    cameraView: 'typing'
  }
];

export class AssemblyFlow {
  constructor(sceneManager, keyboardAssembly, customerAvatar) {
    this.sceneManager = sceneManager;
    this.keyboard = keyboardAssembly;
    this.avatar = customerAvatar;
    this.currentStepIdx = 0;

    // Track active build configuration
    this.currentBuild = { ...this.keyboard.specs };
  }

  getCurrentStep() {
    return ASSEMBLY_STEPS[this.currentStepIdx];
  }

  isLastStep() {
    return this.currentStepIdx === ASSEMBLY_STEPS.length - 1;
  }

  goToStep(index) {
    if (index >= 0 && index < ASSEMBLY_STEPS.length) {
      this.currentStepIdx = index;
      const step = ASSEMBLY_STEPS[this.currentStepIdx];
      this.sceneManager.setCameraView(step.cameraView);

      // Play tool sound based on step
      if (step.tool === 'obeng') audioManager.playScrewSound();
      else if (step.tool === 'brush') audioManager.playLubeSquish();
      else if (step.tool === 'switch_puller') audioManager.playSwitchSnap();
      else if (step.tool === 'keycap_puller') audioManager.playKeycapPop();
    }
  }

  resetBuild(prefill = {}) {
    this.currentBuild = {
      layout: null,
      caseMaterial: null,
      caseColor: null,
      pcb: null,
      pcbColor: null,
      dampeningLayers: [],
      plate: null,
      stabilizer: null,
      stabTuning: null,
      switch: null,
      keycapProfile: null,
      keycapTheme: null,
      hasKnob: false,
      hasLcd: false,
      artisanKeycap: null,
      coiledCable: null,
      rgbMode: 'rainbow',
      ...prefill
    };
    this.keyboard.specs = { ...this.currentBuild };
    this.keyboard.buildAssembly();
    this.goToStep(0);
  }

  loadBuild(specs) {
    this.currentBuild = {
      layout: null,
      caseMaterial: null,
      caseColor: null,
      pcb: null,
      pcbColor: null,
      dampeningLayers: [],
      plate: null,
      stabilizer: null,
      stabTuning: null,
      switch: null,
      keycapProfile: null,
      keycapTheme: null,
      hasKnob: false,
      hasLcd: false,
      artisanKeycap: null,
      coiledCable: null,
      rgbMode: 'rainbow',
      ...specs
    };
    this.keyboard.specs = { ...this.currentBuild };
    this.keyboard.buildAssembly();
  }

  canProceedCurrentStep() {
    const cust = orderSystem.getCurrentCustomer();
    const isMod = cust && cust.orderType === 'mod_service';
    const initSpecs = isMod ? (cust.initialKeyboardSpecs || {}) : {};

    const stepIdx = this.currentStepIdx;
    if (stepIdx === 0) { // Case prep
      if (!this.currentBuild.layout || !this.currentBuild.caseMaterial) {
        return { ok: false, msg: 'Pilih Form Factor Layout dan Bahan Casing terlebih dahulu!' };
      }
      const isOriginal = isMod && initSpecs.caseMaterial === this.currentBuild.caseMaterial;
      if (!isOriginal && !inventory.hasStock('case_' + this.currentBuild.caseMaterial)) {
        return { ok: false, msg: 'Kamu tidak memiliki stok casing ini! Beli dulu di 🛒Toko.' };
      }
    } else if (stepIdx === 1) { // Dampeners
      const layers = this.currentBuild.dampeningLayers || [];
      const initLayers = initSpecs.dampeningLayers || [];
      for (const d of layers) {
        const isOriginal = isMod && initLayers.includes(d);
        if (!isOriginal && !inventory.hasStock('damp_' + d)) {
          return { ok: false, msg: `Kamu tidak memiliki stok layer dampening ini! Beli dulu di 🛒Toko.` };
        }
      }
    } else if (stepIdx === 2) { // PCB, PCB Color & Stabs
      if (!this.currentBuild.pcb || !this.currentBuild.pcbColor || !this.currentBuild.stabilizer) {
        return { ok: false, msg: 'Pilih PCB Board, Warna PCB, dan Stabilizer terlebih dahulu!' };
      }
      const isOrigPcb = isMod && initSpecs.pcb === this.currentBuild.pcb;
      if (!isOrigPcb && !inventory.hasStock('pcb_' + this.currentBuild.pcb)) {
        return { ok: false, msg: 'Kamu tidak memiliki stok PCB Board ini! Beli dulu di 🛒Toko.' };
      }
      const isOrigStab = isMod && initSpecs.stabilizer === this.currentBuild.stabilizer;
      if (!isOrigStab && !inventory.hasStock('stab_' + this.currentBuild.stabilizer)) {
        return { ok: false, msg: 'Kamu tidak memiliki stok Stabilizer ini! Beli dulu di 🛒Toko.' };
      }
    } else if (stepIdx === 3) { // Plate
      if (!this.currentBuild.plate) {
        return { ok: false, msg: 'Pilih Bahan Switch Plate terlebih dahulu!' };
      }
      const isOrigPlate = isMod && initSpecs.plate === this.currentBuild.plate;
      if (!isOrigPlate && !inventory.hasStock('plate_' + this.currentBuild.plate)) {
        return { ok: false, msg: 'Kamu tidak memiliki stok Switch Plate ini! Beli dulu di 🛒Toko.' };
      }
    } else if (stepIdx === 4) { // Switches
      if (!this.currentBuild.switch) {
        return { ok: false, msg: 'Pilih Switch Mechanical terlebih dahulu!' };
      }
      const isOrigSw = isMod && initSpecs.switch === this.currentBuild.switch;
      if (!isOrigSw && !inventory.hasStock('sw_' + this.currentBuild.switch)) {
        return { ok: false, msg: 'Kamu tidak memiliki stok Switch ini! Beli dulu di 🛒Toko.' };
      }
    } else if (stepIdx === 5) { // Keycaps & Artisan
      if (!this.currentBuild.keycapTheme) {
        return { ok: false, msg: 'Pilih Tema Keycaps terlebih dahulu!' };
      }
      const isOrigCap = isMod && initSpecs.keycapTheme === this.currentBuild.keycapTheme;
      if (!isOrigCap && !inventory.hasStock('cap_' + this.currentBuild.keycapTheme)) {
        return { ok: false, msg: 'Kamu tidak memiliki stok Keycap set ini! Beli dulu di 🛒Toko.' };
      }
      if (this.currentBuild.artisanKeycap && this.currentBuild.artisanKeycap !== 'none') {
        const isOrigArtisan = isMod && initSpecs.artisanKeycap === this.currentBuild.artisanKeycap;
        if (!isOrigArtisan && !inventory.hasStock('artisan_' + this.currentBuild.artisanKeycap)) {
          return { ok: false, msg: 'Kamu tidak memiliki stok Artisan Keycap ini! Beli dulu di 🛒Toko.' };
        }
      }
      if (this.currentBuild.coiledCable && this.currentBuild.coiledCable !== 'none') {
        const isOrigCable = isMod && initSpecs.coiledCable === this.currentBuild.coiledCable;
        if (!isOrigCable && !inventory.hasStock('cable_' + this.currentBuild.coiledCable)) {
          return { ok: false, msg: 'Kamu tidak memiliki stok Kabel Aviator ini! Beli dulu di 🛒Toko.' };
        }
      }
    } else if (stepIdx === 6) { // Addon
      if (this.currentBuild.hasKnob && !inventory.hasStock('addon_rotary_knob')) {
        return { ok: false, msg: 'Kamu tidak memiliki stok Rotary Knob! Beli dulu di 🛒Toko.' };
      }
      if (this.currentBuild.hasLcd && !inventory.hasStock('addon_tft_lcd')) {
        return { ok: false, msg: 'Kamu tidak memiliki stok TFT Screen! Beli dulu di 🛒Toko.' };
      }
    }
    return { ok: true };
  }

  nextStep() {
    const check = this.canProceedCurrentStep();
    if (!check.ok) {
      return check;
    }
    if (this.currentStepIdx < ASSEMBLY_STEPS.length - 1) {
      this.goToStep(this.currentStepIdx + 1);
    }
    return { ok: true };
  }

  prevStep() {
    if (this.currentStepIdx > 0) {
      this.goToStep(this.currentStepIdx - 1);
    }
  }

  updateBuildConfig(newSpecs, animLayer = null) {
    this.currentBuild = { ...this.currentBuild, ...newSpecs };
    this.keyboard.specs = { ...this.currentBuild };
    this.keyboard.buildAssembly(animLayer);
  }

  // Handover finished keyboard to customer
  handoverOrder() {
    const customer = orderSystem.getCurrentCustomer();
    const result = orderSystem.validateBuild(this.currentBuild);
    const isMod = customer && customer.orderType === 'mod_service';
    const initSpecs = isMod ? (customer.initialKeyboardSpecs || {}) : {};

    if (result.passed) {
      // Deduct used stock from player inventory (only newly added/swapped parts)
      if (this.currentBuild.caseMaterial && (!isMod || initSpecs.caseMaterial !== this.currentBuild.caseMaterial)) {
        inventory.useStock('case_' + this.currentBuild.caseMaterial, 1);
      }
      (this.currentBuild.dampeningLayers || []).forEach(d => {
        if (!isMod || !(initSpecs.dampeningLayers || []).includes(d)) {
          inventory.useStock('damp_' + d, 1);
        }
      });
      if (this.currentBuild.pcb && (!isMod || initSpecs.pcb !== this.currentBuild.pcb)) {
        inventory.useStock('pcb_' + this.currentBuild.pcb, 1);
      }
      if (this.currentBuild.stabilizer && (!isMod || initSpecs.stabilizer !== this.currentBuild.stabilizer)) {
        inventory.useStock('stab_' + this.currentBuild.stabilizer, 1);
      }
      if (this.currentBuild.plate && (!isMod || initSpecs.plate !== this.currentBuild.plate)) {
        inventory.useStock('plate_' + this.currentBuild.plate, 1);
      }
      if (this.currentBuild.switch && (!isMod || initSpecs.switch !== this.currentBuild.switch)) {
        inventory.useStock('sw_' + this.currentBuild.switch, 1);
      }
      if (this.currentBuild.keycapTheme && (!isMod || initSpecs.keycapTheme !== this.currentBuild.keycapTheme)) {
        inventory.useStock('cap_' + this.currentBuild.keycapTheme, 1);
      }
      if (this.currentBuild.artisanKeycap && this.currentBuild.artisanKeycap !== 'none' && (!isMod || initSpecs.artisanKeycap !== this.currentBuild.artisanKeycap)) {
        inventory.useStock('artisan_' + this.currentBuild.artisanKeycap, 1);
      }
      if (this.currentBuild.coiledCable && this.currentBuild.coiledCable !== 'none' && (!isMod || initSpecs.coiledCable !== this.currentBuild.coiledCable)) {
        inventory.useStock('cable_' + this.currentBuild.coiledCable, 1);
      }
      if (this.currentBuild.hasKnob && (!isMod || !initSpecs.hasKnob)) {
        inventory.useStock('addon_rotary_knob', 1);
      }
      if (this.currentBuild.hasLcd && (!isMod || !initSpecs.hasLcd)) {
        inventory.useStock('addon_tft_lcd', 1);
      }

      // Award coins
      const tip = result.score === 100 ? 50 : result.score >= 85 ? 25 : 10;
      const totalAward = customer.financials.totalPayout + tip;
      inventory.addCoins(totalAward);
      audioManager.playCoins();
      orderSystem.completedCount++;

      // Trigger celebratory animations
      if (this.avatar) {
        this.avatar.celebrate();
      }
      this.sceneManager.setCameraView('counter');

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      return {
        success: true,
        score: result.score,
        rank: result.rank,
        payout: totalAward,
        tip: tip,
        details: result.details
      };
    } else {
      return {
        success: false,
        score: result.score,
        rank: result.rank,
        details: result.details
      };
    }
  }
}
