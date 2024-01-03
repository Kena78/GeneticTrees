class Color {
  /**@type number*/
  r
  /**@type number*/
  g
  /**@type number*/
  b
  /**@type number*/
  a

  constructor(r, g, b, a = 1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   */
  addValues(r, g, b, a = 1.0) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  add(color) {
    for (let name of ["r", "g", "b", "a"]) {
      this[name] += color[name]
    }
    return this;
  }

  lerp(color, progress) {
    for (let name of ["r", "g", "b", "a"]) {
      this[name] = Mathf.lerp(this[name], color[name], progress)
    }
    return this
  }

  div(value) {
    this.r /= value;
    this.g /= value;
    this.b /= value;
    return this
  }

  mul(value) {
    this.r *= value;
    this.g *= value;
    this.b *= value;
    return this
  }

  toFloatBits() {
    let color = (Math.floor(255 * a) << 24) | (Math.floor(255 * b) << 16) | (Math.floor(255 * g) << 8) | (Math.floor(255 * r));
    return Color.#intToFloatColor(color);
  }

  static intToFloatColor(value) {
    let color = ((value & 0xff) << 24) | ((0xff & (value >>> 8)) << 16) | ((0xff & (value >>> 16)) << 8) | (0xff & (value >>> 24));
    return Color.#intToFloatColor(color);
  }

  static #intToFloatColor(value) {
    return NumberUtils.intBitsToFloat(value & 0xfeffffff);
  }


  static fromArray(numbers) {
    return new Color(numbers[0], numbers[1], numbers[2], numbers[3]);
  }
}

class Colors {
  static whiteFloatBits = Color.intToFloatColor(0xFFFFFFFF)
  static blackFloatBits = Color.intToFloatColor(0x000000FF)
  static clearFloatBits = Color.intToFloatColor(0x00000000)
}
