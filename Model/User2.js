export default class User {
  #color;
  #pieces;
  #viewMoves;
  #viewPromotionChoice;
  #cloneViewPiece;
  #viewPiece;

  constructor({ color, pieces, viewMoves, viewPromotionChoice }) {
    this.#color = color;
    this.#pieces = pieces;
    this.#viewPromotionChoice = viewPromotionChoice;
    this.#viewMoves = viewMoves;
  }

  async getMove(eatenOnAisle) {
    const result = await this.clickOnCell(eatenOnAisle);
    return result;
  }

  async promotionChoice({ color, x }) {
    this.#viewPromotionChoice.create({ color, x });
    return await this.#viewPromotionChoice.choice();
  }

  async clickOnCell(eatenOnAisle, piece) {
    // console.log(await this.#viewMoves.choiceCell());
    const { x, y, isActive, event } = await this.#viewMoves.choiceCell();
    if (event.type === "mouseup") {
      if (this.#pieces.gridPieces[y][x] === piece) {
        return this.clickOnCell(eatenOnAisle, piece);
      }
      this.#viewMoves.removeMoves();
      if (isActive) {
        this.#viewMoves.viewMove({
          x,
          y,
          oldX: piece.x,
          oldY: piece.y,
        });
        document.onmousemove = null;
        this.#cloneViewPiece.remove();
        this.#viewPiece.pieceElement.classList.add("piece__fast-travel");
        const result = await this.#pieces.movePiece({
          piece,
          x,
          y,
          eatenOnAisle,
          promotionChoice: this.promotionChoice.bind(this),
        });
        this.#viewPiece.pieceElement.style.opacity = 1;
        this.#viewPiece.pieceElement.classList.remove("piece__fast-travel");
        return result;
      }
      return this.clickOnCell(eatenOnAisle);
    }

    if (this.#cloneViewPiece) {
      this.#cloneViewPiece.remove();
      document.onmousemove = null;
      this.#viewPiece.pieceElement.style.opacity = 1;
    }
    if (this.#pieces.gridPieces[y][x] === piece) {
      this.#viewMoves.removeMoves();
      return this.clickOnCell(eatenOnAisle);
    }

    if (!isActive) {
      piece = this.#pieces.gridPieces[y][x];
      if (!piece || piece.color !== this.#color) {
        return this.clickOnCell(eatenOnAisle);
      }
      this.#viewPiece = this.#pieces.mapPieces.get(piece);
      this.#cloneViewPiece = this.#viewPiece.pieceElement.cloneNode(true);
      this.#cloneViewPiece.classList.add("piece__drag");
      this.#viewPiece.pieceElement.style.opacity = 0.5;
      const body = document.querySelector("body");
      this.#cloneViewPiece.style.width =
        this.#viewPiece.pieceElement.offsetWidth + "px";
      this.#cloneViewPiece.style.height =
        this.#viewPiece.pieceElement.offsetHeight + "px";
      this.#cloneViewPiece.style.left =
        event.clientX - this.#viewPiece.pieceElement.offsetWidth / 2 + "px";
      this.#cloneViewPiece.style.top =
        event.clientY - this.#viewPiece.pieceElement.offsetHeight / 2 + "px";

      // this.#cloneViewPiece.style.position = "fixed";
      body.append(this.#cloneViewPiece);

      document.onmousemove = (event) => {
        this.#cloneViewPiece.style.left =
          event.clientX - this.#cloneViewPiece.offsetWidth / 2 + "px";
        this.#cloneViewPiece.style.top =
          event.clientY - this.#cloneViewPiece.offsetHeight / 2 + "px";
      };
    }
    this.#viewMoves.removeMoves();

    if (piece && isActive) {
      this.#viewMoves.viewMove({
        x,
        y,
        oldX: piece.x,
        oldY: piece.y,
      });
      return this.#pieces.movePiece({
        piece,
        x,
        y,
        eatenOnAisle,
        promotionChoice: this.promotionChoice.bind(this),
      });
    }

    piece = this.#pieces.gridPieces[y][x];

    if (!piece || piece.color !== this.#color) {
      return await this.clickOnCell(eatenOnAisle);
    }
    const moves = this.#pieces.addMoves(piece, eatenOnAisle);
    this.#viewMoves.addMoves(moves, this.#pieces.gridPieces);
    return await this.clickOnCell(eatenOnAisle, piece);
  }
}
