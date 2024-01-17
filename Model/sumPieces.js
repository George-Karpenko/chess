export default (pieces) => {
  return pieces.reduce((sum, piece) => {
    switch (piece.constructor.name) {
      case "Knight":
        return 300 + sum;
      case "Rook":
        return 500 + sum;
      case "Bishop":
        return 330 + sum;
      case "Queen":
        return 900 + sum;
      case "King":
        return 9900 + sum;
      case "Pawn":
        return 100 + sum;
    }
  }, 0);
};
