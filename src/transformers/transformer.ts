/**
 * Defines a method to transform an {@link ImageData} object.
 */
interface ImageTransformer {
  /**
   * Transforms a frame.
   * @param frame The frame to transform.
   * @returns The transformed frame.
   */
  transform(frame: ImageData): ImageData;
}

/**
 * Transformer that uses a temporary canvas element's context to transform a frame.
 */
abstract class TemporaryContextTransformer implements ImageTransformer {
  constructor() {}

  /**
   * Transforms a frame by manipulating a temporary canvas element's context.
   * @param ctx The temporary canvas context that the frame will be transformed on.
   * @param frame The frame being transformed
   */
  abstract contextTransform(ctx: CanvasRenderingContext2D, frame: ImageData): CanvasRenderingContext2D;

  transform(frame: ImageData): ImageData {
    const canvas = document.createElement("canvas");
    canvas.width = frame.width;
    canvas.height = frame.height;

    const tempContext = canvas.getContext("2d")!;

    const transformedContext = this.contextTransform(tempContext, frame);

    const newFrame = transformedContext.getImageData(
      0,
      0,
      frame.width,
      frame.height
    );

    return newFrame;
  }
}

export { ImageTransformer, TemporaryContextTransformer };
