console.log("funguju");

const splitLines = (data) => data.split(String.fromCharCode(10));

const prepare = data => {
    //console.log(data.length + " instructions");
    data = data.map(instr => {
        if (/new stack/.test(instr)) return { type: "reverse" };
        const incrementRe = /increment (\d+)/;
        const cutRe = /cut (-?\d+)/;
        if (incrementRe.test(instr)) {
            const [ , number ] = incrementRe.exec(instr);
            return { 
                type: "increment",
                number: + number
            }
        }
        if (cutRe.test(instr)) {
            const [ , number ] = cutRe.exec(instr);
            return { 
                type: "cut",
                number: + number
            }
        }
        console.error("Unknown instruction");
    });

    return data;
};

const task1 = (instructions, task, sCard) => {
    const makeNewInstructions = (instructionsToReduce, count) => {
      if (instructionsToReduce[0].type === "increment") {
        //console.log("This should be increment: " + instructionsToReduce[1].type);
        return [
          {
            type: "increment",
            number: (instructionsToReduce[0].number * instructionsToReduce[1].number) % count,
          },
        ];
      }
      if (instructionsToReduce[0].type === "cut") {
        if (instructionsToReduce[1].type === "cut") {
          return [
            {
              type: "cut",
              number: (instructionsToReduce[0].number + instructionsToReduce[1].number) % count,
            }
          ]
        }
        //console.log("This should be increment: " + instructionsToReduce[1].type);
        return [
          {
            type: "increment",
            number: instructionsToReduce[1].number
          },
          {
            type: "cut",
            number: (instructionsToReduce[0].number * instructionsToReduce[1].number) % count,
          }
        ]
      }
      //console.log("This should be reverse: " + instructionsToReduce[0].type);
      if (instructionsToReduce[1].type === "reverse") {
        return [];
      }
      if (instructionsToReduce[1].type === "cut") {
        return [
          {
            type: "cut",
            number: count - instructionsToReduce[1].number
          },
          {
            type: "reverse"
          }
        ];
      }
      //console.log("This should be increment: " + instructionsToReduce[1].type);
      let x = instructionsToReduce[1].number;
      return  [
        {
          type: "increment",
          number: instructionsToReduce[1].number
        },
        {
          type: "cut",
          number: 1 - x
        },
        {
          type: "reverse"
        }
      ];
    };

    const reduceInstructions = (instructions, count) => {
        let ordered = false;
        const order = { "increment": 0, "cut": 1, "reverse":2 };
        mainWhile: while (!ordered) {
            for (let i = 0; i < instructions.length - 1; i++) {
                if (order[instructions[i].type] >= order[instructions[i+1].type]) {

                    let newInstructions = makeNewInstructions(instructions.splice(i,2), count);
                    instructions.splice(i, 0, ...newInstructions);
                    continue mainWhile;
                }
            }
            ordered = true;
        }

        return instructions;
    }


    let deck = 10007;
    let card = 3589;
    if (task === "test") deck = 10;
    if (task === "test") card = sCard;
    if (task === "task2") deck = 119315717514047;
    if (task === "task2") card = 2020;
    instructions = reduceInstructions(instructions, deck);
    
    const baseInstructions = [ ...instructions ];
    
    let finishedInstructions = [];
    let repetitions = 1;
    if (task === "task2") repetitions = 101741582076661;
    while (repetitions > 0) {
      let many = 1;
      instructions = [ ...baseInstructions];
      while ((many*2) <= repetitions) {
        many *= 2;
        instructions = reduceInstructions(instructions.concat(instructions), deck);
      }
      console.log("Many:", many, " Repetitions:", repetitions, " After subtracting:", repetitions-many);
      repetitions = repetitions - many;
      finishedInstructions = finishedInstructions.concat(instructions);
    }
    finishedInstructions = reduceInstructions(finishedInstructions, deck);
    console.log(finishedInstructions);
    instructions = [ ...finishedInstructions];
    
    for (let i = instructions.length - 1; i >= 0; i--) {
        let instr = instructions[i];
        switch (instr.type) {
          case "reverse":
            card = deck - 1 - card;
            break;
          case "increment":
            console.log("starting increment")
            let inc = instr.number;
            let step = 0;
            let steps = 0;
            while (step !== card) {
              step += inc;
              steps++;
              if (step >= deck) {
                step -= deck;
              }
              //console.log("Card:", card / 10e12, "Inc:", inc / 10e12, "Step:", step / 10e12);
            }
            console.log("ending increment")
            card = steps;
            break;
          case "cut":
            let cut = instr.number;
            if (cut < 0) cut += deck;
            let noCut = deck - cut;
            if (card < noCut) card = card + cut;
            else card = card - noCut;
            break;
          default:
            console.error("Unknown action");
        }
    }
    

    return card;
};

const task2 = data => {
    
}

let testdata = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`;
console.time();
instructions = prepare(splitLines(inputdata));


//testinstructions = prepare(splitLines(testdata));
//console.log(instructions);

console.log("");

//doEqualTest(task1(testinstructions, "test", 0), 2);

//console.log("Task 1: " + task1(instructions));

console.log("");

//doEqualTest(task2(testdata), 336);

console.log("Task 2: " + task1(instructions, "task2"));
console.timeEnd();