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
  if(!tgt) {
    return
  }
  const key = keyList.find((keyOb) => tgt.id === keyOb.id);
  if (!key || key.isPlaying) {
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
      containerInnerHtml += `<div class="black-keys" id="${key.id}"><div class="name">${key.name}</div><div class="key-to-press">${key.keyPress.toUpperCase()}</div></div>`;
    } else {
      containerInnerHtml += `<div class="keys" id="${key.id}"><div class="key-subcontainer"><div class="name">${key.name}</div><div class="key-to-press">${key.keyPress.toUpperCase()}</div></div></div>`;
    }

  }
)
htmlContainer.innerHTML = containerInnerHtml;

// Binding on click and mouseup event
const mobileCheck = () => {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
  return check;
};

const isMobile = mobileCheck();

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



//mobile méthodes :
function handleStart(evt: TouchEvent) {
  evt.preventDefault();
  console.log('touchstart.');
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
      play(touches[i].target);
  }
}

function handleMove(evt: TouchEvent) {
  evt.preventDefault();
  const touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    const el = document.elementFromPoint(touches[i].pageX, touches[i].pageY);
    play(el);
  }
}

function handleEnd(evt: TouchEvent) {
  evt.preventDefault();
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    unplay(touches[i].target);
  }
}

function handleCancel(evt: TouchEvent) {
  evt.preventDefault();
  const touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    unplay(touches[i].target);
  }
}


const addOnTouchEvent = (el: HTMLDivElement) => {
  el.addEventListener('touchend', (evt: TouchEvent) => handleEnd(evt));
  el.addEventListener('touchstart', (evt: TouchEvent) => handleStart(evt));
  el.addEventListener('touchcancel', (evt: TouchEvent) => handleCancel(evt));
  el.addEventListener('touchmove', (evt: TouchEvent) => handleMove(evt));
}


const addMouseEvent = (el: HTMLDivElement) => {
  el.addEventListener("mousedown", (evt: MouseEvent) => play(evt.target));
  el.addEventListener("mouseup", (evt: MouseEvent) => unplay(evt.target));
}

const keys = document.querySelectorAll<HTMLDivElement>('.keys')!;
const blackKeys = document.querySelectorAll<HTMLDivElement>('.black-keys')!;

if (!isMobile) {
  keys.forEach(el => addMouseEvent(el));
  blackKeys.forEach(el => addMouseEvent(el));
} else {
  htmlContainer.classList.add("container-mobile")
  keys.forEach(el => addOnTouchEvent(el));
  blackKeys.forEach(el => addOnTouchEvent(el));
}



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



