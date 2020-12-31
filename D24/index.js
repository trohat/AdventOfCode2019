console.log("funguju");

const splitLines = (data) => data.split(String.fromCharCode(10));

const prepare = data => data;

String.prototype.setCharAt = function(index, char) {
    return this.substring(0,index) + char + this.substring(index+1);
}

const task1 = (eris) => {
    const maxY = eris.length;

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
    console.log(eris);
    
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

const task2 = data => {
    
}

let testdata = `....#
#..#.
#..##
..#..
#....`;

inputdata = splitLines(inputdata);

console.log(inputdata);

testdata = prepare(splitLines(testdata));

console.log("");

doEqualTest(task1(testdata), 2129920);

console.log("Task 1: " + task1(inputdata));

console.log("");

//doEqualTest(task2(testdata), 336);

//console.log("Task 2: " + task2(inputdata));