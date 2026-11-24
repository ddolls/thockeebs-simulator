// 3D Workshop Environment Model
// Includes wooden workbench, extended deskmat, mouse, and modding tools
// (Screwdriver, Tweezers, Krytox Lube Jar, Brush, Keycap Puller, Switch Puller, Screw Tray)

import * as THREE from 'three';

export class WorkshopRoom {
  constructor() {
    this.group = new THREE.Group();
    this.buildWorkbench();
    this.buildDeskmat();
    this.buildMouse();
    this.buildModdingTools();
    this.buildBackground();
  }

  buildWorkbench() {
    // Solid Scandinavian light oak desk top
    const deskGeo = new THREE.BoxGeometry(16, 0.6, 12);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0xdfcfb8,
      roughness: 0.6,
      metalness: 0.05
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, -0.3, 0);
    desk.receiveShadow = true;
    this.group.add(desk);

    // Warm wooden bevel edge
    const bevelGeo = new THREE.BoxGeometry(16.1, 0.15, 0.15);
    const bevelMat = new THREE.MeshStandardMaterial({ color: 0xcbb598, roughness: 0.5 });
    const bevel = new THREE.Mesh(bevelGeo, bevelMat);
    bevel.position.set(0, 0.02, 5.95);
    this.group.add(bevel);
  }

  buildDeskmat() {
    // Extended XL Deskmat (900mm x 400mm equivalent in scale)
    const matGeo = new THREE.BoxGeometry(12.5, 0.06, 5.6);

    // Create stylish topographical / wave texture on canvas
    const matCanvas = document.createElement('canvas');
    matCanvas.width = 1024;
    matCanvas.height = 512;
    const ctx = matCanvas.getContext('2d');

    // Base dark slate color
    ctx.fillStyle = '#1c1f24';
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle topographical contour lines
    ctx.strokeStyle = '#2b3038';
    ctx.lineWidth = 3;
    for (let r = 80; r < 700; r += 45) {
      ctx.beginPath();
      ctx.arc(512, 256, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Workshop branding logo stamp (small, shifted to the bottom-left corner, no red/blue lines)
    ctx.fillStyle = 'rgba(236, 240, 241, 0.65)';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.fillText('thockeebs CUSTOM WORKSHOP', 120, 485);

    const matTexture = new THREE.CanvasTexture(matCanvas);
    matTexture.colorSpace = THREE.SRGBColorSpace;

    const deskmatMat = new THREE.MeshStandardMaterial({
      map: matTexture,
      roughness: 0.85,
      metalness: 0.05
    });

    const deskmat = new THREE.Mesh(matGeo, deskmatMat);
    deskmat.position.set(0, 0.03, 0.3);
    deskmat.receiveShadow = true;
    this.group.add(deskmat);

    // Stitched deskmat border
    const borderGeo = new THREE.BoxGeometry(12.6, 0.04, 5.7);
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x121417, roughness: 0.9 });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.set(0, 0.015, 0.3);
    this.group.add(border);
  }

  buildMouse() {
    // Ergonomic wireless mouse sitting on right side of deskmat
    const mouseGroup = new THREE.Group();
    mouseGroup.position.set(5.0, 0.12, 0.5);

    // Mouse body
    const bodyGeo = new THREE.BoxGeometry(0.7, 0.28, 1.2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x222428, roughness: 0.4 });
    const mouseBody = new THREE.Mesh(bodyGeo, bodyMat);
    mouseBody.castShadow = true;
    mouseBody.receiveShadow = true;
    mouseGroup.add(mouseBody);

    // Scroll wheel
    const wheelGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x00d2d3, roughness: 0.3, metalness: 0.8 });
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(0, 0.15, -0.28);
    mouseGroup.add(wheel);

    // RGB light strip
    const rgbGeo = new THREE.BoxGeometry(0.72, 0.03, 0.04);
    const rgbMat = new THREE.MeshBasicMaterial({ color: 0x00d2d3 });
    const rgb = new THREE.Mesh(rgbGeo, rgbMat);
    rgb.position.set(0, 0.08, 0.5);
    mouseGroup.add(rgb);

    this.group.add(mouseGroup);
  }

  buildModdingTools() {
    // Tools positioned neatly on deskmat / workbench corners

    // 1. Precision Screwdriver (Obeng)
    const driverGroup = new THREE.Group();
    driverGroup.position.set(-4.8, 0.12, 1.4);
    driverGroup.rotation.y = Math.PI / 7;

    // Handle (Anodized knurled metal)
    const handleGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.1, 16);
    handleGeo.rotateX(Math.PI / 2);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.4, metalness: 0.7 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.castShadow = true;
    driverGroup.add(handle);

    // Shaft (Chrome vanadium)
    const shaftGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.7, 12);
    shaftGeo.rotateX(Math.PI / 2);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xecf0f1, metalness: 0.95, roughness: 0.1 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.set(0, 0, -0.85);
    shaft.castShadow = true;
    driverGroup.add(shaft);

    this.group.add(driverGroup);

    // 2. Curved Stainless Steel Tweezers (Pinset)
    const tweezerGroup = new THREE.Group();
    tweezerGroup.position.set(-4.9, 0.08, 0.3);
    tweezerGroup.rotation.y = -Math.PI / 10;

    const armGeo = new THREE.BoxGeometry(0.04, 0.03, 1.2);
    const tweezerMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, metalness: 0.9, roughness: 0.2 });
    const arm1 = new THREE.Mesh(armGeo, tweezerMat);
    arm1.position.x = -0.025;
    arm1.castShadow = true;
    const arm2 = new THREE.Mesh(armGeo, tweezerMat);
    arm2.position.x = 0.025;
    arm2.castShadow = true;
    tweezerGroup.add(arm1, arm2);
    this.group.add(tweezerGroup);

    // 3. Krytox 205g0 Lube Jar
    const jarGroup = new THREE.Group();
    jarGroup.position.set(-4.6, 0.18, -1.0);

    const jarGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.28, 20);
    const jarMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const jar = new THREE.Mesh(jarGeo, jarMat);
    jar.castShadow = true;
    jarGroup.add(jar);

    // Jar Cap
    const capGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 20);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.16;
    jarGroup.add(cap);
    this.group.add(jarGroup);

    // 4. Lube Brush
    const brushGroup = new THREE.Group();
    brushGroup.position.set(-4.9, 0.08, -1.8);
    brushGroup.rotation.y = Math.PI / 5;

    const brushHandleGeo = new THREE.CylinderGeometry(0.04, 0.03, 1.3, 12);
    brushHandleGeo.rotateX(Math.PI / 2);
    const brushHandleMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: 0.6 });
    const brushHandle = new THREE.Mesh(brushHandleGeo, brushHandleMat);
    brushHandle.castShadow = true;
    brushGroup.add(brushHandle);

    const bristleGeo = new THREE.ConeGeometry(0.045, 0.2, 12);
    bristleGeo.rotateX(-Math.PI / 2);
    const bristleMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const bristle = new THREE.Mesh(bristleGeo, bristleMat);
    bristle.position.set(0, 0, -0.75);
    brushGroup.add(bristle);
    this.group.add(brushGroup);

    // 5. 2-in-1 Keycap & Switch Puller
    const pullerGroup = new THREE.Group();
    pullerGroup.position.set(4.9, 0.1, -1.2);
    pullerGroup.rotation.y = -Math.PI / 8;

    const pullerBodyGeo = new THREE.BoxGeometry(0.2, 0.08, 0.9);
    const pullerBodyMat = new THREE.MeshStandardMaterial({ color: 0x2ed573, roughness: 0.5 });
    const pullerBody = new THREE.Mesh(pullerBodyGeo, pullerBodyMat);
    pullerBody.castShadow = true;
    pullerGroup.add(pullerBody);

    const wireGeo = new THREE.TorusGeometry(0.16, 0.015, 8, 24, Math.PI);
    wireGeo.rotateX(Math.PI / 2);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xecf0f1, metalness: 0.95 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.set(0, 0, -0.55);
    pullerGroup.add(wire);
    this.group.add(pullerGroup);

    // 6. Magnetic Screw Parts Tray
    const trayGeo = new THREE.CylinderGeometry(0.65, 0.55, 0.14, 24);
    const trayMat = new THREE.MeshStandardMaterial({ color: 0x57606f, metalness: 0.8, roughness: 0.3 });
    const tray = new THREE.Mesh(trayGeo, trayMat);
    tray.position.set(4.8, 0.08, 1.8);
    tray.castShadow = true;
    tray.receiveShadow = true;
    this.group.add(tray);
  }

  buildBackground() {
    // Cozy white studio back wall
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.9,
      metalness: 0.02
    });

    const backWallGeo = new THREE.BoxGeometry(28, 14, 0.5);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 6.0, -8.2);
    backWall.receiveShadow = true;
    this.group.add(backWall);

    // Warm minimalist studio floor
    const floorGeo = new THREE.PlaneGeometry(32, 28);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xeae6de,
      roughness: 0.85,
      metalness: 0.05
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.62, 0);
    floor.receiveShadow = true;
    this.group.add(floor);

    // Natural light oak baseboard trim
    const trimGeo = new THREE.BoxGeometry(28.1, 0.35, 0.15);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xdfcfb8, roughness: 0.6 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, -0.45, -7.95);
    this.group.add(trim);

    // Scandinavian warm cream counter partition
    const counterGeo = new THREE.BoxGeometry(16, 2.5, 0.4);
    const counterMat = new THREE.MeshStandardMaterial({ color: 0xeee9df, roughness: 0.65 });
    const counterWall = new THREE.Mesh(counterGeo, counterMat);
    counterWall.position.set(0, 1.25, -7.2);
    counterWall.receiveShadow = true;
    this.group.add(counterWall);

    // Light natural oak display shelf
    const shelfGeo = new THREE.BoxGeometry(12, 0.12, 1.1);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0xd6c2aa, roughness: 0.5 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, 2.5, -7.0);
    shelf.receiveShadow = true;
    this.group.add(shelf);

    // Pastel aesthetic decorative keyboard packaging boxes on shelf
    const boxColors = [0xa8d8ea, 0xaa96da, 0xfcbad3, 0xffffd2, 0xa8e6cf];
    for (let i = 0; i < 5; i++) {
      const boxGeo = new THREE.BoxGeometry(1.6, 0.45, 0.85);
      const boxMat = new THREE.MeshStandardMaterial({ color: boxColors[i], roughness: 0.45 });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.set(-4 + i * 2.0, 2.78, -7.0);
      box.castShadow = true;
      this.group.add(box);
    }
  }
}
