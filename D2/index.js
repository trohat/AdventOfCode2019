console.log("AOC 2019 - Day 2: 1202 Program Alarm");

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
