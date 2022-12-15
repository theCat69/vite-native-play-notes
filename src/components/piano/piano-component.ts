import { AudioWorkletManager } from './audio-worklet/audio-worklet-manager';
import { KEY_LIST } from './keys';
import { PianoEventManager } from './events/piano-event-manager';
import { PianoEventManagerFactory } from './events/piano-event-manager-factory';
import { DOMGenerator } from '../../ui/dom-generator';
import { DOMEventSupplier } from '../../events/dom-event-supplier';
import { AppValues } from '../../values';
import { HTTPPrefetchSupplier } from '../../http/http-fetch-supplier';

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

export class PianoUIComponent implements DOMGenerator, DOMEventSupplier, HTTPPrefetchSupplier {
  keyList: Key[] = KEY_LIST;
  keysDomElements: HTMLDivElement[] = [];

  audioWorkletManager: AudioWorkletManager;
  pianoEventManager: PianoEventManager;

  constructor() {
    this.audioWorkletManager = new AudioWorkletManager(this);
    this.pianoEventManager = PianoEventManagerFactory.getEventManager(this, this.audioWorkletManager);
  }
  
  async sendPrefetchHTTPRequest(): Promise<void> {
    await this.fetchAllKeysMp3();
    await this.audioWorkletManager.initKeys();
  }

  async addDOMEvent(): Promise<void> {
    this.pianoEventManager.addPlatformSpecificDOMEvents();
  }

  private async loadDomKeyElements(): Promise<void> {
    const keys = document.querySelectorAll<HTMLDivElement>('.keys')!;
    const blackKeys = document.querySelectorAll<HTMLDivElement>('.black-keys')!;
    keys.forEach(key => this.keysDomElements.push(key))
    blackKeys.forEach(key => this.keysDomElements.push(key))
  }

  private async fetchAllKeysMp3(): Promise<void> {
    const promises: Promise<void>[] = [];
    this.keyList.forEach((key) => promises.push(this.fetchMp3WithXhr(key)));
    await Promise.all(promises);
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
    await this.loadDomKeyElements();
  }

  async getKey(keyId: string): Promise<Key | undefined> {
    return this.keyList.find((keyOb) => keyId === keyOb.id);
  }

  async getKeyByKeyPressed(keyPressed: string): Promise<Key | undefined> {
    return this.keyList.find(keyObj => keyPressed === keyObj.keyPress);
  }
}