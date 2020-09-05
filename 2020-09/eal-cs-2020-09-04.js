/**
 * Chromatic sinusoidal dance.
 */

import canvasSketch from 'canvas-sketch';
import { random } from 'canvas-sketch-util';

const { range, shuffle } = random;
const { PI } = Math;

const settings = {
  animate: true,
  dimensions: [1280, 960],
  duration: 24,
  fps: 60
};

const sketch = () => {
  const circles = [];
  for (let x = 0; x < settings.dimensions[0] + 1; x += 64) {
    for (let y = 0; y < settings.dimensions[1]; y += 64) {
      const location = [x + ((y / 64) % 2 === 0 ? 32 : 0), y + 32];
      const colorOffsets = [];
      for (let i = 0; i < 3; i += 1) {
        colorOffsets.push([range(-PI, PI), range(-PI, PI)]);
      }
      const colors = shuffle(['#df151a', '#00da3c', '#00aaff']);
      circles.push({ colorOffsets, colors, location });
    }
  }

  const offset = 6;
  const speed = PI;
  const circleSize = 20;

  return ({ context: ctx, height, time, width }) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    circles.forEach((circle) => {
      for (let i = 0; i < 3; i += 1) {
        ctx.fillStyle = circle.colors[i];
        ctx.beginPath();
        const offsets = circle.colorOffsets[i];
        const x = circle.location[0] - Math.sin(time * speed + offsets[0]) * offset;
        const y = circle.location[1] - Math.cos(time * speed + offsets[1]) * offset;
        ctx.arc(x, y, circleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(...circle.location, circleSize, 0, Math.PI * 2);
      ctx.fill();
    });
  };
};

canvasSketch(sketch, settings);
