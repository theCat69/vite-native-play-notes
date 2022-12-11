import { AudioWorkletManager } from './audio-worklet/audio-worklet-manager';
import { AppEventManagerFactory } from './events/app-event-manager-factory';
import { KeyManager } from './keys/key-manager';
import './style.css';

const keyManager = new KeyManager();
const audioWorkletManager = new AudioWorkletManager(keyManager);
const appEventManager = AppEventManagerFactory.getEventManager(keyManager, audioWorkletManager);

const dcl = new Promise((resolve) => window.addEventListener("DOMContentLoaded", resolve, false));
const mp3Loaded = new Promise((resolve) => window.addEventListener("KeysInitialized", resolve, false));
Promise.all([dcl, mp3Loaded]).then(() => appEventManager.addEvents());










