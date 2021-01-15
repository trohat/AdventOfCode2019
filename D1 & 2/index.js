console.log("AOC 2019 - Day 1: The Tyranny of the Rocket Equation & Day 2: 1202 Program Alarm");
/*
data = data.split(String.fromCharCode(10));

data = data.map(d => +d);

const v = data.reduce((accumulator, value) => {
    actualFuel = value;
    totalFuel = -value;
    while (actualFuel > 0) {
        totalFuel += actualFuel;
        actualFuel = (Math.floor(actualFuel / 3) - 2);
    }
    return accumulator + totalFuel;
}, 0);

console.log(v);
*/
data = data.split(",");
data = data.map((d) => +d);
const saveData = [...data];

for (let i = 0; i < 100; i++)
    for (let j = 0; j < 100; j++) {
        data = [...saveData];
        data[1] = i;
        data[2] = j;
        let position = 0;
        let end = false;

        while (!end) {
            let opcode = data[position];
            switch (opcode) {
                case 1:
                    data[data[position + 3]] = data[data[position + 1]] + data[data[position + 2]];
                    break;
                case 2:
                    data[data[position + 3]] = data[data[position + 1]] * data[data[position + 2]];
                    break;
                case 99:
                    if (data[0] === 19690720) {
                        console.log(i * 100 + j);
                    }
                    end = true;
                    break;
            }
            position += 4;
        }
    }
