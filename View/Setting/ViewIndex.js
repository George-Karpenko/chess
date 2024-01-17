import viewText from "./TagElement/viewText.js";
import viewTitle from "./TagElement/viewTitle.js";
import viewButton from "./TagElement/viewButton.js";
import viewButtonWithIcon from "../TagElement/viewButtonWithIcons.js";
import viewIcon from "../TagElement/viewIcon.js";

export default class ViewModal {
  #element;
  constructor(element) {
    this.#element = element;
  }

  gameMenu() {
    const modalElement = document.createElement("div");
    viewTitle(modalElement, "Настройки");
    const iconComputer = viewIcon(modalElement, "user");
    const iconUser = viewIcon(modalElement, "computer");
    const iconAppearance = viewIcon(modalElement, "appearance");
    const buttonUserVsComputer = viewButtonWithIcon(
      modalElement,
      "Человек против компьютера",
      [iconUser, iconComputer]
    );
    const buttonUserVsUser = viewButtonWithIcon(
      modalElement,
      "Человек против человека",
      iconUser
    );
    const buttonComputerVsComputer = viewButtonWithIcon(
      modalElement,
      "Компьютер против компьютера",
      iconComputer
    );
    const buttonAppearance = viewButtonWithIcon(
      modalElement,
      "Внешний вид",
      iconAppearance
    );

    addEventClick(buttonComputerVsComputer, gameComputer);
    addEventClick(buttonUserVsUser, gameUser);
    addEventClick(buttonUserVsComputer, gameUser);
    // addEventClick(buttonSettings, setting);
    stopPropagation(modalElement);

    this.#element.append(modalElement);
    this.#element.classList.add("flex");
  }

  removeModal() {
    this.#element.innerHTML = "";
    this.#element.classList.remove("flex");
  }
}

function gameUser() {
  localStorage.setItem("whitePlayerIsAManPlayingForBlack", false);
  localStorage.setItem("player1", "User");
  localStorage.setItem("player2", "User");
}

function gameComputer() {
  localStorage.setItem("whitePlayerIsAManPlayingForBlack", false);
  localStorage.setItem("player1", "Computer");
  localStorage.setItem("player2", "Computer");
}

function addEventClick(element, cb) {
  element.addEventListener("click", cb, { once: true });
}

function stopPropagation(element) {
  element.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}
