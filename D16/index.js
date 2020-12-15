console.log("funguju");

const prepare = data => data.repeat(10000);

const task1 = (input) => {
    const basePattern = [ 0, 1, 0, -1 ];
    const phases = 100;
    const inputLength = input.length;

    for (let phase = 0; phase < phases; phase++) {
        let output = "";
        // every number in input
        for (let i = 0; i < inputLength; i++) {
            let timesRepeat = i;
            let repeated = 0;
            let whereAmI = 0;
            let calculated = 0;

            for (let j = 0; j < inputLength; j++) {
                repeated++; 
                if (repeated > timesRepeat) {
                    repeated = 0;
                    whereAmI = (whereAmI + 1) % 4;
                }
                let n = input.charAt(j);
                calculated += n * basePattern[whereAmI];
            }
            output += Math.abs(calculated) % 10;
        }
        input = output;
    }
    
    return input.slice(0, 8);
};

const task2 = input => {

}

let testdata = `80871224585914546619083218645595`;

inputdata = inputdata;


doEqualTest(task1(testdata), "24176176");

console.log("Task 1: " + task1(inputdata));

console.log("");

let testdata2 = `03036732577212944063491565474664`;

//testdata2 = prepare(testdata2);
//inputdata = prepare(inputdata);

//console.log(inputdata.length);

//doEqualTest(task2(testdata2), "84462026");

//console.log("Task 2: " + task2(inputdata));