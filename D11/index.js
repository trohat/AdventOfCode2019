console.log("funguju");

const prepare = (program) => {
  program = program.split(",");
  program = program.map((d) => +d);
  return program;
};

program = prepare(data);

function* createLoopIterator(parProgram, inputFunction) {
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
        program[position1] = inputFunction();
        step = 2;
        break;
      case 4:
        arg1 = getArg(1);
        outputs.push(arg1); 
        if (outputs.length === 2) { 
          yield outputs;
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
  }
  return;
}

const runRobot = program => {
  
  const whiteFields = new Set();
  const visitedFields = new Set();
  let input;
  
  const getInput = () => input;
  const loopIterator = createLoopIterator(program, getInput);
  
  let robotX = 0;
  let robotY = 0;

  const directions = [ 'N', 'W', 'S', 'E' ];
  let robotDirection = 0;

  robotLoop: while(true) {
    const robotPosition = [robotX, robotY].toString();
    visitedFields.add(robotPosition);

    if (whiteFields.has(robotPosition)) input = 1; else input = 0;

    const iteratorResult = loopIterator.next();

    if (iteratorResult.done) break robotLoop;
    const [ paint, turn ] = iteratorResult.value;

    if (paint === 1) whiteFields.add(robotPosition); else whiteFields.delete(robotPosition);

    if (turn === 0) robotDirection = (robotDirection + 1) % 4; else robotDirection = (robotDirection + 3) % 4;

    switch (robotDirection) {
      case 0: //'N'
       robotY++;
       break;
     case 1: //'W'
       robotX--;
       break;
     case 2: //'S'
       robotY--;
       break;
     case 3: //'E'
       robotX++;
       break;
    }
  }
  return visitedFields.size;
}

console.log(runRobot(program));
