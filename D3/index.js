console.log("funguju");

const splitLines = (data) => data.split(String.fromCharCode(10));

const prepare1 = (data) => data.map((d) => d.split(","));

const prepare2 = (data) => {
  const re = /([RDUL])(\d+)/;
  return data.map((d) =>
    d.map((i) => {
      const [, direction, distance] = re.exec(i);
      return {
        direction,
        distance: +distance,
      };
    })
  );
};

inputdata = prepare2(prepare1(splitLines(inputdata)));

const data1 = inputdata[0];
const data2 = inputdata[1];

const countMax = (data) => {
  let maxR = 0;
  let maxL = 0;
  let maxU = 0;
  let maxD = 0;
  let actX = 0;
  let actY = 0;
  data.forEach((i) => {
    switch (i.direction) {
      case "U":
        actY -= i.distance;
        if (actY < 0 && Math.abs(actY) > maxU) maxU = Math.abs(actY);
        break;
      case "D":
        actY += i.distance;
        if (actY > maxD) maxD = actY;
        break;
      case "L":
        actX -= i.distance;
        if (actX < 0 && Math.abs(actX) > maxL) maxL = Math.abs(actX);
        break;
      case "R":
        actX += i.distance;
        if (actX > maxR) maxR = actX;
        break;
    }
  });
  console.log(`R: ${maxR} U: ${maxU} L: ${maxL} D: ${maxD}`);
};

countMax(data1);
countMax(data2);
const leftDistance = 5000;
const downDistance = 2000;

const draw = (data) => {
  
  const field = [];
  const init = (f, max) => {
    for (let i = 0; i < max; i++) {
      f.push([]);
    }
  };
  init(field, 25000);
  let posX = 0;
  let posY = 0;
  let steps = 0;
  const mark = (x, y, mark2, steps) => {
    if (!mark2 && field[x][y] === undefined) field[x][y] = { val: 1, steps1: steps };
    else if (mark2 && field[x][y] && field[x][y].val === 1) { field[x][y].val = 2; field[x][y].steps2 = steps };
  };
  const step = (direction) => {
    switch (direction) {
      case "U":
        posY += 1;
        break;
      case "D":
        posY -= 1;
        break;
      case "L":
        posX -= 1;
        break;
      case "R":
        posX += 1;
        break;
    }
  };
  const walkThrough = (instruction, mark2) => {
    for (let i = 0; i < instruction.distance; i++) {
      step(instruction.direction);
      steps++;
      mark(posX + leftDistance, posY + downDistance, mark2, steps);
    }
  };
  data[0].forEach((i) => walkThrough(i, false));
  posX = 0;
  posY = 0;
  steps = 0;
  data[1].forEach((i) => walkThrough(i, true));

  return field;
};

let testdata = `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`;

testdata = prepare2(prepare1(splitLines(testdata)));
//countMax(testdata[0]);
//countMax(testdata[1]);

const printField = (field) => {
  for (let i = 0; i < field.length; i++) {
    let str = "";
    for (let j = 0; j < field[i].length; j++) {
      let pos = field[i][j];
      if (pos === undefined) pos = " ";

      str += pos.toString();
      str += " ";
    }
    console.log(str);
  }
};

const task1 = (field) => {
  const countManhattan = (i,j) => {
    return Math.abs(i - leftDistance) + Math.abs(j - downDistance); 
  }
  let minM = undefined;
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] && field[i][j].val === 2) {
        const actM = field[i][j].steps1 + field[i][j].steps2;
        if (!minM || actM < minM) minM = actM;
      }
    }
  }
  return minM;
};

//printField(draw(testdata));
console.log(task1(draw(inputdata)));