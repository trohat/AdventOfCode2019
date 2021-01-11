console.log("AOC 2019 - Day 24: Planet of Discord");

const splitLines = (data) => data.split(String.fromCharCode(10));

const prepare = data => data;

String.prototype.setCharAt = function(index, char) {
    return this.substring(0,index) + char + this.substring(index+1);
}

Array.prototype.countChar = function(char) {
    return this.reduce((accumulator, str) => accumulator + str.split(char).length-1, 0);
} 

const task1 = (eris) => {
    const maxY = eris.length;

    // code from AOC 2020 Day 11
    // yes, I made 2020 before 2019
    const countNeighbours = ( x,y, eris ) => {
        const maxY = eris.length - 1;
        let n = 0;
        if ( y > 0) {
            //n += (eris[y-1].charAt(x-1) === "#");
            n += (eris[y-1].charAt(x) === "#");
            //n += (eris[y-1].charAt(x+1) === "#");
        } 
        n += (eris[y].charAt(x-1) === "#");
        n += (eris[y].charAt(x+1) === "#");
        if ( y < maxY) {
            //n += (eris[y+1].charAt(x-1) === "#");
            n += (eris[y+1].charAt(x) === "#");
            //n += (eris[y+1].charAt(x+1) === "#");
        } 
        return n;
    }
    let layouts = new Set();
    let end = false;
    
    while (!end) {
        let lastEris = [...eris];
        eris = eris.map( (line, index) => {
            for (let i = 0; i < line.length; i++) {
                let tile = line.charAt(i);
                const n = countNeighbours(i, index, lastEris);
                if (tile === "#" && n !== 1) line = line.setCharAt(i, ".");
                if (tile === "." && [1,2].includes(n)) line = line.setCharAt(i, "#");
            }
            return line;
        })
        let layout = eris.toString();
        if (layouts.has(layout)) end = true;
        layouts.add(layout);
    }


    let erisString = eris.join("");
    let multiplier = 1;
    let biodiversity = 0;
    for (const char of erisString) {
        if (char === "#") biodiversity += multiplier;
        multiplier *= 2;
    }

    return biodiversity;
};

const task2 = (data, reps) => {
    const maxY = data.length - 1;

    const countNeighbours = ( x,y,z, eris ) => {
        let n = 0;
        if ( y > 0) {
            n += (eris[z][y-1].charAt(x) === "#");
        } 
        n += (eris[z][y].charAt(x-1) === "#");
        n += (eris[z][y].charAt(x+1) === "#");
        if ( y < maxY) {
            n += (eris[z][y+1].charAt(x) === "#");
        } 
        if (z !== 0) {
            if (x === 0) n+= (eris[z-1][2].charAt(1) === "#");
            if (x === 4) n+= (eris[z-1][2].charAt(3) === "#");
            if (y === 0) n+= (eris[z-1][1].charAt(2) === "#");
            if (y === 4) n+= (eris[z-1][3].charAt(2) === "#");
        }
        if (z !== erisSize) {
            if (x === 1 && y === 2) {
                for (let i = 0; i < 5; i++) {
                    n+= (eris[z+1][i].charAt(0) === "#");
                }
            }
            if (x === 3 && y === 2) {
                for (let i = 0; i < 5; i++) {
                    n+= (eris[z+1][i].charAt(4) === "#");
                }
            }
            if (x === 2 && y === 1) {
                for (let i = 0; i < 5; i++) {
                    n+= (eris[z+1][0].charAt(i) === "#");
                }
            }
            if (x === 2 && y === 3) {
                for (let i = 0; i < 5; i++) {
                    n+= (eris[z+1][4].charAt(i) === "#");
                }
            }
        }
        return n;
    }
    
    const floors = 450;
    const middleFloor = Math.floor(floors / 2);

    // can be hardcoded or taken from params
    const totalSteps = reps;
    
    let eris = [];
    for (let i = 0; i < floors; i++) {
        if (i === middleFloor) eris.push(data);
        eris.push(emptyLevel.split("\n"))
    }
    const erisSize = eris.length - 1;
    
    for (let steps = 0; steps < totalSteps; steps++) {
        
        let lastEris = [];
        for (const line of eris) {
            lastEris.push([ ...line]);
        }
        
        eris = eris.map((level,levelIndex) => {
            level = level.map( (line, index) => { 
                for (let i = 0; i < line.length; i++) {
                    if (i === 2 && index === 2) continue;
                    let tile = line.charAt(i);
                    const n = countNeighbours(i, index, levelIndex, lastEris);
                    if (tile === "#" && n !== 1) line = line.setCharAt(i, ".");
                    if (tile === "." && [1,2].includes(n)) line = line.setCharAt(i, "#");
                }
                return line;
            });
            return level;
        });
    }

    let bugs = 0;
    for (const level of eris) {
        bugs += level.countChar("#");
    }
    return bugs;
};

let testdata = `....#
#..#.
#..##
..#..
#....`;

inputdata = splitLines(inputdata);

testdata = prepare(splitLines(testdata));

console.log("");

doEqualTest(task1(testdata), 2129920);
console.time("Task 1 time");
console.log("Task 1: " + task1(inputdata));
console.timeEnd("Task 1 time");

console.log("");

doEqualTest(task2(testdata, 10), 99);

console.time("Task 2 time");
console.log("Task 2: " + task2(inputdata, 200));
console.timeEnd("Task 2 time");