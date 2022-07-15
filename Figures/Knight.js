import Figure from "../Figure.js";
export default class Knight extends Figure {
  acceptableMoves(figures) {
    let checkMove = (moves, x, y) => {
      if (x < 0 || x > 7 || y < 0 || y > 7) return;
      if (
        figures.find(
          (figure) =>
            figure.x === x && figure.y === y && figure.color === this.color
        )
      )
        return;
      moves.push({ x, y });
    }

    let moves = [];

    checkMove(moves, this.x + 2, this.y + 1);
    checkMove(moves, this.x + 2, this.y - 1);
    checkMove(moves, this.x - 2, this.y + 1);
    checkMove(moves, this.x - 2, this.y - 1);

    checkMove(moves, this.x + 1, this.y + 2);
    checkMove(moves, this.x + 1, this.y - 2);
    checkMove(moves, this.x - 1, this.y + 2);
    checkMove(moves, this.x - 1, this.y - 2);

    return moves;
  }
}
