import { getPoint, setPoint, eachPoint, cloneFrame } from "../image-data-helpers.js";

const horizontalFlip = {
  transform: (frame) => {
    let returnFrame = cloneFrame(frame);

    eachPoint(frame, (x, y, color) => {
      setPoint(returnFrame, frame.width - x, y, color);
    });

    return returnFrame;
  }
};

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