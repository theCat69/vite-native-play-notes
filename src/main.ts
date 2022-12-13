import { AudioWorkletManager } from './audio-worklet/audio-worklet-manager';
import { AppEventManagerFactory } from './events/app-event-manager-factory';
import { KeyManager } from './keys/key-manager';
import './style.css';
import { FullScreenUIComponent } from './ui/full-screen-button';

const dcl = new Promise((resolve) => window.addEventListener("DOMContentLoaded", resolve, false));
const keyDOMReady = new Promise((resolve) => window.addEventListener(KeyManager.NOTE_DOM_READY_EVENT, resolve, false));
const keysInitiliazed = new Promise((resolve) => window.addEventListener(AudioWorkletManager.KEY_INITIALIZED_EVENT, resolve, false));

const keyManager = new KeyManager();
const audioWorkletManager = new AudioWorkletManager(keyManager);

Promise.all([dcl, keyDOMReady, keysInitiliazed]).then(() => {
  const fullScreenButton = new FullScreenUIComponent();
  const appEventManager = AppEventManagerFactory.getEventManager(keyManager, audioWorkletManager, fullScreenButton);
  appEventManager.addPlatformSpecificDOMEvents();
  appEventManager.addDOMEvents();
});




