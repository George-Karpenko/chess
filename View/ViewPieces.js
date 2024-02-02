import ViewPiece from "./ViewPiece.js";

export default class ViewPieces {
  #gridPieces;
  #viewPieces;

  constructor(element, gridPieces) {
    this.#gridPieces = gridPieces;
    this.#viewPieces = viewStartingPositionOfPieces(element, this.#gridPieces)
      .flat(Infinity)
      .filter((viewPiece) => viewPiece);
  }

  get value() {
    return this.#viewPieces;
  }

  removePiece(viewPiece) {
    this.#viewPieces.filter((filterViewPiece) => filterViewPiece !== viewPiece);
    viewPiece.remove();
  }
}

function viewStartingPositionOfPieces(pieceContainer, gridPieces) {
  return gridPieces.map((pieces) => pieces.map((piece) => createPiece(piece)));

  function createPiece(piece) {
    if (!piece) return;
    const x = piece.x;
    const y = piece.y;
    const color = piece.color;
    const value = piece.constructor.name;
    return new ViewPiece({ pieceContainer, x, y, color, value });
  }
}
