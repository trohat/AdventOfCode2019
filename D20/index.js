console.log("AOC 2019 - Day 20: Donut Maze");

const splitLines = (data) => data.split(String.fromCharCode(10));

const dirs = [
    { y: 0, x: 1 },
    { y: 1, x: 0 },
    { y: -1, x: 0 },
    { y: 0, x: -1 },
];

const prepare = (data, mazeLevels) => {
    const height = data.length;
    let width;
    data = data.map((line) => {
        if (!/[A-Z]/.test(line.charAt(0))) line = "  " + line;
        else width = line.length;
        return line;
    });
    console.log("Width:", width);
    console.log("Height:", height);

    const map = [];
    let i = 0;

    for (const line of data) {
        map.push([]);
        let j = 0;
        for (const char of line) {
            const isWall = char === "#";
            const isPortal = /[A-Z]/.test(char);
            const isPassage = char === ".";
            map[i].push({
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
        map[i].push({ char: " " });
        i++;
    }

    map.push([]);
    for (let j = 0; j < i; j++) {
        map[i].push({ char: " " });
    }

    const fieldsToSearch = [];

    const portalsOuter = {};
    const portalsInner = {};

    let startX, startY;

    let y = 0;
    for (const line of map) {
        let x = 0;
        for (const field of line) {
            if (field.isPortal && !field.portalized) {
                for (const dir of dirs) {
                    if (map[y + dir.y][x + dir.x].isPortal) {
                        let secondPortalField = map[y + dir.y][x + dir.x];
                        field.portalized = true;
                        secondPortalField.portalized = true;
                        let portalName = field.char + secondPortalField.char;

                        let portalX, portalY;
                        if (
                            map[y + dir.y + dir.y][x + dir.x + dir.x].isPassage
                        ) {
                            portalX = x + dir.x + dir.x;
                            portalY = y + dir.y + dir.y;
                        } else if (map[y - dir.y][x - dir.x].isPassage) {
                            portalY = y - dir.y;
                            portalX = x - dir.x;
                        } else console.error("Portal without passage");
                        let passagePortal = map[portalY][portalX];
                        passagePortal.isPortal = true;
                        passagePortal.portalized = true;
                        passagePortal.portal = {};
                        passagePortal.portal.portalName = portalName;
                        passagePortal.portal.beenThrough = false;
                        if (
                            portalY === 2 ||
                            portalX === 2 ||
                            height - portalY === 3 ||
                            width - portalX === 3
                        )
                            passagePortal.portal.outer = true;
                        else passagePortal.outer = false;
                        if (portalName === "AA") {
                            fieldsToSearch.push({
                                y: portalY,
                                x: portalX,
                                level: 0,
                            });
                            startX = x;
                            startY = y;
                        }
                        if (passagePortal.portal.outer)
                            portalsOuter[portalName] = {
                                x: portalX,
                                y: portalY,
                            };
                        else
                            portalsInner[portalName] = {
                                x: portalX,
                                y: portalY,
                            };
                        break;
                    }
                }
            }
            x++;
        }
        y++;
    }

    console.log(portalsOuter);
    console.log(portalsInner);

    let maze = [];

    for (let i = 0; i < mazeLevels; i++) {
        maze.push([]);
        for (let j = 0; j < height; j++) {
            maze[i].push([]);
            for (let k = 0; k < width; k++) {
                maze[i][j].push(null);
            }
        }
    }

    maze[0][startY][startX] = 0;

    let maxLevel = 0;

    while (fieldsToSearch.length > 0) {
        let { y, x, level } = fieldsToSearch.shift();
        let actualField = maze[level][y][x];
        let foundWay = false;
        for (const dir of dirs) {
            if (
                map[y + dir.y][x + dir.x].isPassage &&
                maze[level][y + dir.y][x + dir.x] === null
            ) {
                maze[level][y + dir.y][x + dir.x] = actualField + 1;
                fieldsToSearch.push({
                    level: level,
                    y: y + dir.y,
                    x: x + dir.x,
                });
                foundWay = true;
            }
        }
        if (!foundWay && map[y][x].portal) {
            if (map[y][x].portal.portalName == "ZZ") {
                if (level === 0) {
                    console.log("Steps: " + actualField);
                    break;
                } else continue;
            }
            if (map[y][x].portal.portalName == "AA") continue;
            if (map[y][x].portal.outer && level === 0) continue;

            let portalName = map[y][x].portal.portalName;

            if (map[y][x].portal.outer) {
                console.log("Returning to level " + (level - 1));
                let { x: newX, y: newY } = portalsInner[portalName];
                maze[level - 1][newY][newX] = actualField + 1;
                fieldsToSearch.push({ level: level - 1, x: newX, y: newY });
            } else {
                if (level > 25) continue;
                console.log("Going down to level " + (level + 1));
                let { x: newX, y: newY } = portalsOuter[portalName];
                maze[level + 1][newY][newX] = actualField + 1;
                fieldsToSearch.push({ level: level + 1, x: newX, y: newY });
            }
        }
    }

    //drawMapToHTML(map, nicePortalsHTML);

    return map;
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

const mazeLevels = 200;
inputdata = prepare(splitLines(inputdata), mazeLevels);

//testdata = prepare(splitLines(testdata));

console.log("");

//doEqualTest(task1(testdata), 7);

//console.log("Task 1: " + task1(inputdata));

console.log("");

//doEqualTest(task2(testdata), 336);

//console.log("Task 2: " + task2(inputdata));
