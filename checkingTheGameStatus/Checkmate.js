import AbstractCheck from "./AbstractCheck.js";

import { triggerColor } from "../functions.js";

export default class Checkmate extends AbstractCheck {
  handle(date) {
    const { gridPieces, isAMove, eatenOnAisle } = date;
    const myPieces = colorPieces(gridPieces, isAMove);
    const enemyPieces = colorPieces(gridPieces, triggerColor(isAMove));
    const king = colorKing(gridPieces, triggerColor(isAMove));
    if (
      enemyPieces.every(
        (piece) =>
          !piece.acceptableMovesTODO({ gridPieces, eatenOnAisle }).length
      )
    ) {
      if (
        myPieces.some((piece) =>
          piece.acceptableMoves({ gridPieces, eatenOnAisle }).some((move) => {
            return move.x === king.x && move.y === king.y;
          })
        )
      ) {
        return { title: "Checkmate", text: `Победа ${isAMove}` };
      } else {
        return { title: "Stalemate", text: "Пат" };
      }
    }
    return super.handle(date);
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
