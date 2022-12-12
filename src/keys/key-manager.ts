import ab3Url from '../../musicPiano/Ab3.mp3';
import a3Url from '../../musicPiano/A3.mp3';
import bb3Url from '../../musicPiano/Bb3.mp3';
import b3Url from '../../musicPiano/B3.mp3';
import c3Url from '../../musicPiano/C3.mp3';
import c4Url from '../../musicPiano/C4.mp3';
import db3Url from '../../musicPiano/Db3.mp3';
import db4Url from '../../musicPiano/Db4.mp3';
import d3Url from '../../musicPiano/D3.mp3';
import d4Url from '../../musicPiano/D4.mp3';
import eb3Url from '../../musicPiano/Eb3.mp3';
import eb4Url from '../../musicPiano/Eb4.mp3';
import e3Url from '../../musicPiano/E3.mp3';
import e4Url from '../../musicPiano/E4.mp3';
import f3Url from '../../musicPiano/F3.mp3';
import f4Url from '../../musicPiano/F4.mp3';
import gb3Url from '../../musicPiano/Gb3.mp3';
import gb4Url from '../../musicPiano/Gb4.mp3';
import g3Url from '../../musicPiano/G3.mp3';
import g4Url from '../../musicPiano/G4.mp3';
import { AppValues } from '../values';

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

export class KeyManager {
  keyList: Key[] = [
    {
      id: "keyC3",
      name: "Do",
      url: c3Url,
      keyPress: "q",
      isWhite: true,
      isPlaying: false
    },
    {
      id: 'keyDb3',
      name: 'Do#',
      url: db3Url,
      keyPress: "z",
      isWhite: false,
      isPlaying: false
    },
    {
      id: "keyD3",
      name: "Ré",
      url: d3Url,
      keyPress: "s",
      isWhite: true,
      isPlaying: false
    },
    {
      id: "keyEb3",
      name: "Ré#",
      url: eb3Url,
      keyPress: "e",
      isWhite: false,
      isPlaying: false
    },
    {
      id: "keyE3",
      name: "Mi",
      url: e3Url,
      keyPress: "d",
      isWhite: true,
      isPlaying: false
    },
    {
      id: "keyF3",
      name: "Fa",
      url: f3Url,
      keyPress: "f",
      isWhite: true,
      isPlaying: false
    },
    {
      id: "keyGb3",
      name: "Fa#",
      url: gb3Url,
      keyPress: "t",
      isWhite: false,
      isPlaying: false
    },
    {
      id: "keyG3",
      name: "Sol",
      url: g3Url,
      keyPress: "g",
      isWhite: true,
      isPlaying: false
    },
    {
      id: "keyAb3",
      name: "Sol#",
      url: ab3Url,
      keyPress: "y",
      isWhite: false,
      isPlaying: false
    },
    {
      id: "keyA3",
      name: "La",
      url: a3Url,
      keyPress: "h",
      isWhite: true,
      isPlaying: false
    },
    {
      id: "keyBb3",
      name: "La#",
      url: bb3Url,
      keyPress: "u",
      isWhite: false,
      isPlaying: false
    },
    {
      id: "keyB3",
      name: "Si",
      url: b3Url,
      keyPress: "j",
      isWhite: true,
      isPlaying: false
    },
    {
      id: "keyC4",
      name: "Do",
      url: c4Url,
      keyPress: "k",
      isWhite: true,
      isPlaying: false
    },
    {
      id: 'keyDb4',
      name: 'Do#',
      url: db4Url,
      keyPress: "o",
      isWhite: false,
      isPlaying: false
    },
    {
      id: "keyD4",
      name: "Ré",
      url: d4Url,
      keyPress: "l",
      isWhite: true,
      isPlaying: false
    },
    {
      id: "keyEb4",
      name: "Ré#",
      url: eb4Url,
      keyPress: "p",
      isWhite: false,
      isPlaying: false
    },
    {
      id: "keyE4",
      name: "Mi",
      url: e4Url,
      keyPress: "m",
      isWhite: true,
      isPlaying: false
    },
    {
      id: "keyF4",
      name: "Fa",
      url: f4Url,
      keyPress: "ù",
      isWhite: true,
      isPlaying: false
    },
    {
      id: "keyGb4",
      name: "Fa#",
      url: gb4Url,
      keyPress: "$",
      isWhite: false,
      isPlaying: false
    },
    {
      id: "keyG4",
      name: "Sol",
      url: g4Url,
      keyPress: "*",
      isWhite: true,
      isPlaying: false
    }
  ]

  keysDomElements: HTMLDivElement[] = [];

  static readonly MP3_READY_EVENT = 'Mp3Loaded';
  static readonly NOTE_DOM_READY_EVENT = 'NoteDOMReady';

  constructor() {
    this.fetchAllKeysMp3();
    this.generateDom().then(() => this.loadDomKeyElements());
  }

  private async loadDomKeyElements(): Promise<void> {
    const keys = document.querySelectorAll<HTMLDivElement>('.keys')!;
    const blackKeys = document.querySelectorAll<HTMLDivElement>('.black-keys')!;
    keys.forEach(key => this.keysDomElements.push(key))
    blackKeys.forEach(key => this.keysDomElements.push(key))
    window.dispatchEvent(new Event(KeyManager.NOTE_DOM_READY_EVENT));
  }

  private async fetchAllKeysMp3(): Promise<void> {
    const promises: Promise<void>[] = [];
    this.keyList.forEach((key) => promises.push(this.fetchMp3WithXhr(key)));
    Promise.all(promises).then(() => window.dispatchEvent(new Event(KeyManager.MP3_READY_EVENT)));
  }

  private async fetchMp3WithXhr(key: Key): Promise<void> {
    key.blobBuffer = await (await (await fetch(new Request(key.url))).blob()).arrayBuffer();
  }

  private async generateDom(): Promise<void> {
    const htmlContainer = document.querySelector<HTMLDivElement>('#container')!
    let containerInnerHtml = "";
    this.keyList.forEach(
      key => {
        if (!key.isWhite) {
          containerInnerHtml += `<div class="black-keys" id="${key.id}"><div class="name">${key.name}</div>`;        
        } else {
          containerInnerHtml += `<div class="keys" id="${key.id}"><div class="key-subcontainer"><div class="name">${key.name}</div>`;
        }
        if(!AppValues.IS_MOBILE) {
          containerInnerHtml += `<div class="key-to-press">${key.keyPress.toUpperCase()}</div>`
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