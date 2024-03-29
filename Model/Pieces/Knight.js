import Piece from "./Piece.js";
import { GRID_SIZE } from "../../globalConst.js";

export default class Knight extends Piece {
  checkMovesOnEmptyBoard() {
    const moves = [
      // { x: this.x - 2, y: this.y - 1 },
      // { x: this.x - 2, y: this.y + 1 },
      // { x: this.x + 2, y: this.y - 1 },
      // { x: this.x + 2, y: this.y + 1 },
      // { x: this.x - 1, y: this.y - 2 },
      // { x: this.x - 1, y: this.y + 2 },
      // { x: this.x + 1, y: this.y - 2 },
      // { x: this.x + 1, y: this.y + 2 },
    ];
    // TODO Многие фигуры можно сделать так
    [-1, 1].forEach((x) =>
      [-1, 1].forEach((y) => {
        moves.push({ x: this.x + 2 * x, y: this.y + 1 * y });
        moves.push({ x: this.x + 1 * x, y: this.y + 2 * y });
      })
    );
    return moves.filter(
      ({ x, y }) => x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE
    );
  }

  checkMovesBasedOnPieces({ gridPieces }) {
    const moves = this.checkMovesOnEmptyBoard().filter(
      ({ x, y }) => gridPieces[y][x]?.color !== this.color
    );
    return moves.map((move) => {
      if (!gridPieces[move.y][move.x]) {
        return move;
      }
      return { ...move, pieceUnderBattle: gridPieces[move.y][move.x] };
    });
  }
}
