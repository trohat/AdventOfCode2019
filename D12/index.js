console.log("AOC 2019 - Day 12: The N-Body Problem");

const factorizeToPrimes = (number) => {
    const primes = [];
    let i = 2;
    while (i <= number) {
        if (number % i === 0) {
            primes.push(i);
            number = number / i;
        } else i++;
    }
    return primes;
};

const splitLines = (data) => data.split(String.fromCharCode(10));

const compareArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    let same = true;
    arr1.forEach((field, index) => {
        if (field !== arr2[index]) same = false;
    });
    return same;
};

Array.prototype.arrayFieldsToNumbers = function () {
    return this.map(f => +f);
};

const prepare = (data) => {
    let xPositions = [];
    let yPositions = [];
    let zPositions = [];
    const re = /x=([+-]?\d+), y=([+-]?\d+), z=([+-]?\d+)/;
    data.forEach((line, index) => [, xPositions[index], yPositions[index], zPositions[index]] = re.exec(line));
    xPositions = xPositions.arrayFieldsToNumbers();
    yPositions = yPositions.arrayFieldsToNumbers();
    zPositions = zPositions.arrayFieldsToNumbers();
    return [ xPositions, yPositions, zPositions];
};

const countCycle = (positions) => {
    let startPos = [...positions];

    const velocities = [0, 0, 0, 0];

    let startVel = [...velocities];

    countVelocities = (velocitiesArr, positionsArr) => {
        for (let moon = 0; moon < velocitiesArr.length; moon++) {
            for (let i = 0; i < positionsArr.length; i++) {
                let change = 0;
                if (positionsArr[moon] > positionsArr[i]) change = -1;
                if (positionsArr[moon] < positionsArr[i]) change = 1;
                velocitiesArr[moon] += change;
            }
        }
    };

    countPositions = (positionsArr, velocitiesArr) => {
        return positionsArr.map((pos, index) => pos + velocitiesArr[index]);
    };

    let steps = 0;
    let end = false;
    while (!end) {
        steps++;
        countVelocities(velocities, positions);
        positions = countPositions(positions, velocities);
        if (compareArrays(positions, startPos) && compareArrays(velocities, startVel)) end = true;
    }
    return steps;
};

const task2 = ([ xPositions, yPositions, zPositions]) => {
    const repeatX = countCycle(xPositions);
    const repeatY = countCycle(yPositions);
    const repeatZ = countCycle(zPositions);

    let primesX = factorizeToPrimes(repeatX);
    let primesY = factorizeToPrimes(repeatY);
    let primesZ = factorizeToPrimes(repeatZ);

    // finding lcm
    let result = 1;
    for (const n of primesX) {
        result *= n;
        if (primesY.includes(n)) {
            primesY.splice(primesY.indexOf(n), 1);
        }
        if (primesZ.includes(n)) {
            primesZ.splice(primesZ.indexOf(n), 1);
        }
    }
    for (const n of primesY) {
        result *= n;
        if (primesZ.includes(n)) {
            primesZ.splice(primesZ.indexOf(n), 1);
        }
    }
    for (const n of primesZ) result *= n;

    return result;
};

let testdata1 = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;

let testdata2 = `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`;

console.log("");

testdata1 = prepare(splitLines(testdata1));
testdata2 = prepare(splitLines(testdata2));
doEqualTest(task2(testdata1), 2772);
doEqualTest(task2(testdata2), 4686774924);
//console.log("Task 1: " + task1(inputdata, 1000));

console.log("");

inputdata = prepare(splitLines(inputdata));
console.log("Task 2: " + task2(inputdata));
