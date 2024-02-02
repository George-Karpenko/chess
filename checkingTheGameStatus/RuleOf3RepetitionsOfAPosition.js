import AbstractCheck from "./AbstractCheck.js";

export default class RuleOf3RepetitionsOfAPosition extends AbstractCheck {
  #arrayPositions = [];
  #countPieces;
  #maximumNumberOfAPosition = 3;
  handle(data) {
    const { gridPieces, color, piece } = data;
    const newCountPieces = countPieces(gridPieces);
    const newPosition = pieces(gridPieces).toString();

    if (newCountPieces !== this.#countPieces) {
      this.#countPieces = newCountPieces;
      this.#arrayPositions = [];
    }

    if (piece?.constructor.name === "Pawn") {
      this.#arrayPositions = [];
    }

    const position = this.#arrayPositions.find(
      (position) => position.value === newPosition && position.color === color
    );

    if (position) {
      position.countPosition++;
    } else {
      this.#arrayPositions.push({
        value: newPosition,
        countPosition: 1,
        color,
      });
    }

    if (
      this.#arrayPositions.find(
        (position) => position.countPosition === this.#maximumNumberOfAPosition
      )
    ) {
      return {
        title: "Draw",
        text: "The position was repeated three times",
      };
    }

    return super.handle(data);
  }
}

function pieces(gridPieces) {
  return []
    .concat(...gridPieces)
    .map((piece) => piece?.constructor.name ?? null);
}

function countPieces(gridPieces) {
  return [].concat(...gridPieces).filter((piece) => piece).length;
}
