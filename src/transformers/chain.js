import { cloneFrame } from "../image-data-helpers.js";

/**
 * Allows multiple transformers to be chained in sequence.
 */
class TransformerChain {
  constructor(transformers = []) {
    this.transformers = transformers;
  }

  /**
   * Appends a transformer to the chain.
   * @param {{transform:(frame:ImageData)=>ImageData}} transformer The transformer to add.
   */
  addTransformer(transformer) {
    this.transformers.push(transformer);
  }

  /**
   * Transforms the frame through each transformer in order.
   * @param {ImageData} frame The frame to be transformed.
   * @returns The transformed frame.
   */
  transform(frame) {
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