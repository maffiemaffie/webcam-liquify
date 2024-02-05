import { Bulge } from "./bulge.js";
import { ForEachTransformer } from "./for-each.js";

class Firework extends ForEachTransformer {
  constructor({x, y, scale, size, spokes}) {
    super();

    this.x = x;
    this.y = y;
    this.size = size;
    this.spokes = spokes / Math.PI * 0.5;

    this.bulgeOut = new Bulge({x, y, scale, size});
    this.bulgeIn = new Bulge({x, y, scale: 1 / scale, size});
  }

  pixelTransform(frame, x, y, color) {
    const xDiff = x - this.x;
    const yDiff = y - this.y
    const angle = Math.atan2(xDiff, yDiff) + Math.PI;
    if (angle * this.spokes % 1 > 0.5) {
      return this.bulgeOut.pixelTransform(frame, x, y, color);
    }
    return this.bulgeIn.pixelTransform(frame, x, y, color);
  }
}

export {
  Firework,
}