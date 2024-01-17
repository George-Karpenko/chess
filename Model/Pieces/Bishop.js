import Piece from "../Piece.js";
import { GRID_SIZE } from "../../globalConst.js";

export default class Bishop extends Piece {
  possibleMoves() {
    const moves = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      if (this.x === x) continue;
      let y = this.y + Math.abs(this.x - x);
      if (y < GRID_SIZE) {
        moves.push({ x, y });
      }
      y = this.y - Math.abs(this.x - x);
      if (y >= 0) {
        moves.push({ x, y });
      }
    }
    return moves;
  }
  acceptableMoves({ gridPieces }) {
    const moves = [];

    checkMove = checkMove.bind(this);

    checkMove(0, 0);
    checkMove(0, GRID_SIZE);
    checkMove(GRID_SIZE, 0);
    checkMove(GRID_SIZE, GRID_SIZE);

    return moves;

    function checkMove(lastX, lastY) {
      let index = 1;
      while (
        checkWhile(lastX, this.x, index) &&
        checkWhile(lastY, this.y, index)
      ) {
        const x = additionIndex(lastX, this.x, index);
        const y = additionIndex(lastY, this.y, index);
        const piece = gridPieces[y][x];
        if (piece?.color !== this.color) moves.push({ x, y });
        if (piece) break;
        moves.push({ x, y });
        index++;
      }

      function checkWhile(last, axis, index) {
        if (last === 0) {
          return axis - index >= last;
        }
        return axis + index < last;
      }

      function additionIndex(last, axis, index) {
        if (last === 0) {
          return axis - index;
        }
        return axis + index;
      }
    }
  }
}
