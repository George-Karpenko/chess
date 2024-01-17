import { GRID_SIZE } from "../GlobalConst.js";
import SearchForAMove from "./SearchForAMove.js";

export default class Computer {
  #color;
  #pieces;
  #searchForAMove;
  #viewMoves;

  constructor({ color, pieces, viewMoves }) {
    this.#color = color;
    this.#pieces = pieces;
    this.#searchForAMove = new SearchForAMove();
    this.#viewMoves = viewMoves;
  }

  async getMove(eatenOnAisle) {
    const move = this.#searchForAMove.search(
      eatenOnAisle,
      this.#pieces.gridPieces,
      this.#color
    );
    // console.log(move);
    const piece = this.#pieces.gridPieces[move.pieceY][move.pieceX];
    const { x, y } = move.move;

    this.#viewMoves.viewMove({
      x,
      y,
      oldX: piece.x,
      oldY: piece.y,
    });

    return await this.#pieces.movePiece({
      piece,
      x,
      y,
      eatenOnAisle,
      promotionChoice: this.promotionChoice.bind(this),
    });
  }
  async promotionChoice({ color, x }) {
    const arr = ["Queen", "Knight", "Rook", "Bishop"];
    const rand = Math.floor(Math.random() * arr.length);
    return { color, value: arr[0], x, y: color === "w" ? 0 : GRID_SIZE - 1 };
  }
}
