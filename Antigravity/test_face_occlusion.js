// Unit test for face occlusion & hand coverage detection algorithms

function detectFaceAndOcclusion(data, width, height) {
  const minX = Math.floor(width * 0.24);
  const maxX = Math.floor(width * 0.76);
  const minY = Math.floor(height * 0.18);
  const maxY = Math.floor(height * 0.82);

  let totalLum = 0;
  let sampledPixels = 0;
  let skinPixels = 0;

  const zoneForehead = { r: 0, g: 0, b: 0, count: 0, lum: 0 };
  const zoneLeftEye = { r: 0, g: 0, b: 0, count: 0, lum: 0 };
  const zoneRightEye = { r: 0, g: 0, b: 0, count: 0, lum: 0 };
  const zoneMouth = { r: 0, g: 0, b: 0, count: 0, lum: 0 };
  const zoneCheeks = { r: 0, g: 0, b: 0, count: 0, lum: 0 };
  const zoneChin = { r: 0, g: 0, b: 0, count: 0, lum: 0 };

  const fhY1 = Math.floor(height * 0.20), fhY2 = Math.floor(height * 0.32);
  const eyeY1 = Math.floor(height * 0.34), eyeY2 = Math.floor(height * 0.48);
  const eyeLeftX1 = Math.floor(width * 0.28), eyeLeftX2 = Math.floor(width * 0.46);
  const eyeRightX1 = Math.floor(width * 0.54), eyeRightX2 = Math.floor(width * 0.72);
  const chkY1 = Math.floor(height * 0.50), chkY2 = Math.floor(height * 0.64);
  const mthY1 = Math.floor(height * 0.66), mthY2 = Math.floor(height * 0.80);
  const mthX1 = Math.floor(width * 0.36), mthX2 = Math.floor(width * 0.64);
  const chinY1 = Math.floor(height * 0.81), chinY2 = Math.floor(height * 0.90);

  for (let y = minY; y < maxY; y += 2) {
    for (let x = minX; x < maxX; x += 2) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      totalLum += lum;
      sampledPixels++;

      const isSkin = (r > 45 && g > 35 && b > 20 && r > g && (r - b) > 10 && (r - g) > 4);
      if (isSkin) skinPixels++;

      if (y >= fhY1 && y <= fhY2 && x >= minX && x <= maxX) {
        zoneForehead.r += r; zoneForehead.g += g; zoneForehead.b += b; zoneForehead.lum += lum; zoneForehead.count++;
      }
      if (y >= eyeY1 && y <= eyeY2 && x >= eyeLeftX1 && x <= eyeLeftX2) {
        zoneLeftEye.r += r; zoneLeftEye.g += g; zoneLeftEye.b += b; zoneLeftEye.lum += lum; zoneLeftEye.count++;
      }
      if (y >= eyeY1 && y <= eyeY2 && x >= eyeRightX1 && x <= eyeRightX2) {
        zoneRightEye.r += r; zoneRightEye.g += g; zoneRightEye.b += b; zoneRightEye.lum += lum; zoneRightEye.count++;
      }
      if (y >= chkY1 && y <= chkY2 && (x < mthX1 || x > mthX2)) {
        zoneCheeks.r += r; zoneCheeks.g += g; zoneCheeks.b += b; zoneCheeks.lum += lum; zoneCheeks.count++;
      }
      if (y >= mthY1 && y <= mthY2 && x >= mthX1 && x <= mthX2) {
        zoneMouth.r += r; zoneMouth.g += g; zoneMouth.b += b; zoneMouth.lum += lum; zoneMouth.count++;
      }
      if (y >= chinY1 && y <= chinY2 && x >= mthX1 && x <= mthX2) {
        zoneChin.r += r; zoneChin.g += g; zoneChin.b += b; zoneChin.lum += lum; zoneChin.count++;
      }
    }
  }

  const avgLum = sampledPixels > 0 ? (totalLum / sampledPixels) : 0;
  const skinRatio = sampledPixels > 0 ? (skinPixels / sampledPixels) : 0;

  if (avgLum < 38) return { status: 'low_light', avgLum: Math.round(avgLum) };
  if (avgLum > 238) return { status: 'overexposed', avgLum: Math.round(avgLum) };
  if (skinRatio < 0.22) return { status: 'no_face' };

  const fhLum = zoneForehead.count > 0 ? zoneForehead.lum / zoneForehead.count : 0;
  const leftEyeLum = zoneLeftEye.count > 0 ? zoneLeftEye.lum / zoneLeftEye.count : 0;
  const rightEyeLum = zoneRightEye.count > 0 ? zoneRightEye.lum / zoneRightEye.count : 0;
  const cheeksLum = zoneCheeks.count > 0 ? zoneCheeks.lum / zoneCheeks.count : 0;
  const mouthLum = zoneMouth.count > 0 ? zoneMouth.lum / zoneMouth.count : 0;
  const chinLum = zoneChin.count > 0 ? zoneChin.lum / zoneChin.count : 0;

  const mouthR = zoneMouth.count > 0 ? zoneMouth.r / zoneMouth.count : 0;
  const mouthG = zoneMouth.count > 0 ? zoneMouth.g / zoneMouth.count : 0;
  const mouthB = zoneMouth.count > 0 ? zoneMouth.b / zoneMouth.count : 0;

  const cheeksR = zoneCheeks.count > 0 ? zoneCheeks.r / zoneCheeks.count : 0;
  const cheeksG = zoneCheeks.count > 0 ? zoneCheeks.g / zoneCheeks.count : 0;
  const cheeksB = zoneCheeks.count > 0 ? zoneCheeks.b / zoneCheeks.count : 0;

  // Mask checks
  if (mouthB > mouthR + 6 || mouthG > mouthR + 6) return { status: 'mask_detected', type: 'surgical' };
  if (fhLum > 55 && mouthLum < 30 && (fhLum - mouthLum) > 34) return { status: 'mask_detected', type: 'dark_mask' };
  if (mouthR > 175 && mouthG > 175 && mouthB > 175 && Math.abs(mouthR - mouthB) < 16) return { status: 'mask_detected', type: 'white_mask' };

  // Hand / Covering checks:
  // 1. One side of face covered by hand / card
  const eyeAsymmetry = Math.abs(leftEyeLum - rightEyeLum);
  if (eyeAsymmetry > 32) {
    return { status: 'face_covered', reason: 'side_of_face_covered' };
  }

  // 2. Eyes covered by hand / fingers
  const eyeContrast = Math.max(0, fhLum - ((leftEyeLum + rightEyeLum) / 2));
  if (eyeContrast < 3.5 && skinRatio > 0.45) {
    return { status: 'face_covered', reason: 'eyes_covered' };
  }

  // 3. Hand covering mouth & lower face
  const mouthRedRatio = mouthR / (mouthG + 1);
  const cheekRedRatio = cheeksR / (cheeksG + 1);
  const mouthVariance = Math.abs(mouthLum - chinLum) + Math.abs(mouthLum - cheeksLum);
  
  if (mouthVariance < 6.0 && Math.abs(mouthRedRatio - cheekRedRatio) < 0.045 && skinRatio > 0.40) {
    return { status: 'face_covered', reason: 'hand_covering_mouth' };
  }

  // 4. Palm / hand jammed directly into camera lens
  if (skinRatio > 0.92 && Math.abs(fhLum - mouthLum) < 4.0 && Math.abs(leftEyeLum - rightEyeLum) < 3.0) {
    return { status: 'face_covered', reason: 'camera_blocked_by_hand' };
  }

  return { status: 'ok', avgLum: Math.round(avgLum), eyeContrast: Math.round(eyeContrast) };
}

// Generate mock 320x240 frame buffers
function createMockFrame(preset) {
  const w = 320, h = 240;
  const buf = new Uint8ClampedArray(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      // Default dark room background
      buf[idx] = 20; buf[idx+1] = 25; buf[idx+2] = 30; buf[idx+3] = 255;

      const isInsideFace = (x >= 80 && x <= 240 && y >= 45 && y <= 195);
      if (isInsideFace) {
        if (preset === 'normal_face') {
          // Forehead: skin
          if (y < 80) {
            buf[idx] = 190; buf[idx+1] = 145; buf[idx+2] = 115;
          } else if (y >= 80 && y <= 115) {
            // Eyes: pupils/brows are darker
            const isEye = (x >= 95 && x <= 145) || (x >= 175 && x <= 225);
            buf[idx] = isEye ? 75 : 185;
            buf[idx+1] = isEye ? 55 : 140;
            buf[idx+2] = isEye ? 40 : 110;
          } else if (y > 115 && y <= 155) {
            // Cheeks: skin
            buf[idx] = 185; buf[idx+1] = 140; buf[idx+2] = 110;
          } else if (y > 155 && y <= 185) {
            // Mouth: lips with higher red ratio
            const isLip = (x >= 115 && x <= 205);
            buf[idx] = isLip ? 195 : 180;
            buf[idx+1] = isLip ? 100 : 135;
            buf[idx+2] = isLip ? 95 : 105;
          } else {
            // Chin
            buf[idx] = 175; buf[idx+1] = 130; buf[idx+2] = 100;
          }
        } else if (preset === 'hand_over_mouth') {
          // Forehead & eyes normal, but mouth is flat palm skin
          if (y < 80) {
            buf[idx] = 190; buf[idx+1] = 145; buf[idx+2] = 115;
          } else if (y >= 80 && y <= 115) {
            const isEye = (x >= 95 && x <= 145) || (x >= 175 && x <= 225);
            buf[idx] = isEye ? 75 : 185;
            buf[idx+1] = isEye ? 55 : 140;
            buf[idx+2] = isEye ? 40 : 110;
          } else {
            // Palm across lower face: identical flat skin tone throughout
            buf[idx] = 182; buf[idx+1] = 142; buf[idx+2] = 112;
          }
        } else if (preset === 'hand_over_eyes') {
          // Eyes area covered by hand
          buf[idx] = 185; buf[idx+1] = 142; buf[idx+2] = 112;
        } else if (preset === 'surgical_mask') {
          if (y < 120) {
            buf[idx] = 190; buf[idx+1] = 145; buf[idx+2] = 115;
          } else {
            // Blue mask
            buf[idx] = 70; buf[idx+1] = 150; buf[idx+2] = 210;
          }
        } else if (preset === 'low_light') {
          buf[idx] = 25; buf[idx+1] = 22; buf[idx+2] = 18;
        }
      }
    }
  }
  return buf;
}

const mockNormal = createMockFrame('normal_face');
const mockHandMouth = createMockFrame('hand_over_mouth');
const mockHandEyes = createMockFrame('hand_over_eyes');
const mockMask = createMockFrame('surgical_mask');
const mockDark = createMockFrame('low_light');

console.log("Normal face:", detectFaceAndOcclusion(mockNormal, 320, 240));
console.log("Hand over mouth:", detectFaceAndOcclusion(mockHandMouth, 320, 240));
console.log("Hand over eyes:", detectFaceAndOcclusion(mockHandEyes, 320, 240));
console.log("Surgical mask:", detectFaceAndOcclusion(mockMask, 320, 240));
console.log("Low light:", detectFaceAndOcclusion(mockDark, 320, 240));
