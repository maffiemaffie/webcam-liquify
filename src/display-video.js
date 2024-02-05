import { eachPoint } from "./image-data-helpers.js";

/**
 * 
 * @param {Object} options The display options.
 * @param {CanvasRenderingContext2D} options.ctx The canvas context tp render onto.
 * @param {HTMLVideoElement} options.video The video element to extract frames from.
 * @param {{transform:(frame:ImageData)=>ImageData}} options.transformer The transformer used to transform each frame.
 * @returns 
 */
export const display = ({ctx, video, transformer}) => {
  if (video.paused || video.ended) return;

  ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
  const frame = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (!transformer) return;
  
  const transformed = transformer.transform(frame);
  ctx.putImageData(transformed, 0, 0);

  return;
}