// High-DPI Keycap Legend & Sub-Legend Canvas Texture Generator
// Produces crisp, beautiful canvas textures for keycaps with custom primary legends,
// Japanese Hiragana sub-legends, modifier icons, and theme colors.

import * as THREE from 'three';
import { KEYCAP_THEMES } from '../data/parts-catalog.js';

class LegendGenerator {
  constructor() {
    this.textureCache = new Map();
  }

  // Generates or retrieves a cached Three.js CanvasTexture for a keycap
  getTexture(keyData, themeId = 'botanical') {
    const theme = KEYCAP_THEMES[themeId] || KEYCAP_THEMES['botanical'];
    const cacheKey = `${themeId}_${keyData.code}_${keyData.label}_${keyData.sub}_${keyData.isAccent}_${keyData.isSpecial}`;

    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey);
    }

    const isVertical2U = Boolean(keyData.isVertical2U || keyData.h === 2);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = isVertical2U ? 512 : 256;
    const ctx = canvas.getContext('2d');

    // Determine colors
    let bgColor = theme.alphaBg;
    let textColor = theme.alphaText;
    let subColor = theme.subText;

    if (keyData.isAccent) {
      bgColor = theme.accentBg;
      textColor = theme.accentText;
      subColor = theme.accentText;
    } else if (keyData.isSpecial) {
      bgColor = theme.modBg;
      textColor = theme.modText;
      subColor = theme.modText;
    }

    // 1. Fill Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Subtle Dish/Sculpt Shading (linear cylindrical sculpt gradient - no deformed ovals)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.02)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.03)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.12)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Crisp Subtle Inner Border Rim
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 5;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    // 4. Primary Legend Text
    const primaryLabel = keyData.label || '';
    if (primaryLabel) {
      ctx.fillStyle = textColor;

      if (isVertical2U) {
        // Vertical 2U keys (+ and ENT) - perfectly centered vertically and horizontally
        ctx.font = 'bold 76px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(primaryLabel, 128, 256);
      } else if (primaryLabel.length === 1) {
        // Single alphanumeric letter: Top-left aligned (Cherry/OEM enthusiast style)
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 84px system-ui, -apple-system, sans-serif';
        ctx.fillText(primaryLabel, 38, 36);
      } else {
        // Modifier labels (CTRL, SHIFT, ENTER, ESC, TAB, etc.)
        const fontSize = primaryLabel.length > 5 ? 36 : primaryLabel.length > 3 ? 44 : 54;
        ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(primaryLabel, 128, keyData.sub ? 105 : 128);
      }
    }

    // 5. Japanese Hiragana / Symbol Sub-Legend (Bottom-right aligned)
    const subLabel = keyData.sub || '';
    if (subLabel) {
      ctx.fillStyle = subColor;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 50px "Hiragino Sans", "Meiryo", "Yu Gothic", sans-serif';
      ctx.fillText(subLabel, 218, 218);
    }

    // Create Three.js Texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    this.textureCache.set(cacheKey, texture);
    return texture;
  }

  clearCache() {
    this.textureCache.forEach(tex => tex.dispose());
    this.textureCache.clear();
  }
}

export const legendGenerator = new LegendGenerator();
