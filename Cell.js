// import Pawn from "./Pieces/Pawn.js";
export default class Cell {
  #cellElement;
  #x;
  #y;
  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get cellElement() {
    return this.#cellElement;
  }
}
