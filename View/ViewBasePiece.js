import { BASE_URL_IMAGES_OF_PIECES, WHITE, BLACK } from "../globalConst.js";

export default class ViewBasePiece {
  #pieceElement;
  #color;
  #value;

  constructor({ pieceContainer, color, value }) {
    this.#color = color;
    this.#value = value;
    this.#pieceElement = document.createElement("img");
    this.#pieceElement.classList.add("piece");
    this.#pieceElement.src = `${BASE_URL_IMAGES_OF_PIECES}${localStorage.getItem(
      "pieces"
    )}/${colorAdapter[color] + designationInRecord[value]}.png`;
    pieceContainer.append(this.#pieceElement);
  }

  get pieceElement() {
    return this.#pieceElement;
  }

  get color() {
    return this.#color;
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
    this.pieceElement.src = `${BASE_URL_IMAGES_OF_PIECES}${localStorage.getItem(
      "pieces"
    )}/${colorAdapter[this.color] + designationInRecord[value]}.png`;
  }

  remove() {
    this.#pieceElement.remove();
  }
}

const designationInRecord = {
  Pawn: "P",
  Bishop: "B",
  King: "K",
  Knight: "N",
  Queen: "Q",
  Rook: "R",
};

const colorAdapter = (() => {
  const result = {};
  result[WHITE] = "w";
  result[BLACK] = "b";
  return result;
})();
