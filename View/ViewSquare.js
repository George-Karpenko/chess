import ViewBasePiece from "./ViewBasePiece.js";
import { GRID_SIZE, WHITE } from "../globalConst.js";

export default class ViewSquare {
  #viewPiece;
  #element;
  #x;
  #y;
  constructor({ squaresContainer, value, color, x, y }) {
    this.#x = x;
    this.#y = y;
    this.#element = document.createElement("div");
    this.#element.classList.add("square");
    this.#viewPiece = new ViewBasePiece({
      pieceContainer: this.#element,
      color,
      value,
    });
    this.#viewPiece.pieceElement.classList.add("piece__choice");
    this.#element.style.setProperty("--x", x);
    this.#element.style.setProperty("--y", y);
    squaresContainer.append(this.#element);
  }

  get viewPiece() {
    return this.#viewPiece;
  }

  get element() {
    return this.#element;
  }
  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }

  onClick() {
    return new Promise((resolve) => {
      this.#element.addEventListener(
        "click",
        () => {
          resolve({
            x: this.#x,
            y: this.viewPiece.color === WHITE ? 0 : GRID_SIZE - 1,
            color: this.viewPiece.color,
            value: this.viewPiece.value,
          });
        },
        { once: true }
      );
    });
  }
}
