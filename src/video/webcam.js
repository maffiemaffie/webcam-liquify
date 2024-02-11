/**
 * Creates a new video using the webcam as input.
 * @returns A video element containing the webcam feed.
 */
export const startCamera = async () => {
  const videoConstraints = {
    // frameRate: {
    //   ideal: 30,
    //   max: 60,
    // },
    height: {
      ideal: 100,
      max: 300,
    },
    width: {
      ideal: 150,
      max: 500,
    },
    resizeMode: "crop-and-scale"
  }

  const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
  const video = document.createElement('video');
  video.srcObject = stream;
  return video;
}