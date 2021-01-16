console.log("AOC 2019 - Day 5: Sunny with a Chance of Asteroids");

const prepare = data => {
  data = data.split(",");
  data = data.map((d) => +d);
  return data;
}

const runLoop = (pdata, inputFunction) => {
  let data = [ ...pdata ];
  let position = 0;
  const outputs = [];

  const writeOutput = (output) => outputs.push(output);

  mainLoop: while (true) {
    const getOpcodeAndModes = (instruction) => {
      opcode = instruction % 100;
      modes = ((instruction - opcode) / 100).toString().split("");
      modes = modes.map(m => +m).reverse();
    };

    const getArg = (i) => {
      if (modes[i - 1]) return data[position + i];
      return data[data[position + i]];
    };

    let instruction = data[position];
    let opcode, modes;
    getOpcodeAndModes(instruction);

    let step, arg1, arg2, storeArg;
    let useStep = true;
    switch (opcode) {
      case 1:
        arg1 = getArg(1);
        arg2 = getArg(2);
        data[data[position + 3]] = arg1 + arg2;
        step = 4;
        break;
      case 2:
        arg1 = getArg(1);
        arg2 = getArg(2);
        data[data[position + 3]] = arg1 * arg2;
        step = 4;
        break;
      case 3:
        data[data[position + 1]] = inputFunction();
        step = 2;
        break;
      case 4:
        arg1 = getArg(1);
        writeOutput(arg1);
        step = 2;
        break;
      case 5:
        arg1 = getArg(1);
        arg2 = getArg(2);
        if (arg1) {
          position = arg2;
          useStep = false;
        }
        step = 3;
        break;
      case 6:
        arg1 = getArg(1);
        arg2 = getArg(2);
        if (!arg1) {
          position = arg2;
          useStep = false;
        }
        step = 3;
        break;
      case 7:
        arg1 = getArg(1);
        arg2 = getArg(2);
        if (arg1 < arg2) {
          storeArg = 1;
        } else storeArg = 0;
        data[data[position + 3]] = storeArg;
        step = 4;
        break;
      case 8:
        arg1 = getArg(1);
        arg2 = getArg(2);
        if (arg1 === arg2) {
          storeArg = 1;
        } else storeArg = 0;
        data[data[position + 3]] = storeArg;
        step = 4;
        break;
      case 99:
        break mainLoop;
    }
    if (useStep) position += step;
  }

  return outputs;
};

const testdata = `3,3,1107,-1,8,3,4,3,99`;

data = prepare(data);

const task = (data, input) => {
  const getInput = () => input;
  let outputs = runLoop(data, getInput);
  return outputs[outputs.length - 1];
};

console.log("");

console.log("Task 1: " + task(data, 1));
console.log("Task 2: " + task(data, 5));
