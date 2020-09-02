/**
 * Inspired by the animation at https://atom.io/
 */

import canvasSketch from 'canvas-sketch';
import { color, random } from 'canvas-sketch-util';

const MAX_ANGLE = Math.PI * 2;

function getRandomAngle(factor) {
  return random.value() * MAX_ANGLE * factor;
}

function getChunks() {
  const chunks = [];
  let angle = getRandomAngle(0.05);
  while (angle < MAX_ANGLE) {
    const delta = getRandomAngle(0.1);
    if (angle + delta < MAX_ANGLE) {
      chunks.push({ endAngle: angle + delta, startAngle: angle });
    }
    angle += delta + getRandomAngle(0.05);
  }
  return chunks;
}

function drawChunks(ctx, chunks, radius) {
  chunks.forEach(({ endAngle, startAngle }) => {
    ctx.beginPath();
    ctx.arc(0, 0, radius - ctx.lineWidth / 2, startAngle, endAngle);
    ctx.stroke();
  });
}

function opacity(input, factor) {
  const { rgb } = color.parse(input);
  return `rgba(${rgb.join(', ')}, ${factor})`;
}

const colors = {
  blue: '#538abc',
  darkGray: '#28282a',
  green: '#66a18e',
  orange: '#c75923',
  red: '#b22c19',
  yellow: '#d39026'
};

const rings = [
  {
    chunks: getChunks(),
    color: opacity(colors.blue, 0.5),
    radius: 1,
    speed: 0.05,
    width: 0.01
  },
  {
    chunks: getChunks(),
    color: colors.blue,
    radius: 1,
    speed: 0.1,
    width: 0.01
  },
  {
    chunks: getChunks(),
    color: opacity(colors.green, 0.5),
    radius: 0.85,
    speed: 0.1,
    width: 0.02
  },
  {
    chunks: getChunks(),
    color: colors.green,
    radius: 0.85,
    speed: 0.12,
    width: 0.02
  },
  {
    chunks: getChunks(),
    color: opacity(colors.yellow, 0.5),
    radius: 0.75,
    speed: 0.15,
    width: 0.04
  },
  {
    chunks: getChunks(),
    color: colors.yellow,
    radius: 0.75,
    speed: 0.18,
    width: 0.04
  },
  {
    chunks: getChunks(),
    color: opacity(colors.orange, 0.5),
    radius: 0.6,
    speed: 0.2,
    width: 0.02
  },
  {
    chunks: getChunks(),
    color: colors.orange,
    radius: 0.6,
    speed: 0.22,
    width: 0.02
  },
  {
    chunks: getChunks(),
    color: opacity(colors.red, 0.5),
    radius: 0.45,
    speed: 0.3,
    width: 0.01
  },
  {
    chunks: getChunks(),
    color: colors.red,
    radius: 0.45,
    speed: 0.35,
    width: 0.01
  }
];

const settings = {
  animate: true,
  dimensions: [720, 720],
  duration: 60,
  fps: 60
};

const sketch = () => {
  return ({ context: ctx, height, time, width }) => {
    const side = Math.min(width, height) * 0.9;

    ctx.fillStyle = colors.darkGray;
    ctx.fillRect(0, 0, width, height);

    rings.forEach((ring) => {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(time * ring.speed);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = side * ring.width;
      drawChunks(ctx, ring.chunks, (side / 2) * ring.radius);
      ctx.restore();
    });
  };
};

canvasSketch(sketch, settings);
