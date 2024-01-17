import viewBaseElement from "./viewBaseElement.js";

export default ({ element = null, classes }) => {
  const icon = viewBaseElement({ element, tag: "div" });
  icon.classList.add("icon");
  if (typeof classes === "string") {
    icon.classList.add(classes);
    return icon;
  }
  classes.forEach((className) => {
    icon.classList.add(className);
  });
  return icon;
};
