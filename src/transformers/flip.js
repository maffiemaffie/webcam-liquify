import { getPoint, setPoint, eachPoint, cloneFrame } from "../image-data-helpers.js";

/**
 * Transformer that flips a frame across its vertical axis.
 */
const horizontalFlip = {
  transform: (frame) => {
    let returnFrame = cloneFrame(frame);

    eachPoint(frame, (x, y, color) => {
      setPoint(returnFrame, frame.width - x, y, color);
    });

    return returnFrame;
  }
};

/**
 * Transformer that flips a frame across its vertical axis.
 */
const verticalFlip = {
  transform: (frame) => {
    let returnFrame = cloneFrame(frame);

    eachPoint(frame, (x, y, color) => {
      setPoint(returnFrame, x, frame.height - y, color);
    });

    return returnFrame;
  }
};


export {
  verticalFlip,
  horizontalFlip,
};