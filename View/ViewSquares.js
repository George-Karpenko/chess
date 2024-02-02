import { GRID_SIZE } from "./../globalConst.js";
import ViewSquare from "./ViewSquare.js";

export default class ViewSquares {
  #arraySquares = [];
  #squaresContainer;

  constructor(squaresContainer) {
    this.#squaresContainer = squaresContainer;
  }
  create({ color, x }) {
    ["Queen", "Knight", "Rook", "Bishop"].forEach((value, y) => {
      this.#arraySquares.push(
        new ViewSquare({
          squaresContainer: this.#squaresContainer,
          value,
          color,
          x,
          y: getY(color, y),
        })
      );
    });
    this.#arraySquares.forEach((square) => {
      this.#squaresContainer.append(square.element);
    });
  }

  async choice() {
    const squares = [];
    this.#arraySquares.flat(Infinity).forEach((square) => {
      squares.push(square.onClick());
    });
    const result = await Promise.any(squares);
    this.#squaresContainer.remove();
    return result;
  }
}

function getY(color, y) {
  return color === BLACK ? GRID_SIZE - y - 1 : y;
}
