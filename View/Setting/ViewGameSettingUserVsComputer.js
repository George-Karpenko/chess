import viewTitle from "../TagElement/viewTitle.js";
import viewButton from "../TagElement/viewButton.js";

export default (cb) => {
  const modalElement = document.createElement("div");
  viewTitle(modalElement, "Выбор цвета");
  const buttonRestartGame = viewButton(modalElement, "За чёрных");
  const buttonSettings = viewButton(modalElement, "За белых");

  addEventClick(buttonSettings, () => {
    localStorage.setItem("whitePlayerIsAManPlayingForBlack", false);
    localStorage.setItem("whitePlayer", "User");
    localStorage.setItem("blackPlayer", "Computer");
    buttonSettings.classList.add("active");
    buttonRestartGame.classList.remove("active");
  });
  addEventClick(buttonRestartGame, () => {
    localStorage.setItem("whitePlayerIsAManPlayingForBlack", true);
    localStorage.setItem("whitePlayer", "Computer");
    localStorage.setItem("blackPlayer", "User");
    buttonRestartGame.classList.add("active");
    buttonSettings.classList.remove("active");
  });
  const button = viewButton(modalElement, "назад");
  addEventClick(button, cb);
  return modalElement;
};

function addEventClick(element, cb) {
  element.addEventListener("click", cb);
}
