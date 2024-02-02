// TODO нужно сделать

import Checkmate from "./Checkmate.js";
import Rule50Move from "./Rule50Move.js";
import RuleOf3RepetitionsOfAPosition from "./RuleOf3RepetitionsOfAPosition.js";

export default class GameEnd {
  #gameEnd;
  #ruleOf3RepetitionsOfAPosition;
  constructor() {
    this.#gameEnd = new Checkmate();
    const rule50Move = new Rule50Move();
    this.#ruleOf3RepetitionsOfAPosition = new RuleOf3RepetitionsOfAPosition();
    this.#gameEnd
      .setNext(rule50Move)
      .setNext(this.#ruleOf3RepetitionsOfAPosition);
  }

  choice(data) {
    return this.#gameEnd.handle(data);
  }
  choiceRuleOf3RepetitionsOfAPosition(data) {
    return this.#ruleOf3RepetitionsOfAPosition.handle(data);
  }
}
