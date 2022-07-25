import Figure from "../Figure.js";
import GlobalConst from "../GlobalConst.js";
export default class Rook extends Figure {
  #isActivated = false;
  acceptableMoves(figures) {
    let moves = [];

    let checkMove = (last, coor) => {
      let checkWhile = (last, coor, index) => {
        const checkCoor = coor === "x" ? this.x : this.y;
        if (last === 0) return checkCoor - index >= last;
        return checkCoor + index < last;
      };
      let additionIndex = (last, coor, index) => {
        const coors = { x: this.x, y: this.y };
        if (last === 0) {
          coors[coor] -= index;
        } else {
          coors[coor] += index;
        }
        return coors;
      };
      let index = 1;
      while (checkWhile(last, coor, index)) {
        const coors = additionIndex(last, coor, index);
        const figure = figures.find(
          (figure) => figure.x === coors.x && figure.y === coors.y
        );
        if (figure?.color !== this.color) moves.push(coors);
        if (figure) break;
        moves.push(coors);
        index++;
      }
    };

    checkMove(0, "x");
    checkMove(0, "y");
    checkMove(GlobalConst.GRID_SIZE, "x");
    checkMove(GlobalConst.GRID_SIZE, "y");
    return moves;
  }
  async move({ x, y, figure }) {
    await super.move({ x, y, figure });
    this.#isActivated = true;
  }
  async castling() {
    this.#isActivated = true;
    if (this.x === 0) {
      const rookPositionDuringCastling = 3
      this.x = rookPositionDuringCastling;
    }
    if (this.x === 7) {
      const rookPositionDuringCastling = 5
      this.x = rookPositionDuringCastling;
    }
    await this.waitForTransition();
  }

  get isActivated() {
    return this.#isActivated;
  }
}
