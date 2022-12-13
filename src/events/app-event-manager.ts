
import { AudioWorkletManager } from "../audio-worklet/audio-worklet-manager";
import { KeyManager } from "../keys/key-manager";
import { FullScreenEventManager } from "./full-screen-event-manager";

export abstract class AppEventManager {

  protected keyManager: KeyManager;
  protected audioWorkletManager: AudioWorkletManager;

  constructor(keyManager: KeyManager, audioWorkletManager: AudioWorkletManager) {
    this.keyManager = keyManager;
    this.audioWorkletManager = audioWorkletManager;
  }

  abstract addSpecificDOMEvents(): Promise<void>;

  public async addDOMEvents(): Promise<void> {
    new FullScreenEventManager();
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
    const key = await this.keyManager.getKey(tgt.id);
    if (key) {
      tgt.classList.remove('pressed-key');
      key.isPlaying = false;
    }
  }
}