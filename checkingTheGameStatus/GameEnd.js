// TODO нужно сделать

import Checkmate from "./Checkmate.js";
import Rule50Move from "./Rule50Move.js";
import RuleOf3RepetitionsOfAPosition from "./RuleOf3RepetitionsOfAPosition.js";

export default class GameEnd {
  #gameEnd;
  constructor(data) {
    this.#gameEnd = new Checkmate();
    const rule50Move = new Rule50Move();
    const ruleOf3RepetitionsOfAPosition = new RuleOf3RepetitionsOfAPosition();
    this.#gameEnd.setNext(rule50Move).setNext(ruleOf3RepetitionsOfAPosition);

    ruleOf3RepetitionsOfAPosition.handle(data);
  }

  choice(data) {
    return this.#gameEnd.handle(data);
  }
}
