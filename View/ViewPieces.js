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

  async viewUpPieces(mapPieces, pieces) {
    const arrayAwait = [];
    pieces.forEach((piece) => {
      const viewPiece = mapPieces.get(piece);
      if (piece.constructor.name !== viewPiece.value) {
        viewPiece.value = piece.constructor.name;
      }
      if (piece.x === viewPiece.x && piece.y === viewPiece.y) return;
      arrayAwait.push(viewPiece.coordinate({ x: piece.x, y: piece.y }));
    });
    await Promise.all(arrayAwait);
  }

  async choicePiece() {
    const piecesClicks = this.#viewPieces.map((piece) => piece.onClick());
    return await Promise.any(piecesClicks);
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
