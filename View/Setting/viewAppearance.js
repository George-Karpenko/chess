import viewTitle from "../TagElement/viewTitle.js";
import viewButton from "../TagElement/viewButton.js";
import viewImg from "../TagElement/viewImg.js";
import viewButtonWithElement from "../TagElement/viewButtonWithElement.js";

const choicePieces = [
  "adventurer",
  "alpha",
  "spatial",
  "cases",
  "pixel",
  "cheq",
  "tournament",
  "chess24",
  "chess7",
];

export default (cb) => {
  const modalElement = document.createElement("div");
  viewTitle(modalElement, "Выбор фигур");
  const buttonContainer = document.createElement("div");
  choicePieces.forEach((piece) => {
    const imgs = document.createElement("div");
    viewImg({ element: imgs, text: `../imgs/chess-pieces/${piece}/bK.png` });
    viewImg({ element: imgs, text: `../imgs/chess-pieces/${piece}/wK.png` });
    const button = viewButtonWithElement(buttonContainer, imgs);

    addEventClick(button, () => {
      localStorage.setItem("pieces", piece);
    });
  });
  const button = viewButton(buttonContainer, "назад");
  addEventClick(button, cb);
  buttonContainer.classList.add("flex");
  modalElement.append(buttonContainer);
  return modalElement;
};

function addEventClick(element, cb) {
  element.addEventListener("click", cb);
}
