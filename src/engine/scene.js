// Three.js Scene Setup with High-Fidelity Rendering, Dynamic Camera Transitions, and Lighting
import * as THREE from 'three';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    // Camera targets & positions for dynamic viewpoint switching
    this.cameraViews = {
      workbench: {
        pos: new THREE.Vector3(0, 8.8, 5.6),
        lookAt: new THREE.Vector3(0, -0.2, 0.4)
      },
      counter: {
        pos: new THREE.Vector3(0, 4.2, 11.2),
        lookAt: new THREE.Vector3(0, 1.9, -1.8)
      },
      typing: {
        pos: new THREE.Vector3(0, 6.2, 6.6),
        lookAt: new THREE.Vector3(0, 0.2, 0.8)
      }
    };

    this.currentViewKey = 'workbench';
    this.cameraCurrentPos = this.cameraViews.workbench.pos.clone();
    this.cameraCurrentLookAt = this.cameraViews.workbench.lookAt.clone();

    this.init();
  }

  init() {
    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    // Cozy, bright warm minimalist white studio background
    this.scene.background = new THREE.Color(0xf6f4ef);

    // 2. Camera Setup
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspect = width / height;
    const isMobileLandscape = height < 520 || (aspect > 1.85 && height < 650);
    this.camera = new THREE.PerspectiveCamera(isMobileLandscape ? 53 : 43, aspect, 0.1, 100);
    this.camera.position.copy(this.cameraCurrentPos);
    this.camera.lookAt(this.cameraCurrentLookAt);

    // 3. Lighting Setup
    this.setupLighting();

    // 4. Raycaster & Mouse tracking
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 5. Updatables list
    this.updatables = [];

    // 6. Window resize & orientation change handlers
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.onWindowResize(), 150);
      setTimeout(() => this.onWindowResize(), 400);
    });
  }

  setupLighting() {
    this.isNightMode = false;

    // Ambient light - bright, cozy warm white ambient
    this.ambientLight = new THREE.AmbientLight(0xfff9f2, 1.35);
    this.scene.add(this.ambientLight);

    // Desk Key Light (Soft warm sunlight / studio lamp casting soft shadows)
    this.deskSpot = new THREE.SpotLight(0xfff8ee, 2.5);
    this.deskSpot.position.set(2.5, 9.5, 4.0);
    this.deskSpot.target.position.set(0, 0, 0);
    this.deskSpot.angle = Math.PI / 3.8;
    this.deskSpot.penumbra = 0.65;
    this.deskSpot.castShadow = true;
    this.deskSpot.shadow.mapSize.width = 2048;
    this.deskSpot.shadow.mapSize.height = 2048;
    this.deskSpot.shadow.camera.near = 1;
    this.deskSpot.shadow.camera.far = 20;
    this.deskSpot.shadow.bias = -0.0001;
    this.scene.add(this.deskSpot);
    this.scene.add(this.deskSpot.target);

    // Counter / Customer Warm Ambient Light
    this.customerLight = new THREE.DirectionalLight(0xfff5ea, 1.2);
    this.customerLight.position.set(-3, 6, -3);
    this.customerLight.castShadow = true;
    this.customerLight.shadow.mapSize.width = 1024;
    this.customerLight.shadow.mapSize.height = 1024;
    this.scene.add(this.customerLight);

    // Soft warm fill light
    this.fillLight = new THREE.DirectionalLight(0xfffdfa, 0.85);
    this.fillLight.position.set(-5, 5, 6);
    this.scene.add(this.fillLight);
  }

  setNightMode(isNight) {
    this.isNightMode = Boolean(isNight);
    if (this.isNightMode) {
      this.scene.background = new THREE.Color(0x0c111a);
      this.ambientLight.intensity = 0.28;
      this.ambientLight.color.setHex(0x3a4b60);
      this.deskSpot.intensity = 3.4;
      this.deskSpot.color.setHex(0xffaa55); // Warm golden amber desk spotlight
      this.customerLight.intensity = 0.35;
      this.fillLight.intensity = 0.15;
    } else {
      this.scene.background = new THREE.Color(0xf6f4ef);
      this.ambientLight.intensity = 1.35;
      this.ambientLight.color.setHex(0xfff9f2);
      this.deskSpot.intensity = 2.5;
      this.deskSpot.color.setHex(0xfff8ee);
      this.customerLight.intensity = 1.2;
      this.fillLight.intensity = 0.85;
    }
  }

  toggleNightMode() {
    this.setNightMode(!this.isNightMode);
    return this.isNightMode;
  }

  setCameraView(viewKey, speed = 0.08) {
    if (this.cameraViews[viewKey]) {
      this.currentViewKey = viewKey;
      this.transitionSpeed = speed;
    }
  }

  addUpdatable(obj) {
    this.updatables.push(obj);
  }

  removeUpdatable(obj) {
    const idx = this.updatables.indexOf(obj);
    if (idx !== -1) this.updatables.splice(idx, 1);
  }

  onWindowResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspect = width / height;

    // Adjust vertical FOV dynamically on mobile landscape
    if (height < 520 || (aspect > 1.85 && height < 650)) {
      this.camera.fov = 53;
    } else {
      this.camera.fov = 43;
    }

    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render() {
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth camera transition lerp
    const target = this.cameraViews[this.currentViewKey];
    if (target) {
      this.cameraCurrentPos.lerp(target.pos, 0.06);
      this.cameraCurrentLookAt.lerp(target.lookAt, 0.06);
      this.camera.position.copy(this.cameraCurrentPos);
      this.camera.lookAt(this.cameraCurrentLookAt);
    }

    // Update animations
    for (let i = 0; i < this.updatables.length; i++) {
      if (this.updatables[i].update) {
        this.updatables[i].update(delta, elapsedTime);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.render();
    };
    animate();
  }
}
