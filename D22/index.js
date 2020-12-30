console.log("funguju");

const splitLines = (data) => data.split(String.fromCharCode(10));

const prepare = data => {
    console.log(data.length + " instructions");
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

const task1 = (instructions, task) => {
    let cards = 10007;
    if (task === "test") cards = 10;
    if (task === "task2") cards = 119315717514047;
    console.log(cards);
    let deck = new Array(cards);
    for (let i = 0; i < cards; i++) {
        deck[i] = i;
    }
    for (const instr of instructions) {
        let n;
        switch (instr.type) {
          case "reverse":
            deck.reverse();
            break;
          case "increment":
            n = instr.number;
            let pos = 0;
            let newDeck = Array(cards);
            for (const card of deck) {
              newDeck[pos] = card;
              pos = (pos + n) % cards;
            }
            deck = [...newDeck];
            break;
          case "cut":
            n = instr.number;
            if (n < 0) n += cards;
            let cutDeck = deck.splice(0, n);
            deck = deck.concat(cutDeck);
            break;
          default:
            console.error("Unknown action");
        }
    }
    if (task === "test") return deck;

    return deck.indexOf(2019);
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

console.log(instructions);

testinstructions = prepare(splitLines(testdata));

console.log(testinstructions);

console.log("");

doEqualTest(task1(testinstructions, "test"), 2);

//console.log("Task 1: " + task1(instructions));

console.log("");

//doEqualTest(task2(testdata), 336);

console.log("Task 2: " + task1(instructions, "task2"));
console.timeEnd();