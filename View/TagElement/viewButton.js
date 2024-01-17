import viewButtonWithElement from "./viewButtonWithElement.js";

export default (element, text) => {
  const tagElement = document.createElement("span");
  tagElement.innerText = text;
  return viewButtonWithElement(element, tagElement);
};
