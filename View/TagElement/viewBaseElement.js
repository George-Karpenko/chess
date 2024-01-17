export default ({ element = null, tag, text = "" }) => {
  const tagElement = document.createElement(tag);
  tagElement.innerText = text;
  if (element) {
    element.append(tagElement);
  }
  return tagElement;
};
