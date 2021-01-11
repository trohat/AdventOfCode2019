console.log("AOC 2019 - Day 15: Oxygen System");

const prepare = (program) => {
  program = program.split(",");
  program = program.map((d) => +d);
  return program;
};

function* createLoopIterator(parProgram, inputFunction, errorCode) {
  const program = [...parProgram];
  for (let i = 0; i < 1000; i++) {
    program.push(0);
  }
  let position = 0;
  let relativeBase = 0;
  //let outputs = [];

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

    let step, arg1, arg2, position3, storeArg, inputValue;
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
        inputValue = inputFunction();
        if (inputValue === errorCode) break mainLoop;
        program[position1] = inputValue;
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

const buildMaze = (xLength, yLength) => {
  // 0 - empty field

  const maze = [];
  for (let i = 0; i < yLength; i++) {
    maze.push([]);
    for (let j = 0; j < xLength; j++) {
      maze[i].push({ cameFrom: false, beenHere: false, seen: -1, border: false, wall: false, oxygen: false, lowest: false, firstCycle: true });
    }
    maze[i][0].border = true;
    maze[i][xLength - 1].border = true;
  }
  for (let j = 0; j < xLength; j++) {
    maze[0][j].border = true;
    maze[yLength - 1][j].border = true;
  }
  console.log(maze);
  return maze;
};

const runDroid = (program) => {
  const maxX = 41;
  const maxY = 41;
  const maze = buildMaze(maxX, maxY);

  const startDroidX = Math.floor(maxX / 2)+1;
  const startDroidY = Math.floor(maxY / 2)+1;

  maze[startDroidY][startDroidX].seen ++;
  maze[startDroidY][startDroidX].beenHere = true;
  maze[startDroidY][startDroidX].cameFrom = 0;
  //maze[startDroidY][startDroidX].lowest = 0;

  let droidX = startDroidX;
  let droidY = startDroidY;

  let droidGoingDirection;

  let oxygenFound = false;
  const errorCode = 15;

  const directionToPosition = [ null, 3, 1, 2, 0];

  const getInput = () => {
    const positionToDirection = [1, 4, 2, 3];
    const droidPosition = maze[droidY][droidX];
    if (droidPosition.border) {
      console.error("I have hit the border!!");
      return errorCode;
    }
    if (droidPosition.seen === 4 && droidPosition.firstCycle) {
      droidPosition.firstCycle = false;
      droidPosition.seen = 0;
    }
    if (droidPosition.seen < 4) {
      droidGoingDirection =
        positionToDirection[(droidPosition.seen + droidPosition.cameFrom) % 4];
      return droidGoingDirection;
    } else {
      console.error(
        "I have been here too many times, exactly " +
          droidPosition.seen +
          " times"
      );
      return errorCode;
    }
  };

  const loopIterator = createLoopIterator(program, getInput, errorCode);

  const directions = ["N", "S", "W", "E"];
  const generalDirs = [[ 0, -1], [ 0, 1], [ -1, 0], [ 1, 0]];
  
  const moveDroid = (dir) => {
    switch (dir) {
      case 1:
        droidY -= 1;
        break;
      case 2:
        droidY += 1;
        break;
      case 3:
        droidX -= 1;
        break;
      case 4:
        droidX += 1;
        break;
    }
  };

  const getLowest = (x,y) => {
    let min = 10000;
    generalDirs.forEach( dirs => {
      if (maze[y+dirs[1]][x+dirs[0]].lowest !== false && maze[y+dirs[1]][x+dirs[0]].lowest < min) min = maze[y+dirs[1]][x+dirs[0]].lowest;
    })
    if (min === 10000) return false;
    return min + 1;
  }

  droidLoop: while (!oxygenFound) {
    const iteratorResult = loopIterator.next();

    if (iteratorResult.done) break droidLoop;

    if (iteratorResult.value === 0) {
      maze[droidY][droidX].seen++;
      maze[droidY + generalDirs[droidGoingDirection-1][1]][ droidX + generalDirs[droidGoingDirection-1][0]].wall = true;
    }

    if (iteratorResult.value === 1 || iteratorResult.value === 2) {
      moveDroid(droidGoingDirection);
      if (!(maze[droidY][droidX].beenHere)) maze[droidY][droidX].cameFrom = directionToPosition[droidGoingDirection];
      const newLowest = getLowest(droidX, droidY);
      if (maze[droidY][droidX].lowest === false || newLowest < maze[droidY][droidX].lowest) maze[droidY][droidX].lowest = newLowest;
      maze[droidY][droidX].beenHere = true;
      maze[droidY][droidX].seen++;
    }

    if (iteratorResult.value === 2) {
      maze[droidY][droidX].oxygen = true;
      maze[droidY][droidX].lowest = 0;
    }

  }
  return [maze, startDroidX - droidX, startDroidY - droidY, droidX, droidY];
};

const draw = (pattern, x, y) => {
  for (let i = 0; i < pattern.length; i++) {
    let str = "";
    for (let j = 0; j < pattern[0].length; j++) {
      let char = "█████";
      if (pattern[i][j].wall) char = "█████";
      if (pattern[i][j].beenHere) char = " " + pattern[i][j].lowest.toString().padStart(3, "0") + " ";
      if (pattern[i][j].oxygen) char = "OOOOO";
      if (i === y && j === x) char = "  @  ";
      if (i === 25 && j == 25) char = "  _  ";
      str += char;
    }
    console.log(str);
  }
};

program = prepare(data);
const [ maze, xRel, yRel, x, y ] = runDroid(program);
draw(maze, x, y);
console.log(xRel, yRel);

const findMax = maze => {
  let max = 0;
  let myI, myJ;
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[0].length; j++) {
      if (maze[i][j].lowest !== false && maze[i][j].lowest > max) {
          max = maze[i][j].lowest; 
          myI = i;
          myJ = j;
      }
    }
  }
  return [ max, myI, myJ ];
}

console.log(findMax(maze));