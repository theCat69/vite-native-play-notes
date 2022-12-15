import { AppValues } from '../../../values';
import { AudioWorkletManager } from '../audio-worklet/audio-worklet-manager';
import { PianoUIComponent } from '../piano-component';
import { MobileEventManager } from "./mobile-event-manager";
import { PianoEventManager } from './piano-event-manager';
import { WebEventManager } from "./web-event-manager";


export class PianoEventManagerFactory {

  static getEventManager(keyManager: PianoUIComponent, audioWorkletManager: AudioWorkletManager): PianoEventManager {
    if (AppValues.IS_MOBILE) {
      return new MobileEventManager(keyManager, audioWorkletManager);
    } else {
      return new WebEventManager(keyManager, audioWorkletManager);
    }
  }
}