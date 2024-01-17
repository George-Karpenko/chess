import GameEnd from "../checkingTheGameStatus/GameEnd.js";
import { checkACheck } from "../checkingTheGameStatus/Check.js";

export default class GameController {
  #eatenOnAisle;
  #blackPlayer;
  #whitePlayer;
  #mapPieces;
  #gameEnd;
  #isColorPlayerWhite = true;
  #viewKingIsUnderCheck;
  constructor({ blackPlayer, whitePlayer, mapPieces }) {
    this.#blackPlayer = blackPlayer;
    this.#whitePlayer = whitePlayer;
    this.#mapPieces = mapPieces;
    this.#gameEnd = new GameEnd({
      gridPieces: this.#mapPieces.gridPieces,
      isAMove: "b",
    });
  }

  async start() {
    if (this.#isColorPlayerWhite) {
      this.#eatenOnAisle = await this.#whitePlayer.getMove(this.#eatenOnAisle);
    } else {
      this.#eatenOnAisle = await this.#blackPlayer.getMove(this.#eatenOnAisle);
    }
    const result = this.#gameEnd.choice({
      gridPieces: this.#mapPieces.gridPieces,
      isAMove: !this.#isColorPlayerWhite ? "b" : "w",
      // piece: this.piece,
      eatenOnAisle: this.#eatenOnAisle,
    });
    if (this.#viewKingIsUnderCheck) {
      this.#viewKingIsUnderCheck.classList.remove("king-is-under-check");
      this.#viewKingIsUnderCheck = null;
    }
    if (
      checkACheck(
        this.#mapPieces.gridPieces,
        this.#isColorPlayerWhite ? "b" : "w",
        this.#eatenOnAisle
      )
    ) {
      const color = this.#isColorPlayerWhite ? "b" : "w";
      const kingIsUnderCheck = this.#mapPieces.gridPieces
        .flat(Infinity)
        .find((piece) => {
          console.log(piece.constructor.name);
          if (piece.constructor.name === "King" && piece.color === color) {
            return piece;
          }
        });
      this.#viewKingIsUnderCheck =
        this.#mapPieces.mapPieces.get(kingIsUnderCheck).pieceElement;
      this.#viewKingIsUnderCheck.classList.add("king-is-under-check");
    }

    if (result) {
      return result;
    }
    this.triggerIsColorPlayerWhite();

    return await this.start();
  }
  triggerIsColorPlayerWhite() {
    this.#isColorPlayerWhite = !this.#isColorPlayerWhite;
  }
}
