import ViewCell from "./ViewCell.js";

import { GRID_SIZE } from "../globalConst.js";

export default class ViewCells {
  #viewGridCells = [];
  #moves = [];

  constructor(gridElement) {
    this.#viewGridCells = createViewGridCells(gridElement);
  }

  get viewGridCells() {
    return this.#viewGridCells;
  }

  addMoves(moves) {
    this.#moves = moves;
    this.#moves.map((move) => {
      const cell = this.#viewGridCells[move.y][move.x];
      cell.isActive = true;
    });
  }

  async choiceCell() {
    const cellsMouseDown = this.#viewGridCells
      .flat(Infinity)
      .map((cell) => cell.onMouseDown());
    const cellsMouseUp = this.#viewGridCells
      .flat(Infinity)
      .map((cell) => cell.onMouseUp());
    return await Promise.any([...cellsMouseUp, ...cellsMouseDown]);
  }

  removeMoves() {
    if (!this.#moves.length) return;
    this.#moves.map((move) => {
      const cell = this.#viewGridCells[move.y][move.x];
      cell.isActive = false;
    });
    this.#moves = [];
  }
}

function createViewGridCells(gridElement) {
  return [...Array(GRID_SIZE).keys()].map((y) => {
    return [...Array(GRID_SIZE).keys()].map((x) => {
      const viewCell = document.createElement("div");
      if ((x + y) % 2 !== 0) viewCell.classList.add("black");
      viewCell.classList.add("cell");
      gridElement.append(viewCell);
      return new ViewCell(viewCell, x, y);
    });
  });
}
