console.log("AOC 2019 - Day 9: Sensor Boost");

const prepare = (program) => {
    program = program.split(",");
    program = program.map((d) => +d);
    return program;
};

function runLoop(parProgram, inputFunction) {
    const program = [...parProgram];
    //for (let i = 0; i < 1000; i++) {
    //  program.push(0);
    //}
    let position = 0;
    let relativeBase = 0;
    const outputs = [];

    const writeOutput = (output) => outputs.push(output);

    mainLoop: while (true) {
        const getOpcodeAndModes = (instruction) => {
            opcode = instruction % 100;
            modes = ((instruction - opcode) / 100).toString().split("");
            modes = modes.map((m) => +m).reverse();
        };

        const getArg = (i) => {
            if (modes[i - 1] === 2) return program[program[position + i] + relativeBase];
            else if (modes[i - 1] === 1) return program[position + i];
            return program[program[position + i]];
        };

        const getPosition = (i) => {
            if (modes[i - 1] === 2) return program[position + i] + relativeBase;
            else if (modes[i - 1] === 1) return position + i;
            return program[position + i];
        };

        let instruction = program[position];
        let opcode, modes;
        getOpcodeAndModes(instruction);

        let step, arg1, arg2, position3, storeArg;
        let useStep = true;
        //return;
        switch (opcode) {
            case 1:
                arg1 = getArg(1);
                arg2 = getArg(2);
                position3 = getPosition(3);
                program[position3] = arg1 + arg2;
                step = 4;
                break;
            case 2:
                arg1 = getArg(1);
                arg2 = getArg(2);
                position3 = getPosition(3);
                program[position3] = arg1 * arg2;
                step = 4;
                break;
            case 3:
                position1 = getPosition(1);
                program[position1] = inputFunction();
                step = 2;
                break;
            case 4:
                arg1 = getArg(1);
                writeOutput(arg1);
                step = 2;
                break;
            case 5:
                arg1 = getArg(1);
                arg2 = getArg(2);
                if (arg1) {
                    position = arg2;
                    useStep = false;
                }
                step = 3;
                break;
            case 6:
                arg1 = getArg(1);
                arg2 = getArg(2);
                if (!arg1) {
                    position = arg2;
                    useStep = false;
                }
                step = 3;
                break;
            case 7:
                arg1 = getArg(1);
                arg2 = getArg(2);
                position3 = getPosition(3);
                if (arg1 < arg2) {
                    storeArg = 1;
                } else storeArg = 0;
                program[position3] = storeArg;
                step = 4;
                break;
            case 8:
                arg1 = getArg(1);
                arg2 = getArg(2);
                position3 = getPosition(3);
                if (arg1 === arg2) {
                    storeArg = 1;
                } else storeArg = 0;
                program[position3] = storeArg;
                step = 4;
                break;
            case 9:
                arg1 = getArg(1);
                relativeBase += arg1;
                step = 2;
                break;
            case 99:
                break mainLoop;
        }
        if (useStep) position += step;
        console.log(position, relativeBase, program.join("-"));
    }
    return outputs;
}

const testprogram = prepare(`109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99`); // quine

data = prepare(data);

const getInput = () => 2;

console.log(runLoop(testprogram, getInput));
