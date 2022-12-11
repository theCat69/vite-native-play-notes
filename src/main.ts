import { AudioWorkletManager } from './audio-worklet/audio-worklet-manager';
import { AppEventManagerFactory } from './events/app-event-manager-factory';
import { KeyManager } from './keys/key-manager';
import './style.css';

const dcl = new Promise((resolve) => window.addEventListener("DOMContentLoaded", resolve, false));
const keyDOMReady = new Promise((resolve) => window.addEventListener(KeyManager.NOTE_DOM_READY_EVENT, resolve, false));
const keysInitiliazed = new Promise((resolve) => window.addEventListener(AudioWorkletManager.KEY_INITIALIZED_EVENT, resolve, false));

const keyManager = new KeyManager();
const audioWorkletManager = new AudioWorkletManager(keyManager);
const appEventManager = AppEventManagerFactory.getEventManager(keyManager, audioWorkletManager);

Promise.all([dcl, keyDOMReady, keysInitiliazed]).then(() => appEventManager.addDOMEvents());
