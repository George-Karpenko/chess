import { triggerColor } from "../functions.js";
import { GRID_SIZE } from "../globalConst.js";
import SearchForAMove from "./SearchForAMove.js";
import { checkACheck } from "../checkingTheGameStatus/Check.js";
import replacePiece from "./promotionChoice.js";

export default class Computer {
  #color;
  #gridPieces;
  #searchForAMove;

  constructor({ color, gridPieces }) {
    this.#color = color;
    this.#gridPieces = gridPieces;
    this.#searchForAMove = new SearchForAMove();
  }

  async getMove(eatenOnAisle, gameEnd, isCheck) {
    // Реализация поиска хода с рекурсией, очень долго ищет ход

    // const move = await this.searchBestMove({
    //   eatenOnAisle,
    //   gridPieces: this.#gridPieces,
    //   color: this.#color,
    //   gameEnd,
    //   isCheck,
    //   depth: 2,
    // });
    // return move.best_move;
    const move = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          this.#searchForAMove.search(
            eatenOnAisle,
            this.#gridPieces.value,
            this.#color,
            isCheck
          )
        );
      }, 0);
    });
    return move;
  }
  promotionChoice({ color, x, piece }) {
    return replacePiece({
      color,
      value: piece,
      x,
      y: color === "w" ? 0 : GRID_SIZE - 1,
    });
  }

  async searchBestMove({
    eatenOnAisle,
    gridPieces,
    color,
    gameEnd,
    isCheck,
    depth,
  }) {
    const myPieces = colorPieces(gridPieces.value, color);
    const availablePiecesMoves = myPieces.map((piece) => {
      let moves = piece.checkMoves({
        gridPieces: gridPieces.value,
        eatenOnAisle,
        isCheck,
      });
      if (
        piece.constructor.name === "Pawn" &&
        (piece.y === 1 || piece.y === GRID_SIZE - 2)
      ) {
        moves.flatMap((move) => {
          if (!move.isPromotionChoice) {
            return move;
          }
          const pieces = ["Queen", "Knight", "Rook", "Bishop"];
          const moves = [];
          pieces.forEach((pieceName) => {
            moves.push({
              move,
              piece,
              replacePiece: replacePiece({
                y: move.y,
                x: move.x,
                color,
                value: pieceName,
              }),
            });
          });
          return moves;
        });
      }
      return {
        value: piece,
        moves,
      };
    });

    if (
      availablePiecesMoves.length === 1 &&
      availablePiecesMoves[0].moves.length === 1
    ) {
      const best_move = {
        move: availablePiecesMoves[0].moves[0],
        piece: availablePiecesMoves[0].value,
      };
      return {
        score: calcStaticScore(gridPieces.value, color, eatenOnAisle, isCheck),
        best_move,
      };
    }
    if (depth === 0) {
      return {
        score: calcStaticScore(gridPieces.value, color, eatenOnAisle, isCheck),
        best_move: null,
      };
    }

    let score = -Infinity;
    let best_move;
    for (let index = 0; index < availablePiecesMoves.length; index++) {
      const newPiece = availablePiecesMoves[index];
      for (let index = 0; index < newPiece.moves.length; index++) {
        const move = newPiece.moves[index];

        const piece = clone(newPiece.value);
        const eatenOnAisle = move.eatenOnAisle;
        const cloneGridPieces = clone(gridPieces);
        cloneGridPieces.movePiece({ move, piece });

        if (move.replacePiece) {
          cloneGridPieces[move.y][move.y] = move.replacePiece;
        }

        const isCheck = checkACheck(
          cloneGridPieces.value,
          triggerColor(color),
          eatenOnAisle
        );
        const nextGameState = clone(gameEnd);
        const result = nextGameState.choice({
          gridPieces: cloneGridPieces.value,
          isAMove: color,
          piece,
          eatenOnAisle,
          isCheck,
        });
        if (result?.title === "Checkmate") {
          score = Infinity;
          best_move = { move, piece: newPiece.value };
          return { score, best_move };
        }
        if (result?.title === "Draw") {
          if (0 > score) {
            score = 0;
            best_move = { move, piece: newPiece.value };
          }
          return { score, best_move };
        }
        const search_best_move_result = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              this.searchBestMove(
                eatenOnAisle,
                cloneGridPieces,
                triggerColor(color),
                nextGameState,
                isCheck,
                depth - 1
              )
            );
          }, 0);
        });
        const tmp_score = -search_best_move_result.score;
        if (tmp_score > score) {
          score = tmp_score;
          best_move = { move, piece: newPiece.value };
        }
      }
    }
    return { score, best_move };
  }
}

function calcStaticScore(gridPieces, color, eatenOnAisle, isCheck) {
  const FIGURE_VALUES = {
    Knight: 300,
    Rook: 500,
    Bishop: 330,
    Queen: 900,
    King: 9900,
    Pawn: 100,
  };

  let score = 0;
  []
    .concat(...gridPieces)
    .filter((piece) => piece)
    .forEach((piece) => {
      if (!piece.color) {
        console.log("piece", piece);
      }
      if (color == piece.color) {
        // score += piece.checkMoves({ gridPieces, eatenOnAisle, isCheck }).length;
        score += FIGURE_VALUES[piece.constructor.name];
      } else {
        // score -= piece.checkMoves({ gridPieces, eatenOnAisle, isCheck }).length;
        score -= FIGURE_VALUES[piece.constructor.name];
      }
    });
  return score;
}

function colorPieces(gridPieces, color) {
  return [].concat(...gridPieces).filter((piece) => piece?.color === color);
}
function clone(obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object (functions are skipped)
  if (obj instanceof Object && obj.constructor.name === "GridPieces") {
    var copy = new obj.constructor(clone(obj.value));
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr) && !(obj[attr] instanceof Function))
        copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
  // Handle Object (functions are skipped)
  if (obj instanceof Object) {
    var copy = new obj.constructor({
      color: obj.color,
      x: obj.x,
      y: obj.y,
    });
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr) && !(obj[attr] instanceof Function))
        copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}
