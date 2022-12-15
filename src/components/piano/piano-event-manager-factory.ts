import { AudioWorkletManager } from "./audio-worklet/audio-worklet-manager";
import { PianoUIComponent } from "../piano/piano-component";
import { AppValues } from '../../values';
import { MobileEventManager } from './events/mobile-event-manager';
import { WebEventManager } from './events/web-event-manager';
import { PianoEventManager } from './events/piano-event-manager';


export class PianoEventManagerFactory {

  static getEventManager(keyManager: PianoUIComponent, audioWorkletManager: AudioWorkletManager): PianoEventManager {
    if (AppValues.IS_MOBILE) {
      return new MobileEventManager(keyManager, audioWorkletManager);
    } else {
      return new WebEventManager(keyManager, audioWorkletManager);
    }
  }
}