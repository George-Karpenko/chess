import Figure from "../Figure.js";
export default class Bishop extends Figure {
  acceptableMoves(figures) {
    let moves = [];

    let checkMove = (lastX, lastY) => {
      let checkWhile = (last, coor, index) => {
        if (last === 0) {
          return coor - index >= last;
        }
        return coor + index < last;
      };
      let additionIndex = (last, coor, index) => {
        if (last === 0) {
          return coor - index;
        }
        return coor + index;
      }
      let index = 1;
      while (checkWhile(lastX, this.x, index) && checkWhile(lastY, this.y, index)) {
        const x = additionIndex(lastX, this.x, index);
        const y = additionIndex(lastY, this.y, index);
        const figure = figures.find((figure) => figure.x === x && figure.y === y);
        if (figure?.color !== this.color) moves.push({ x, y });
        if (figure) break;
        moves.push({ x, y });
        index++
      }
    };

    checkMove(0, 0)
    checkMove(0, 8)
    checkMove(8, 0)
    checkMove(8, 8)

    return moves;
  }
}
