const fs = require("fs");

const width = 800;
const height = 120;

let grid = "";

// Create fake static contribution grid
for (let i = 0; i < 50; i++) {
  grid += `<rect x="${10 + i * 15}" y="50" width="10" height="10" fill="#39d353"/>`;
}

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">

  <!-- Background -->
  <rect width="100%" height="100%" fill="#0d1117"/>

  <!-- Static Grid -->
  ${grid}

  <!-- Animated Snake -->
  <circle r="6" fill="orange">
    <animateMotion
      dur="6s"
      repeatCount="indefinite"
      path="M10 55 H760"
    />
  </circle>

</svg>
`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/github-contribution-grid-snake.svg", svg);
