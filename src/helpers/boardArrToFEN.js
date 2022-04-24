function boardArrToFen(board, currentPlayer) {
  let fen = "";
  board.forEach((row) => {
    let nullCount = 0;
    row.forEach((piece) => {
      if (piece == null) {
        nullCount++;
      } else {
        fen += nullCount ? nullCount + piece : "" + piece;
        nullCount = 0;
      }
    });

    fen += nullCount ? nullCount + "/" : "/";
    nullCount = 0;
  });

  return fen + " " + (currentPlayer === "white" ? "b" : "w");
}

export default boardArrToFen;
