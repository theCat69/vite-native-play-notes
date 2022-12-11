class AtanProcessor extends AudioWorkletProcessor {

    process(inputs, outputs) {
        const atan = 20;
        for (let i = inputs.length; i--;) {
            for (let j = inputs[i].length; j--;) {
                for (let k = inputs[i][j].length; k--;) {
                    outputs[i][j][k] = inputs[i][j][k]
                    /* outputs[i][j][k] = Math.atan(atan * inputs[i][j][k]) / Math.atan(atan); */
                }
            }
        }
        return true;
    }
}

registerProcessor("atan-processor", AtanProcessor);