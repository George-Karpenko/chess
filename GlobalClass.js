class GlobalClass {
  #GRID_SIZE = 8
  #GRID_SIZE_SQUARED = GRID_SIZE ** 2;
  constructor() {
  }

  get GRID_SIZE() {
    return this.#GRID_SIZE
  }

  get GRID_SIZE_SQUARED() {
    return this.#GRID_SIZE_SQUARED
  }
}

export default new GlobalClass();
