const getPoint = (frame, x, y) => {
  const index = y * frame.width + x;

  return {
    red: frame.data[index * 4 + 0],
    green: frame.data[index * 4 + 1],
    blue: frame.data[index * 4 + 2],
    alpha: frame.data[index * 4 + 3],
  };
};

const interpolateAt = (frame, x, y) => {
  const clamp = (value, min, max) => {
    return Math.max(Math.min(value, max), min);
  };

  const leftTrack = clamp(Math.floor(x), 0, frame.width - 1);
  const rightTrack = clamp(Math.ceil(x), 0, frame.width - 1);
  const upperTrack = clamp(Math.floor(y), 0, frame.height - 1);
  const lowerTrack = clamp(Math.ceil(y), 0, frame.height - 1);

  const xFac = x % 1;
  const yFac = y % 1;

  const upperLeft = getPoint(frame, leftTrack, upperTrack);
  const upperRight = getPoint(frame, rightTrack, upperTrack);
  const lowerLeft = getPoint(frame, leftTrack, lowerTrack);
  const lowerRight = getPoint(frame, rightTrack, lowerTrack);

  const interpolate = (ul, ur, dl, dr, x, y) => {
    const upper = x * ur + (1 - x) * ul;
    const lower = x * dr + (1 - x) * dl;
    return y * lower + (1 - y) * upper;
  };

  const interpolatedColor = {
    red: interpolate(
      upperLeft.red,
      upperRight.red,
      lowerLeft.red,
      lowerRight.red,
      xFac,
      yFac
    ),
    green: interpolate(
      upperLeft.green,
      upperRight.green,
      lowerLeft.green,
      lowerRight.green,
      xFac,
      yFac
    ),
    blue: interpolate(
      upperLeft.blue,
      upperRight.blue,
      lowerLeft.blue,
      lowerRight.blue,
      xFac,
      yFac
    ),
    alpha: interpolate(
      upperLeft.alpha,
      upperRight.alpha,
      lowerLeft.alpha,
      lowerRight.alpha,
      xFac,
      yFac
    ),
  };

  return interpolatedColor;
};

const setPoint = (frame, x, y, { red, green, blue, alpha = 1 }) => {
  const index = y * frame.width + x;
  frame.data[index * 4 + 0] = red;
  frame.data[index * 4 + 1] = green;
  frame.data[index * 4 + 2] = blue;
  frame.data[index * 4 + 3] = alpha;
};

const eachPoint = (frame, action) => {
  for (let y = 0; y < frame.height; y++) {
    for (let x = 0; x < frame.width; x++) {
      action(x, y, getPoint(frame, x, y));
    }
  }
};

const cloneFrame = (frame) => {
  return new ImageData(new Uint8ClampedArray(frame.data), frame.width);
};

export { getPoint, setPoint, eachPoint, cloneFrame, interpolateAt };
