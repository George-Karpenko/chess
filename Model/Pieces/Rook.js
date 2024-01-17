import Piece from "../Piece.js";
import { GRID_SIZE } from "../../globalConst.js";

export default class Rook extends Piece {
  #isActivated = false;

  get isActivated() {
    return this.#isActivated;
  }

  possibleMoves() {
    const moves = [...Array(GRID_SIZE - 1).keys()].map((x) => {
      if (x >= this.x) {
        return { y: this.y, x: x + 1 };
      }
      return { y: this.y, x };
    });
    moves.concat(
      [...Array(GRID_SIZE - 1).keys()].map((y) => {
        if (y >= this.y) {
          return { x: this.x, y: y + 1 };
        }
        return { x: this.x, y };
      })
    );
    return moves;
  }

  acceptableMoves({ gridPieces }) {
    checkingMovesOnAStraightLine = checkingMovesOnAStraightLine.bind(this);
    return [
      ...checkingMovesOnAStraightLine(this.x - 1, -1, "y"),
      ...checkingMovesOnAStraightLine(this.x + 1, GRID_SIZE, "y"),
      ...checkingMovesOnAStraightLine(this.y - 1, -1, "x"),
      ...checkingMovesOnAStraightLine(this.y + 1, GRID_SIZE, "x"),
    ];

    function checkingMovesOnAStraightLine(start, end, staticAxis) {
      const moves = [];

      const dynamicAxis = staticAxis === "x" ? "y" : "x";
      const inc = start >= end ? -1 : 1;

      let piece;
      for (
        let dynamicAxisValue = start;
        dynamicAxisValue !== end;
        dynamicAxisValue += inc
      ) {
        const move = {};
        move[staticAxis] = this[staticAxis];
        move[dynamicAxis] = dynamicAxisValue;
        if (staticAxis === "y") {
          piece = gridPieces[this.y][dynamicAxisValue];
        } else {
          piece = gridPieces[dynamicAxisValue][this.x];
        }
        if (!piece) {
          moves.push(move);
          continue;
        }
        if (piece.color !== this.color) {
          moves.push(move);
        }
        break;
      }
      return moves;
    }
  }

  move({ x, y, gridPieces, removePiece }) {
    super.move({ x, y, gridPieces, removePiece });
    this.#isActivated = true;
  }

  castling() {
    this.#isActivated = true;
    if (this.x === 0) {
      const rookPositionDuringCastling = 3;
      this.x = rookPositionDuringCastling;
    }
    if (this.x === GRID_SIZE - 1) {
      const rookPositionDuringCastling = 5;
      this.x = rookPositionDuringCastling;
    }
  }
}
