import Piece from "./Piece.js";
import { GRID_SIZE, WHITE } from "../../globalConst.js";

export default class Pawn extends Piece {
  #isActivated = false;
  #directionMoveY = this.color === WHITE ? -1 : 1;

  constructor({ color, x, y }) {
    super({ color, x, y });
    if (JSON.parse(localStorage.getItem("whitePlayerIsAManPlayingForBlack"))) {
      this.#directionMoveY *= -1;
    }
  }

  checkMovesOnEmptyBoard() {
    let isPromotionChoice = false;
    if (
      this.y + this.#directionMoveY === 0 ||
      this.y + this.#directionMoveY === GRID_SIZE - 1
    ) {
      isPromotionChoice = true;
    }
    const moves = [
      { x: this.x, y: this.y + this.#directionMoveY, isPromotionChoice },
      { x: this.x - 1, y: this.y + this.#directionMoveY, isPromotionChoice },
      { x: this.x + 1, y: this.y + this.#directionMoveY, isPromotionChoice },
    ];
    if (!this.#isActivated) {
      moves.push({
        x: this.x,
        y: this.y + this.#directionMoveY * 2,
        eatenOnAisle: this,
      });
    }
    return moves.filter(
      ({ x, y }) => x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE
    );
  }
  checkMovesBasedOnPieces({ gridPieces, eatenOnAisle }) {
    const moves = this.checkMovesOnEmptyBoard().filter(({ x, y }) => {
      const piece = gridPieces[y][x];
      const pieceInFrontOfPawn = gridPieces[this.y + this.#directionMoveY][x];

      if (eatenOnAisle?.x === x && y - eatenOnAisle.y === this.#directionMoveY)
        return true;
      if (piece?.color === this.color) return false;
      if ((piece || pieceInFrontOfPawn) && x === this.x) return false;
      if (x !== this.x && !piece) return false;
      return true;
    });
    return moves.map((move) => {
      if (move.x === this.x) return move;
      if (gridPieces[move.y][move.x]) {
        return { ...move, pieceUnderBattle: gridPieces[move.y][move.x] };
      }
      return { ...move, pieceUnderBattle: eatenOnAisle };
    });
  }

  move({ move, gridPieces }) {
    this.#isActivated = true;
    super.move({ move, gridPieces });
  }
}
