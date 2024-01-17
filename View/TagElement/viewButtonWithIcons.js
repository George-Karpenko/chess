import viewButton from "./viewButton.js";

export default (element, text, icons) => {
  const button = viewButton(element, text);
  button.prepend(icons[0]);
  button.append(icons[1]);
  return button;
};
