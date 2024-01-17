import ClassGridPieces from "./GridPieces.js";
import { triggerColor } from "../functions.js";
import { GRID_SIZE } from "../globalConst.js";

export default class SearchForAMove {
  search(eatenOnAisle, gridPieces, color) {
    const cloneGridPieces = clone(gridPieces);
    const cloneEatenOnAisle = clone(eatenOnAisle);
    const myPieces = colorPieces(gridPieces, color);
    const piecesMoves = getPiecesMoves(gridPieces, eatenOnAisle, myPieces);

    let searchMoves = piecesMoves.map((pieceMoves) => {
      return pieceMoves.moves.map((move) => {
        const gridPieces = clone(cloneGridPieces);
        const piece = clone(pieceMoves.piece);
        const eatenOnAisle = this.move({
          move,
          piece,
          eatenOnAisle: cloneEatenOnAisle,
          gridPieces,
        });

        const myPieces = colorPieces(gridPieces, color);

        const enemyPieces = colorPieces(gridPieces, triggerColor(color));
        const enemySumPieces = sumPieces(enemyPieces);
        return {
          pieceX: pieceMoves.piece.x,
          pieceY: pieceMoves.piece.y,
          move,
          gridPieces,
          eatenOnAisle,
          enemySumPieces,
          mySumPieces: this.searchMove(
            eatenOnAisle,
            gridPieces,
            triggerColor(color)
          ),
          countMoves:
            getPiecesMoves(gridPieces, eatenOnAisle, myPieces).flat(Infinity)
              .length * 0.1,
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
  searchMove(eatenOnAisle, gridPieces, color) {
    const cloneGridPieces = clone(gridPieces);
    const cloneEatenOnAisle = eatenOnAisle;
    const myPieces = colorPieces(gridPieces, color);
    const piecesMoves = getPiecesMoves(gridPieces, eatenOnAisle, myPieces);

    let searchMoves = piecesMoves.map((pieceMoves) => {
      return pieceMoves.moves.map((move) => {
        const gridPieces = clone(cloneGridPieces);
        const piece = clone(pieceMoves.piece);
        const eatenOnAisle = this.move({
          move,
          piece,
          eatenOnAisle: cloneEatenOnAisle,
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
  move({ move, piece, eatenOnAisle, gridPieces }) {
    const classGridPieces = new ClassGridPieces(gridPieces);
    const { newEatenOnAisle } = classGridPieces.movePiece({
      piece,
      x: move.x,
      y: move.y,
      eatenOnAisle,
      promotionChoice: this.promotionChoice.bind(this),
    });
    if (
      piece.constructor.name === "Pawn" &&
      (move.y === 0 || move.y === GRID_SIZE - 1)
    ) {
      classGridPieces.gridPieces[move.y][move.x] =
        classGridPieces.promotionChoice(
          this.promotionChoice.bind(this),
          piece,
          move.x
        );
    }
  }

  promotionChoice({ color, x }) {
    const arr = ["Queen", "Knight", "Rook", "Bishop"];
    const rand = Math.floor(Math.random() * arr.length);
    return { color, value: arr[0], x, y: color === "w" ? 0 : GRID_SIZE - 1 };
  }
}
function getPiecesMoves(gridPieces, eatenOnAisle, pieces) {
  pieces = pieces.map((piece) => {
    try {
      return {
        piece: piece,
        moves: piece.acceptableMovesTODO({
          gridPieces,
          eatenOnAisle,
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
  if (obj instanceof Object) {
    var copy = new obj.constructor({
      pieceContainer: null,
      color: obj.color,
      value: obj.value,
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

function colorPieces(gridPieces, color) {
  return [].concat(...gridPieces).filter((piece) => piece?.color === color);
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
