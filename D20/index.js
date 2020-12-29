console.log("funguju");

const splitLines = (data) => data.split(String.fromCharCode(10));

const dirs = [
  { y: 0, x: 1 },
  { y: 1, x: 0 },
  { y: -1, x: 0 },
  { y: 0, x: -1 },
];

const prepare = (data) => {
  const height = data.length;
  let width;
  data = data.map((line) => {
    if (!/[A-Z]/.test(line.charAt(0))) line = "  " + line;
    else width = line.length;
    return line;
  });
  console.log("Width:", width);
  console.log("Height:", height);

  const maze = [];
  let i = 0;

  for (const line of data) {
    maze.push([]);
    let j = 0;
    for (const char of line) {
      const isWall = char === "#";
      const isPortal = /[A-Z]/.test(char);
      const isPassage = char === ".";
      maze[i].push({
        char,
        isWall,
        isPortal,
        isPassage,
        portalized: null,
        portal: null,
        distance: null,
        visited: false,
        pathHere: false,
      });
      j++;
    }
    maze[i].push({ char: " " });
    i++;
  }

  maze.push([]);
  for (let j = 0; j < i; j++) {
    maze[i].push({ char: " " });
  }

  const fieldsToSearch = [];

  const portals = {};

  let y = 0;
  for (const line of maze) {
    let x = 0;
    for (const field of line) {
      if (field.isPortal && !field.portalized) {
        for (const dir of dirs) {
          if (maze[y + dir.y][x + dir.x].isPortal) {
            let secondPortalField = maze[y + dir.y][x + dir.x];
            field.portalized = true;
            secondPortalField.portalized = true;
            let portalName = field.char + secondPortalField.char;

            let passagePortal;
            let portalX, portalY;
            if (maze[y + dir.y + dir.y][x + dir.x + dir.x].isPassage) {
              portalX = x + dir.x + dir.x;
              portalY = y + dir.y + dir.y;
            } else if (maze[y - dir.y][x - dir.x].isPassage) {
              portalY = y - dir.y;
              portalX = x - dir.x;
            } else console.error("Portal without passage");
            passagePortal = maze[portalY][portalX];
            passagePortal.isPortal = true;
            passagePortal.portalized = true;
            passagePortal.portal = {};
            passagePortal.portal.portalName = portalName;
            passagePortal.portal.beenThrough = false;
            if (portalName === "AA") {
              fieldsToSearch.push({ y: portalY, x: portalX });
              passagePortal.visited = true;
              passagePortal.distance = 0;
              passagePortal.portal.beenThrough = true;
            }
            if (portalName in portals) {
              portals[portalName].push({ x: portalX, y: portalY });
            } else {
              portals[portalName] = [{ x: portalX, y: portalY }];
            }
            break;
          }
        }
      }
      x++;
    }
    y++;
  }

  let backX, backY;

  console.log(portals);
  while (fieldsToSearch.length > 0) {
    let { y, x } = fieldsToSearch.shift();
    let actualField = maze[y][x];
    for (const dir of dirs) {
      let newField = maze[y + dir.y][x + dir.x];
      if (newField.isPassage && !newField.visited) {
        newField.visited = true;
        newField.distance = actualField.distance + 1;
        fieldsToSearch.push({ y: y + dir.y, x: x + dir.x });
      }
    }
    if (actualField.portal && !actualField.portal.beenThrough) {
      //console.log("gathering info about portal " + actualField.portal.portalName + " at " + x + " " + y);
      //console.log("Have we been here? " + actualField.portal.beenThrough);
      if (actualField.portal.portalName == "ZZ") {
        actualField.pathHere = true;
        backX = x;
        backY = y;
        continue;
      }
      actualField.portal.beenThrough = true;
      let newX, newY;
      for (const portal of portals[actualField.portal.portalName]) {
        if (portal.x !== x && portal.y !== y) {
          newX = portal.x;
          newY = portal.y;
          //console.log("found second,", newX, newY)
        }
      }
      let newField = maze[newY][newX];
      newField.visited = true;
      newField.distance = actualField.distance + 1;
      //console.log(newField, newX, newY);
      newField.portal.beenThrough = true;
      fieldsToSearch.push({ x: newX, y: newY });
    }
  }

  let end = false;

  while (!end) {
    let newBackX, newBackY;
    let actualField = maze[backY][backX];
    for (const dir of dirs) {
      let newField = maze[backY + dir.y][backX + dir.x];
      if (newField.distance && newField.distance < actualField.distance) {
        console.log(newField.distance, actualField.distance);
        newField.pathHere = true;
        newBackX = backX + dir.x;
        newBackY = backY + dir.y;
      }
    }
    if (newBackX === undefined && newBackY === undefined) {
        if (actualField.portal) {
            for (const portal of portals[actualField.portal.portalName]) {
                if (portal.x !== backX && portal.y !== backY) {
                  newBackX = portal.x;
                  newBackY = portal.y;
                  //console.log("found second,", newX, newY)
                }
              }
        }   
    }
    if (newBackX === undefined && newBackY === undefined) end = true;
    backX = newBackX;
    backY = newBackY;
  }

  drawMapToHTML(maze, nicePortalsHTML);

  return maze;
};

const task1 = (data) => {};

const task2 = (data) => {};

let testdata = `         A           
A           
#######.#########  
#######.........#  
#######.#######.#  
#######.#######.#  
#######.#######.#  
#####  B    ###.#  
BC...##  C    ###.#  
##.##       ###.#  
##...DE  F  ###.#  
#####    G  ###.#  
#########.#####.#  
DE..#######...###.#  
#.#########.###.#  
FG..#########.....#  
###########.#####  
    Z       
    Z      `;

inputdata = prepare(splitLines(inputdata));

//testdata = prepare(splitLines(testdata));

console.log("");

//doEqualTest(task1(testdata), 7);

//console.log("Task 1: " + task1(inputdata));

console.log("");

//doEqualTest(task2(testdata), 336);

//console.log("Task 2: " + task2(inputdata));
