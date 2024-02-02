import { checkACheck } from "../../checkingTheGameStatus/Check.js";

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
    // gridPieces[piece.y][piece.x] = null;
  }

  move({ move, gridPieces }) {
    if (move?.pieceUnderBattle) {
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
      const cloneGridPieces = clone(gridPieces);
      const piece = cloneGridPieces[this.y][this.x];
      try {
        piece.move({ move: clone(move), gridPieces: cloneGridPieces });
      } catch (error) {
        console.log(piece);
        console.log(move);
      }
      return !checkACheck(cloneGridPieces, piece.color, eatenOnAisle);
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

function clone(obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object (functions are skipped)
  if (obj instanceof Object) {
    var copy = new obj.constructor({
      color: obj.color,
      x: obj.x,
      y: obj.y,
    });
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr) && !(obj[attr] instanceof Function))
        copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}
