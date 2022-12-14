import { AudioWorkletManager } from "../audio-worklet/audio-worklet-manager";
import { PianoUIComponent } from "../keys/key-manager";
import { AppValues } from "../values";
import { AppEventManager } from "./app-event-manager";
import { DOMEventSupplier } from "./dom-event-producer";
import { MobileEventManager } from "./mobile-event-manager";
import { WebEventManager } from "./web-event-manager";


export class AppEventManagerFactory {

  static getEventManager(keyManager: PianoUIComponent, audioWorkletManager: AudioWorkletManager, ...domEventProducers: DOMEventSupplier[]): AppEventManager {
    if (AppValues.IS_MOBILE) {
      return new MobileEventManager(keyManager, audioWorkletManager, ...domEventProducers);
    } else {
      return new WebEventManager(keyManager, audioWorkletManager, ...domEventProducers);
    }
  }
}