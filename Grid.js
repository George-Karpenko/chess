import Cell from "./Cell.js";
import Pawn from "./Figures/Pawn.js";
import Rook from "./Figures/Rook.js";
import Bishop from "./Figures/Bishop.js";
import Knight from "./Figures/Knight.js";
import King from "./Figures/King.js";
import Queen from "./Figures/Queen.js";

const GRID_SIZE = 8;
const GRID_SIZE_SQUARED = GRID_SIZE ** 2;
const CLASSES = {
  P: Pawn,
  R: Rook,
  N: Knight,
  B: Bishop,
  K: King,
  Q: Queen,
};

export default class Grid {
  #arrayCells = [];
  #figures;
  #figuresColor = {
    w: [],
    b: [],
  };
  #colorWhoseMove = "w";
  #gridElement;
  constructor(gridElement) {
    this.#gridElement = gridElement;
    const cellElements = createCellElements(this.#gridElement);
    cellElements.forEach((cellElement, index) => {
      const x = calculationX(index);
      const y = calculationY(index);
      if (!this.#arrayCells[x]) {
        this.#arrayCells.push([]);
      }
      this.#arrayCells[x].push(new Cell(cellElement, x, y));
    });
    this.gameStart();
  }

  get figures() {
    return this.#figures;
  }

  set figures(value) {
    this.#figures = value;
  }

  get figures() {
    return this.#figures;
  }

  set figures(value) {
    this.#figures = value;
  }

  set colorWhoseMove(value) {
    this.#colorWhoseMove = value;
  }

  get colorWhoseMove() {
    return this.#colorWhoseMove;
  }

  get arrayCells() {
    return this.#arrayCells;
  }

  figuresPush(value) {
    this.#figures.push(value);
  }

  gameEnd() {
    this.#figures.map((figure) => figure.remove());
    this.#figures = [];
    this.#colorWhoseMove = "w";
  }

  gameStart() {
    this.#figures = startingPosition(this.#gridElement, this.#arrayCells);
    // let figuresColor
    // this.#figures = this.#figures.map(figure => {
    //   let figuresColor[figure.color].push(figure)
    // });
    // this.#figuresColor = figuresColor;
  }

  withoutASpecificFigure({ x, y }, figures = this.#figures) {
    return figures.filter((figure) => !(figure.x === x && figure.y === y));
  }

  figuresByColor(color, figures = this.#figures) {
    return figures.filter((figure) => figure.color === color);
  }

  figureKingByColor(color) {
    return this.#figures.find(
      (figure) => figure.color === color && figure.value === "K"
    );
  }

  figuresCursore() {
    const myFigures = this.figuresByColor(this.#colorWhoseMove, this.#figures);
    this.#arrayCells.map((cells) =>
      cells.map((cell) => cell.cellElement.classList.remove("cursor-pointer"))
    );
    myFigures.map((figure) =>
      this.#arrayCells[figure.x][figure.y].cellElement.classList.add(
        "cursor-pointer"
      )
    );
  }

  oppositeСolor(value) {
    return value === "w" ? "b" : "w";
  }
}

function createCellElements(gridElement) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE_SQUARED; i++) {
    const cell = document.createElement("div");
    if (i % GRID_SIZE === GRID_SIZE - 1) {
      const digit = document.createElement("p");
      digit.classList.add("digit");
      digit.innerText = Math.ceil(i / GRID_SIZE);
      cell.append(digit);
    }
    if (i >= GRID_SIZE_SQUARED - GRID_SIZE) {
      const digit = document.createElement("p");
      digit.classList.add("character");
      digit.innerText = String.fromCharCode(Math.ceil(i % GRID_SIZE) + 97);
      cell.append(digit);
    }
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}

function calculationX(index) {
  return index % GRID_SIZE;
}
function calculationY(index) {
  return Math.floor(index / GRID_SIZE);
}

function startingPosition(gridElement) {
  const figures = [];
  function positionOfPieces(color, index, piece = "P") {
    const x = calculationX(index);
    const y = calculationY(index);
    figures.push(
      new CLASSES[piece]({
        figureContainer: gridElement,
        color,
        value: piece,
        x,
        y,
      })
    );
  }
  function positionOfHeavyPieces(startingIndex, finalIndex, color = "w") {
    for (let index = startingIndex; index < finalIndex; index++) {
      positionOfPieces(
        color,
        index,
        POSITION_OF_HEAVY_PIECES[index % GRID_SIZE]
      );
    }
  }
  function positionOfPawns(startingIndex, finalIndex, color = "w") {
    for (let index = startingIndex; index < finalIndex; index++) {
      positionOfPieces(color, index);
    }
  }
  const POSITION_OF_HEAVY_PIECES = ["R", "N", "B", "Q", "K", "B", "N", "R"];

  positionOfHeavyPieces(0, GRID_SIZE, "b");
  positionOfPawns(GRID_SIZE, GRID_SIZE * 2, "b");

  positionOfHeavyPieces(GRID_SIZE_SQUARED - GRID_SIZE, GRID_SIZE_SQUARED);
  positionOfPawns(
    GRID_SIZE_SQUARED - GRID_SIZE * 2,
    GRID_SIZE_SQUARED - GRID_SIZE
  );

  return figures;
}
