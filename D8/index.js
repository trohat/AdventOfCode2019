console.log("AOC 2019 - Day 8: Space Image Format");

String.prototype.count=function(c) { 
    var result = 0, i = 0;
    for(i;i<this.length;i++) if(this[i]==c)result++;
    return result;
};

const prepare = (data, len) => {
    let arr = [];
    while (data.length > 0) {
        arr.push(data.slice(0,len));
        data = data.slice(len);
    }
    return arr;
}


data = prepare(inputdata, 150);

console.log(data);

const task1 = data => {
    let min = 150;
    let minIndex = -1;
    data.forEach((d, index) => {
        let count = d.count("0");
        if (count < min) { min = count; minIndex = index;}
    });
    return data[minIndex].count("1") * data[minIndex].count("2");
}

const task2 = data => {
    let image = "";
    for (let i = 0; i < data[0].length; i++) {
        let j = 0;
        while (data[j].charAt(i) === "2") j++;
        if (data[j].charAt(i) === "0") image += " ";
        else image += "█";
    }
    return prepare(image, 25);
}

console.log(task1(data));
console.log(task2(data));