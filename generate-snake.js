const fs = require("fs");
const path = require("path");

const width = 900;  // Increased width
const height = 250; // Increased height
const rows = 9;     // Added more rows
const cols = 55;    // Added more columns
const size = 12;    // Made grid larger
const gap = 4;      // Increased gap
const totalDuration = 25; 

const gridColors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
// Pink gradient from hot pink (head) to light pink (tail)
const pinkSegments = ["#ff007f", "#ff1a8c", "#ff3399", "#ff4da6", "#ff66b2", "#ff80bf", "#ff99cc", "#ffb3d9", "#ffcce6"];

/**
 * Generates a random path through the grid
 */
function generateRandomPath(steps, startCol, startRow) {
    let path = `M ${25 + startCol * (size + gap)} ${25 + startRow * (size + gap)}`;
    let currentCol = startCol;
    let currentRow = startRow;
    let visited = [];

    for (let i = 0; i < steps; i++) {
        const directions = [
            { c: 1, r: 0, cmd: 'H' },  // Right
            { c: -1, r: 0, cmd: 'H' }, // Left
            { c: 0, r: 1, cmd: 'V' },  // Down
            { c: 0, r: -1, cmd: 'V' }  // Up
        ];
        
        // Filter valid moves
        const validMoves = directions.filter(d => 
            currentCol + d.c >= 0 && currentCol + d.c < cols &&
            currentRow + d.r >= 0 && currentRow + d.r < rows
        );

        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        currentCol += move.c;
        currentRow += move.r;
        
        const nextX = 25 + currentCol * (size + gap);
        const nextY = 25 + currentRow * (size + gap);
        
        path += ` ${move.cmd === 'H' ? 'H' : 'V'} ${move.cmd === 'H' ? nextX : nextY}`;
        visited.push({ c: currentCol, r: currentRow, time: (i / steps) * totalDuration });
    }
    return { path, visited };
}

const { path: randomPath, visited } = generateRandomPath(150, 0, 0);

// 1. Generate Randomized Grid with synchronized eating
let gridDots = "";
for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
        const x = 25 + c * (size + gap);
        const y = 25 + r * (size + gap);
        
        const randomValue = Math.random();
        let color = gridColors[0];
        if (randomValue > 0.45) color = gridColors[Math.floor(Math.random() * 4) + 1];

        // Background (Eaten state)
        gridDots += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2" fill="#161b22" />`;
        
        if (color !== gridColors[0]) {
            // Find when the snake first hits this coordinate in its random path
            const hit = visited.find(v => v.c === c && v.r === r);
            const finalDelay = hit ? hit.time : 0;

            gridDots += `
                <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2" fill="${color}">
                    <animate attributeName="opacity" values="1;1;0;0;1" dur="${totalDuration}s" 
                        begin="${finalDelay}s" repeatCount="indefinite" />
                </rect>`;
        }
    }
}

// 2. Pink Gradient Snake Body (increased size/segments)
let snakeBody = "";
const segments = 9; // Increased segment count
for (let i = 0; i < segments; i++) {
    const segmentColor = pinkSegments[i];
    snakeBody += `
        <rect width="${size}" height="${size}" rx="2" fill="${segmentColor}">
            <animateMotion 
                dur="${totalDuration}s" 
                repeatCount="indefinite" 
                begin="${i * 0.12}s"
                path="${randomPath}" 
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

console.log("✅ Larger Random-Path Pink Snake Generated!");
