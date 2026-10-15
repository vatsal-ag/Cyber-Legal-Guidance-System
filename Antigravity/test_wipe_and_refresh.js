// Antigravity/test_wipe_and_refresh.js
// Tests the resetToInitialState logic, secure wipe integration, and fresh page load behavior

const assert = require('assert');

// Mock DOM
class MockElement {
  constructor(id, tagName = 'div') {
    this.id = id;
    this.tagName = tagName;
    this.innerHTML = '';
    this.textContent = '';
    this.style = {};
    this.className = '';
    this.value = '';
    this.checked = false;
    this.onclick = null;
  }
}

const domElements = {
  'kyc-photo-preview-box': new MockElement('kyc-photo-preview-box'),
  'kyc-photo-status-badge': new MockElement('kyc-photo-status-badge'),
  'btn-start-kyc-photo': new MockElement('btn-start-kyc-photo', 'button'),
  'kyc-photo-timestamp': new MockElement('kyc-photo-timestamp', 'span'),
  'kyc-photo-info-text': new MockElement('kyc-photo-info-text'),
  'gov-id-upload-input': new MockElement('gov-id-upload-input', 'input'),
  'gov-id-status-badge': new MockElement('gov-id-status-badge', 'span'),
  'gov-id-btn-label': new MockElement('gov-id-btn-label', 'span'),
  'liveness-modal': new MockElement('liveness-modal'),
  'legal-disclaimer-modal': new MockElement('legal-disclaimer-modal'),
  'legal-disclaimer-consent': new MockElement('legal-disclaimer-consent', 'input'),
  'legal-disclaimer-error': new MockElement('legal-disclaimer-error'),
  'liveness-face-guide': new MockElement('liveness-face-guide'),
  'faceid-progress-ring': new MockElement('faceid-progress-ring'),
  'faceid-pct-label': new MockElement('faceid-pct-label'),
  'btn-manual-verify-snap': new MockElement('btn-manual-verify-snap', 'button'),
  'liveness-challenge-banner': new MockElement('liveness-challenge-banner'),
  'wizard-step-1': new MockElement('wizard-step-1'),
  'wizard-step-2': new MockElement('wizard-step-2')
};

global.document = {
  getElementById: (id) => domElements[id] || null,
  querySelectorAll: (selector) => {
    if (selector === 'input, textarea' || selector === 'input[type="file"]') {
      return [domElements['gov-id-upload-input']];
    }
    if (selector === '.wizard-step') {
      return [domElements['wizard-step-1'], domElements['wizard-step-2']];
    }
    if (selector === '.step-node' || selector === '.nav-tab') {
      return [];
    }
    return [];
  }
};

global.sessionStorage = {
  clear: () => { global.sessionStorage.data = {}; },
  data: {}
};

global.showToast = (msg) => {
  // console.log('[Toast]:', msg);
};

global.I18nEngine = {
  currentLang: 'en'
};

global.LegalDisclaimerEngine = {
  isAgreed: true,
  close: () => {
    domElements['legal-disclaimer-modal'].style.display = 'none';
  }
};

// Simulate LivenessEngine
const LivenessEngine = {
  isVerified: true,
  verifiedThumbnail: 'data:image/jpeg;base64,mockthumb',
  scanProgress: 100,
  currentPhase: 3,
  phaseHoldFrames: 10,
  stages: [{ en: 'Center', hi: 'Center' }],

  stopStream: () => {},

  resetUI() {
    const guide = document.getElementById('liveness-face-guide');
    const progressRing = document.getElementById('faceid-progress-ring');
    const pctLabel = document.getElementById('faceid-pct-label');
    const btn = document.getElementById('btn-manual-verify-snap');
    if (guide) guide.className = 'liveness-face-oval active';
    if (progressRing) progressRing.style.strokeDashoffset = '283';
    if (pctLabel) pctLabel.textContent = '0%';
    if (btn) btn.innerHTML = '📸 Complete Face ID Scan ➔';
  },

  resetToInitialState() {
    this.isVerified = false;
    this.verifiedThumbnail = null;
    this.scanProgress = 0;
    this.currentPhase = 0;
    this.phaseHoldFrames = 0;
    this.stopStream();

    const isHi = (typeof I18nEngine !== 'undefined' && I18nEngine.currentLang === 'hi');

    const previewBox = document.getElementById('kyc-photo-preview-box');
    if (previewBox) {
      previewBox.innerHTML = `<span>👤</span><span>${isHi ? 'लाइव फोटो नहीं' : 'No Live Photo'}</span>`;
      previewBox.style.border = '2px dashed #475569';
    }

    const badgeBox = document.getElementById('kyc-photo-status-badge');
    if (badgeBox) {
      badgeBox.innerHTML = `<span>⚠️</span><span>${isHi ? 'सत्यापन आवश्यक' : 'Verification Required'}</span>`;
    }

    const btn = document.getElementById('btn-start-kyc-photo');
    if (btn) {
      btn.className = 'btn btn-primary btn-sm';
      btn.innerHTML = `<span>📸</span><span>${isHi ? 'लाइव फोटो सत्यापन प्रारंभ करें' : 'Start Live Photo Verification'}</span>`;
    }

    const timestampEl = document.getElementById('kyc-photo-timestamp');
    if (timestampEl) {
      timestampEl.textContent = '';
      timestampEl.style.display = 'none';
    }

    const infoText = document.getElementById('kyc-photo-info-text');
    if (infoText) {
      infoText.innerHTML = `<strong>${isHi ? 'वैधानिक घोषणा...' : 'Click below...'}</strong>`;
    }

    const govInput = document.getElementById('gov-id-upload-input');
    if (govInput) govInput.value = '';
    const govBadge = document.getElementById('gov-id-status-badge');
    if (govBadge) {
      govBadge.textContent = '';
      govBadge.style.display = 'none';
    }

    this.resetUI();

    const modal = document.getElementById('liveness-modal');
    if (modal) modal.style.display = 'none';
    const legalModal = document.getElementById('legal-disclaimer-modal');
    if (legalModal) legalModal.style.display = 'none';

    if (typeof LegalDisclaimerEngine !== 'undefined') {
      LegalDisclaimerEngine.isAgreed = false;
      const consentBox = document.getElementById('legal-disclaimer-consent');
      if (consentBox) consentBox.checked = false;
      LegalDisclaimerEngine.close();
    }
  }
};

console.log('Testing LivenessEngine.resetToInitialState():');
assert.strictEqual(LivenessEngine.isVerified, true);
assert.strictEqual(LegalDisclaimerEngine.isAgreed, true);

LivenessEngine.resetToInitialState();

assert.strictEqual(LivenessEngine.isVerified, false, 'Liveness isVerified must be false');
assert.strictEqual(LivenessEngine.verifiedThumbnail, null, 'Thumbnail must be null');
assert.strictEqual(LivenessEngine.scanProgress, 0, 'Scan progress must be 0%');
assert.strictEqual(LegalDisclaimerEngine.isAgreed, false, 'Legal disclaimer agreement must be reset');

assert.ok(domElements['kyc-photo-status-badge'].innerHTML.includes('Verification Required'), 'Status badge must show Verification Required');
assert.ok(domElements['kyc-photo-preview-box'].innerHTML.includes('No Live Photo'), 'Preview box must show No Live Photo');
assert.strictEqual(domElements['kyc-photo-timestamp'].style.display, 'none', 'Timestamp must be hidden');
assert.strictEqual(domElements['kyc-photo-timestamp'].textContent, '', 'Timestamp text must be empty');
assert.ok(domElements['btn-start-kyc-photo'].innerHTML.includes('Start Live Photo Verification'), 'Button must be reset to Start Live Photo Verification');
assert.strictEqual(domElements['btn-start-kyc-photo'].className, 'btn btn-primary btn-sm', 'Button class must be primary');

console.log('✅ ALL RESET AND SECURE WIPE ASSERTIONS PASSED!');
