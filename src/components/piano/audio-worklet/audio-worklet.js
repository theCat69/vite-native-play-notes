class KeyProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    for (let i = inputs.length; i--;) {
      for (let j = inputs[i].length; j--;) {
        for (let k = inputs[i][j].length; k--;) {
          outputs[i][j][k] = inputs[i][j][k];
        }
      }
    }
    return true;
  }
}

registerProcessor("key-processor", KeyProcessor);