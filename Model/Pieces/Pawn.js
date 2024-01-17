import Piece from "../Piece.js";
import { GRID_SIZE } from "../../GlobalConst.js";

export default class Pawn extends Piece {
  #isActivated = false;
  #directionMoveY = this.color === "w" ? -1 : 1;
  possibleMoves() {
    const moves = [
      { x: this.x, y: this.y + this.#directionMoveY },
      { x: this.x - 1, y: this.y + this.#directionMoveY },
      { x: this.x + 1, y: this.y + this.#directionMoveY },
    ];
    if (!this.#isActivated) {
      moves.push({
        x: this.x,
        y: this.y + this.#directionMoveY * 2,
      });
    }
    return moves.filter(
      ({ x, y }) => x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE
    );
  }
  acceptableMoves({ gridPieces, eatenOnAisle }) {
    return this.possibleMoves().filter(({ x, y }) => {
      const piece = gridPieces[y][x];
      const pieceInFrontOfPawn = gridPieces[this.y + this.#directionMoveY][x];

      if (eatenOnAisle?.x === x && y - eatenOnAisle.y === this.#directionMoveY)
        return true;
      if (piece?.color === this.color) return false;
      if ((piece || pieceInFrontOfPawn) && x === this.x) return false;
      if (x !== this.x && !piece) return false;
      return true;
    });
  }

  move({ x, y, eatenOnAisle, gridPieces, removePiece }) {
    let isTakingOnPass = !this.#isActivated && Math.abs(this.y - y) === 2;
    this.#isActivated = true;
    if (eatenOnAisle?.y === this.y && x === eatenOnAisle.x) {
      removePiece({ x: eatenOnAisle.x, y: eatenOnAisle.y, gridPieces });
    }
    super.move({ x, y, gridPieces, removePiece });
    if (isTakingOnPass) {
      return { eatenOnAisle: this };
    }
  }
}
