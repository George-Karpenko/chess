import Figure from "../Figure.js";

export default class Pawn extends Figure {
  #isActivated = false;
  #directionMoveY = this.color === "w" ? -1 : 1;
  acceptableMoves(figures, eatenOnAisle) {
    let moves = [];

    let moveForward = (onCells = this.#directionMoveY) => {
      const figure = figures.find(
        (figure) => figure.x === this.x && figure.y === this.y + onCells
      );
      if (!figure) {
        moves.push({ x: this.x, y: this.y + onCells });
        return true;
      }
    };

    if (
      eatenOnAisle &&
      (eatenOnAisle.x === this.x - 1 || eatenOnAisle.x === this.x + 1) &&
      eatenOnAisle.y === this.y
    ) {
      moves.push({
        x: eatenOnAisle.x,
        y: eatenOnAisle.y + this.#directionMoveY,
      });
    }

    if (moveForward() && !this.#isActivated) {
      moveForward(this.#directionMoveY * 2);
    }

    const figuresCanBeEaten = figures.filter(
      (figure) =>
        (figure.x === this.x + 1 || figure.x === this.x - 1) &&
        figure.y === this.y + this.#directionMoveY &&
        figure.color !== this.color
    );
    figuresCanBeEaten.forEach((figure) => {
      moves.push({ x: figure.x, y: this.y + this.#directionMoveY });
    });
    return moves;
  }

  replaceFigure({ newFigure, classFigure }) {
    const figure = {
      figureContainer: this.figureContainer,
      color: this.color,
      value: newFigure,
      x: this.x,
      y: this.y,
    };
    return new classFigure(figure);
  }

  async move({ x, y, eatenOnAisle, figure }) {
    let isTakingOnPass =
      !this.#isActivated && Math.abs(this.y - y) === 2 ? true : false;
    this.#isActivated = true;
    if (eatenOnAisle && eatenOnAisle.x === x && this.y === eatenOnAisle.y) {
      figure = eatenOnAisle;
    }
    await super.move({ x, y, figure });
    if (isTakingOnPass) {
      return { eatenOnAisle: this };
    }
    if (this.y === 0 || this.y === 7) return { replaceFigure: true };
  }
}
