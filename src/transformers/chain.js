import { cloneFrame } from "../image-data-helpers.js";

class TransformerChain {
  constructor(transformers = []) {
    this.transformers = transformers;
  }

  addTransformer(transformer) {
    this.transformers.push(transformer);
  }

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