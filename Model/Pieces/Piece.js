import { checkACheck } from "../../checkingTheGameStatus/Check.js";
import { cloneArrayGridPieces, deepClone } from "../../functions.js";

export default class Piece {
  #x;
  #y;
  #color;

  constructor({ color, x, y }) {
    this.#color = color;
    this.x = x;
    this.y = y;
  }

  get color() {
    return this.#color;
  }
  set x(value) {
    this.#x = value;
  }
  get x() {
    return this.#x;
  }
  set y(value) {
    this.#y = value;
  }
  get y() {
    return this.#y;
  }

  takingAPiece(piece, gridPieces) {
    delete gridPieces[piece.y][piece.x];
  }

  move({ move, gridPieces }) {
    // TODO пустой объект вообще передаваться не должен
    if (
      move?.pieceUnderBattle &&
      Object.entries(move.pieceUnderBattle).length !== 0
    ) {
      console.log(move?.pieceUnderBattle);
      this.takingAPiece(move.pieceUnderBattle, gridPieces);
    }
    gridPieces[this.y][this.x] = null;
    this.x = move.x;
    this.y = move.y;
    gridPieces[this.y][this.x] = this;
  }

  checkMoves({ gridPieces, eatenOnAisle, isCheck }) {
    const moves = this.checkMovesBasedOnPieces({
      gridPieces,
      eatenOnAisle,
      isCheck,
    });
    return moves.filter((move) => {
      const copyGridPieces = cloneArrayGridPieces(gridPieces);
      const piece = copyGridPieces[this.y][this.x];
      piece.move({ move: deepClone(move), gridPieces: copyGridPieces });
      return !checkACheck(copyGridPieces, piece.color, eatenOnAisle);
    });
  }

  checkMovesBasedOnPieces() {
    throw new Error(
      'The "checkMovesBasedOnPieces" method has not been created'
    );
  }

  checkMovesOnEmptyBoard() {
    throw new Error('The "checkMovesOnEmptyBoard" method has not been created');
  }
}
