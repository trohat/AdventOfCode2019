console.log("AOC 2019 - Day 19: Tractor Beam");

String.prototype.countChar = function (char) {
  return this.split(char).length-1;
};

Array.prototype.countChar = function (char) {
  return this.reduce(
    (accumulator, str) => accumulator + str.split(char).length - 1,
    0
  );
};

const prepare = (program) => {
  program = program.split(",");
  program = program.map((d) => +d);
  return program;
};

program = prepare(data);

const runLoop = (parProgram, inputFunction) => {
  const program = [...parProgram];
  for (let i = 0; i < 1000; i++) {
    program.push(0);
  }
  let position = 0;
  let relativeBase = 0;

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
        program[position1] = inputFunction();
        step = 2;
        break;
      case 4:
        arg1 = getArg(1);
        return arg1;
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
  }
  return;
};

const deployDrone = (program) => {
  const inputArray = [];
  const tractorBeam = [];

  const getInput = () => {
    //console.log("reading input");
    return inputArray.shift();
  };

  const getSignal = (j, i) => {
    inputArray.push(j, i);
    return runLoop(program, getInput);
  }
  

  // iterating by hand
  const iter = 2065;
  let i = iter;
  let str = "";
  for (let j = 0; j < iter; j++) {

    const result = getSignal(j, i);

    str += result === 1 ? "#" : ".";
  }
  console.log(str.countChar("#"));
  console.log(str);
  let lastIndex = str.lastIndexOf("#");
  console.log(lastIndex);
  console.log("New result: " + getSignal(lastIndex-99, iter+99));

  return tractorBeam.countChar("#");
};

console.log("Task 1: " + deployDrone(program));
