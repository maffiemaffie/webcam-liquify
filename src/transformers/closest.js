import { eachPoint } from "../image-data-helpers.js";

const calculateClosest = {
  transform: (frame) => {
    eachPoint(frame, (x, y, color) => {
      let distance = Number.MAX_VALUE;
      let currentClosest = color;

      eachPoint(frame, (x2, y2, color2) => {
        const xDiff = x2 - x;
        const yDiff = y2 - y;
        const thisDistance = xDiff * xDiff + yDiff * yDiff;
        if (thisDistance < distance) currentClosest = color2;
      });
    });

    return frame;
  }
}

export {
  calculateClosest,
};