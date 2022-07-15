import Figure from "../Figure.js";
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
    checkMove(8, "x");
    checkMove(8, "y");
    return moves;
  }
  async move({ x, y, figure }) {
    await super.move({ x, y, figure });
    this.#isActivated = true;
  }
  async castling() {
    this.#isActivated = true;
    if (this.x === 0) {
      this.x = 3;
    }
    if (this.x === 7) {
      this.x = 5;
    }
    await this.waitForTransition();
  }

  get isActivated() {
    return this.#isActivated;
  }
}
