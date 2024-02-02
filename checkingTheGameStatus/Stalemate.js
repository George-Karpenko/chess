import AbstractCheck from "./AbstractCheck.js";

export default class Checkmate extends AbstractCheck {
  handle(data) {
    const { isCheck, hasOpponentMoves } = data;
    if (hasOpponentMoves) {
      if (!isCheck) {
        return { title: "Draw", text: "Stalemate" };
      }
    }
    return super.handle(data);
  }
}
