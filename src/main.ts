import { AudioWorkletManager } from './audio-worklet/audio-worklet-manager';
import { AppEventManagerFactory } from './events/app-event-manager-factory';
import { PianoUIComponent } from './keys/key-manager';
import './style.scss';
import { DOMGeneratorManager } from './ui/dom-generator-manager';
import { FullScreenUIComponent } from './ui/full-screen-button';

const dcl = new Promise((resolve) => window.addEventListener("DOMContentLoaded", resolve, false));
const keyDOMReady = new Promise((resolve) => window.addEventListener(PianoUIComponent.NOTE_DOM_READY_EVENT, resolve, false));
const keysInitiliazed = new Promise((resolve) => window.addEventListener(AudioWorkletManager.KEY_INITIALIZED_EVENT, resolve, false));

const keyManager = new PianoUIComponent();
const audioWorkletManager = new AudioWorkletManager(keyManager);

const fullScreenButton = new FullScreenUIComponent();
const domGeneratorManager = new DOMGeneratorManager(fullScreenButton);

dcl.then(() => {
  console.log('dcl resolved');
  return domGeneratorManager.generateDOM();
});

Promise.all([dcl, keyDOMReady, keysInitiliazed]).then(() => {
  const appEventManager = AppEventManagerFactory.getEventManager(keyManager, audioWorkletManager, fullScreenButton);
  appEventManager.addPlatformSpecificDOMEvents();
  appEventManager.addDOMEvents();
});




