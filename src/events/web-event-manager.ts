import { AppValues } from "../values";
import { AppEventManager } from "./app-event-manager";
import { MobileEventManager } from "./mobile-event-manager";

export class WebEventManager extends AppEventManager {

  async addPlatformSpecificDOMEvents(): Promise<void> {
    this.keyManager.keysDomElements.forEach(el => {
      this.addMouseEvent(el);
    });
    this.addKeyboardEvents();
    if (AppValues.IS_TOUCH_DEVICE) {
      new MobileEventManager(this.keyManager, this.audioWorkletManager).addPlatformSpecificDOMEvents();
    }
  }

  private async addMouseEvent(el: HTMLDivElement): Promise<void> {
    el.addEventListener("mousedown", async (evt: MouseEvent) => this.play(evt.target));
    el.addEventListener("mouseup", async (evt: MouseEvent) => this.unplay(evt.target));
  }

  private async addKeyboardEvents(): Promise<void> {
    window.addEventListener("keydown", async (evt: KeyboardEvent) => {
      if (evt.code === "F12") {
        return;
      }
      evt.preventDefault();
      const keyObj = await this.keyManager.getKeyByKeyPressed(evt.key);
      if (keyObj) {
        const keyEl = document.querySelector<HTMLDivElement>(`#${keyObj.id}`)!;
        this.play(keyEl);
      }
    }, true);

    window.addEventListener("keyup", async (evt: KeyboardEvent) => {
      // console.log('key name ' + evt.key + ' key code ' + evt.code);
      evt.preventDefault();
      const keyObj = await this.keyManager.getKeyByKeyPressed(evt.key);
      if (keyObj) {
        const keyEl = document.querySelector<HTMLDivElement>(`#${keyObj.id}`)!;
        this.unplay(keyEl);
      }
    }, true);
  }
}