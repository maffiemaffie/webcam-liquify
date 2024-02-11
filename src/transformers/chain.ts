import { cloneFrame } from "../video/image-data-helpers.js";
import { ImageTransformer } from "./transformer.js";

/**
 * Allows multiple transformers to be chained in sequence.
 */
class TransformerChain implements ImageTransformer {
  transformers: ImageTransformer[];

  constructor(transformers: ImageTransformer[] = []) {
    this.transformers = transformers;
  }

  /**
   * Appends a transformer to the chain.
   * @param transformer The transformer to add.
   */
  addTransformer(transformer: ImageTransformer) {
    this.transformers.push(transformer);
  }

  /**
   * Transforms the frame through each transformer in order.
   * @param frame The frame to be transformed.
   * @returns The transformed frame.
   */
  transform(frame: ImageData): ImageData {
    let newFrame = cloneFrame(frame);
    for (const transformer of this.transformers) {
      newFrame = transformer.transform(newFrame);
    }
    return newFrame;
  }
}

export {
  TransformerChain,
};