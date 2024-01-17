import { checkACheck } from "../checkingTheGameStatus/Check.js";

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

  removePiece({ x, y, gridPieces }) {
    gridPieces[y][x] = null;
  }

  move({ x, y, gridPieces, removePiece = this.removePiece }) {
    gridPieces[this.y][this.x] = null;
    if (gridPieces[y][x]) {
      removePiece({ x, y, gridPieces });
    }
    this.x = x;
    this.y = y;
    gridPieces[y][x] = this;
  }

  acceptableMovesTODO({ gridPieces, eatenOnAisle }) {
    const moves = this.acceptableMoves({ gridPieces, eatenOnAisle });
    return moves.filter((move) => {
      const cloneGridPieces = clone(gridPieces);
      const piece = cloneGridPieces[this.y][this.x];
      piece.move({ x: move.x, y: move.y, gridPieces: cloneGridPieces });
      return !checkACheck(cloneGridPieces, piece.color, eatenOnAisle);
    });
  }

  acceptableMoves() {
    throw new Error('The "acceptableMoves" method has not been created');
  }

  possibleMoves() {
    throw new Error('The "possibleMoves" method has not been created');
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
      pieceContainer: null,
      color: obj.color,
      value: obj.value,
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
