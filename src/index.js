import { startCamera } from "./webcam.js";
import { display, displayQuads } from "./display-video.js";
// import { verticalFlip, horizontalFlip } from "./transformers/flip.js";
// import { calculateClosest } from "./transformers/closest.js";
// import { Bulge } from "./transformers/bulge.js";
// import { TransformerChain } from "./transformers/chain.js";
// import { Swirl } from "./transformers/swirl.js";
import { Recorder } from "./recorder.js";
import * as transformers from "./transformers/index.js";

const video = await startCamera();

const chain = new transformers.TransformerChain();

const pinch = new transformers.Bulge({
  x: 50,
  y: 50,
  size: 50,
  scale: 0.5,
});

const bulge = new transformers.Bulge({
  x: 200,
  y: 250,
  size: 50,
  scale: 2,
});

const swirl1 = new transformers.Swirl({
  x: 150,
  y: 100,
  turn: 0.4 * Math.PI,
  size: 100,
});

const swirl2 = new transformers.Swirl({
  x: 50,
  y: 50,
  turn: 0.6 * Math.PI,
  size: 50,
});

const swirl3 = new transformers.Swirl ({
  x: 250,
  y: 150,
  turn: 0.8 * Math.PI,
  size: 75,
});

chain.addTransformer(swirl1);
chain.addTransformer(swirl2);
chain.addTransformer(swirl3);
chain.addTransformer(pinch);
chain.addTransformer(bulge);
chain.addTransformer(transformers.horizontalFlip);

const displayCanvas = document.createElement('canvas');
document.body.appendChild(displayCanvas);
displayCanvas.style.width = '100%';

const recorder = new Recorder(displayCanvas);

document.getElementById('start').addEventListener('click', () => recorder.start());
document.getElementById('stop').addEventListener('click', () => {
  recorder.stop(url => {
    document.getElementById('download').setAttribute('href', url);
  });
});

video.addEventListener('canplay', () => {
  video.play();
})

video.addEventListener('play', () => {
  displayCanvas.width = video.videoWidth;
  displayCanvas.height = video.videoHeight;
  video.play();

  setInterval(() => {
    display({
      ctx: displayCanvas.getContext('2d'), 
      video,
      transformer: chain,
    });
  }, 33);
});