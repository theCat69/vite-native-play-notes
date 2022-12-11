
import { AudioWorkletManager } from "../audio-worklet/audio-worklet-manager";
import { KeyManager } from "../keys/key-manager";

export abstract class AppEventManager {

  protected keyManager: KeyManager;
  private audioWorkletManager: AudioWorkletManager;

  abstract addDOMEvents(): Promise<void>;

  constructor(keyManager: KeyManager, audioWorkletManager: AudioWorkletManager) {
    this.keyManager = keyManager;
    this.audioWorkletManager = audioWorkletManager;
  }

  protected play(tgt: any) {
    if (!tgt) {
      return
    }
    const key = this.keyManager.getKey(tgt.id);
    if (!key || key.isPlaying) {
      return
    }
    tgt.classList.add('pressed-key');
    key.isPlaying = true;
    this.audioWorkletManager.startAudioSideWorker(key);
  }

  protected unplay(tgt: any) {
    if (!tgt) {
      return
    }
    tgt.classList.remove('pressed-key');
    const key = this.keyManager.getKey(tgt.id);
    if (key) {
      key.isPlaying = false;
    }
  }
}