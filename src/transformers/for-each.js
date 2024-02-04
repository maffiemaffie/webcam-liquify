import { cloneFrame, eachPoint, setPoint } from "../image-data-helpers.js";

class ForEachTransformer {
  pixelTransform(frame, x, y, color) {
    return color;
  }

  transform(frame) {
    const newFrame = cloneFrame(frame);
    eachPoint(frame, (x, y, color) => setPoint(newFrame, x, y, this.pixelTransform(frame, x, y, color)));
    return newFrame;
  }
}

export {
  ForEachTransformer,
};