import { interpolateAt } from "../video/image-data-helpers.js";
import { ForEachTransformer } from "./for-each.js";

class Scale extends ForEachTransformer {
  /**
   * The amount to scale along the x-axis.
   */
  sx: number;

  /**
   * The amount to scale along they y-axis.
   */
  sy: number;

  /**
   * Represents the x-coordinate of the point being scaled around.
   */
  centerX: number;

  /**
   * Represents the y-coordinate of the point being scaled around.
   */
  centerY: number;

  constructor({scale, sx, sy, centerX, centerY}) {
    super();

    if (scale !== undefined) {
      this.sx = 1 / scale;
      this.sy = 1 / scale;
    } 
    
    else if (sx !== undefined && sy !== undefined) {
      this.sx = 1 / sx;
      this.sy = 1 / sy;
    }

    this.centerX = centerX;
    this.centerY = centerY;
  }

  pixelTransform(frame: ImageData, x: number, y: number, color: RGBAColor): RGBAColor {
    const centeredX = x - this.centerX;
    const centeredY = y - this.centerY;

    const newX = centeredX * this.sx;
    const newY = centeredY * this.sy;

    const decenteredX = newX + this.centerX;
    const decenteredY = newY + this.centerY;

    return interpolateAt(frame, decenteredX, decenteredY);
  }
}

export {
  Scale,
};