import ViewSquares from "./ViewSquares.js";

export default class ViewPromotionChoice {
  #element;
  #viewSquares;
  constructor(element) {
    this.#element = element;
  }

  create({ color, x }) {
    const squaresContainer = document.createElement("div");
    this.#viewSquares = new ViewSquares(squaresContainer);
    this.#viewSquares.create({ color, x });
    this.#element.append(squaresContainer);
    this.#element.classList.add("visible");
  }
  async choice() {
    const result = await this.#viewSquares.choice();
    this.#element.classList.remove("visible");
    return result;
  }
}
