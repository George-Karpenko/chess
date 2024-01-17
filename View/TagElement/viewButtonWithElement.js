export default (element, elements) => {
  const tagElement = document.createElement("button");
  tagElement.append(elements);
  element.append(tagElement);
  return tagElement;
};
