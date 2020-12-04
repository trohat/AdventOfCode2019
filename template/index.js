console.log("funguju");

const splitLines = (data) => data.split(String.fromCharCode(10));

const prepare1 = (data) => data.map((d) => d.split(","));


inputdata = prepare2(prepare1(splitLines(inputdata)));

const data1 = inputdata[0];
const data2 = inputdata[1];

countMax(data1);
countMax(data2);
const leftDistance = 5000;
const downDistance = 2000;



let testdata = `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`;

testdata = prepare2(prepare1(splitLines(testdata)));

//printField(draw(testdata));
console.log(task1(draw(inputdata)));