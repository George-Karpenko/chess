import replacePiece from "./promotionChoice.js";

export default class GridPieces {
  #value;

  constructor(gridPieces) {
    this.#value = gridPieces;
  }

  get value() {
    return this.#value;
  }

  addMoves(piece, eatenOnAisle, isCheck) {
    return piece.checkMoves({
      gridPieces: this.value,
      eatenOnAisle,
      isCheck,
    });
  }

  async movePiece({ move, piece }) {
    return piece.move({
      move,
      gridPieces: this.value,
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
}
