import { GRID_SIZE } from "../globalConst.js";

export default class ViewCell {
  #cellElement;
  #x;
  #y;
  #isActive;

  constructor(cellElement, x, y) {
    creatingCoordinates(cellElement, x, y);
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get cellElement() {
    return this.#cellElement;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get isActive() {
    return this.#isActive;
  }

  set isActive(value) {
    if (value) {
      this.cellElement.classList.add("active");
    } else {
      this.cellElement.classList.remove("active");
      this.cellElement.classList.remove("active__possible_capture");
    }
    this.#isActive = value;
  }

  addPossibleCapture() {
    this.cellElement.classList.add("active__possible_capture");
  }

  onMouseDown() {
    return new Promise((resolve) => {
      this.cellElement.addEventListener(
        "mousedown",
        (event) => {
          resolve({
            x: this.#x,
            y: this.#y,
            isActive: this.#isActive,
            event,
          });
        },
        { once: true }
      );
    });
  }

  onMouseUp() {
    return new Promise((resolve) => {
      this.cellElement.addEventListener(
        "mouseup",
        (event) => {
          resolve({
            x: this.#x,
            y: this.#y,
            isActive: this.#isActive,
            event,
          });
        },
        { once: true }
      );
    });
  }
}

function creatingCoordinates(cellElement, x, y) {
  if (x === GRID_SIZE - 1) {
    let symbol = GRID_SIZE - y;
    if (JSON.parse(localStorage.getItem("whitePlayerIsAManPlayingForBlack"))) {
      symbol = y + 1;
    }

    creatingCoordinate(cellElement, "digit", symbol);
  }
  if (y === GRID_SIZE - 1) {
    let symbol = String.fromCharCode(x + "A".charCodeAt(0));
    if (JSON.parse(localStorage.getItem("whitePlayerIsAManPlayingForBlack"))) {
      symbol = String.fromCharCode(GRID_SIZE - x - 1 + "A".charCodeAt(0));
    }
    creatingCoordinate(cellElement, "character", symbol);
  }

  function creatingCoordinate(element, classes, symbol) {
    const tagP = document.createElement("p");
    tagP.classList.add(classes);
    tagP.innerText = symbol;
    element.append(tagP);
  }
}
