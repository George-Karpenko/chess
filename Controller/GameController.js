import GameEnd from "../checkingTheGameStatus/GameEnd.js";

export default class GameController {
  #eatenOnAisle;
  #blackPlayer;
  #whitePlayer;
  #gridPieces;
  #gameEnd;
  #isColorPlayerWhite = true;
  constructor({ blackPlayer, whitePlayer, gridPieces }) {
    this.#blackPlayer = blackPlayer;
    this.#whitePlayer = whitePlayer;
    this.#gridPieces = gridPieces;
    this.#gameEnd = new GameEnd({
      gridPieces: this.#gridPieces,
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
      gridPieces: this.#gridPieces,
      isAMove: !this.#isColorPlayerWhite ? "b" : "w",
      // piece: this.piece,
      eatenOnAisle: this.#eatenOnAisle,
    });
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
