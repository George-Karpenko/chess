export default class User {
  #color;
  #pieces;
  #viewMoves;
  #piece;
  #resolve;
  #eatenOnAisle;
  #myViewPieces;
  #isMyMove;
  #viewPromotionChoice;
  #viewOldPiece;

  constructor({ color, pieces, viewMoves, viewPromotionChoice }) {
    this.#color = color;
    this.#pieces = pieces;
    this.#viewPromotionChoice = viewPromotionChoice;
    this.#myViewPieces = this.#pieces.viewPieces.value.filter(
      (viewPiece) => viewPiece.color === this.#color
    );
    this.#viewMoves = viewMoves;
    this.clickOnPiece();
  }

  async getMove(eatenOnAisle) {
    this.#isMyMove = true;
    this.#myViewPieces.forEach((myViewPiece) => {
      myViewPiece.isCursorPointer = true;
    });
    this.#eatenOnAisle = eatenOnAisle;
    const result = await new Promise((resolve) => (this.#resolve = resolve));
    return result;
  }

  async promotionChoice({ color, x }) {
    this.#viewPromotionChoice.create({ color, x });
    return await this.#viewPromotionChoice.choice();
  }

  async clickOnPiece() {
    this.#myViewPieces.forEach((viewPiece) => {
      viewPiece.pieceElement.addEventListener("click", async () => {
        if (!this.#isMyMove) return;

        this.#viewMoves.removeMoves();

        if (viewPiece.isActive) {
          viewPiece.isActive = false;
          this.#piece = null;
          return;
        }

        if (this.#viewOldPiece) {
          this.#viewOldPiece.isActive = false;
        }

        this.#piece = this.#pieces.gridPieces[viewPiece.y][viewPiece.x];
        viewPiece.isActive = true;

        const moves = this.#pieces.addMoves(this.#piece, this.#eatenOnAisle);
        this.#viewMoves.addMoves(moves, this.#pieces.gridPieces);
        this.#viewOldPiece = viewPiece;

        await this.clickOnCell(viewPiece);
      });
    });
  }
  async clickOnCell(viewPiece) {
    const { x, y, isActive } = await this.#viewMoves.choiceCell();
    if (isActive) {
      this.#viewMoves.removeMoves();
      this.#myViewPieces.forEach((myViewPiece) => {
        myViewPiece.isCursorPointer = false;
      });
      this.#isMyMove = false;
      this.#viewMoves.viewMove({
        x,
        y,
        oldX: this.#piece.x,
        oldY: this.#piece.y,
      });
      this.#resolve(
        this.#pieces.movePiece({
          piece: this.#piece,
          x,
          y,
          eatenOnAisle: this.#eatenOnAisle,
          promotionChoice: this.promotionChoice.bind(this),
        })
      );
    }
    this.#viewMoves.removeMoves();
    this.#piece = null;
    viewPiece.isActive = false;
  }
}
