// Test script for Face ID Enrollment State Machine & Occlusion Guards

class MockFaceIDEngine {
  constructor() {
    this.scanProgress = 0; // 0 to 100%
    this.currentPhase = 0; // 0: Center, 1: Turn Right, 2: Turn Left, 3: Tilt 3D
    this.isVerified = false;
    this.phaseFrames = 0;
    this.phases = [
      { id: 'center', label: 'Center Face & Hold Still', minPct: 0, targetPct: 25 },
      { id: 'turn_right', label: 'Slowly Turn Head to the RIGHT ➡️', minPct: 25, targetPct: 50 },
      { id: 'turn_left', label: 'Slowly Turn Head to the LEFT ⬅️', minPct: 50, targetPct: 75 },
      { id: 'tilt_vertical', label: 'Tilt Head Up or Down ↕️', minPct: 75, targetPct: 100 }
    ];
  }

  processFrame(condition, motion) {
    // If face is covered or lighting is bad, HALT immediately
    if (condition.status !== 'ok') {
      return {
        halted: true,
        reason: condition.status,
        progress: this.scanProgress,
        phase: this.phases[this.currentPhase].id
      };
    }

    // Phase 0: Center Face alignment
    if (this.currentPhase === 0) {
      this.phaseFrames++;
      this.scanProgress = Math.min(25, Math.round((this.phaseFrames / 15) * 25));
      if (this.phaseFrames >= 15) {
        this.currentPhase = 1;
        this.phaseFrames = 0;
      }
    }
    // Phase 1: Turn Right
    else if (this.currentPhase === 1) {
      if (motion.heading === 'right' || motion.avgX > 165) {
        this.phaseFrames++;
        this.scanProgress = Math.min(50, 25 + Math.round((this.phaseFrames / 12) * 25));
        if (this.phaseFrames >= 12) {
          this.currentPhase = 2;
          this.phaseFrames = 0;
        }
      }
    }
    // Phase 2: Turn Left
    else if (this.currentPhase === 2) {
      if (motion.heading === 'left' || motion.avgX < 155) {
        this.phaseFrames++;
        this.scanProgress = Math.min(75, 50 + Math.round((this.phaseFrames / 12) * 25));
        if (this.phaseFrames >= 12) {
          this.currentPhase = 3;
          this.phaseFrames = 0;
        }
      }
    }
    // Phase 3: Tilt Up/Down
    else if (this.currentPhase === 3) {
      if (motion.isVertical || motion.count > 25) {
        this.phaseFrames++;
        this.scanProgress = Math.min(100, 75 + Math.round((this.phaseFrames / 10) * 25));
        if (this.phaseFrames >= 10 && this.scanProgress >= 100) {
          this.isVerified = true;
        }
      }
    }

    return {
      halted: false,
      progress: this.scanProgress,
      phase: this.phases[Math.min(3, this.currentPhase)].id,
      verified: this.isVerified
    };
  }

  tryManualVerify(condition) {
    if (condition.status === 'face_covered') {
      return { allowed: false, message: 'Face is covered or obstructed' };
    }
    if (condition.status === 'mask_detected') {
      return { allowed: false, message: 'Mask detected' };
    }
    if (condition.status === 'low_light') {
      return { allowed: false, message: 'Low lighting' };
    }
    if (this.scanProgress < 50) {
      return { allowed: false, message: 'Incomplete Face ID scan' };
    }
    return { allowed: true };
  }
}

// Run test simulation
const engine = new MockFaceIDEngine();

console.log("--- 1. Testing Occlusion Interruption ---");
const frameCovered = { status: 'face_covered', reason: 'hand_covering_mouth' };
let res = engine.processFrame(frameCovered, {});
console.log("Covered face frame:", res);
console.log("Manual verify while covered:", engine.tryManualVerify(frameCovered));

console.log("\n--- 2. Testing Normal Enrollment Flow ---");
const frameOk = { status: 'ok' };
// 15 frames of center
for (let i = 0; i < 15; i++) engine.processFrame(frameOk, {});
console.log("After Phase 0 (Center):", engine.scanProgress + "%", "Phase:", engine.currentPhase);

// 12 frames of turn right
for (let i = 0; i < 12; i++) engine.processFrame(frameOk, { heading: 'right', avgX: 180 });
console.log("After Phase 1 (Turn Right):", engine.scanProgress + "%", "Phase:", engine.currentPhase);

// Try manual verify after 50% with covered face:
console.log("Manual verify at 50% with covered face:", engine.tryManualVerify(frameCovered));
console.log("Manual verify at 50% with clean face:", engine.tryManualVerify(frameOk));

// 12 frames of turn left
for (let i = 0; i < 12; i++) engine.processFrame(frameOk, { heading: 'left', avgX: 130 });
console.log("After Phase 2 (Turn Left):", engine.scanProgress + "%", "Phase:", engine.currentPhase);

// 10 frames of tilt
for (let i = 0; i < 10; i++) engine.processFrame(frameOk, { isVertical: true, count: 40 });
console.log("After Phase 3 (Tilt):", engine.scanProgress + "%", "Verified:", engine.isVerified);
