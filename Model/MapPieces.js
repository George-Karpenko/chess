import GridPieces from "./GridPieces.js";
import { GRID_SIZE } from "../GlobalConst.js";

export default class MapPieces extends GridPieces {
  #mapPieces;
  #viewPieces;

  constructor(viewPieces, gridStartingPositionOfPieces) {
    super(gridStartingPositionOfPieces);
    this.#viewPieces = viewPieces;
    const pieces = this.gridPieces.flat(Infinity).filter((piece) => piece);
    this.#mapPieces = new Map(
      pieces.map((piece, i) => [piece, this.#viewPieces.value[i]])
    );
  }

  get mapPieces() {
    return this.#mapPieces;
  }

  get viewPieces() {
    return this.#viewPieces;
  }

  async movePiece({ x, y, eatenOnAisle, piece, promotionChoice }) {
    const viewUpdatePieces = [];
    const payload =
      (await super.movePiece({ x, y, eatenOnAisle, piece })) || {};
    viewUpdatePieces.push(piece);
    if (payload.rook) {
      viewUpdatePieces.push(payload.rook);
    }
    await this.viewUpPieces(viewUpdatePieces);
    if (piece.constructor.name === "Pawn" && (y === 0 || y === GRID_SIZE - 1)) {
      this.gridPieces[y][x] = await this.promotionChoice(
        promotionChoice,
        piece,
        x
      );
      await this.viewUpPieces([this.gridPieces[y][x]]);
    }
    return payload.eatenOnAisle;
  }

  async viewUpPieces(upPieces) {
    await this.#viewPieces.viewUpPieces(this.#mapPieces, upPieces);
  }

  removePiece({ x, y }) {
    if (!this.gridPieces[y][x]) return;
    this.viewPieces.removePiece(this.mapPieces.get(this.gridPieces[y][x]));
    this.mapPieces.delete(this.gridPieces[y][x]);
    super.removePiece({ x, y });
  }

  async promotionChoice(promotionChoice, piece, x) {
    const viewPiecePromotionChoice = this.mapPieces.get(piece);
    this.mapPieces.delete(piece);
    piece = await super.promotionChoice(promotionChoice, piece, x);
    this.mapPieces.set(piece, viewPiecePromotionChoice);
    return piece;
  }
}
