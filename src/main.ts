import a4Url from '../musicFiles/a4.mp3';
import b4Url from '../musicFiles/b4.mp3';
import c3Url from '../musicFiles/c3.mp3';
import c4Url from '../musicFiles/c4.mp3';
import d3Url from '../musicFiles/d3.mp3';
import e3Url from '../musicFiles/e3.mp3';
import f3Url from '../musicFiles/f3.mp3';
import g3Url from '../musicFiles/g3.mp3';
import './style.css';
import atanProcessorUrl from "./audio-worklet.js?url";

//Defining each Key
type Key = {
  id: string;
  url: string,
  keyPress: string;
  file?: File;
  buffer?: AudioBuffer;
  audioWorkletNode?: AudioWorkletNode;
  audioBufferSourceNode?: AudioBufferSourceNode;
  audioContext?: AudioContext;
  isPlaying: boolean;
}

const keyList: Key[] = [
  {
    id: "key1",
    url: c3Url,
    keyPress: "a",
    isPlaying: false
  },
  {
    id: "key2",
    url: d3Url,
    keyPress: "z",
    isPlaying: false
  },
  {
    id: "key3",
    url: e3Url,
    keyPress: "e",
    isPlaying: false
  },
  {
    id: "key4",
    url: f3Url,
    keyPress: "r",
    isPlaying: false
  },
  {
    id: "key5",
    url: g3Url,
    keyPress: "t",
    isPlaying: false
  },
  {
    id: "key6",
    url: a4Url,
    keyPress: "y",
    isPlaying: false
  },
  {
    id: "key7",
    url: b4Url,
    keyPress: "u",
    isPlaying: false
  },
  {
    id: "key8",
    url: c4Url,
    keyPress: "i",
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
  noteKey.audioBufferSourceNode = context.createBufferSource();

  const source = noteKey.audioBufferSourceNode;
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

// Binding on click and mouseup event
const keys = document.querySelectorAll<HTMLDivElement>('.keys')!;

keys.forEach(
  el => {
    el.addEventListener("mousedown", (evt: MouseEvent) => play(evt.target));
    el.addEventListener("mouseup", (evt: MouseEvent) => unplay(evt.target));
  }
)

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



