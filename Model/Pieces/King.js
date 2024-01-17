import Piece from "../Piece.js";
import { GRID_SIZE } from "../../globalConst.js";
import { checkACheck } from "../../checkingTheGameStatus/Check.js";

export default class King extends Piece {
  #isActivated = false;

  possibleMoves() {
    let moves = [
      { x: this.x - 1, y: this.y - 1 },
      { x: this.x - 1, y: this.y + 1 },
      { x: this.x + 1, y: this.y - 1 },
      { x: this.x + 1, y: this.y + 1 },
      { x: this.x, y: this.y - 1 },
      { x: this.x, y: this.y + 1 },
      { x: this.x + 1, y: this.y },
      { x: this.x - 1, y: this.y },
    ];
    moves = moves.filter(
      ({ x, y }) => x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE
    );
    if (!this.#isActivated) {
      moves.push({ x: this.x - 2, y: this.y });
      moves.push({ x: this.x + 2, y: this.y });
    }
    return moves;
  }

  acceptableMovesTODO({ gridPieces, eatenOnAisle }) {
    let moves = super.acceptableMovesTODO({ gridPieces, eatenOnAisle });
    const check = checkACheck(gridPieces, this.color, eatenOnAisle);
    if (this.#isActivated) {
      return moves;
    }
    const rooks = gridPieces
      .flat(Infinity)
      .filter(
        (myPiece) =>
          myPiece?.constructor.name === "Rook" &&
          myPiece.color === this.color &&
          !myPiece.isActivated
      );
    if (
      !~rooks.findIndex((rook) => rook.x === 0) ||
      !~moves.findIndex((move) => move.x + 1 === this.x && move.y === this.y) ||
      gridPieces[this.y][1] ||
      check
    ) {
      moves = moves.filter(
        (move) => !(move.x + 2 === this.x && move.y === this.y)
      );
    }
    if (
      !~rooks.findIndex((rook) => rook.x === GRID_SIZE - 1) ||
      !~moves.findIndex((move) => move.x - 1 === this.x && move.y === this.y) ||
      check
    ) {
      moves = moves.filter(
        (move) => !(move.x - 2 === this.x && move.y === this.y)
      );
    }
    return moves;
  }

  acceptableMoves({ gridPieces }) {
    return this.possibleMoves().filter(
      ({ x, y }) => gridPieces[y][x]?.color !== this.color
    );
  }

  move({ x, y, gridPieces, removePiece }) {
    let rook;
    if (!this.#isActivated && Math.abs(this.x - x) === 2) {
      const rooks = gridPieces
        .flat(Infinity)
        .filter(
          (myPiece) =>
            myPiece?.constructor.name === "Rook" &&
            myPiece.color === this.color &&
            !myPiece.isActivated
        );
      if (this.x > x) {
        rook = rooks.find((rook) => rook.x === 0);
      } else {
        rook = rooks.find((rook) => rook.x === GRID_SIZE - 1);
      }
    }
    super.move({ x, y, gridPieces, removePiece });
    this.#isActivated = true;
    if (rook) {
      gridPieces[rook.y][rook.x] = null;
      rook.castling();
      gridPieces[rook.y][rook.x] = rook;
    }
    return { rook };
  }
}
