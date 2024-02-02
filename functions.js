import { WHITE, BLACK } from "./globalConst.js";

export function triggerColor(color) {
  return (color = color === WHITE ? BLACK : WHITE);
}

export function colorPieces(gridPieces, color) {
  return [].concat(...gridPieces).filter((piece) => piece?.color === color);
}

export function cloneGridPieces(obj) {
  return new obj.constructor(obj.value);
}

export function cloneArrayGridPieces(gridPieces) {
  const copy = [];
  for (let y = 0; y < gridPieces.length; y++) {
    const pieces = gridPieces[y];
    copy.push([]);
    for (let x = 0; x < pieces.length; x++) {
      const piece = pieces[x];
      copy[y].push(clonePiece(piece));
    }
  }
  return copy;
}

export function clonePiece(obj) {
  if (!obj) {
    return null;
  }
  return new obj.constructor({
    color: obj.color,
    x: obj.x,
    y: obj.y,
  });
}

export function colorKing(gridPieces, color) {
  return []
    .concat(...gridPieces)
    .find(
      (piece) => piece?.constructor.name === "King" && piece.color === color
    );
}

export function deepClone(obj) {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy;
  }

  // Handle Function
  if (obj instanceof Function) {
    copy = function () {
      return obj.apply(this, arguments);
    };
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
    }
    return copy;
  }

  throw new Error(
    "Unable to copy obj as type isn't supported " + obj.constructor.name
  );
}
