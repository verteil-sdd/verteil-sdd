const fs = require("fs");
const path = require("path");

const width = 820;
const height = 180;
const rows = 7;
const cols = 50;
const size = 10; 
const gap = 3;   
const totalDuration = 20; 

// GitHub Dark Colors & Pink Gradient Palette
const gridColors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const pinkSegments = ["#ff007f", "#ff3399", "#ff66b2", "#ff99cc", "#ffcce6", "#ffe6f2"];

// 1. Generate Randomized Grid with "Eating" Logic
let gridDots = "";
for (let c = 0; c < cols; c++) {
  for (let r = 0; r < rows; r++) {
    const x = 20 + c * (size + gap);
    const y = 20 + r * (size + gap);
    
    // Randomize initial color
    const randomValue = Math.random();
    let color = gridColors[0];
    if (randomValue > 0.4) color = gridColors[Math.floor(Math.random() * 4) + 1];

    // Background (the "eaten" state)
    gridDots += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2" fill="#161b22" />`;
    
    // Foreground (the "to be eaten" state)
    // Zig-zag timing: even rows go L->R, odd rows go R->L
    const isEvenRow = r % 2 === 0;
    const progress = isEvenRow ? (c / cols) : ((cols - c) / cols);
    const rowStartTime = (r / rows) * totalDuration;
    const finalDelay = rowStartTime + (progress * (totalDuration / rows));

    if (color !== gridColors[0]) {
      gridDots += `
        <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2" fill="${color}">
          <animate attributeName="opacity" values="1;1;0;0;1" dur="${totalDuration}s" 
            begin="${finalDelay}s" repeatCount="indefinite" />
        </rect>`;
    }
  }
}

// 2. Snake Path (Zig-Zag)
const pathLine = "M 20 20 H 660 V 33 H 20 V 46 H 660 V 59 H 20 V 72 H 660 V 85 H 20 V 98 H 660";

// 3. Pink Gradient Snake Body
let snakeBody = "";
const maxSegments = 8; 
for (let i = 0; i < maxSegments; i++) {
  // Head is pinkest (index 0), Tail is lightest
  const segmentColor = pinkSegments[i] || pinkSegments[pinkSegments.length - 1];
  
  // Growth Logic: We use "scale" to make the tail appear as the snake moves
  // and "opacity" to hide segments at the very start of the loop
  snakeBody += `
    <rect width="${size}" height="${size}" rx="2" fill="${segmentColor}">
      <animateMotion 
        dur="${totalDuration}s" 
        repeatCount="indefinite" 
        begin="${i * 0.08}s"
        path="${pathLine}" 
      />
      <animate attributeName="width" values="0;${size};${size}" dur="${totalDuration}s" 
        begin="0s" repeatCount="indefinite" />
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

console.log("✅ Pink Gradient Snake with Growth Logic generated!");
