// Advanced ASMR Web Audio Synthesizer for Mechanical Keyboard Simulator
// Features per-switch physical acoustic profiles, dampening multipliers,
// stabilizer rattle vs Krytox lube simulation, procedural Lo-Fi ambient music, and workshop SFX.

import { SWITCHES, DAMPENING_LAYERS, PLATE_MATERIALS, STABILIZERS, STAB_TUNING_OPTIONS } from '../data/parts-catalog.js';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.isMuted = false;
    this.isMusicPlaying = false;
    this.noiseBuffer = null;
    this.musicInterval = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this._generateNoiseBuffer();
  }

  _generateNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play keystroke sound using exact current build specs:
  // switchId, plateId, installedDampeners (array of layer IDs), stabId, stabTuningId, isStabilizedKey
  playKeyStroke(options = {}) {
    this.ensureContext();
    if (this.isMuted) return;

    const {
      switchId = 'milky_yellow',
      plateId = 'pom',
      dampeningLayers = [],
      isStabilized = false,
      stabTuning = 'fully_tuned',
      pitchVariation = 1.0,
      keycapProfile = 'cherry'
    } = options;

    const now = this.ctx.currentTime;
    const switchData = SWITCHES[switchId] || SWITCHES['milky_yellow'];
    const plateData = PLATE_MATERIALS[plateId] || PLATE_MATERIALS['pom'];
    const swType = switchData.type || 'linear';

    // 1. Plate acoustic pitch & character
    // Brass (+25% bright clack), Aluminum (+15% crisp), FR4 (+5% balanced), PC (-8% soft), POM (-12% deep thock)
    const platePitch = plateData.pitchMod || 1.0;

    // 2. Keycap profile acoustic chamber resonance
    let profilePitchMod = 1.0;
    let chamberBass = 1.0;
    if (keycapProfile === 'sa' || keycapProfile === 'mt3') {
      profilePitchMod = 0.90; // High profile deep acoustic chamber
      chamberBass = 1.25;
    } else if (keycapProfile === 'moa') {
      profilePitchMod = 0.97;
      chamberBass = 1.08;
    } else if (keycapProfile === 'xda') {
      profilePitchMod = 1.03;
    }

    // Natural random pitch jitter (+-3%) for human realistic typing feel
    const randPitch = (0.97 + Math.random() * 0.06) * pitchVariation * platePitch * profilePitchMod;

    // 3. Dampening filter calculations
    // Dampening reduces case hollowness and tightens decay time
    const dampCount = (dampeningLayers || []).length;
    const marblyPop = dampeningLayers.includes('ixpe_switch_pads');
    const tightDecayMod = Math.max(0.65, 1.0 - dampCount * 0.05);

    // =========================================================================
    // CASE A: SILENT SWITCHES (e.g. Outemu Silent Peach V3)
    // Soft, muffled, rubber-damped mushy thud with zero plastic click
    // =========================================================================
    if (swType === 'silent') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220 * randPitch, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.035);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.04);
      return;
    }

    // =========================================================================
    // CASE B: CLICKY SWITCHES (e.g. Kailh Box White, Box Jade, Cherry MX Blue)
    // Crisp, sharp, bright metallic click snap with zero deep thock muddiness
    // =========================================================================
    if (swType === 'clicky') {
      const isBoxJade = switchId === 'box_jade';
      const isCherryBlue = switchId === 'cherry_blue';

      // 1. Click-Bar / Click-Jacket Mechanical Snap Transient
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = isCherryBlue ? 'bandpass' : 'highpass';
        // Box Jade = thick 0.3mm bar (loud sharp crack 4000Hz), White = 4600Hz, Blue = 2900Hz
        const snapFreq = isBoxJade ? 3800 : isCherryBlue ? 2900 : 4600;
        filter.frequency.setValueAtTime(snapFreq * randPitch, now);
        filter.Q.setValueAtTime(isBoxJade ? 10.0 : 6.5, now);

        const gain = this.ctx.createGain();
        const snapVol = isBoxJade ? 0.95 : isCherryBlue ? 0.72 : 0.78;
        gain.gain.setValueAtTime(snapVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
        noise.stop(now + 0.018);
      }

      // 2. Spring Ping / Mechanism Resonator
      const pingOsc = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      pingOsc.type = 'sawtooth';
      const pingFreq = (isBoxJade ? 1550 : isCherryBlue ? 1200 : 1850) * randPitch;
      pingOsc.frequency.setValueAtTime(pingFreq, now);
      pingOsc.frequency.exponentialRampToValueAtTime(pingFreq * 0.6, now + 0.018);

      pingGain.gain.setValueAtTime(isBoxJade ? 0.32 : 0.20, now);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      pingOsc.connect(pingGain);
      pingGain.connect(this.sfxGain);
      pingOsc.start(now);
      pingOsc.stop(now + 0.022);

      // 3. Crisp bottom-out clack (high-frequency bottoming out)
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      const bodyFilter = this.ctx.createBiquadFilter();

      bodyFilter.type = 'bandpass';
      bodyFilter.frequency.setValueAtTime(620 * randPitch, now);
      bodyFilter.Q.setValueAtTime(3.5, now);

      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(620 * randPitch, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(240, now + 0.038);

      bodyGain.gain.setValueAtTime(0.48, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

      bodyOsc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(this.sfxGain);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.042);

      // Upstroke release sound (subtle click return)
      this._playKeyRelease(now + 0.045, 1200 * randPitch, 0.12);
      return;
    }

    // =========================================================================
    // CASE C: TACTILE SWITCHES (e.g. Boba U4T, Holy Panda, Baby Kangaroo, etc.)
    // Distinct D-bump / snappy tactile bump followed by rich bottom-out
    // =========================================================================
    if (swType === 'tactile') {
      const isBoba = switchId === 'boba_u4t';
      const isPanda = switchId === 'holy_panda';
      const isKangaroo = switchId === 'baby_kangaroo';

      // 1. Pre-travel tactile bump friction snap
      const bumpOsc = this.ctx.createOscillator();
      const bumpGain = this.ctx.createGain();
      const bumpFilter = this.ctx.createBiquadFilter();

      bumpFilter.type = 'bandpass';
      // Holy Panda = bright 680Hz snap; Boba U4T = rounded 380Hz D-bump; Kangaroo = 520Hz
      const bumpFreq = (isBoba ? 380 : isPanda ? 680 : isKangaroo ? 520 : 480) * randPitch;
      bumpFilter.frequency.setValueAtTime(bumpFreq, now);
      bumpFilter.Q.setValueAtTime(4.0, now);

      bumpOsc.type = isPanda ? 'sawtooth' : 'triangle';
      bumpOsc.frequency.setValueAtTime(bumpFreq, now);
      bumpOsc.frequency.exponentialRampToValueAtTime(bumpFreq * 0.7, now + 0.022);

      bumpGain.gain.setValueAtTime(isBoba ? 0.40 : 0.55, now);
      bumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);

      bumpOsc.connect(bumpFilter);
      bumpFilter.connect(bumpGain);
      bumpGain.connect(this.sfxGain);

      bumpOsc.start(now);
      bumpOsc.stop(now + 0.028);

      // 2. Bottom-Out Body Strike
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      const bodyFilter = this.ctx.createBiquadFilter();

      // Boba = deep bassy thock (260Hz); Holy Panda = punchy clacky pop (440Hz)
      const bodyFreq = (isBoba ? 260 : isPanda ? 440 : isKangaroo ? 360 : 380) * randPitch;
      bodyFilter.type = 'lowpass';
      bodyFilter.frequency.setValueAtTime(isBoba ? 1200 : 2200, now);
      bodyFilter.Q.setValueAtTime(isBoba ? 4.0 : 2.5, now);

      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(bodyFreq, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(Math.max(40, bodyFreq * 0.4), now + 0.055 * tightDecayMod);

      const peakGain = (isBoba ? 0.88 * chamberBass : 0.76) * (isStabilized ? 1.2 : 1.0);
      bodyGain.gain.setValueAtTime(peakGain, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055 * tightDecayMod);

      bodyOsc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(this.sfxGain);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.06);

      // 3. Transient plastic impact
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'bandpass';
        nFilter.frequency.setValueAtTime((isPanda ? 2800 : 1800) * randPitch, now);
        nFilter.Q.setValueAtTime(3.0, now);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(isPanda ? 0.38 : 0.25, now);
        nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);
        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(this.sfxGain);
        noise.start(now);
        noise.stop(now + 0.018);
      }

      if (marblyPop) this._playMarblyPop(now, randPitch);
      if (isStabilized) this._playStabRattle(now, stabTuning);
      this._playKeyRelease(now + 0.048, (isBoba ? 700 : 1100) * randPitch, 0.10);
      return;
    }

    // =========================================================================
    // CASE D: LINEAR SWITCHES (Split into Clacky vs Thocky!)
    // =========================================================================
    // Clacky: Tangerine (UHMWPE), Strawberry (PC), NK Cream (POM)
    // Thocky: Oil King (Nylon), Milky Yellow (Nylon), Cherry Black (Vintage), Vertex V1
    const isClacky = switchId === 'tangerine' || switchId === 'strawberry' || switchId === 'nk_cream';
    const isOilKing = switchId === 'oil_king';
    const isTangerine = switchId === 'tangerine';

    if (isClacky) {
      // 1. High-Pitched Stem Strike Transient (Glassy / Popping Clack)
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'bandpass';
        const clackFreq = (isTangerine ? 3400 : switchId === 'strawberry' ? 3000 : 2500) * randPitch;
        nFilter.frequency.setValueAtTime(clackFreq, now);
        nFilter.Q.setValueAtTime(4.0, now);

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.48, now);
        nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(this.sfxGain);
        noise.start(now);
        noise.stop(now + 0.02);
      }

      // 2. Clacky Body Tone (Crisp mids, NOT low bass!)
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      const bodyFilter = this.ctx.createBiquadFilter();

      const bodyFreq = (isTangerine ? 650 : switchId === 'strawberry' ? 580 : 480) * randPitch;
      bodyFilter.type = 'bandpass';
      bodyFilter.frequency.setValueAtTime(bodyFreq, now);
      bodyFilter.Q.setValueAtTime(3.0, now);

      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(bodyFreq, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(bodyFreq * 0.45, now + 0.042 * tightDecayMod);

      bodyGain.gain.setValueAtTime(0.68 * (isStabilized ? 1.2 : 1.0), now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042 * tightDecayMod);

      bodyOsc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(this.sfxGain);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.045);

      if (marblyPop) this._playMarblyPop(now, randPitch);
      if (isStabilized) this._playStabRattle(now, stabTuning);
      this._playKeyRelease(now + 0.042, 1400 * randPitch, 0.12);
      return;
    }

    // Thocky Linear (Oil King, Milky Yellow, Cherry Black, Vertex V1)
    // 1. Deep solid nylon impact
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const nFilter = this.ctx.createBiquadFilter();
      nFilter.type = 'bandpass';
      nFilter.frequency.setValueAtTime((isOilKing ? 1300 : 1600) * randPitch, now);
      nFilter.Q.setValueAtTime(2.5, now);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(isOilKing ? 0.32 : 0.38, now);
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 0.018);
    }

    // 2. Warm resonant Thock Body
    const thockOsc = this.ctx.createOscillator();
    const thockGain = this.ctx.createGain();
    const thockFilter = this.ctx.createBiquadFilter();

    const thockFreq = (isOilKing ? 230 : switchId === 'cherry_black' ? 270 : 320) * randPitch;
    thockFilter.type = 'lowpass';
    thockFilter.frequency.setValueAtTime(1400, now);
    thockFilter.Q.setValueAtTime(3.2, now);

    thockOsc.type = 'triangle';
    thockOsc.frequency.setValueAtTime(thockFreq, now);
    thockOsc.frequency.exponentialRampToValueAtTime(thockFreq * 0.4, now + 0.052 * tightDecayMod);

    const thockVol = (isOilKing ? 0.85 * chamberBass : 0.75) * (isStabilized ? 1.2 : 1.0);
    thockGain.gain.setValueAtTime(thockVol, now);
    thockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.052 * tightDecayMod);

    thockOsc.connect(thockFilter);
    thockFilter.connect(thockGain);
    thockGain.connect(this.sfxGain);
    thockOsc.start(now);
    thockOsc.stop(now + 0.055);

    if (marblyPop) this._playMarblyPop(now, randPitch);
    if (isStabilized) this._playStabRattle(now, stabTuning);
    this._playKeyRelease(now + 0.046, 850 * randPitch, 0.08);
  }

  _playMarblyPop(now, randPitch) {
    if (!this.ctx) return;
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = 'triangle';
    popOsc.frequency.setValueAtTime(2200 * randPitch, now);
    popOsc.frequency.exponentialRampToValueAtTime(800, now + 0.025);

    popGain.gain.setValueAtTime(0.18, now);
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    popOsc.connect(popGain);
    popGain.connect(this.sfxGain);
    popOsc.start(now);
    popOsc.stop(now + 0.03);
  }

  _playKeyRelease(time, freq, gainVal) {
    if (!this.ctx) return;
    const relOsc = this.ctx.createOscillator();
    const relGain = this.ctx.createGain();
    relOsc.type = 'triangle';
    relOsc.frequency.setValueAtTime(freq, time);
    relOsc.frequency.exponentialRampToValueAtTime(freq * 0.6, time + 0.015);

    relGain.gain.setValueAtTime(gainVal, time);
    relGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.015);

    relOsc.connect(relGain);
    relGain.connect(this.sfxGain);
    relOsc.start(time);
    relOsc.stop(time + 0.02);
  }

  _playStabRattle(now, stabTuning) {
    const tuning = STAB_TUNING_OPTIONS[stabTuning] || STAB_TUNING_OPTIONS['stock'];
    if (tuning.rattle > 0.05 && this.noiseBuffer) {
      // High pitched wire rattle/tick
      const rattleSource = this.ctx.createBufferSource();
      rattleSource.buffer = this.noiseBuffer;

      const rattleFilter = this.ctx.createBiquadFilter();
      rattleFilter.type = 'bandpass';
      rattleFilter.frequency.setValueAtTime(3400, now + 0.01);
      rattleFilter.Q.setValueAtTime(6.0, now + 0.01);

      const rattleGain = this.ctx.createGain();
      rattleGain.gain.setValueAtTime(tuning.rattle * 0.35, now + 0.01);
      rattleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      rattleSource.connect(rattleFilter);
      rattleFilter.connect(rattleGain);
      rattleGain.connect(this.sfxGain);

      rattleSource.start(now + 0.01);
      rattleSource.stop(now + 0.045);
    }
  }

  // Workshop SFX: Screwdriver ratcheting
  playScrewSound() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const clickTime = now + i * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400 + i * 200, clickTime);

      gain.gain.setValueAtTime(0.15, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.02);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(clickTime);
      osc.stop(clickTime + 0.025);
    }
  }

  // Workshop SFX: Switch snapping into plate & hotswap socket
  playSwitchSnap() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Workshop SFX: Keycap popping onto MX stem
  playKeycapPop() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.04);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Workshop SFX: Krytox lube brush squish
  playLubeSquish() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.linearRampToValueAtTime(380, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Workshop SFX: Customer reward coins clinking
  playCoins() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [1318.51, 1567.98, 2093.00, 2637.02]; // E6, G6, C7, E7
    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.2);
    });
  }

  // Artisan Keycap Interactive Sound Effects
  playArtisanSound(artisanType) {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;

    if (artisanType === 'capybara_mikan') {
      // Cute playful onsen capybara squeak
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (artisanType === 'cat_paw') {
      // Squishy silicone cat paw blip-pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (artisanType === 'koi_resin') {
      // Crystalline water drop chime
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1480, now);
      osc1.frequency.exponentialRampToValueAtTime(1860, now + 0.04);
      osc1.frequency.exponentialRampToValueAtTime(1240, now + 0.22);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2960, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.26);
      osc2.stop(now + 0.26);
    } else if (artisanType === 'fuji_snow') {
      // Crisp alpine mountain harmonic chime
      const freqs = [880, 1320, 1760];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        const vol = 0.2 / (idx + 1);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.36);
      });
    }
  }

  // Lo-Fi Procedural Ambient Music Player (Warm Rhodes electric piano chords + Deep Bass)
  startLoFiMusic() {
    if (this.isMusicPlaying) return;
    this.ensureContext();
    this.isMusicPlaying = true;

    // Rich Lo-Fi Jazz Progressions: Cmaj9 -> Am9 -> Fmaj7(#11) -> G9/G13 (Warm, dreamy & chill)
    const progressions = [
      {
        root: 130.81, // C3
        chord: [261.63, 329.63, 392.00, 493.88, 587.33] // C4, E4, G4, B4, D5 (Cmaj9)
      },
      {
        root: 110.00, // A2
        chord: [220.00, 261.63, 329.63, 392.00, 493.88] // A3, C4, E4, G4, B4 (Am9)
      },
      {
        root: 87.31,  // F2
        chord: [174.61, 220.00, 261.63, 329.63, 369.99] // F3, A3, C4, E4, F#4 (Fmaj7#11)
      },
      {
        root: 98.00,  // G2
        chord: [196.00, 246.94, 293.66, 349.23, 440.00] // G3, B3, D4, F4, A4 (G9)
      }
    ];

    let chordIdx = 0;
    const playNextChord = () => {
      if (!this.isMusicPlaying || !this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const { root, chord } = progressions[chordIdx % progressions.length];
      chordIdx++;

      // 1. Warm Electric Bass Root Note
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      const bassFilter = this.ctx.createBiquadFilter();

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(450, now);

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(root, now);

      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.musicGain);

      bassOsc.start(now);
      bassOsc.stop(now + 3.4);

      // 2. Lush Rhodes E-Piano Chords (Strummed with slight voice delays & vintage chorus detune)
      chord.forEach((freq, noteIdx) => {
        const noteTime = now + noteIdx * 0.045; // Gentle guitar/piano strum feel

        // Primary body oscillator (Triangle)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator(); // Detuned shimmer for Rhodes vibrato chorus
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        // Warm 1600Hz envelope opening slightly for piano hammer clarity
        filter.frequency.setValueAtTime(1400, noteTime);
        filter.frequency.linearRampToValueAtTime(1800, noteTime + 0.1);
        filter.frequency.exponentialRampToValueAtTime(750, noteTime + 3.0);
        filter.Q.setValueAtTime(1.2, noteTime);

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, noteTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 1.0025, noteTime); // Subtle 4-cent vintage chorus detune

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.22, noteTime + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.3);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc1.start(noteTime);
        osc2.start(noteTime);
        osc1.stop(noteTime + 3.5);
        osc2.stop(noteTime + 3.5);
      });
    };

    playNextChord();
    this.musicInterval = setInterval(playNextChord, 3600);
  }

  setMusicVolume(vol) {
    if (this.musicGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1.0, vol));
      this.musicGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
  }

  stopLoFiMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();
