/**
 * Concentric dial rings with randomized stroke attributes and movement.
 */

import canvasSketch from 'canvas-sketch';
import { color, math, random } from 'canvas-sketch-util';
import palettes from 'nice-color-palettes';

const { pick, range } = random;

const settings = {
  animate: true,
  dimensions: [1280, 960],
  duration: 24,
  fps: 60
};

const sketch = () => {
  random.setSeed(random.getRandomSeed());
  random.setSeed('444324');
  console.log(`seed: "${random.getSeed()}"`);

  const palette = random.shuffle(pick(palettes));

  const rings = [];
  for (let i = 0; i < 64; i += 1) {
    const [width, height] = settings.dimensions;
    const endAngle = {
      factor: range(-0.5, 0.5),
      offset: range(-1000, 1000),
      values: [range(Math.PI * 0.05, Math.PI * 1.5), range(Math.PI * 0.05, Math.PI * 1.5)].sort()
    };
    const stroke = {
      colors: [pick(palette), pick(palette)],
      factor: range(-0.5, 0.5),
      from: [range(0, width * 0.25), range(0, height * 0.25)],
      offset: range(-1000, 1000),
      to: [range(width * 0.75, width), range(height * 0.75, height)],
      values: [range(width * 0.005, width * 0.06), range(width * 0.005, width * 0.06)].sort()
    };
    const radius = {
      factor: range(-0.5, 0.5),
      offset: range(-1000, 1000),
      values: [range(width * 0.05, width * 0.55), range(width * 0.05, width * 0.55)].sort()
    };
    const rotation = {
      factor: range(-0.5, 0.5),
      offset: range(0, Math.PI * 2)
    };
    rings.push({ endAngle, radius, rotation, stroke });
  }

  return ({ context: ctx, height, time, width }) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);
    rings.forEach((ring) => {
      const gradient = ctx.createLinearGradient(...ring.stroke.from, ...ring.stroke.to);
      gradient.addColorStop(0, ring.stroke.colors[0]);
      gradient.addColorStop(1, ring.stroke.colors[1]);

      let { factor, offset } = ring.radius;
      let [min, max] = ring.radius.values;
      const radius = math.mapRange(Math.sin(time * factor + offset), -1, 1, min, max);

      ({ factor, offset } = ring.rotation);
      const rotation = offset + time * factor;

      ({ factor, offset } = ring.stroke);
      [min, max] = ring.stroke.values;
      const lineWidth = math.mapRange(Math.sin(time * factor + offset), -1, 1, min, max);

      ({ factor, offset } = ring.endAngle);
      [min, max] = ring.endAngle.values;
      const endAngle = math.mapRange(Math.sin(time * factor + offset), -1, 1, min, max);

      ctx.save();
      ctx.rotate(rotation);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = lineWidth;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, endAngle);
      ctx.stroke();
      ctx.restore();
    });
  };
};

canvasSketch(sketch, settings);
