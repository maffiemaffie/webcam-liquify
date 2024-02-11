import { getPoint, setPoint, eachPoint, cloneFrame } from "../video/image-data-helpers.js";
import { ForEachTransformer } from "./for-each.js";
import { ImageTransformer } from "./transformer.js";

/**
 * Transformer that flips a frame across its vertical axis.
 */
class HorizontalFlip extends ForEachTransformer {
  constructor() {
    super();
  }

  pixelTransform(frame: ImageData, x: number, y: number, color: RGBAColor): RGBAColor {
    return getPoint(frame, frame.width - x, y);
  }
}

/**
 * Transformer that flips a frame across its vertical axis.
 */
class VerticalFlip extends ForEachTransformer {
  constructor() {
    super();
  }

  pixelTransform(frame: ImageData, x: number, y: number, color: RGBAColor): RGBAColor {
    return getPoint(frame, x, frame.height - y);
  }
}


export {
  VerticalFlip,
  HorizontalFlip,
};