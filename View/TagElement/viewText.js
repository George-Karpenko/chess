import viewBaseElement from "./viewBaseElement.js";

export default (element, text) => {
  return viewBaseElement({ element, text, tag: "p" });
};
