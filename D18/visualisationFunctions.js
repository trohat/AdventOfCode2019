
const niceWalls = field => {
    if (field.isWall) return "███";
    return " " + field.char + " ";
}

const distanceSteps = field => {
    if (field.isWall) return "████";
    if (field.distance !== null) return field.distance.toString().padEnd(3, " ").padStart(4, " ");
    return " " + field.char + "  ";
}

const behindDoors = field => {
    if (field.isWall) return "███";
    if (field.isDoor) return "-" + field.char + "-";
    if (field.isKey) return "*" + field.char + "*";
    if (field.behindDoors !== null) return field.behindDoors.join("").padEnd(2, " ").padStart(3, " ").slice(0,3);
    //if (field.distance !== null) return field.distance.toString().padEnd(2, " ").padStart(3, " ");
    return " " + field.char + " ";
}

const behindDoorsHTML = field => {
    if (field.isWall) return '<span class="wall">   </span>';
    if (field.isDoor) {
        const title = doorHideKeys[field.char].length === 0 ? 'empty of keys' : 'keys inside: ' + doorHideKeys[field.char];
        return '<span class="door" title="' + title + '">-' + field.char + '-</span>';
    }
    if (field.isKey) {
        const title = keys[field.char] === "free" ? 'free' : 'behind doors: ' + keys[field.char];
        const title2 = keysHideKeys[field.char].length === 0 ? "empty of keys" : 'keys inside: ' + keysHideKeys[field.char];
        return '<span class="key" title="' + title + " -- " +  title2 + '">*' + field.char + '*</span>';
    }
    if (field.behindDoors !== null) return '<span>' + field.behindDoors.join("").padEnd(2, " ").padStart(3, " ").slice(0,3) + '</span>';
    //if (field.distance !== null) return field.distance.toString().padEnd(2, " ").padStart(3, " ");
    if (field.isMe) return '<span class="me">   </span>'
    return '<span>   </span>';
}

const distancesHTML = field => {
    if (field.isWall) return '<span class="wall">   </span>';
    if (field.isDoor) {
        const title = doorHideKeys[field.char].length === 0 ? 'empty of keys' : 'keys inside: ' + doorHideKeys[field.char];
        return '<span class="door" title="' + title + '">-' + field.char + '-</span>';
    }
    if (field.isKey) {
        const title = keys[field.char] === "free" ? 'free' : 'behind doors: ' + keys[field.char];
        const title2 = keysHideKeys[field.char].length === 0 ? "empty of keys" : 'keys inside: ' + keysHideKeys[field.char];
        return '<span class="key" title="' + title + " -- " +  title2 + '">*' + field.char + '*</span>';
    }
    if (field.isMe) return '<span class="me">   </span>'
    if (field.distance !== null) return '<span>' + field.distance.toString().padEnd(2, " ").padStart(3, " ") + '</span>';
    return '<span>   </span>';
}

const behindDoorsBig = field => {
    if (field.isWall) return "████";
    if (field.isDoor) return "--" + field.char + "-";
    if (field.isKey) return "**" + field.char + "*";
    if (field.behindDoors !== null) return field.behindDoors.join("").padEnd(2, " ").padStart(4, " ").slice(0,4);
    if (field.distance !== null) return field.distance.toString().padEnd(3, " ").padStart(4, " ");
    return " " + field.char + "  ";
}

const visitedFields = field => {
    if (field.isWall) return "███";
    if (field.visited) return "VVV";
    return " " + field.char + " ";
}

const doorsAndKeys = field => {
    if (field.isWall) return "███";
    if (field.distance) return field.distance.toString().padEnd(2, " ").padStart(3, " ");
    if (field.isKey) return "p" + field.char + "p";
    if (field.isDoor) return "O" + field.char + "O";
    return " " + field.char + " ";
}


const drawMap = (map, how) => {
    if (how === undefined) 
        how = field => " " + field.char + " ";

    for (const line of map) {
        let str = "";
        for (const field of line) {
            str += how(field);
        }
        console.log(str);
    }
}

const drawMapToHTML = (map, how) => {
    const mapEl = document.querySelector(".map");
    for (const line of map) {
        let str = "";
        for (const field of line) {
            str += how(field);
        }
        let divEl = document.createElement("div")
        divEl.innerHTML += str;
        mapEl.appendChild(divEl);
    }
}