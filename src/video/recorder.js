/**
 * Records a canvas and saves the video.
 */
class Recorder {
  constructor(canvas, frameRate = 30) {
    this.stream = canvas.captureStream(frameRate);
    this.data = [];
  }

  /**
   * Start the recording.
   */
  start() {
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (event) => this.data.push(event.data);
    this.recorder.start();
  }

  /**
   * Stops the recording
   * @param {(string)=>void} callback A callback for the url of the recording.
   */
  stop(callback) {
    this.recorder.addEventListener('stop', () => this.#processStop(callback), { once: true });

    if (this.recorder.state === 'recording') {
      this.recorder.stop();
    }
  }

  /**
   * Creates a url for the recording and readies the next recording.
   * @param {(string)=>void} callback A callback for the url of the recording.
   */
  #processStop(callback) {
    // create url
    const recordedBlob = new Blob(this.data, { type: "video/webm" });
    const url = URL.createObjectURL(recordedBlob);

    // cleanup
    this.data = [];

    callback(url);
  }
}

export {
  Recorder,
}