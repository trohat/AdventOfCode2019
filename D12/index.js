console.log("funguju");

const splitLines = (data) => data.split(String.fromCharCode(10));

let xPositions = [];
let yPositions = [];
let zPositions = [];

//const position = [ [], [], [], [] ];

Array.prototype.arrayFieldsToNumbers = function() {
    return this.map (f => +f);
}

const prepare = (data) => {
    const re = /x=([+-]?\d+), y=([+-]?\d+), z=([+-]?\d+)/;
    data.forEach((line, index) => {
        [ , xPositions[index], yPositions[index], zPositions[index] ] = re.exec(line);
    })
    xPositions = xPositions.arrayFieldsToNumbers();
    yPositions = yPositions.arrayFieldsToNumbers();
    zPositions = zPositions.arrayFieldsToNumbers();
    //console.log(xPositions, yPositions, zPositions);
}

console.log(inputdata);

const task1 = (data, maxSteps) => {
    let steps = 0;
    const xVelocities = [ 0, 0, 0, 0 ];
    const yVelocities = [ 0, 0, 0, 0 ];
    const zVelocities = [ 0, 0, 0, 0 ];
    
    countVelocities = (velocitiesArr, positionsArr) => {
        for (let moon = 0; moon < velocitiesArr.length; moon++) {
            for (let i = 0; i < positionsArr.length; i++) {
                let change = 0;
                if (positionsArr[moon] > positionsArr[i]) change = -1;
                if (positionsArr[moon] < positionsArr[i]) change = 1;
                velocitiesArr[moon] += change;
            }
        }
    }
    
    countPositions = (positionsArr, velocitiesArr) => {
        return positionsArr.map ((pos, index) => pos + velocitiesArr[index]);
    }
    
    while (steps < maxSteps ) {
        steps ++;
        countVelocities (xVelocities, xPositions);
        countVelocities (yVelocities, yPositions);
        countVelocities (zVelocities, zPositions);
        //console.log(xVelocities, yVelocities, zVelocities);
        xPositions = countPositions (xPositions, xVelocities);
        yPositions = countPositions (yPositions, yVelocities);
        zPositions = countPositions (zPositions, zVelocities);
        //console.log(xPositions, yPositions, zPositions);
    }

    let total = 0;
    
    for (let moon = 0; moon < xPositions.length; moon++) {
        total += (Math.abs(xPositions[moon]) + Math.abs(yPositions[moon]) + Math.abs(zPositions[moon])) * (Math.abs(xVelocities[moon]) + Math.abs(yVelocities[moon]) + Math.abs(zVelocities[moon]));
    }

    return total;
};

const task2 = data => {
 
}

let testdata = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;

testdata = prepare(splitLines(testdata));

console.log("");

doEqualTest(task1(testdata, 10), 179);

inputdata = prepare(splitLines(inputdata));

console.log("Task 1: " + task1(inputdata, 1000));

console.log("");

//doEqualTest(task2(testdata), 336);

//console.log("Task 2: " + task2(inputdata));