console.log("AOC 2019 - Day 10: Monitoring Station");

const splitLines = (data) => data.split(String.fromCharCode(10));

const prepare = (data) => {
    let set = new Set();
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            if (data[i][j] === "#") set.add([i, j]);
        }
    }
    return set;
};

const simplifyFraction = (x, y) => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
    let end = false;
    while (!end) {
        end = true;
        primes.forEach((prime) => {
            if (x % prime === 0 && y % prime === 0) {
                end = false;
                x = x / prime;
                y = y / prime;
            }
        });
    }
    return x.toString() + y.toString();
};

const getAngle = (x, y) => {
    // back to normal coordinates
    y = -y;

    let angle = (Math.atan(y / x) / Math.PI) * 180;

    //trignonometric calculations
    if (x < 0) angle += 180;
    if (x >= 0 && y < 0) angle += 360;

    // conversion for starting from top and going clockwise
    if (angle <= 90) angle = 90 - angle;
    else angle = 450 - angle;
    return angle;
};

const getAngleWithAtan2 = (x, y) => {
    // back to normal coordinates
    y = -y;

    let angle = (Math.atan2(y,x) / Math.PI) * 180;

    // conversion for starting from top and going clockwise
    if (angle <= 90) angle = 90 - angle;
    else angle = 450 - angle;
    return angle;
};

const countPythagoras = (a, b) => Math.sqrt(a * a + b * b);

const task1 = (set) => {
    let maxSeen = 0;
    let bestX, bestY;
    set.forEach((station) => {
        const [stationY, stationX] = station;
        const letMeSee = new Set();
        set.forEach((asteroid) => {
            const [asteroidY, asteroidX] = asteroid;
            if (asteroidX === stationX && asteroidY === stationY) return;
            const xDist = asteroidX - stationX;
            const yDist = asteroidY - stationY;
            letMeSee.add(simplifyFraction(xDist, yDist));
        });
        if (letMeSee.size >= maxSeen) {
            maxSeen = letMeSee.size;
            bestX = stationX;
            bestY = stationY;
        }
    });
    return [maxSeen, bestX, bestY];
};

const task2 = (set, stationX, stationY, position) => {
    const angles = new Set();
    const anglesAndAsteroids = new Map();
    set.forEach((asteroid) => {
        const [asteroidY, asteroidX] = asteroid;
        if (asteroidX === stationX && asteroidY === stationY) return;
        const xDist = asteroidX - stationX;
        const yDist = asteroidY - stationY;
        let angle = getAngleWithAtan2(xDist, yDist);
        angles.add(angle);
        let distance = countPythagoras(xDist, yDist);
        if (
            !(angle in anglesAndAsteroids) ||
            anglesAndAsteroids[angle].distance > distance
        )
            anglesAndAsteroids[angle] = {
                asteroidX,
                asteroidY,
                distance,
            };
    });
    let myAngle = Array.from(angles).sort((a, b) => a - b)[position - 1];
    let x = anglesAndAsteroids[myAngle].asteroidX;
    let y = anglesAndAsteroids[myAngle].asteroidY;
    return 100 * x + y;
};

let testdata = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;

testdata = prepare(splitLines(testdata));

inputdata = prepare(splitLines(inputdata));

let [result, sX, sY] = task1(testdata);

console.log("");

doEqualTest(result, 210);

[result, sX, sY] = task1(inputdata);

console.log("Task 1: " + result);

console.log("");

console.log("Task 2: " + task2(inputdata, sX, sY, 200));