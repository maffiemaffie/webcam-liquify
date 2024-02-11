import { ForEachTransformer } from "./for-each.js";
import { interpolateAt } from "../video/image-data-helpers.js";

/*
 * Transformer that rotates a frame based on its proximity to a single point.
*/
class Swirl extends ForEachTransformer {
  /**
   * Represents the x-coordinate of the point being swirled around.
   */
  x: number;

  /**
   * Represents the y-coordinate of the point being swirled around.
   */
  y: number;

  /**
   * The rotation at the center in radians.
   */
  turn: number;

  /**
   * The falloff radius.
   */
  size: number;

  constructor({x, y, turn, size}) {
    super();

    this.x = x;
    this.y = y;
    this.turn = turn;
    this.size = size;
  }

  pixelTransform(frame: ImageData, x: number, y: number, color: RGBAColor): RGBAColor {
    // the point
    if (x === this.x && y === this.y) return color;

    const diffX = x - this.x;
    const diffY = y - this.y;
    const distanceSquared = diffX * diffX + diffY * diffY;

    // outside falloff range
    if (distanceSquared > this.size * this.size) return color;

    const ratio = 1 - Math.sqrt(distanceSquared / (this.size * this.size));
    const angle = ratio * this.turn;

    const newX = (diffX * Math.cos(angle) - diffY * Math.sin(angle)) + this.x;
    const newY = (diffX * Math.sin(angle) + diffY * Math.cos(angle)) + this.y;

    return interpolateAt(frame, newX, newY);
  }
}

export {
  Swirl,
}