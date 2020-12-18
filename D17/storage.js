const drawOutputData = data => {
    let str = "";
    let lines = 0;
    data.forEach(char => {
      if (char === 10) {
        console.log(str.length, str);
        str = "";
        lines++;
      } else {
        str += String.fromCharCode(char);
      }
    })
    console.log(lines);
  };