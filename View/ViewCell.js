import { GRID_SIZE } from "../GlobalConst.js";

export default class ViewCell {
  #cellElement;
  #x;
  #y;
  #isActive;
  #resolve;

  constructor(cellElement, x, y) {
    creatingCoordinates(cellElement, x, y);
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
    this.cellElement.setAttribute("id", `y_${y}-x_${x}`);
    this.cellElement.addEventListener("mousedown", (event) => {
      this.#resolve({
        x: this.#x,
        y: this.#y,
        isActive: this.#isActive,
        event,
      });
    });
    this.cellElement.addEventListener("mouseup", (event) => {
      this.#resolve({
        x: this.#x,
        y: this.#y,
        isActive: this.#isActive,
        event,
      });
    });
    // this.cellElement.addEventListener("click", (event) => {
    //   this.#resolve({
    //     x: this.#x,
    //     y: this.#y,
    //     isActive: this.#isActive,
    //     event,
    //   });
    // });
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

  onPromise() {
    return new Promise((resolve) => (this.#resolve = resolve));
  }
}

function creatingCoordinates(cellElement, x, y) {
  if (x === GRID_SIZE - 1) {
    const symbol = Math.ceil(GRID_SIZE - y);
    creatingCoordinate(cellElement, "digit", symbol);
  }
  if (y === GRID_SIZE - 1) {
    const symbol = String.fromCharCode(Math.ceil(x) + "A".charCodeAt(0));
    creatingCoordinate(cellElement, "character", symbol);
  }

  function creatingCoordinate(element, classes, symbol) {
    const tagP = document.createElement("p");
    tagP.classList.add(classes);
    tagP.innerText = symbol;
    element.append(tagP);
  }
}
