// vfs = visualisation functions

const drawMap = (map, how) => {
    if (how === undefined) 
        how = field => field.char;

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

const niceWalls = field => {
    if (field.isWall) return "█";
    return field.char;
}

const niceWallsHTML = field => {
    if (field.isWall) return '<span class="wall">   </span>';
    if (field.isPortal) return '<span class="portal"> ' + field.char + ' </span>';
    return '<span>   </span>';
}

const nicePortalsHTML = field => {
    if (field.isWall) return '<span class="wall">    </span>';
    let className = "";
    if (field.portal) className = "portal-passage";
    if (field.distance != null) return '<span class="' + className + '">' + field.distance.toString().padEnd(3, " ").padStart(4, " ") + '</span>';
    if (field.portal) return '<span class="portal-passage"> ' + field.portal.portalName + ' </span>';
    if (field.isPortal) return '<span class="portal"> ' + field.char + '  </span>';
    return '<span>    </span>';
}