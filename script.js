import Grid from "./Grid.js";

import Rook from "./Figures/Rook.js";
import Bishop from "./Figures/Bishop.js";
import Knight from "./Figures/Knight.js";
import Queen from "./Figures/Queen.js";

import localeRU from "./locale/ru.js";
const CLASSES = {
  R: Rook,
  N: Knight,
  B: Bishop,
  Q: Queen,
};

// TODO
// Проверить название переменных

const gameBoard = document.getElementById("game-board");
const modal = document.getElementById("modal");
const DRAW_AT = {
  moves: 100,
  repeatingAPosition: 3,
};

const grid = new Grid(gameBoard);

let moves = [];
let positionsOfFigures = [];
let numberOfMovesWithoutPawnPromotion = 0;
let activeFigure;
let eatenOnAisle;

grid.figuresCursore();

positionsOfFigures.push(grid.positionOfFigures());

grid.arrayCells.forEach((cells) => {
  cells.forEach((cell) => {
    cell.cellElement.addEventListener("click", async function () {
      const choosingAFigure = () => {
        const figure = grid.figures.find(
          (figure) =>
            figure.x === cell.x &&
            figure.y === cell.y &&
            grid.colorWhoseMove === figure.color
        );

        if (!figure) return;

        moves.forEach((move) => {
          grid.arrayCells[move.x][move.y].cellElement.classList.remove(
            "active"
          );
        });

        activeFigure?.figureElement.classList.remove("active");
        if (figure === activeFigure) {
          activeFigure = null;
          return;
        }
        activeFigure = figure;
        activeFigure.figureElement.classList.add("active");
        moves = activeFigure.acceptableMoves(
          grid.withoutASpecificFigure(activeFigure),
          eatenOnAisle
        );

        const { x, y } = activeFigure;
        moves = moves.filter((move) => {
          activeFigure.x = move.x;
          activeFigure.y = move.y;
          // Все фигуры кроме той, которую я как бы съел
          const figures = grid.figures.filter(
            (figure) =>
              !(
                figure.x === activeFigure.x &&
                figure.y === activeFigure.y &&
                figure.color !== activeFigure.color
              )
          );
          if (!checkOnCheck(grid.colorWhoseMove, figures)) return true;
        });
        activeFigure.x = x;
        activeFigure.y = y;

        moves.map((move) =>
          grid.arrayCells[move.x][move.y].cellElement.classList.add("active")
        );
      };

      const choosingAMove = async () => {
        const moveTransition = () => {
          activeFigure.figureElement.classList.remove("active");
          activeFigure = null;
          moves = [];
          grid.colorWhoseMove = grid.oppositeСolor(grid.colorWhoseMove);
          grid.figuresCursore();
        };
        const numberOfRepetitionsOfPosition = (
          positionsOfFigures,
          jsonFigures
        ) => {
          let count = 0;
          positionsOfFigures.forEach((positionOfFigures) => {
            let trigger = true;
            for (const key in positionOfFigures) {
              if (jsonFigures[key] !== positionOfFigures[key]) {
                trigger = false;
              }
            }
            if (trigger) {
              count++;
            }
          });
          return count;
        };

        if (!moves.find((move) => move.x === cell.x && move.y === cell.y))
          return;

        const figure = grid.figures.find(
          (figure) => figure.x === cell.x && figure.y === cell.y
        );
        moves.forEach((move) => {
          grid.arrayCells[move.x][move.y].cellElement.classList.remove(
            "active"
          );
        });

        const values = await activeFigure.move({
          x: cell.x,
          y: cell.y,
          eatenOnAisle,
          figure,
        });
        const replaceFigure = values?.replaceFigure;
        eatenOnAisle = values?.eatenOnAisle;
        if (replaceFigure) {
          grid.figuresPush(await choosingFigure(activeFigure));
        }
        numberOfMovesWithoutPawnPromotion++;
        if (activeFigure.value === "P") {
          positionsOfFigures.length = 0;
          numberOfMovesWithoutPawnPromotion = 0;
        }
        if (numberOfMovesWithoutPawnPromotion === DRAW_AT.moves) {
          gameResult(
            wrapperInTag(localeRU.draw) +
              wrapperInTag(localeRU.withoutAdvancingPawns50Moves, "h2")
          );
          return;
        }
        const countFiguresOld = grid.figures.length
        grid.figures = grid.figures.filter((figure) => figure.value);
        if (countFiguresOld !== grid.figures.length) {
          positionsOfFigures.length = 0;
        }
        positionsOfFigures.push(grid.positionOfFigures());
        if (
          numberOfRepetitionsOfPosition(
            positionsOfFigures,
            positionsOfFigures.at(-1)
          ) === 3
        ) {
          gameResult(
            wrapperInTag(localeRU.draw) +
              wrapperInTag(localeRU.repeatingAPosition, "h2")
          );
          return;
        }
        moveTransition();
        gameResult(gameEndCheck());
      };

      choosingAFigure();
      choosingAMove();
    });
  });
});

function checkOnCheck(color, figures) {
  const enemyFigures = grid.figuresByColor(grid.oppositeСolor(color), figures);
  const king = grid.figureKingByColor(color);
  if (
    ~enemyFigures.findIndex(
      (figure) =>
        !!~figure
          .acceptableMoves(grid.withoutASpecificFigure(figure, figures))
          .findIndex((move) => move.x === king.x && move.y === king.y)
    )
  ) {
    return true;
  }
}
function gameEndCheck() {
  const getMoves = (myFigure) => {
    const figures = grid.figures.filter(
      (figure) => !(figure.x === myFigure.x && figure.y === myFigure.y)
    );
    return myFigure.acceptableMoves(figures, eatenOnAisle);
  };
  const myFigures = grid.figuresByColor(grid.colorWhoseMove, grid.figures);
  if (checkOnCheck(grid.colorWhoseMove, grid.figures)) {
    const html = wrapperInTag(
      localeRU.victoryColor(grid.colorWhoseMove !== "w" ? "белых" : "чёрных")
    );
    if (
      !~myFigures.findIndex((myFigure) => {
        const moves = getMoves(myFigure);
        const { x, y } = myFigure;
        const moveFindIndex = moves.findIndex((move) => {
          myFigure.x = move.x;
          myFigure.y = move.y;
          const figures = grid.figures.filter(
            (figure) =>
              !(
                figure.x === myFigure.x &&
                figure.y === myFigure.y &&
                figure.color !== myFigure.color
              )
          );
          if (!checkOnCheck(grid.colorWhoseMove, figures)) return true;
        });
        myFigure.x = x;
        myFigure.y = y;
        if (~moveFindIndex) return true;
      })
    )
      return html;
  }

  if (
    !~myFigures.findIndex((myFigure) => {
      if (getMoves(myFigure).length) return true;
    })
  )
    return wrapperInTag(localeRU.draw) + wrapperInTag(localeRU.stalemate, "h2");
}

function gameResult(html) {
  if (!html) return;
  const victory = document.createElement("div");
  victory.id = "victory";
  modal.classList.add("flex");
  modal.append(victory);
  victory.innerHTML = html;
  const button = document.createElement("button");
  victory.append(button);
  button.innerText = localeRU.startOver;
  button.addEventListener("click", function () {
    grid.gameEnd();
    grid.gameStart();
    grid.figuresCursore();
    modal.removeChild(victory);
    modal.classList.remove("flex");
  });
}

async function choosingFigure(figure) {
  let figures = [];
  let x = 0;
  let div = document.createElement("div");
  let choosingFigure = document.createElement("div");
  choosingFigure.id = "choosing-figure";
  modal.classList.add("flex");
  modal.append(div);
  const h1 = document.createElement("h1");
  h1.innerText = localeRU.chooseAShape + ":";
  div.append(h1);
  div.append(choosingFigure);
  for (const key in CLASSES) {
    if (Object.hasOwnProperty.call(CLASSES, key)) {
      const classFigure = CLASSES[key];
      figures.push(
        new classFigure({
          y: 0,
          x,
          color: figure.color,
          figureContainer: choosingFigure,
          value: key,
        })
      );
      x++;
    }
  }
  return figure.replaceFigure(
    await new Promise(function (resolve, reject) {
      figures.forEach((newFigure) => {
        newFigure.figureElement.addEventListener(
          "click",
          function () {
            modal.removeChild(div);
            modal.classList.remove("flex");
            figure.remove();
            resolve({
              newFigure: newFigure.value,
              classFigure: CLASSES[newFigure.value],
            });
          },
          false
        );
      });
    })
  );
}

function wrapperInTag(text, tag = "h1") {
  return `<${tag}>${text}</${tag}>`;
}
