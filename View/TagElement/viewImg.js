export default ({ element = null, text = null }) => {
  const tagElement = document.createElement("img");
  tagElement.src = text;
  if (element) {
    element.append(tagElement);
  }
  return element;
};
