import viewTitle from "../TagElement/viewTitle.js";
import viewButton from "../TagElement/viewButton.js";

export default () => {
  let buttonActive;
  const modalElement = document.createElement("div");
  viewTitle(modalElement, "Выбор цвета");
  const buttonPlayForWhite = viewButton(modalElement, "За белых");
  const buttonPlayForBlack = viewButton(modalElement, "За чёрных");
  localStorage.setItem("whitePlayerIsAManPlayingForBlack", false);
  localStorage.setItem("whitePlayer", "User");
  localStorage.setItem("blackPlayer", "Computer");
  buttonActive = buttonPlayForWhite;
  buttonActive.classList.add("active");
  addEventClick(buttonPlayForWhite, () => {
    localStorage.setItem("whitePlayerIsAManPlayingForBlack", false);
    localStorage.setItem("whitePlayer", "User");
    localStorage.setItem("blackPlayer", "Computer");
    buttonActive.classList.remove("active");
    buttonActive = buttonPlayForWhite;
    buttonActive.classList.add("active");
  });
  addEventClick(buttonPlayForBlack, () => {
    localStorage.setItem("whitePlayerIsAManPlayingForBlack", true);
    localStorage.setItem("whitePlayer", "Computer");
    localStorage.setItem("blackPlayer", "User");
    buttonActive.classList.remove("active");
    buttonActive = buttonPlayForBlack;
    buttonActive.classList.add("active");
  });

  return modalElement;
};

function addEventClick(element, cb) {
  element.addEventListener("click", cb);
}
