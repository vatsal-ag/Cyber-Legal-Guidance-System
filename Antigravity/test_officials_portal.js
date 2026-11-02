/**
 * Integration & Unit Tests for Officials Command Portal & Cross-Site Synchronization
 */

const fs = require('fs');
const assert = require('assert');
const path = require('path');

console.log('=== [1/4] VALIDATING OFFICIALS_PORTAL.HTML FILE & SCRIPT SYNTAX ===');
const officialsHtml = fs.readFileSync('officials_portal.html', 'utf8');
assert(officialsHtml.length > 5000, 'officials_portal.html must not be empty');

// Check script blocks in officials_portal.html
const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let match, scriptCount = 0;
while ((match = scriptRegex.exec(officialsHtml)) !== null) {
  const code = match[2];
  if (!code.trim()) continue;
  new Function(code);
  scriptCount++;
}
console.log(`✓ officials_portal.html: ${scriptCount} script block(s) validated with 0 syntax errors.`);

console.log('\n=== [2/4] VERIFYING RECIPROCAL PORTAL NAVIGATION LINKS ===');
const citizenHtml = fs.readFileSync('cyber_legal_guidance_system.html', 'utf8');

assert(citizenHtml.includes('href="officials_portal.html"'), 'Citizen portal must link to officials_portal.html');
assert(officialsHtml.includes('href="cyber_legal_guidance_system.html"'), 'Officials portal must link to cyber_legal_guidance_system.html');
console.log('✓ Reciprocal cross-portal navigation verified:');
console.log('  - Citizen Portal -> Officials Portal: PRESENT');
console.log('  - Officials Portal -> Citizen Portal: PRESENT');

console.log('\n=== [3/4] TESTING SHARED DATABASE ENGINE (CLGS_DB) ===');
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

const { CLGS_DB, BIO_SVGS } = require('./clgs_db.js');
assert(CLGS_DB, 'CLGS_DB must be exported');
assert(BIO_SVGS, 'BIO_SVGS must be exported');

// 1. Seed check
CLGS_DB.init();
const initialCases = CLGS_DB.getAll();
assert.strictEqual(initialCases.length, 6, `Expected 6 initial seeded cases, got ${initialCases.length}`);
console.log(`✓ Initial DB seeded with ${initialCases.length} realistic cyber investigation cases.`);

// Check case properties
const daCase = CLGS_DB.getById('CYBER-2026-DA8921');
assert(daCase, 'Digital Arrest case must exist');
assert.strictEqual(daCase.complainant.name, 'Dr. Ramesh Chandra Sen');
assert.strictEqual(daCase.financial.amount, '45,00,000');
assert.strictEqual(daCase.financial.freezeNoticeIssued, true);
assert(daCase.biometrics.isVerified, 'Biometrics must be verified');
assert(daCase.biometrics.snapshots.center, 'Center blink snapshot must be present');
assert(daCase.biometrics.snapshots.turn_left, 'Left profile snapshot must be present');
assert(daCase.biometrics.snapshots.turn_right, 'Right profile snapshot must be present');
assert(daCase.biometrics.snapshots.tilt_vertical, '3D depth snapshot must be present');
console.log('✓ Sample case integrity verified (KYC, Financials, 4-Angle Biometrics, Evidence).');

// 2. Status update test
const updatedStatusCase = CLGS_DB.updateStatus('CYBER-2026-SX9930', 'Under Active Investigation', 'Extortionist VoIP call IP traced to Mewat cluster.', 'Insp. V. Singh', 'LEO-2026');
assert.strictEqual(updatedStatusCase.status, 'Under Active Investigation');
assert(updatedStatusCase.caseDiary.some(d => d.notes.includes('Mewat cluster')), 'Case diary entry must be recorded');
console.log('✓ Status update & Case diary logging verified.');

// 3. Section 106 BNSS Freeze Notice generation
const freezeNoticeText = CLGS_DB.generateFreezeNoticeText(daCase);
assert(freezeNoticeText.includes('SECTION 106 OF BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023'), 'Must cite Section 106 BNSS');
assert(freezeNoticeText.includes('Axis Bank A/C 924020087612984'), 'Must include target account');
assert(freezeNoticeText.includes('₹45,00,000/-'), 'Must include loss amount');
console.log('✓ Section 106 BNSS Bank Freeze Notice generation verified.');

// 4. Export & Import JSON test
const exportedJSON = CLGS_DB.exportJSON();
assert(exportedJSON.startsWith('['), 'Export must be JSON array');
const parsedExport = JSON.parse(exportedJSON);
assert.strictEqual(parsedExport.length, 6);

const importedCount = CLGS_DB.importJSON(JSON.stringify([
  {
    id: 'CYBER-2026-TEST99',
    filedAt: new Date().toISOString(),
    status: 'Pending Triage',
    priority: 'Priority 1 (Critical)',
    complainant: { name: 'Test User', phone: '+91-99999-99999' },
    incident: { crimeType: 'digital_arrest' }
  }
]));
assert(importedCount >= 7, 'Imported count must include new test record');
assert(CLGS_DB.getById('CYBER-2026-TEST99'), 'Imported test record must exist');
console.log('✓ JSON Database Export & Import verified.');

// 5. Delete test
const deleted = CLGS_DB.delete('CYBER-2026-TEST99');
assert.strictEqual(deleted, true);
assert.strictEqual(CLGS_DB.getById('CYBER-2026-TEST99'), null);
console.log('✓ Complaint deletion verified.');

console.log('\n=== [4/4] EMULATING CITIZEN COMPLAINT INTAKE & TRANSMISSION ===');
const citizenComplaint = {
  id: 'CYBER-2026-LIVE01',
  filedAt: new Date().toISOString(),
  status: 'Pending Triage',
  priority: 'Priority 1 (Govt Spoof / Critical Threat)',
  complainantMode: 'citizen',
  complainant: {
    name: 'Ananya Deshmukh',
    phone: '+91-98200-11223',
    email: 'ananya.d@fintech-advisory.com',
    address: 'Flat 12B, Sea Green Apartments, Worli',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018'
  },
  incident: {
    date: '2026-11-02',
    time: '08:30 AM',
    platform: 'WhatsApp & Telegram',
    crimeType: 'stock_trading_scam',
    crimeLabel: 'Fake Institutional Stock Trading & WhatsApp VIP Wealth Scam',
    narration: 'Victim lured into high-yield trading group. Disbursed ₹15,00,000 across 2 accounts.'
  },
  financial: {
    amount: '15,00,000',
    utr: 'HDFC20261102998812',
    victimBank: 'Kotak Mahindra Bank',
    suspectTarget: 'ICICI Bank A/C 001201992831'
  },
  suspect: {
    phone: '+91-90123-45678',
    upi: 'wealth.clearing@icici',
    bank: 'ICICI Bank A/C 001201992831 (IFSC: ICIC0000012)'
  },
  biometrics: {
    isVerified: true,
    score: 99.1,
    snapshots: {
      center: BIO_SVGS.blink,
      turn_left: BIO_SVGS.profile_left,
      turn_right: BIO_SVGS.profile_right,
      tilt_vertical: BIO_SVGS.depth_3d
    }
  },
  evidence: [
    {
      name: 'Bank_Transfer_Slip_15L.pdf',
      category: 'Transaction Record',
      size: '220 KB',
      type: 'application/pdf',
      sha256: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    }
  ]
};

CLGS_DB.save(citizenComplaint);
const retrievedCitizen = CLGS_DB.getById('CYBER-2026-LIVE01');
assert(retrievedCitizen, 'Citizen complaint must be retrievable by officials portal');
assert.strictEqual(retrievedCitizen.complainant.name, 'Ananya Deshmukh');
assert.strictEqual(retrievedCitizen.biometrics.isVerified, true);
assert(retrievedCitizen.biometrics.snapshots.center.includes('data:image/svg+xml'), 'Biometric photo must be preserved');
console.log('✓ Citizen-to-LEO transmission emulation: SUCCESS.');

console.log('\n======================================================');
console.log('🎉 ALL INTEGRATION AND UNIT TESTS PASSED WITH 100% SUCCESS!');
console.log('======================================================\n');
