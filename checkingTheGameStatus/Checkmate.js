import AbstractCheck from "./AbstractCheck.js";

import { triggerColor } from "../functions.js";

export default class Checkmate extends AbstractCheck {
  handle(data) {
    const { gridPieces, isAMove, eatenOnAisle, isCheck } = data;
    const enemyPieces = colorPieces(gridPieces, triggerColor(isAMove));
    if (
      enemyPieces.every(
        (piece) => !piece.checkMoves({ gridPieces, eatenOnAisle }).length
      )
    ) {
      if (isCheck) {
        return { title: "Checkmate", text: `Победа ${isAMove}` };
      } else {
        return { title: "Draw", text: "Пат" };
      }
    }
    return super.handle(data);
  }
}

function colorPieces(gridPieces, color) {
  return [].concat(...gridPieces).filter((piece) => piece?.color === color);
}

function colorKing(gridPieces, color) {
  return []
    .concat(...gridPieces)
    .find(
      (piece) => piece?.constructor.name === "King" && piece.color === color
    );
}
