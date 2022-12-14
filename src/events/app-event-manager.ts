
import { AudioWorkletManager } from "../audio-worklet/audio-worklet-manager";
import { PianoUIComponent } from "../keys/key-manager";
import { DOMEventSupplier } from "./dom-event-producer";

export abstract class AppEventManager {

  protected keyManager: PianoUIComponent;
  protected audioWorkletManager: AudioWorkletManager;
  private domEventProducers: DOMEventSupplier[];

  constructor(keyManager: PianoUIComponent, audioWorkletManager: AudioWorkletManager, ...domEventProducers: DOMEventSupplier[]) {
    this.keyManager = keyManager;
    this.audioWorkletManager = audioWorkletManager;
    this.domEventProducers = domEventProducers;
  }

  abstract addPlatformSpecificDOMEvents(): Promise<void>;

  public async addDOMEvents(): Promise<void> {
    this.domEventProducers.forEach(async (eventProducer) => eventProducer.addDOMEvent());
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