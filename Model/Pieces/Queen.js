import Rook from "./Rook.js";
import Bishop from "./Bishop.js";
import Piece from "./Piece.js";

export default class Queen extends Piece {
  checkMovesBasedOnPieces({ gridPieces }) {
    return [
      ...Bishop.prototype.checkMovesBasedOnPieces.call(this, { gridPieces }),
      ...Rook.prototype.checkMovesBasedOnPieces.call(this, { gridPieces }),
    ];
  }

  checkMovesOnEmptyBoard() {
    return [
      ...Bishop.prototype.checkMovesOnEmptyBoard.bind(this),
      ...Rook.prototype.checkMovesOnEmptyBoard.bind(this),
    ];
  }
}
