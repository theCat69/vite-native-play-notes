import { Key, KeyManager } from "../keys/key-manager";
import atanProcessorUrl from "./audio-worklet.js?url";

export class AudioWorkletManager {

    private keyManager: KeyManager;

    constructor(keyManager: KeyManager) {
        this.keyManager = keyManager;
        window.addEventListener('Mp3Loaded', () => this.iniKeysEvent())
    }

    async createWorkletNode(
        context: BaseAudioContext,
        name: string,
        url: string
    ) {
        // ensure audioWorklet has been loaded
        try {
            return new AudioWorkletNode(context, name);
        } catch (err) {
            await context.audioWorklet.addModule(url);
            return new AudioWorkletNode(context, name);
        }
    }

    async startAudioSideWorker(noteKey: Key) {
        const context = noteKey.audioContext!;
        // convert uploaded file to AudioBuffer
        const buffer = noteKey.buffer!;
        // create source and set buffer
        const source = context.createBufferSource();
        source.buffer = buffer;
        // create atan node
        const atan = noteKey.audioWorkletNode!;
        // connect everything and automatically start playing
        source.connect(atan).connect(context.destination);
        source.start(0);
        /*   source.onended = () => noteKey.isPlaying = false; */
    }

    private async iniKeysEvent() {
        await this.initKeys();
        window.dispatchEvent(new Event('KeysInitialized'));
    }

    private async initKeys() {
        this.keyManager.keyList.forEach(key => this.initKey(key));
    }

    private async initKey(noteKey: Key) {
        if (!noteKey.file) {
            return
        }
        //creating audiocontext if it doesnt exist
        if (!noteKey.audioContext) {
            noteKey.audioContext = new AudioContext();
        }

        const context = noteKey.audioContext;
        // convert uploaded file to AudioBuffer
        if (!noteKey.buffer) {
            noteKey.buffer = await context.decodeAudioData(await noteKey.file!.arrayBuffer());
        }

        if (!noteKey.audioWorkletNode) {
            noteKey.audioWorkletNode = await this.createWorkletNode(context, "atan-processor", atanProcessorUrl);
        }
    }
}