console.log("funguju");

const splitLines = (data) => data.split(String.fromCharCode(10));

const prepare = data => {
    console.log("Width:", data[0].length);
    console.log("Height:", data.length);
    str = "";
    data.forEach(line => {
        line = line.split("");
        line.forEach(char => {
            if (!["#", ".", "@"].includes(char)) str += char;
        })
    })
    console.log(str.length, str.split("").sort().join(""));
};

const task1 = (data) => {
    
};

const task2 = data => {
    
}

let testdata = `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`;

inputdata = prepare(splitLines(inputdata));

console.log(inputdata);

testdata = prepare(splitLines(testdata));

console.log("");

//doEqualTest(task1(testdata), 7);

//console.log("Task 1: " + task1(inputdata));

console.log("");

//doEqualTest(task2(testdata), 336);

//console.log("Task 2: " + task2(inputdata));