// Player Inventory & Supplier Shop System
// Manages player coins/budget, warehouse stock of mechanical keyboard parts, and purchases

import {
  CASE_MATERIALS,
  CASE_COLORS,
  PCB_TYPES,
  DAMPENING_LAYERS,
  PLATE_MATERIALS,
  STABILIZERS,
  SWITCHES,
  KEYCAP_PROFILES,
  KEYCAP_THEMES,
  ADDON_ACCESSORIES
} from '../data/parts-catalog.js';
import { audioManager } from '../engine/audio.js';

export class InventorySystem {
  constructor() {
    this.coins = 500; // Starting capital ($500)
    this.stock = new Map(); // itemId -> quantity
    this.initStarterStock();
  }

  initStarterStock() {
    // All parts start with 0 stock; player buys parts based on customer quests using their $500 starting capital!
  }

  addStock(itemId, qty = 1) {
    const current = this.stock.get(itemId) || 0;
    this.stock.set(itemId, current + qty);
  }

  useStock(itemId, qty = 1) {
    const current = this.stock.get(itemId) || 0;
    if (current >= qty) {
      this.stock.set(itemId, current - qty);
      return true;
    }
    return false;
  }

  getStock(itemId) {
    return this.stock.get(itemId) || 0;
  }

  hasStock(itemId, qty = 1) {
    return (this.stock.get(itemId) || 0) >= qty;
  }

  buyItem(itemId, price, qty = 1) {
    const total = price * qty;
    if (this.coins >= total) {
      this.coins -= total;
      this.addStock(itemId, qty);
      audioManager.playCoins();
      return true;
    }
    return false;
  }

  sellItem(itemId, price, qty = 1) {
    const current = this.stock.get(itemId) || 0;
    if (current >= qty) {
      this.stock.set(itemId, current - qty);
      this.coins += price * qty;
      audioManager.playCoins();
      return true;
    }
    return false;
  }

  addCoins(amount) {
    this.coins += amount;
    audioManager.playCoins();
  }
}

export const inventory = new InventorySystem();
