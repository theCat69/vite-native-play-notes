import { DOMEventSupplier } from '../events/dom-event-producer';
import { DOMGenerator } from '../ui/dom-generator';
import { AppValues } from '../values';
import { KEY_LIST } from './keys';

export type Key = {
  id: string;
  name: string;
  url: string,
  keyPress: string;
  isWhite: boolean;
  blobBuffer?: ArrayBuffer;
  audioBuffer?: AudioBuffer;
  audioWorkletNode?: AudioWorkletNode;
  audioContext?: AudioContext;
  isPlaying: boolean;
}

export class PianoUIComponent implements DOMGenerator, DOMEventSupplier {
  keyList: Key[] = KEY_LIST;

  keysDomElements: HTMLDivElement[] = [];

  static readonly MP3_READY_EVENT = 'Mp3Loaded';
  static readonly NOTE_DOM_READY_EVENT = 'NoteDOMReady';

  constructor() {
    this.fetchAllKeysMp3();
    this.generateDOM().then(() => this.loadDomKeyElements());
  }
  addDOMEvent(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async loadDomKeyElements(): Promise<void> {
    const keys = document.querySelectorAll<HTMLDivElement>('.keys')!;
    const blackKeys = document.querySelectorAll<HTMLDivElement>('.black-keys')!;
    keys.forEach(key => this.keysDomElements.push(key))
    blackKeys.forEach(key => this.keysDomElements.push(key))
    window.dispatchEvent(new Event(PianoUIComponent.NOTE_DOM_READY_EVENT));
  }

  private async fetchAllKeysMp3(): Promise<void> {
    const promises: Promise<void>[] = [];
    this.keyList.forEach((key) => promises.push(this.fetchMp3WithXhr(key)));
    Promise.all(promises).then(() => window.dispatchEvent(new Event(PianoUIComponent.MP3_READY_EVENT)));
  }

  private async fetchMp3WithXhr(key: Key): Promise<void> {
    key.blobBuffer = await (await (await fetch(new Request(key.url))).blob()).arrayBuffer();
  }

  async generateDOM(): Promise<void> {
    const htmlContainer = document.querySelector<HTMLDivElement>('#container')!
    let containerInnerHtml = "";
    this.keyList.forEach(
      key => {
        if (!key.isWhite) {
          containerInnerHtml += `<div class="black-keys black-keys-size" id="${key.id}"><div class="name no-pointer-event">${key.name}</div>`;        
        } else {
          containerInnerHtml += `<div class="keys keys-size" id="${key.id}"><div class="key-subcontainer"><div class="name no-pointer-event">${key.name}</div>`;
        }
        if(!AppValues.IS_MOBILE) {
          containerInnerHtml += `<div class="key-to-press no-pointer-event">${key.keyPress.toUpperCase()}</div>`
        }
        if(key.isWhite) {
          containerInnerHtml += "</div>";
        }
        containerInnerHtml += "</div>";
      }
    )
    htmlContainer.innerHTML = containerInnerHtml;
  }

  async getKey(keyId: string): Promise<Key | undefined> {
    return this.keyList.find((keyOb) => keyId === keyOb.id);
  }

  async getKeyByKeyPressed(keyPressed: string): Promise<Key | undefined> {
    return this.keyList.find(keyObj => keyPressed === keyObj.keyPress);
  }
}