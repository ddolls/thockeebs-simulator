// Precise CAD-grade Mechanical Keyboard Layouts matching User References
// Layout 60% (ANSI), 65% (Mono 65 V2), 75% Exploded (Custom 75), 80%/85% (Mono 80 TKL), 100% (Mono 100 V2)
// Every layout has strictly uniform row widths (widthUnit) to guarantee zero horizontal drift across rows.

export const LAYOUT_PRESETS = {
  '60': {
    id: '60',
    name: '60% Minimalist (ANSI)',
    ref: 'Image 1: Logitech G Pro 60 style',
    totalU: 15.0,
    rowCount: 5,
    widthUnit: 15.0,
    hasKnobOption: false,
    hasLcdOption: false,
    rows: [
      [
        { code: 'Escape', label: 'ESC', sub: '`~', w: 1, isSpecial: true },
        { code: 'Digit1', label: '1', sub: '!', w: 1 }, { code: 'Digit2', label: '2', sub: '@', w: 1 },
        { code: 'Digit3', label: '3', sub: '#', w: 1 }, { code: 'Digit4', label: '4', sub: '$', w: 1 },
        { code: 'Digit5', label: '5', sub: '%', w: 1 }, { code: 'Digit6', label: '6', sub: '^', w: 1 },
        { code: 'Digit7', label: '7', sub: '&', w: 1 }, { code: 'Digit8', label: '8', sub: '*', w: 1 },
        { code: 'Digit9', label: '9', sub: '(', w: 1 }, { code: 'Digit0', label: '0', sub: ')', w: 1 },
        { code: 'Minus', label: '-', sub: '_', w: 1 }, { code: 'Equal', label: '=', sub: '+', w: 1 },
        { code: 'Backspace', label: 'BACK', sub: '⌫', w: 2, isSpecial: true }
      ],
      [
        { code: 'Tab', label: 'TAB', sub: '⇥', w: 1.5, isSpecial: true },
        { code: 'KeyQ', label: 'Q', sub: 'た', w: 1 }, { code: 'KeyW', label: 'W', sub: 'て', w: 1 },
        { code: 'KeyE', label: 'E', sub: 'い', w: 1 }, { code: 'KeyR', label: 'R', sub: 'す', w: 1 },
        { code: 'KeyT', label: 'T', sub: 'か', w: 1 }, { code: 'KeyY', label: 'Y', sub: 'ん', w: 1 },
        { code: 'KeyU', label: 'U', sub: 'な', w: 1 }, { code: 'KeyI', label: 'I', sub: 'に', w: 1 },
        { code: 'KeyO', label: 'O', sub: 'ら', w: 1 }, { code: 'KeyP', label: 'P', sub: 'せ', w: 1 },
        { code: 'BracketLeft', label: '[', sub: '゛', w: 1 }, { code: 'BracketRight', label: ']', sub: '゜', w: 1 },
        { code: 'Backslash', label: '\\', sub: 'む', w: 1.5 }
      ],
      [
        { code: 'CapsLock', label: 'CAPS', sub: '⇪', w: 1.75, isSpecial: true },
        { code: 'KeyA', label: 'A', sub: 'ち', w: 1 }, { code: 'KeyS', label: 'S', sub: 'と', w: 1 },
        { code: 'KeyD', label: 'D', sub: 'し', w: 1 }, { code: 'KeyF', label: 'F', sub: 'は', w: 1 },
        { code: 'KeyG', label: 'G', sub: 'き', w: 1 }, { code: 'KeyH', label: 'H', sub: 'く', w: 1 },
        { code: 'KeyJ', label: 'J', sub: 'ま', w: 1 }, { code: 'KeyK', label: 'K', sub: 'の', w: 1 },
        { code: 'KeyL', label: 'L', sub: 'り', w: 1 }, { code: 'Semicolon', label: ';', sub: 'れ', w: 1 },
        { code: 'Quote', label: '\'', sub: 'け', w: 1 },
        { code: 'Enter', label: 'ENTER', sub: '↵', w: 2.25, isAccent: true }
      ],
      [
        { code: 'ShiftLeft', label: 'SHIFT', sub: '⇧', w: 2.25, isSpecial: true },
        { code: 'KeyZ', label: 'Z', sub: 'つ', w: 1 }, { code: 'KeyX', label: 'X', sub: 'さ', w: 1 },
        { code: 'KeyC', label: 'C', sub: 'そ', w: 1 }, { code: 'KeyV', label: 'V', sub: 'ひ', w: 1 },
        { code: 'KeyB', label: 'B', sub: 'こ', w: 1 }, { code: 'KeyN', label: 'N', sub: 'み', w: 1 },
        { code: 'KeyM', label: 'M', sub: 'も', w: 1 }, { code: 'Comma', label: ',', sub: 'ね', w: 1 },
        { code: 'Period', label: '.', sub: 'る', w: 1 }, { code: 'Slash', label: '/', sub: 'め', w: 1 },
        { code: 'ShiftRight', label: 'SHIFT', sub: '⇧', w: 2.75, isSpecial: true }
      ],
      [
        { code: 'ControlLeft', label: 'CTRL', sub: 'Ctrl', w: 1.25, isSpecial: true },
        { code: 'MetaLeft', label: 'WIN', sub: '❖', w: 1.25, isSpecial: true },
        { code: 'AltLeft', label: 'ALT', sub: 'Alt', w: 1.25, isSpecial: true },
        { code: 'Space', label: '', sub: '', w: 6.25, isSpacebar: true },
        { code: 'AltRight', label: 'ALT', sub: 'Alt', w: 1.25, isSpecial: true },
        { code: 'MetaRight', label: 'WIN', sub: '❖', w: 1.25, isSpecial: true },
        { code: 'ContextMenu', label: 'MENU', sub: '▤', w: 1.25, isSpecial: true },
        { code: 'ControlRight', label: 'CTRL', sub: 'Ctrl', w: 1.25, isSpecial: true }
      ]
    ]
  },

  '65': {
    id: '65',
    name: '65% Golden (Mono 65 V2)',
    ref: 'Image 2: Mono 65 V2 Black style with 4-key right nav column & dedicated arrows',
    totalU: 16.0,
    rowCount: 5,
    widthUnit: 16.0,
    hasKnobOption: false,
    hasLcdOption: false,
    rows: [
      // Row 0: 1 + 12 + 2 + 1 = 16.0U
      [
        { code: 'Escape', label: 'ESC', sub: 'Esc', w: 1, isSpecial: true },
        { code: 'Digit1', label: '1', sub: '!', w: 1 }, { code: 'Digit2', label: '2', sub: '@', w: 1 },
        { code: 'Digit3', label: '3', sub: '#', w: 1 }, { code: 'Digit4', label: '4', sub: '$', w: 1 },
        { code: 'Digit5', label: '5', sub: '%', w: 1 }, { code: 'Digit6', label: '6', sub: '^', w: 1 },
        { code: 'Digit7', label: '7', sub: '&', w: 1 }, { code: 'Digit8', label: '8', sub: '*', w: 1 },
        { code: 'Digit9', label: '9', sub: '(', w: 1 }, { code: 'Digit0', label: '0', sub: ')', w: 1 },
        { code: 'Minus', label: '-', sub: '_', w: 1 }, { code: 'Equal', label: '=', sub: '+', w: 1 },
        { code: 'Backspace', label: 'BACK', sub: '⌫', w: 2, isSpecial: true },
        { code: 'Home', label: 'HOME', sub: '⇱', w: 1, isAccent: true }
      ],
      // Row 1: 1.5 + 12 + 1.5 + 1 = 16.0U
      [
        { code: 'Tab', label: 'TAB', sub: '⇥', w: 1.5, isSpecial: true },
        { code: 'KeyQ', label: 'Q', sub: 'た', w: 1 }, { code: 'KeyW', label: 'W', sub: 'て', w: 1 },
        { code: 'KeyE', label: 'E', sub: 'い', w: 1 }, { code: 'KeyR', label: 'R', sub: 'す', w: 1 },
        { code: 'KeyT', label: 'T', sub: 'か', w: 1 }, { code: 'KeyY', label: 'Y', sub: 'ん', w: 1 },
        { code: 'KeyU', label: 'U', sub: 'な', w: 1 }, { code: 'KeyI', label: 'I', sub: 'に', w: 1 },
        { code: 'KeyO', label: 'O', sub: 'ら', w: 1 }, { code: 'KeyP', label: 'P', sub: 'せ', w: 1 },
        { code: 'BracketLeft', label: '[', sub: '゛', w: 1 }, { code: 'BracketRight', label: ']', sub: '゜', w: 1 },
        { code: 'Backslash', label: '\\', sub: 'む', w: 1.5 },
        { code: 'Delete', label: 'DEL', sub: 'Del', w: 1, isAccent: true }
      ],
      // Row 2: 1.75 + 11 + 2.25 + 1 = 16.0U
      [
        { code: 'CapsLock', label: 'CAPS', sub: '⇪', w: 1.75, isSpecial: true },
        { code: 'KeyA', label: 'A', sub: 'ち', w: 1 }, { code: 'KeyS', label: 'S', sub: 'と', w: 1 },
        { code: 'KeyD', label: 'D', sub: 'し', w: 1 }, { code: 'KeyF', label: 'F', sub: 'は', w: 1 },
        { code: 'KeyG', label: 'G', sub: 'き', w: 1 }, { code: 'KeyH', label: 'H', sub: 'く', w: 1 },
        { code: 'KeyJ', label: 'J', sub: 'ま', w: 1 }, { code: 'KeyK', label: 'K', sub: 'の', w: 1 },
        { code: 'KeyL', label: 'L', sub: 'り', w: 1 }, { code: 'Semicolon', label: ';', sub: 'れ', w: 1 },
        { code: 'Quote', label: '\'', sub: 'け', w: 1 },
        { code: 'Enter', label: 'ENTER', sub: '↵', w: 2.25, isAccent: true },
        { code: 'PageUp', label: 'PGUP', sub: '⇞', w: 1, isAccent: true }
      ],
      // Row 3: 2.25 + 10 + 1.75 + 1 + 1 = 16.0U
      [
        { code: 'ShiftLeft', label: 'SHIFT', sub: '⇧', w: 2.25, isSpecial: true },
        { code: 'KeyZ', label: 'Z', sub: 'つ', w: 1 }, { code: 'KeyX', label: 'X', sub: 'さ', w: 1 },
        { code: 'KeyC', label: 'C', sub: 'そ', w: 1 }, { code: 'KeyV', label: 'V', sub: 'ひ', w: 1 },
        { code: 'KeyB', label: 'B', sub: 'こ', w: 1 }, { code: 'KeyN', label: 'N', sub: 'み', w: 1 },
        { code: 'KeyM', label: 'M', sub: 'も', w: 1 }, { code: 'Comma', label: ',', sub: 'ね', w: 1 },
        { code: 'Period', label: '.', sub: 'る', w: 1 }, { code: 'Slash', label: '/', sub: 'め', w: 1 },
        { code: 'ShiftRight', label: 'SHIFT', sub: '⇧', w: 1.75, isSpecial: true },
        { code: 'ArrowUp', label: '▲', sub: '', w: 1, isAccent: true },
        { code: 'PageDown', label: 'PGDN', sub: '⇟', w: 1, isAccent: true }
      ],
      // Row 4: 1.25*3 + 6.25 + 1.25*2 + 0.5(blocker) + 1*3 = 3.75 + 6.25 + 2.5 + 0.5 + 3.0 = 16.0U
      [
        { code: 'ControlLeft', label: 'CTRL', sub: 'Ctrl', w: 1.25, isSpecial: true },
        { code: 'MetaLeft', label: 'WIN', sub: '❖', w: 1.25, isSpecial: true },
        { code: 'AltLeft', label: 'ALT', sub: 'Alt', w: 1.25, isSpecial: true },
        { code: 'Space', label: '', sub: '', w: 6.25, isSpacebar: true },
        { code: 'AltRight', label: 'ALT', sub: 'Alt', w: 1.25, isSpecial: true },
        { code: 'Fn', label: 'FN', sub: 'Fn', w: 1.25, isSpecial: true },
        { code: 'Blocker65', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true },
        { code: 'ArrowLeft', label: '◀', sub: '', w: 1, isAccent: true },
        { code: 'ArrowDown', label: '▼', sub: '', w: 1, isAccent: true },
        { code: 'ArrowRight', label: '▶', sub: '', w: 1, isAccent: true }
      ]
    ]
  },

  '75': {
    id: '75',
    name: '75% Exploded (Custom 75)',
    ref: 'Image 3: Exploded 75% with dedicated sound badge / knob corner & F-row gaps',
    totalU: 16.0,
    rowCount: 6,
    widthUnit: 16.0,
    hasKnobOption: true,
    hasLcdOption: true,
    rows: [
      // Row 0 (F-row): 1 + 0.5 + 4 + 0.5 + 4 + 0.5 + 4 + 0.5 + 1 = 16.0U
      [
        { code: 'Escape', label: 'ESC', sub: 'Esc', w: 1, isSpecial: true },
        { code: 'GapF1', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'F1', label: 'F1', sub: '', w: 1 }, { code: 'F2', label: 'F2', sub: '', w: 1 },
        { code: 'F3', label: 'F3', sub: '', w: 1 }, { code: 'F4', label: 'F4', sub: '', w: 1 },
        { code: 'GapF2', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'F5', label: 'F5', sub: '', w: 1 }, { code: 'F6', label: 'F6', sub: '', w: 1 },
        { code: 'F7', label: 'F7', sub: '', w: 1 }, { code: 'F8', label: 'F8', sub: '', w: 1 },
        { code: 'GapF3', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'F9', label: 'F9', sub: '', w: 1 }, { code: 'F10', label: 'F10', sub: '', w: 1 },
        { code: 'F11', label: 'F11', sub: '', w: 1 }, { code: 'F12', label: 'F12', sub: '', w: 1 },
        { code: 'GapF4', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'Delete', label: 'DEL', sub: '', w: 1, isSpecial: true, canBeReplacedByKnob: true, canBeReplacedByLcd: true }
      ],
      // Row 1: 1 + 12 + 2 + 1 = 16.0U
      [
        { code: 'Backquote', label: '`', sub: '~', w: 1 },
        { code: 'Digit1', label: '1', sub: '!', w: 1 }, { code: 'Digit2', label: '2', sub: '@', w: 1 },
        { code: 'Digit3', label: '3', sub: '#', w: 1 }, { code: 'Digit4', label: '4', sub: '$', w: 1 },
        { code: 'Digit5', label: '5', sub: '%', w: 1 }, { code: 'Digit6', label: '6', sub: '^', w: 1 },
        { code: 'Digit7', label: '7', sub: '&', w: 1 }, { code: 'Digit8', label: '8', sub: '*', w: 1 },
        { code: 'Digit9', label: '9', sub: '(', w: 1 }, { code: 'Digit0', label: '0', sub: ')', w: 1 },
        { code: 'Minus', label: '-', sub: '_', w: 1 }, { code: 'Equal', label: '=', sub: '+', w: 1 },
        { code: 'Backspace', label: 'BACK', sub: '⌫', w: 2, isSpecial: true },
        { code: 'Home', label: 'HOME', sub: '⇱', w: 1, isAccent: true }
      ],
      // Row 2: 1.5 + 12 + 1.5 + 1 = 16.0U
      [
        { code: 'Tab', label: 'TAB', sub: '⇥', w: 1.5, isSpecial: true },
        { code: 'KeyQ', label: 'Q', sub: 'た', w: 1 }, { code: 'KeyW', label: 'W', sub: 'て', w: 1 },
        { code: 'KeyE', label: 'E', sub: 'い', w: 1 }, { code: 'KeyR', label: 'R', sub: 'す', w: 1 },
        { code: 'KeyT', label: 'T', sub: 'か', w: 1 }, { code: 'KeyY', label: 'Y', sub: 'ん', w: 1 },
        { code: 'KeyU', label: 'U', sub: 'な', w: 1 }, { code: 'KeyI', label: 'I', sub: 'に', w: 1 },
        { code: 'KeyO', label: 'O', sub: 'ら', w: 1 }, { code: 'KeyP', label: 'P', sub: 'せ', w: 1 },
        { code: 'BracketLeft', label: '[', sub: '゛', w: 1 }, { code: 'BracketRight', label: ']', sub: '゜', w: 1 },
        { code: 'Backslash', label: '\\', sub: 'む', w: 1.5 },
        { code: 'PageUp', label: 'PGUP', sub: '⇞', w: 1, isAccent: true }
      ],
      // Row 3: 1.75 + 11 + 2.25 + 1 = 16.0U
      [
        { code: 'CapsLock', label: 'CAPS', sub: '⇪', w: 1.75, isSpecial: true },
        { code: 'KeyA', label: 'A', sub: 'ち', w: 1 }, { code: 'KeyS', label: 'S', sub: 'と', w: 1 },
        { code: 'KeyD', label: 'D', sub: 'し', w: 1 }, { code: 'KeyF', label: 'F', sub: 'は', w: 1 },
        { code: 'KeyG', label: 'G', sub: 'き', w: 1 }, { code: 'KeyH', label: 'H', sub: 'く', w: 1 },
        { code: 'KeyJ', label: 'J', sub: 'ま', w: 1 }, { code: 'KeyK', label: 'K', sub: 'の', w: 1 },
        { code: 'KeyL', label: 'L', sub: 'り', w: 1 }, { code: 'Semicolon', label: ';', sub: 'れ', w: 1 },
        { code: 'Quote', label: '\'', sub: 'け', w: 1 },
        { code: 'Enter', label: 'ENTER', sub: '↵', w: 2.25, isAccent: true },
        { code: 'PageDown', label: 'PGDN', sub: '⇟', w: 1, isAccent: true }
      ],
      // Row 4: 2.25 + 10 + 1.75 + 1 + 1 (Soundwave Brass Badge like Image 3) = 16.0U
      [
        { code: 'ShiftLeft', label: 'SHIFT', sub: '⇧', w: 2.25, isSpecial: true },
        { code: 'KeyZ', label: 'Z', sub: 'つ', w: 1 }, { code: 'KeyX', label: 'X', sub: 'さ', w: 1 },
        { code: 'KeyC', label: 'C', sub: 'そ', w: 1 }, { code: 'KeyV', label: 'V', sub: 'ひ', w: 1 },
        { code: 'KeyB', label: 'B', sub: 'こ', w: 1 }, { code: 'KeyN', label: 'N', sub: 'み', w: 1 },
        { code: 'KeyM', label: 'M', sub: 'も', w: 1 }, { code: 'Comma', label: ',', sub: 'ね', w: 1 },
        { code: 'Period', label: '.', sub: 'る', w: 1 }, { code: 'Slash', label: '/', sub: 'め', w: 1 },
        { code: 'ShiftRight', label: 'SHIFT', sub: '⇧', w: 1.75, isSpecial: true },
        { code: 'ArrowUp', label: '▲', sub: '', w: 1, isAccent: true },
        { code: 'SoundBadge75', label: 'SOUND', sub: '', w: 1, isEmpty: true, isSoundBadge: true }
      ],
      // Row 5: 1.25*3 + 6.25 + 1.25*2 + 0.5(blocker) + 1*3 = 16.0U
      [
        { code: 'ControlLeft', label: 'CTRL', sub: 'Ctrl', w: 1.25, isSpecial: true },
        { code: 'MetaLeft', label: 'WIN', sub: '❖', w: 1.25, isSpecial: true },
        { code: 'AltLeft', label: 'ALT', sub: 'Alt', w: 1.25, isSpecial: true },
        { code: 'Space', label: '', sub: '', w: 6.25, isSpacebar: true },
        { code: 'AltRight', label: 'ALT', sub: 'Alt', w: 1.25, isSpecial: true },
        { code: 'Fn', label: 'FN', sub: 'Fn', w: 1.25, isSpecial: true },
        { code: 'Blocker75', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'ArrowLeft', label: '◀', sub: '', w: 1, isAccent: true },
        { code: 'ArrowDown', label: '▼', sub: '', w: 1, isAccent: true },
        { code: 'ArrowRight', label: '▶', sub: '', w: 1, isAccent: true }
      ]
    ]
  },

  '80': {
    id: '80',
    name: '80% TKL (Mono 80)',
    ref: 'Image 4: Mono 80 Black TKL with separated 3x2 nav block & inverted-T arrow block',
    totalU: 18.5,
    rowCount: 6,
    widthUnit: 18.5,
    hasKnobOption: false,
    hasLcdOption: false,
    rows: [
      // Row 0 (F-row): 1 + 1 + 4 + 0.5 + 4 + 0.5 + 4 + 0.5 + 1 + 1 + 1 = 18.5U
      [
        { code: 'Escape', label: 'ESC', sub: 'Esc', w: 1, isSpecial: true },
        { code: 'GapF1_80', label: '', sub: '', w: 1.0, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'F1', label: 'F1', sub: '', w: 1 }, { code: 'F2', label: 'F2', sub: '', w: 1 },
        { code: 'F3', label: 'F3', sub: '', w: 1 }, { code: 'F4', label: 'F4', sub: '', w: 1 },
        { code: 'GapF2_80', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'F5', label: 'F5', sub: '', w: 1 }, { code: 'F6', label: 'F6', sub: '', w: 1 },
        { code: 'F7', label: 'F7', sub: '', w: 1 }, { code: 'F8', label: 'F8', sub: '', w: 1 },
        { code: 'GapF3_80', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'F9', label: 'F9', sub: '', w: 1 }, { code: 'F10', label: 'F10', sub: '', w: 1 },
        { code: 'F11', label: 'F11', sub: '', w: 1 }, { code: 'F12', label: 'F12', sub: '', w: 1 },
        { code: 'GapNav_80_0', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'PrintScreen', label: 'PRT', sub: '', w: 1, isAccent: true },
        { code: 'ScrollLock', label: 'SCR', sub: '', w: 1, isAccent: true },
        { code: 'Pause', label: 'PAU', sub: '', w: 1, isAccent: true }
      ],
      // Row 1: 15.0 alphas + 0.5 spacer + 3.0 nav = 18.5U
      [
        { code: 'Backquote', label: '`', sub: '~', w: 1 },
        { code: 'Digit1', label: '1', sub: '!', w: 1 }, { code: 'Digit2', label: '2', sub: '@', w: 1 },
        { code: 'Digit3', label: '3', sub: '#', w: 1 }, { code: 'Digit4', label: '4', sub: '$', w: 1 },
        { code: 'Digit5', label: '5', sub: '%', w: 1 }, { code: 'Digit6', label: '6', sub: '^', w: 1 },
        { code: 'Digit7', label: '7', sub: '&', w: 1 }, { code: 'Digit8', label: '8', sub: '*', w: 1 },
        { code: 'Digit9', label: '9', sub: '(', w: 1 }, { code: 'Digit0', label: '0', sub: ')', w: 1 },
        { code: 'Minus', label: '-', sub: '_', w: 1 }, { code: 'Equal', label: '=', sub: '+', w: 1 },
        { code: 'Backspace', label: 'BACK', sub: '⌫', w: 2, isSpecial: true },
        { code: 'GapNav_80_1', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'Insert', label: 'INS', sub: '', w: 1 },
        { code: 'Home', label: 'HOME', sub: '', w: 1 },
        { code: 'PageUp', label: 'PGUP', sub: '⇞', w: 1 }
      ],
      // Row 2: 15.0 alphas + 0.5 spacer + 3.0 nav = 18.5U
      [
        { code: 'Tab', label: 'TAB', sub: '⇥', w: 1.5, isSpecial: true },
        { code: 'KeyQ', label: 'Q', sub: 'た', w: 1 }, { code: 'KeyW', label: 'W', sub: 'て', w: 1 },
        { code: 'KeyE', label: 'E', sub: 'い', w: 1 }, { code: 'KeyR', label: 'R', sub: 'す', w: 1 },
        { code: 'KeyT', label: 'T', sub: 'か', w: 1 }, { code: 'KeyY', label: 'Y', sub: 'ん', w: 1 },
        { code: 'KeyU', label: 'U', sub: 'な', w: 1 }, { code: 'KeyI', label: 'I', sub: 'に', w: 1 },
        { code: 'KeyO', label: 'O', sub: 'ら', w: 1 }, { code: 'KeyP', label: 'P', sub: 'せ', w: 1 },
        { code: 'BracketLeft', label: '[', sub: '゛', w: 1 }, { code: 'BracketRight', label: ']', sub: '゜', w: 1 },
        { code: 'Backslash', label: '\\', sub: 'む', w: 1.5 },
        { code: 'GapNav_80_2', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'Delete', label: 'DEL', sub: '', w: 1 },
        { code: 'End', label: 'END', sub: '', w: 1 },
        { code: 'PageDown', label: 'PGDN', sub: '⇟', w: 1 }
      ],
      // Row 3: 15.0 alphas + 0.5 spacer + 3.0 solid CNC case bridge (matching Mono 80 Image 4) = 18.5U
      [
        { code: 'CapsLock', label: 'CAPS', sub: '⇪', w: 1.75, isSpecial: true },
        { code: 'KeyA', label: 'A', sub: 'ち', w: 1 }, { code: 'KeyS', label: 'S', sub: 'と', w: 1 },
        { code: 'KeyD', label: 'D', sub: 'し', w: 1 }, { code: 'KeyF', label: 'F', sub: 'は', w: 1 },
        { code: 'KeyG', label: 'G', sub: 'き', w: 1 }, { code: 'KeyH', label: 'H', sub: 'く', w: 1 },
        { code: 'KeyJ', label: 'J', sub: 'ま', w: 1 }, { code: 'KeyK', label: 'K', sub: 'の', w: 1 },
        { code: 'KeyL', label: 'L', sub: 'り', w: 1 }, { code: 'Semicolon', label: ';', sub: 'れ', w: 1 },
        { code: 'Quote', label: '\'', sub: 'け', w: 1 },
        { code: 'Enter', label: 'ENTER', sub: '↵', w: 2.25, isAccent: true },
        { code: 'GapNav_80_3', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'TKL_Bridge_80', label: '', sub: '', w: 3.0, isEmpty: true, isBlocker: true, isCaseBlocker: true }
      ],
      // Row 4: 15.0 alphas + 0.5 spacer + 1.0 blocker + 1.0 Up arrow + 1.0 blocker = 18.5U
      [
        { code: 'ShiftLeft', label: 'SHIFT', sub: '⇧', w: 2.25, isSpecial: true },
        { code: 'KeyZ', label: 'Z', sub: 'つ', w: 1 }, { code: 'KeyX', label: 'X', sub: 'さ', w: 1 },
        { code: 'KeyC', label: 'C', sub: 'そ', w: 1 }, { code: 'KeyV', label: 'V', sub: 'ひ', w: 1 },
        { code: 'KeyB', label: 'B', sub: 'こ', w: 1 }, { code: 'KeyN', label: 'N', sub: 'み', w: 1 },
        { code: 'KeyM', label: 'M', sub: 'も', w: 1 }, { code: 'Comma', label: ',', sub: 'ね', w: 1 },
        { code: 'Period', label: '.', sub: 'る', w: 1 }, { code: 'Slash', label: '/', sub: 'め', w: 1 },
        { code: 'ShiftRight', label: 'SHIFT', sub: '⇧', w: 2.75, isSpecial: true },
        { code: 'GapNav_80_4', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'ArrowSpacer_L', label: '', sub: '', w: 1.0, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'ArrowUp', label: '▲', sub: '', w: 1.0, isAccent: true },
        { code: 'ArrowSpacer_R', label: '', sub: '', w: 1.0, isEmpty: true, isBlocker: true, isCaseBlocker: true }
      ],
      // Row 5: 15.0 alphas + 0.5 spacer + 1.0 Left + 1.0 Down + 1.0 Right = 18.5U
      [
        { code: 'ControlLeft', label: 'CTRL', sub: 'Ctrl', w: 1.25, isSpecial: true },
        { code: 'MetaLeft', label: 'WIN', sub: '❖', w: 1.25, isSpecial: true },
        { code: 'AltLeft', label: 'ALT', sub: 'Alt', w: 1.25, isSpecial: true },
        { code: 'Space', label: '', sub: '', w: 6.25, isSpacebar: true },
        { code: 'AltRight', label: 'ALT', sub: 'Alt', w: 1.25, isSpecial: true },
        { code: 'MetaRight', label: 'WIN', sub: '❖', w: 1.25, isSpecial: true },
        { code: 'ContextMenu', label: 'MENU', sub: '▤', w: 1.25, isSpecial: true },
        { code: 'ControlRight', label: 'CTRL', sub: 'Ctrl', w: 1.25, isSpecial: true },
        { code: 'GapNav_80_5', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'ArrowLeft', label: '◀', sub: '', w: 1.0, isAccent: true },
        { code: 'ArrowDown', label: '▼', sub: '', w: 1.0, isAccent: true },
        { code: 'ArrowRight', label: '▶', sub: '', w: 1.0, isAccent: true }
      ]
    ]
  },

  '100': {
    id: '100',
    name: '100% Full-Size (Mono 100 V2)',
    ref: 'Image 5: Mono 100 V2 with full ANSI alphas, dedicated Nav cluster & standard 17-key Numpad block',
    totalU: 23.0,
    rowCount: 6,
    widthUnit: 23.0,
    hasKnobOption: false,
    hasLcdOption: false,
    rows: [
      // Row 0: 15.0 F-row + 0.5 gap + 3.0 nav + 0.5 gap + 4.0 LED Indicator Panel = 23.0U
      [
        { code: 'Escape', label: 'ESC', sub: 'Esc', w: 1, isSpecial: true },
        { code: 'GapF1_100', label: '', sub: '', w: 1.0, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'F1', label: 'F1', sub: '', w: 1 }, { code: 'F2', label: 'F2', sub: '', w: 1 },
        { code: 'F3', label: 'F3', sub: '', w: 1 }, { code: 'F4', label: 'F4', sub: '', w: 1 },
        { code: 'GapF2_100', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'F5', label: 'F5', sub: '', w: 1 }, { code: 'F6', label: 'F6', sub: '', w: 1 },
        { code: 'F7', label: 'F7', sub: '', w: 1 }, { code: 'F8', label: 'F8', sub: '', w: 1 },
        { code: 'GapF3_100', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'F9', label: 'F9', sub: '', w: 1 }, { code: 'F10', label: 'F10', sub: '', w: 1 },
        { code: 'F11', label: 'F11', sub: '', w: 1 }, { code: 'F12', label: 'F12', sub: '', w: 1 },
        { code: 'GapNav_100_0', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'PrintScreen', label: 'PRT', sub: '', w: 1, isAccent: true },
        { code: 'ScrollLock', label: 'SCR', sub: '', w: 1, isAccent: true },
        { code: 'Pause', label: 'PAU', sub: '', w: 1, isAccent: true },
        { code: 'GapNum_100_0', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'NumpadLockBadge', label: 'NUM  •  CAPS  •  SCROLL', sub: '', w: 4.0, isEmpty: true, isBlocker: true, isBadge: true, isLedPanel: true }
      ],
      // Row 1: 15.0 alphas + 0.5 gap + 3.0 nav + 0.5 gap + 4.0 numpad top row (NUM, /, *, -) = 23.0U
      [
        { code: 'Backquote', label: '`', sub: '~', w: 1 },
        { code: 'Digit1', label: '1', sub: '!', w: 1 }, { code: 'Digit2', label: '2', sub: '@', w: 1 },
        { code: 'Digit3', label: '3', sub: '#', w: 1 }, { code: 'Digit4', label: '4', sub: '$', w: 1 },
        { code: 'Digit5', label: '5', sub: '%', w: 1 }, { code: 'Digit6', label: '6', sub: '^', w: 1 },
        { code: 'Digit7', label: '7', sub: '&', w: 1 }, { code: 'Digit8', label: '8', sub: '*', w: 1 },
        { code: 'Digit9', label: '9', sub: '(', w: 1 }, { code: 'Digit0', label: '0', sub: ')', w: 1 },
        { code: 'Minus', label: '-', sub: '_', w: 1 }, { code: 'Equal', label: '=', sub: '+', w: 1 },
        { code: 'Backspace', label: 'BACK', sub: '⌫', w: 2, isSpecial: true },
        { code: 'GapNav_100_1', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'Insert', label: 'INS', sub: '', w: 1 },
        { code: 'Home', label: 'HOME', sub: '', w: 1 },
        { code: 'PageUp', label: 'PGUP', sub: '⇞', w: 1 },
        { code: 'GapNum_100_1', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'NumLock', label: 'NUM', sub: '', w: 1, isSpecial: true },
        { code: 'NumpadDivide', label: '/', sub: '', w: 1 },
        { code: 'NumpadMultiply', label: '*', sub: '', w: 1 },
        { code: 'NumpadSubtract', label: '-', sub: '', w: 1 }
      ],
      // Row 2: 15.0 alphas + 0.5 gap + 3.0 nav + 0.5 gap + 4.0 numpad (7, 8, 9, + [vertical 2U]) = 23.0U
      [
        { code: 'Tab', label: 'TAB', sub: '⇥', w: 1.5, isSpecial: true },
        { code: 'KeyQ', label: 'Q', sub: 'た', w: 1 }, { code: 'KeyW', label: 'W', sub: 'て', w: 1 },
        { code: 'KeyE', label: 'E', sub: 'い', w: 1 }, { code: 'KeyR', label: 'R', sub: 'す', w: 1 },
        { code: 'KeyT', label: 'T', sub: 'か', w: 1 }, { code: 'KeyY', label: 'Y', sub: 'ん', w: 1 },
        { code: 'KeyU', label: 'U', sub: 'な', w: 1 }, { code: 'KeyI', label: 'I', sub: 'に', w: 1 },
        { code: 'KeyO', label: 'O', sub: 'ら', w: 1 }, { code: 'KeyP', label: 'P', sub: 'せ', w: 1 },
        { code: 'BracketLeft', label: '[', sub: '゛', w: 1 }, { code: 'BracketRight', label: ']', sub: '゜', w: 1 },
        { code: 'Backslash', label: '\\', sub: 'む', w: 1.5 },
        { code: 'GapNav_100_2', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'Delete', label: 'DEL', sub: '', w: 1 },
        { code: 'End', label: 'END', sub: '', w: 1 },
        { code: 'PageDown', label: 'PGDN', sub: '⇟', w: 1 },
        { code: 'GapNum_100_2', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'Numpad7', label: '7', sub: '', w: 1 },
        { code: 'Numpad8', label: '8', sub: '', w: 1 },
        { code: 'Numpad9', label: '9', sub: '', w: 1 },
        { code: 'NumpadAdd', label: '+', sub: '', w: 1, h: 2, isVertical2U: true, isAccent: true }
      ],
      // Row 3: 15.0 alphas + 0.5 gap + 3.0 solid case bridge + 0.5 gap + 4.0 numpad (4, 5, 6, [bottom half of +]) = 23.0U
      [
        { code: 'CapsLock', label: 'CAPS', sub: '⇪', w: 1.75, isSpecial: true },
        { code: 'KeyA', label: 'A', sub: 'ち', w: 1 }, { code: 'KeyS', label: 'S', sub: 'と', w: 1 },
        { code: 'KeyD', label: 'D', sub: 'し', w: 1 }, { code: 'KeyF', label: 'F', sub: 'は', w: 1 },
        { code: 'KeyG', label: 'G', sub: 'き', w: 1 }, { code: 'KeyH', label: 'H', sub: 'く', w: 1 },
        { code: 'KeyJ', label: 'J', sub: 'ま', w: 1 }, { code: 'KeyK', label: 'K', sub: 'の', w: 1 },
        { code: 'KeyL', label: 'L', sub: 'り', w: 1 }, { code: 'Semicolon', label: ';', sub: 'れ', w: 1 },
        { code: 'Quote', label: '\'', sub: 'け', w: 1 },
        { code: 'Enter', label: 'ENTER', sub: '↵', w: 2.25, isAccent: true },
        { code: 'GapNav_100_3', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'Full_Bridge_100', label: '', sub: '', w: 3.0, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'GapNum_100_3', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'Numpad4', label: '4', sub: '', w: 1 },
        { code: 'Numpad5', label: '5', sub: '', w: 1 },
        { code: 'Numpad6', label: '6', sub: '', w: 1 },
        { code: 'NumpadAdd_Occupied', label: '', sub: '', w: 1, isEmpty: true, isVerticalOccupied: true }
      ],
      // Row 4: 15.0 alphas + 0.5 gap + 1.0 blocker + 1.0 Up + 1.0 blocker + 0.5 gap + 4.0 numpad (1, 2, 3, ENT [vertical 2U]) = 23.0U
      [
        { code: 'ShiftLeft', label: 'SHIFT', sub: '⇧', w: 2.25, isSpecial: true },
        { code: 'KeyZ', label: 'Z', sub: 'つ', w: 1 }, { code: 'KeyX', label: 'X', sub: 'さ', w: 1 },
        { code: 'KeyC', label: 'C', sub: 'そ', w: 1 }, { code: 'KeyV', label: 'V', sub: 'ひ', w: 1 },
        { code: 'KeyB', label: 'B', sub: 'こ', w: 1 }, { code: 'KeyN', label: 'N', sub: 'み', w: 1 },
        { code: 'KeyM', label: 'M', sub: 'も', w: 1 }, { code: 'Comma', label: ',', sub: 'ね', w: 1 },
        { code: 'Period', label: '.', sub: 'る', w: 1 }, { code: 'Slash', label: '/', sub: 'め', w: 1 },
        { code: 'ShiftRight', label: 'SHIFT', sub: '⇧', w: 2.75, isSpecial: true },
        { code: 'GapNav_100_4', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'ArrowSpacer_L100', label: '', sub: '', w: 1.0, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'ArrowUp', label: '▲', sub: '', w: 1.0, isAccent: true },
        { code: 'ArrowSpacer_R100', label: '', sub: '', w: 1.0, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'GapNum_100_4', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'Numpad1', label: '1', sub: '', w: 1 },
        { code: 'Numpad2', label: '2', sub: '', w: 1 },
        { code: 'Numpad3', label: '3', sub: '', w: 1 },
        { code: 'NumpadEnter', label: 'ENT', sub: '', w: 1, h: 2, isVertical2U: true, isAccent: true }
      ],
      // Row 5: 15.0 alphas + 0.5 gap + 1.0 Left + 1.0 Down + 1.0 Right + 0.5 gap + 4.0 numpad (0 [2U], ., [bottom half of ENT]) = 23.0U
      [
        { code: 'ControlLeft', label: 'CTRL', sub: 'Ctrl', w: 1.25, isSpecial: true },
        { code: 'MetaLeft', label: 'WIN', sub: '❖', w: 1.25, isSpecial: true },
        { code: 'AltLeft', label: 'ALT', sub: 'Alt', w: 1.25, isSpecial: true },
        { code: 'Space', label: '', sub: '', w: 6.25, isSpacebar: true },
        { code: 'AltRight', label: 'ALT', sub: 'Alt', w: 1.25, isSpecial: true },
        { code: 'MetaRight', label: 'WIN', sub: '❖', w: 1.25, isSpecial: true },
        { code: 'ContextMenu', label: 'MENU', sub: '▤', w: 1.25, isSpecial: true },
        { code: 'ControlRight', label: 'CTRL', sub: 'Ctrl', w: 1.25, isSpecial: true },
        { code: 'GapNav_100_5', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'ArrowLeft', label: '◀', sub: '', w: 1.0, isAccent: true },
        { code: 'ArrowDown', label: '▼', sub: '', w: 1.0, isAccent: true },
        { code: 'ArrowRight', label: '▶', sub: '', w: 1.0, isAccent: true },
        { code: 'GapNum_100_5', label: '', sub: '', w: 0.5, isEmpty: true, isBlocker: true, isCaseBlocker: true },
        { code: 'Numpad0', label: '0', sub: '', w: 2.0 },
        { code: 'NumpadDecimal', label: '.', sub: '', w: 1.0 },
        { code: 'NumpadEnter_Occupied', label: '', sub: '', w: 1.0, isEmpty: true, isVerticalOccupied: true }
      ]
    ]
  }
};

// Layout 85% alias pointing to 80% TKL with custom display title
LAYOUT_PRESETS['85'] = {
  ...LAYOUT_PRESETS['80'],
  id: '85',
  name: '85% / TKL (Tenkeyless)'
};
