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
  buttonContainer.classList.add("pieces__settings");
  let buttonActive;
  choicePieces.forEach((piece) => {
    const imgs = document.createElement("div");
    viewImg({ element: imgs, text: `./imgs/chess-pieces/${piece}/bK.png` });
    viewImg({ element: imgs, text: `./imgs/chess-pieces/${piece}/wK.png` });
    const button = viewButtonWithElement(buttonContainer, imgs);
    if (localStorage.getItem("pieces") === piece) {
      button.classList.add("active");
      buttonActive = button;
    }

    addEventClick(button, () => {
      buttonActive.classList.remove("active");
      buttonActive = button;
      buttonActive.classList.add("active");
      localStorage.setItem("pieces", piece);
    });
  });
  modalElement.append(buttonContainer);
  const button = viewButton(modalElement, "назад");
  button.classList.add("align--center");
  addEventClick(button, cb);
  return modalElement;
};

function addEventClick(element, cb) {
  element.addEventListener("click", cb);
}
