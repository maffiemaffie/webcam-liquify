export const startCamera = async () => {
  const videoConstraints = {
    frameRate: {
      ideal: 30,
      max: 60,
    },
    height: {
      min: 100,
      ideal: 200,
      max: 300,
    },
    width: {
      min: 100,
      ideal: 300,
      max: 500,
    },
    resizeMode: "crop-and-scale"
  }

  const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
  const video = document.createElement('video');
  video.srcObject = stream;
  return video;
}