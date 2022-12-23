import { PianoEventManager } from "./piano-event-manager";

type AppTouch = {
  identifier: number;
  pageX: number;
  pageY: number;
  target: any;
}

export class MobileEventManager extends PianoEventManager {

  async addPlatformSpecificDOMEvents(): Promise<void> {
    this.keyManager.keysDomElements.forEach(el => {
      this.addOnTouchEvent(el);
    });
  }

  private ongoingTouches: AppTouch[] = [];

  private copyTouch({ identifier, pageX, pageY, target }: Touch): AppTouch {
    return { identifier, pageX, pageY, target };
  }

  private ongoingTouchIndexById(idToFind: number): number {
    for (let i = 0; i < this.ongoingTouches.length; i++) {
      const id = this.ongoingTouches[i].identifier;
      if (id === idToFind) {
        return i;
      }
    }
    return -1;    // not found
  }

  private async addOnTouchEvent(el: HTMLDivElement): Promise<void> {
    el.addEventListener('touchend', (evt: TouchEvent) => this.handleEnd(evt));
    el.addEventListener('touchstart', (evt: TouchEvent) => this.handleStart(evt));
    el.addEventListener('touchcancel', (evt: TouchEvent) => this.handleCancel(evt));
    el.addEventListener('touchmove', (evt: TouchEvent) => this.handleMove(evt));
  }

  private async handleStart(evt: TouchEvent): Promise<void> {
    /*   evt.preventDefault(); */
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.play(touches[i].target);
      this.ongoingTouches.push(this.copyTouch(touches[i]));
    }
  }

  private async handleMove(evt: TouchEvent): Promise<void> {
    /*   evt.preventDefault(); */
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const idx = this.ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        const el = document.elementFromPoint(touches[i].pageX, touches[i].pageY);
        if (el && this.ongoingTouches[idx].target.id !== el.id) {
          this.unplay(this.ongoingTouches[idx].target);
          this.ongoingTouches[idx].target = el;
        }
        this.play(el);
      }
    }
  }

  private async handleEnd(evt: TouchEvent): Promise<void> {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const idx = this.ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        this.ongoingTouches.splice(idx, 1);
      }
      const el = document.elementFromPoint(touches[i].pageX, touches[i].pageY);
      this.unplay(touches[i].target);
      this.unplay(el);
    }
  }


  private async handleCancel(evt: TouchEvent): Promise<void> {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const idx = this.ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        this.ongoingTouches.splice(idx, 1);
      }
      this.unplay(touches[i].target);
    }
  }

}
