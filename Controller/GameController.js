import GameEnd from "../checkingTheGameStatus/GameEnd.js";
import { checkACheck } from "../checkingTheGameStatus/Check.js";
import { colorKing, triggerColor } from "../functions.js";
import { WHITE, BLACK } from "../globalConst.js";

export default class GameController {
  #players = {};
  #mapPieces;
  #gridPieces;
  #viewMoves;
  #gameEnd;
  #currentColorPlayer = WHITE;
  #viewKingIsUnderCheck;
  constructor({ blackPlayer, whitePlayer, mapPieces, gridPieces, viewMoves }) {
    this.#players[BLACK] = blackPlayer;
    this.#players[WHITE] = whitePlayer;
    this.#mapPieces = mapPieces;
    this.#gridPieces = gridPieces;
    this.#viewMoves = viewMoves;
    this.#gameEnd = new GameEnd();
    this.#gameEnd.choiceRuleOf3RepetitionsOfAPosition({
      gridPieces: this.#gridPieces.value,
      color: BLACK,
    });
  }

  async start(eatenOnAisle = null, isCheck = false) {
    const { move, piece } = await this.#players[
      this.#currentColorPlayer
    ].getMove(eatenOnAisle, this.#gameEnd, isCheck);

    eatenOnAisle = move.eatenOnAisle;

    this.#viewMoves.viewMove({
      move,
      piece,
    });

    await this.#mapPieces.movePiece({ move, piece });
    if (move.isPromotionChoice) {
      let newPiece = await this.#players[
        this.#currentColorPlayer
      ].promotionChoice({
        color: this.#currentColorPlayer,
        x: move.x,
      });
      this.#gridPieces.value[newPiece.y][newPiece.x] = newPiece;
      this.#mapPieces.promotionChoice(piece, newPiece);
    }

    this.#gridPieces.movePiece({ move, piece });

    isCheck = checkACheck(
      this.#gridPieces.value,
      triggerColor(this.#currentColorPlayer),
      eatenOnAisle
    );

    this.#viewKingIsUnderCheck = highlightingTheKingAtCheck({
      isCheck,
      gridPieces: this.#gridPieces.value,
      mapPieces: this.#mapPieces.value,
      currentColorPlayer: this.#currentColorPlayer,
      viewKingIsUnderCheck: this.#viewKingIsUnderCheck,
    });

    const result = this.#gameEnd.choice({
      gridPieces: this.#gridPieces.value,
      color: this.#currentColorPlayer,
      piece,
      eatenOnAisle,
      isCheck,
      hasOpponentMoves: hasOpponentMoves(
        this.#gridPieces.value,
        this.#currentColorPlayer,
        eatenOnAisle
      ),
    });

    if (result) {
      return result;
    }
    this.#currentColorPlayer = triggerColor(this.#currentColorPlayer);

    return await this.start(eatenOnAisle, isCheck);
  }
}

function hasOpponentMoves(gridPieces, color, eatenOnAisle) {
  color = triggerColor(color);
  const enemyPieces = []
    .concat(...gridPieces)
    .filter((piece) => piece?.color === color);
  return enemyPieces.every(
    (piece) => !piece.checkMoves({ gridPieces, eatenOnAisle }).length
  );
}
function highlightingTheKingAtCheck({
  isCheck,
  viewKingIsUnderCheck,
  gridPieces,
  currentColorPlayer,
  mapPieces,
}) {
  if (viewKingIsUnderCheck) {
    viewKingIsUnderCheck.classList.remove("king-is-under-check");
    viewKingIsUnderCheck = null;
  }
  if (isCheck) {
    const kingIsUnderCheck = colorKing(
      gridPieces,
      triggerColor(currentColorPlayer)
    );
    viewKingIsUnderCheck = mapPieces.get(kingIsUnderCheck).pieceElement;
    viewKingIsUnderCheck.classList.add("king-is-under-check");
  }
  return viewKingIsUnderCheck;
}
