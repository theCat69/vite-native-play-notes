import fullScreenIconUrl from '../../svg/full-screen.svg?url';
import minimizeIconUrl from '../../svg/minimize.svg?url';
import { DOMEventProducer } from '../events/dom-event-producer';
import { AppValues } from '../values';

export class FullScreenUIComponent implements DOMEventProducer {

  private fullScreenIcon?: string;
  private minimizeIcon?: string;
  private appElement: HTMLDivElement;
  private fullScreenButton: HTMLDivElement;
  private isInFullScreenMode = false;

  constructor() {
    this.fullScreenButton = document.querySelector('#full-screen-button')!;
    this.appElement = document.querySelector('#app')!;
    this.generateDOMForButton();
  }

  private async generateDOMForButton(): Promise<void> {
    if (this.fullScreenButton) {
      Promise.all([
        (await fetch(fullScreenIconUrl)).text().then((text) => this.fullScreenIcon = text),
        (await fetch(minimizeIconUrl)).text().then((text) => this.minimizeIcon = text),
      ]).then(
        () => this.fullScreenButton.innerHTML = this.fullScreenIcon!!
      );
    }
  }

  async addDOMEvent(): Promise<void> {
    this.addFullScreenEvent();
  }

  private async addFullScreenEvent() {
    const fullscreenButton = document.querySelector('#full-screen-button');
    fullscreenButton?.addEventListener('click', () => {
      if (!this.isInFullScreenMode) {
        this.appElement?.requestFullscreen().then(() => {
          if (AppValues.IS_MOBILE) {
            screen.orientation.lock("landscape");
          }
          this.isInFullScreenMode = true
          this.fullScreenButton.innerHTML = this.minimizeIcon!!;
          this.fullScreenButton.classList.add('minimize-button');
        });
      } else {
        document.exitFullscreen().then(() => {
          if (AppValues.IS_MOBILE) {
            screen.orientation.lock("landscape");
          }
          this.isInFullScreenMode = false;
          this.fullScreenButton.innerHTML = this.fullScreenIcon!!;
          this.fullScreenButton.classList.remove('minimize-button');
        });
      }
    })
  }
}