import pieces from "./Pieces/index.js";

export default ({ color, value, x, y }) => {
  return new pieces[value]({ value, color, x, y });
};
