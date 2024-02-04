import { colorKing } from "../functions.js";

export function checkACheck(gridPieces, color) {
  const king = colorKing(gridPieces, color);
  return king.isCheck(gridPieces);
}
