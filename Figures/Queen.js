import Rook from "./Rook.js";
import Bishop from "./Bishop.js";
import Figure from "../Figure.js";

export default class Queen extends Figure {
  acceptableMoves(figures) {
    return [
      ...Bishop.prototype.acceptableMoves.call(this, figures),
      ...Rook.prototype.acceptableMoves.call(this, figures),
    ];
  }
}
