
import { AudioWorkletManager } from "../audio-worklet/audio-worklet-manager";
import { PianoUIComponent } from "../piano-component";

export abstract class PianoEventManager {

  protected keyManager: PianoUIComponent;
  protected audioWorkletManager: AudioWorkletManager;

  constructor(keyManager: PianoUIComponent, audioWorkletManager: AudioWorkletManager) {
    this.keyManager = keyManager;
    this.audioWorkletManager = audioWorkletManager;
  }

  abstract addPlatformSpecificDOMEvents(): Promise<void>;

  protected async play(tgt: any) {
    if (!tgt) {
      return;
    }
    const key = await this.keyManager.getKey(tgt.id);
    if (!key || key.isPlaying) {
      return;
    }
    tgt.classList.add('pressed-key');
    key.isPlaying = true;
    this.audioWorkletManager.startAudioSideWorker(key);
  }

  protected async unplay(tgt: any) {
    if (!tgt) {
      return;
    }
    const key = await this.keyManager.getKey(tgt.id);
    if (key) {
      tgt.classList.remove('pressed-key');
      key.isPlaying = false;
    }
  }
}