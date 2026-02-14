const fs = require("fs");
const path = require("path");

const width = 820;
const height = 150;
const rows = 7;
const cols = 50;
const size = 12; // box size
const gap = 3;   // gap between boxes

// 1. Generate the Grid
let gridDots = "";
for (let c = 0; c < cols; c++) {
  for (let r = 0; r < rows; r++) {
    const x = 20 + c * (size + gap);
    const y = 20 + r * (size + gap);
    
    // Background (Empty squares)
    gridDots += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2" fill="#161b22" />`;
    
    // Foreground (Green squares that fade out)
    // The delay is calculated so they disappear as the snake passes
    const delay = (c * 0.4); 
    gridDots += `
      <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2" fill="#39d353">
        <animate attributeName="opacity" values="1;1;0;0" dur="20s" 
          begin="${delay}s" repeatCount="indefinite" />
      </rect>`;
  }
}

// 2. Create the Snake Path (Zig-Zag)
// M = Start, H = Horizontal, V = Vertical
const pathLine = "M 20 20 H 770 V 35 H 20 V 50 H 770 V 65 H 20 V 80 H 770 V 95 H 20 V 110 H 770";

// 3. Create Snake Body (Head + 4 segments)
let snakeBody = "";
const segments = 5;
for (let i = 0; i < segments; i++) {
  const isHead = i === 0;
  snakeBody += `
    <rect width="${size}" height="${size}" rx="2" fill="${isHead ? '#ffffff' : '#fbbf24'}">
      <animateMotion 
        dur="20s" 
        repeatCount="indefinite" 
        begin="${i * 0.1}s"
        path="${pathLine}" 
      />
    </rect>`;
}

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d1117" rx="10"/>
  ${gridDots}
  ${snakeBody}
</svg>
`;

const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
fs.writeFileSync(path.join(distDir, "github-contribution-grid-snake.svg"), svg);

console.log("✅ Snake SVG generated in /dist");
