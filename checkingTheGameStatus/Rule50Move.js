import AbstractCheck from "./AbstractCheck.js";

export default class Rule50Move extends AbstractCheck {
  #countMoves;
  #countPieces;
  #maximumNumberOfMovesForTwoPlayers = 100;
  handle(data) {
    // TODO piece нужно вычислять (
    const { gridPieces, piece } = data;
    const newCountPieces = countPieces(gridPieces);

    if (newCountPieces !== this.#countPieces) {
      this.#countPieces = newCountPieces;
      this.#countMoves = 0;
    }

    if (piece?.constructor.name === "Pawn") {
      this.#countMoves = 0;
    }

    this.#countMoves++;

    if (this.#countMoves === this.#maximumNumberOfMovesForTwoPlayers) {
      return { title: "Draw", text: "50 ходов без продвижения пешек" };
    }

    return super.handle(data);
  }
}

function countPieces(gridPieces) {
  return [].concat(...gridPieces).filter((piece) => piece).length;
}
