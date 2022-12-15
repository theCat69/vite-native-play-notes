import fullScreenIconUrl from '../../../svg/full-screen.svg?raw';
import minimizeIconUrl from '../../../svg/minimize.svg?raw';
import { DOMEventSupplier } from '../../events/dom-event-supplier';
import { AppValues } from '../../values';
import { DOMGenerator } from '../../ui/dom-generator';

export class FullScreenButtonUIComponent implements DOMEventSupplier, DOMGenerator {

  private fullScreenIcon: string = fullScreenIconUrl;
  private minimizeIcon: string = minimizeIconUrl;
  private appElement?: HTMLDivElement;
  private fullScreenButton?: HTMLDivElement;
  private isInFullScreenMode = false;
  private isLocked = false;

  async generateDOM(): Promise<void> {
    this.fullScreenButton = document.querySelector('#full-screen-button')!!;
    this.appElement = document.querySelector('#app')!!;
    this.fullScreenButton.innerHTML = this.fullScreenIcon;
  }
  
  async addDOMEvent(): Promise<void> {
    this.addFullScreenEvent();
  }

  private async addFullScreenEvent() {
    this.appElement?.addEventListener('fullscreenchange', () => this.handleOnScreenChange());

    this.fullScreenButton?.addEventListener('click', () => {
      if(this.isLocked) {
        return
      }
      if (!this.isInFullScreenMode) {
        this.gotFullScreen();
      } else {
        (document.exitFullscreen() || (document as any).webkitCancelFullScreen())
          .then(() => this.minimize());
      }
    });
  }

  async gotFullScreen() {
    this.requestFullScreen(this.appElement).then(() => this.fullScreen());
  }

  private requestFullScreen(el: any) {
    return el.requestFullscreen() || el.webkitRequestFullscreen();
  }

  private async handleOnScreenChange() {
    if (!this.isInFullScreenMode) {
      this.fullScreenButton?.classList.add('minimize-button');
      this.isInFullScreenMode = true;
    } else {
      this.fullScreenButton?.classList.remove('minimize-button');
      this.isInFullScreenMode = false;
    }
  }

  private minimize() {
    if (AppValues.IS_MOBILE) {
      screen.orientation.lock("portrait");
    }
    this.fullScreenButton!!.innerHTML = this.fullScreenIcon;
  }

  private fullScreen() {
    if (AppValues.IS_MOBILE) {
      screen.orientation.lock("landscape");
    }
    this.fullScreenButton!!.innerHTML = this.minimizeIcon;
  }

  async lockFullScreen() {
    this.isLocked = true;
  }

  async unlockFullScreen() {
    this.isLocked = false;
  }
}