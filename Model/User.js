import replacePiece from "./promotionChoice.js";

export default class User {
  #color;
  #gridPieces;
  #mapPieces;
  #viewMoves;
  #viewPromotionChoice;
  #cloneViewPiece;
  #viewPiece;

  constructor({
    color,
    gridPieces,
    mapPieces,
    viewMoves,
    viewPromotionChoice,
  }) {
    this.#color = color;
    this.#gridPieces = gridPieces;
    this.#mapPieces = mapPieces;
    this.#viewPromotionChoice = viewPromotionChoice;
    this.#viewMoves = viewMoves;
  }

  async getMove(eatenOnAisle, gameEnd, isCheck) {
    const result = await this.clickOnCell(eatenOnAisle, isCheck);
    return result;
  }

  async promotionChoice({ color, x }) {
    this.#viewPromotionChoice.create({ color, x });
    return replacePiece(await this.#viewPromotionChoice.choice());
  }

  async clickOnCell(eatenOnAisle, isCheck, piece, moves) {
    const { x, y, isActive, event } = await this.#viewMoves.choiceCell();
    let move;
    if (moves && moves.length) {
      move = moves.find((move) => {
        if (move.x === x && move.y === y) return true;
      });
    }
    if (event.type === "mouseup") {
      if (this.#gridPieces.value[y][x] === piece) {
        this.#cloneViewPiece.remove();
        this.#viewPiece.pieceElement.style.opacity = 1;
        return this.clickOnCell(eatenOnAisle, isCheck, piece, moves);
      }
      this.#viewMoves.removeMoves();
      if (isActive) {
        document.onmousemove = null;
        this.#cloneViewPiece.remove();
        this.#viewPiece.pieceElement.classList.add("piece__fast-travel");
        this.#viewPiece.pieceElement.style.opacity = 1;
        this.#viewPiece.pieceElement.classList.remove("piece__fast-travel");
        return {
          move,
          piece,
        };
      }
      return this.clickOnCell(eatenOnAisle, isCheck, piece, moves);
    }

    if (this.#cloneViewPiece) {
      this.#cloneViewPiece.remove();
      document.onmousemove = null;
      this.#viewPiece.pieceElement.style.opacity = 1;
    }
    if (this.#gridPieces.value[y][x] === piece) {
      this.#viewMoves.removeMoves();
      return this.clickOnCell(eatenOnAisle, isCheck, piece, moves);
    }

    if (!isActive) {
      piece = this.#gridPieces.value[y][x];
      if (!piece || piece.color !== this.#color) {
        return this.clickOnCell(eatenOnAisle, isCheck, piece, moves);
      }
      this.#viewPiece = this.#mapPieces.value.get(piece);
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
      return {
        move,
        piece,
      };
    }

    piece = this.#gridPieces.value[y][x];

    if (!piece || piece.color !== this.#color) {
      return await this.clickOnCell(eatenOnAisle, isCheck, piece, moves);
    }
    moves = this.#gridPieces.addMoves(piece, eatenOnAisle, isCheck);
    this.#viewMoves.addMoves(moves, this.#gridPieces.value);
    return await this.clickOnCell(eatenOnAisle, isCheck, piece, moves);
  }
}
