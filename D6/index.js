console.log("funguju");

const testdata = `COM)B11
B11)C11
C11)D11
D11)E11
E11)F11
B11)G11
G11)H11
D11)I11
E11)J11
J11)K11
K11)L11
K11)YOU
I11)SAN`;

const splitLines = (data) => data.split(String.fromCharCode(10));

const re = /(\w{1,3})\)(\w{1,3})/;
const prepare = (data) => data.map((d) => {
    const [ , orbited, orbiting ] = re.exec(d);
    return { orbited, orbiting };
});

const orbits = {};

const task1 = data => {
    data.forEach( d => {
        if (!(d.orbited in orbits)) orbits[d.orbited] = {};
        if (!(d.orbiting in orbits)) orbits[d.orbiting] = {};
        if ("parent" in orbits[d.orbiting]) console.error("Divné"); else orbits[d.orbiting].parent = d.orbited;
        if (!("children" in orbits[d.orbited])) orbits[d.orbited].children = [];
        if (orbits[d.orbited].children.includes(d.orbiting)) console.error("Divné2"); else orbits[d.orbited].children.push(d.orbiting);
    })
    /*return Object.keys(orbits).map(key => ({ ...orbits[key], name: key })).sort((a,b) => {
        if (!("parent" in a)) return -1;
        if (!("parent" in b)) return 1;
        return 0 //a.children.length - b.children.length;
    });*/
    countNeighbours = (actPlanet, distance) => {
        const planet = orbits[actPlanet];
        planet.distance = distance;
        if (planet.children === undefined) return;
        for (let i = 0; i < planet.children.length; i++) {
            countNeighbours(planet.children[i], distance + 1);
        }
    }

    countNeighbours("COM", 0);

    return Object.keys(orbits).reduce((accumulator, currentValue) => accumulator + orbits[currentValue].distance, 0);
}

countNeighbours = (actPlanet, distance) => {
    const planet = orbits[actPlanet];
    planet.distance = distance;
    if (planet.children === undefined) return;
    for (let i = 0; i < planet.children.length; i++) {
        countNeighbours(planet.children[i], distance + 1);
    }
}

const task2 = orbits => {
    getTravelToBegin = (actPlanet) => {
        const planet = orbits[actPlanet];
        if (planet.parent === undefined) return "";
        return planet.parent + getTravelToBegin(planet.parent);
    }

    let san = getTravelToBegin("SAN");
    let you = getTravelToBegin("YOU");

    let go = true;
    while (go) {
        if (san.charAt(san.length-1) === you.charAt(you.length-1) ) {
            san = san.slice(0, san.length-1)
            you = you.slice(0, you.length-1)
        } else go = false;
    }
    console.log(san, " ", you);
    return (san.length / 3 ) + (you.length / 3 );
}

console.log(task1(prepare(splitLines(inputdata))));

console.log(task2(orbits));