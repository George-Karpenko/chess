import ViewCells from "./ViewCells.js";

export default class ViewMoves extends ViewCells {
  #moves = [];
  #oldMove;

  constructor(gridElement) {
    super(gridElement);
  }

  addMoves(moves, gridPieces) {
    this.#moves = moves;
    this.#moves.map((move) => {
      const cell = this.viewGridCells[move.y][move.x];
      const piece = gridPieces[move.y][move.x];
      cell.isActive = true;
      if (piece) {
        cell.addPossibleCapture();
      }
    });
  }

  removeMoves() {
    if (!this.#moves.length) return;
    this.#moves.map((move) => {
      const cell = this.viewGridCells[move.y][move.x];
      cell.isActive = false;
    });
    this.#moves = [];
  }

  viewMove({ move, piece }) {
    const cell = this.viewGridCells[piece.y][piece.x];
    const oldCell = this.viewGridCells[move.y][move.x];
    if (this.#oldMove) {
      this.removeClassMove(this.#oldMove.cell);
      this.removeClassMove(this.#oldMove.oldCell);
    }
    this.addClassMove(cell);
    this.addClassMove(oldCell);
    this.#oldMove = { cell, oldCell };
  }

  removeOldMove() {
    this.removeClassMove(this.#oldMove.cell);
    this.removeClassMove(this.#oldMove.oldCell);
    this.#oldMove = null;
  }

  addClassMove(cell) {
    cell.cellElement.classList.add("move");
  }

  removeClassMove(cell) {
    cell.cellElement.classList.remove("move");
  }
}
