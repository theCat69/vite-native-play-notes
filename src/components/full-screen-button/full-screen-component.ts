import fullScreenIconUrl from '../../../svg/full-screen.svg?raw';
import minimizeIconUrl from '../../../svg/minimize.svg?raw';
import { DOMEventSupplier } from '../../events/dom-event-supplier';
import { AppValues } from '../../values';
import { DOMGenerator } from '../../ui/dom-generator';

export class FullScreenButtonUIComponent implements DOMEventSupplier, DOMGenerator {

  private fullScreenIcon: string = fullScreenIconUrl;
  private minimizeIcon: string = minimizeIconUrl;
  private appElement: HTMLDivElement;
  private fullScreenButton: HTMLDivElement;
  private isInFullScreenMode = false;

  constructor() {
    this.fullScreenButton = document.querySelector('#full-screen-button')!;
    this.appElement = document.querySelector('#app')!;
  }

  async generateDOM(): Promise<void> {
    if (this.fullScreenButton) {
      this.fullScreenButton.innerHTML = this.fullScreenIcon;
    }
  }

  async addDOMEvent(): Promise<void> {
    this.addFullScreenEvent();
  }

  private async addFullScreenEvent() {
    this.appElement?.addEventListener('fullscreenchange', () => this.handleOnScreenChange());

    this.fullScreenButton?.addEventListener('click', () => {
      console.log(this.isInFullScreenMode);
      if (!this.isInFullScreenMode) {
        this.gotFullScreen();
      } else {
        document.exitFullscreen().then(() => this.minimize());
      }
    });
  }

  async gotFullScreen(): Promise<void> {
    this.appElement?.requestFullscreen().then(() => this.fullScreen());
  }

  private async handleOnScreenChange() {
    if (!this.isInFullScreenMode) {
      this.fullScreenButton.classList.add('minimize-button');
      this.isInFullScreenMode = true;
    } else {
      this.fullScreenButton.classList.remove('minimize-button');
      this.isInFullScreenMode = false;
    }
  }

  private minimize() {
    if (AppValues.IS_MOBILE) {
      screen.orientation.lock("portrait");
    }
    this.fullScreenButton.innerHTML = this.fullScreenIcon;
  }

  private fullScreen() {
    if (AppValues.IS_MOBILE) {
      screen.orientation.lock("landscape");
    }
    this.fullScreenButton.innerHTML = this.minimizeIcon;
  }
}