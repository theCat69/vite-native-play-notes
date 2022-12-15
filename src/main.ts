import { FullScreenButtonUIComponent } from './components/full-screen-button/full-screen-component';
import { PianoUIComponent } from './components/piano/piano-component';
import { AppEventManager } from './events/app-event-manager';
import { HTTPInitialFecthManager } from './http/http-initialfetch-manager';
import './style.scss';
import { DOMGeneratorManager } from './ui/dom-generator-manager';
import { AppValues } from './values';

// get all expected event application wide as promise
const dcl = new Promise((resolve) => window.addEventListener("DOMContentLoaded", resolve, false));

//initializing components
const piano = new PianoUIComponent();
const fullScreenButton = new FullScreenButtonUIComponent();

//initializing application DOMGenerator and AppEvent managers
//registering component by adding them in constructor
const httpInitialFecthManager = new HTTPInitialFecthManager(piano);
const domGeneratorManager = new DOMGeneratorManager(piano, fullScreenButton);
const appEventManager = new AppEventManager(piano, fullScreenButton);

//Starting to fetch file by HTTP
const httpInitialFecthPromise = httpInitialFecthManager.sendPrefetchHTTPRequest();

dcl.then(async () => {
  //waitint for DOM and http inital fetch to go further
  await Promise.all([
    //when dom content is initally loaded we needed DOM using javascript
    domGeneratorManager.generateDOM(),
    httpInitialFecthPromise
  ]);


  //then when DOM is fully initialized we add corresponding event
  await appEventManager.addDOMEvents();

  //then on mobile we ask the user if he would like to go in full-screen mode
  if (AppValues.IS_MOBILE) {
    document.addEventListener('click', () => {
      confirm("This website is better experienced in full-screen mode would you like to go to full-screen now ?") ? fullScreenButton.gotFullScreen() : null;
    }, { once: true });
  }

});







