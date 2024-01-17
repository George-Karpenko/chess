import ViewCell from "./ViewCell.js";

// TODO Нужен ли класс и если да, то как использовать
export default class ViewMove extends ViewCell {
  #isActive;

  constructor(cellElement, x, y) {
    super(cellElement, x, y);
  }

  get isActive() {
    return this.#isActive;
  }

  set isActive(value) {
    if (value) {
      this.cellElement.classList.add("active");
    } else {
      this.cellElement.classList.remove("active");
      this.cellElement.classList.remove("active__possible-capture");
    }
    this.#isActive = value;
  }

  addPossibleCapture() {
    this.cellElement.classList.add("active__possible-capture");
  }

  onClick() {
    return new Promise((resolve) => {
      this.cellElement.addEventListener(
        "click",
        () => {
          resolve({ x: this.x, y: this.y, isActive: this.#isActive });
        },
        { once: true }
      );
    });
  }
}
