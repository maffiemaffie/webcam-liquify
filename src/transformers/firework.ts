import { Bulge } from "./bulge.js";
import { ForEachTransformer } from "./for-each.js";

/**
 * Transformer that bulges outward or pinches inward based on angle around a single point.
 */
class Firework extends ForEachTransformer {
  /**
   * Represents the x-coordinate of the firework's center.
   */
  x: number;

  /**
   * Represents the y-coordinate of the firework's center.
   */
  y: number;

  /**
   * The number of radial spokes in the firework.
   */
  spokes: number;

  /**
   * Used to create the spokes.
   */
  #bulgeOut: Bulge;

  /**
   * Used to create the spokes.
   */
  #bulgeIn: Bulge;

  constructor({x, y, scale, size, spokes}: {x: number, y: number, scale: number, size: number, spokes: number}) {
    super();

    this.x = x;
    this.y = y;
    this.spokes = spokes / Math.PI * 0.5;

    this.#bulgeOut = new Bulge({x, y, scale, size});
    this.#bulgeIn = new Bulge({x, y, scale: 1 / scale, size});
  }

  pixelTransform(frame: ImageData, x: number, y: number, color: RGBAColor) {
    const xDiff = x - this.x;
    const yDiff = y - this.y
    const angle = Math.atan2(xDiff, yDiff) + Math.PI;
    if (angle * this.spokes % 1 > 0.5) {
      return this.#bulgeOut.pixelTransform(frame, x, y, color);
    }
    return this.#bulgeIn.pixelTransform(frame, x, y, color);
  }
}

export {
  Firework,
}