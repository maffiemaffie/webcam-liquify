import { eachPoint } from "./image-data-helpers.js";

export const display = ({ctx, video, transformer}) => {
  if (video.paused || video.ended) return;

  console.log()

  ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
  const frame = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (!transformer) return;
  
  const transformed = transformer.transform(frame);
  ctx.putImageData(transformed, 0, 0);

  return;
}

export const displayQuads = ({ctx, video, transformer}) => {
  if (video.paused || video.ended) return;

  console.log()

  ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
  const frame = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (!transformer) return;
  
  const transformed = transformer.transform(frame);
  
  ctx.save();
  eachPoint(frame, (x, y, color) => {
    ctx.fillStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
    ctx.fillRect(x, y, x + 1, y + 1);
  });
  ctx.restore();

  return;
}