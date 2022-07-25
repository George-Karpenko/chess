class GlobalConst {
  #GRID_SIZE = 8

  get GRID_SIZE() {
    return this.#GRID_SIZE
  }
}

export default new GlobalConst();
