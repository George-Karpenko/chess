export default class Figure {
  #figureContainer;
  #figureElement;
  #x;
  #y;
  #value;
  #color;

  constructor({ figureContainer, color, value, x, y }) {
    this.#figureContainer = figureContainer;
    this.#figureElement = document.createElement("img");
    this.#figureElement.classList.add("figure");
    this.#figureElement.src = `imgs/chess-figures/adventurer/${
      color + value
    }.png`;
    figureContainer.append(this.#figureElement);
    this.#value = value;
    this.#color = color;
    this.x = x;
    this.y = y;
  }

  get figureContainer() {
    return this.#figureContainer;
  }
  set figureElementSrc(value) {
    this.#figureElement.src = value;
  }
  get figureElement() {
    return this.#figureElement;
  }

  get color() {
    return this.#color;
  }
  set value(value) {
    this.#value = value;
  }
  get value() {
    return this.#value;
  }
  set x(value) {
    this.#x = value;
    this.#figureElement.style.setProperty("--x", value);
  }
  get x() {
    return this.#x;
  }
  set y(value) {
    this.#y = value;
    this.#figureElement.style.setProperty("--y", value);
  }
  get y() {
    return this.#y;
  }

  remove() {
    this.#figureElement.remove();
    this.#value = null;
  }

  async move({ x, y, figure }) {
    this.x = x;
    this.y = y;
    if (figure) {
      figure.remove();
    }
    await this.waitForTransition();
  }

  waitForTransition() {
    return new Promise((resolve) => {
      this.#figureElement.addEventListener("transitionend", resolve, {
        once: true,
      });
    });
  }
}
