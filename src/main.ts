import './style.css'
import c3Url from '../musicFiles/c3.mp3';
import d3Url from '../musicFiles/d3.mp3';
import e3Url from '../musicFiles/e3.mp3';
import f3Url from '../musicFiles/f3.mp3';
import g3Url from '../musicFiles/g3.mp3';
import a4Url from '../musicFiles/a4.mp3';
import b4Url from '../musicFiles/b4.mp3';
import c4Url from '../musicFiles/c4.mp3';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;


//Defining each Key
type Key = {
  id: string;
  audio: HTMLAudioElement;
  keyPress: string;
}

const keyList: Key[] = [
  {
    id: "key1",
    audio: new Audio(c3Url),
    keyPress: "a"
  },
  {
    id: "key2",
    audio: new Audio(d3Url),
    keyPress: "z"
  },
  {
    id: "key3",
    audio: new Audio(e3Url),
    keyPress: "e"
  },
  {
    id: "key4",
    audio: new Audio(f3Url),
    keyPress: "r"
  },
  {
    id: "key5",
    audio: new Audio(g3Url),
    keyPress: "t"
  },
  {
    id: "key6",
    audio: new Audio(a4Url),
    keyPress: "y"
  },
  {
    id: "key7",
    audio: new Audio(b4Url),
    keyPress: "u"
  },
  {
    id: "key8",
    audio: new Audio(c4Url),
    keyPress: "i"
  }
]

//play & unplay methods
const play = (tgt: any) => {
  tgt.classList.add('pressed-key');
  keyList.find((keyOb) => tgt.id === keyOb.id)?.audio.play();
}

const unplay = (tgt: any) => {
  tgt.classList.remove('pressed-key');
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
