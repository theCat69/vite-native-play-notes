/* class AtanProcessor extends AudioWorkletProcessor {

    process(inputs: Float32Array[][], outputs: Float32Array[][]) {
        const atan = 20;
        for (let i = inputs.length; i--;) {
            for (let j = inputs[i].length; j--;) {
                for (let k = inputs[i][j].length; k--;) {
                    outputs[i][j][k] = Math.atan(atan * inputs[i][j][k]) / Math.atan(atan);
                }
            }
        }
        return true;
    }
}

registerProcessor("atan-processor", AtanProcessor); */