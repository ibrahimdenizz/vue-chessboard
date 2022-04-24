function fenToBoardArr(fen) {
  const boardArr = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  const positionStr = fen.split(" ")[0];
  positionStr.split("/").forEach((rowStr, y) => {
    let x = 0;
    rowStr.split("").forEach((char) => {
      if (parseInt(char)) {
        x += parseInt(char);
      } else {
        boardArr[y][x] = char;
        x++;
      }
    });
  });

  return boardArr;
}

export default fenToBoardArr;
