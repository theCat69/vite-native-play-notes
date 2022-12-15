import { AppEventManager } from './events/app-event-manager';
import './style.scss';
import { DOMGeneratorManager } from './ui/dom-generator-manager';
import { FullScreenButtonUIComponent } from './components/full-screen-button/full-screen-component';
import { PianoUIComponent } from './components/piano/piano-component';
import { AudioWorkletManager } from './components/piano/audio-worklet/audio-worklet-manager';

// get all expected event application wide as promise
const dcl = new Promise((resolve) => window.addEventListener("DOMContentLoaded", resolve, false));
const keysInitiliazed = new Promise((resolve) => window.addEventListener(AudioWorkletManager.KEY_INITIALIZED_EVENT, resolve, false)); // we keep this until we create an HTTP initial fetch manager

//initializing components
const piano = new PianoUIComponent();
const fullScreenButton = new FullScreenButtonUIComponent();

//initializing application DOMGenerator and AppEvent managers
//registering component by adding them in constructor
const domGeneratorManager = new DOMGeneratorManager(fullScreenButton, piano);
const appEventManager = new AppEventManager(piano, fullScreenButton);

//when dom content is initally loaded we needed DOM using javascript
dcl.then(() => {
  //then when DOM is fully initialized we add correponding event
  Promise.all([
    domGeneratorManager.generateDOM(),
    keysInitiliazed
  ]).then(() => {
    console.log('adding dom events');
    appEventManager.addDOMEvents();
  });
});





