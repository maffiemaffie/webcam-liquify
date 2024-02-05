import { interpolateAt } from "../image-data-helpers.js";
import { ForEachTransformer } from "./for-each.js"

/**
 * Transformer that bulges outward or pinches inward at a single point.
 */
class Bulge extends ForEachTransformer {
  constructor({x, y, scale, size}) {
    super();

    this.x = x;
    this.y = y;
    this.scale = scale;
    this.size = size;
  }

  pixelTransform(frame, x, y, color) {
    if (x === this.x && y === this.y) return color;

    const diffX = x - this.x;
    const diffY = y - this.y;
    const distanceSquared = diffX * diffX + diffY * diffY;

    if (distanceSquared > this.size * this.size) return color;

    const ratioSquared = distanceSquared / (this.size * this.size);
    const newRatio = Math.pow(ratioSquared, this.scale * 0.5);
    
    const multiplier = newRatio * this.size / Math.sqrt(distanceSquared);

    const newX = multiplier * diffX + this.x;
    const newY = multiplier * diffY + this.y;

    return interpolateAt(frame, newX, newY);
  }
};

export {
  Bulge,
}