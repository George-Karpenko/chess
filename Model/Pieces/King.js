import Piece from "./Piece.js";
import { GRID_SIZE } from "../../globalConst.js";
import { checkACheck } from "../../checkingTheGameStatus/Check.js";
import pieces from "./index.js";

export default class King extends Piece {
  #isActivated = false;

  get isActivated() {
    return this.#isActivated;
  }

  checkMovesOnEmptyBoard() {
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
    if (!this.isActivated) {
      moves.push({ x: this.x - 2, y: this.y });
      moves.push({ x: this.x + 2, y: this.y });
    }
    return moves;
  }

  checkMovesBasedOnPieces({ gridPieces, isCheck }) {
    let moves = this.checkMovesOnEmptyBoard({ gridPieces }).filter(
      ({ x, y }) => gridPieces[y][x]?.color !== this.color
    );
    moves = moves.map((move) => {
      if (!gridPieces[move.y][move.x]) {
        return move;
      }
      return { ...move, pieceUnderBattle: gridPieces[move.y][move.x] };
    });
    if (this.isActivated) {
      return moves;
    }
    if (isCheck) {
      return moves.filter((move) => Math.abs(this.x - move.x) !== 2);
    }
    const rooks = gridPieces
      .flat(Infinity)
      .filter(
        (piece) =>
          piece?.constructor.name === "Rook" &&
          piece.color === this.color &&
          !piece.isActivated
      );
    removesCastling.bind(this)(rooks);
    return moves;

    function removesCastling(rooks) {
      const removeMove = (rookX, moveX, isPiece = false) => {
        const rook = rooks.find((rook) => rook.x === rookX);
        if (
          isPiece ||
          !~moves.findIndex(
            (move) => move.x === (this.x + moveX) / 2 && move.y === this.y
          ) ||
          !rook
        ) {
          moves = moves.filter((move) => move.x !== moveX);
          return;
        }
        moves = moves.map((move) => {
          if (move.x !== moveX) {
            return move;
          }
          return { ...move, rook };
        });
      };
      removeMove(0, this.x - 2, gridPieces[this.y][1]);
      removeMove(GRID_SIZE - 1, this.x + 2);
    }
  }

  move({ move, gridPieces }) {
    super.move({ move, gridPieces });
    this.#isActivated = true;
    if (move.rook && Object.entries(move.rook).length !== 0) {
      console.log(move.rook);
      move.rook.castling(gridPieces);
    }
  }

  isCheck(gridPieces) {
    const isCheckPieceBindThis = isCheckPiece.bind(this);
    if (isCheckPieceBindThis("Knight", gridPieces)) return true;
    if (isCheckPieceBindThis("Rook", gridPieces, "Queen")) return true;
    if (isCheckPieceBindThis("Bishop", gridPieces, "Queen")) return true;
    if (isCheckPieceBindThis("King", gridPieces)) return true;
    if (isCheckPieceBindThis("Pawn", gridPieces)) return true;
    return false;
  }
}

function isCheckPiece(namePiece, gridPieces, additionalNameForVerification) {
  const piece = new pieces[namePiece](this);
  const moves = piece.checkMovesBasedOnPieces({
    gridPieces,
  });
  if (
    moves.some((move) => {
      const piece = move.pieceUnderBattle;
      if (!piece) return false;
      return (
        (piece.constructor.name === namePiece ||
          piece.constructor.name === additionalNameForVerification) &&
        piece.color !== this.color
      );
    })
  ) {
    return true;
  }
  return false;
}
