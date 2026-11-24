// Customer Order & Persistent Blueprint Specs Tracking System
// Manages procedural customer quests, right-side persistent HUD tracking,
// and grading validation of the keyboard assembly against customer desires.

import { generateProceduralCustomer, generateModServiceCustomer } from '../data/customers-data.js';
import { inventory } from './inventory.js';
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
} from '../data/parts-catalog.js';

export class OrderSystem {
  constructor() {
    this.currentCustomer = null;
    this.completedCount = 0;
    this.nextCustomer();
  }

  normalizeCustomerSpecs(cust) {
    if (!cust) return cust;
    const normalize = (s) => {
      if (!s) return;
      if (s.stabilizer === 'screw_in_durock') s.stabilizer = 'durock_v2';
      if (s.stabilizer === 'cherry_clip') s.stabilizer = 'cherry_plate';
      if (s.switch === 'gateron_red') s.switch = 'milky_yellow';
      if (s.caseMaterial === 'polycarbonate') s.caseMaterial = 'acrylic';
      if (s.plate === 'polycarbonate') s.plate = 'pc';
      if (s.keycapTheme === 'chalk') s.keycapTheme = 'retro9009';
      if (s.caseColor === 'silver') s.caseColor = 'black';
      if (!s.pcbColor) s.pcbColor = 'black';
    };
    normalize(cust.specs);
    if (cust.initialKeyboardSpecs) normalize(cust.initialKeyboardSpecs);
    return cust;
  }

  nextCustomer() {
    // 35% chance for a Mod & Service customer with an existing keyboard issue!
    const isService = Math.random() < 0.35;
    this.currentCustomer = isService ? generateModServiceCustomer() : generateProceduralCustomer();
    this.normalizeCustomerSpecs(this.currentCustomer);
    return this.currentCustomer;
  }

  getCurrentCustomer() {
    this.normalizeCustomerSpecs(this.currentCustomer);
    return this.currentCustomer;
  }

  // Validates current player keyboard assembly against customer specs
  validateBuild(currentBuild) {
    if (!this.currentCustomer) return { score: 100, passed: true, details: [] };
    this.normalizeCustomerSpecs(this.currentCustomer);

    const req = this.currentCustomer.specs;
    const checks = [
      {
        label: 'Layout',
        expected: req.layout + '%',
        actual: currentBuild.layout + '%',
        match: String(currentBuild.layout) === String(req.layout) || (req.layout === '85' && currentBuild.layout === '80')
      },
      {
        label: 'Case Material',
        expected: (CASE_MATERIALS[req.caseMaterial] || {}).name || req.caseMaterial,
        actual: (CASE_MATERIALS[currentBuild.caseMaterial] || {}).name || currentBuild.caseMaterial,
        match: currentBuild.caseMaterial === req.caseMaterial
      },
      {
        label: 'Case Color',
        expected: (CASE_COLORS[req.caseColor] || {}).name || req.caseColor,
        actual: (CASE_COLORS[currentBuild.caseColor] || {}).name || currentBuild.caseColor,
        match: currentBuild.caseColor === req.caseColor
      },
      {
        label: 'PCB Type',
        expected: (PCB_TYPES[req.pcb] || {}).name || req.pcb,
        actual: currentBuild.pcb ? ((PCB_TYPES[currentBuild.pcb] || {}).name || currentBuild.pcb) : 'Belum dipilih',
        match: currentBuild.pcb === req.pcb
      },
      {
        label: 'PCB Color',
        expected: (PCB_COLORS[req.pcbColor || 'black'] || {}).name || (req.pcbColor || 'black'),
        actual: currentBuild.pcbColor ? ((PCB_COLORS[currentBuild.pcbColor] || {}).name || currentBuild.pcbColor) : 'Belum dipilih',
        match: Boolean(currentBuild.pcbColor && currentBuild.pcbColor === (req.pcbColor || 'black'))
      },
      {
        label: 'Stabilizers',
        expected: (STABILIZERS[req.stabilizer] || {}).name || req.stabilizer,
        actual: (STABILIZERS[currentBuild.stabilizer] || {}).name || currentBuild.stabilizer,
        match: currentBuild.stabilizer === req.stabilizer
      },
      {
        label: 'Stab Tuning',
        expected: (STAB_TUNING_OPTIONS[req.stabTuning] || {}).name || req.stabTuning,
        actual: (STAB_TUNING_OPTIONS[currentBuild.stabTuning] || {}).name || currentBuild.stabTuning,
        match: currentBuild.stabTuning === req.stabTuning
      },
      {
        label: 'Plate Material',
        expected: (PLATE_MATERIALS[req.plate] || {}).name || req.plate,
        actual: (PLATE_MATERIALS[currentBuild.plate] || {}).name || currentBuild.plate,
        match: currentBuild.plate === req.plate
      },
      {
        label: 'Switches',
        expected: (SWITCHES[req.switch] || {}).name || req.switch,
        actual: (SWITCHES[currentBuild.switch] || {}).name || currentBuild.switch,
        match: currentBuild.switch === req.switch
      },
      {
        label: 'Keycap Theme',
        expected: (KEYCAP_THEMES[req.keycapTheme] || {}).name || req.keycapTheme,
        actual: (KEYCAP_THEMES[currentBuild.keycapTheme] || {}).name || currentBuild.keycapTheme,
        match: currentBuild.keycapTheme === req.keycapTheme
      },
      {
        label: 'Keycap Profile',
        expected: (KEYCAP_PROFILES[req.keycapProfile] || {}).name || req.keycapProfile,
        actual: (KEYCAP_PROFILES[currentBuild.keycapProfile] || {}).name || currentBuild.keycapProfile,
        match: currentBuild.keycapProfile === req.keycapProfile
      },
      {
        label: 'Dampening Layers',
        expected: `${req.dampeningLayers.length} Layers (${req.dampeningLayers.map(d => (DAMPENING_LAYERS[d] || {}).name || d).join(', ')})`,
        actual: `${(currentBuild.dampeningLayers || []).length} Layers`,
        match: req.dampeningLayers.every(d => (currentBuild.dampeningLayers || []).includes(d))
      }
    ];

    if (req.layout === '75') {
      if (req.hasKnob) {
        checks.push({
          label: 'Rotary Knob',
          expected: 'Required (Yes)',
          actual: currentBuild.hasKnob ? 'Yes' : 'No',
          match: currentBuild.hasKnob === true
        });
      } else if (req.hasLcd) {
        checks.push({
          label: 'TFT LCD Screen',
          expected: 'Required (Yes)',
          actual: currentBuild.hasLcd ? 'Yes' : 'No',
          match: currentBuild.hasLcd === true
        });
      }
    }

    if (req.artisanKeycap && req.artisanKeycap !== 'none') {
      const art = ARTISAN_KEYCAPS[req.artisanKeycap] || {};
      checks.push({
        label: 'Artisan Keycap (ESC)',
        expected: art.name || req.artisanKeycap,
        actual: currentBuild.artisanKeycap ? ((ARTISAN_KEYCAPS[currentBuild.artisanKeycap] || {}).name || currentBuild.artisanKeycap) : 'Belum dipilih',
        match: currentBuild.artisanKeycap === req.artisanKeycap
      });
    }

    if (req.coiledCable) {
      const cab = COILED_CABLES[req.coiledCable] || {};
      checks.push({
        label: 'Kabel Coiled Aviator',
        expected: cab.name || req.coiledCable,
        actual: currentBuild.coiledCable ? ((COILED_CABLES[currentBuild.coiledCable] || {}).name || currentBuild.coiledCable) : 'Belum dipilih',
        match: currentBuild.coiledCable === req.coiledCable
      });
    }

    const matchCount = checks.filter(c => c.match).length;
    const score = Math.round((matchCount / checks.length) * 100);
    const passed = score >= 70;

    let rank = 'SSS';
    if (score < 70) rank = 'C';
    else if (score < 85) rank = 'A';
    else if (score < 99) rank = 'S';

    return {
      score,
      rank,
      passed,
      matchCount,
      totalChecks: checks.length,
      details: checks
    };
  }

  // Purchase all missing quest parts with one click
  buyAllMissingQuestParts() {
    if (!this.currentCustomer) return { ok: false, msg: 'Tidak ada pesanan customer aktif!' };
    this.normalizeCustomerSpecs(this.currentCustomer);
    const req = this.currentCustomer.specs;
    const isService = this.currentCustomer.orderType === 'mod_service';
    const initSpecs = isService ? (this.currentCustomer.initialKeyboardSpecs || {}) : {};

    const caseMat = CASE_MATERIALS[req.caseMaterial] || {};
    const pcb = PCB_TYPES[req.pcb] || {};
    const plate = PLATE_MATERIALS[req.plate] || {};
    const stab = STABILIZERS[req.stabilizer] || {};
    const sw = SWITCHES[req.switch] || {};
    const theme = KEYCAP_THEMES[req.keycapTheme] || {};

    const missing = [];
    const isOrigCase = isService && initSpecs.caseMaterial === req.caseMaterial;
    if (!isOrigCase && !inventory.hasStock('case_' + req.caseMaterial)) {
      missing.push({ id: 'case_' + req.caseMaterial, price: caseMat.price || 35 });
    }

    req.dampeningLayers.forEach(dKey => {
      const isOrigDamp = isService && (initSpecs.dampeningLayers || []).includes(dKey);
      const d = DAMPENING_LAYERS[dKey];
      if (!isOrigDamp && !inventory.hasStock('damp_' + dKey)) {
        missing.push({ id: 'damp_' + dKey, price: d ? d.price : 10 });
      }
    });

    const isOrigPcb = isService && initSpecs.pcb === req.pcb;
    if (!isOrigPcb && !inventory.hasStock('pcb_' + req.pcb)) {
      missing.push({ id: 'pcb_' + req.pcb, price: pcb.price || 35 });
    }

    const isOrigStab = isService && initSpecs.stabilizer === req.stabilizer;
    if (!isOrigStab && !inventory.hasStock('stab_' + req.stabilizer)) {
      missing.push({ id: 'stab_' + req.stabilizer, price: stab.price || 18 });
    }

    const isOrigPlate = isService && initSpecs.plate === req.plate;
    if (!isOrigPlate && !inventory.hasStock('plate_' + req.plate)) {
      missing.push({ id: 'plate_' + req.plate, price: plate.price || 20 });
    }

    const isOrigSw = isService && initSpecs.switch === req.switch;
    if (!isOrigSw && !inventory.hasStock('sw_' + req.switch)) {
      missing.push({ id: 'sw_' + req.switch, price: sw.price || 28 });
    }

    const isOrigCap = isService && initSpecs.keycapTheme === req.keycapTheme;
    if (!isOrigCap && !inventory.hasStock('cap_' + req.keycapTheme)) {
      missing.push({ id: 'cap_' + req.keycapTheme, price: theme.price || 45 });
    }

    if (req.hasKnob && (!isService || !initSpecs.hasKnob) && !inventory.hasStock('addon_rotary_knob')) {
      missing.push({ id: 'addon_rotary_knob', price: 15 });
    }
    if (req.hasLcd && (!isService || !initSpecs.hasLcd) && !inventory.hasStock('addon_tft_lcd')) {
      missing.push({ id: 'addon_tft_lcd', price: 25 });
    }

    if (req.artisanKeycap && req.artisanKeycap !== 'none') {
      const isOrigArtisan = isService && initSpecs.artisanKeycap === req.artisanKeycap;
      if (!isOrigArtisan && !inventory.hasStock('artisan_' + req.artisanKeycap)) {
        missing.push({ id: 'artisan_' + req.artisanKeycap, price: (ARTISAN_KEYCAPS[req.artisanKeycap] || {}).price || 30 });
      }
    }

    if (req.coiledCable) {
      const isOrigCable = isService && initSpecs.coiledCable === req.coiledCable;
      if (!isOrigCable && !inventory.hasStock('cable_' + req.coiledCable)) {
        missing.push({ id: 'cable_' + req.coiledCable, price: (COILED_CABLES[req.coiledCable] || {}).price || 18 });
      }
    }

    if (missing.length === 0) {
      return { ok: true, msg: isService ? 'Semua part untuk reparasi sudah tersedia!' : 'Semua part pesanan sudah tersedia di stok kamu!' };
    }

    const totalCost = missing.reduce((sum, item) => sum + item.price, 0);
    if (inventory.coins < totalCost) {
      return { ok: false, msg: `Budget koin tidak cukup! Butuh $${totalCost}, koin kamu $${inventory.coins}.` };
    }

    missing.forEach(item => {
      inventory.buyItem(item.id, item.price, 1);
    });

    return { ok: true, msg: `Berhasil membeli ${missing.length} part ${isService ? 'reparasi' : 'pesanan'} dari 🛒Toko ($${totalCost})!` };
  }

  // Generates Persistent Right-Side Blueprint Specs HTML
  getPersistentBlueprintHtml(currentBuild = {}) {
    if (!this.currentCustomer) return '<div class="blueprint-card">Menunggu customer...</div>';
    this.normalizeCustomerSpecs(this.currentCustomer);

    const cust = this.currentCustomer;
    const req = cust.specs;
    const validation = this.validateBuild(currentBuild);

    const isService = cust.orderType === 'mod_service';
    const initSpecs = isService ? (cust.initialKeyboardSpecs || {}) : {};

    const caseMat = CASE_MATERIALS[req.caseMaterial] || {};
    const caseColor = CASE_COLORS[req.caseColor] || {};
    const pcb = PCB_TYPES[req.pcb] || {};
    const pcbColor = PCB_COLORS[req.pcbColor] || PCB_COLORS['black'];
    const plate = PLATE_MATERIALS[req.plate] || {};
    const stab = STABILIZERS[req.stabilizer] || {};
    const stabTune = STAB_TUNING_OPTIONS[req.stabTuning] || {};
    const sw = SWITCHES[req.switch] || {};
    const theme = KEYCAP_THEMES[req.keycapTheme] || {};
    const profile = KEYCAP_PROFILES[req.keycapProfile] || {};

    const caseStock = inventory.getStock('case_' + req.caseMaterial);
    const pcbStock = inventory.getStock('pcb_' + req.pcb);
    const stabStock = inventory.getStock('stab_' + req.stabilizer);
    const plateStock = inventory.getStock('plate_' + req.plate);
    const swStock = inventory.getStock('sw_' + req.switch);
    const capStock = inventory.getStock('cap_' + req.keycapTheme);
    let addonStock = 1;
    if (req.hasKnob) addonStock = inventory.getStock('addon_rotary_knob');
    if (req.hasLcd) addonStock = inventory.getStock('addon_tft_lcd');

    const artisanStock = (req.artisanKeycap && req.artisanKeycap !== 'none') ? inventory.getStock('artisan_' + req.artisanKeycap) : 1;
    const cableStock = req.coiledCable ? inventory.getStock('cable_' + req.coiledCable) : 1;

    // Check which parts are already provided by customer's prebuilt keyboard
    const isOrigCase = isService && initSpecs.caseMaterial === req.caseMaterial;
    const isOrigPcb = isService && initSpecs.pcb === req.pcb;
    const isOrigStab = isService && initSpecs.stabilizer === req.stabilizer;
    const isOrigPlate = isService && initSpecs.plate === req.plate;
    const isOrigSw = isService && initSpecs.switch === req.switch;
    const isOrigCap = isService && initSpecs.keycapTheme === req.keycapTheme;
    const isOrigArtisan = isService && initSpecs.artisanKeycap === req.artisanKeycap;
    const isOrigCable = isService && initSpecs.coiledCable === req.coiledCable;
    const isOrigAddon = isService && ((req.hasKnob && initSpecs.hasKnob) || (req.hasLcd && initSpecs.hasLcd));

    const renderStockTag = (isOrig, stock, shopCat = 'cases') => {
      if (isOrig) return `<span class="quest-stock in">Bawaan Keyboard</span>`;
      return `<span class="quest-stock ${stock > 0 ? 'in' : 'out'}" data-shop-cat="${shopCat}">Stock: ${stock}</span>`;
    };

    // Missing parts check (only parts NOT provided by customer)
    const missing = [];
    if (!isOrigCase && caseStock <= 0) missing.push({ id: 'case_' + req.caseMaterial, price: caseMat.price || 35 });
    req.dampeningLayers.forEach(dKey => {
      const isOrigDamp = isService && (initSpecs.dampeningLayers || []).includes(dKey);
      const d = DAMPENING_LAYERS[dKey];
      if (!isOrigDamp && inventory.getStock('damp_' + dKey) <= 0) {
        missing.push({ id: 'damp_' + dKey, price: d ? d.price : 10 });
      }
    });
    if (!isOrigPcb && pcbStock <= 0) missing.push({ id: 'pcb_' + req.pcb, price: pcb.price || 35 });
    if (!isOrigStab && stabStock <= 0) missing.push({ id: 'stab_' + req.stabilizer, price: stab.price || 18 });
    if (!isOrigPlate && plateStock <= 0) missing.push({ id: 'plate_' + req.plate, price: plate.price || 20 });
    if (!isOrigSw && swStock <= 0) missing.push({ id: 'sw_' + req.switch, price: sw.price || 28 });
    if (!isOrigCap && capStock <= 0) missing.push({ id: 'cap_' + req.keycapTheme, price: theme.price || 45 });
    if (req.hasKnob && (!isService || !initSpecs.hasKnob) && addonStock <= 0) missing.push({ id: 'addon_rotary_knob', price: 15 });
    if (req.hasLcd && (!isService || !initSpecs.hasLcd) && addonStock <= 0) missing.push({ id: 'addon_tft_lcd', price: 25 });

    if (req.artisanKeycap && req.artisanKeycap !== 'none' && !isOrigArtisan && artisanStock <= 0) {
      missing.push({ id: 'artisan_' + req.artisanKeycap, price: (ARTISAN_KEYCAPS[req.artisanKeycap] || {}).price || 30 });
    }

    if (req.coiledCable && !isOrigCable && cableStock <= 0) {
      missing.push({ id: 'cable_' + req.coiledCable, price: (COILED_CABLES[req.coiledCable] || {}).price || 18 });
    }

    const totalMissingCost = missing.reduce((sum, item) => sum + item.price, 0);

    const dampNames = req.dampeningLayers.map(dKey => {
      const d = DAMPENING_LAYERS[dKey];
      const dName = d ? d.name.replace(/^\d+\.\s*/, '') : dKey;
      const dStock = inventory.getStock('damp_' + dKey);
      const isOrigDamp = isService && (initSpecs.dampeningLayers || []).includes(dKey);
      return `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;gap:8px;">
        <span>• ${dName}</span>
        ${renderStockTag(isOrigDamp, dStock, 'dampeners')}
      </div>`;
    });

    let addonText = 'Clean Minimalist Badge';
    if (req.hasKnob) addonText = 'CNC Rotary Knob';
    if (req.hasLcd) addonText = 'Mini TFT LCD Screen';

    const dampMatched = req.dampeningLayers.length === (currentBuild.dampeningLayers || []).length &&
      req.dampeningLayers.every(d => (currentBuild.dampeningLayers || []).includes(d));

    return `
      <div class="blueprint-header">
        <div class="blueprint-avatar-icon" style="font-size:11px;font-weight:700;letter-spacing:1px;background:rgba(255, 255, 255, 0.08);border:1px solid rgba(255, 255, 255, 0.14);border-radius:6px;padding:3px 8px;color:#f0f0f1;font-family:var(--font-mono);">
          ${isService ? 'MOD' : 'SPEC'}
        </div>
        <div class="blueprint-title-wrap">
          <div class="blueprint-tag ${isService ? 'service-tag' : ''}">
            ${isService ? '🛠️ ORDER SERVIS & MODIFIKASI' : 'CUSTOMER ORDER BLUEPRINT'}
          </div>
          <h3 class="blueprint-customer-name">${isService ? (cust.serviceTitle || cust.name) : cust.name}</h3>
        </div>
        <button class="panel-collapse-btn" id="hide-blueprint-btn" title="Sembunyikan Panel Blueprint">✕</button>
      </div>

      <div class="blueprint-scroll-body">
        ${isService ? `
          <div class="service-diagnostic-box">
            <div class="service-diag-label">⚠️ KELUHAN CUSTOMER:</div>
            <div class="service-diag-text">${cust.serviceIssue}</div>
          </div>
        ` : ''}

      <div class="customer-quote-box">
        <span class="quote-mark">“</span>${cust.dialogue}<span class="quote-mark">”</span>
      </div>

      <div class="blueprint-specs-list">
        <div class="spec-row ${String(currentBuild.layout) === String(req.layout) ? 'matched' : ''}" data-step="0" title="Klik untuk menuju Step 1: Case & Chassis">
          <span class="spec-label">Layout:</span>
          <span class="spec-val highlight">${req.layout}% Layout</span>
        </div>

        <div class="spec-row ${currentBuild.caseMaterial === req.caseMaterial ? 'matched' : ''}" data-step="0" title="Klik untuk menuju Step 1: Case & Chassis">
          <span class="spec-label">Casing:</span>
          <span class="spec-val">
            <span>${caseMat.name || req.caseMaterial}</span>
            ${renderStockTag(isOrigCase, caseStock, 'cases')}
          </span>
        </div>

        <div class="spec-row ${currentBuild.caseColor === req.caseColor ? 'matched' : ''}" data-step="0" title="Klik untuk menuju Step 1: Case & Chassis">
          <span class="spec-label">Warna Casing:</span>
          <span class="spec-val highlight">${caseColor.name || caseColor.label || req.caseColor}</span>
        </div>

        <div class="spec-row ${dampMatched ? 'matched' : ''}" data-step="1" title="Klik untuk menuju Step 2: Multi-Layer Dampening">
          <span class="spec-label">Dampening:</span>
          <div class="spec-val small-list" style="width:100%;">
            ${dampNames.join('')}
          </div>
        </div>

        <div class="spec-row ${currentBuild.pcb === req.pcb ? 'matched' : ''}" data-step="2" title="Klik untuk menuju Step 3: PCB & Stabilizers">
          <span class="spec-label">PCB:</span>
          <span class="spec-val">
            <span>${pcb.name || req.pcb}</span>
            ${renderStockTag(isOrigPcb, pcbStock, 'pcbs')}
          </span>
        </div>

        <div class="spec-row ${currentBuild.pcbColor === (req.pcbColor || 'black') ? 'matched' : ''}" data-step="2" title="Klik untuk menuju Step 3: PCB & Stabilizers">
          <span class="spec-label">Warna PCB:</span>
          <span class="spec-val highlight">${pcbColor.name} (${pcbColor.label})</span>
        </div>

        <div class="spec-row ${currentBuild.stabilizer === req.stabilizer ? 'matched' : ''}" data-step="2" title="Klik untuk menuju Step 3: PCB & Stabilizers">
          <span class="spec-label">Stabilizer:</span>
          <span class="spec-val">
            <span>${stab.name || req.stabilizer}</span>
            ${renderStockTag(isOrigStab, stabStock, 'stabilizers')}
          </span>
        </div>

        <div class="spec-row ${currentBuild.stabTuning === req.stabTuning ? 'matched' : ''}" data-step="2" title="Klik untuk menuju Step 3: PCB & Stabilizers">
          <span class="spec-label">Tuning Stabilizer:</span>
          <span class="spec-val highlight">${stabTune.name || req.stabTuning}</span>
        </div>

        <div class="spec-row ${currentBuild.plate === req.plate ? 'matched' : ''}" data-step="3" title="Klik untuk menuju Step 4: Plate & IXPE">
          <span class="spec-label">Plate:</span>
          <span class="spec-val">
            <span>${plate.name || req.plate}</span>
            ${renderStockTag(isOrigPlate, plateStock, 'plates')}
          </span>
        </div>

        <div class="spec-row ${currentBuild.switch === req.switch ? 'matched' : ''}" data-step="4" title="Klik untuk menuju Step 5: Mechanical Switches">
          <span class="spec-label">Switches:</span>
          <span class="spec-val highlight">
            <span>${sw.name || req.switch} (${sw.pins}-Pin, ${sw.force})</span>
            ${renderStockTag(isOrigSw, swStock, 'switches')}
          </span>
        </div>

        <div class="spec-row ${currentBuild.keycapTheme === req.keycapTheme ? 'matched' : ''}" data-step="5" title="Klik untuk menuju Step 6: Keycaps & Addons">
          <span class="spec-label">Keycaps:</span>
          <span class="spec-val">
            <span>${theme.name}</span>
            ${renderStockTag(isOrigCap, capStock, 'keycaps')}
          </span>
        </div>

        <div class="spec-row ${currentBuild.keycapProfile === req.keycapProfile ? 'matched' : ''}" data-step="5" title="Klik untuk menuju Step 6: Keycaps & Addons">
          <span class="spec-label">Profile Keycaps:</span>
          <span class="spec-val highlight">${profile.name || req.keycapProfile}</span>
        </div>

        ${(req.artisanKeycap && req.artisanKeycap !== 'none') ? `
        <div class="spec-row ${currentBuild.artisanKeycap === req.artisanKeycap ? 'matched' : ''}" data-step="5" title="Klik untuk menuju Step 6: Keycaps & Addons">
          <span class="spec-label">Artisan ESC:</span>
          <span class="spec-val highlight">
            <span>${(ARTISAN_KEYCAPS[req.artisanKeycap] || {}).name}</span>
            ${renderStockTag(isOrigArtisan, artisanStock, 'artisans')}
          </span>
        </div>` : ''}

        ${req.coiledCable ? `
        <div class="spec-row ${currentBuild.coiledCable === req.coiledCable ? 'matched' : ''}" data-step="5" title="Klik untuk menuju Step 6: Keycaps & Addons">
          <span class="spec-label">Kabel Aviator:</span>
          <span class="spec-val highlight">
            <span>${(COILED_CABLES[req.coiledCable] || {}).name}</span>
            ${renderStockTag(isOrigCable, cableStock, 'cables')}
          </span>
        </div>` : ''}

        ${req.layout === '75' ? `
        <div class="spec-row ${((req.hasKnob && currentBuild.hasKnob) || (req.hasLcd && currentBuild.hasLcd) || (!req.hasKnob && !req.hasLcd && !currentBuild.hasKnob && !currentBuild.hasLcd)) ? 'matched' : ''}" data-step="5" title="Klik untuk menuju Step 6: Keycaps & Addons">
          <span class="spec-label">Addon:</span>
          <span class="spec-val highlight">
            <span>${addonText}</span>
            ${(req.hasKnob || req.hasLcd) ? renderStockTag(isOrigAddon, addonStock, 'addons') : ''}
          </span>
        </div>` : ''}
      </div>
      </div>

      <div class="blueprint-pinned-footer">
        <div class="blueprint-sync-action">
          ${missing.length > 0 ? `
            <button class="btn btn-primary buy-quest-parts-btn" id="buy-quest-parts-btn">
              ${isService ? 'Beli Part Reparasi' : 'Beli Part Pesanan'} ($${totalMissingCost})
            </button>
          ` : `
            <div class="all-parts-ready-badge">✓ ${isService ? 'Semua Part Siap (Bawaan Lengkap)' : 'Semua Part Pesanan Siap di Gudang!'}</div>
          `}
        </div>

        <div class="blueprint-footer">
          <div class="payout-pill">
            <span class="payout-label">Reward:</span>
            <span class="payout-amt">$${cust.financials.totalPayout}</span>
          </div>
          <div class="accuracy-pill ${validation.score >= 90 ? 'high' : ''}">
            Match: <strong>${validation.score}%</strong> (${validation.matchCount}/${validation.totalChecks})
          </div>
        </div>
      </div>
    `;
  }
}

export const orderSystem = new OrderSystem();
