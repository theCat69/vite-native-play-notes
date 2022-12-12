import { AudioWorkletManager } from "../audio-worklet/audio-worklet-manager";
import { KeyManager } from "../keys/key-manager";
import { AppValues } from "../values";
import { AppEventManager } from "./app-event-manager";
import { MobileEventManager } from "./mobile-event-manager";
import { WebEventManager } from "./web-event-manager";


export class AppEventManagerFactory {

  static getEventManager(keyManager: KeyManager, audioWorkletManager: AudioWorkletManager): AppEventManager {
    if (AppValues.IS_MOBILE) {
      return new MobileEventManager(keyManager, audioWorkletManager);
    } else {
      return new WebEventManager(keyManager, audioWorkletManager);
    }
  }
}