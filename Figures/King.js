import Figure from "../Figure.js";
import GlobalConst from "../GlobalConst.js";
export default class King extends Figure {
  #isActivated = false;
  #rooks;
  acceptableMoves(figures) {
    let castling = () => {
      let isPunchFiguresField = (addToX) =>
        !~figures.findIndex(
          (figure) =>
            figure.color !== this.color &&
            !!~figure
              .acceptableMoves(figures)
              .findIndex(
                (move) =>
                  (this.x === move.x ||
                    this.x + addToX === move.x ||
                    this.x + addToX * 2 === move.x) &&
                  this.y === move.y
              )
        );
      this.#rooks = figures.filter(
        (myFigure) =>
          myFigure.value === "R" &&
          myFigure.color === this.color &&
          !myFigure.isActivated &&
          !~figures.findIndex(
            (figure) =>
              figure.y === this.y &&
              ((figure.x > myFigure.x && figure.x < this.x) ||
                (figure.x < myFigure.x && figure.x > this.x))
          )
      );
      this.#rooks.map((rook) => {
        if (
          rook.value === "R" &&
          rook.color === this.color &&
          !rook.isActivated &&
          !~figures.findIndex(
            (figure) =>
              figure.y === this.y &&
              ((figure.x > rook.x && figure.x < this.x) ||
                (figure.x < rook.x && figure.x > this.x))
          )
        ) {
          let addToX = rook.x < this.x ? -1 : 1;
          if (isPunchFiguresField(addToX)) {
            moves.push({ x: this.x + addToX * 2, y: this.y });
          }
        }
      });
    };
    let checkMove = (x, y) => {
      if (x < 0 || x >= GlobalConst.GRID_SIZE || y < 0 || y >= GlobalConst.GRID_SIZE) return;
      if (
        ~figures.findIndex(
          (figure) =>
            figure.x === x && figure.y === y && figure.color === this.color
        )
      ) {
        return;
      }
      if (
        ~figures.findIndex(
          (figure) =>
            figure.color !== this.color &&
            !!~figure
              .acceptableMoves(figures)
              .findIndex(
                (move) =>
                  x === move.x &&
                  y === move.y &&
                  !(figure.value === "P" && move.x === figure.x)
              )
        )
      ) {
        return;
      }
      moves.push({ x, y });
    };
    let moves = [];

    // TODO Нужно добавить переменные enemyFigures myFigures

    checkMove(this.x + 1, this.y + 1);
    checkMove(this.x + 1, this.y - 1);
    checkMove(this.x - 1, this.y + 1);
    checkMove(this.x - 1, this.y - 1);

    checkMove(this.x, this.y + 1);
    checkMove(this.x, this.y - 1);
    checkMove(this.x - 1, this.y);
    checkMove(this.x + 1, this.y);

    if (!this.#isActivated) {
      castling();
    }

    return moves;
  }

  async move({ x, y, figure }) {
    let castling;
    if (!this.#isActivated && Math.abs(this.x - x) === 2) {
      if (this.x > x) {
        let rook = this.#rooks.find((rook) => rook.x === 0);
        castling = rook.castling();
      } else {
        let rook = this.#rooks.find((rook) => rook.x === GlobalConst.GRID_SIZE - 1);
        castling = rook.castling();
      }
    }
    await super.move({ x, y, figure });
    await castling
    this.#isActivated = true;
  }
}
