console.log("AOC 2019 - Day 1: The Tyranny of the Rocket Equation");

data = data.split(String.fromCharCode(10));

data = data.map(d => +d);

const v = data.reduce((accumulator, actualFuel) => {
    totalFuel = -actualFuel;
    while (actualFuel > 0) {
        totalFuel += actualFuel;
        actualFuel = (Math.floor(actualFuel / 3) - 2);
    }
    return accumulator + totalFuel;
}, 0);

console.log(v);