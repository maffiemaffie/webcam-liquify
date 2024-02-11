import { cloneFrame, eachPoint, setPoint } from "../video/image-data-helpers.js";
import { ImageTransformer } from "./transformer.js";

/**
 * Transformer that invokes a single method on each pixel in a frame.
 */
abstract class ForEachTransformer implements ImageTransformer {
  /**
   * Defines a method to transform each pixel of a frame. Overridden in subclasses.
   * @param frame The frame being transformed.
   * @param x The x coordinate of the pixel being transformed.
   * @param y The y coordinate of the pixel being transformed.
   * @param color The color of the pixel being transformed.
   * @returns The new color for the pixel.
   */
  abstract pixelTransform(frame: ImageData, x: number, y: number, color: RGBAColor): RGBAColor;

  /**
   * Transforms a frame using a method that will be overridden in subclasses.
   * @param {ImageData} frame The frame being transformed.
   * @returns The transformed frame.
   */
  transform(frame:ImageData) {
    const newFrame = cloneFrame(frame);
    eachPoint(frame, (x, y, color) => setPoint(newFrame, x, y, this.pixelTransform(frame, x, y, color)));
    return newFrame;
  }
}

export {
  ForEachTransformer,
};