console.log("funguju");

const prepare = (program) => {
  program = program.split(",");
  program = program.map((d) => +d);
  return program;
};

program = prepare(data);

function* createLoopIterator(parProgram, compIndex, inputFunction, outputFunction) {
  const program = [...parProgram];
  for (let i = 0; i < 1000; i++) {
    program.push(0);
  }
  let position = 0;
  let relativeBase = 0;
  let outputs = [];

  mainLoop: while (true) {
    const getOpcodeAndModes = (instruction) => {
      opcode = instruction % 100;
      modes = ((instruction - opcode) / 100).toString().split("");
      modes = modes.map((m) => +m).reverse();
    };

    const getArg = (i) => {
      if (modes[i - 1] === 2)
        return program[program[position + i] + relativeBase];
      else if (modes[i - 1] === 1) return program[position + i];
      return program[program[position + i]];
    };

    const getPosition = (i) => {
      if (modes[i - 1] === 2) return program[position + i] + relativeBase;
      else if (modes[i - 1] === 1) return position + i;
      return program[position + i];
    };

    let instruction = program[position];
    let opcode, modes;
    getOpcodeAndModes(instruction);

    let step, arg1, arg2, position3, storeArg;
    let useStep = true;
    //return;
    switch (opcode) {
      case 1:
        arg1 = getArg(1);
        arg2 = getArg(2);
        position3 = getPosition(3);
        program[position3] = arg1 + arg2;
        step = 4;
        break;
      case 2:
        arg1 = getArg(1);
        arg2 = getArg(2);
        position3 = getPosition(3);
        program[position3] = arg1 * arg2;
        step = 4;
        break;
      case 3:
        position1 = getPosition(1);
        program[position1] = inputFunction(compIndex);
        step = 2;
        break;
      case 4:
        arg1 = getArg(1);
        outputs.push(arg1); 
        if (outputs.length === 3) { 
          outputFunction(outputs);
          outputs = [];
        }
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
        position3 = getPosition(3);
        if (arg1 < arg2) {
          storeArg = 1;
        } else storeArg = 0;
        program[position3] = storeArg;
        step = 4;
        break;
      case 8:
        arg1 = getArg(1);
        arg2 = getArg(2);
        position3 = getPosition(3);
        if (arg1 === arg2) {
          storeArg = 1;
        } else storeArg = 0;
        program[position3] = storeArg;
        step = 4;
        break;
      case 9:
        arg1 = getArg(1);
        relativeBase += arg1;
        step = 2;
        break;
      case 99:
        break mainLoop;
    }
    if (useStep) position += step;
    yield;
  }
  return;
}

const runComputers = program => {
  let inputs = [];
  let end = false;
  let natX, natY;
  let lastNatY;
  let watchNat = false;
  let emptyQueues = new Set();

  for (let i = 0; i < 50; i++) {
    inputs.push([i]);
  }
  console.log(inputs);

  const getInput = compIndex => {
    if (inputs[compIndex].length === 0) { 
      if (watchNat) {
        emptyQueues.add(compIndex);
        if (emptyQueues.size === 50) {
          emptyQueues.clear();
          inputs[0].push(natX, natY);
          if (lastNatY === natY) {
            end = true;
            console.log("Y packet delivered twice is " + natY + ".");
          }
          lastNatY = natY;
        }
      }
      return -1;
    }
    emptyQueues.clear();
    return inputs[compIndex].shift();
  };

  const writeOutputs = outputs => {
    const [ addr, x, y ] = outputs;
    if (addr === 255) {
      natX = x;
      natY = y;
      watchNat = true;
      console.log("NAT set to " + x + " and " + y + ".");
    }
    else inputs[addr].push(x, y);
  }

  let computers = [];

  for (let compIndex = 0; compIndex < 50; compIndex++) {
    computers.push(createLoopIterator(program, compIndex, getInput, writeOutputs));
  }

  let computerIndex = 0;
  let steps = 0;

  while(!end) {
    computers[computerIndex].next();
    computerIndex = (computerIndex + 1) % 50;
    if (computerIndex === 0) steps++;
  }
  console.log("Steps: " + steps);
}

runComputers(program);
