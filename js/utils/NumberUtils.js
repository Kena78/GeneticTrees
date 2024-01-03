//<script src="https://raw.githubusercontent.com/mattdesl/number-util/master/index.js"></script>

var int8 = new Int8Array(4);
var int32 = new Int32Array(int8.buffer, 0, 1);
var float32 = new Float32Array(int8.buffer, 0, 1);

/**
 * A singleton for number utilities.
 * @class NumberUtils
 */
class NumberUtils {

  /**
   * Returns a float representation of the given int bits. ArrayBuffer
   * is used for the conversion.
   *
   * @method  intBitsToFloat
   * @static
   * @param  {Number} i the int to cast
   * @return {Number}   the float
   */
  static intBitsToFloat(i) {
    int32[0] = i;
    return float32[0];
  }

  /**
   * Returns the int bits from the given float. ArrayBuffer is used
   * for the conversion.
   *
   * @method  floatToIntBits
   * @static
   * @param  {Number} f the float to cast
   * @return {Number}   the int bits
   */
  static floatToIntBits(f) {
    float32[0] = f;
    return int32[0];
  }

  /**
   * Encodes ABGR int as a float, with slight precision loss.
   *
   * @method  intToFloatColor
   * @static
   * @param {Number} value an ABGR packed integer
   */
  static intToFloatColor(value) {
    return NumberUtils.intBitsToFloat(value & 0xfeffffff);
  }

  /**
   * Returns a float encoded ABGR value from the given RGBA
   * bytes (0 - 255). Useful for saving bandwidth in vertex data.
   *
   * @method  colorToFloat
   * @static
   * @param {Number} r the Red byte (0 - 255)
   * @param {Number} g the Green byte (0 - 255)
   * @param {Number} b the Blue byte (0 - 255)
   * @param {Number} a the Alpha byte (0 - 255)
   * @return {Float32}  a Float32 of the RGBA color
   */
  static colorToFloat(r, g, b, a) {
    let bits = (a << 24 | b << 16 | g << 8 | r);
    return NumberUtils.intToFloatColor(bits);
  }

  /**
   * Returns true if the number is a power-of-two.
   *
   * @method  isPowerOfTwo
   * @param  {Number}  n the number to test
   * @return {Boolean}   true if power-of-two
   */
  static isPowerOfTwo(n) {
    return (n & (n - 1)) === 0;
  }

  /**
   * Returns the next highest power-of-two from the specified number.
   *
   * @param  {Number} n the number to test
   * @return {Number}   the next highest power of two
   */
  static nextPowerOfTwo(n) {
    n--;
    n |= n >> 1;
    n |= n >> 2;
    n |= n >> 4;
    n |= n >> 8;
    n |= n >> 16;
    return n + 1;
  };

}

