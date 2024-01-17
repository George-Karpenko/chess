import Rook from "./Rook.js";
import Bishop from "./Bishop.js";
import Piece from "../Piece.js";

export default class Queen extends Piece {
  acceptableMoves({ gridPieces }) {
    return [
      ...Bishop.prototype.acceptableMoves.call(this, { gridPieces }),
      ...Rook.prototype.acceptableMoves.call(this, { gridPieces }),
    ];
  }

  possibleMoves() {
    return [
      ...Bishop.prototype.possibleMoves.bind(this),
      ...Rook.prototype.possibleMoves.bind(this),
    ];
  }
}
