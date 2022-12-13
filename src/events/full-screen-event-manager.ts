export class FullScreenEventManager {

  private appElement?: HTMLDivElement;
  private isInFullScreenMode = false;

  constructor() {
    this.initializeAppElement();
    this.addFullScreenEvent();
  }

  private initializeAppElement(): void {
    this.appElement = document.querySelector('#app')!
  }

  private async addFullScreenEvent() {
    const fullscreenButton = document.querySelector('#full-screen-button');
    fullscreenButton?.addEventListener('click', () => {
      if (!this.isInFullScreenMode) {
        this.appElement?.requestFullscreen().then(() => this.isInFullScreenMode = true);
      } else {
        document.exitFullscreen().then(() => this.isInFullScreenMode = false);
      }
    })
  }
}