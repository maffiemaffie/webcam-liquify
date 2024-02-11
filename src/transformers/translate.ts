import { TemporaryContextTransformer } from "./transformer.js";

/**
 * Transformer that translates a frame.
 */
class FastTranslate extends TemporaryContextTransformer {
  /**
   * The translation in pixels along the x-axis.
   */
  dx: number;

  /**
   * The translation in pixels along the y-axis.
   */
  dy: number;

  constructor({dx, dy}: {dx: number, dy: number});
  constructor({angle, distance}: {angle: number, distance: number});
  constructor({angle, distance, dx, dy}: {angle: number, distance: number, dx: number, dy: number}) {
    super();
    
    if (angle !== undefined && distance !== undefined) {
      this.dx = distance * Math.cos(angle);
      this.dy = distance * Math.sin(angle);
    }

    else if (dx !== undefined && dy !== undefined) {
      this.dx = dx;
      this.dy = dy;
    }
  }

  contextTransform(ctx: CanvasRenderingContext2D, frame: ImageData): CanvasRenderingContext2D {
    // modulo in js is ((n % d) + d) % d
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
    const dxWrap = ((this.dx % frame.width) + frame.width) % frame.width;
    const dyWrap = ((this.dy % frame.height) + frame.height) % frame.height;

    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        ctx.putImageData(
          frame, 
          dxWrap - x * frame.width, 
          dyWrap - y * frame.height,
        );
      }
    }

    return ctx;
  }
}

export {
  FastTranslate,
};