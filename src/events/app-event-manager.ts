
import { AudioWorkletManager } from "../audio-worklet/audio-worklet-manager";
import { KeyManager } from "../keys/key-manager";

export abstract class AppEventManager {

  protected keyManager: KeyManager;
  protected audioWorkletManager: AudioWorkletManager;

  abstract addDOMEvents(): Promise<void>;

  constructor(keyManager: KeyManager, audioWorkletManager: AudioWorkletManager) {
    this.keyManager = keyManager;
    this.audioWorkletManager = audioWorkletManager;
  }

  protected async play(tgt: any) {
    if (!tgt) {
      return
    }
    const key = await this.keyManager.getKey(tgt.id);
    if (!key || key.isPlaying) {
      return
    }
    tgt.classList.add('pressed-key');
    key.isPlaying = true;
    this.audioWorkletManager.startAudioSideWorker(key);
  }

  protected async unplay(tgt: any) {
    if (!tgt) {
      return
    }
    tgt.classList.remove('pressed-key');
    const key = await this.keyManager.getKey(tgt.id);
    if (key) {
      key.isPlaying = false;
    }
  }
}