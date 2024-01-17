import viewText from "./TagElement/viewText.js";
import viewTitle from "./TagElement/viewTitle.js";
import viewButton from "./TagElement/viewButton.js";
import viewButtonWithIcons from "./TagElement/viewButtonWithIcons.js";
import viewIcon from "./TagElement/viewIcon.js";

import ViewGameSettingUserVsComputer from "./Setting/ViewGameSettingUserVsComputer.js";
import viewAppearance from "./Setting/viewAppearance.js";

export default class ViewModal {
  #element;
  constructor(element, createGame, restartGame) {
    this.#element = element;
    this.createGame = createGame;
    this.restartGame = restartGame;
  }

  get element() {
    return this.#element;
  }

  removeModal() {
    this.element.innerHTML = "";
    this.element.classList.remove("flex");
  }

  gameEnd({ title, text }) {
    const modalElement = document.createElement("div");
    viewTitle(modalElement, title);
    viewText(modalElement, text);
    const buttonRestartGame = viewButton(modalElement, "Играть заново");
    const buttonSettings = viewButton(modalElement, "Настройки");

    addEventClick(buttonRestartGame, this.createGame);
    addEventClick(this.element, this.createGame);
    addEventClick(buttonSettings, this.gameMenu.bind(this));
    stopPropagation(modalElement);

    this.element.append(modalElement);
    this.element.classList.add("flex");
  }

  gameMenu() {
    this.removeModal();
    const modalElement = document.createElement("div");
    viewTitle(modalElement, "Настройки");
    const buttonUserVsComputer = viewButtonWithIcons(
      modalElement,
      "Человек против компьютера",
      [viewIcon({ classes: "user" }), viewIcon({ classes: "computer" })]
    );
    const buttonUserVsUser = viewButtonWithIcons(
      modalElement,
      "Человек против человека",
      [viewIcon({ classes: "user" }), viewIcon({ classes: "user" })]
    );
    const buttonComputerVsComputer = viewButtonWithIcons(
      modalElement,
      "Компьютер против компьютера",
      [viewIcon({ classes: "computer" }), viewIcon({ classes: "computer" })]
    );
    const buttonAppearance = viewButtonWithIcons(modalElement, "Внешний вид", [
      viewIcon({ classes: "appearance" }),
      viewIcon({ classes: "appearance" }),
    ]);

    addEventClick(
      buttonComputerVsComputer,
      this.gameComputer.bind(null, this.createGame)
    );
    addEventClick(buttonUserVsUser, this.gameUser.bind(null, this.createGame));
    addEventClick(buttonUserVsComputer, this.gameUserVsComputer.bind(this));
    addEventClick(buttonAppearance, this.appearance.bind(this));
    stopPropagation(modalElement);

    this.element.append(modalElement);
    this.element.classList.add("flex");
  }

  gameUser(cb) {
    localStorage.setItem("whitePlayer", "User");
    localStorage.setItem("blackPlayer", "User");
    cb();
  }

  gameComputer(cb) {
    localStorage.setItem("whitePlayer", "Computer");
    localStorage.setItem("blackPlayer", "Computer");
    cb();
  }

  gameUserVsComputer() {
    this.removeModal();
    const modalElement = ViewGameSettingUserVsComputer();

    const buttonStartGame = viewButton(modalElement, "Начать игру");

    const button = viewButton(modalElement, "назад");
    addEventClick(button, this.gameMenu.bind(this));

    modalElement.append(buttonStartGame);

    stopPropagation(modalElement);

    addEventClick(buttonStartGame, this.createGame);

    this.element.append(modalElement);
    this.element.classList.add("flex");
  }

  appearance() {
    this.removeModal();
    const modalElement = viewAppearance(this.gameMenu.bind(this));

    stopPropagation(modalElement);

    this.element.append(modalElement);
    this.element.classList.add("flex");
  }
}

function addEventClick(element, cb) {
  element.addEventListener("click", cb, { once: true });
}

function stopPropagation(element) {
  element.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}
