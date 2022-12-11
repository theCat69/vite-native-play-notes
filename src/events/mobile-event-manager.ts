import { AppEventManager } from "./app-event-manager";

export class MobileEventManager extends AppEventManager {

    addEvents(): void {
        this.keyManager.keysDomElements.forEach(el => {
            this.addOnTouchEvent(el);
        });
    }

    private addOnTouchEvent(el: HTMLDivElement): void {
        el.addEventListener('touchend', (evt: TouchEvent) => this.handleEnd(evt));
        el.addEventListener('touchstart', (evt: TouchEvent) => this.handleStart(evt));
        el.addEventListener('touchcancel', (evt: TouchEvent) => this.handleCancel(evt));
        el.addEventListener('touchmove', (evt: TouchEvent) => this.handleMove(evt));
    }

    private handleStart(evt: TouchEvent): void {
        evt.preventDefault();
        console.log('touchstart.');
        const touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            this.play(touches[i].target);
        }
    }

    private handleMove(evt: TouchEvent): void {
        evt.preventDefault();
        const touches = evt.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const el = document.elementFromPoint(touches[i].pageX, touches[i].pageY);
            this.play(el);
        }
    }

    private handleEnd(evt: TouchEvent): void {
        evt.preventDefault();
        const touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            this.unplay(touches[i].target);
        }
    }

    private handleCancel(evt: TouchEvent): void {
        evt.preventDefault();
        const touches = evt.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            this.unplay(touches[i].target);
        }
    }
}

/* let ongoinTouches: { identifier: number, pageX: number, pageY: number, target: EventTarget }[] = []; */

/* const copyTouch = ({ identifier, pageX, pageY, target } : Touch) => {
  return { identifier, pageX, pageY, target };
} */

/* const ongoingTouchIndexById = (idToFind: number) => {
  for (let i = 0; i < ongoinTouches.length; i++) {
    const id = ongoinTouches[i].identifier;

    if (id === idToFind) {
      return i;
    }
  }
  return -1;    // not found
} */
