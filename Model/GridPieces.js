import replacePiece from "./promotionChoice.js";

export default class GridPieces {
  #gridPieces;

  constructor(gridPieces) {
    this.#gridPieces = gridPieces;
  }

  get gridPieces() {
    return this.#gridPieces;
  }

  removePiece({ x, y }) {
    if (!this.#gridPieces[y][x]) return;
    this.#gridPieces[y][x] = null;
  }

  addMoves(piece, eatenOnAisle) {
    return piece.acceptableMovesTODO({
      gridPieces: this.#gridPieces,
      eatenOnAisle,
    });
  }

  async movePiece({ x, y, eatenOnAisle, piece }) {
    return piece.move({
      x,
      y,
      eatenOnAisle: eatenOnAisle,
      gridPieces: this.gridPieces,
      removePiece: this.removePiece.bind(this),
    });
  }

  async promotionChoice(promotionChoice, piece, x) {
    return replacePiece(
      await promotionChoice({
        color: piece.color,
        x,
      })
    );
  }
  async viewUpPieces() {}
}
