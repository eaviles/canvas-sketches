/**
 * A grid of concentric dials based on yesterday's sketch.
 */

import canvasSketch from 'canvas-sketch';
import { color, math, random } from 'canvas-sketch-util';
import palettes from 'nice-color-palettes';

const MAX_ANGLE = Math.PI * 2;

function getRandomAngle(factor) {
  return random.value() * MAX_ANGLE * factor;
}

function getChunks() {
  const chunks = [];
  let angle = getRandomAngle(0.03);
  while (angle < MAX_ANGLE) {
    const delta = getRandomAngle(0.08);
    if (angle + delta < MAX_ANGLE) {
      chunks.push({ endAngle: angle + delta, startAngle: angle });
    }
    angle += delta + getRandomAngle(0.03);
  }
  return chunks;
}

function drawChunks(ctx, chunks, radius) {
  chunks.forEach(({ endAngle, startAngle }) => {
    const r = radius - ctx.lineWidth / 2;
    if (r > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, r, startAngle, endAngle);
      ctx.stroke();
    }
  });
}

function opacity(input, factor) {
  const { rgb } = color.parse(input);
  return `rgba(${rgb.join(', ')}, ${factor})`;
}

const settings = {
  animate: true,
  dimensions: [720, 720],
  duration: 30,
  fps: 60
};

const sketch = () => {
  random.setSeed(random.getRandomSeed());
  random.setSeed('544878');
  random.setSeed('625045');
  // random.setSeed('716320');
  // random.setSeed('270275');
  random.setSeed('122558');
  // random.setSeed('978521');
  // random.setSeed('942026');
  console.log(`seed: "${random.getSeed()}"`);

  const clusters = [];

  let palette = random.pick(palettes);

  for (let x = 0; x < 12; x += 2) {
    for (let y = 0; y < 12; y += 2) {
      const center = [x / 10, y / 10];

      palette = random.shuffle(palette);
      const numOfRings = random.rangeFloor(4, 12);
      const rings = [];

      let startRadius = 0.21;
      for (let j = 0; j < numOfRings; j += 1) {
        let chunks = getChunks();
        const radius = startRadius;
        const width = random.range(0.005, 0.02);
        startRadius -= width * 2 + width * random.range(1, 2);
        const speed = random.value() > 0.5 ? random.range(0.1, 0.5) : random.range(-0.5, -0.1);
        if (radius < 0.05) break;
        const ringColor = palette[j % palette.length];
        rings.push({
          center,
          chunks,
          color: opacity(ringColor, 0.5),
          radius,
          speed: speed * random.range(0.5, 0.9),
          width
        });
        chunks = getChunks();
        rings.push({ center, chunks, color: ringColor, radius, speed, width });
      }
      clusters.push(rings);
    }
  }

  return ({ context: ctx, height, time, width }) => {
    const side = Math.min(width, height) * 0.9;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    clusters.forEach((rings) => {
      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(width * ring.center[0], height * ring.center[1]);
        ctx.rotate(time * ring.speed);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = side * ring.width;
        drawChunks(ctx, ring.chunks, (side / 2) * ring.radius);
        ctx.restore();
      });
    });
  };
};

canvasSketch(sketch, settings);
