console.log("AOC 2018 - Day 4: Secure Container");

const start = 145852;

const end = 616942;

let howMany = 0;

loopOut: for (let pass = start; pass < end; pass++) {
    let same = 0;
    const arr = pass.toString().split("");
    arr.map(n => +n);
    for (let i = 1; i < 6; i++) {
        if (arr[i-1] > arr[i]) continue loopOut;
        if (arr[i-1] === arr[i]) {
            const n = arr[i];
            if (i > 1 && arr[i-2] === n) continue;
            if (i < 5 && arr[i+1] === n) continue;
            same = 1;
        }
    }
    howMany += same;
}

console.log(howMany);

