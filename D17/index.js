console.log("funguju");

const prepare = (program) => {
  program = program.split(",");
  program = program.map((d) => +d);
  return program;
};

function runLoop(parProgram, inputFunction) {
  const program = [...parProgram];
  for (let i = 0; i < 1000; i++) {
    program.push(0);
  }
  let position = 0;
  let relativeBase = 0;
  const outputs = [];

  const writeOutput = (output) => outputs.push(output);

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
  return outputs;
}

const getInput = () => {
  console.warn("Getting input");
  return 0;
};

const outputDataToGrid = data => {
  
  const grid = [];
  grid.push([]);
  let lineLength = data.indexOf(10);
  for (let i = 0; i < lineLength + 2; i++) {
    grid[0].push(i % 10);
  }
  grid.push([]);
  let line = 1;
  grid[line].push(0);
  data.forEach(char => {
    if (char === 10) {
      grid[line].push(0);
      line++;
      grid.push([]);
      grid[line].push(0);
    } else {
      grid[line].push(String.fromCharCode(char));
    }
  })
  grid.pop(); line--;
  for (let i = 0; i < lineLength; i++) {
    grid[line].push((i + 12) % 10);
  }
  return grid;
};

findIntersections = grid => {
  const dirs = [ [ 1,0 ], [ -1,0 ], [ 0,1 ], [ 0,-1 ] ];
  let intersectionsTotal = 0;
  for (let i = 1; i < grid.length - 1; i++) {
    for (let j = 1; j < grid[2].length-1; j++) {
        if (grid[i][j] === "#") {
          let total = 0;
          for (const dir of dirs) {
            if (grid[i+dir[0]][j+dir[1]] === "#") total++;
          }
          if (total === 4) {
            grid[i][j] = "O";
            intersectionsTotal += (i-1) * (j-1);
            console.log(i-1,j-1);
          } 
        }
    }
  }
  console.log("Intersections total: " + intersectionsTotal);
}

const drawGrid = grid => {
  for (let i = 0; i < grid.length; i++) {
    console.log(grid[i].join(""));
  }
}

let runRobot = () => {
  data = prepare(data);
  let outputData = runLoop(data, getInput);
  const grid = outputDataToGrid(outputData);
  findIntersections(grid);
  drawGrid(grid);
  console.log(grid);
}

runRobot();

