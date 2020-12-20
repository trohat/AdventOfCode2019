console.log("funguju");

const prepare = (program) => {
  program = program.split(",");
  program = program.map((d) => +d);
  return program;
};

const getAllPermutations = (arr) => {
  if (arr.length === 1) return [[...arr]];
  const combinations = [];
  arr.forEach((d, index) => {
    let newArr = [...arr];
    newArr.splice(index, 1);
    getAllPermutations(newArr).forEach((newD) => {
      combinations.push([d, ...newD]);
    });
  });
  return combinations;
};

function* createLoopIterator(parProgram, ampIndex, inputFunction) {
  const program = [ ... parProgram];
  let position = 0;
  const outputs = [];

  mainLoop: while (true) {
    const getOpcodeAndModes = (instruction) => {
      opcode = instruction % 100;
      modes = ((instruction - opcode) / 100).toString().split("");
      modes = modes.map((m) => +m).reverse();
    };

    const getArg = (i) => {
      if (modes[i - 1]) return program[position + i];
      return program[program[position + i]];
    };

    let instruction = program[position];
    let opcode, modes;
    getOpcodeAndModes(instruction);

    let step, arg1, arg2, storeArg;
    let useStep = true;
    switch (opcode) {
      case 1:
        arg1 = getArg(1);
        arg2 = getArg(2);
        program[program[position + 3]] = arg1 + arg2;
        step = 4;
        break;
      case 2:
        arg1 = getArg(1);
        arg2 = getArg(2);
        program[program[position + 3]] = arg1 * arg2;
        step = 4;
        break;
      case 3:
        program[program[position + 1]] = inputFunction(ampIndex);
        step = 2;
        break;
      case 4:
        arg1 = getArg(1);
        yield arg1;
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
        program[program[position + 3]] = storeArg;
        step = 4;
        break;
      case 8:
        arg1 = getArg(1);
        arg2 = getArg(2);
        if (arg1 === arg2) {
          storeArg = 1;
        } else storeArg = 0;
        program[program[position + 3]] = storeArg;
        step = 4;
        break;
      case 99:
        break mainLoop;
    }
    if (useStep) position += step;
  }
}

const testprogram = prepare(`3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`);

const findThrusterSignal = (program) => {
  let maxOutput = 0;
  let bestComb;
  let combs = getAllPermutations([5, 6, 7, 8, 9]);

  combs.forEach((comb) => {
    let combArr = [...comb];
    let inputIndexArr = [-2, -2, -2, -2, -2];
    let outputArr = [[0], [], [], [], []];
    
    const getInput = (ampIndex) => {
      inputIndexArr[ampIndex]++;
      if (inputIndexArr[ampIndex] === -1) {
        return combArr[ampIndex];
      } else {
        return outputArr[ampIndex][inputIndexArr[ampIndex]];
      }
    };
   
    let generators = [];
    for (let ampIndex = 0; ampIndex < 5; ampIndex++) {
      generators.push(createLoopIterator(program, ampIndex, getInput));
    }

    let generatorIndex = 0;
    let end = false;
    while (!end) {
      let genResult = generators[generatorIndex].next();
      generatorIndex = (generatorIndex + 1) % 5;
      outputArr[generatorIndex].push(genResult.value);
      if (genResult.done && generatorIndex === 0) {
        end = true;
      }
    }
    outputArr[0].pop();
    const lastOutput = outputArr[0].pop();
    if (lastOutput > maxOutput) {
      maxOutput = lastOutput;
      bestComb = comb;
    }
  });
  return [maxOutput, bestComb];
};

console.log(findThrusterSignal(prepare(data)));
