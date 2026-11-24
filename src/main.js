// KeyCapy Main Controller
// Ties Three.js Scene, Customer Avatar, Keyboard Assembly, Order Tracking, Inventory, and UI together

import { SceneManager } from './engine/scene.js';
import { WorkshopRoom } from './models/workshop-room.js';
import { CustomerAvatar } from './models/customer-avatar.js';
import { KeyboardAssembly } from './models/keyboard-assembly.js';
import { audioManager } from './engine/audio.js';
import { inventory } from './game/inventory.js';
import { orderSystem } from './game/order-system.js';
import { AssemblyFlow, ASSEMBLY_STEPS } from './game/assembly-flow.js';
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
  ADDON_ACCESSORIES,
  ARTISAN_KEYCAPS,
  COILED_CABLES,
  RGB_MODES
} from './data/parts-catalog.js';

class GameApp {
  constructor() {
    this.container = document.getElementById('webgl-container');
    this.sceneManager = new SceneManager(this.container);

    // Build Workshop Environment
    this.workshop = new WorkshopRoom();
    this.sceneManager.scene.add(this.workshop.group);

    // Initial Customer & Order
    this.currentCustomer = orderSystem.getCurrentCustomer();
    this.avatar = new CustomerAvatar(this.currentCustomer);
    this.sceneManager.scene.add(this.avatar.group);
    this.sceneManager.addUpdatable(this.avatar);
    this.avatar.startWalk();

    // Initial Keyboard Assembly starts blank or preloaded if mod service
    this.keyboard = new KeyboardAssembly({
      layout: null,
      caseMaterial: null,
      caseColor: null,
      pcb: null,
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
      rgbMode: 'rainbow'
    });
    this.sceneManager.scene.add(this.keyboard.group);
    this.sceneManager.addUpdatable(this.keyboard);

    // Assembly Flow State Machine
    this.flow = new AssemblyFlow(this.sceneManager, this.keyboard, this.avatar);
    const initialReq = this.currentCustomer ? (this.currentCustomer.specs || {}) : {};
    if (this.currentCustomer.orderType === 'mod_service' && this.currentCustomer.initialKeyboardSpecs) {
      this.flow.loadBuild({
        ...this.currentCustomer.initialKeyboardSpecs,
        caseColor: initialReq.caseColor || this.currentCustomer.initialKeyboardSpecs.caseColor,
        pcbColor: initialReq.pcbColor || this.currentCustomer.initialKeyboardSpecs.pcbColor,
        stabTuning: initialReq.stabTuning || this.currentCustomer.initialKeyboardSpecs.stabTuning,
        keycapProfile: initialReq.keycapProfile || this.currentCustomer.initialKeyboardSpecs.keycapProfile
      });
    } else {
      this.flow.resetBuild({
        caseColor: initialReq.caseColor || null,
        pcbColor: initialReq.pcbColor || 'green',
        stabTuning: initialReq.stabTuning || 'fully_tuned',
        keycapProfile: initialReq.keycapProfile || 'cherry'
      });
    }

    this.initUI();
    this.initInputListeners();
    this.initOrientationLock();

    // Start 3D Render Loop
    this.sceneManager.start();

    // Render Initial State
    this.updateHUD();
    this.updateStepUI();

    // Cinematic Video Loading Screen (Customer arrival will be shown once loaded)
    this.initLoadingScreen();
  }

  initOrientationLock() {
    const forceBtn = document.getElementById('force-landscape-btn');
    const tryLockLandscape = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen().catch(() => {});
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen().catch(() => {});
        }
      } catch (e) {}

      try {
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (e) {}

      setTimeout(() => {
        if (this.sceneManager) this.sceneManager.onWindowResize();
      }, 200);
    };

    if (forceBtn) {
      forceBtn.addEventListener('click', tryLockLandscape);
    }

    // Try auto-locking on first touch/interaction on mobile
    const onFirstTouch = () => {
      tryLockLandscape();
      window.removeEventListener('touchstart', onFirstTouch);
      window.removeEventListener('pointerdown', onFirstTouch);
    };
    window.addEventListener('touchstart', onFirstTouch, { passive: true, once: true });
    window.addEventListener('pointerdown', onFirstTouch, { passive: true, once: true });
  }

  initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const isReload = performance.getEntriesByType && performance.getEntriesByType('navigation')[0]?.type === 'reload';
    const alreadyLoaded = sessionStorage.getItem('thockeebs_has_loaded') === 'true';

    // If page is just reloaded or already loaded in this session, skip loading screen completely!
    if (!loadingScreen || isReload || alreadyLoaded) {
      if (loadingScreen) loadingScreen.style.display = 'none';
      sessionStorage.setItem('thockeebs_has_loaded', 'true');
      this.showCustomerArrival();
      return;
    }

    sessionStorage.setItem('thockeebs_has_loaded', 'true');

    const fill = document.getElementById('loading-bar-fill');
    const video = document.getElementById('loading-video');

    if (video) {
      video.play().catch(() => {});
    }

    const steps = [
      { pct: 28, delay: 400 },
      { pct: 58, delay: 1100 },
      { pct: 86, delay: 1900 },
      { pct: 100, delay: 2700 }
    ];

    steps.forEach(({ pct, delay }) => {
      setTimeout(() => {
        if (fill) fill.style.width = `${pct}%`;

        if (pct === 100) {
          setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
              loadingScreen.style.display = 'none';
              this.showCustomerArrival();
            }, 750);
          }, 350);
        }
      }, delay);
    });
  }

  showCustomerArrival() {
    this.sceneManager.setCameraView('counter');

    // Hide left workbench panel and right blueprint panel while customer arrives
    const wbPanel = document.getElementById('workbench-panel');
    const bpPanel = document.getElementById('blueprint-panel');
    const showWbTab = document.getElementById('show-workbench-tab');
    const showBpTab = document.getElementById('show-blueprint-tab');

    if (wbPanel) wbPanel.classList.add('collapsed');
    if (bpPanel) bpPanel.classList.add('collapsed');
    if (showWbTab) showWbTab.style.display = 'none';
    if (showBpTab) showBpTab.style.display = 'none';

    const bubble = document.getElementById('customer-dialogue-bubble');
    if (bubble) {
      const isMod = this.currentCustomer.orderType === 'mod_service';
      const tagEl = bubble.querySelector('.bubble-tag');
      if (tagEl) {
        tagEl.textContent = isMod ? '🛠️ Order Servis & Mod' : 'Pelanggan Tiba';
      }
      document.getElementById('bubble-cust-name').textContent = this.currentCustomer.name;
      document.getElementById('bubble-cust-text').textContent = `“${this.currentCustomer.dialogue}”`;
      const acceptBtn = document.getElementById('bubble-accept-btn');
      if (acceptBtn) {
        acceptBtn.textContent = isMod ? 'Mulai Perbaiki Keyboard Pelanggan!' : 'Mulai Rakit Keyboard Pesanan!';
      }
      bubble.style.display = 'flex';
    }
  }

  showToast(msg) {
    let toast = document.getElementById('game-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'game-toast';
      toast.className = 'game-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  initUI() {
    // 1. Customer Dialogue Speech Bubble Accept
    const acceptBtn = document.getElementById('bubble-accept-btn');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        const bubble = document.getElementById('customer-dialogue-bubble');
        if (bubble) bubble.style.display = 'none';
        this.sceneManager.setCameraView('workbench');

        // Reveal left workbench panel and right blueprint panel
        const wbPanel = document.getElementById('workbench-panel');
        const bpPanel = document.getElementById('blueprint-panel');
        const showWbTab = document.getElementById('show-workbench-tab');
        const showBpTab = document.getElementById('show-blueprint-tab');

        if (wbPanel) wbPanel.classList.remove('collapsed');
        if (bpPanel) bpPanel.classList.remove('collapsed');
        if (showWbTab) showWbTab.style.display = 'none';
        if (showBpTab) showBpTab.style.display = 'none';

        const req = this.currentCustomer ? (this.currentCustomer.specs || {}) : {};
        if (this.currentCustomer.orderType === 'mod_service' && this.currentCustomer.initialKeyboardSpecs) {
          this.flow.loadBuild({
            ...this.currentCustomer.initialKeyboardSpecs,
            caseColor: req.caseColor || this.currentCustomer.initialKeyboardSpecs.caseColor,
            pcbColor: req.pcbColor || this.currentCustomer.initialKeyboardSpecs.pcbColor,
            stabTuning: req.stabTuning || this.currentCustomer.initialKeyboardSpecs.stabTuning,
            keycapProfile: req.keycapProfile || this.currentCustomer.initialKeyboardSpecs.keycapProfile
          });
          this.flow.goToStep(1);
        } else {
          // Reset all highlights and workbench, prefilling customer's requested color/tuning/profile
          this.flow.resetBuild({
            caseColor: req.caseColor || null,
            pcbColor: req.pcbColor || 'green',
            stabTuning: req.stabTuning || 'fully_tuned',
            keycapProfile: req.keycapProfile || 'cherry'
          });
        }
        this.updateStepUI();
      });
    }

    // 1c. Left Workbench Panel Hide/Show Toggles
    const wbPanel = document.getElementById('workbench-panel');
    const showWbTab = document.getElementById('show-workbench-tab');
    const hideWbBtn = document.getElementById('hide-workbench-btn');
    if (hideWbBtn && wbPanel && showWbTab) {
      hideWbBtn.addEventListener('click', () => {
        wbPanel.classList.add('collapsed');
        showWbTab.style.display = 'flex';
      });
      showWbTab.addEventListener('click', () => {
        wbPanel.classList.remove('collapsed');
        showWbTab.style.display = 'none';
      });
    }

    // 1d. Right Blueprint Panel Hide/Show Toggles
    const bpPanel = document.getElementById('blueprint-panel');
    const showBpTab = document.getElementById('show-blueprint-tab');
    if (bpPanel && showBpTab) {
      bpPanel.addEventListener('click', (e) => {
        if (e.target && (e.target.id === 'hide-blueprint-btn' || e.target.closest('#hide-blueprint-btn'))) {
          bpPanel.classList.add('collapsed');
          showBpTab.style.display = 'flex';
        }
      });
      showBpTab.addEventListener('click', () => {
        bpPanel.classList.remove('collapsed');
        showBpTab.style.display = 'none';
      });
    }

    // 2. Audio initialization (Lo-Fi music and SFX ON by default, starts on first user touch/click/press)
    const startAudioOnFirstInteraction = () => {
      audioManager.ensureContext();
      if (!audioManager.isMusicPlaying) {
        audioManager.startLoFiMusic();
      }
      window.removeEventListener('pointerdown', startAudioOnFirstInteraction);
      window.removeEventListener('keydown', startAudioOnFirstInteraction);
    };
    window.addEventListener('pointerdown', startAudioOnFirstInteraction);
    window.addEventListener('keydown', startAudioOnFirstInteraction);

    const lofiBtn = document.getElementById('toggle-lofi-btn');
    if (lofiBtn) {
      lofiBtn.addEventListener('click', () => {
        if (audioManager.isMusicPlaying) {
          audioManager.stopLoFiMusic();
          lofiBtn.textContent = 'Lo-Fi: OFF';
        } else {
          audioManager.startLoFiMusic();
          lofiBtn.textContent = 'Lo-Fi: ON';
        }
      });
    }

    const sfxBtn = document.getElementById('toggle-sfx-btn');
    if (sfxBtn) {
      sfxBtn.addEventListener('click', () => {
        const isMuted = audioManager.toggleMute();
        sfxBtn.textContent = isMuted ? 'Muted' : 'SFX';
      });
    }

    // 3. Step navigation buttons (SINGLE listeners to prevent double advancement)
    document.getElementById('prev-step-btn').addEventListener('click', () => {
      this.flow.prevStep();
      this.updateStepUI();
    });

    document.getElementById('next-step-btn').addEventListener('click', () => {
      if (this.flow.isLastStep()) {
        this.handleHandover();
        return;
      }
      const res = this.flow.nextStep();
      if (!res.ok) {
        this.showToast(res.msg);
        return;
      }
      this.updateStepUI();
    });

    // 4. Shop modal open & close
    const shopModal = document.getElementById('shop-modal');
    document.getElementById('open-shop-btn').addEventListener('click', () => {
      this.renderShopGrid('cases');
      shopModal.style.display = 'flex';
    });
    document.getElementById('close-shop-btn').addEventListener('click', () => {
      shopModal.style.display = 'none';
      this.updateStepUI();
    });

    // Shop category tabs
    document.querySelectorAll('.shop-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        const cat = e.target.getAttribute('data-cat');
        this.renderShopGrid(cat);
      });
    });

    // 5. Handover order button on typing banner
    document.getElementById('handover-btn').addEventListener('click', () => {
      this.handleHandover();
    });

    // 6. Next customer button in result modal
    document.getElementById('next-customer-btn').addEventListener('click', () => {
      document.getElementById('handover-modal').style.display = 'none';
      this.loadNextCustomer();
    });
  }

  initInputListeners() {
    // 1. Raycast mouse clicks on 3D keyboard keys
    this.container.addEventListener('pointerdown', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.sceneManager.mouse.set(x, y);
      this.sceneManager.raycaster.setFromCamera(this.sceneManager.mouse, this.sceneManager.camera);

      const intersects = this.sceneManager.raycaster.intersectObjects(this.keyboard.interactiveMeshes, true);
      if (intersects.length > 0) {
        let hit = intersects[0].object;
        while (hit && !hit.userData.code && hit.parent) {
          hit = hit.parent;
        }
        if (hit && hit.userData && hit.userData.code) {
          this.keyboard.pressKey(hit.userData.code);
          this.appendTypingChar(hit.userData.label || hit.userData.code);
        }
      }
    });

    // 2. Physical keyboard typing event listener
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const code = e.code;
      if (this.keyboard.keysMap.has(code)) {
        this.keyboard.pressKey(code);
        const keyMesh = this.keyboard.keysMap.get(code);
        this.appendTypingChar(keyMesh.userData.label || e.key.toUpperCase());
      }
    });
  }

  appendTypingChar(label) {
    const box = document.getElementById('typing-display-box');
    if (!box) return;
    const placeholder = box.querySelector('.typing-placeholder');
    if (placeholder) placeholder.remove();

    if (box.textContent.length > 40) {
      box.textContent = box.textContent.substring(10);
    }
    box.textContent += ' ' + label;
  }

  updateHUD() {
    // Update coins counter
    const coinsDisplay = document.getElementById('coins-display');
    if (coinsDisplay) coinsDisplay.textContent = `$${inventory.coins}`;

    // Update Persistent Right-Side Blueprint Panel
    const blueprintPanel = document.getElementById('blueprint-panel');
    if (blueprintPanel) {
      blueprintPanel.innerHTML = orderSystem.getPersistentBlueprintHtml(this.flow.currentBuild);

      // Attach Buy All Missing Quest Parts button listener
      const buyQuestBtn = document.getElementById('buy-quest-parts-btn');
      if (buyQuestBtn) {
        buyQuestBtn.onclick = () => {
          const res = orderSystem.buyAllMissingQuestParts();
          this.showToast(res.msg);
          this.updateHUD();
          this.updateStepUI();
        };
      }

      // Allow clicking any stock tag to open matching 🛒Toko category directly
      blueprintPanel.querySelectorAll('.quest-stock.out').forEach(el => {
        el.onclick = (e) => {
          e.stopPropagation();
          const cat = el.getAttribute('data-shop-cat') || 'cases';
          this.openShopWithCategory(cat);
        };
      });

      // Attach click on spec rows to navigate left sidebar directly to the matching step
      blueprintPanel.querySelectorAll('.spec-row[data-step]').forEach(row => {
        row.addEventListener('click', (e) => {
          if (e.target && e.target.closest('.quest-stock.out')) {
            return;
          }
          const stepIdx = parseInt(row.getAttribute('data-step'), 10);
          if (!isNaN(stepIdx)) {
            // Uncollapse left workbench panel if collapsed
            const wbPanel = document.getElementById('workbench-panel');
            const showWbTab = document.getElementById('show-workbench-tab');
            if (wbPanel) wbPanel.classList.remove('collapsed');
            if (showWbTab) showWbTab.style.display = 'none';

            // Navigate flow to step and update UI
            this.flow.goToStep(stepIdx);
            this.updateStepUI();
            this.showToast(`Navigasi ke ${this.flow.getCurrentStep().title}`);
          }
        });
      });
    }
  }

  updateStepUI() {
    const step = this.flow.getCurrentStep();
    const stepIdx = this.flow.currentStepIdx;

    // Header info
    document.getElementById('step-badge').textContent = `STEP ${step.stepNumber} / ${ASSEMBLY_STEPS.length}`;
    document.getElementById('step-title').textContent = step.title;
    document.getElementById('step-desc').textContent = step.desc;

    // Nav button states (do NOT assign onclick here, handled in initUI)
    document.getElementById('prev-step-btn').disabled = stepIdx === 0;
    const nextBtn = document.getElementById('next-step-btn');
    if (stepIdx === ASSEMBLY_STEPS.length - 1) {
      nextBtn.textContent = 'Serahkan Pesanan!';
    } else {
      nextBtn.textContent = `Lanjut Step ${stepIdx + 2} ➔`;
    }

    // Toggle typing banner during Step 7
    const typingBanner = document.getElementById('typing-banner');
    if (step.id === 'typing_test') {
      typingBanner.style.display = 'flex';
      const sw = SWITCHES[this.flow.currentBuild.switch];
      const pl = PLATE_MATERIALS[this.flow.currentBuild.plate];
      document.getElementById('t-switch-name').textContent = sw ? sw.name : (this.flow.currentBuild.switch || 'None');
      document.getElementById('t-plate-name').textContent = pl ? pl.name : (this.flow.currentBuild.plate || 'None');
      document.getElementById('t-damp-count').textContent = `${(this.flow.currentBuild.dampeningLayers || []).length} Layers`;
    } else {
      typingBanner.style.display = 'none';
    }

    // Render interactive step options
    this.renderStepOptions(step.id);
    this.updateHUD();
  }

  renderStepOptions(stepId) {
    const container = document.getElementById('step-options-container');
    container.innerHTML = '';

    const createLabel = (text, marginTop = 0) => {
      const lbl = document.createElement('div');
      lbl.className = 'option-group-label';
      if (marginTop) lbl.style.marginTop = `${marginTop}px`;
      lbl.textContent = text;
      return lbl;
    };

    if (stepId === 'case_prep') {
      // 1. Layout selector
      container.appendChild(createLabel('1. Pilih Form Factor Layout:'));
      const layoutGrid = document.createElement('div');
      layoutGrid.className = 'option-cards-grid';
      ['60', '65', '75', '80', '85', '100'].forEach(lId => {
        const card = document.createElement('div');
        card.className = `opt-card ${this.flow.currentBuild.layout === lId ? 'active' : ''}`;
        card.innerHTML = `
          <div class="opt-title">${lId}% Layout</div>
          <div class="opt-sub">${lId === '60' ? 'ANSI Minimalist' : lId === '65' ? 'Mono 65 V2' : lId === '75' ? 'Exploded 75' : lId === '100' ? 'Mono 100 V2' : 'Mono 80 TKL'}</div>
        `;
        card.onclick = () => {
          this.flow.updateBuildConfig({ layout: lId }, this.flow.currentBuild.caseMaterial ? 'case' : null);
          this.updateStepUI();
        };
        layoutGrid.appendChild(card);
      });
      container.appendChild(layoutGrid);

      // 2. Case Material
      container.appendChild(createLabel('2. Bahan Casing:', 14));
      const matGrid = document.createElement('div');
      matGrid.className = 'option-cards-grid';
      Object.keys(CASE_MATERIALS).forEach(mId => {
        const mat = CASE_MATERIALS[mId];
        const stock = inventory.getStock('case_' + mId);
        const card = document.createElement('div');
        card.className = `opt-card ${this.flow.currentBuild.caseMaterial === mId ? 'active' : ''} ${stock > 0 ? '' : 'out-of-stock'}`;
        card.innerHTML = `
          <div class="opt-title">${mat.name}</div>
          <div class="opt-sub">$${mat.price} • ${mat.weight}</div>
          <div class="opt-stock ${stock > 0 ? '' : 'no-stock'}">Stock: ${stock}</div>
        `;
        card.onclick = () => {
          if (stock <= 0) {
            this.showToast(`Stok ${mat.name} kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.`);
            this.openShopWithCategory('cases');
            return;
          }
          const custColor = this.currentCustomer?.specs?.caseColor;
          const defaultColor = (custColor && mat.colors.includes(custColor))
            ? custColor
            : (mat.colors.includes(this.flow.currentBuild.caseColor) ? this.flow.currentBuild.caseColor : mat.colors[0]);
          this.flow.updateBuildConfig({ caseMaterial: mId, caseColor: defaultColor }, 'case');
          this.updateStepUI();
        };
        matGrid.appendChild(card);
      });
      container.appendChild(matGrid);

      // 3. Colors for chosen material (only shown when material is chosen)
      if (this.flow.currentBuild.caseMaterial) {
        const currMat = CASE_MATERIALS[this.flow.currentBuild.caseMaterial] || CASE_MATERIALS['aluminum'];
        container.appendChild(createLabel('3. Warna Finishing:', 14));
        const colorGrid = document.createElement('div');
        colorGrid.className = 'option-cards-grid';
        currMat.colors.forEach(cId => {
          const col = CASE_COLORS[cId];
          const card = document.createElement('div');
          card.className = `opt-card ${this.flow.currentBuild.caseColor === cId ? 'active' : ''}`;
          card.innerHTML = `
            <div class="opt-title">${col.name}</div>
            <div class="opt-sub"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${col.hex};vertical-align:middle;margin-right:4px;"></span>${col.label}</div>
          `;
          card.onclick = () => {
            this.flow.updateBuildConfig({ caseColor: cId }, 'case');
            this.updateStepUI();
          };
          colorGrid.appendChild(card);
        });
        container.appendChild(colorGrid);
      }

    } else if (stepId === 'dampening_bottom') {
      container.appendChild(createLabel('Pilih Layer Dampening (Hingga 7 Layer):'));
      const dampGrid = document.createElement('div');
      dampGrid.className = 'option-cards-grid';
      dampGrid.style.gridTemplateColumns = '1fr';

      Object.keys(DAMPENING_LAYERS).forEach(dKey => {
        const d = DAMPENING_LAYERS[dKey];
        const stock = inventory.getStock('damp_' + dKey);
        const isInstalled = (this.flow.currentBuild.dampeningLayers || []).includes(dKey);
        const card = document.createElement('div');
        card.className = `opt-card ${isInstalled ? 'active' : ''} ${stock > 0 || isInstalled ? '' : 'out-of-stock'}`;
        card.innerHTML = `
          <div class="opt-title">${d.name} ${isInstalled ? '✓ Terpasang' : ''}</div>
          <div class="opt-sub">${d.desc}</div>
          <div class="opt-stock ${stock > 0 ? '' : 'no-stock'}">Stock: ${stock}</div>
        `;
        card.onclick = () => {
          let layers = [...(this.flow.currentBuild.dampeningLayers || [])];
          if (layers.includes(dKey)) {
            layers = layers.filter(x => x !== dKey);
          } else {
            if (stock <= 0) {
              this.showToast(`Stok ${d.name} kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.`);
              this.openShopWithCategory('dampeners');
              return;
            }
            layers.push(dKey);
          }
          this.flow.updateBuildConfig({ dampeningLayers: layers }, 'dampeners');
          this.updateStepUI();
        };
        dampGrid.appendChild(card);
      });
      container.appendChild(dampGrid);

    } else if (stepId === 'pcb_stabilizers') {
      // 1. PCB Choice
      container.appendChild(createLabel('1. Pilih PCB Board:'));
      const pcbGrid = document.createElement('div');
      pcbGrid.className = 'option-cards-grid';
      Object.keys(PCB_TYPES).forEach(pKey => {
        const pcb = PCB_TYPES[pKey];
        const stock = inventory.getStock('pcb_' + pKey);
        const card = document.createElement('div');
        card.className = `opt-card ${this.flow.currentBuild.pcb === pKey ? 'active' : ''} ${stock > 0 ? '' : 'out-of-stock'}`;
        card.innerHTML = `
          <div class="opt-title">${pcb.name}</div>
          <div class="opt-sub">${pcb.desc}</div>
          <div class="opt-stock ${stock > 0 ? '' : 'no-stock'}">Stock: ${stock}</div>
        `;
        card.onclick = () => {
          if (stock <= 0) {
            this.showToast(`Stok ${pcb.name} kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.`);
            this.openShopWithCategory('pcbs');
            return;
          }
          const custPcbColor = this.currentCustomer?.specs?.pcbColor || this.flow.currentBuild.pcbColor || 'green';
          this.flow.updateBuildConfig({ pcb: pKey, pcbColor: custPcbColor }, 'pcb');
          this.updateStepUI();
        };
        pcbGrid.appendChild(card);
      });
      container.appendChild(pcbGrid);

      // 2. PCB Solder Mask Color Choice (Merah, Hitam, Putih, Hijau, Biru)
      container.appendChild(createLabel('2. Warna PCB Board (Circuit Mask):', 14));
      const pcbColorGrid = document.createElement('div');
      pcbColorGrid.className = 'option-cards-grid';
      Object.keys(PCB_COLORS).forEach(cKey => {
        const col = PCB_COLORS[cKey];
        const card = document.createElement('div');
        const isActive = this.flow.currentBuild.pcbColor === cKey;
        card.className = `opt-card ${isActive ? 'active' : ''}`;
        card.innerHTML = `
          <div class="opt-title">${col.name}</div>
          <div class="opt-sub"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${col.hex};vertical-align:middle;margin-right:4px;border:1px solid rgba(255,255,255,0.3);"></span>${col.desc || col.label}</div>
        `;
        card.onclick = () => {
          this.flow.updateBuildConfig({ pcbColor: cKey }, 'pcb');
          this.updateStepUI();
        };
        pcbColorGrid.appendChild(card);
      });
      container.appendChild(pcbColorGrid);

      // 3. Stabilizers Choice
      container.appendChild(createLabel('3. Stabilizers:', 14));
      const stabGrid = document.createElement('div');
      stabGrid.className = 'option-cards-grid';
      Object.keys(STABILIZERS).forEach(sKey => {
        const stab = STABILIZERS[sKey];
        const stock = inventory.getStock('stab_' + sKey);
        const card = document.createElement('div');
        card.className = `opt-card ${this.flow.currentBuild.stabilizer === sKey ? 'active' : ''} ${stock > 0 ? '' : 'out-of-stock'}`;
        card.innerHTML = `
          <div class="opt-title">${stab.name}</div>
          <div class="opt-sub">${stab.desc}</div>
          <div class="opt-stock ${stock > 0 ? '' : 'no-stock'}">Stock: ${stock}</div>
        `;
        card.onclick = () => {
          if (stock <= 0) {
            this.showToast(`Stok ${stab.name} kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.`);
            this.openShopWithCategory('stabilizers');
            return;
          }
          const custStabTuning = this.currentCustomer?.specs?.stabTuning || this.flow.currentBuild.stabTuning || 'fully_tuned';
          this.flow.updateBuildConfig({ stabilizer: sKey, stabTuning: custStabTuning }, 'stabilizers');
          this.updateStepUI();
        };
        stabGrid.appendChild(card);
      });
      container.appendChild(stabGrid);

      // 4. Stabilizer Tuning / Lube Choice
      if (this.flow.currentBuild.stabilizer) {
        container.appendChild(createLabel('4. Tuning & Lubing Stabilizers:', 14));
        const tuneGrid = document.createElement('div');
        tuneGrid.className = 'option-cards-grid';
        Object.keys(STAB_TUNING_OPTIONS).forEach(tKey => {
          const tune = STAB_TUNING_OPTIONS[tKey];
          const card = document.createElement('div');
          card.className = `opt-card ${this.flow.currentBuild.stabTuning === tKey ? 'active' : ''}`;
          card.innerHTML = `
            <div class="opt-title">${tune.name}</div>
            <div class="opt-sub">${tune.desc}</div>
          `;
          card.onclick = () => {
            this.flow.updateBuildConfig({ stabTuning: tKey }, 'stabilizers');
            this.updateStepUI();
          };
          tuneGrid.appendChild(card);
        });
        container.appendChild(tuneGrid);
      }

    } else if (stepId === 'plate_ixpe') {
      container.appendChild(createLabel('Pilih Bahan Switch Plate:'));
      const plateGrid = document.createElement('div');
      plateGrid.className = 'option-cards-grid';
      Object.keys(PLATE_MATERIALS).forEach(pKey => {
        const pl = PLATE_MATERIALS[pKey];
        const stock = inventory.getStock('plate_' + pKey);
        const card = document.createElement('div');
        card.className = `opt-card ${this.flow.currentBuild.plate === pKey ? 'active' : ''} ${stock > 0 ? '' : 'out-of-stock'}`;
        card.innerHTML = `
          <div class="opt-title">${pl.name}</div>
          <div class="opt-sub">Flex: ${pl.flex} • $${pl.price}</div>
          <div class="opt-stock ${stock > 0 ? '' : 'no-stock'}">Stock: ${stock}</div>
        `;
        card.onclick = () => {
          if (stock <= 0) {
            this.showToast(`Stok ${pl.name} kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.`);
            this.openShopWithCategory('plates');
            return;
          }
          this.flow.updateBuildConfig({ plate: pKey }, 'plate');
          this.updateStepUI();
        };
        plateGrid.appendChild(card);
      });
      container.appendChild(plateGrid);

    } else if (stepId === 'switches_plug') {
      container.appendChild(createLabel('Pilih Switches Mechanical (3-Pin & 5-Pin):'));
      const swGrid = document.createElement('div');
      swGrid.className = 'option-cards-grid';
      Object.keys(SWITCHES).forEach(swKey => {
        const sw = SWITCHES[swKey];
        const stock = inventory.getStock('sw_' + swKey);
        const card = document.createElement('div');
        card.className = `opt-card ${this.flow.currentBuild.switch === swKey ? 'active' : ''} ${stock > 0 ? '' : 'out-of-stock'}`;
        card.innerHTML = `
          <div class="opt-title">${sw.name}</div>
          <div class="opt-sub">${sw.type.toUpperCase()} • ${sw.pins}-Pin • ${sw.force}</div>
          <div class="opt-stock ${stock > 0 ? '' : 'no-stock'}">Stock: ${stock}</div>
        `;
        card.onclick = () => {
          if (stock <= 0) {
            this.showToast(`Stok ${sw.name} kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.`);
            this.openShopWithCategory('switches');
            return;
          }
          this.flow.updateBuildConfig({ switch: swKey }, 'switches');
          this.updateStepUI();
        };
        swGrid.appendChild(card);
      });
      container.appendChild(swGrid);

    } else if (stepId === 'keycaps_addons') {
      // Keycap Theme
      container.appendChild(createLabel('1. Tema Warna Keycaps:'));
      const themeGrid = document.createElement('div');
      themeGrid.className = 'option-cards-grid';
      Object.keys(KEYCAP_THEMES).forEach(tKey => {
        const th = KEYCAP_THEMES[tKey];
        const stock = inventory.getStock('cap_' + tKey);
        const card = document.createElement('div');
        card.className = `opt-card ${this.flow.currentBuild.keycapTheme === tKey ? 'active' : ''} ${stock > 0 ? '' : 'out-of-stock'}`;
        card.innerHTML = `
          <div class="opt-title">${th.name}</div>
          <div class="opt-sub"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${th.alphaBg};vertical-align:middle;margin-right:4px;"></span>$${th.price}</div>
          <div class="opt-stock ${stock > 0 ? '' : 'no-stock'}">Stock: ${stock}</div>
        `;
        card.onclick = () => {
          if (stock <= 0) {
            this.showToast(`Stok ${th.name} kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.`);
            this.openShopWithCategory('keycaps');
            return;
          }
          const custProfile = this.currentCustomer?.specs?.keycapProfile || this.flow.currentBuild.keycapProfile || 'cherry';
          this.flow.updateBuildConfig({
            keycapTheme: tKey,
            keycapProfile: custProfile
          }, 'keycaps');
          this.updateStepUI();
        };
        themeGrid.appendChild(card);
      });
      container.appendChild(themeGrid);

      // Keycap Profile
      if (this.flow.currentBuild.keycapTheme) {
        container.appendChild(createLabel('2. Profile Keycaps:', 14));
        const profGrid = document.createElement('div');
        profGrid.className = 'option-cards-grid';
        Object.keys(KEYCAP_PROFILES).forEach(prKey => {
          const prof = KEYCAP_PROFILES[prKey];
          const card = document.createElement('div');
          card.className = `opt-card ${this.flow.currentBuild.keycapProfile === prKey ? 'active' : ''}`;
          card.innerHTML = `
            <div class="opt-title">${prof.name}</div>
            <div class="opt-sub">${prof.desc}</div>
          `;
          card.onclick = () => {
            this.flow.updateBuildConfig({ keycapProfile: prKey }, 'keycaps');
            this.updateStepUI();
          };
          profGrid.appendChild(card);
        });
        container.appendChild(profGrid);
      }

      // 3. 3D Artisan Keycap (ESC Key)
      container.appendChild(createLabel('3. 3D Artisan Keycap (ESC Key):', 14));
      const artisanGrid = document.createElement('div');
      artisanGrid.className = 'option-cards-grid';
      Object.keys(ARTISAN_KEYCAPS).forEach(aKey => {
        const art = ARTISAN_KEYCAPS[aKey];
        const isNone = aKey === 'none';
        const stock = isNone ? 999 : inventory.getStock('artisan_' + aKey);
        const isSelected = this.flow.currentBuild.artisanKeycap === aKey;
        const card = document.createElement('div');
        card.className = `opt-card ${isSelected ? 'active' : ''} ${stock > 0 || isSelected ? '' : 'out-of-stock'}`;
        card.innerHTML = `
          <div class="opt-title">${art.name}</div>
          <div class="opt-sub">${art.desc}</div>
          ${!isNone ? `<div class="opt-stock ${stock > 0 ? '' : 'no-stock'}">Stock: ${stock}</div>` : ''}
        `;
        card.onclick = () => {
          if (!isNone && stock <= 0 && !isSelected) {
            this.showToast(`Stok ${art.name} kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.`);
            this.openShopWithCategory('artisans');
            return;
          }
          this.flow.updateBuildConfig({ artisanKeycap: aKey }, 'keycaps');
          this.updateStepUI();
        };
        artisanGrid.appendChild(card);
      });
      container.appendChild(artisanGrid);

      // 4. Custom Coiled Cable & Aviator GX16
      container.appendChild(createLabel('4. Custom Coiled Cable & Aviator GX16:', 14));
      const cableGrid = document.createElement('div');
      cableGrid.className = 'option-cards-grid';
      Object.keys(COILED_CABLES).forEach(cKey => {
        const cb = COILED_CABLES[cKey];
        const stock = inventory.getStock('cable_' + cKey);
        const isSelected = this.flow.currentBuild.coiledCable === cKey;
        const card = document.createElement('div');
        card.className = `opt-card ${isSelected ? 'active' : ''} ${stock > 0 || isSelected ? '' : 'out-of-stock'}`;
        card.innerHTML = `
          <div class="opt-title">${cb.name}</div>
          <div class="opt-sub"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${cb.cableColor};vertical-align:middle;margin-right:4px;"></span>$${cb.price} • ${cb.desc}</div>
          <div class="opt-stock ${stock > 0 ? '' : 'no-stock'}">Stock: ${stock}</div>
        `;
        card.onclick = () => {
          if (stock <= 0 && !isSelected) {
            this.showToast(`Stok ${cb.name} kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.`);
            this.openShopWithCategory('cables');
            return;
          }
          this.flow.updateBuildConfig({ coiledCable: cKey });
          this.updateStepUI();
        };
        cableGrid.appendChild(card);
      });
      container.appendChild(cableGrid);

      // 5. Addons for 75%
      if (this.flow.currentBuild.layout === '75') {
        container.appendChild(createLabel('5. Corner Addon (Khusus 75%):', 14));
        const addGrid = document.createElement('div');
        addGrid.className = 'option-cards-grid';

        const knobStock = inventory.getStock('addon_rotary_knob');
        const knobCard = document.createElement('div');
        knobCard.className = `opt-card ${this.flow.currentBuild.hasKnob ? 'active' : ''} ${knobStock > 0 || this.flow.currentBuild.hasKnob ? '' : 'out-of-stock'}`;
        knobCard.innerHTML = `
          <div class="opt-title">Rotary Knob</div>
          <div class="opt-sub">Volume & Zoom</div>
          <div class="opt-stock ${knobStock > 0 ? '' : 'no-stock'}">Stock: ${knobStock}</div>
        `;
        knobCard.onclick = () => {
          if (!this.flow.currentBuild.hasKnob && knobStock <= 0) {
            this.showToast('Stok Rotary Knob kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.');
            this.openShopWithCategory('addons');
            return;
          }
          this.flow.updateBuildConfig({ hasKnob: !this.flow.currentBuild.hasKnob, hasLcd: false }, 'addons');
          this.updateStepUI();
        };

        const lcdStock = inventory.getStock('addon_tft_lcd');
        const lcdCard = document.createElement('div');
        lcdCard.className = `opt-card ${this.flow.currentBuild.hasLcd ? 'active' : ''} ${lcdStock > 0 || this.flow.currentBuild.hasLcd ? '' : 'out-of-stock'}`;
        lcdCard.innerHTML = `
          <div class="opt-title">TFT Screen</div>
          <div class="opt-sub">GIF & Temp Display</div>
          <div class="opt-stock ${lcdStock > 0 ? '' : 'no-stock'}">Stock: ${lcdStock}</div>
        `;
        lcdCard.onclick = () => {
          if (!this.flow.currentBuild.hasLcd && lcdStock <= 0) {
            this.showToast('Stok TFT Screen kamu habis (0)! Silakan beli di 🛒Toko terlebih dahulu.');
            this.openShopWithCategory('addons');
            return;
          }
          this.flow.updateBuildConfig({ hasLcd: !this.flow.currentBuild.hasLcd, hasKnob: false }, 'addons');
          this.updateStepUI();
        };

        addGrid.appendChild(knobCard);
        addGrid.appendChild(lcdCard);
        container.appendChild(addGrid);
      }
    }
  }

  openShopWithCategory(category = 'cases') {
    const shopModal = document.getElementById('shop-modal');
    if (!shopModal) return;
    document.querySelectorAll('.shop-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-cat') === category);
    });
    this.renderShopGrid(category);
    shopModal.style.display = 'flex';
  }

  renderShopGrid(category) {
    const grid = document.getElementById('shop-grid');
    grid.innerHTML = '';

    let items = [];
    if (category === 'cases') {
      Object.keys(CASE_MATERIALS).forEach(mId => {
        const m = CASE_MATERIALS[mId];
        items.push({ id: `case_${mId}`, name: m.name, desc: m.desc, price: m.price, rawId: mId });
      });
    } else if (category === 'pcbs') {
      Object.keys(PCB_TYPES).forEach(pId => {
        const p = PCB_TYPES[pId];
        items.push({ id: `pcb_${pId}`, name: p.name, desc: p.desc, price: p.price, rawId: pId });
      });
    } else if (category === 'dampeners') {
      Object.keys(DAMPENING_LAYERS).forEach(dId => {
        const d = DAMPENING_LAYERS[dId];
        items.push({ id: `damp_${dId}`, name: d.name, desc: d.desc, price: d.price, rawId: dId });
      });
    } else if (category === 'plates') {
      Object.keys(PLATE_MATERIALS).forEach(plId => {
        const pl = PLATE_MATERIALS[plId];
        items.push({ id: `plate_${plId}`, name: pl.name, desc: pl.desc, price: pl.price, rawId: plId });
      });
    } else if (category === 'stabilizers') {
      Object.keys(STABILIZERS).forEach(sId => {
        const s = STABILIZERS[sId];
        items.push({ id: `stab_${sId}`, name: s.name, desc: s.desc, price: s.price, rawId: sId });
      });
    } else if (category === 'switches') {
      Object.keys(SWITCHES).forEach(swId => {
        const sw = SWITCHES[swId];
        items.push({ id: `sw_${swId}`, name: `${sw.name} (Pack 90)`, desc: `${sw.type.toUpperCase()} • ${sw.force} • ${sw.pins}-Pin. ${sw.desc}`, price: sw.price, rawId: swId });
      });
    } else if (category === 'keycaps') {
      Object.keys(KEYCAP_THEMES).forEach(tId => {
        const t = KEYCAP_THEMES[tId];
        items.push({ id: `cap_${tId}`, name: `${t.name} Base Kit`, desc: 'Full 140-key ANSI/ISO keycap set with Japanese sub-legends.', price: t.price, rawId: tId });
      });
    } else if (category === 'artisans') {
      Object.keys(ARTISAN_KEYCAPS).forEach(aId => {
        if (aId === 'none') return;
        const a = ARTISAN_KEYCAPS[aId];
        items.push({ id: `artisan_${aId}`, name: a.name, desc: a.desc, price: a.price, rawId: aId });
      });
    } else if (category === 'cables') {
      Object.keys(COILED_CABLES).forEach(cId => {
        const c = COILED_CABLES[cId];
        items.push({ id: `cable_${cId}`, name: c.name, desc: c.desc, price: c.price, rawId: cId });
      });
    } else if (category === 'addons') {
      Object.keys(ADDON_ACCESSORIES).forEach(aId => {
        const a = ADDON_ACCESSORIES[aId];
        items.push({ id: `addon_${aId}`, name: a.name, desc: a.desc, price: a.price, rawId: aId });
      });
    }

    const activeCust = orderSystem.getCurrentCustomer();
    const req = activeCust ? activeCust.specs : null;

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      const stockCount = inventory.getStock(item.id);

      // Check if this item is requested by active customer quest
      const isService = activeCust && activeCust.orderType === 'mod_service';
      const initSpecs = (isService && activeCust.initialKeyboardSpecs) ? activeCust.initialKeyboardSpecs : {};
      let isQuestItem = false;
      if (req) {
        if (category === 'cases' && item.rawId === req.caseMaterial && (!isService || initSpecs.caseMaterial !== req.caseMaterial)) isQuestItem = true;
        else if (category === 'pcbs' && item.rawId === req.pcb && (!isService || initSpecs.pcb !== req.pcb)) isQuestItem = true;
        else if (category === 'dampeners' && req.dampeningLayers.includes(item.rawId) && (!isService || !(initSpecs.dampeningLayers || []).includes(item.rawId))) isQuestItem = true;
        else if (category === 'plates' && item.rawId === req.plate && (!isService || initSpecs.plate !== req.plate)) isQuestItem = true;
        else if (category === 'stabilizers' && item.rawId === req.stabilizer && (!isService || initSpecs.stabilizer !== req.stabilizer)) isQuestItem = true;
        else if (category === 'switches' && item.rawId === req.switch && (!isService || initSpecs.switch !== req.switch)) isQuestItem = true;
        else if (category === 'keycaps' && item.rawId === req.keycapTheme && (!isService || initSpecs.keycapTheme !== req.keycapTheme)) isQuestItem = true;
        else if (category === 'artisans' && item.rawId === req.artisanKeycap && (!isService || initSpecs.artisanKeycap !== req.artisanKeycap)) isQuestItem = true;
        else if (category === 'cables' && item.rawId === req.coiledCable && (!isService || initSpecs.coiledCable !== req.coiledCable)) isQuestItem = true;
        else if (category === 'addons') {
          if (item.rawId === 'rotary_knob' && req.hasKnob && (!isService || !initSpecs.hasKnob)) isQuestItem = true;
          if (item.rawId === 'tft_lcd' && req.hasLcd && (!isService || !initSpecs.hasLcd)) isQuestItem = true;
        }
      }

      if (isQuestItem) {
        card.classList.add('quest-target');
      }

      card.innerHTML = `
        ${isQuestItem ? `<div class="shop-quest-tag">★ ${isService ? 'DIBUTUHKAN REPARASI' : 'DIBUTUHKAN PESANAN'}</div>` : ''}
        <div class="shop-card-name">${item.name}</div>
        <div class="shop-card-desc">${item.desc}</div>
        <div class="shop-card-footer">
          <div>
            <div class="shop-price">$${item.price}</div>
            <div class="shop-stock-count">Stok Kamu: ${stockCount}</div>
          </div>
          <div style="display:flex;gap:6px;">
            ${stockCount > 0 ? `<button class="shop-sell-btn" data-id="${item.id}" data-price="${item.price}" title="Jual kembali jika salah beli">Jual (+$${item.price})</button>` : ''}
            <button class="shop-buy-btn" data-id="${item.id}" data-price="${item.price}">Beli Part</button>
          </div>
        </div>
      `;

      card.querySelector('.shop-buy-btn').addEventListener('click', () => {
        const bought = inventory.buyItem(item.id, item.price, 1);
        if (bought) {
          this.updateHUD();
          this.updateStepUI();
          this.renderShopGrid(category);
        } else {
          this.showToast('Budget koin tidak cukup untuk membeli part ini di 🛒Toko!');
        }
      });

      const sellBtn = card.querySelector('.shop-sell-btn');
      if (sellBtn) {
        sellBtn.addEventListener('click', () => {
          const sold = inventory.sellItem(item.id, item.price, 1);
          if (sold) {
            this.updateHUD();
            this.updateStepUI();
            this.renderShopGrid(category);
          }
        });
      }

      grid.appendChild(card);
    });
  }

  handleHandover() {
    const res = this.flow.handoverOrder();
    const modal = document.getElementById('handover-modal');

    if (res.success) {
      // Immediately reset workbench and all sidebar highlights upon successful order
      this.flow.resetBuild();
      const typingBox = document.getElementById('typing-display-box');
      if (typingBox) {
        typingBox.innerHTML = '<span class="typing-placeholder">Mulai mengetik di sini untuk mendengar suara switches...</span>';
      }
    }

    document.getElementById('result-rank').textContent = res.rank;
    document.getElementById('result-title').textContent = res.success
      ? `Hasil Rakitan ${res.rank} Rank!`
      : `Hasil Kurang Pas (${res.score}%)`;

    document.getElementById('result-subtitle').textContent = res.success
      ? `Pelanggan sangat senang dengan performa suara keyboard racikanmu!`
      : `Pelanggan meminta beberapa spesifikasi diperbaiki agar sesuai pesanan.`;

    const detailsBox = document.getElementById('result-details-box');
    detailsBox.innerHTML = '';
    (res.details || []).forEach(d => {
      const row = document.createElement('div');
      row.className = `result-detail-row ${d.match ? 'success' : 'fail'}`;
      row.innerHTML = `
        <span>${d.label}:</span>
        <span>${d.match ? '✓ Cocok' : `✗ Harusnya ${d.expected}`}</span>
      `;
      detailsBox.appendChild(row);
    });

    document.getElementById('result-total-payout').textContent = res.success ? `+$${res.payout}` : '$0';
    document.getElementById('result-tip').textContent = res.success ? `+$${res.tip}` : '$0';

    modal.style.display = 'flex';
    this.updateHUD();
  }

  loadNextCustomer() {
    // Generate next customer
    this.currentCustomer = orderSystem.nextCustomer();

    // Replace avatar
    this.sceneManager.scene.remove(this.avatar.group);
    this.sceneManager.removeUpdatable(this.avatar);

    this.avatar = new CustomerAvatar(this.currentCustomer);
    this.sceneManager.scene.add(this.avatar.group);
    this.sceneManager.addUpdatable(this.avatar);
    this.avatar.startWalk();

    // Reset build and prefill customer requested attributes
    const req = this.currentCustomer ? (this.currentCustomer.specs || {}) : {};
    if (this.currentCustomer.orderType === 'mod_service' && this.currentCustomer.initialKeyboardSpecs) {
      this.flow.loadBuild({
        ...this.currentCustomer.initialKeyboardSpecs,
        caseColor: req.caseColor || this.currentCustomer.initialKeyboardSpecs.caseColor,
        pcbColor: req.pcbColor || this.currentCustomer.initialKeyboardSpecs.pcbColor,
        stabTuning: req.stabTuning || this.currentCustomer.initialKeyboardSpecs.stabTuning,
        keycapProfile: req.keycapProfile || this.currentCustomer.initialKeyboardSpecs.keycapProfile
      });
      this.flow.goToStep(1);
    } else {
      this.flow.resetBuild({
        caseColor: req.caseColor || null,
        pcbColor: req.pcbColor || 'green',
        stabTuning: req.stabTuning || 'fully_tuned',
        keycapProfile: req.keycapProfile || 'cherry'
      });
    }

    this.updateStepUI();
    this.showCustomerArrival();
  }
}

// Start game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.app = new GameApp();
});
