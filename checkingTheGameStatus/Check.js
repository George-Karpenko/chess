import { triggerColor, colorPieces, colorKing } from "../functions.js";

export function checkACheck(gridPieces, color, eatenOnAisle) {
  const enemyPieces = colorPieces(gridPieces, triggerColor(color));
  const king = colorKing(gridPieces, color);
  return !!~enemyPieces.findIndex((piece) => {
    return ~piece
      .checkMovesBasedOnPieces({ gridPieces, eatenOnAisle })
      .findIndex((move) => move.x === king?.x && move.y === king.y);
  });
}
