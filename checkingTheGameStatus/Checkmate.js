import AbstractCheck from "./AbstractCheck.js";

export default class Checkmate extends AbstractCheck {
  handle(data) {
    const { isCheck, hasOpponentMoves, color } = data;
    if (hasOpponentMoves) {
      if (isCheck) {
        return { title: "Checkmate", text: `${color} victory` };
      }
    }
    return super.handle(data);
  }
}
