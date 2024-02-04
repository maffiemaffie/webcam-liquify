import { ForEachTransformer } from "./for-each.js";
import { interpolateAt } from "../image-data-helpers.js";

class Swirl extends ForEachTransformer {
  constructor({x, y, turn, size}) {
    super();

    this.x = x;
    this.y = y;
    this.turn = turn;
    this.size = size;
  }

  pixelTransform(frame, x, y, color) {
    if (x === this.x && y === this.y) return color;

    const diffX = x - this.x;
    const diffY = y - this.y;
    const distanceSquared = diffX * diffX + diffY * diffY;

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