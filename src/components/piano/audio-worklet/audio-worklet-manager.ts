import { Key, PianoUIComponent } from "../piano-component";
import atanProcessorUrl from "./audio-worklet.js?url";

export class AudioWorkletManager {

  private audioContext?: AudioContext;

  private keyManager: PianoUIComponent;

  static readonly KEY_INITIALIZED_EVENT = 'KeysInitialized';

  constructor(keyManager: PianoUIComponent) {
    this.keyManager = keyManager;
  }

  async createWorkletNode(context: BaseAudioContext, name: string, url: string) {
    // ensure audioWorklet has been loaded
    try {
      return new AudioWorkletNode(context, name);
    } catch (err) {
      await context.audioWorklet.addModule(url);
      return new AudioWorkletNode(context, name);
    }
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
    Promise.all(promises).then(() => window.dispatchEvent(new Event(AudioWorkletManager.KEY_INITIALIZED_EVENT)));
  }

  private async initKey(noteKey: Key): Promise<void> {
    if (!noteKey.blobBuffer) {
      return // I need to do something here even if it never happens
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
      noteKey.audioWorkletNode = await this.createWorkletNode(context, "atan-processor", atanProcessorUrl);
    }
  }
}