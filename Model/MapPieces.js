export default class value {
  #value;
  #viewPieces;

  constructor(viewPieces, gridPieces) {
    this.#viewPieces = viewPieces;
    const pieces = gridPieces.flat(Infinity).filter((piece) => piece);
    this.#value = new Map(
      pieces.map((piece, i) => [piece, this.#viewPieces.value[i]])
    );
  }

  get value() {
    return this.#value;
  }

  get viewPieces() {
    return this.#viewPieces;
  }

  async movePiece({ move, piece }) {
    const viewPiece = this.value.get(piece);
    const viewRook = this.value.get(move.rook);

    if (move.pieceUnderBattle) {
      this.removePiece(move.pieceUnderBattle);
    }

    await Promise.all([
      viewPiece.coordinate(move),
      viewRook?.coordinate({ x: move.rook.x, y: move.rook.y }),
    ]);
  }

  removePiece(piece) {
    this.value.get(piece).remove();
    this.value.delete(piece);
  }

  async promotionChoice(oldPiece, newPiece) {
    const viewPiecePromotionChoice = this.value.get(oldPiece);
    viewPiecePromotionChoice.value = newPiece.constructor.name;
    this.value.delete(oldPiece);
    this.value.set(newPiece, viewPiecePromotionChoice);
  }
}
