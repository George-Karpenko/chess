import ViewBasePiece from "./ViewBasePiece.js";

export default class ViewPiece extends ViewBasePiece {
  #x;
  #y;
  #isActive;

  constructor({ pieceContainer, color, value, x, y }) {
    super({ pieceContainer, color, value });
    this.pieceElement.style.setProperty("--x", x);
    this.pieceElement.style.setProperty("--y", y);
    this.#x = x;
    this.#y = y;
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
    this.#isActive = value;
    if (this.#isActive) {
      this.pieceElement.classList.add("active");
      return;
    }
    this.pieceElement.classList.remove("active");
  }

  remove() {
    this.pieceElement.remove();
  }

  async coordinate({ x, y }) {
    this.#x = x;
    this.#y = y;
    this.pieceElement.style.setProperty("--x", x);
    this.pieceElement.style.setProperty("--y", y);
    await this.waitForTransition();
  }

  // movePiece() {
  //   return 
  // }

  waitForTransition() {
    return new Promise((resolve) => {
      this.pieceElement.addEventListener(
        "transitionend",
        () => {
          resolve();
        },
        {
          once: true,
        }
      );
    });
  }
}
