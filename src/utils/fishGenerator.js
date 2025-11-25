// Procedural Pixel Fish Generator
// Generates a 64x64 pixel grid representing a fish

const GRID_SIZE = 64;

// Simple deterministic PRNG (mulberry32)
function createPRNG(seed) {
  let state = seed || Math.floor(Math.random() * 0xffffffff);
  return function() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Helper: Create empty grid
function createEmptyGrid() {
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    grid[y] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      grid[y][x] = null; // null = transparent
    }
  }
  return grid;
}

// Helper: Set pixel if within bounds
function setPixel(grid, x, y, color) {
  if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
    grid[y][x] = color;
  }
}

// Helper: Check if point is inside ellipse
function isInEllipse(x, y, cx, cy, rx, ry) {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

// Helper: Check if point is inside capsule (rounded rectangle)
function isInCapsule(x, y, cx, cy, width, height, curvature = 0.3) {
  const halfW = width / 2;
  const halfH = height / 2;
  const dx = Math.abs(x - cx);
  const dy = Math.abs(y - cy);
  
  // Main rectangular body
  if (dx <= halfW && dy <= halfH) return true;
  
  // Rounded ends
  const cornerRadius = Math.min(halfW, halfH) * curvature;
  if (dx > halfW - cornerRadius && dy > halfH - cornerRadius) {
    const cornerDx = dx - (halfW - cornerRadius);
    const cornerDy = dy - (halfH - cornerRadius);
    return cornerDx * cornerDx + cornerDy * cornerDy <= cornerRadius * cornerRadius;
  }
  
  return false;
}

// Helper: Mirror mask horizontally
function mirrorMask(mask, centerX) {
  const mirrored = createEmptyGrid();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (mask[y][x]) {
        const mirroredX = centerX + (centerX - x);
        if (mirroredX >= 0 && mirroredX < GRID_SIZE) {
          mirrored[y][mirroredX] = true;
        }
        mirrored[y][x] = true;
      }
    }
  }
  return mirrored;
}

// Helper: Color interpolation
function lerpColor(color1, color2, t) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  if (!c1 || !c2) return color1;
  
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return rgbToHex(r, g, b);
}

// Helper: Hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper: RGB to Hex
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Helper: Darken color
function darkenColor(color, factor) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return rgbToHex(
    Math.max(0, Math.floor(rgb.r * (1 - factor))),
    Math.max(0, Math.floor(rgb.g * (1 - factor))),
    Math.max(0, Math.floor(rgb.b * (1 - factor)))
  );
}

// Helper: Lighten color
function lightenColor(color, factor) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return rgbToHex(
    Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * factor)),
    Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * factor)),
    Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * factor))
  );
}

// Generate body mask
function generateBodyMask(style, rand) {
  const mask = createEmptyGrid();
  const centerX = GRID_SIZE / 2;
  const centerY = GRID_SIZE / 2;
  
  // Body dimensions based on shape
  let bodyWidth, bodyHeight;
  switch (style.bodyShape || "normal") {
    case "slim":
      bodyWidth = GRID_SIZE * 0.35;
      bodyHeight = GRID_SIZE * 0.45;
      break;
    case "fat":
      bodyWidth = GRID_SIZE * 0.55;
      bodyHeight = GRID_SIZE * 0.65;
      break;
    case "long":
      bodyWidth = GRID_SIZE * 0.7;
      bodyHeight = GRID_SIZE * 0.35;
      break;
    default: // normal
      bodyWidth = GRID_SIZE * 0.45;
      bodyHeight = GRID_SIZE * 0.5;
  }
  
  // Apply curvature
  const curvature = (style.bodyCurvature || 0) * 0.1;
  const offsetY = Math.sin((centerX - GRID_SIZE / 2) / (GRID_SIZE / 2) * Math.PI) * curvature * bodyHeight;
  
  // Generate left half
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x <= centerX; x++) {
      const adjustedY = centerY + offsetY * (x / centerX);
      if (isInCapsule(x, adjustedY, centerX, centerY, bodyWidth, bodyHeight, 0.3)) {
        mask[y][x] = true;
      }
    }
  }
  
  return mirrorMask(mask, centerX);
}

// Generate belly mask
function generateBellyMask(bodyMask, style) {
  const mask = createEmptyGrid();
  const centerX = GRID_SIZE / 2;
  const centerY = GRID_SIZE / 2;
  const bellyHeight = (style.bellyHeightFactor || 0.4) * GRID_SIZE * 0.5;
  const bellyStartY = centerY;
  
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (bodyMask[y][x] && y >= bellyStartY && y <= bellyStartY + bellyHeight) {
        mask[y][x] = true;
      }
    }
  }
  return mask;
}

// Generate tail mask
function generateTailMask(style, rand) {
  const mask = createEmptyGrid();
  const centerX = GRID_SIZE / 2;
  const centerY = GRID_SIZE / 2;
  const tailType = style.tailType || "classic";
  
  const tailStartX = centerX + GRID_SIZE * 0.25;
  const tailWidth = GRID_SIZE * 0.2;
  const tailHeight = GRID_SIZE * 0.3;
  
  // Generate left half of tail
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (x >= tailStartX) {
        const relX = x - tailStartX;
        const relY = y - centerY;
        
        let inTail = false;
        switch (tailType) {
          case "triangle":
            inTail = relX <= tailWidth && Math.abs(relY) <= tailHeight * (1 - relX / tailWidth);
            break;
          case "pointed":
            const pointFactor = 1 - (relX / tailWidth);
            inTail = relX <= tailWidth && Math.abs(relY) <= tailHeight * pointFactor * pointFactor;
            break;
          case "rounded":
            inTail = relX <= tailWidth && isInEllipse(x, y, tailStartX + tailWidth, centerY, tailWidth, tailHeight);
            break;
          case "crescent":
            const angle = Math.atan2(relY, relX);
            const dist = Math.sqrt(relX * relX + relY * relY);
            inTail = dist <= tailWidth && angle > -Math.PI / 3 && angle < Math.PI / 3;
            break;
          case "split":
            // Split tail with gap in middle
            const splitGap = 3;
            const splitFactor = 1 - relX / tailWidth;
            inTail = relX <= tailWidth && 
                     Math.abs(relY) <= tailHeight * (0.3 + 0.7 * splitFactor) &&
                     Math.abs(relY) > splitGap;
            break;
          default: // classic / fan
            const fanFactor = 1 - relX / tailWidth;
            inTail = relX <= tailWidth && Math.abs(relY) <= tailHeight * (0.3 + 0.7 * fanFactor);
        }
        
        if (inTail) {
          mask[y][x] = true;
        }
      }
    }
  }
  
  return mirrorMask(mask, centerX);
}

// Generate dorsal fin mask
function generateDorsalFinMask(style, rand) {
  const mask = createEmptyGrid();
  const dorsalSize = style.dorsalFin || "small";
  if (dorsalSize === "none") return mask;
  
  const centerX = GRID_SIZE / 2;
  const finY = GRID_SIZE * 0.15;
  const finWidth = dorsalSize === "large" ? GRID_SIZE * 0.4 : dorsalSize === "medium" ? GRID_SIZE * 0.3 : GRID_SIZE * 0.2;
  const finHeight = dorsalSize === "large" ? GRID_SIZE * 0.25 : dorsalSize === "medium" ? GRID_SIZE * 0.18 : GRID_SIZE * 0.12;
  
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const relX = x - centerX;
      const relY = y - finY;
      if (Math.abs(relX) <= finWidth / 2 && relY >= -finHeight && relY <= 0) {
        const curve = Math.sin((relX / (finWidth / 2)) * Math.PI / 2);
        if (Math.abs(relY) <= finHeight * (0.3 + 0.7 * curve)) {
          mask[y][x] = true;
        }
      }
    }
  }
  
  return mask;
}

// Generate pectoral fin mask
function generatePectoralFinMask(style, rand) {
  const mask = createEmptyGrid();
  const pectoralSize = style.pectoralFin || "medium";
  if (pectoralSize === "none") return mask;
  
  const centerX = GRID_SIZE / 2;
  const finY = GRID_SIZE * 0.6;
  const finX = centerX - GRID_SIZE * 0.15;
  const finSize = pectoralSize === "large" ? 8 : pectoralSize === "medium" ? 6 : 4;
  
  // Left pectoral fin (triangle shape)
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const dx = x - finX;
      const dy = y - finY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      if (dist <= finSize && angle > -Math.PI / 2 && angle < Math.PI / 4) {
        mask[y][x] = true;
      }
    }
  }
  
  // Mirror to right side
  return mirrorMask(mask, centerX);
}

// Generate eye mask
function generateEyeMask(style) {
  const mask = createEmptyGrid();
  const centerX = GRID_SIZE / 2;
  const eyeX = centerX - GRID_SIZE * 0.2;
  const eyeY = GRID_SIZE * 0.4;
  const eyeRadius = 4;
  
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const dx = x - eyeX;
      const dy = y - eyeY;
      if (dx * dx + dy * dy <= eyeRadius * eyeRadius) {
        mask[y][x] = true;
      }
    }
  }
  
  return mask;
}

// Apply pattern to grid
function applyPattern(grid, bodyMask, style, rand) {
  const pattern = style.pattern || "none";
  if (pattern === "none") return;
  
  const intensity = style.patternIntensity || 0.5;
  const bodyColor = style.bodyColor || "#FF9566";
  const finColor = style.finColor || "#FFB07A";
  
  switch (pattern) {
    case "stripes": {
      const stripeCount = Math.floor(3 + intensity * 4);
      const stripeWidth = GRID_SIZE / (stripeCount * 2);
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (bodyMask[y][x] && grid[y][x]) {
            const stripeIndex = Math.floor(x / stripeWidth);
            if (stripeIndex % 2 === 0) {
              grid[y][x] = darkenColor(bodyColor, 0.2);
            }
          }
        }
      }
      break;
    }
    
    case "spots": {
      const spotCount = Math.floor(3 + intensity * 8);
      const spotRadius = 2 + intensity * 2;
      const bodyPixels = [];
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (bodyMask[y][x]) bodyPixels.push([x, y]);
        }
      }
      
      for (let i = 0; i < spotCount; i++) {
        if (bodyPixels.length === 0) break;
        const idx = Math.floor(rand() * bodyPixels.length);
        const [cx, cy] = bodyPixels[idx];
        bodyPixels.splice(idx, 1);
        
        for (let y = 0; y < GRID_SIZE; y++) {
          for (let x = 0; x < GRID_SIZE; x++) {
            const dx = x - cx;
            const dy = y - cy;
            if (dx * dx + dy * dy <= spotRadius * spotRadius && bodyMask[y][x]) {
              grid[y][x] = lightenColor(bodyColor, 0.3);
            }
          }
        }
      }
      break;
    }
    
    case "scales": {
      const scaleSize = 3 + intensity * 2;
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (bodyMask[y][x] && grid[y][x]) {
            const scaleX = (x + (y % 2 === 0 ? 0 : scaleSize / 2)) % (scaleSize * 2);
            const scaleY = y % scaleSize;
            if (scaleX < scaleSize && scaleY < scaleSize / 2) {
              const dist = Math.sqrt((scaleX - scaleSize / 2) ** 2 + (scaleY - scaleSize / 4) ** 2);
              if (dist < scaleSize / 2) {
                grid[y][x] = darkenColor(grid[y][x], 0.15);
              }
            }
          }
        }
      }
      break;
    }
    
    case "gradient": {
      const centerX = GRID_SIZE / 2;
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (bodyMask[y][x] && grid[y][x]) {
            const t = (x - centerX + GRID_SIZE / 2) / GRID_SIZE;
            grid[y][x] = lerpColor(bodyColor, darkenColor(bodyColor, 0.3), t);
          }
        }
      }
      break;
    }
  }
}

// Main generator function
export function generateFishGrid(config) {
  const style = config.style || {};
  const seed = config.seed !== undefined ? config.seed : Math.floor(Math.random() * 0xffffffff);
  const rand = createPRNG(seed);
  
  // Normalize and set defaults
  const normalizedStyle = {
    bodyShape: style.bodyShape || "normal",
    bodyColor: style.bodyColor || "#FF9566",
    bellyColor: style.bellyColor || lightenColor(style.bodyColor || "#FF9566", 0.3),
    finColor: style.finColor || "#FFB07A",
    eyeColor: style.eyeColor || "#1A1A1A",
    pattern: style.pattern || "none",
    tailType: style.tailType || (style.tail === "triangle" ? "triangle" : "classic"),
    dorsalFin: style.dorsalFin || (style.dorsal === "none" ? "none" : style.dorsal === "big" ? "large" : "small"),
    pectoralFin: style.pectoralFin || "medium",
    bellyHeightFactor: style.bellyHeightFactor !== undefined ? style.bellyHeightFactor : 0.4,
    bodyCurvature: style.bodyCurvature !== undefined ? style.bodyCurvature : 0,
    patternIntensity: style.patternIntensity !== undefined ? style.patternIntensity : 0.5,
  };
  
  // Create empty grid
  const grid = createEmptyGrid();
  
  // Generate masks
  const bodyMask = generateBodyMask(normalizedStyle, rand);
  const bellyMask = generateBellyMask(bodyMask, normalizedStyle);
  const tailMask = generateTailMask(normalizedStyle, rand);
  const dorsalFinMask = generateDorsalFinMask(normalizedStyle, rand);
  const pectoralFinMask = generatePectoralFinMask(normalizedStyle, rand);
  const eyeMask = generateEyeMask(normalizedStyle);
  
  // Apply layers in order (back to front)
  // 1. Tail
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (tailMask[y][x]) {
        grid[y][x] = normalizedStyle.finColor;
      }
    }
  }
  
  // 2. Body
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (bodyMask[y][x] && !grid[y][x]) {
        grid[y][x] = normalizedStyle.bodyColor;
      }
    }
  }
  
  // 3. Belly
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (bellyMask[y][x] && grid[y][x] === normalizedStyle.bodyColor) {
        grid[y][x] = normalizedStyle.bellyColor;
      }
    }
  }
  
  // 4. Fins
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (dorsalFinMask[y][x] || pectoralFinMask[y][x]) {
        if (!eyeMask[y][x]) { // Don't overwrite eye
          grid[y][x] = normalizedStyle.finColor;
        }
      }
    }
  }
  
  // 5. Pattern overlay
  applyPattern(grid, bodyMask, normalizedStyle, rand);
  
  // 6. Eye (always on top)
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (eyeMask[y][x]) {
        // White eye background
        if (Math.sqrt((x - (GRID_SIZE / 2 - GRID_SIZE * 0.2)) ** 2 + (y - GRID_SIZE * 0.4) ** 2) <= 4) {
          grid[y][x] = "#FFFFFF";
        }
        // Eye pupil
        if (Math.sqrt((x - (GRID_SIZE / 2 - GRID_SIZE * 0.2 + 1)) ** 2 + (y - GRID_SIZE * 0.4 + 1) ** 2) <= 2.5) {
          grid[y][x] = normalizedStyle.eyeColor;
        }
      }
    }
  }
  
  return grid;
}

// Generate default fish
export function generateDefaultFish(seed) {
  const defaultStyle = {
    bodyShape: "normal",
    bodyColor: "#FF9566",
    bellyColor: "#FFB8A3",
    finColor: "#FFB07A",
    eyeColor: "#1A1A1A",
    pattern: "stripes",
    tailType: "classic",
    dorsalFin: "small",
    pectoralFin: "medium",
    bellyHeightFactor: 0.4,
    bodyCurvature: 0,
    patternIntensity: 0.5,
  };
  
  return generateFishGrid({ style: defaultStyle, seed });
}

// Derive random style
export function deriveRandomStyle(seed) {
  const rand = createPRNG(seed !== undefined ? seed : Math.floor(Math.random() * 0xffffffff));
  
  const bodyShapes = ["normal", "slim", "fat", "long"];
  const tailTypes = ["classic", "split", "rounded", "pointed", "crescent", "triangle"];
  const patterns = ["none", "stripes", "spots", "scales", "gradient"];
  const dorsalSizes = ["none", "small", "medium", "large"];
  const pectoralSizes = ["none", "small", "medium", "large"];
  
  // Generate random color
  const hue = rand() * 360;
  const sat = 0.5 + rand() * 0.5;
  const light = 0.4 + rand() * 0.3;
  const bodyColor = hslToHex(hue, sat, light);
  const bellyColor = hslToHex(hue, sat * 0.7, light + 0.2);
  const finColor = hslToHex((hue + 30) % 360, sat * 0.8, light + 0.1);
  
  return {
    bodyShape: bodyShapes[Math.floor(rand() * bodyShapes.length)],
    bodyColor,
    bellyColor,
    finColor,
    eyeColor: "#1A1A1A",
    pattern: patterns[Math.floor(rand() * patterns.length)],
    tailType: tailTypes[Math.floor(rand() * tailTypes.length)],
    dorsalFin: dorsalSizes[Math.floor(rand() * dorsalSizes.length)],
    pectoralFin: pectoralSizes[Math.floor(rand() * pectoralSizes.length)],
    bellyHeightFactor: 0.3 + rand() * 0.3,
    bodyCurvature: (rand() - 0.5) * 0.5,
    patternIntensity: 0.3 + rand() * 0.5,
  };
}

// Helper: HSL to Hex
function hslToHex(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;
  
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return rgbToHex(r, g, b);
}

