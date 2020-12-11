console.log("funguju");

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

let xPositions = [];
let yPositions = [];
let zPositions = [];

const compareArrays = (arr1, arr2) => {
  let same = true;
  arr1.forEach((field, index) => {
    if (field !== arr2[index]) same = false;
  });
  return same;
};

Array.prototype.arrayFieldsToNumbers = function () {
  return this.map((f) => +f);
};

const prepare = (data) => {
  const re = /x=([+-]?\d+), y=([+-]?\d+), z=([+-]?\d+)/;
  data.forEach((line, index) => {
    [, xPositions[index], yPositions[index], zPositions[index]] = re.exec(line);
  });
  xPositions = xPositions.arrayFieldsToNumbers();
  yPositions = yPositions.arrayFieldsToNumbers();
  zPositions = zPositions.arrayFieldsToNumbers();
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
    if (
      compareArrays(positions, startPos) &&
      compareArrays(velocities, startVel)
    )
      end = true;
  }
  return steps;
};

const task2 = () => {
  const repeatX = countCycle(xPositions);
  const repeatY = countCycle(yPositions);
  const repeatZ = countCycle(zPositions);
  console.log(factorizeToPrimes(repeatX));
  console.log(factorizeToPrimes(repeatY));
  console.log(factorizeToPrimes(repeatZ));
};

let testdata = `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`;

console.log("");

testdata = prepare(splitLines(testdata));
doEqualTest(task2(testdata), 179);

//inputdata = prepare(splitLines(inputdata));

//console.log("Task 1: " + task1(inputdata, 1000));

console.log("");

//doEqualTest(task2(testdata), 2772);

//console.log("Task 2: " + task2(inputdata));
