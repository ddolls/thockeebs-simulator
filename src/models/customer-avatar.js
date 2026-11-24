// 3D Procedural Customer Animal Avatar
// Supports 10 completely unique, distinct animal morphologies:
// Capybara, Penguin, Bunny, Calico Cat, Shiba Inu, Kitsune Fox, Bear Cub, Red Panda, Sea Otter, and Puff Hamster.
// Features species-specific bodies, heads, snouts/beaks, ears, tails, limbs/flippers, and animated tail wag/flipper flap.

import * as THREE from 'three';

export class CustomerAvatar {
  constructor(customerData) {
    this.data = customerData;
    this.group = new THREE.Group();

    // Animation state
    this.isWalking = false;
    this.walkProgress = 0;
    this.walkStart = new THREE.Vector3(0, 0.4, -6.5);
    this.walkTarget = new THREE.Vector3(0, 0.4, -2.8);
    this.isCelebrating = false;
    this.celebrateTime = 0;

    this.group.position.copy(this.walkStart);

    this.buildAvatar();
  }

  buildAvatar() {
    const app = this.data.appearance;
    const speciesId = app.speciesId || 'capybara';
    const bodyColor = parseInt(app.bodyColor.replace('#', '0x'), 16);
    const snoutColor = parseInt(app.snoutColor.replace('#', '0x'), 16);
    const earColor = parseInt(app.earColor.replace('#', '0x'), 16);

    // Common standard materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.8 });
    const snoutMat = new THREE.MeshStandardMaterial({ color: snoutColor, roughness: 0.8 });
    const earMat = new THREE.MeshStandardMaterial({ color: earColor, roughness: 0.8 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.8 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xffa8a8, roughness: 0.7 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xff793f, roughness: 0.6 });

    // 1. Species-Specific Torso / Body
    this.buildBody(speciesId, bodyMat, snoutMat, whiteMat, darkMat);

    // 2. Species-Specific Head & Cheeks
    this.buildHead(speciesId, bodyMat, snoutMat, whiteMat);

    // 3. Species-Specific Muzzle / Snout / Beak
    this.buildMuzzleOrBeak(speciesId, bodyMat, snoutMat, whiteMat, pinkMat, beakMat);

    // 4. Species-Specific Ears
    this.buildEars(speciesId, earMat, bodyMat, whiteMat, pinkMat);

    // 5. Species-Specific Eyes & Facial Markings
    this.buildEyes(speciesId, whiteMat);

    // 6. Species-Specific Limbs / Wings / Flippers
    this.buildLimbs(speciesId, bodyMat, whiteMat, darkMat, beakMat);

    // 7. Species-Specific Tail
    this.buildTail(speciesId, bodyMat, whiteMat, darkMat);

    // 8. Wearable Accessories (Hat, Glasses, Neck, Head Item)
    this.buildAccessories(app);
  }

  buildBody(speciesId, bodyMat, snoutMat, whiteMat, darkMat) {
    let bodyScale = new THREE.Vector3(1.0, 1.25, 0.95);
    let bellyScale = new THREE.Vector3(0.85, 1.1, 0.3);
    let bellyMat = snoutMat;
    let bodyY = 1.2;

    if (speciesId === 'capybara') {
      // Chunky, heavy, relaxed barrel body
      bodyScale.set(1.22, 1.05, 1.28);
      bellyScale.set(0.95, 0.85, 0.38);
    } else if (speciesId === 'penguin') {
      // Upright sleek teardrop tuxedo body
      bodyScale.set(0.86, 1.45, 0.9);
      bellyScale.set(0.78, 1.35, 0.35);
      bellyMat = whiteMat; // White tuxedo chest
    } else if (speciesId === 'bunny') {
      // Soft round chubby pear body
      bodyScale.set(1.05, 1.15, 1.05);
      bellyScale.set(0.88, 1.05, 0.35);
      bellyMat = whiteMat;
    } else if (speciesId === 'calico_cat') {
      // Sleek flexible cat torso
      bodyScale.set(0.92, 1.25, 0.92);
      bellyScale.set(0.8, 1.15, 0.35);
      bellyMat = whiteMat;
    } else if (speciesId === 'shiba') {
      // Sturdy doge torso with white urajiro chest
      bodyScale.set(1.08, 1.2, 1.05);
      bellyScale.set(0.92, 1.18, 0.38);
      bellyMat = whiteMat;
    } else if (speciesId === 'fox') {
      // Slender agile fox torso
      bodyScale.set(0.9, 1.28, 0.9);
      bellyScale.set(0.85, 1.2, 0.36);
      bellyMat = whiteMat;
    } else if (speciesId === 'bear_cub') {
      // Massive cuddly roly-poly bear torso
      bodyScale.set(1.3, 1.35, 1.25);
      bellyScale.set(1.02, 1.15, 0.38);
    } else if (speciesId === 'red_panda') {
      // Robust ringed torso with dark chest
      bodyScale.set(1.12, 1.2, 1.08);
      bellyScale.set(0.9, 1.1, 0.36);
      bellyMat = darkMat; // Red panda dark chest contrast
    } else if (speciesId === 'sea_otter') {
      // Long streamlined river otter torso
      bodyScale.set(0.94, 1.38, 1.05);
      bellyScale.set(0.85, 1.25, 0.35);
    } else if (speciesId === 'hamster') {
      // Ultra-chonky dumpling sphere body
      bodyScale.set(1.38, 1.02, 1.32);
      bellyScale.set(1.1, 0.9, 0.38);
      bellyMat = whiteMat;
    }

    const bodyGeo = new THREE.SphereGeometry(0.85, 24, 20);
    bodyGeo.scale(bodyScale.x, bodyScale.y, bodyScale.z);
    this.body = new THREE.Mesh(bodyGeo, bodyMat);
    this.body.position.y = bodyY;
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.group.add(this.body);

    // Front Belly Patch
    const bellyGeo = new THREE.SphereGeometry(0.55, 16, 16);
    bellyGeo.scale(bellyScale.x, bellyScale.y, bellyScale.z);
    const belly = new THREE.Mesh(bellyGeo, bellyMat);
    belly.position.set(0, 0.05, 0.72 * bodyScale.z);
    this.body.add(belly);

    // Calico cat color patches
    if (speciesId === 'calico_cat') {
      const patchMat1 = new THREE.MeshStandardMaterial({ color: 0xd35400, roughness: 0.8 });
      const patchMat2 = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.8 });

      const patchGeo = new THREE.SphereGeometry(0.3, 12, 12);
      patchGeo.scale(1.0, 0.8, 0.3);

      const p1 = new THREE.Mesh(patchGeo, patchMat1);
      p1.position.set(0.58, 0.15, 0.35);
      this.body.add(p1);

      const p2 = new THREE.Mesh(patchGeo, patchMat2);
      p2.position.set(-0.55, -0.2, 0.35);
      this.body.add(p2);
    }
  }

  buildHead(speciesId, bodyMat, snoutMat, whiteMat) {
    let headScale = new THREE.Vector3(1.15, 1.0, 1.05);
    let headY = 1.05;

    if (speciesId === 'capybara') {
      // Wide, squarish, blunt head profile
      headScale.set(1.25, 0.95, 1.22);
    } else if (speciesId === 'penguin') {
      // Sleek tapered dome
      headScale.set(0.95, 0.95, 0.95);
      headY = 1.15;
    } else if (speciesId === 'bunny') {
      // Round pear head with chubby cheek tufts
      headScale.set(1.05, 1.02, 1.0);
    } else if (speciesId === 'calico_cat') {
      // Sleek feline head
      headScale.set(1.15, 0.95, 1.05);
    } else if (speciesId === 'shiba') {
      // Round fluffy doge head
      headScale.set(1.16, 0.98, 1.08);
    } else if (speciesId === 'fox') {
      // Sleek angular fox head
      headScale.set(1.02, 0.94, 1.14);
    } else if (speciesId === 'bear_cub') {
      // Big cuddly teddy head
      headScale.set(1.25, 1.12, 1.12);
      headY = 1.1;
    } else if (speciesId === 'red_panda') {
      // Wide fluffy head
      headScale.set(1.25, 0.95, 1.08);
    } else if (speciesId === 'sea_otter') {
      // Flat streamlined otter head
      headScale.set(1.15, 0.88, 1.15);
      headY = 1.0;
    } else if (speciesId === 'hamster') {
      // Dumpling head with bulging cheek pouches
      headScale.set(1.3, 0.92, 1.15);
      headY = 0.95;
    }

    const headGeo = new THREE.SphereGeometry(0.8, 24, 20);
    headGeo.scale(headScale.x, headScale.y, headScale.z);
    this.head = new THREE.Mesh(headGeo, bodyMat);
    this.head.position.y = headY;
    this.head.castShadow = true;
    this.body.add(this.head);

    // Species-Specific Cheek Details
    if (speciesId === 'hamster') {
      // GIANT BULGING SEED CHEEK BULBS
      const cheekGeo = new THREE.SphereGeometry(0.42, 16, 16);
      cheekGeo.scale(1.2, 0.85, 0.95);
      const cheekMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });

      const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
      leftCheek.position.set(-0.58, -0.18, 0.48);
      this.head.add(leftCheek);

      const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
      rightCheek.position.set(0.58, -0.18, 0.48);
      this.head.add(rightCheek);

    } else if (speciesId === 'shiba') {
      // White fluffy urajiro cheek fur
      const cheekGeo = new THREE.SphereGeometry(0.35, 16, 16);
      cheekGeo.scale(1.1, 0.85, 0.45);

      const leftCheek = new THREE.Mesh(cheekGeo, whiteMat);
      leftCheek.position.set(-0.45, -0.15, 0.45);
      this.head.add(leftCheek);

      const rightCheek = new THREE.Mesh(cheekGeo, whiteMat);
      rightCheek.position.set(0.45, -0.15, 0.45);
      this.head.add(rightCheek);

    } else if (speciesId === 'red_panda') {
      // White teardrop cheek bands under eyes
      const tearGeo = new THREE.SphereGeometry(0.25, 12, 12);
      tearGeo.scale(0.8, 1.2, 0.3);

      const leftTear = new THREE.Mesh(tearGeo, whiteMat);
      leftTear.position.set(-0.52, -0.1, 0.58);
      leftTear.rotation.z = -0.25;
      this.head.add(leftTear);

      const rightTear = new THREE.Mesh(tearGeo, whiteMat);
      rightTear.position.set(0.52, -0.1, 0.58);
      rightTear.rotation.z = 0.25;
      this.head.add(rightTear);

    } else if (speciesId === 'bunny') {
      // Cute fluffy cheek puffs
      const puffGeo = new THREE.SphereGeometry(0.24, 12, 12);
      puffGeo.scale(1.1, 0.8, 0.6);

      const pLeft = new THREE.Mesh(puffGeo, whiteMat);
      pLeft.position.set(-0.42, -0.18, 0.48);
      this.head.add(pLeft);

      const pRight = new THREE.Mesh(puffGeo, whiteMat);
      pRight.position.set(0.42, -0.18, 0.48);
      this.head.add(pRight);
    }
  }

  buildMuzzleOrBeak(speciesId, bodyMat, snoutMat, whiteMat, pinkMat, beakMat) {
    if (speciesId === 'penguin') {
      // BRIGHT ORANGE CHIBI BEAK (No mammal snout!)
      const beakGeo = new THREE.ConeGeometry(0.18, 0.52, 16);
      beakGeo.scale(1.1, 0.68, 1.0);
      beakGeo.rotateX(Math.PI / 2);

      const beak = new THREE.Mesh(beakGeo, beakMat);
      beak.position.set(0, -0.06, 0.82);
      this.head.add(beak);

      // Black beak divider line
      const lineGeo = new THREE.BoxGeometry(0.26, 0.02, 0.35);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(0, -0.06, 0.75);
      this.head.add(line);

    } else if (speciesId === 'fox') {
      // LONG POINTED CONE FOX MUZZLE WITH WHITE LOWER JAW
      const snoutGeo = new THREE.ConeGeometry(0.26, 0.68, 16);
      snoutGeo.scale(1.0, 0.72, 1.0);
      snoutGeo.rotateX(Math.PI / 2);

      const snout = new THREE.Mesh(snoutGeo, bodyMat);
      snout.position.set(0, -0.12, 0.95);
      this.head.add(snout);

      // White lower jaw
      const jawGeo = new THREE.ConeGeometry(0.2, 0.55, 12);
      jawGeo.scale(0.9, 0.4, 0.9);
      jawGeo.rotateX(Math.PI / 2);
      const jaw = new THREE.Mesh(jawGeo, whiteMat);
      jaw.position.set(0, -0.22, 0.88);
      this.head.add(jaw);

      // Black nose tip
      const noseGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const noseMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.position.set(0, -0.12, 1.3);
      this.head.add(nose);

    } else if (speciesId === 'capybara') {
      // WIDE RECTANGULAR BLUNT CAPYBARA SNOUT WITH CLEFT LIP & WIDE NOSTRILS
      const snoutGeo = new THREE.BoxGeometry(0.62, 0.38, 0.52);
      const snout = new THREE.Mesh(snoutGeo, snoutMat);
      snout.position.set(0, -0.16, 0.8);
      this.head.add(snout);

      // Cleft lip vertical groove
      const cleftGeo = new THREE.BoxGeometry(0.03, 0.18, 0.04);
      const cleftMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const cleft = new THREE.Mesh(cleftGeo, cleftMat);
      cleft.position.set(0, -0.18, 1.07);
      this.head.add(cleft);

      // Left & Right wide oval nostrils
      const nostrilGeo = new THREE.SphereGeometry(0.05, 8, 8);
      nostrilGeo.scale(1.2, 0.6, 0.5);
      const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

      const n1 = new THREE.Mesh(nostrilGeo, nostrilMat);
      n1.position.set(-0.16, -0.06, 1.06);
      this.head.add(n1);

      const n2 = new THREE.Mesh(nostrilGeo, nostrilMat);
      n2.position.set(0.16, -0.06, 1.06);
      this.head.add(n2);

    } else if (speciesId === 'bunny') {
      // TINY PINK HEART NOSE + WHISKER PADS + WHISKERS
      const padGeo = new THREE.SphereGeometry(0.24, 16, 16);
      padGeo.scale(1.1, 0.7, 0.7);
      const pad = new THREE.Mesh(padGeo, whiteMat);
      pad.position.set(0, -0.16, 0.7);
      this.head.add(pad);

      const noseGeo = new THREE.ConeGeometry(0.065, 0.08, 10);
      noseGeo.rotateX(Math.PI);
      const nose = new THREE.Mesh(noseGeo, pinkMat);
      nose.position.set(0, -0.1, 0.88);
      this.head.add(nose);

      // Whiskers
      this.buildWhiskers(0.18, -0.16, 0.75, 0x333333);

    } else if (speciesId === 'calico_cat') {
      // CAT ':3' SPLIT WHISKER PADS + PINK NOSE + WHISKERS
      const padGeo = new THREE.SphereGeometry(0.16, 12, 12);
      padGeo.scale(1.2, 0.85, 0.7);

      const leftPad = new THREE.Mesh(padGeo, whiteMat);
      leftPad.position.set(-0.14, -0.18, 0.74);
      this.head.add(leftPad);

      const rightPad = new THREE.Mesh(padGeo, whiteMat);
      rightPad.position.set(0.14, -0.18, 0.74);
      this.head.add(rightPad);

      const noseGeo = new THREE.ConeGeometry(0.06, 0.07, 10);
      noseGeo.rotateX(Math.PI);
      const nose = new THREE.Mesh(noseGeo, pinkMat);
      nose.position.set(0, -0.11, 0.82);
      this.head.add(nose);

      this.buildWhiskers(0.22, -0.18, 0.74, 0xffffff);

    } else if (speciesId === 'bear_cub') {
      // BIG ROUND TEDDY MUZZLE & LARGE BLACK BEAR NOSE
      const snoutGeo = new THREE.SphereGeometry(0.38, 16, 16);
      snoutGeo.scale(1.15, 0.85, 0.85);
      const snout = new THREE.Mesh(snoutGeo, snoutMat);
      snout.position.set(0, -0.14, 0.75);
      this.head.add(snout);

      const noseGeo = new THREE.SphereGeometry(0.13, 14, 14);
      noseGeo.scale(1.2, 0.8, 0.8);
      const noseMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.25 });
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.position.set(0, 0.08, 0.32);
      snout.add(nose);

    } else {
      // Standard animal muzzle (Shiba, Red Panda, Otter, Hamster)
      const snoutGeo = new THREE.SphereGeometry(0.35, 16, 16);
      snoutGeo.scale(1.1, 0.75, 0.8);
      const snout = new THREE.Mesh(snoutGeo, snoutMat);
      snout.position.set(0, -0.15, 0.7);
      this.head.add(snout);

      const noseGeo = new THREE.SphereGeometry(0.09, 12, 12);
      const noseMat = new THREE.MeshStandardMaterial({
        color: speciesId === 'hamster' ? 0xffa8a8 : 0x111111,
        roughness: 0.3
      });
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.position.set(0, 0.08, 0.28);
      snout.add(nose);

      if (speciesId === 'sea_otter') {
        this.buildWhiskers(0.22, -0.14, 0.72, 0x111111);
      }
    }
  }

  buildWhiskers(xOffset, yPos, zPos, whiskerHex) {
    const whiskerMat = new THREE.MeshBasicMaterial({ color: whiskerHex });
    const angles = [-0.15, 0, 0.15];

    angles.forEach(ang => {
      // Left whiskers
      const wGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.38, 6);
      wGeo.rotateZ(Math.PI / 2 + ang);
      const wL = new THREE.Mesh(wGeo, whiskerMat);
      wL.position.set(-xOffset - 0.15, yPos + ang * 0.1, zPos);
      this.head.add(wL);

      // Right whiskers
      const wR = new THREE.Mesh(wGeo, whiskerMat);
      wR.position.set(xOffset + 0.15, yPos + ang * 0.1, zPos);
      this.head.add(wR);
    });
  }

  buildEars(speciesId, earMat, bodyMat, whiteMat, pinkMat) {
    if (speciesId === 'penguin') {
      // Penguins have aerodynamic heads with no external ears!
      return;
    }

    if (speciesId === 'bunny') {
      // VERY TALL UPRIGHT RABBIT EARS WITH PINK INNER LINING
      const earGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.35, 16);
      earGeo.scale(0.7, 1.0, 0.3);

      const leftEar = new THREE.Mesh(earGeo, bodyMat);
      leftEar.position.set(-0.45, 1.25, 0.05);
      leftEar.rotation.z = 0.22;
      leftEar.rotation.x = -0.12;
      this.head.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, bodyMat);
      rightEar.position.set(0.45, 1.25, 0.05);
      rightEar.rotation.z = -0.22;
      rightEar.rotation.x = -0.12;
      this.head.add(rightEar);

      // Pink Inner Ear Inserts
      const innerGeo = new THREE.CylinderGeometry(0.08, 0.11, 1.15, 12);
      innerGeo.scale(0.6, 1.0, 0.1);
      const innerL = new THREE.Mesh(innerGeo, pinkMat);
      innerL.position.set(0, 0, 0.08);
      leftEar.add(innerL);

      const innerR = new THREE.Mesh(innerGeo, pinkMat);
      innerR.position.set(0, 0, 0.08);
      rightEar.add(innerR);

    } else if (speciesId === 'fox') {
      // TALL POINTED FOXY EARS WITH DARK OUTER BACK & WHITE INNER FLUFF
      const earGeo = new THREE.ConeGeometry(0.28, 0.72, 16);
      earGeo.scale(0.85, 1.0, 0.45);

      const darkOuterMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.8 });

      const leftEar = new THREE.Mesh(earGeo, darkOuterMat);
      leftEar.position.set(-0.55, 0.85, 0.15);
      leftEar.rotation.z = 0.32;
      leftEar.rotation.x = -0.15;
      this.head.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, darkOuterMat);
      rightEar.position.set(0.55, 0.85, 0.15);
      rightEar.rotation.z = -0.32;
      rightEar.rotation.x = -0.15;
      this.head.add(rightEar);

      // White inner ear fluff
      const innerGeo = new THREE.ConeGeometry(0.18, 0.52, 12);
      innerGeo.scale(0.8, 1.0, 0.3);
      const inL = new THREE.Mesh(innerGeo, whiteMat);
      inL.position.set(0, -0.05, 0.08);
      leftEar.add(inL);

      const inR = new THREE.Mesh(innerGeo, whiteMat);
      inR.position.set(0, -0.05, 0.08);
      rightEar.add(inR);

    } else if (speciesId === 'shiba' || speciesId === 'calico_cat') {
      // POINTED PERKY PRICK EARS WITH INNER LINING
      const earGeo = new THREE.ConeGeometry(0.25, 0.55, 16);
      earGeo.scale(1.0, 1.0, 0.5);

      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.position.set(-0.55, 0.75, 0.2);
      leftEar.rotation.z = 0.35;
      leftEar.rotation.x = -0.1;
      this.head.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.position.set(0.55, 0.75, 0.2);
      rightEar.rotation.z = -0.35;
      rightEar.rotation.x = -0.1;
      this.head.add(rightEar);

      // Inner ear
      const innerGeo = new THREE.ConeGeometry(0.16, 0.38, 12);
      innerGeo.scale(0.9, 1.0, 0.3);
      const inMat = speciesId === 'calico_cat' ? pinkMat : whiteMat;
      const inL = new THREE.Mesh(innerGeo, inMat);
      inL.position.set(0, -0.05, 0.08);
      leftEar.add(inL);
      const inR = new THREE.Mesh(innerGeo, inMat);
      inR.position.set(0, -0.05, 0.08);
      rightEar.add(inR);

    } else if (speciesId === 'bear_cub') {
      // BIG ROUND CUP-SHAPED TEDDY BEAR EARS
      const earGeo = new THREE.SphereGeometry(0.28, 16, 16);
      earGeo.scale(0.5, 1.0, 1.0);

      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.position.set(-0.75, 0.55, 0.1);
      leftEar.rotation.z = 0.3;
      this.head.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.position.set(0.75, 0.55, 0.1);
      rightEar.rotation.z = -0.3;
      this.head.add(rightEar);

      const innerGeo = new THREE.SphereGeometry(0.18, 12, 12);
      innerGeo.scale(0.4, 0.9, 0.9);
      const innerMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c, roughness: 0.8 });
      const inL = new THREE.Mesh(innerGeo, innerMat);
      inL.position.set(0.04, 0, 0.05);
      leftEar.add(inL);

      const inR = new THREE.Mesh(innerGeo, innerMat);
      inR.position.set(-0.04, 0, 0.05);
      rightEar.add(inR);

    } else if (speciesId === 'red_panda') {
      // FLUFFY ROUND EARS WITH THICK WHITE FUR BORDER
      const earGeo = new THREE.SphereGeometry(0.3, 16, 16);
      earGeo.scale(0.6, 1.0, 0.9);

      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.position.set(-0.75, 0.55, 0.05);
      leftEar.rotation.z = 0.35;
      this.head.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.position.set(0.75, 0.55, 0.05);
      rightEar.rotation.z = -0.35;
      this.head.add(rightEar);

      // White fur border ring
      const borderGeo = new THREE.TorusGeometry(0.25, 0.06, 8, 16, Math.PI);
      borderGeo.rotateY(Math.PI / 2);
      const borderL = new THREE.Mesh(borderGeo, whiteMat);
      borderL.position.set(0, 0, 0);
      leftEar.add(borderL);
      const borderR = new THREE.Mesh(borderGeo, whiteMat);
      borderR.position.set(0, 0, 0);
      rightEar.add(borderR);

    } else if (speciesId === 'capybara') {
      // SMALL FLAT ROUNDED BEAN EARS PLACED LOW & BACK
      const earGeo = new THREE.SphereGeometry(0.18, 14, 14);
      earGeo.scale(0.4, 0.7, 0.8);

      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.position.set(-0.78, 0.35, -0.05);
      leftEar.rotation.z = 0.25;
      this.head.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.position.set(0.78, 0.35, -0.05);
      rightEar.rotation.z = -0.25;
      this.head.add(rightEar);

    } else if (speciesId === 'hamster') {
      // TEENY TINY ROUND PINK EARS
      const earGeo = new THREE.SphereGeometry(0.14, 12, 12);
      earGeo.scale(0.4, 0.9, 0.9);

      const leftEar = new THREE.Mesh(earGeo, pinkMat);
      leftEar.position.set(-0.72, 0.42, 0.05);
      leftEar.rotation.z = 0.25;
      this.head.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, pinkMat);
      rightEar.position.set(0.72, 0.42, 0.05);
      rightEar.rotation.z = -0.25;
      this.head.add(rightEar);

    } else {
      // Sea Otter small flat ears
      const earGeo = new THREE.SphereGeometry(0.18, 14, 14);
      earGeo.scale(0.5, 0.8, 0.8);

      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.position.set(-0.74, 0.38, 0.05);
      leftEar.rotation.z = 0.25;
      this.head.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.position.set(0.74, 0.38, 0.05);
      rightEar.rotation.z = -0.25;
      this.head.add(rightEar);
    }
  }

  buildEyes(speciesId, whiteMat) {
    this.eyes = [];
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });

    let eyeScale = new THREE.Vector3(1, 1, 1);
    let eyeY = 0.12;
    let eyeX = 0.35;
    let eyeZ = 0.75;

    if (speciesId === 'capybara') {
      // Chill, calm, sleepy half-lidded eyes
      eyeScale.set(1.1, 0.55, 1.0);
      eyeY = 0.1;
      eyeX = 0.38;
      eyeZ = 0.78;
    } else if (speciesId === 'hamster') {
      // Giant sparkling kawaii eyes
      eyeScale.set(1.35, 1.35, 1.2);
      eyeY = 0.12;
      eyeX = 0.42;
      eyeZ = 0.78;
    } else if (speciesId === 'fox') {
      // Almond-shaped foxy eyes
      eyeScale.set(1.15, 0.8, 1.0);
      eyeY = 0.14;
      eyeX = 0.34;
      eyeZ = 0.76;
    }

    const eyeGeo = new THREE.SphereGeometry(0.09, 16, 16);
    eyeGeo.scale(eyeScale.x, eyeScale.y, eyeScale.z);

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-eyeX, eyeY, eyeZ);
    if (speciesId === 'fox') leftEye.rotation.z = -0.15;
    this.head.add(leftEye);
    this.eyes.push(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(eyeX, eyeY, eyeZ);
    if (speciesId === 'fox') rightEye.rotation.z = 0.15;
    this.head.add(rightEye);
    this.eyes.push(rightEye);

    // Sparkle catchlights
    const sparkleGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const s1 = new THREE.Mesh(sparkleGeo, sparkleMat);
    s1.position.set(-0.02, 0.03, 0.07);
    leftEye.add(s1);
    const s2 = new THREE.Mesh(sparkleGeo, sparkleMat);
    s2.position.set(-0.02, 0.03, 0.07);
    rightEye.add(s2);

    // Hamster extra kawaii secondary sparkle
    if (speciesId === 'hamster') {
      const sMiniGeo = new THREE.SphereGeometry(0.012, 6, 6);
      const s3 = new THREE.Mesh(sMiniGeo, sparkleMat);
      s3.position.set(0.03, -0.03, 0.07);
      leftEye.add(s3);
      const s4 = new THREE.Mesh(sMiniGeo, sparkleMat);
      s4.position.set(0.03, -0.03, 0.07);
      rightEye.add(s4);
    }

    // Shiba Iconic White Eyebrow Dots
    if (speciesId === 'shiba') {
      const browGeo = new THREE.SphereGeometry(0.08, 12, 12);
      browGeo.scale(1.2, 0.9, 0.5);

      const bLeft = new THREE.Mesh(browGeo, whiteMat);
      bLeft.position.set(-0.28, 0.35, 0.74);
      this.head.add(bLeft);

      const bRight = new THREE.Mesh(browGeo, whiteMat);
      bRight.position.set(0.28, 0.35, 0.74);
      this.head.add(bRight);
    }

    // Red Panda White Brow Markings
    if (speciesId === 'red_panda') {
      const browGeo = new THREE.SphereGeometry(0.07, 10, 10);
      browGeo.scale(1.3, 0.7, 0.4);

      const bL = new THREE.Mesh(browGeo, whiteMat);
      bL.position.set(-0.3, 0.32, 0.74);
      this.head.add(bL);

      const bR = new THREE.Mesh(browGeo, whiteMat);
      bR.position.set(0.3, 0.32, 0.74);
      this.head.add(bR);
    }
  }

  buildLimbs(speciesId, bodyMat, whiteMat, darkMat, beakMat) {
    if (speciesId === 'penguin') {
      // PENGUIN FLIPPER WINGS ON SIDES
      const flipperGeo = new THREE.BoxGeometry(0.14, 0.85, 0.36);
      flipperGeo.translate(0, -0.35, 0);

      this.leftWing = new THREE.Mesh(flipperGeo, bodyMat);
      this.leftWing.position.set(-0.65, 0.85, 0);
      this.leftWing.rotation.z = 0.35;
      this.body.add(this.leftWing);

      this.rightWing = new THREE.Mesh(flipperGeo, bodyMat);
      this.rightWing.position.set(0.65, 0.85, 0);
      this.rightWing.rotation.z = -0.35;
      this.body.add(this.rightWing);

      // Bright orange flat webbed penguin feet
      const footGeo = new THREE.SphereGeometry(0.26, 16, 16);
      footGeo.scale(1.2, 0.32, 1.5);

      this.leftPaw = new THREE.Mesh(footGeo, beakMat);
      this.leftPaw.position.set(-0.38, 0.14, 0.25);
      this.leftPaw.castShadow = true;
      this.group.add(this.leftPaw);

      this.rightPaw = new THREE.Mesh(footGeo, beakMat);
      this.rightPaw.position.set(0.38, 0.14, 0.25);
      this.rightPaw.castShadow = true;
      this.group.add(this.rightPaw);

    } else {
      // Standard Animal Paws
      let pawScale = new THREE.Vector3(1.0, 0.7, 1.2);
      let pawColorMat = bodyMat;

      if (speciesId === 'fox') {
        pawColorMat = darkMat; // Black stockings on fox paws!
      } else if (speciesId === 'shiba' || speciesId === 'calico_cat') {
        pawColorMat = whiteMat; // White socks on paws!
      } else if (speciesId === 'bear_cub') {
        pawScale.set(1.35, 0.85, 1.35); // Big heavy bear paws
      } else if (speciesId === 'capybara') {
        pawScale.set(1.2, 0.65, 1.3); // Chunky webbed paws
      } else if (speciesId === 'hamster') {
        pawScale.set(0.75, 0.6, 0.8); // Tiny stubby hamster feet
      }

      const pawGeo = new THREE.SphereGeometry(0.24, 16, 16);
      pawGeo.scale(pawScale.x, pawScale.y, pawScale.z);

      this.leftPaw = new THREE.Mesh(pawGeo, pawColorMat);
      this.leftPaw.position.set(-0.45, 0.18, 0.1);
      this.leftPaw.castShadow = true;
      this.group.add(this.leftPaw);

      this.rightPaw = new THREE.Mesh(pawGeo, pawColorMat);
      this.rightPaw.position.set(0.45, 0.18, 0.1);
      this.rightPaw.castShadow = true;
      this.group.add(this.rightPaw);

      // Sea Otter: Holds a giant mechanical keycap / clamshell on chest!
      if (speciesId === 'sea_otter') {
        const clamGroup = new THREE.Group();
        clamGroup.position.set(0, 0.25, 0.78);

        // Giant Novelty Keycap
        const capGeo = new THREE.BoxGeometry(0.32, 0.22, 0.32);
        const capMat = new THREE.MeshStandardMaterial({ color: 0x00d2d3, roughness: 0.3, metalness: 0.2 });
        const cap = new THREE.Mesh(capGeo, capMat);
        clamGroup.add(cap);

        // Otter tiny front hands clutching it
        const handGeo = new THREE.SphereGeometry(0.1, 10, 10);
        const hL = new THREE.Mesh(handGeo, pawColorMat);
        hL.position.set(-0.18, 0, 0);
        clamGroup.add(hL);
        const hR = new THREE.Mesh(handGeo, pawColorMat);
        hR.position.set(0.18, 0, 0);
        clamGroup.add(hR);

        this.body.add(clamGroup);
      } else if (speciesId === 'hamster') {
        // Hamster tiny front hands held together under chin
        const handGeo = new THREE.SphereGeometry(0.09, 10, 10);
        const hL = new THREE.Mesh(handGeo, whiteMat);
        hL.position.set(-0.16, 0.28, 0.78);
        this.body.add(hL);
        const hR = new THREE.Mesh(handGeo, whiteMat);
        hR.position.set(0.16, 0.28, 0.78);
        this.body.add(hR);
      }
    }
  }

  buildTail(speciesId, bodyMat, whiteMat, darkMat) {
    this.tailMesh = null;

    if (speciesId === 'fox') {
      // MAGNIFICENT BUSHY FOX TAIL WITH WHITE TIP
      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, 0.1, -0.75);

      const tailGeo = new THREE.CylinderGeometry(0.12, 0.36, 1.1, 16);
      tailGeo.scale(1.0, 1.0, 0.85);
      tailGeo.rotateX(Math.PI / 3);
      const tailBase = new THREE.Mesh(tailGeo, bodyMat);
      tailGroup.add(tailBase);

      const tipGeo = new THREE.ConeGeometry(0.24, 0.45, 16);
      tipGeo.rotateX(Math.PI / 3);
      const tip = new THREE.Mesh(tipGeo, whiteMat);
      tip.position.set(0, 0.45, -0.35);
      tailGroup.add(tip);

      this.tailMesh = tailGroup;
      this.body.add(tailGroup);

    } else if (speciesId === 'shiba') {
      // CINNAMON ROLL CURLY SHIBA TAIL
      const tailGeo = new THREE.TorusGeometry(0.24, 0.11, 12, 24, Math.PI * 1.55);
      tailGeo.rotateY(Math.PI / 2);
      const tail = new THREE.Mesh(tailGeo, bodyMat);
      tail.position.set(0, 0.45, -0.68);
      this.tailMesh = tail;
      this.body.add(tail);

    } else if (speciesId === 'calico_cat') {
      // LONG GRACEFUL ARCHED CAT TAIL
      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, 0.1, -0.75);

      const tailGeo = new THREE.CylinderGeometry(0.065, 0.08, 1.25, 12);
      tailGeo.translate(0, 0.6, 0);
      tailGeo.rotateX(-Math.PI / 4);

      const tail = new THREE.Mesh(tailGeo, bodyMat);
      tailGroup.add(tail);

      this.tailMesh = tailGroup;
      this.body.add(tailGroup);

    } else if (speciesId === 'red_panda') {
      // THICK STRIPED BANDED RING TAIL
      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, 0.1, -0.75);

      const segColors = [bodyMat, darkMat, bodyMat, darkMat, bodyMat];
      for (let i = 0; i < 5; i++) {
        const segGeo = new THREE.CylinderGeometry(0.24 - i * 0.02, 0.26 - i * 0.02, 0.22, 16);
        segGeo.rotateX(Math.PI / 4);
        const seg = new THREE.Mesh(segGeo, segColors[i]);
        seg.position.set(0, 0.12 + i * 0.16, -i * 0.16);
        tailGroup.add(seg);
      }

      this.tailMesh = tailGroup;
      this.body.add(tailGroup);

    } else if (speciesId === 'bunny') {
      // ROUND FLUFFY COTTON-BALL BUNNY TAIL
      const tailGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const tail = new THREE.Mesh(tailGeo, whiteMat);
      tail.position.set(0, 0.15, -0.85);
      this.tailMesh = tail;
      this.body.add(tail);

    } else if (speciesId === 'sea_otter') {
      // FLAT OTTER PADDLE TAIL
      const tailGeo = new THREE.ConeGeometry(0.24, 1.1, 16);
      tailGeo.scale(1.2, 0.35, 1.0);
      tailGeo.rotateX(-Math.PI / 2.5);
      const tail = new THREE.Mesh(tailGeo, bodyMat);
      tail.position.set(0, -0.1, -0.9);
      this.tailMesh = tail;
      this.body.add(tail);

    } else if (speciesId === 'bear_cub') {
      // CUTE BUTTON BEAR TAIL
      const tailGeo = new THREE.SphereGeometry(0.16, 12, 12);
      const tail = new THREE.Mesh(tailGeo, bodyMat);
      tail.position.set(0, 0.2, -0.9);
      this.tailMesh = tail;
      this.body.add(tail);

    } else if (speciesId === 'penguin') {
      // POINTED PENGUIN TAIL FEATHERS
      const tailGeo = new THREE.ConeGeometry(0.18, 0.38, 10);
      tailGeo.rotateX(-Math.PI / 2.2);
      const tail = new THREE.Mesh(tailGeo, darkMat);
      tail.position.set(0, -0.25, -0.75);
      this.tailMesh = tail;
      this.body.add(tail);

    } else if (speciesId === 'hamster') {
      // TEENY TINY NUB TAIL
      const tailGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const tail = new THREE.Mesh(tailGeo, bodyMat);
      tail.position.set(0, 0.1, -0.92);
      this.tailMesh = tail;
      this.body.add(tail);
    }
  }

  buildAccessories(app) {
    // 1. Hat
    if (app.hat && app.hat !== 'none') {
      const hatColor = parseInt((app.hatColor || '#ffffff').replace('#', '0x'), 16);
      const hatMat = new THREE.MeshStandardMaterial({ color: hatColor, roughness: 0.6 });

      if (app.hat === 'chef') {
        const chefGeo = new THREE.CylinderGeometry(0.42, 0.36, 0.65, 16);
        const chefHat = new THREE.Mesh(chefGeo, hatMat);
        chefHat.position.set(0, 0.95, 0);
        this.head.add(chefHat);
      } else if (app.hat === 'straw') {
        const brimGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.05, 24);
        const crownGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.35, 20);
        const brim = new THREE.Mesh(brimGeo, hatMat);
        brim.position.set(0, 0.75, 0);
        const crown = new THREE.Mesh(crownGeo, hatMat);
        crown.position.set(0, 0.92, 0);
        this.head.add(brim, crown);
      } else if (app.hat === 'frog_beanie') {
        const beanieGeo = new THREE.SphereGeometry(0.72, 16, 16);
        beanieGeo.scale(1.05, 0.7, 1.0);
        const beanie = new THREE.Mesh(beanieGeo, hatMat);
        beanie.position.set(0, 0.62, 0);

        // Frog eye bulbs
        const bulbGeo = new THREE.SphereGeometry(0.18, 12, 12);
        const bulb1 = new THREE.Mesh(bulbGeo, hatMat);
        bulb1.position.set(-0.35, 0.45, 0.2);
        const bulb2 = new THREE.Mesh(bulbGeo, hatMat);
        bulb2.position.set(0.35, 0.45, 0.2);
        beanie.add(bulb1, bulb2);

        this.head.add(beanie);
      } else if (app.hat === 'top_hat') {
        const brimGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.05, 20);
        const topGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.7, 20);
        const brim = new THREE.Mesh(brimGeo, hatMat);
        brim.position.set(0, 0.75, 0);
        const top = new THREE.Mesh(topGeo, hatMat);
        top.position.set(0, 1.1, 0);
        this.head.add(brim, top);
      }
    }

    // 2. Glasses
    if (app.glasses && app.glasses !== 'none') {
      const glassesColor = parseInt((app.glassesColor || '#111111').replace('#', '0x'), 16);
      const glassesMat = new THREE.MeshStandardMaterial({ color: glassesColor, metalness: 0.7, roughness: 0.3 });

      const ringGeo = new THREE.TorusGeometry(0.18, 0.025, 8, 20);
      const leftRing = new THREE.Mesh(ringGeo, glassesMat);
      leftRing.position.set(-0.35, 0.12, 0.88);
      this.head.add(leftRing);

      if (app.glasses !== 'monocle') {
        const rightRing = new THREE.Mesh(ringGeo, glassesMat);
        rightRing.position.set(0.35, 0.12, 0.88);
        this.head.add(rightRing);

        // Bridge
        const bridgeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.28, 8);
        bridgeGeo.rotateZ(Math.PI / 2);
        const bridge = new THREE.Mesh(bridgeGeo, glassesMat);
        bridge.position.set(0, 0.12, 0.88);
        this.head.add(bridge);
      }
    }

    // 3. Head Item: Mikan Orange on Head (Capybara iconic onsen orange)
    if (app.headItem === 'mikan') {
      const orangeGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff793f, roughness: 0.5 });
      const orange = new THREE.Mesh(orangeGeo, orangeMat);
      orange.position.set(0, 0.88, 0.15);

      const leafGeo = new THREE.ConeGeometry(0.06, 0.14, 8);
      leafGeo.rotateZ(Math.PI / 3);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x2ed573, roughness: 0.4 });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(0.08, 0.18, 0);
      orange.add(leaf);

      this.head.add(orange);
    }

    // 4. Neckwear: Cozy Scarf or Bowtie
    if (app.neck && app.neck !== 'none') {
      const neckColor = parseInt((app.neckColor || '#ff4757').replace('#', '0x'), 16);
      const neckMat = new THREE.MeshStandardMaterial({ color: neckColor, roughness: 0.7 });

      if (app.neck === 'red_scarf') {
        const scarfGeo = new THREE.TorusGeometry(0.68, 0.12, 12, 24);
        scarfGeo.rotateX(Math.PI / 2);
        const scarf = new THREE.Mesh(scarfGeo, neckMat);
        scarf.position.set(0, 0.55, 0.05);
        this.body.add(scarf);
      } else if (app.neck === 'gold_bowtie') {
        const bowGeo = new THREE.ConeGeometry(0.14, 0.22, 12);
        bowGeo.rotateZ(Math.PI / 2);
        const bow1 = new THREE.Mesh(bowGeo, neckMat);
        bow1.position.set(-0.12, 0.65, 0.75);
        const bow2 = new THREE.Mesh(bowGeo, neckMat);
        bow2.position.set(0.12, 0.65, 0.75);
        bow2.rotation.y = Math.PI;
        this.body.add(bow1, bow2);
      }
    }
  }

  startWalk() {
    this.isWalking = true;
    this.walkProgress = 0;
  }

  celebrate() {
    this.isCelebrating = true;
    this.celebrateTime = 0;
  }

  update(delta, elapsedTime) {
    // 1. Walking Animation to Counter
    if (this.isWalking) {
      this.walkProgress += delta * 0.75;
      if (this.walkProgress >= 1.0) {
        this.walkProgress = 1.0;
        this.isWalking = false;
        this.group.position.copy(this.walkTarget);
        this.leftPaw.position.y = 0.18;
        this.rightPaw.position.y = 0.18;
      } else {
        // Linear translation with bobbing
        this.group.position.lerpVectors(this.walkStart, this.walkTarget, this.walkProgress);

        // Waddling paw steps
        const stepFreq = elapsedTime * 12;
        this.leftPaw.position.y = 0.18 + Math.max(0, Math.sin(stepFreq)) * 0.18;
        this.rightPaw.position.y = 0.18 + Math.max(0, Math.sin(stepFreq + Math.PI)) * 0.18;
        this.body.rotation.z = Math.sin(stepFreq) * 0.08;

        // Penguin wing flap during walk
        if (this.leftWing && this.rightWing) {
          this.leftWing.rotation.z = 0.35 + Math.sin(stepFreq) * 0.18;
          this.rightWing.rotation.z = -0.35 - Math.sin(stepFreq) * 0.18;
        }
      }
    }

    // 2. Idle Breathing & Subtle Head Tilt
    if (!this.isWalking && !this.isCelebrating) {
      this.body.position.y = 1.2 + Math.sin(elapsedTime * 2.2) * 0.04;
      this.head.rotation.y = Math.sin(elapsedTime * 0.8) * 0.08;
      this.head.rotation.z = Math.cos(elapsedTime * 1.1) * 0.04;

      // Subtle tail wag / swish
      if (this.tailMesh) {
        const speciesId = this.data.appearance.speciesId;
        if (speciesId === 'cat' || speciesId === 'calico_cat') {
          this.tailMesh.rotation.y = Math.sin(elapsedTime * 2.5) * 0.22;
          this.tailMesh.rotation.z = Math.cos(elapsedTime * 1.8) * 0.12;
        } else if (speciesId === 'fox' || speciesId === 'red_panda') {
          this.tailMesh.rotation.y = Math.sin(elapsedTime * 1.8) * 0.18;
        } else if (speciesId === 'shiba') {
          this.tailMesh.rotation.z = Math.sin(elapsedTime * 3.5) * 0.12;
        }
      }
    }

    // 3. Random Blinking (Every ~3-5 seconds)
    const blinkCycle = Math.sin(elapsedTime * 1.8);
    if (blinkCycle > 0.96) {
      this.eyes.forEach(eye => { eye.scale.y = 0.1; });
    } else {
      this.eyes.forEach(eye => { eye.scale.y = 1.0; });
    }

    // 4. Celebration Hop (When keyboard is handed over)
    if (this.isCelebrating) {
      this.celebrateTime += delta;
      const hop = Math.abs(Math.sin(this.celebrateTime * 8)) * 0.6;
      this.group.position.y = 0.4 + hop;
      this.head.rotation.x = -0.2 + Math.sin(this.celebrateTime * 12) * 0.1;
      this.body.rotation.y = Math.sin(this.celebrateTime * 6) * 0.2;

      // Penguin wings flap excitedly
      if (this.leftWing && this.rightWing) {
        this.leftWing.rotation.z = 0.45 + Math.sin(this.celebrateTime * 14) * 0.4;
        this.rightWing.rotation.z = -0.45 - Math.sin(this.celebrateTime * 14) * 0.4;
      }

      if (this.celebrateTime > 3.0) {
        this.isCelebrating = false;
        this.group.position.y = 0.4;
        if (this.leftWing && this.rightWing) {
          this.leftWing.rotation.z = 0.35;
          this.rightWing.rotation.z = -0.35;
        }
      }
    }
  }
}
