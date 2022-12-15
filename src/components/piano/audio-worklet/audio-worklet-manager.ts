import { Key, PianoUIComponent } from "../piano-component";
import KeyProcessor from "./audio-worklet.js?url";

export class AudioWorkletManager {

  private audioContext?: AudioContext;

  private keyManager: PianoUIComponent;

  constructor(keyManager: PianoUIComponent) {
    this.keyManager = keyManager;
  }

  async createWorkletNode(context: BaseAudioContext, name: string) {
    await context.audioWorklet.addModule(KeyProcessor);
    return new AudioWorkletNode(context, name);
  }

  async startAudioSideWorker(noteKey: Key) {
    const context = this.audioContext!;
    // create source and set buffer
    const source = context.createBufferSource();
    source.buffer = noteKey.audioBuffer!;
    // connect everything and automatically start playing
    source.connect(noteKey.audioWorkletNode!).connect(context.destination);
    source.start(0);
  }

  async initKeys() {
    const promises: Promise<void>[] = [];
    this.keyManager.keyList.forEach(key => promises.push(this.initKey(key)));
    await Promise.all(promises);
  }

  private async initKey(noteKey: Key): Promise<void> {
    if (!noteKey.blobBuffer) {
      return; // I need to do something here even if it never happens
    }
    //creating audiocontext if it doesnt exist
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    const context = this.audioContext;
    // convert uploaded file to AudioBuffer
    if (!noteKey.audioBuffer) {
      noteKey.audioBuffer = await context.decodeAudioData(noteKey.blobBuffer!!);
    }

    if (!noteKey.audioWorkletNode) {
      noteKey.audioWorkletNode = await this.createWorkletNode(context, "key-processor");
    }
  }
}