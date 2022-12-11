import { Key, KeyManager } from "../keys/key-manager";
import atanProcessorUrl from "./audio-worklet.js?url";

export class AudioWorkletManager {

  private keyManager: KeyManager;

  static readonly KEY_INITIALIZED_EVENT = 'KeysInitialized';

  constructor(keyManager: KeyManager) {
    this.keyManager = keyManager;
    window.addEventListener(KeyManager.MP3_READY_EVENT, () => this.initKeys())
  }

  async createWorkletNode(
    context: BaseAudioContext,
    name: string,
    url: string
  ) {
    // ensure audioWorklet has been loaded
    try {
      return new AudioWorkletNode(context, name);
    } catch (err) {
      await context.audioWorklet.addModule(url);
      return new AudioWorkletNode(context, name);
    }
  }

  async startAudioSideWorker(noteKey: Key) {
    const context = noteKey.audioContext!;
    // create source and set buffer
    const source = context.createBufferSource();
    source.buffer = noteKey.buffer!;
    // connect everything and automatically start playing
    source.connect(noteKey.audioWorkletNode!).connect(context.destination);
    source.start(0);
  }

  private async initKeys() {
    const promises: Promise<void>[] = [];
    this.keyManager.keyList.forEach(key => promises.push(this.initKey(key)));
    Promise.all(promises).then(() => window.dispatchEvent(new Event(AudioWorkletManager.KEY_INITIALIZED_EVENT)))
  }

  private async initKey(noteKey: Key): Promise<void> {
    if (!noteKey.file) {
      return // I need to do something here even if it never happens
    }
    //creating audiocontext if it doesnt exist
    if (!noteKey.audioContext) {
      noteKey.audioContext = new AudioContext();
    }

    const context = noteKey.audioContext;
    // convert uploaded file to AudioBuffer
    if (!noteKey.buffer) {
      noteKey.buffer = await context.decodeAudioData(await noteKey.file!.arrayBuffer());
    }

    if (!noteKey.audioWorkletNode) {
      noteKey.audioWorkletNode = await this.createWorkletNode(context, "atan-processor", atanProcessorUrl);
    }
  }
}