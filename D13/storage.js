
const drawToHTML = (tiles) => {
    const chars = ["&nbsp;", "W", ".", "_", "o"];
    let arcade = [];
    for (let i = 0; i < 25; i++) {
      arcade.push([]);
    }
    for (let i = 0; i < tiles.length; i += 3) {
      if ((i+2) in tiles)
      arcade[tiles[i + 1]][tiles[i]] = chars[tiles[i + 2]];
    }
    for (let i = 0; i < 10; i++) {
      arcade[i].unshift([" "]);
    }
    arcade = arcade.map(line => line.join(""));
    arcade.forEach((line, index) => {
      const el = document.querySelector(".line" + index);
      el.innerHTML = line;
    })
  };
  