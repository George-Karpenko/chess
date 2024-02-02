/*  
  Первая реализация поиска хода без рекурсии,
*/
import ClassGridPieces from "./GridPieces.js";
import {
  deepClone,
  clonePiece,
  triggerColor,
  colorPieces,
  cloneArrayGridPieces,
} from "../functions.js";
import { GRID_SIZE, WHITE } from "../globalConst.js";

export default class SearchForAMove {
  search(eatenOnAisle, gridPieces, color, isCheck) {
    const copyGridPieces = cloneArrayGridPieces(gridPieces);
    const myPieces = colorPieces(gridPieces, color);
    const piecesMoves = getPiecesMoves(
      gridPieces,
      eatenOnAisle,
      myPieces,
      isCheck
    );

    let searchMoves = piecesMoves.map((pieceMoves) => {
      return pieceMoves.moves.map((move) => {
        const gridPieces = cloneArrayGridPieces(copyGridPieces);
        const piece = clonePiece(pieceMoves.piece);
        const eatenOnAisle = this.move({
          move,
          piece,
          gridPieces,
        });

        const myPieces = colorPieces(gridPieces, color);

        const enemyPieces = colorPieces(gridPieces, triggerColor(color));
        const enemySumPieces = sumPieces(enemyPieces);
        return {
          piece: pieceMoves.piece,
          move,
          enemySumPieces,
          mySumPieces: this.searchMove(
            eatenOnAisle,
            gridPieces,
            triggerColor(color),
            isCheck
          ),
          countMoves:
            getPiecesMoves(gridPieces, eatenOnAisle, myPieces, isCheck).flat(
              Infinity
            ).length * 0.1,
          color: triggerColor(color),
        };
      });
    });

    searchMoves = searchMoves.flat(Infinity);
    const maxCountMoves = Math.min.apply(
      null,
      searchMoves.map(
        (searchMove) =>
          searchMove.enemySumPieces -
          searchMove.mySumPieces -
          searchMove.countMoves
      )
    );
    searchMoves = searchMoves.filter(
      (searchMove) =>
        searchMove.enemySumPieces -
          searchMove.mySumPieces -
          searchMove.countMoves ===
        maxCountMoves
    );
    const rand = Math.floor(Math.random() * searchMoves.length);
    return searchMoves[rand];
  }
  searchMove(eatenOnAisle, gridPieces, color, isCheck) {
    const copyGridPieces = cloneArrayGridPieces(gridPieces);
    const copyEatenOnAisle = eatenOnAisle;
    const myPieces = colorPieces(gridPieces, color);
    const piecesMoves = getPiecesMoves(
      gridPieces,
      eatenOnAisle,
      myPieces,
      isCheck
    );

    let searchMoves = piecesMoves.map((pieceMoves) => {
      return pieceMoves.moves.map((move) => {
        const gridPieces = cloneArrayGridPieces(copyGridPieces);
        const piece = clonePiece(pieceMoves.piece);
        const eatenOnAisle = this.move({
          move,
          piece,
          eatenOnAisle: copyEatenOnAisle,
          gridPieces,
        });

        const myPieces = colorPieces(gridPieces, color);
        const enemyPieces = colorPieces(gridPieces, triggerColor(color));
        // const sum = getPiecesMoves(gridPieces, eatenOnAisle, myPieces).flat(
        //   Infinity
        // ).length;
        return sumPieces(enemyPieces);
      });
    });
    searchMoves = searchMoves.flat(Infinity);
    return Math.min.apply(null, searchMoves);
  }
  move({ move, piece, gridPieces }) {
    const classGridPieces = new ClassGridPieces(gridPieces);
    classGridPieces.movePiece({
      piece,
      move,
    });
    if (
      piece.constructor.name === "Pawn" &&
      (move.y === 0 || move.y === GRID_SIZE - 1)
    ) {
      classGridPieces.value[move.y][move.x] = classGridPieces.promotionChoice(
        this.promotionChoice.bind(this),
        piece,
        move.x
      );
    }
  }

  promotionChoice({ color, x }) {
    const arr = ["Queen", "Knight", "Rook", "Bishop"];
    const rand = Math.floor(Math.random() * arr.length);
    return { color, value: arr[0], x, y: color === WHITE ? 0 : GRID_SIZE - 1 };
  }
}
function getPiecesMoves(gridPieces, eatenOnAisle, pieces, isCheck) {
  pieces = pieces.map((piece) => {
    try {
      return {
        piece: piece,
        moves: piece.checkMoves({
          gridPieces,
          eatenOnAisle,
          isCheck,
        }),
      };
    } catch (error) {
      return {
        piece: piece,
        moves: [],
      };
    }
  });
  return pieces.filter((moves) => moves.moves && moves.moves.length);
}

function sumPieces(pieces) {
  return pieces.reduce((sum, piece) => {
    switch (piece.constructor.name) {
      case "Knight":
        return 300 + sum;
      case "Rook":
        return 500 + sum;
      case "Bishop":
        return 330 + sum;
      case "Queen":
        return 900 + sum;
      case "King":
        return 9900 + sum;
      case "Pawn":
        return 100 + sum;
    }
  }, 0);
}
