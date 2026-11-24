// 3D Multi-Layer Mechanical Keyboard Assembly Model
// Full enthusiast construction: Case -> Dampeners -> PCB -> IXPE Pads -> Plate -> Stabs -> Switches -> Keycaps -> Knob/Screen/Badges
// Supports initial empty/unselected state and animated part installation onto workbench.

import * as THREE from 'three';
import { LAYOUT_PRESETS } from '../data/layouts.js';
import {
  CASE_MATERIALS,
  CASE_COLORS,
  PCB_TYPES,
  PCB_COLORS,
  DAMPENING_LAYERS,
  PLATE_MATERIALS,
  STABILIZERS,
  SWITCHES,
  KEYCAP_PROFILES,
  KEYCAP_THEMES,
  ARTISAN_KEYCAPS,
  COILED_CABLES,
  RGB_MODES
} from '../data/parts-catalog.js';
import { legendGenerator } from '../engine/legend-generator.js';
import { audioManager } from '../engine/audio.js';

export class KeyboardAssembly {
  constructor(specs = {}) {
    this.specs = {
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
      artisanKeycap: 'none',
      coiledCable: 'black_techflex',
      rgbMode: 'rainbow',
      ...specs
    };

    this.group = new THREE.Group();
    this.keysMap = new Map(); // code -> Mesh
    this.switchesMap = new Map();
    this.interactiveMeshes = [];
    this.rgbLedMeshes = [];
    this.underglowMesh = null;
    this.timeElapsed = 0;

    // Active layer groups
    this.layers = {};

    // Active mounting animations
    this.activeAnimations = [];

    this.buildAssembly();
  }

  buildAssembly(animLayer = null) {
    // Clear previous children
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
    this.keysMap.clear();
    this.switchesMap.clear();
    this.interactiveMeshes = [];
    this.rgbLedMeshes = [];
    this.underglowMesh = null;
    this.layers = {};
    this.activeAnimations = [];

    // If no layout is selected yet, workbench stays completely empty
    if (!this.specs.layout || !this.specs.caseMaterial) {
      return;
    }

    const layoutData = LAYOUT_PRESETS[this.specs.layout] || LAYOUT_PRESETS['75'];
    const unitSize = 0.38; // 1U in 3D world units (19.05mm real world)
    const matrixWidth = layoutData.widthUnit * unitSize;
    const matrixDepth = layoutData.rowCount * unitSize;

    // 1. Build Case (Bottom chassis + bezel rim + silver weight)
    if (this.specs.caseMaterial) {
      this.buildCase(matrixWidth, matrixDepth);
      if (animLayer === 'case' && this.layers.case) {
        this.addLayerDropAnimation(this.layers.case, 2.8, 0, 0.45, () => {
          audioManager.playScrewSound();
        });
      }
    }

    // 2. Build Dampeners
    if (this.specs.dampeningLayers && this.specs.dampeningLayers.length > 0) {
      this.buildDampeners(matrixWidth, matrixDepth, layoutData, unitSize);
      if (animLayer === 'dampeners' && this.layers.dampeners) {
        this.addLayerDropAnimation(this.layers.dampeners, 2.0, 0, 0.35, () => {
          audioManager.playLubeSquish();
        });
      }
    }

    // 3. Build PCB
    if (this.specs.pcb) {
      this.buildPCB(matrixWidth, matrixDepth, layoutData, unitSize);
      if (animLayer === 'pcb' && this.layers.pcb) {
        this.addLayerDropAnimation(this.layers.pcb, 2.2, 0, 0.4, () => {
          audioManager.playScrewSound();
        });
      }
    }

    // 4. Build Stabilizers
    if (this.specs.stabilizer) {
      this.buildStabilizers(layoutData, unitSize);
      if (animLayer === 'stabilizers' && this.layers.stabilizers) {
        this.addLayerDropAnimation(this.layers.stabilizers, 1.8, 0, 0.35, () => {
          audioManager.playLubeSquish();
        });
      }
    }

    // 5. Build Plate (with precision square cutouts for every switch)
    if (this.specs.plate) {
      this.buildPlate(layoutData, unitSize, matrixWidth, matrixDepth);
      if (animLayer === 'plate' && this.layers.plate) {
        this.addLayerDropAnimation(this.layers.plate, 2.0, 0, 0.38, () => {
          audioManager.playSwitchSnap();
        });
      }
    }

    // 6. Build Switches & Keycaps & Blockers/Badges & RGB LEDs
    if (this.specs.switch || this.specs.keycapTheme) {
      this.buildKeycapsAndSwitches(layoutData, unitSize, animLayer);
    }

    // 7. Build Rotary Knob / LCD Screen if enabled
    if (this.specs.hasKnob || this.specs.hasLcd) {
      this.buildAddons(layoutData, unitSize);
      if (animLayer === 'addons') {
        const target = this.knobMesh || this.lcdMesh;
        if (target) {
          this.addLayerDropAnimation(target, 1.6, target.position.y, 0.3, () => {
            audioManager.playSwitchSnap();
          });
        }
      }
    }

    // 8. Build Coiled Cable & Aviator Connector
    if (this.specs.coiledCable && this.specs.coiledCable !== 'none') {
      this.buildCoiledCable(matrixWidth, matrixDepth);
    }
  }

  // Animation Helper for dropping whole layer
  addLayerDropAnimation(group, startY, targetY, duration, onComplete) {
    group.position.y = startY;
    this.activeAnimations.push({
      group,
      startY,
      targetY,
      duration,
      elapsed: 0,
      onComplete
    });
  }

  buildCase(width, depth) {
    const caseGroup = new THREE.Group();
    const matKey = this.specs.caseMaterial;
    const colorKey = this.specs.caseColor;

    const caseData = CASE_MATERIALS[matKey] || CASE_MATERIALS['aluminum'];
    const colorData = CASE_COLORS[colorKey] || CASE_COLORS['black'];
    const caseHex = parseInt(colorData.hex.replace('#', '0x'), 16);
    const rimHex = parseInt(colorData.rimHex.replace('#', '0x'), 16);

    const isAcrylic = matKey === 'acrylic';
    const isAluminum = matKey === 'aluminum';

    const caseMat = new THREE.MeshStandardMaterial({
      color: caseHex,
      roughness: isAluminum ? 0.35 : 0.65,
      metalness: isAluminum ? 0.75 : 0.1,
      transparent: isAcrylic,
      opacity: isAcrylic ? 0.78 : 1.0
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: rimHex,
      roughness: isAluminum ? 0.3 : 0.6,
      metalness: isAluminum ? 0.8 : 0.15
    });

    // Outer case base - precision high-profile mechanical keyboard chassis with open tray cavity
    const bezel = 0.07;
    const outerW = width + bezel * 2;
    const outerD = depth + bezel * 2;
    const floorThickness = 0.18;

    // 1. Bottom tray floor slab
    const floorGeo = new THREE.BoxGeometry(outerW, floorThickness, outerD);
    const caseFloor = new THREE.Mesh(floorGeo, caseMat);
    caseFloor.position.set(0, floorThickness / 2, 0);
    caseFloor.castShadow = true;
    caseFloor.receiveShadow = true;
    caseGroup.add(caseFloor);

    // 2. Raised high-profile bezel walls (open interior cavity, flush with keycap skirts)
    const rimThickness = 0.06;
    const wallHeight = 0.53;
    const wallY = floorThickness + wallHeight / 2; // y = 0.445, top rim at y = 0.71

    // Left Rim
    const leftRimGeo = new THREE.BoxGeometry(rimThickness, wallHeight, outerD);
    const leftRim = new THREE.Mesh(leftRimGeo, rimMat);
    leftRim.position.set(-outerW / 2 + rimThickness / 2, wallY, 0);
    leftRim.castShadow = true;
    leftRim.receiveShadow = true;
    caseGroup.add(leftRim);

    // Right Rim
    const rightRim = new THREE.Mesh(leftRimGeo, rimMat);
    rightRim.position.set(outerW / 2 - rimThickness / 2, wallY, 0);
    rightRim.castShadow = true;
    rightRim.receiveShadow = true;
    caseGroup.add(rightRim);

    // Top Rim
    const topRimGeo = new THREE.BoxGeometry(outerW, wallHeight, rimThickness);
    const topRim = new THREE.Mesh(topRimGeo, rimMat);
    topRim.position.set(0, wallY, -outerD / 2 + rimThickness / 2);
    topRim.castShadow = true;
    topRim.receiveShadow = true;
    caseGroup.add(topRim);

    // Bottom Rim
    const botRim = new THREE.Mesh(topRimGeo, rimMat);
    botRim.position.set(0, wallY, outerD / 2 - rimThickness / 2);
    botRim.castShadow = true;
    botRim.receiveShadow = true;
    caseGroup.add(botRim);

    // Internal Polished Silver Weight Bar (Rests on the bottom cavity floor, clean minimalist finish without text)
    const weightGeo = new THREE.BoxGeometry(outerW * 0.65, 0.02, outerD * 0.3);
    const weightMat = new THREE.MeshStandardMaterial({
      color: 0xd8dde4,
      metalness: 0.95,
      roughness: 0.18
    });
    const weight = new THREE.Mesh(weightGeo, weightMat);
    weight.position.set(0, floorThickness + 0.01, 0);
    weight.castShadow = true;
    weight.receiveShadow = true;
    caseGroup.add(weight);

    // Dynamic Underglow light diffuser frame
    const underglowGeo = new THREE.BoxGeometry(outerW * 0.96, 0.02, outerD * 0.96);
    const underglowMat = new THREE.MeshBasicMaterial({
      color: 0x00f6ff,
      transparent: true,
      opacity: 0.45
    });
    this.underglowMesh = new THREE.Mesh(underglowGeo, underglowMat);
    this.underglowMesh.position.set(0, floorThickness + 0.015, 0);
    caseGroup.add(this.underglowMesh);

    this.layers.case = caseGroup;
    this.group.add(caseGroup);
  }

  buildDampeners(width, depth, layoutData, unitSize) {
    const dampGroup = new THREE.Group();
    const installed = this.specs.dampeningLayers || [];
    const hasPlate = Boolean(this.specs.plate);

    // =========================================================================
    // 1. BOTTOM DAMPENERS (Always sit in the lower chassis tray, beneath PCB)
    // =========================================================================
    let bottomStackY = 0.20;

    // 1. Poron 3mm Bottom Case Foam (Rests on cavity floor)
    if (installed.includes('case_foam')) {
      const foamGeo = new THREE.BoxGeometry(width * 0.98, 0.04, depth * 0.98);
      const foamMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.95 });
      const foam = new THREE.Mesh(foamGeo, foamMat);
      foam.position.set(0, bottomStackY + 0.02, 0);
      dampGroup.add(foam);
      bottomStackY += 0.04;
    }

    // 2. Molded Silicone Base / Battery Pad (Rests on case foam or directly on floor)
    if (installed.includes('battery_pad')) {
      const siliconeGeo = new THREE.BoxGeometry(width * 0.96, 0.04, depth * 0.96);
      const siliconeMat = new THREE.MeshStandardMaterial({ color: 0x2b2d30, roughness: 0.8 });
      const silicone = new THREE.Mesh(siliconeGeo, siliconeMat);
      silicone.position.set(0, bottomStackY + 0.02, 0);
      dampGroup.add(silicone);
      bottomStackY += 0.04;
    }

    // =========================================================================
    // 2. TOP DAMPENERS / PLATE DAMPENING (Sits ON TOP of PCB, beneath Plate)
    // ONLY rendered when Plate is mounted (Step 4+), so PCB is 100% visible during Step 3!
    // Poron 3.5mm Plate Foam is GUARANTEED to stay strictly ON TOP of the PCB!
    // =========================================================================
    if (hasPlate && layoutData) {
      let topY = 0.460;

      // 5. IXPE 0.5mm Switch Sheet Pads (sits directly on top of PCB)
      if (installed.includes('ixpe_switch_pads')) {
        const ixpeMesh = this.createCutoutSheet(width, depth, layoutData, unitSize, topY, 0.008, 0x0f0f10, 0.8, 0.85);
        dampGroup.add(ixpeMesh);
        topY += 0.010;
      }

      // 6. PET Acoustic Voice Film (Thin glossy semi-transparent acoustic sheet)
      if (installed.includes('pet_film')) {
        const petGeo = new THREE.BoxGeometry(width * 0.98, 0.006, depth * 0.98);
        const petMat = new THREE.MeshStandardMaterial({
          color: 0xd0e5f2,
          roughness: 0.1,
          metalness: 0.2,
          transparent: true,
          opacity: 0.35
        });
        const pet = new THREE.Mesh(petGeo, petMat);
        pet.position.set(0, topY, 0);
        dampGroup.add(pet);
        topY += 0.010;
      }

      // 4. Poron 3.5mm Plate-to-PCB Foam (Sits on top of PCB, directly under Plate)
      // "lu harus jaga dampening Poron 3.5mm plate, itu harus tetap di atas PCB."
      if (installed.includes('pcb_foam')) {
        const pcbFoamMesh = this.createCutoutSheet(width, depth, layoutData, unitSize, topY, 0.035, 0x1e1e20, 0.95, 1.0);
        dampGroup.add(pcbFoamMesh);
      }
    }

    this.layers.dampeners = dampGroup;
    this.group.add(dampGroup);
  }

  createCutoutSheet(width, depth, layoutData, unitSize, yPos, thickness, colorHex, roughness, opacity = 1.0) {
    const halfW = (width * 0.99) / 2;
    const halfD = (depth * 0.99) / 2;

    const shape = new THREE.Shape();
    shape.moveTo(-halfW, -halfD);
    shape.lineTo(halfW, -halfD);
    shape.lineTo(halfW, halfD);
    shape.lineTo(-halfW, halfD);
    shape.closePath();

    const matrixWidth = layoutData.widthUnit * unitSize;
    const startX = -matrixWidth / 2;
    const rowCount = layoutData.rows.length;

    layoutData.rows.forEach((row, rIdx) => {
      let xOffset = 0;
      const zPos = (rIdx - (rowCount - 1) / 2) * unitSize;

      row.forEach(key => {
        const isVertical2U = Boolean(key.isVertical2U || key.h === 2);
        const keyWidth = (key.w || 1) * unitSize;
        const xPos = startX + xOffset + keyWidth / 2;
        const targetZ = isVertical2U ? (zPos + unitSize / 2) : zPos;

        if (!key.isEmpty && !key.isBlocker && !key.isCaseBlocker && !key.isBadge && !key.isSoundBadge && !key.isLedPanel) {
          if ((key.canBeReplacedByKnob && this.specs.hasKnob) ||
              (key.canBeReplacedByLcd && this.specs.hasLcd)) {
            xOffset += keyWidth;
            return;
          }

          const cutRadius = 0.13;
          const holeY = -targetZ;
          const holeX = xPos;

          const hole = new THREE.Path();
          hole.moveTo(holeX - cutRadius, holeY - cutRadius);
          hole.lineTo(holeX + cutRadius, holeY - cutRadius);
          hole.lineTo(holeX + cutRadius, holeY + cutRadius);
          hole.lineTo(holeX - cutRadius, holeY + cutRadius);
          hole.closePath();

          shape.holes.push(hole);
        }
        xOffset += keyWidth;
      });
    });

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: false
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.rotateX(-Math.PI / 2);

    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: roughness,
      transparent: opacity < 1.0,
      opacity: opacity,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, yPos, 0);
    return mesh;
  }

  buildPCB(width, depth, layoutData, unitSize) {
    const pcbGroup = new THREE.Group();
    const pcbType = PCB_TYPES[this.specs.pcb] || PCB_TYPES['flex_3conn'];
    const pcbColorKey = this.specs.pcbColor || 'black';
    const colorData = PCB_COLORS[pcbColorKey] || PCB_COLORS['black'];

    // Generate high-DPI circuit texture with traces, solder pads, Kailh sockets, diodes, and IC MCU
    const pcbTexture = this.createPCBTexture(pcbColorKey, layoutData, pcbType.flexCut);

    const pcbGeo = new THREE.BoxGeometry(width, 0.035, depth);
    const pcbMatTop = new THREE.MeshStandardMaterial({
      map: pcbTexture,
      roughness: 0.35,
      metalness: 0.4
    });
    const pcbMatEdge = new THREE.MeshStandardMaterial({
      color: parseInt(colorData.hex.replace('#', '0x'), 16),
      roughness: 0.6,
      metalness: 0.2
    });

    const pcbMaterials = [
      pcbMatEdge, pcbMatEdge, // Left, Right
      pcbMatTop, pcbMatTop,  // Top, Bottom
      pcbMatEdge, pcbMatEdge  // Front, Back
    ];

    const pcb = new THREE.Mesh(pcbGeo, pcbMaterials);
    pcb.position.set(0, 0.44, 0);
    pcb.receiveShadow = true;
    pcb.castShadow = true;
    pcbGroup.add(pcb);

    if (pcbType.flexCut) {
      const slotMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
      for (let x = -width / 2 + 0.35; x < width / 2 - 0.35; x += 0.55) {
        for (let z = -depth / 2 + 0.35; z < depth / 2 - 0.35; z += 0.55) {
          const slotGeo = new THREE.BoxGeometry(0.32, 0.04, 0.03);
          const slot = new THREE.Mesh(slotGeo, slotMat);
          slot.position.set(x, 0.44, z);
          pcbGroup.add(slot);
        }
      }
    }

    // Tempest Tape Mod is stuck to the underside of the PCB
    if ((this.specs.dampeningLayers || []).includes('tape_mod')) {
      const tapeGeo = new THREE.BoxGeometry(width * 0.97, 0.01, depth * 0.97);
      const tapeMat = new THREE.MeshStandardMaterial({ color: 0xd4c28a, roughness: 0.7 });
      const tape = new THREE.Mesh(tapeGeo, tapeMat);
      tape.position.set(0, 0.418, 0);
      pcbGroup.add(tape);
    }

    this.layers.pcb = pcbGroup;
    this.group.add(pcbGroup);
  }

  createPCBTexture(pcbColorKey, layoutData, flexCut) {
            const colorData = PCB_COLORS[pcbColorKey] || PCB_COLORS['black'];
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            // 1. Solder mask base color (Red, Black, White, Green, or Blue)
            ctx.fillStyle = colorData.hex;
            ctx.fillRect(0, 0, 1024, 512);

            // 2. Subtle ground plane cross-hatch copper pour texture
            ctx.strokeStyle = colorData.id === 'white' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1;
            for (let x = 0; x < 1024; x += 16) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, 512);
              ctx.stroke();
            }
            for (let y = 0; y < 512; y += 16) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(1024, y);
              ctx.stroke();
            }

            if (!layoutData) {
              const tex = new THREE.CanvasTexture(canvas);
              tex.colorSpace = THREE.SRGBColorSpace;
              return tex;
            }

            // 3. Draw circuit traces, hotswap solder pads, and diodes for each key in layout
            const rowCount = layoutData.rows.length;
            const paddingX = 40;
            const paddingY = 40;
            const gridW = (1024 - paddingX * 2) / layoutData.widthUnit;
            const gridH = (512 - paddingY * 2) / rowCount;

            // Track bus lines across rows
            layoutData.rows.forEach((row, rIdx) => {
              let uOffset = 0;
              const keyY = paddingY + (rIdx + 0.5) * gridH;

              // Draw horizontal copper bus trace running along this row
              ctx.strokeStyle = colorData.traceColor;
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.moveTo(paddingX + 10, keyY + 8);
              ctx.lineTo(1024 - paddingX - 10, keyY + 8);
              ctx.stroke();

              row.forEach(key => {
                const kWidth = (key.w || 1);
                const keyX = paddingX + (uOffset + kWidth / 2) * gridW;

                if (!key.isEmpty) {
                  // A. Central stem guide hole (gold annular ring)
                  ctx.strokeStyle = colorData.traceColor;
                  ctx.lineWidth = 2.5;
                  ctx.beginPath();
                  ctx.arc(keyX, keyY, 12, 0, Math.PI * 2);
                  ctx.stroke();
                  ctx.fillStyle = '#080808';
                  ctx.beginPath();
                  ctx.arc(keyX, keyY, 9, 0, Math.PI * 2);
                  ctx.fill();

                  // B. Kailh Hotswap Socket Solder Pads (Left and Right MX pin holes with gold pads)
                  const padOffsets = [-16, 16];
                  padOffsets.forEach((pOff, pIdx) => {
                    const padX = keyX + pOff;
                    const padY = keyY + (pIdx === 0 ? -12 : 12);

                    // Gold rectangular pad
                    ctx.fillStyle = colorData.traceColor;
                    ctx.fillRect(padX - 8, padY - 5, 16, 10);

                    // Black solder eyelet hole
                    ctx.fillStyle = '#050505';
                    ctx.beginPath();
                    ctx.arc(padX, padY, 3, 0, Math.PI * 2);
                    ctx.fill();

                    // Trace connecting pad to row bus
                    ctx.strokeStyle = colorData.traceColor;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(padX, padY);
                    ctx.lineTo(padX, keyY + 8);
                    ctx.stroke();
                  });

                  // C. SMD Diode (Miniature surface-mount diode Dxx)
                  const diodeX = keyX - 22;
                  const diodeY = keyY + 12;
                  ctx.fillStyle = '#222222';
                  ctx.fillRect(diodeX - 5, diodeY - 3, 10, 6);
                  // Silver/Gold diode end contacts
                  ctx.fillStyle = '#e67e22';
                  ctx.fillRect(diodeX - 6, diodeY - 3, 2, 6);
                  ctx.fillRect(diodeX + 4, diodeY - 3, 2, 6);

                  // Tiny silkscreen text for diode
                  ctx.fillStyle = colorData.silkColor;
                  ctx.font = '8px monospace';
                  ctx.fillText(`D`, diodeX - 3, diodeY - 5);

                  // D. Via (Gold test hole / multi-layer through-hole)
                  ctx.fillStyle = colorData.traceColor;
                  ctx.beginPath();
                  ctx.arc(keyX + 22, keyY - 14, 3, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.fillStyle = '#000000';
                  ctx.beginPath();
                  ctx.arc(keyX + 22, keyY - 14, 1.2, 0, Math.PI * 2);
                  ctx.fill();

                  // Diagonal 45-degree trace escape line
                  ctx.strokeStyle = colorData.traceColor;
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.moveTo(keyX + 22, keyY - 14);
                  ctx.lineTo(keyX + 28, keyY - 8);
                  ctx.lineTo(keyX + 28, keyY + 8);
                  ctx.stroke();
                }

                uOffset += kWidth;
              });
            });

            // 4. Central Microcontroller (MCU) Chip (e.g. RP2040 / ATmega32U4 QFP package)
            const mcuX = 512;
            const mcuY = 85;
            // MCU chip body
            ctx.fillStyle = '#1c1c1c';
            ctx.fillRect(mcuX - 32, mcuY - 32, 64, 64);
            // Pin 1 indicator dot
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(mcuX - 24, mcuY - 24, 3, 0, Math.PI * 2);
            ctx.fill();
            // MCU chip label
            ctx.fillStyle = '#888888';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('RP2040-B2', mcuX, mcuY - 4);
            ctx.fillText('thockeebs MCU', mcuX, mcuY + 10);

            // QFP Pin Legs on all 4 sides
            const drawPins = (x1, y1, x2, y2, isHoriz) => {
              ctx.strokeStyle = '#cccccc';
              ctx.lineWidth = 2;
              const count = 10;
              for (let i = 0; i < count; i++) {
                const t = (i + 0.5) / count;
                ctx.beginPath();
                if (isHoriz) {
                  const px = x1 + (x2 - x1) * t;
                  ctx.moveTo(px, y1);
                  ctx.lineTo(px, y1 + (y1 < mcuY ? -6 : 6));
                } else {
                  const py = y1 + (y2 - y1) * t;
                  ctx.moveTo(x1, py);
                  ctx.lineTo(x1 + (x1 < mcuX ? -6 : 6), py);
                }
                ctx.stroke();
              }
            };
            drawPins(mcuX - 28, mcuY - 32, mcuX + 28, mcuY - 32, true);
            drawPins(mcuX - 28, mcuY + 32, mcuX + 28, mcuY + 32, true);
            drawPins(mcuX - 32, mcuY - 28, mcuX - 32, mcuY + 28, false);
            drawPins(mcuX + 32, mcuY - 28, mcuX + 32, mcuY + 28, false);

            // 5. USB-C Receptacle pads and power routing
            ctx.fillStyle = colorData.traceColor;
            ctx.fillRect(512 - 25, 6, 50, 14);
            ctx.fillStyle = '#050505';
            ctx.fillRect(512 - 20, 8, 40, 10);

            // USB differential data lines (D+, D-) winding down to MCU
            ctx.strokeStyle = colorData.traceColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(505, 20);
            ctx.lineTo(505, 45);
            ctx.lineTo(495, 53);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(519, 20);
            ctx.lineTo(519, 45);
            ctx.lineTo(529, 53);
            ctx.stroke();

            // 6. Silkscreen Branding & Technical Markings
            ctx.fillStyle = colorData.silkColor;
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('thockeebs CUSTOM PCB V2.0', paddingX + 15, 30);
            ctx.font = '11px monospace';
            ctx.fillText('FR4 TG150 • IMMERSION GOLD (ENIG) • ANSI HOT-SWAP', paddingX + 15, 46);

            ctx.textAlign = 'right';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('DESIGNED IN BANDUNG', 1024 - paddingX - 15, 30);
            ctx.fillText('+5V  GND  USB-C  RESET', 1024 - paddingX - 15, 46);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
          }

          buildStabilizers(layoutData, unitSize) {
            const stabGroup = new THREE.Group();
            const stabData = STABILIZERS[this.specs.stabilizer] || STABILIZERS['durock_v2'];
            const housingHex = parseInt(stabData.color.replace('#', '0x'), 16);
            const wireHex = parseInt(stabData.wireColor.replace('#', '0x'), 16);

            const housingMat = new THREE.MeshStandardMaterial({ color: housingHex, roughness: 0.4 });
            const wireMat = new THREE.MeshStandardMaterial({ color: wireHex, metalness: 0.9, roughness: 0.2 });

            const matrixWidth = layoutData.widthUnit * unitSize;
            const startX = -matrixWidth / 2;
            const rowCount = layoutData.rows.length;

            layoutData.rows.forEach((row, rIdx) => {
              let xOffset = 0;
              const zPos = (rIdx - (rowCount - 1) / 2) * unitSize;

              row.forEach(key => {
                const isVertical2U = Boolean(key.isVertical2U || key.h === 2);
                const keyWidth = (key.w || 1) * unitSize;
                const keyDepth = isVertical2U ? (2 * unitSize) : unitSize;
                const xPos = startX + xOffset + keyWidth / 2;
                const targetZ = isVertical2U ? (zPos + unitSize / 2) : zPos;

                if (isVertical2U) {
                  // Vertical 2U stabilizer (e.g. Numpad + and Numpad Enter)
                  const wireSpan = keyDepth * 0.70;

                  const hGeo = new THREE.BoxGeometry(0.12, 0.16, 0.1);
                  const topH = new THREE.Mesh(hGeo, housingMat);
                  topH.position.set(xPos, 0.52, targetZ - wireSpan / 2);
                  stabGroup.add(topH);

                  const botH = new THREE.Mesh(hGeo, housingMat);
                  botH.position.set(xPos, 0.52, targetZ + wireSpan / 2);
                  stabGroup.add(botH);

                  const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, wireSpan, 8);
                  const wire = new THREE.Mesh(wireGeo, wireMat);
                  wire.position.set(xPos - 0.03, 0.48, targetZ);
                  stabGroup.add(wire);
                } else if (key.w >= 2.0 && !key.isEmpty && !key.isBlocker && !key.isBadge) {
                  // Horizontal stabilizer (e.g. Spacebar, Shift, Backspace, Enter, Numpad 0)
                  const wireSpan = keyWidth * 0.72;

                  const hGeo = new THREE.BoxGeometry(0.1, 0.16, 0.12);
                  const leftH = new THREE.Mesh(hGeo, housingMat);
                  leftH.position.set(xPos - wireSpan / 2, 0.52, zPos);
                  stabGroup.add(leftH);

                  const rightH = new THREE.Mesh(hGeo, housingMat);
                  rightH.position.set(xPos + wireSpan / 2, 0.52, zPos);
                  stabGroup.add(rightH);

                  const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, wireSpan, 8);
                  wireGeo.rotateZ(Math.PI / 2);
                  const wire = new THREE.Mesh(wireGeo, wireMat);
                  wire.position.set(xPos, 0.48, zPos - 0.03);
                  stabGroup.add(wire);
                }
                xOffset += keyWidth;
              });
            });

            this.layers.stabilizers = stabGroup;
            this.group.add(stabGroup);
          }

          buildPlate(layoutData, unitSize, width, depth) {
            const plateGroup = new THREE.Group();
            const plateData = PLATE_MATERIALS[this.specs.plate] || PLATE_MATERIALS['pom'];
            const plateHex = parseInt(plateData.color.replace('#', '0x'), 16);
            const isBrass = this.specs.plate === 'brass';

            const plateMat = new THREE.MeshStandardMaterial({
              color: plateHex,
              roughness: isBrass ? 0.25 : 0.6,
              metalness: isBrass ? 0.9 : 0.15,
              side: THREE.DoubleSide
            });

            const halfW = (width * 0.99) / 2;
            const halfD = (depth * 0.99) / 2;

            const shape = new THREE.Shape();
            shape.moveTo(-halfW, -halfD);
            shape.lineTo(halfW, -halfD);
            shape.lineTo(halfW, halfD);
            shape.lineTo(-halfW, halfD);
            shape.closePath();

            // Create square cutouts (14mm x 14mm in scale = ~0.26 x 0.26) ONLY for real switch sockets
            const matrixWidth = layoutData.widthUnit * unitSize;
            const startX = -matrixWidth / 2;
            const rowCount = layoutData.rows.length;

            layoutData.rows.forEach((row, rIdx) => {
              let xOffset = 0;
              const zPos = (rIdx - (rowCount - 1) / 2) * unitSize;

              row.forEach(key => {
                const isVertical2U = Boolean(key.isVertical2U || key.h === 2);
                const keyWidth = (key.w || 1) * unitSize;
                const xPos = startX + xOffset + keyWidth / 2;
                const targetZ = isVertical2U ? (zPos + unitSize / 2) : zPos;

        if (!key.isEmpty && !key.isBlocker && !key.isCaseBlocker && !key.isBadge && !key.isSoundBadge && !key.isLedPanel) {
          if ((key.canBeReplacedByKnob && this.specs.hasKnob) ||
              (key.canBeReplacedByLcd && this.specs.hasLcd)) {
            xOffset += keyWidth;
            return;
          }

          const cutRadius = 0.13; // 0.26 width/height square cutout
          const holeY = -targetZ; // Since XZ plane maps 3D +Z to 2D -Y after rotateX(-Math.PI / 2)
          const holeX = xPos;

          const hole = new THREE.Path();
          hole.moveTo(holeX - cutRadius, holeY - cutRadius);
          hole.lineTo(holeX + cutRadius, holeY - cutRadius);
          hole.lineTo(holeX + cutRadius, holeY + cutRadius);
          hole.lineTo(holeX - cutRadius, holeY + cutRadius);
          hole.closePath();

          shape.holes.push(hole);
        }
        xOffset += keyWidth;
                });
            });

            const extrudeSettings = {
              depth: 0.03,
              bevelEnabled: false
            };

            const plateGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            plateGeo.rotateX(-Math.PI / 2);

            const plate = new THREE.Mesh(plateGeo, plateMat);
            plate.position.set(0, 0.55, 0);
            plate.receiveShadow = true;
            plate.castShadow = true;
            plateGroup.add(plate);

            this.layers.plate = plateGroup;
            this.group.add(plateGroup);
          }

  createKeycapGeometry(capW, baseCapH, capD, profileKey, rowIdx, rowCount) {
    const rowT = rowCount > 1 ? rowIdx / (rowCount - 1) : 0.5;

    let rowHMult = 1.0;
    let rowTiltAngle = 0;
    let taper = 0.74;
    let dishDepth = 0.016;
    let isSpherical = false;
    let isPuffy = false;
    let cornerSoftness = 0;

    switch (profileKey) {
      case 'sa': {
        // High profile spherical vintage (~16.5mm)
        taper = 0.80;
        dishDepth = 0.038;
        isSpherical = true;
        if (rowT <= 0.22) {
          rowHMult = 1.28;
          rowTiltAngle = 0.22;
        } else if (rowT <= 0.45) {
          rowHMult = 1.10;
          rowTiltAngle = 0.10;
        } else if (rowT <= 0.72) {
          rowHMult = 0.95;
          rowTiltAngle = 0.0;
        } else {
          rowHMult = 1.12;
          rowTiltAngle = -0.20;
        }
        break;
      }
      case 'mt3': {
        // IBM Beamspring deep dish vintage (~15mm)
        taper = 0.77;
        dishDepth = 0.046;
        isSpherical = true;
        if (rowT <= 0.22) {
          rowHMult = 1.25;
          rowTiltAngle = 0.20;
        } else if (rowT <= 0.45) {
          rowHMult = 1.08;
          rowTiltAngle = 0.09;
        } else if (rowT <= 0.72) {
          rowHMult = 0.93;
          rowTiltAngle = 0.0;
        } else {
          rowHMult = 1.10;
          rowTiltAngle = -0.18;
        }
        break;
      }
      case 'oem': {
        // Standard commercial OEM profile (~11.5mm)
        taper = 0.76;
        dishDepth = 0.018;
        isSpherical = false;
        if (rowT <= 0.22) {
          rowHMult = 1.20;
          rowTiltAngle = 0.16;
        } else if (rowT <= 0.45) {
          rowHMult = 1.08;
          rowTiltAngle = 0.08;
        } else if (rowT <= 0.72) {
          rowHMult = 0.95;
          rowTiltAngle = -0.02;
        } else {
          rowHMult = 1.06;
          rowTiltAngle = -0.18;
        }
        break;
      }
      case 'xda': {
        // Uniform flat profile (~9.1mm) with wide spherical cup
        taper = 0.88;
        dishDepth = 0.012;
        isSpherical = true;
        rowHMult = 1.0;
        rowTiltAngle = 0;
        cornerSoftness = 0.012;
        break;
      }
      case 'moa': {
        // Cute chibi marshmallow / mushroom cap (~9.8mm)
        taper = 0.84;
        dishDepth = 0.014;
        isSpherical = true;
        isPuffy = true;
        rowHMult = 1.0;
        rowTiltAngle = 0;
        cornerSoftness = 0.028;
        break;
      }
      case 'cherry':
      default: {
        // Gold standard sculpted cylindrical (~9.4mm)
        taper = 0.74;
        dishDepth = 0.016;
        isSpherical = false;
        if (rowT <= 0.22) {
          rowHMult = 1.16;
          rowTiltAngle = 0.12;
        } else if (rowT <= 0.45) {
          rowHMult = 1.05;
          rowTiltAngle = 0.06;
        } else if (rowT <= 0.72) {
          rowHMult = 0.92;
          rowTiltAngle = -0.01;
        } else {
          rowHMult = 1.04;
          rowTiltAngle = -0.14;
        }
        break;
      }
    }

    const capH = baseCapH * rowHMult;
    const geo = new THREE.BoxGeometry(capW, capH, capD, 8, 4, 8);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    const halfH = capH / 2;

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const normY = (v.y + halfH) / capH;

      // 1. Inward taper from bottom to top
      const currentTaper = (1 - normY) + normY * taper;
      v.x *= currentTaper;
      v.z *= currentTaper;

      // 2. Sculpted Top Dish (Fingertip Cup)
      if (normY > 0.75) {
        const topRatio = (normY - 0.75) / 0.25;
        const nx = v.x / (capW * 0.5 * taper);
        const nz = v.z / (capD * 0.5 * taper);

        if (isSpherical) {
          const rSq = nx * nx + nz * nz;
          if (rSq < 1.0) {
            const scoop = Math.cos(Math.sqrt(rSq) * Math.PI * 0.5);
            v.y -= scoop * dishDepth * topRatio;
          }
        } else {
          const dist = Math.min(1.0, Math.abs(nx));
          const scoop = Math.cos(dist * Math.PI * 0.5);
          v.y -= scoop * dishDepth * topRatio;
        }
      }

      // 3. Puffy convex bulging side walls (MOA)
      if (isPuffy) {
        const bulge = Math.sin(normY * Math.PI) * 0.024;
        v.x += Math.sign(v.x) * bulge;
        v.z += Math.sign(v.z) * bulge;
      }

      // 4. Rounded soft corners (MOA, XDA)
      if (cornerSoftness > 0) {
        const nx = v.x / (capW * 0.5 * taper);
        const nz = v.z / (capD * 0.5 * taper);
        const distFromCenter = Math.hypot(nx, nz);
        if (distFromCenter > 0.85) {
          const pull = (distFromCenter - 0.85) * cornerSoftness * 2.0;
          v.x -= nx * pull;
          v.z -= nz * pull;
        }
      }

      // 5. Ergonomic Row Tilt Angle
      if (rowTiltAngle !== 0) {
        v.y += v.z * Math.sin(rowTiltAngle);
      }

      pos.setXYZ(i, v.x, v.y, v.z);
    }

    geo.computeVertexNormals();
    return { geo, capH };
  }

  buildKeycapsAndSwitches(layoutData, unitSize, animLayer = null) {
    const hasSwitches = Boolean(this.specs.switch);
    const hasKeycaps = Boolean(this.specs.keycapTheme);

    const switchGroup = new THREE.Group();
    const keycapGroup = new THREE.Group();

    const switchData = SWITCHES[this.specs.switch] || SWITCHES['milky_yellow'];
    const switchHousingHex = parseInt(switchData.housingColor.replace('#', '0x'), 16);
    const switchStemHex = parseInt(switchData.stemColor.replace('#', '0x'), 16);

    const switchHousingMat = new THREE.MeshStandardMaterial({ color: switchHousingHex, roughness: 0.35 });
    const switchStemMat = new THREE.MeshStandardMaterial({ color: switchStemHex, roughness: 0.5 });

    const capProfileKey = this.specs.keycapProfile || 'cherry';
    const keycapProfile = KEYCAP_PROFILES[capProfileKey] || KEYCAP_PROFILES['cherry'];
    const heightScale = keycapProfile.heightScale || 1.0;

    const matrixWidth = layoutData.widthUnit * unitSize;
    const startX = -matrixWidth / 2;
    const rowCount = layoutData.rows.length;

    layoutData.rows.forEach((row, rIdx) => {
      let xOffset = 0;
      const zPos = (rIdx - (rowCount - 1) / 2) * unitSize;

      row.forEach((key, kIdx) => {
        const isVertical2U = Boolean(key.isVertical2U || key.h === 2);
        const keyWidth = (key.w || 1) * unitSize;
        const keyDepth = isVertical2U ? (2 * unitSize) : unitSize;
        const xPos = startX + xOffset + keyWidth / 2;
        const targetZ = isVertical2U ? (zPos + unitSize / 2) : zPos;

        if (!key.isEmpty) {
          if ((key.canBeReplacedByKnob && this.specs.hasKnob) ||
            (key.canBeReplacedByLcd && this.specs.hasLcd)) {
            xOffset += keyWidth;
            return;
          }

          // North-facing SMD RGB LED
          const ledGeo = new THREE.PlaneGeometry(0.06, 0.04);
          ledGeo.rotateX(-Math.PI / 2);
          const ledMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const ledMesh = new THREE.Mesh(ledGeo, ledMat);
          ledMesh.position.set(xPos, 0.445, targetZ - 0.07);
          this.group.add(ledMesh);
          this.rgbLedMeshes.push({ mesh: ledMesh, x: xPos, z: targetZ, key: key.code });

          // 1. Build Switch (if switches selected)
          if (hasSwitches) {
            const swMeshGroup = new THREE.Group();
            const targetSwY = 0.58;
            swMeshGroup.position.set(xPos, targetSwY, targetZ);

            const swBaseGeo = new THREE.BoxGeometry(0.26, 0.08, 0.26);
            const swBase = new THREE.Mesh(swBaseGeo, switchHousingMat);
            swMeshGroup.add(swBase);

            const stemGeo = new THREE.BoxGeometry(0.09, 0.12, 0.09);
            const stem = new THREE.Mesh(stemGeo, switchStemMat);
            stem.position.y = 0.06;
            swMeshGroup.add(stem);

            switchGroup.add(swMeshGroup);
            this.switchesMap.set(key.code, swMeshGroup);

            // Animate cascade drop if switches just selected
            if (animLayer === 'switches') {
              const startSwY = targetSwY + 1.2 + rIdx * 0.18 + (kIdx % 3) * 0.05;
              swMeshGroup.position.y = startSwY;
              this.activeAnimations.push({
                group: swMeshGroup,
                startY: startSwY,
                targetY: targetSwY,
                duration: 0.28 + rIdx * 0.05,
                elapsed: 0,
                onComplete: () => {
                  if (kIdx === 0) audioManager.playSwitchSnap();
                }
              });
            }
          }

          // 2. Build Keycap (if keycaps selected)
          if (hasKeycaps) {
            const capW = keyWidth - 0.025;
            const capD = keyDepth - 0.025;
            const baseCapH = keycapProfile.baseH || 0.18;

            const capResult = this.createKeycapGeometry(capW, baseCapH, capD, capProfileKey, rIdx, rowCount);

            if (key.code === 'Escape' && this.specs.artisanKeycap && this.specs.artisanKeycap !== 'none') {
              this.buildArtisanKeycap(xPos, targetZ, this.specs.artisanKeycap, key, keycapGroup, animLayer, rIdx, kIdx, capResult, capProfileKey, capW, capD);
            } else {
              const capGeo = capResult.geo;
              const capH = capResult.capH;
              const capTexture = legendGenerator.getTexture(key, this.specs.keycapTheme);

              const capMatTop = new THREE.MeshStandardMaterial({
                map: capTexture,
                roughness: 0.45,
                metalness: 0.05
              });

              const theme = KEYCAP_THEMES[this.specs.keycapTheme] || KEYCAP_THEMES['botanical'];
              let sideHex = parseInt(theme.alphaBg.replace('#', '0x'), 16);
              if (key.isAccent) sideHex = parseInt(theme.accentBg.replace('#', '0x'), 16);
              else if (key.isSpecial) sideHex = parseInt(theme.modBg.replace('#', '0x'), 16);

              const capMatSide = new THREE.MeshStandardMaterial({
                color: sideHex,
                roughness: 0.5,
                metalness: 0.05
              });

              const capMaterials = [
                capMatSide, capMatSide,
                capMatTop, capMatSide,
                capMatSide, capMatSide
              ];

              const keycapMesh = new THREE.Mesh(capGeo, capMaterials);
              const initialY = 0.58 + 0.05 + capH / 2;
              keycapMesh.position.set(xPos, initialY, targetZ);
              keycapMesh.castShadow = true;
              keycapMesh.receiveShadow = true;

              keycapMesh.userData = {
                code: key.code,
                label: key.label,
                isStabilized: (key.w || 1) >= 2.0 || isVertical2U,
                initialY: initialY,
                isPressed: false
              };

              keycapGroup.add(keycapMesh);
              this.keysMap.set(key.code, keycapMesh);
              this.interactiveMeshes.push(keycapMesh);

              // Animate cascade drop if keycaps just selected
              if (animLayer === 'keycaps') {
                const startCapY = initialY + 1.4 + rIdx * 0.18 + (kIdx % 3) * 0.06;
                keycapMesh.position.y = startCapY;
                this.activeAnimations.push({
                  group: keycapMesh,
                  startY: startCapY,
                  targetY: initialY,
                  duration: 0.32 + rIdx * 0.05,
                  elapsed: 0,
                  onComplete: () => {
                    if (kIdx === 0) audioManager.playKeycapPop();
                  }
                });
              }
            }
          }
        } else {
                  // Spacer or Blocker or Badge
                  if (key.isVerticalOccupied) {
                    // Already occupied by the vertical key from the row above (e.g. + or Enter)
                    xOffset += keyWidth;
                    return;
                  }

                  const colorData = CASE_COLORS[this.specs.caseColor] || CASE_COLORS['black'];
                  const caseHex = parseInt(colorData.hex.replace('#', '0x'), 16);
                  const isAluminum = this.specs.caseMaterial === 'aluminum';
                  const isAcrylic = this.specs.caseMaterial === 'acrylic';

                  const solidBlockerMat = new THREE.MeshStandardMaterial({
                    color: caseHex,
                    roughness: isAluminum ? 0.35 : 0.65,
                    metalness: isAluminum ? 0.75 : 0.1,
                    transparent: isAcrylic,
                    opacity: isAcrylic ? 0.85 : 1.0
                  });

                  const blockerH = 0.26;
                  const blockerY = 0.45 + blockerH / 2; // Sits flush with top bezel rim (y = 0.71)

                  if (key.isLedPanel) {
                    // Lock Indicator Panel on Row 0 above Numpad in 100% layout
                    const badgeW = keyWidth - 0.01;
                    const badgeD = unitSize - 0.01;
                    const badgeGeo = new THREE.BoxGeometry(badgeW, blockerH, badgeD);
                    const badgeMat = new THREE.MeshStandardMaterial({
                      color: 0x141619,
                      roughness: 0.35,
                      metalness: 0.85
                    });
                    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
                    badgeMesh.position.set(xPos, blockerY, zPos);
                    badgeMesh.castShadow = true;
                    badgeMesh.receiveShadow = true;
                    this.group.add(badgeMesh);

                    const ledCanvas = document.createElement('canvas');
                    ledCanvas.width = 256;
                    ledCanvas.height = 64;
                    const lCtx = ledCanvas.getContext('2d');
                    lCtx.fillStyle = '#141619';
                    lCtx.fillRect(0, 0, 256, 64);

                    const leds = [
                      { label: 'NUM', x: 50 },
                      { label: 'CAPS', x: 128 },
                      { label: 'SCROLL', x: 206 }
                    ];
                    leds.forEach(led => {
                      lCtx.fillStyle = '#00f6ff';
                      lCtx.shadowColor = '#00f6ff';
                      lCtx.shadowBlur = 8;
                      lCtx.beginPath();
                      lCtx.arc(led.x, 22, 5, 0, Math.PI * 2);
                      lCtx.fill();
                      lCtx.shadowBlur = 0;

                      lCtx.fillStyle = '#9aa5b5';
                      lCtx.font = 'bold 15px monospace';
                      lCtx.textAlign = 'center';
                      lCtx.fillText(led.label, led.x, 48);
                    });

                    const ledTex = new THREE.CanvasTexture(ledCanvas);
                    const ledPlaneGeo = new THREE.PlaneGeometry(badgeW * 0.92, badgeD * 0.72);
                    ledPlaneGeo.rotateX(-Math.PI / 2);
                    const ledPlaneMat = new THREE.MeshBasicMaterial({ map: ledTex });
                    const ledPlaneMesh = new THREE.Mesh(ledPlaneGeo, ledPlaneMat);
                    ledPlaneMesh.position.set(xPos, blockerY + blockerH / 2 + 0.002, zPos);
                    this.group.add(ledPlaneMesh);

                  } else if (key.isSoundBadge) {
                    // Elegant Soundwave Brass Badge (matches Reference Image 3 for 75% layout)
                    const badgeW = keyWidth - 0.01;
                    const badgeD = unitSize - 0.01;
                    const badgeGeo = new THREE.BoxGeometry(badgeW, blockerH, badgeD);
                    const badgeMat = new THREE.MeshStandardMaterial({
                      color: 0xd4af37,
                      metalness: 0.92,
                      roughness: 0.22
                    });
                    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
                    badgeMesh.position.set(xPos, blockerY, zPos);
                    badgeMesh.castShadow = true;
                    badgeMesh.receiveShadow = true;
                    this.group.add(badgeMesh);

                    const waveCanvas = document.createElement('canvas');
                    waveCanvas.width = 128;
                    waveCanvas.height = 128;
                    const wCtx = waveCanvas.getContext('2d');
                    wCtx.fillStyle = '#b89628';
                    wCtx.fillRect(0, 0, 128, 128);

                    wCtx.strokeStyle = '#3a2b06';
                    wCtx.lineWidth = 6;
                    wCtx.lineCap = 'round';
                    const waveHeights = [20, 45, 75, 95, 60, 85, 40, 20];
                    waveHeights.forEach((h, idx) => {
                      const wx = 20 + idx * 12.5;
                      wCtx.beginPath();
                      wCtx.moveTo(wx, 64 - h / 2);
                      wCtx.lineTo(wx, 64 + h / 2);
                      wCtx.stroke();
                    });

                    const waveTex = new THREE.CanvasTexture(waveCanvas);
                    const wavePlaneGeo = new THREE.PlaneGeometry(badgeW * 0.85, badgeD * 0.85);
                    wavePlaneGeo.rotateX(-Math.PI / 2);
                    const wavePlaneMat = new THREE.MeshBasicMaterial({ map: waveTex });
                    const wavePlaneMesh = new THREE.Mesh(wavePlaneGeo, wavePlaneMat);
                    wavePlaneMesh.position.set(xPos, blockerY + blockerH / 2 + 0.002, zPos);
                    this.group.add(wavePlaneMesh);

                  } else if (key.isBadge) {
                    // Metallic divider badge (e.g. thockeebs logo)
                    const badgeW = keyWidth - 0.01;
                    const badgeD = unitSize - 0.01;
                    const badgeGeo = new THREE.BoxGeometry(badgeW, blockerH, badgeD);
                    const badgeMat = new THREE.MeshStandardMaterial({
                      color: 0xd4af37,
                      metalness: 0.9,
                      roughness: 0.22
                    });
                    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
                    badgeMesh.position.set(xPos, blockerY, zPos);
                    badgeMesh.castShadow = true;
                    badgeMesh.receiveShadow = true;
                    this.group.add(badgeMesh);

                    const badgeLabelCanvas = document.createElement('canvas');
                    badgeLabelCanvas.width = 128;
                    badgeLabelCanvas.height = 32;
                    const bCtx = badgeLabelCanvas.getContext('2d');
                    bCtx.fillStyle = '#b89628';
                    bCtx.fillRect(0, 0, 128, 32);
                    bCtx.fillStyle = '#3a2b06';
                    bCtx.font = 'bold 16px sans-serif';
                    bCtx.textAlign = 'center';
                    bCtx.textBaseline = 'middle';
                    const badgeLabel = (!key.label || key.label === 'KEYCAPY') ? 'thockeebs' : key.label;
                    bCtx.fillText(badgeLabel, 64, 16);

                    const bTex = new THREE.CanvasTexture(badgeLabelCanvas);
                    const bLabelGeo = new THREE.PlaneGeometry(badgeW * 0.65, badgeD * 0.55);
                    bLabelGeo.rotateX(-Math.PI / 2);
                    const bLabelMat = new THREE.MeshBasicMaterial({ map: bTex });
                    const bLabelMesh = new THREE.Mesh(bLabelGeo, bLabelMat);
                    bLabelMesh.position.set(xPos, blockerY + blockerH / 2 + 0.002, zPos);
                    this.group.add(bLabelMesh);

                  } else {
                    // Solid Case Blocker / Top Case Divider
                    const blockerW = keyWidth - 0.005;
                    const blockerD = unitSize - 0.005;
                    const blockerGeo = new THREE.BoxGeometry(blockerW, blockerH, blockerD);
                    const blockerMesh = new THREE.Mesh(blockerGeo, solidBlockerMat);
                    blockerMesh.position.set(xPos, blockerY, zPos);
                    blockerMesh.castShadow = true;
                    blockerMesh.receiveShadow = true;
                    this.group.add(blockerMesh);
                  }
                }

                xOffset += keyWidth;
              });
            });

            if (hasSwitches) {
              this.layers.switches = switchGroup;
              this.group.add(switchGroup);
            }
            if (hasKeycaps) {
              this.layers.keycaps = keycapGroup;
              this.group.add(keycapGroup);
            }
          }

          buildAddons(layoutData, unitSize) {
            if (this.specs.layout !== '75') return;

            const matrixWidth = layoutData.widthUnit * unitSize;
            const startX = -matrixWidth / 2;
            const rowCount = layoutData.rows.length;
            const zPos = -((rowCount - 1) / 2) * unitSize;

            // Find the exact X position of the corner Knob / LCD key in Row 0
            let xOffset = 0;
            let targetX = matrixWidth / 2 - unitSize / 2;
            for (const key of layoutData.rows[0]) {
              const keyWidth = (key.w || 1) * unitSize;
              if (key.canBeReplacedByKnob || key.canBeReplacedByLcd) {
                targetX = startX + xOffset + keyWidth / 2;
                break;
              }
              xOffset += keyWidth;
            }

            if (this.specs.hasKnob) {
              const knobGroup = new THREE.Group();
              knobGroup.position.set(targetX, 0.67, zPos);

              const colorData = CASE_COLORS[this.specs.caseColor] || CASE_COLORS['black'];
              const knobHex = parseInt(colorData.hex.replace('#', '0x'), 16);
              const isAluminum = this.specs.caseMaterial === 'aluminum';

              const knobGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.28, 24);
              const knobMat = new THREE.MeshStandardMaterial({
                color: knobHex,
                roughness: isAluminum ? 0.3 : 0.5,
                metalness: isAluminum ? 0.85 : 0.25
              });
              const knob = new THREE.Mesh(knobGeo, knobMat);
              knob.castShadow = true;
              knobGroup.add(knob);

              const isLightCase = ['white', 'silver', 'ice_blue'].includes(this.specs.caseColor);
              const dotGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.02, 8);
              const dotMat = new THREE.MeshBasicMaterial({ color: isLightCase ? 0x111111 : 0xffffff });
              const dot = new THREE.Mesh(dotGeo, dotMat);
              dot.position.set(0.1, 0.15, 0);
              knobGroup.add(dot);

              this.knobMesh = knobGroup;
              this.group.add(knobGroup);
            } else if (this.specs.hasLcd) {
              const lcdGroup = new THREE.Group();
              lcdGroup.position.set(targetX, 0.68, zPos);

              const bezelGeo = new THREE.BoxGeometry(0.38, 0.18, 0.32);
              const bezelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3 });
              const bezel = new THREE.Mesh(bezelGeo, bezelMat);
              lcdGroup.add(bezel);

              const screenCanvas = document.createElement('canvas');
              screenCanvas.width = 128;
              screenCanvas.height = 96;
              const sCtx = screenCanvas.getContext('2d');

              sCtx.fillStyle = '#0f141c';
              sCtx.fillRect(0, 0, 128, 96);

              sCtx.fillStyle = '#00f6ff';
              sCtx.font = 'bold 18px monospace';
              sCtx.fillText('thockeebs', 20, 32);

              sCtx.fillStyle = '#ff7675';
              sCtx.font = '13px monospace';
              sCtx.fillText('CPU: 42°C', 20, 58);

              sCtx.fillStyle = '#55efc4';
              sCtx.fillText('BAT: 98%', 20, 80);

              const screenTex = new THREE.CanvasTexture(screenCanvas);
              const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });

              const screenGeo = new THREE.PlaneGeometry(0.32, 0.24);
              screenGeo.rotateX(-Math.PI / 2);
              const screen = new THREE.Mesh(screenGeo, screenMat);
              screen.position.y = 0.095;
              lcdGroup.add(screen);

              this.lcdMesh = lcdGroup;
              this.group.add(lcdGroup);
            }
          }

          buildArtisanKeycap(xPos, targetZ, artisanId, key, parentGroup, animLayer, rIdx, kIdx, capResult, capProfileKey, capW, capD) {
            const artisanGroup = new THREE.Group();
            const capH = capResult ? capResult.capH : 0.18;
            const initialY = 0.58 + 0.05 + capH / 2;
            artisanGroup.position.set(xPos, initialY, targetZ);

            const baseGeo = capResult ? capResult.geo : new THREE.BoxGeometry(capW || 0.28, capH, capD || 0.28);

            if (artisanId === 'capybara_mikan') {
              // 1. Capybara head & body shaped conforming to keycap profile!
              const bodyMat = new THREE.MeshStandardMaterial({ color: 0x82542e, roughness: 0.85 });
              const body = new THREE.Mesh(baseGeo, bodyMat);
              body.castShadow = true;
              artisanGroup.add(body);

              // Cute snout
              const snoutGeo = new THREE.BoxGeometry(0.16, 0.10 * (capH / 0.18), 0.10);
              const snoutMat = new THREE.MeshStandardMaterial({ color: 0x5e3717, roughness: 0.8 });
              const snout = new THREE.Mesh(snoutGeo, snoutMat);
              snout.position.set(0, -0.01 * (capH / 0.18), 0.12);
              artisanGroup.add(snout);

              // Nostrils
              const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x1f1105 });
              const nostrilGeo = new THREE.BoxGeometry(0.02, 0.015, 0.01);
              const nostrilL = new THREE.Mesh(nostrilGeo, nostrilMat);
              nostrilL.position.set(-0.035, -0.01 * (capH / 0.18), 0.172);
              const nostrilR = new THREE.Mesh(nostrilGeo, nostrilMat);
              nostrilR.position.set(0.035, -0.01 * (capH / 0.18), 0.172);
              artisanGroup.add(nostrilL);
              artisanGroup.add(nostrilR);

              // Relaxed closed eyes ( ^  ^ )
              const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a0f05 });
              const eyeGeo = new THREE.BoxGeometry(0.04, 0.01, 0.01);
              const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
              eyeL.position.set(-0.065, 0.04 * (capH / 0.18), 0.132);
              const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
              eyeR.position.set(0.065, 0.04 * (capH / 0.18), 0.132);
              artisanGroup.add(eyeL);
              artisanGroup.add(eyeR);

              // Tiny round ears
              const earGeo = new THREE.SphereGeometry(0.028, 8, 8);
              const earMat = new THREE.MeshStandardMaterial({ color: 0x4a2b12, roughness: 0.9 });
              const earL = new THREE.Mesh(earGeo, earMat);
              earL.position.set(-0.11, (capH / 2) - 0.01, -0.04);
              const earR = new THREE.Mesh(earGeo, earMat);
              earR.position.set(0.11, (capH / 2) - 0.01, -0.04);
              artisanGroup.add(earL);
              artisanGroup.add(earR);

              // Vibrant Mikan (Japanese Citrus) perched on top of keycap
              const mikanGeo = new THREE.SphereGeometry(0.046, 12, 12);
              const mikanMat = new THREE.MeshStandardMaterial({ color: 0xff7e00, roughness: 0.35 });
              const mikan = new THREE.Mesh(mikanGeo, mikanMat);
              mikan.position.set(0, (capH / 2) + 0.036, 0);
              mikan.castShadow = true;
              artisanGroup.add(mikan);

              // Tiny green leaf
              const leafGeo = new THREE.ConeGeometry(0.016, 0.035, 4);
              const leafMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.5 });
              const leaf = new THREE.Mesh(leafGeo, leafMat);
              leaf.position.set(0.015, (capH / 2) + 0.08, 0.01);
              leaf.rotation.z = -0.5;
              artisanGroup.add(leaf);

            } else if (artisanId === 'cat_paw') {
              // 2. Silicone Cat Paw base conforming to profile geometry
              const baseMat = new THREE.MeshStandardMaterial({ color: 0xfbfcfe, roughness: 0.45 });
              const base = new THREE.Mesh(baseGeo, baseMat);
              base.castShadow = true;
              artisanGroup.add(base);

              // Pink silicone material
              const beanMat = new THREE.MeshStandardMaterial({ color: 0xff9eb5, roughness: 0.25, metalness: 0.05 });

              // Main palm pad on top surface
              const palmGeo = new THREE.SphereGeometry(0.062, 14, 10);
              const palm = new THREE.Mesh(palmGeo, beanMat);
              palm.scale.set(1.3, 0.45, 1.05);
              palm.position.set(0, (capH / 2) + 0.012, 0.025);
              artisanGroup.add(palm);

              // 4 Toe beans in an arc on top surface
              const beanGeo = new THREE.SphereGeometry(0.025, 10, 8);
              const beanOffsets = [
                [-0.075, (capH / 2) + 0.012, -0.06],
                [-0.026, (capH / 2) + 0.012, -0.085],
                [0.026, (capH / 2) + 0.012, -0.085],
                [0.075, (capH / 2) + 0.012, -0.06]
              ];
              beanOffsets.forEach(pos => {
                const bean = new THREE.Mesh(beanGeo, beanMat);
                bean.scale.set(1.0, 0.4, 1.0);
                bean.position.set(pos[0], pos[1], pos[2]);
                artisanGroup.add(bean);
              });

            } else if (artisanId === 'koi_resin') {
              // 3. Crystal Koi Pond Resin with exact profile keycap geometry
              const resinMat = new THREE.MeshStandardMaterial({
                color: 0xdff3f7,
                roughness: 0.06,
                metalness: 0.05,
                transparent: true,
                opacity: 0.75
              });
              const resinKeycap = new THREE.Mesh(baseGeo, resinMat);
              resinKeycap.castShadow = true;
              artisanGroup.add(resinKeycap);

              // Inner Koi fish body inside resin
              const fishGeo = new THREE.CylinderGeometry(0.020, 0.014, 0.13 * (capH / 0.18), 8);
              const fishMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
              const fish = new THREE.Mesh(fishGeo, fishMat);
              fish.rotation.z = Math.PI / 4;
              fish.position.set(0, 0, 0);
              artisanGroup.add(fish);

              // Orange markings
              const markGeo = new THREE.CylinderGeometry(0.022, 0.018, 0.045 * (capH / 0.18), 8);
              const markMat = new THREE.MeshStandardMaterial({ color: 0xff3b30, roughness: 0.3 });
              const mark = new THREE.Mesh(markGeo, markMat);
              mark.rotation.z = Math.PI / 4;
              mark.position.set(0.015, 0.015 * (capH / 0.18), 0);
              artisanGroup.add(mark);

              // Tail fin
              const finGeo = new THREE.ConeGeometry(0.032, 0.038, 4);
              const finMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b, transparent: true, opacity: 0.8 });
              const fin = new THREE.Mesh(finGeo, finMat);
              fin.position.set(-0.055, -0.04 * (capH / 0.18), 0);
              fin.rotation.z = -Math.PI / 3;
              artisanGroup.add(fin);

              // Water moss at bottom
              const mossGeo = new THREE.SphereGeometry(0.032, 8, 8);
              const mossMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.8 });
              const moss = new THREE.Mesh(mossGeo, mossMat);
              moss.position.set(-0.065, -(capH * 0.35), -0.055);
              artisanGroup.add(moss);

            } else if (artisanId === 'fuji_snow') {
              // 4. Mount Fuji Snow Summit with exact profile keycap base
              const fujiBaseMat = new THREE.MeshStandardMaterial({ color: 0x1e2749, roughness: 0.6 });
              const fujiBase = new THREE.Mesh(baseGeo, fujiBaseMat);
              fujiBase.castShadow = true;
              artisanGroup.add(fujiBase);

              // Snow summit cap on the top dish of the keycap
              const snowGeo = new THREE.BoxGeometry((capW || 0.28) * 0.72, capH * 0.32, (capD || 0.28) * 0.72);
              const snowMat = new THREE.MeshStandardMaterial({ color: 0xf5faff, roughness: 0.25 });
              const snow = new THREE.Mesh(snowGeo, snowMat);
              snow.position.set(0, (capH / 2) - (capH * 0.12), 0);
              artisanGroup.add(snow);

              // Golden sunrise on front
              const sunGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.01, 16);
              sunGeo.rotateX(Math.PI / 2);
              const sunMat = new THREE.MeshStandardMaterial({ color: 0xf39c12, metalness: 0.85, roughness: 0.2 });
              const sun = new THREE.Mesh(sunGeo, sunMat);
              sun.position.set(0, 0, (capD || 0.28) * 0.44);
              artisanGroup.add(sun);
            }

            artisanGroup.userData = {
              code: key.code,
              label: key.label,
              isStabilized: false,
              initialY: initialY,
              isPressed: false,
              artisanType: artisanId
            };

            parentGroup.add(artisanGroup);
            this.keysMap.set(key.code, artisanGroup);
            this.interactiveMeshes.push(artisanGroup);

            if (animLayer === 'keycaps') {
              const startCapY = initialY + 1.4 + rIdx * 0.18 + (kIdx % 3) * 0.06;
              artisanGroup.position.y = startCapY;
              this.activeAnimations.push({
                group: artisanGroup,
                startY: startCapY,
                targetY: initialY,
                duration: 0.32 + rIdx * 0.05,
                elapsed: 0,
                onComplete: () => {
                  if (kIdx === 0) audioManager.playKeycapPop();
                }
              });
            }
          }

          buildCoiledCable(matrixWidth, matrixDepth) {
            const cableGroup = new THREE.Group();
            const cableDef = COILED_CABLES[this.specs.coiledCable] || COILED_CABLES['black_techflex'];
            const cableHex = parseInt(cableDef.cableColor.replace('#', '0x'), 16);
            const aviatorHex = parseInt(cableDef.aviatorColor.replace('#', '0x'), 16);

            const bezel = 0.07;
            const outerD = matrixDepth + bezel * 2;
            // Positioned further back behind keyboard so it is clearly visible from camera view
            const cz = -outerD / 2 - 0.75;
            const deskY = 0.06; // Top of deskmat
            const coilR = 0.075; // Proportional enthusiast coil radius
            const cy = deskY + coilR + 0.01;
            const cableRadius = 0.022;

            // Cable standard material with subtle braided techflex sheen
            const cableMat = new THREE.MeshStandardMaterial({
              color: cableHex,
              roughness: 0.55,
              metalness: 0.22
            });

            // 1. Cable path curve points
            const points = [];
            // USB-C connector into rear of keyboard case
            points.push(new THREE.Vector3(0, 0.34, -outerD / 2));
            points.push(new THREE.Vector3(0, 0.30, -outerD / 2 - 0.15));
            points.push(new THREE.Vector3(0, cy, -outerD / 2 - 0.42));
            points.push(new THREE.Vector3(-0.25, cy, cz));
            points.push(new THREE.Vector3(-0.85, cy, cz));

            // Helix spiral coil
            const turns = 18;
            const steps = turns * 16;
            const coilStartX = -0.85;
            const coilLen = 1.65;

            for (let i = 0; i <= steps; i++) {
              const t = i / steps;
              const angle = t * turns * Math.PI * 2;
              const px = coilStartX + t * coilLen;
              const py = cy + Math.sin(angle) * coilR;
              const pz = cz + Math.cos(angle) * coilR;
              points.push(new THREE.Vector3(px, py, pz));
            }

            const aviatorX = coilStartX + coilLen;
            // Straight extension leading into Aviator connector
            points.push(new THREE.Vector3(aviatorX + 0.10, cy, cz));

            const path = new THREE.CatmullRomCurve3(points);
            const tubeGeo = new THREE.TubeGeometry(path, 220, cableRadius, 10, false);
            const tubeMesh = new THREE.Mesh(tubeGeo, cableMat);
            tubeMesh.castShadow = true;
            tubeMesh.receiveShadow = true;
            cableGroup.add(tubeMesh);

            // USB-C Metal Plug at Keyboard Case Port
            const plugGeo = new THREE.BoxGeometry(0.06, 0.035, 0.08);
            const plugMat = new THREE.MeshStandardMaterial({ color: 0x1f232b, metalness: 0.85, roughness: 0.25 });
            const plugMesh = new THREE.Mesh(plugGeo, plugMat);
            plugMesh.position.set(0, 0.34, -outerD / 2 - 0.04);
            cableGroup.add(plugMesh);

            // 2. GX16 5-Pin Aviator Connector Assembly
            const aviatorGroup = new THREE.Group();
            aviatorGroup.position.set(aviatorX + 0.24, cy, cz);
            aviatorGroup.rotation.z = Math.PI / 2; // Lie along X axis

            const aviatorMat = new THREE.MeshStandardMaterial({
              color: aviatorHex,
              metalness: 0.95,
              roughness: 0.18
            });
            const blackRubberMat = new THREE.MeshStandardMaterial({
              color: 0x111111,
              roughness: 0.85
            });

            // Left rubber strain relief boot
            const bootLGeo = new THREE.CylinderGeometry(0.035, 0.055, 0.07, 16);
            const bootL = new THREE.Mesh(bootLGeo, blackRubberMat);
            bootL.position.y = -0.10;
            aviatorGroup.add(bootL);

            // Male threaded shell
            const shellLGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.07, 16);
            const shellL = new THREE.Mesh(shellLGeo, aviatorMat);
            shellL.position.y = -0.035;
            aviatorGroup.add(shellL);

            // Knurled center lock collar ring
            const ringGeo = new THREE.CylinderGeometry(0.072, 0.072, 0.042, 20);
            const ring = new THREE.Mesh(ringGeo, aviatorMat);
            ring.position.y = 0.02;
            aviatorGroup.add(ring);

            // Female socket body
            const shellRGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.07, 16);
            const shellR = new THREE.Mesh(shellRGeo, aviatorMat);
            shellR.position.y = 0.075;
            aviatorGroup.add(shellR);

            // Right rubber strain relief boot
            const bootRGeo = new THREE.CylinderGeometry(0.055, 0.035, 0.07, 16);
            const bootR = new THREE.Mesh(bootRGeo, blackRubberMat);
            bootR.position.y = 0.145;
            aviatorGroup.add(bootR);

            cableGroup.add(aviatorGroup);

            // 3. Exit straight cable from Aviator heading towards PC / desk edge
            const exitPoints = [
              new THREE.Vector3(aviatorX + 0.40, cy, cz),
              new THREE.Vector3(aviatorX + 0.85, cy, cz - 0.25),
              new THREE.Vector3(aviatorX + 1.55, cy, cz - 0.70),
              new THREE.Vector3(aviatorX + 2.40, cy, cz - 1.20)
            ];
            const exitPath = new THREE.CatmullRomCurve3(exitPoints);
            const exitTubeGeo = new THREE.TubeGeometry(exitPath, 60, cableRadius, 10, false);
            const exitTubeMesh = new THREE.Mesh(exitTubeGeo, cableMat);
            exitTubeMesh.castShadow = true;
            exitTubeMesh.receiveShadow = true;
            cableGroup.add(exitTubeMesh);

            this.layers.cable = cableGroup;
            this.group.add(cableGroup);
          }

          updateRGB(delta, elapsedTime) {
            const rgbMode = this.specs.rgbMode || 'rainbow';
            if (!this.rgbLedMeshes || this.rgbLedMeshes.length === 0) return;

            if (rgbMode === 'off') {
              if (this.underglowMesh) this.underglowMesh.visible = false;
              for (let i = 0; i < this.rgbLedMeshes.length; i++) {
                this.rgbLedMeshes[i].mesh.visible = false;
              }
              return;
            }

            if (this.underglowMesh) this.underglowMesh.visible = true;
            const t = elapsedTime !== undefined ? elapsedTime : (this.timeElapsed += delta);

            if (rgbMode === 'rainbow') {
              const underHue = (t * 0.25) % 1.0;
              if (this.underglowMesh) this.underglowMesh.material.color.setHSL(underHue, 1.0, 0.5);

              for (let i = 0; i < this.rgbLedMeshes.length; i++) {
                const item = this.rgbLedMeshes[i];
                item.mesh.visible = true;
                const hue = ((item.x * 0.8 - item.z * 0.4) + t * 0.35) % 1.0;
                item.mesh.material.color.setHSL((hue + 1.0) % 1.0, 1.0, 0.6);
              }
            } else if (rgbMode === 'warm_amber') {
              const breathe = 0.55 + 0.35 * Math.sin(t * 1.8);
              if (this.underglowMesh) this.underglowMesh.material.color.setRGB(1.0 * breathe, 0.65 * breathe, 0.2 * breathe);
              for (let i = 0; i < this.rgbLedMeshes.length; i++) {
                const item = this.rgbLedMeshes[i];
                item.mesh.visible = true;
                item.mesh.material.color.setRGB(1.0 * breathe, 0.68 * breathe, 0.22 * breathe);
              }
            } else if (rgbMode === 'cyberpunk') {
              const waveT = t * 2.2;
              if (this.underglowMesh) {
                const ugWave = Math.sin(waveT);
                if (ugWave > 0) this.underglowMesh.material.color.setRGB(0, 0.95, 1.0);
                else this.underglowMesh.material.color.setRGB(1.0, 0.05, 0.6);
              }
              for (let i = 0; i < this.rgbLedMeshes.length; i++) {
                const item = this.rgbLedMeshes[i];
                item.mesh.visible = true;
                const wave = Math.sin(item.x * 3.5 + waveT);
                if (wave > 0) item.mesh.material.color.setRGB(0, 0.95, 1.0);
                else item.mesh.material.color.setRGB(1.0, 0.05, 0.65);
              }
            } else if (rgbMode === 'matcha') {
              const waveT = t * 1.5;
              if (this.underglowMesh) this.underglowMesh.material.color.setRGB(0.35, 0.85, 0.48);
              for (let i = 0; i < this.rgbLedMeshes.length; i++) {
                const item = this.rgbLedMeshes[i];
                item.mesh.visible = true;
                const wave = 0.5 + 0.5 * Math.sin(item.x * 2.8 + waveT);
                item.mesh.material.color.setRGB(0.2 + 0.35 * wave, 0.88, 0.4 + 0.4 * wave);
              }
            }
          }

          // Update mounting animations & dynamic RGB
          update(delta, elapsedTime) {
            this.updateRGB(delta, elapsedTime);

            if (this.activeAnimations.length === 0) return;

            for (let i = this.activeAnimations.length - 1; i >= 0; i--) {
              const anim = this.activeAnimations[i];
              anim.elapsed += delta;
              const progress = Math.min(1.0, anim.elapsed / anim.duration);

              // Ease out bounce
              const ease = this.easeOutBounce(progress);
              anim.group.position.y = anim.startY + (anim.targetY - anim.startY) * ease;

              if (progress >= 1.0) {
                anim.group.position.y = anim.targetY;
                if (anim.onComplete) anim.onComplete();
                this.activeAnimations.splice(i, 1);
              }
            }
          }

          easeOutBounce(x) {
            const n1 = 7.5625;
            const d1 = 2.75;
            if (x < 1 / d1) {
              return n1 * x * x;
            } else if (x < 2 / d1) {
              return n1 * (x -= 1.5 / d1) * x + 0.75;
            } else if (x < 2.5 / d1) {
              return n1 * (x -= 2.25 / d1) * x + 0.9375;
            } else {
              return n1 * (x -= 2.625 / d1) * x + 0.984375;
            }
          }

          pressKey(code) {
            const keyMesh = this.keysMap.get(code);
            if (!keyMesh || keyMesh.userData.isPressed) return;

            keyMesh.userData.isPressed = true;
            const travelDistance = 0.08;
            keyMesh.position.y = keyMesh.userData.initialY - travelDistance;

            if (keyMesh.userData.artisanType && keyMesh.userData.artisanType !== 'none') {
              audioManager.playArtisanSound(keyMesh.userData.artisanType);
            } else {
              audioManager.playKeyStroke({
                switchId: this.specs.switch || 'milky_yellow',
                plateId: this.specs.plate || 'pom',
                dampeningLayers: this.specs.dampeningLayers || [],
                isStabilized: keyMesh.userData.isStabilized,
                stabTuning: this.specs.stabTuning || 'fully_tuned',
                keycapProfile: this.specs.keycapProfile || 'cherry'
              });
            }

            // Flash corresponding RGB LED bright white on press
            const ledItem = this.rgbLedMeshes.find(l => l.key === code);
            if (ledItem && this.specs.rgbMode !== 'off') {
              const origHex = ledItem.mesh.material.color.getHex();
              ledItem.mesh.material.color.setHex(0xffffff);
              setTimeout(() => {
                if (ledItem && ledItem.mesh) ledItem.mesh.material.color.setHex(origHex);
              }, 110);
            }

            setTimeout(() => {
              keyMesh.position.y = keyMesh.userData.initialY;
              keyMesh.userData.isPressed = false;
            }, 90);
          }

          rotateKnob(dir = 1) {
            if (this.knobMesh) {
              this.knobMesh.rotation.y += (Math.PI / 12) * dir;
              audioManager.playKeyStroke({
                switchId: 'box_white',
                pitchVariation: 2.2
              });
            }
          }
        }
