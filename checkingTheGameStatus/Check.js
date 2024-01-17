import { triggerColor } from "../functions.js";

export function checkACheck(gridPieces, isAMove, eatenOnAisle) {
  const enemyPieces = colorPieces(triggerColor(isAMove));
  const king = colorKing(isAMove);
  return !!~enemyPieces.findIndex((piece) => {
    return ~piece
      .acceptableMoves({ gridPieces, eatenOnAisle })
      .findIndex((move) => move.x === king.x && move.y === king.y);
  });
  function colorPieces(color) {
    return [].concat(...gridPieces).filter((piece) => piece?.color === color);
  }

  function colorKing(color) {
    return []
      .concat(...gridPieces)
      .find(
        (piece) => piece?.constructor.name === "King" && piece.color === color
      );
  }
}
