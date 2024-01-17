import ClassesPieces from "./Model/Pieces/index.js";
import { GRID_SIZE } from "./GlobalConst.js";

import GameController from "./Controller/GameController.js";
import Computer from "./Model/Computer.js";
import MapPieces from "./Model/MapPieces.js";
import User from "./Model/User2.js";
import ViewMoves from "./View/ViewMoves.js";
import ViewModal from "./View/ViewModal.js";
import ViewPieces from "./View/ViewPieces.js";
import ViewPromotionChoice from "./View/ViewPromotionChoice.js";

const gameBoard = document.getElementById("game");
const board = document.getElementById("board");
board.style.setProperty("--count-cell", GRID_SIZE);
const promotionChoice = document.getElementById("promotion-choice");
const modal = document.getElementById("modal");
const viewMoves = new ViewMoves(gameBoard);
const viewPromotionChoice = new ViewPromotionChoice(promotionChoice);
let whitePlayer, blackPlayer, gridPieces, viewPieces, mapPieces, game;

const viewModal = new ViewModal(modal, createGame, restartGame);
viewModal.gameMenu();

function createGame() {
  viewModal.removeModal();
  restartGame();
  whitePlayer = localStorage.getItem("whitePlayer");
  blackPlayer = localStorage.getItem("blackPlayer");
  if (blackPlayer === "User" && whitePlayer === "Computer") {
    gameBoard.classList.add("rotate");
    console.log(gameBoard.classList);
  } else {
    gameBoard.classList.remove("rotate");
  }
  gridPieces = startingPositionOfPieces();
  viewPieces = new ViewPieces(gameBoard, gridPieces);
  mapPieces = new MapPieces(viewPieces, gridPieces);

  whitePlayer = getPlayer(whitePlayer, "w");
  blackPlayer = getPlayer(blackPlayer, "b");

  game = new GameController({
    blackPlayer,
    whitePlayer,
    gridPieces,
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
  if (viewPieces) {
    viewPieces.value.forEach((viewPiece) => {
      console.log(viewPiece);
      viewPiece.remove();
    });
    viewPieces = null;
    viewMoves.removeOldMove();
    viewMoves.removeMoves();
    viewModal.removeModal();
  }
  // createGame();
}

function getPlayer(player, color) {
  if (player === "User") {
    return new User({
      color,
      pieces: mapPieces,
      viewMoves,
      viewPromotionChoice,
    });
  }
  return new Computer({ color, pieces: mapPieces, viewMoves });
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
    { y: 0, color: "b" },
    { y: 1, color: "b", value: "Pawn" },
    { y: GRID_SIZE - 2, color: "w", value: "Pawn" },
    { y: GRID_SIZE - 1, color: "w" },
  ];

  for (let x = 0; x < GRID_SIZE; x++) {
    // x % POSITION_OF_HEAVY_PIECES.length - Это так забавы ради. Теперь можно выставлять плое любой длинный)
    const value = POSITION_OF_HEAVY_PIECES[x % POSITION_OF_HEAVY_PIECES.length];
    pieces.forEach((item) => {
      grid[item.y][x] = createPiece({ x, value, ...item });
    });
  }

  return grid;

  function createPiece(piece) {
    return new ClassesPieces[piece.value]({
      ...piece,
    });
  }
}
