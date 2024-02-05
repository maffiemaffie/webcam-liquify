import { cloneFrame, eachPoint, setPoint } from "../image-data-helpers.js";

/**
 * Transformer that invokes a single method on each pixel in a frame.
 */
class ForEachTransformer {
  /**
   * Defines a method to transform each pixel of a frame. Overridden in subclasses.
   * @param {ImageData} frame The frame being transformed.
   * @param {number} x The x coordinate of the pixel being transformed.
   * @param {number} y The y coordinate of the pixel being transformed.
   * @param {{red:number,green:number,blue:number,alpha?:number}} color The color of the pixel being transformed.
   * @returns The new color for the pixel.
   */
  pixelTransform(frame, x, y, color) {
    return color;
  }

  /**
   * Transforms a frame using a method that will be overridden in subclasses.
   * @param {ImageData} frame The frame being transformed.
   * @returns The transformed frame.
   */
  transform(frame) {
    const newFrame = cloneFrame(frame);
    eachPoint(frame, (x, y, color) => setPoint(newFrame, x, y, this.pixelTransform(frame, x, y, color)));
    return newFrame;
  }
}

export {
  ForEachTransformer,
};