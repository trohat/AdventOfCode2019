console.log("AOC 2018 - Day 14: Space Stoichiometry");

const splitLines = (data) => data.split(String.fromCharCode(10));

const prepare = data => {
    const re = /([\w ,]+) => (\d+) (\w+)/;
    const rawRe = /(\d+) (\w+)/;
    const materials = {};
    data.forEach(line => {
        const [ , raws, amount, product ] = re.exec(line);
        materials[product] = { amount: +amount, raws: []};
        raws.split(",").forEach( string  => {
            const [ , amount, raw ] = rawRe.exec(string);
            materials[product].raws.push({ amount: +amount, raw})
        })
    });
    return materials;
}

inputdata = prepare(splitLines(inputdata));

//console.log(inputdata);

const task1 = (data, materialToGet, leftovers) => {
    const materialsToGet = [ { materialName: materialToGet, materialAmount: 1 } ];
    let oreAmount = 0;
    //leftovers = {};
    
    mainWhile: while (materialsToGet.length > 0) {
        let actualMaterial = materialsToGet.shift();
        const mName = actualMaterial.materialName;
        let mNeeded = actualMaterial.materialAmount;
        if (mName in leftovers) {
            if (leftovers[mName] >= mNeeded) { 
                leftovers[mName] -= mNeeded; 
                if (leftovers[mName] === 0) delete leftovers[mName];
                continue mainWhile; 
            } else {
                mNeeded -= leftovers[mName];
                delete leftovers[mName];
            }
        }
        let producedAmount = data[mName].amount;
        let timesToProduce = 1;
        while (producedAmount < mNeeded) { 
            producedAmount += data[mName].amount;
            timesToProduce++;
        }
        if (producedAmount > mNeeded)  {
            leftovers[mName] = producedAmount - mNeeded;
        }
        data[mName].raws.forEach( raw => {
            if (raw.raw === "ORE") oreAmount += raw.amount * timesToProduce;
            else {
                materialsToGet.push({ materialName: raw.raw, materialAmount: raw.amount * timesToProduce});
            }
        })
    }
    return [ oreAmount, leftovers];
};

const task2 = data => {
    let fuel = 0;
    let ore = 1000000000000;
    let leftovers = {};
    while (ore > 0) {
        const arr = task1(data,"FUEL", leftovers);
        fuel+= 1;
        ore -= arr[0];
        leftovers = arr[1];
        if (fuel % 10000 === 0) console.log(fuel);
    }
    return fuel - 1;
}

let testdata = `157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`;

testdata = prepare(splitLines(testdata));

//doEqualTest(task1(testdata, "FUEL", {}), 31);

//console.log("Task 1: " + task1(inputdata, "FUEL"));

console.log("");

//doEqualTest(task2(testdata), 460664);

console.log("Task 2: " + task2(inputdata));