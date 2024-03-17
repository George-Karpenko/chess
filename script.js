import ClassesPieces from "./Model/Pieces/index.js";
import { GRID_SIZE, WHITE, BLACK } from "./globalConst.js";

import GameController from "./Controller/GameController.js";
import Computer from "./Model/Computer.js";
import MapPieces from "./Model/MapPieces.js";
import GridPieces from "./Model/GridPieces.js";
import User from "./Model/User.js";
import ViewMoves from "./View/ViewMoves.js";
import ViewModal from "./View/ViewModal.js";
import ViewPieces from "./View/ViewPieces.js";
import ViewPromotionChoice from "./View/ViewPromotionChoice.js";

if (!("pieces" in localStorage)) {
  localStorage.setItem("pieces", "alpha");
}

const gameBoard = document.getElementById("game");
const board = document.getElementById("board");
board.style.setProperty("--count-cell", GRID_SIZE);
const promotionChoice = document.getElementById("promotion-choice");
const modal = document.getElementById("modal");
let viewMoves;
const viewPromotionChoice = new ViewPromotionChoice(promotionChoice);
let whitePlayer, blackPlayer, gridPieces, viewPieces, mapPieces, game;

const viewModal = new ViewModal(modal, createGame);
viewModal.gameMenu();

function createGame() {
  restartGame();
  whitePlayer = localStorage.getItem("whitePlayer");
  blackPlayer = localStorage.getItem("blackPlayer");
  viewMoves = new ViewMoves(gameBoard);
  gridPieces = new GridPieces(startingPositionOfPieces());
  viewPieces = new ViewPieces(gameBoard, gridPieces.value);
  mapPieces = new MapPieces(viewPieces, gridPieces.value);

  whitePlayer = getPlayer(whitePlayer, WHITE);
  blackPlayer = getPlayer(blackPlayer, BLACK);

  game = new GameController({
    blackPlayer,
    whitePlayer,
    mapPieces,
    gridPieces,
    viewMoves,
  });
  setTimeout(async () => {
    const result = await game.start();
    endGame(result);
  }, 0);
}

function endGame(result) {
  return viewModal.gameEnd(result);
}

function restartGame() {
  gameBoard.innerHTML = null;
  viewModal.removeModal();
}

function getPlayer(player, color) {
  if (player === "User") {
    return new User({
      color,
      gridPieces,
      mapPieces,
      viewMoves,
      viewPromotionChoice,
    });
  }
  return new Computer({ color, gridPieces, viewMoves });
}

function startingPositionOfPieces() {
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );
  const POSITION_OF_HEAVY_PIECES = [
    "Rook",
    "Knight",
    "Bishop",
    "Queen",
    "King",
    "Bishop",
    "Knight",
    "Rook",
  ];
  const pieces = [
    { y: 0, color: BLACK },
    { y: 1, color: BLACK, value: "Pawn" },
    { y: GRID_SIZE - 2, color: WHITE, value: "Pawn" },
    { y: GRID_SIZE - 1, color: WHITE },
  ];

  for (let i = 0; i < GRID_SIZE; i++) {
    // x % POSITION_OF_HEAVY_PIECES.length - Это так забавы ради. Теперь можно выставлять плое любой длинный)
    const value = POSITION_OF_HEAVY_PIECES[i % POSITION_OF_HEAVY_PIECES.length];
    pieces.forEach((item) => {
      if (
        JSON.parse(localStorage.getItem("whitePlayerIsAManPlayingForBlack"))
      ) {
        const x = GRID_SIZE - i - 1;
        const y = GRID_SIZE - item.y - 1;
        grid[y][x] = createPiece({ x, value, ...item, y });
      } else {
        grid[item.y][i] = createPiece({ x: i, value, ...item });
      }
    });
  }

  return grid;

  function createPiece(piece) {
    return new ClassesPieces[piece.value]({
      ...piece,
    });
  }
}
