import ab3Url from '../musicPiano/Ab3.mp3';
import a3Url from '../musicPiano/A3.mp3';
import bb3Url from '../musicPiano/Bb3.mp3';
import b3Url from '../musicPiano/B3.mp3';
import c3Url from '../musicPiano/C3.mp3';
import c4Url from '../musicPiano/C4.mp3';
import db3Url from '../musicPiano/Db3.mp3';
import db4Url from '../musicPiano/Db4.mp3';
import d3Url from '../musicPiano/D3.mp3';
import d4Url from '../musicPiano/D4.mp3';
import eb3Url from '../musicPiano/Eb3.mp3';
import eb4Url from '../musicPiano/Eb4.mp3';
import e3Url from '../musicPiano/E3.mp3';
import e4Url from '../musicPiano/E4.mp3';
import f3Url from '../musicPiano/F3.mp3';
import f4Url from '../musicPiano/F4.mp3';
import gb3Url from '../musicPiano/Gb3.mp3';
import gb4Url from '../musicPiano/Gb4.mp3';
import g3Url from '../musicPiano/G3.mp3';
import g4Url from '../musicPiano/G4.mp3';

import './style.css';
import atanProcessorUrl from "./audio-worklet.js?url";

//Defining each Key
type Key = {
  id: string;
  name: string;
  url: string,
  keyPress: string;
  isWhite: boolean;
  file?: File;
  buffer?: AudioBuffer;
  audioWorkletNode?: AudioWorkletNode;
  audioContext?: AudioContext;
  isPlaying: boolean;
}

const keyList: Key[] = [
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

const fetchMp3WithXhr = (key: Key) => {
  var blob = null;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", key.url);
  xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
  xhr.onload = async () => {
    blob = xhr.response;//xhr.response is now a blob object
    var file = new File([blob], key.url, { type: 'audio/mp3', lastModified: Date.now() });
    console.log(file);
    key.file = file;
  }
  xhr.send()
}

keyList.forEach((key) => fetchMp3WithXhr(key));

//audio worker
console.log(atanProcessorUrl)


const createWorkletNode = async (
  context: BaseAudioContext,
  name: string,
  url: string
) => {
  // ensure audioWorklet has been loaded
  try {
    return new AudioWorkletNode(context, name);
  } catch (err) {
    await context.audioWorklet.addModule(url);
    return new AudioWorkletNode(context, name);
  }
}

const startAudioSideWorker = async (noteKey: Key) => {
  //preconditions
  /*   if(noteKey.isPlaying) {
      return
    } */
  if (!noteKey.file) {
    return
  }
  //starting playing key
  noteKey.isPlaying = true;
  //creating audiocontext if it doesnt exist
  if (!noteKey.audioContext) {
    noteKey.audioContext = new AudioContext();
  }
  const context = noteKey.audioContext;
  // convert uploaded file to AudioBuffer
  if (!noteKey.buffer) {
    noteKey.buffer = await context.decodeAudioData(await noteKey.file!.arrayBuffer());
  }
  const buffer = noteKey.buffer;
  // create source and set buffer
  const source = context.createBufferSource();
  source.buffer = buffer;
  // create atan node
  if (!noteKey.audioWorkletNode) {
    noteKey.audioWorkletNode = await createWorkletNode(context, "atan-processor", atanProcessorUrl);
  }
  const atan = noteKey.audioWorkletNode;
  // connect everything and automatically start playing
  source.connect(atan).connect(context.destination);
  source.start(0);
  /*   source.onended = () => noteKey.isPlaying = false; */
}

//play & unplay methods
const play = (tgt: any) => {
  const key = keyList.find((keyOb) => tgt.id === keyOb.id)!;
  if (key.isPlaying) {
    return
  }
  tgt.classList.add('pressed-key');
  startAudioSideWorker(key);
}

const unplay = (tgt: any) => {
  tgt.classList.remove('pressed-key');
  const key = keyList.find((keyOb) => tgt.id === keyOb.id)!;
  key.isPlaying = false;
}

//generating keys HTML
const htmlContainer = document.querySelector<HTMLDivElement>('#container')!

let containerInnerHtml = "";
keyList.forEach(
  key => {
    if (!key.isWhite) {
      containerInnerHtml += `<div class="black-keys" id="${key.id}"><h2>${key.name}</h2><p>${key.keyPress.toUpperCase()}</p></div>`;
    } else {
      containerInnerHtml += `<div class="keys" id="${key.id}"><div class="key-subcontainer"><h2>${key.name}</h2><p>${key.keyPress.toUpperCase()}</p></div></div>`;
    }
   
  }
)
htmlContainer.innerHTML = containerInnerHtml;

// Binding on click and mouseup event
function addMouseEvent(el: HTMLDivElement) {
  el.addEventListener("mousedown", (evt: MouseEvent) => play(evt.target));
  el.addEventListener("mouseup", (evt: MouseEvent) => unplay(evt.target));
}

const keys = document.querySelectorAll<HTMLDivElement>('.keys')!;

keys.forEach(el => addMouseEvent(el));

const blackKeys = document.querySelectorAll<HTMLDivElement>('.black-keys')!;

blackKeys.forEach(el => addMouseEvent(el));


//Binding keys event 
window.addEventListener("keydown", (evt: KeyboardEvent) => {
  const keyObj = keyList.find(keyObj => evt.key === keyObj.keyPress);
  if (keyObj) {
    const keyEl = document.querySelector<HTMLDivElement>(`#${keyObj.id}`)!;
    play(keyEl);
  }
}, true);

window.addEventListener("keyup", (evt: KeyboardEvent) => {
  const keyObj = keyList.find(keyObj => evt.key === keyObj.keyPress);
  if (keyObj) {
    const keyEl = document.querySelector<HTMLDivElement>(`#${keyObj.id}`)!;
    unplay(keyEl);
  }
}, true);



