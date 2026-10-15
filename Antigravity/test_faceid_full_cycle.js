// Comprehensive Integration Test for FaceID Enrollment, Re-Verification & 4-Shot Gallery

const fs = require('fs');
const assert = require('assert');

// 1. Mock minimal DOM environment
global.document = {
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id,
        style: {},
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        },
        innerHTML: '',
        textContent: '',
        setAttribute(k, v) { this[k] = v; },
        querySelector(selector) {
          return { innerHTML: '', style: {} };
        },
        play: async () => {},
        pause: () => {},
        getContext: () => ({
          translate() {},
          scale() {},
          drawImage() {},
          fillRect() {},
          beginPath() {},
          arc() {},
          stroke() {},
          setLineDash() {},
          fillText() {},
          createLinearGradient() { return { addColorStop() {} }; },
          getImageData() {
            return { data: new Uint8ClampedArray(320 * 240 * 4) };
          }
        }),
        toDataURL: () => 'data:image/jpeg;base64,mockImageSnapshotData' + Math.random().toString(36).substring(7)
      };
    }
    return this.elements[id];
  },
  createElement(tag) {
    return {
      tagName: tag,
      width: 320,
      height: 240,
      getContext(type) {
        return {
          translate() {},
          scale() {},
          drawImage() {},
          fillRect() {},
          beginPath() {},
          arc() {},
          stroke() {},
          setLineDash() {},
          fillText() {},
          createLinearGradient() { return { addColorStop() {} }; },
          getImageData() {
            return { data: new Uint8ClampedArray(320 * 240 * 4) };
          }
        };
      },
      toDataURL() {
        return 'data:image/jpeg;base64,mockImageSnapshotData' + Math.random().toString(36).substring(7);
      }
    };
  }
};

global.navigator = {
  mediaDevices: {
    getUserMedia: async () => ({
      active: true,
      getTracks: () => [{ stop: () => {} }]
    })
  }
};

global.showToast = (msg) => { /* Mock toast */ };
global.requestAnimationFrame = (fn) => 1;
global.cancelAnimationFrame = (id) => {};
global.clearInterval = () => {};

// 2. Extract and run LivenessEngine from cyber_legal_guidance_system.html
const html = fs.readFileSync('cyber_legal_guidance_system.html', 'utf8');
const match = html.match(/const LivenessEngine = \{[\s\S]*?\n\};\n\n\/\/ ═+/);
if (!match) {
  throw new Error("Could not extract LivenessEngine from html!");
}

const engineCode = match[0].replace(/\n\/\/ ═+$/, '') + '\nreturn LivenessEngine;';
const LivenessEngine = new Function(engineCode)();

async function runTests() {
  console.log("=== TEST SUITE: 4-Angle FaceID Enrollment & Re-Verification Cycle ===");

  // Test 1: Initial Start
  console.log("\n[Test 1] Testing Initial Start...");
  await LivenessEngine.start(2);
  assert.strictEqual(LivenessEngine.isVerified, false, "Initial isVerified must be false");
  assert.strictEqual(LivenessEngine.scanProgress, 0, "Initial scanProgress must be 0");
  assert.strictEqual(LivenessEngine.currentPhase, 0, "Must start at Phase 0");
  console.log("✓ Initial start verified cleanly.");

  // Test 2: Phase 0 Advancement (Center)
  console.log("\n[Test 2] Testing Phase 0 Center Face Alignment (0% -> 25%)...");
  for (let i = 0; i < 10; i++) {
    LivenessEngine.advanceFaceIDEnrollment(160, 120, 8, 320, 240, false);
  }
  assert.strictEqual(LivenessEngine.currentPhase, 1, "Must advance to Phase 1");
  assert.strictEqual(LivenessEngine.scanProgress, 25, "Scan progress must reach 25%");
  assert(LivenessEngine.phaseSnapshots.center !== null, "Center snapshot must be captured");
  console.log("✓ Phase 0 passed and center snapshot captured:", LivenessEngine.phaseSnapshots.center.substring(0, 45) + "...");

  // Test 3: Phase 1 Advancement (Turn Right)
  console.log("\n[Test 3] Testing Phase 1 Turn Head Right (25% -> 50%)...");
  for (let i = 0; i < 10; i++) {
    LivenessEngine.advanceFaceIDEnrollment(180, 120, 15, 320, 240, false);
  }
  assert.strictEqual(LivenessEngine.currentPhase, 2, "Must advance to Phase 2");
  assert.strictEqual(LivenessEngine.scanProgress, 50, "Scan progress must reach 50%");
  assert(LivenessEngine.phaseSnapshots.turn_right !== null, "Right turn snapshot must be captured");
  console.log("✓ Phase 1 passed and turn_right snapshot captured:", LivenessEngine.phaseSnapshots.turn_right.substring(0, 45) + "...");

  // Test 4: Phase 2 Advancement (Turn Left)
  console.log("\n[Test 4] Testing Phase 2 Turn Head Left (50% -> 75%)...");
  for (let i = 0; i < 10; i++) {
    LivenessEngine.advanceFaceIDEnrollment(140, 120, 15, 320, 240, false);
  }
  assert.strictEqual(LivenessEngine.currentPhase, 3, "Must advance to Phase 3");
  assert.strictEqual(LivenessEngine.scanProgress, 75, "Scan progress must reach 75%");
  assert(LivenessEngine.phaseSnapshots.turn_left !== null, "Left turn snapshot must be captured");
  console.log("✓ Phase 2 passed and turn_left snapshot captured:", LivenessEngine.phaseSnapshots.turn_left.substring(0, 45) + "...");

  // Test 5: Phase 3 Advancement (Tilt)
  console.log("\n[Test 5] Testing Phase 3 Tilt (75% -> 100%)...");
  for (let i = 0; i < 10; i++) {
    LivenessEngine.advanceFaceIDEnrollment(160, 90, 15, 320, 240, false);
  }
  assert.strictEqual(LivenessEngine.isEnrollmentComplete, true, "Enrollment must be marked complete");
  assert.strictEqual(LivenessEngine.scanProgress, 100, "Scan progress must reach 100%");
  assert(LivenessEngine.phaseSnapshots.tilt_vertical !== null, "Tilt snapshot must be captured");
  console.log("✓ Phase 3 passed and tilt_vertical snapshot captured:", LivenessEngine.phaseSnapshots.tilt_vertical.substring(0, 45) + "...");

  // Test 6: Final Verification & Card UI with 4-Shot Gallery
  console.log("\n[Test 6] Testing Complete Verification and 4-Shot Gallery Rendering...");
  LivenessEngine.completeVerification();
  assert.strictEqual(LivenessEngine.isVerified, true, "isVerified must be true");

  const multiGallery = global.document.getElementById('kyc-multi-shots-gallery');
  assert.strictEqual(multiGallery.style.display, 'block', "Gallery must be displayed block");
  assert(multiGallery.innerHTML.includes('1. Frontal (Center)'), "Gallery must contain Frontal shot");
  assert(multiGallery.innerHTML.includes('2. Right Profile'), "Gallery must contain Right Profile shot");
  assert(multiGallery.innerHTML.includes('3. Left Profile'), "Gallery must contain Left Profile shot");
  assert(multiGallery.innerHTML.includes('4. 3D Tilt Biometric'), "Gallery must contain Tilt shot");
  console.log("✓ 4-Shot Gallery successfully rendered with all 4 angle previews!");

  // Test 7: RE-VERIFICATION CYCLE (User clicks Re-Verify Live Photo)
  console.log("\n[Test 7] Testing Re-Verification Cycle (Verify Again)...");
  await LivenessEngine.start(2);
  assert.strictEqual(LivenessEngine.isVerified, false, "Must reset isVerified to false on Re-Verify");
  assert.strictEqual(LivenessEngine.isEnrollmentComplete, false, "Must reset isEnrollmentComplete to false");
  assert.strictEqual(LivenessEngine.scanProgress, 0, "Must reset progress to 0%");
  assert.strictEqual(LivenessEngine.currentPhase, 0, "Must reset currentPhase to 0");
  assert.strictEqual(LivenessEngine.videoEl.srcObject, LivenessEngine.stream, "Video element must be connected to new stream");

  // Advance through re-verification
  for (let i = 0; i < 10; i++) LivenessEngine.advanceFaceIDEnrollment(160, 120, 10, 320, 240, false);
  for (let i = 0; i < 10; i++) LivenessEngine.advanceFaceIDEnrollment(180, 120, 10, 320, 240, false);
  for (let i = 0; i < 10; i++) LivenessEngine.advanceFaceIDEnrollment(140, 120, 10, 320, 240, false);
  for (let i = 0; i < 10; i++) LivenessEngine.advanceFaceIDEnrollment(160, 90, 10, 320, 240, false);

  assert.strictEqual(LivenessEngine.scanProgress, 100, "Re-verification scan progress must reach 100%");
  LivenessEngine.completeVerification();
  assert.strictEqual(LivenessEngine.isVerified, true, "Re-verification must succeed with isVerified = true");
  console.log("✓ Re-verification cycle successfully completed without any errors or blocking!");

  // Test 8: Reset to Initial State (Secure Wipe / Page Refresh)
  console.log("\n[Test 8] Testing Secure Wipe / Reset to Initial State...");
  LivenessEngine.resetToInitialState();
  assert.strictEqual(LivenessEngine.isVerified, false, "isVerified must be reset to false");
  assert.strictEqual(multiGallery.style.display, 'none', "Gallery must be hidden");
  assert.strictEqual(multiGallery.innerHTML, '', "Gallery content must be cleared");
  assert.strictEqual(LivenessEngine.phaseSnapshots.center, null, "Snapshots must be cleared");
  assert.strictEqual(LivenessEngine.videoEl.srcObject, null, "Video srcObject must be detached");
  console.log("✓ Secure wipe / Refresh reset verified 100% cleanly!");

  console.log("\n=================================================================");
  console.log("🎉 ALL 8 BIOMETRIC FACEID & 4-SHOT GALLERY TESTS PASSED SUCCESSFULLY!");
  console.log("=================================================================");
}

runTests().catch(err => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
