import { startCamera } from "./video/webcam.js";
import { display } from "./video/display-video.js";
// import { verticalFlip, horizontalFlip } from "./transformers/flip.js";
// import { calculateClosest } from "./transformers/closest.js";
// import { Bulge } from "./transformers/bulge.js";
// import { TransformerChain } from "./transformers/chain.js";
// import { Swirl } from "./transformers/swirl.js";
import { Recorder } from "./video/recorder.js";
import * as transformers from "./transformers/index.js";

const init = (displayCanvas, video) => {
  const chain = new transformers.TransformerChain();

  const pinch = new transformers.Bulge({
    x: displayCanvas.width * 0.5,
    y: displayCanvas.height * 0.5,
    size: displayCanvas.width * 0.5,
    scale: 0.8,
  });

  const bulge = new transformers.Bulge({
    x: displayCanvas.width * 0.5,
    y: displayCanvas.height * 0.5,
    size: displayCanvas.width * 0.5,
    scale: 2,
  });

  const swirl1 = new transformers.Swirl({
    x: displayCanvas.width * 0.5,
    y: displayCanvas.height * 0.5,
    turn: 0.1 * Math.PI,
    size: 100,
  });

  const swirl2 = new transformers.Swirl({
    x: 50,
    y: 50,
    turn: 0.6 * Math.PI,
    size: 50,
  });

  const swirl3 = new transformers.Swirl({
    x: 250,
    y: 150,
    turn: 0.8 * Math.PI,
    size: 75,
  });

  const firework = new transformers.Firework({
    x: displayCanvas.width * 0.5,
    y: displayCanvas.height * 0.5,
    scale: 1.1,
    size: 100,
    spokes: 5,
  });

  const contrast = new transformers.LuminanceContrast({
    intensity: 2
  });

  const colorContrast = new transformers.FastContrast({
    intensity: 1
  });

  const horizontalFlip = new transformers.HorizontalFlip();
  const verticalFlip = new transformers.VerticalFlip();

  const translate = new transformers.FastTranslate({
    dx: displayCanvas.width * 0.5,
    dy: displayCanvas.height * 0.5
  });

  const scale = new transformers.Scale({
    sx: 0.5,
    sy: 0.5,
    centerX: 0,
    centerY: 0,
  });

  // chain.addTransformer(swirl1);
  // chain.addTransformer(swirl2);
  // chain.addTransformer(swirl3);
  // chain.addTransformer(pinch);
  // chain.addTransformer(bulge);
  chain.addTransformer(horizontalFlip);
  chain.addTransformer(verticalFlip);
  // chain.addTransformer(firework);
  // chain.addTransformer(contrast);
  // chain.addTransformer(colorContrast);
  // chain.addTransformer(translate);
  // chain.addTransformer(scale);

  const recorder = new Recorder(displayCanvas);

  document.getElementById('start').addEventListener('click', () => recorder.start());
  document.getElementById('stop').addEventListener('click', () => {
    recorder.stop(url => {
      document.getElementById('download').setAttribute('href', url);
    });
  });
  document.getElementById('fullscreen').addEventListener('click', () => {
    displayCanvas.requestFullscreen({ navigationUI: 'hide' });
    displayCanvas.classList.add('fullscreen');
  });

  displayCanvas.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) displayCanvas.classList.remove('fullscreen');
  });

  setInterval(() => {
    display({
      // ctx: displayCanvas.getContext('2d'), 
      ctx: displayCanvas.getContext('2d', { willReadFrequently: true }), 
      video,
      transformer: chain,
    });
  }, 16);
}

(async () => {
  const video = await startCamera();

  video.addEventListener('canplay', () => {
    video.play();
  })
  
  video.addEventListener('play', () => {
    const displayCanvas = document.createElement('canvas');
    document.body.appendChild(displayCanvas);
    displayCanvas.style.width = '100%';
  
    displayCanvas.width = video.videoWidth;
    displayCanvas.height = video.videoHeight;
    video.play();
  
    init(displayCanvas, video);
  });
})();