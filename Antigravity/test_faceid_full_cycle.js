// Comprehensive Integration Test for FaceID Enrollment, Blink Detection, Profile Capture & Gallery

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
        toDataURL: () => 'data:image/jpeg;base64,mockImageSnapshotData_' + id
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
        return 'data:image/jpeg;base64,mockImageSnapshotData_' + Math.random().toString(36).substring(7);
      }
    };
  }
};

Object.defineProperty(global, 'navigator', {
  value: {
    mediaDevices: {
      getUserMedia: async () => ({
        active: true,
        getTracks: () => [{ stop: () => {} }]
      })
    }
  },
  configurable: true,
  writable: true
});

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
  console.log("=== TEST SUITE: Strict Anti-Spoof FaceID, Eye Blink & Profile Turn Verification ===");

  // Test 1: Initial Start
  console.log("\n[Test 1] Testing Initial Start & State Setup...");
  await LivenessEngine.start(2);
  assert.strictEqual(LivenessEngine.isVerified, false, "Initial isVerified must be false");
  assert.strictEqual(LivenessEngine.scanProgress, 0, "Initial scanProgress must be 0");
  assert.strictEqual(LivenessEngine.currentPhase, 0, "Must start at Phase 0");
  assert.strictEqual(LivenessEngine.hasBlinked, false, "Initial hasBlinked must be false");
  assert.strictEqual(LivenessEngine.blinkState, 'WAITING', "Initial blinkState must be WAITING");
  console.log("✓ Initial start verified cleanly.");

  // Test 2: Morphological Non-Face & Flat Surface Rejection
  console.log("\n[Test 2] Testing Flat Surface (Wall/Table/Hand) Rejection in detectFaceAndOcclusion...");
  // Simulate flat wall/table pixel data (uniform beige/wood color, no eye variance)
  const wallWidth = 320, wallHeight = 240;
  const wallData = new Uint8ClampedArray(wallWidth * wallHeight * 4);
  for (let i = 0; i < wallData.length; i += 4) {
    wallData[i] = 160;     // R
    wallData[i + 1] = 130; // G
    wallData[i + 2] = 100; // B
    wallData[i + 3] = 255;
  }
  const wallResult = LivenessEngine.detectFaceAndOcclusion({ data: wallData }, wallWidth, wallHeight);
  assert.strictEqual(wallResult.status, 'no_face', "Flat wall/table must be rejected with status: no_face");
  assert.strictEqual(wallResult.reason, 'no_facial_features', "Must identify reason as lack of facial features/eye sockets");
  console.log("✓ Flat wall/table successfully rejected as non-face:", wallResult);

  // Test 3: Eye Blink Requirement in Phase 0
  console.log("\n[Test 3] Testing Natural Eye Blink Requirement in Phase 0...");
  const faceConditionOpen = {
    status: 'ok',
    skinCenterX: 160,
    skinCenterY: 120,
    skinPixels: 15000,
    leftHalfSkin: 7500,
    rightHalfSkin: 7500,
    eyeOpenness: 14,
    eyeStdDev: 8.5
  };

  // User looks straight with eyes open without blinking
  for (let i = 0; i < 6; i++) {
    LivenessEngine.advanceFaceIDEnrollment(faceConditionOpen, 160, 120, 2, 320, 240, false);
  }
  assert.strictEqual(LivenessEngine.currentPhase, 0, "Without blink, must remain in Phase 0");
  assert.strictEqual(LivenessEngine.hasBlinked, false, "hasBlinked must still be false");
  assert.strictEqual(LivenessEngine.blinkState, 'EYES_OPEN', "blinkState must transition to EYES_OPEN");
  console.log("✓ Eyes open baseline established; phase held until live blink is detected.");

  // User blinks: eyelids close over pupils (eyeOpenness drops below threshold)
  const faceConditionBlinkDip = {
    ...faceConditionOpen,
    eyeOpenness: 4.0,
    eyeStdDev: 2.5
  };
  LivenessEngine.advanceFaceIDEnrollment(faceConditionBlinkDip, 160, 120, 15, 320, 240, false);
  assert.strictEqual(LivenessEngine.blinkState, 'EYES_DIP', "Eyelid closure detected; blinkState must be EYES_DIP");

  // User eyes reopen (blink cycle complete within 1-10 frames)
  LivenessEngine.advanceFaceIDEnrollment(faceConditionOpen, 160, 120, 10, 320, 240, false);
  assert.strictEqual(LivenessEngine.hasBlinked, true, "Live blink must be confirmed (hasBlinked = true)");
  assert.strictEqual(LivenessEngine.currentPhase, 1, "Must advance to Phase 1 after confirmed live blink");
  assert.strictEqual(LivenessEngine.scanProgress, 25, "Scan progress must reach 25%");
  assert(LivenessEngine.phaseSnapshots.center !== null, "Center snapshot must be captured");
  console.log("✓ Live human blink confirmed! Advanced to Phase 1 with verified center photo.");

  // Test 4: Phase 1 Advancement (Turn Head Right Profile)
  console.log("\n[Test 4] Testing Phase 1 Turn Head Right Profile (25% -> 50%)...");
  // If user does not turn head, must not advance
  LivenessEngine.advanceFaceIDEnrollment(faceConditionOpen, 160, 120, 5, 320, 240, false);
  assert.strictEqual(LivenessEngine.currentPhase, 1, "Must remain in Phase 1 if user hasn't turned head");

  // User turns head right (in mirrored selfie camera: skinCenterX shifts or leftHalf skin asymmetry increases)
  const faceConditionTurnRight = {
    status: 'ok',
    skinCenterX: 135, // shifted left on screen
    skinCenterY: 120,
    skinPixels: 14000,
    leftHalfSkin: 9500, // significant lateral asymmetry
    rightHalfSkin: 4500,
    eyeOpenness: 10,
    eyeStdDev: 7
  };
  for (let i = 0; i < 7; i++) {
    LivenessEngine.advanceFaceIDEnrollment(faceConditionTurnRight, 135, 120, 20, 320, 240, false);
  }
  assert.strictEqual(LivenessEngine.currentPhase, 2, "Must advance to Phase 2 after holding right turn");
  assert.strictEqual(LivenessEngine.scanProgress, 50, "Scan progress must reach 50%");
  assert(LivenessEngine.phaseSnapshots.turn_right !== null, "Right profile snapshot must be captured");
  console.log("✓ Right profile turn verified! Advanced to Phase 2 with right profile photo.");

  // Test 5: Phase 2 Advancement (Turn Head Left Profile)
  console.log("\n[Test 5] Testing Phase 2 Turn Head Left Profile (50% -> 75%)...");
  const faceConditionTurnLeft = {
    status: 'ok',
    skinCenterX: 185, // shifted right on screen
    skinCenterY: 120,
    skinPixels: 14000,
    leftHalfSkin: 4500,
    rightHalfSkin: 9500,
    eyeOpenness: 10,
    eyeStdDev: 7
  };
  for (let i = 0; i < 7; i++) {
    LivenessEngine.advanceFaceIDEnrollment(faceConditionTurnLeft, 185, 120, 20, 320, 240, false);
  }
  assert.strictEqual(LivenessEngine.currentPhase, 3, "Must advance to Phase 3 after holding left turn");
  assert.strictEqual(LivenessEngine.scanProgress, 75, "Scan progress must reach 75%");
  assert(LivenessEngine.phaseSnapshots.turn_left !== null, "Left profile snapshot must be captured");
  console.log("✓ Left profile turn verified! Advanced to Phase 3 with left profile photo.");

  // Test 6: Phase 3 Advancement (Tilt Head Nod 3D Depth)
  console.log("\n[Test 6] Testing Phase 3 Vertical Tilt (75% -> 100%)...");
  const faceConditionTilt = {
    status: 'ok',
    skinCenterX: 160,
    skinCenterY: 85, // vertical nod shift
    skinPixels: 14000,
    leftHalfSkin: 7000,
    rightHalfSkin: 7000,
    eyeOpenness: 10,
    eyeStdDev: 7
  };
  for (let i = 0; i < 7; i++) {
    LivenessEngine.advanceFaceIDEnrollment(faceConditionTilt, 160, 85, 20, 320, 240, false);
  }
  assert.strictEqual(LivenessEngine.isEnrollmentComplete, true, "Enrollment must be marked complete");
  assert.strictEqual(LivenessEngine.scanProgress, 100, "Scan progress must reach 100%");
  assert(LivenessEngine.phaseSnapshots.tilt_vertical !== null, "Tilt snapshot must be captured");
  console.log("✓ 3D tilt completed! All 4 biometric angles captured.");

  // Test 7: Final Verification & 4-Shot Gallery Badges
  console.log("\n[Test 7] Testing Card UI with 4-Shot Gallery Badges...");
  LivenessEngine.completeVerification();
  assert.strictEqual(LivenessEngine.isVerified, true, "isVerified must be true");

  const multiGallery = global.document.getElementById('kyc-multi-shots-gallery');
  assert.strictEqual(multiGallery.style.display, 'block', "Gallery must be displayed block");
  assert(multiGallery.innerHTML.includes('1. Frontal (Blink Verified)'), "Gallery must contain Frontal (Blink Verified)");
  assert(multiGallery.innerHTML.includes('2. Right Profile'), "Gallery must contain Right Profile");
  assert(multiGallery.innerHTML.includes('3. Left Profile'), "Gallery must contain Left Profile");
  assert(multiGallery.innerHTML.includes('4. 3D Tilt Biometric'), "Gallery must contain 3D Tilt Biometric");
  assert(multiGallery.innerHTML.includes('✓ Live Blink'), "Gallery must have ✓ Live Blink badge");
  assert(multiGallery.innerHTML.includes('✓ Profile Pass'), "Gallery must have ✓ Profile Pass badge");
  assert(multiGallery.innerHTML.includes('✓ 3D Depth'), "Gallery must have ✓ 3D Depth badge");
  console.log("✓ 4-Shot Gallery successfully rendered with authentic badges and previews!");

  // Test 8: RE-VERIFICATION CYCLE (User clicks Re-Verify Live Photo)
  console.log("\n[Test 8] Testing Re-Verification Cycle (Verify Again)...");
  await LivenessEngine.start(2);
  assert.strictEqual(LivenessEngine.isVerified, false, "Must reset isVerified to false on Re-Verify");
  assert.strictEqual(LivenessEngine.isEnrollmentComplete, false, "Must reset isEnrollmentComplete to false");
  assert.strictEqual(LivenessEngine.scanProgress, 0, "Must reset progress to 0%");
  assert.strictEqual(LivenessEngine.currentPhase, 0, "Must reset currentPhase to 0");
  assert.strictEqual(LivenessEngine.hasBlinked, false, "Must reset hasBlinked on re-verify");

  // Advance through full re-verification
  // Phase 0 blink
  for (let i = 0; i < 4; i++) LivenessEngine.advanceFaceIDEnrollment(faceConditionOpen, 160, 120, 2, 320, 240, false);
  LivenessEngine.advanceFaceIDEnrollment(faceConditionBlinkDip, 160, 120, 10, 320, 240, false);
  LivenessEngine.advanceFaceIDEnrollment(faceConditionOpen, 160, 120, 10, 320, 240, false);
  assert.strictEqual(LivenessEngine.currentPhase, 1, "Re-verification: must advance to Phase 1 after blink");

  // Phase 1 right turn
  for (let i = 0; i < 7; i++) LivenessEngine.advanceFaceIDEnrollment(faceConditionTurnRight, 135, 120, 20, 320, 240, false);
  assert.strictEqual(LivenessEngine.currentPhase, 2, "Re-verification: must advance to Phase 2");

  // Phase 2 left turn
  for (let i = 0; i < 7; i++) LivenessEngine.advanceFaceIDEnrollment(faceConditionTurnLeft, 185, 120, 20, 320, 240, false);
  assert.strictEqual(LivenessEngine.currentPhase, 3, "Re-verification: must advance to Phase 3");

  // Phase 3 tilt
  for (let i = 0; i < 7; i++) LivenessEngine.advanceFaceIDEnrollment(faceConditionTilt, 160, 85, 20, 320, 240, false);
  assert.strictEqual(LivenessEngine.isEnrollmentComplete, true, "Re-verification: must reach 100%");

  LivenessEngine.completeVerification();
  assert.strictEqual(LivenessEngine.isVerified, true, "Re-verification must succeed with isVerified = true");
  console.log("✓ Re-verification cycle successfully completed without any errors or blocking!");

  // Test 9: Reset to Initial State (Secure Wipe / Page Refresh)
  console.log("\n[Test 9] Testing Secure Wipe / Reset to Initial State...");
  LivenessEngine.resetToInitialState();
  assert.strictEqual(LivenessEngine.isVerified, false, "isVerified must be reset to false");
  assert.strictEqual(LivenessEngine.hasBlinked, false, "hasBlinked must be reset to false");
  assert.strictEqual(multiGallery.style.display, 'none', "Gallery must be hidden");
  assert.strictEqual(multiGallery.innerHTML, '', "Gallery content must be cleared");
  assert.strictEqual(LivenessEngine.phaseSnapshots.center, null, "Snapshots must be cleared");
  console.log("✓ Secure wipe / Refresh reset verified 100% cleanly!");

  console.log("\n=================================================================");
  console.log("🎉 ALL 9 BIOMETRIC FACEID, BLINK & PROFILE TESTS PASSED SUCCESSFULLY!");
  console.log("=================================================================");
}

runTests().catch(err => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
