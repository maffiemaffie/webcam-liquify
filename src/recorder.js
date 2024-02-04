class Recorder {
  constructor(canvas, frameRate = 30) {
    const stream = canvas.captureStream(frameRate);
    this.recorder = new MediaRecorder(stream);
    this.data = [];

    this.recorder.ondataavailable = (event) => this.data.push(event.data);
    this.recorder.onstart = () => console.log("started recording");
  }

  start() {
    this.recorder.start();
  }

  stop(callback) {
    this.recorder.addEventListener('stop', () => this.processStop(callback));

    if (this.recorder.state === 'recording') {
      this.recorder.stop();
    }
  }

  processStop(callback) {
    const recordedBlob = new Blob(this.data, { type: "video/webm" });
    console.log(`recorded: ${recordedBlob.size} bytes of video`);
    const url = URL.createObjectURL(recordedBlob);
    callback(url);
  }
}

export {
  Recorder,
}