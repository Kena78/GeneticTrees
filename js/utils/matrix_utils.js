// noinspection JSUnusedGlobalSymbols

const Mathf = {
  degreesToRadians: Math.PI / 180,
  radiansToDegrees: 180 / Math.PI,
  tau: Math.PI * 2, halfPi: Math.PI/2, pi: Math.PI,


  lerp(a, b, p) {
    return a + p * (b - a);
  }
}

/*13/!**
 * Multiplies matrix a with matrix b in the following manner:
 *
 * <pre>
 * mul(A, B) => A := AB
 * </pre>
 * @param mata The float array representing the first matrix. Must have at least 9 elements.
 * @param matb The float array representing the second matrix. Must have at least 9 elements.
 *!/
private static void mul(float[] mata, float[] matb){
let v00 = mata[Matrix.M00] * matb[Matrix.M00] + mata[Matrix.M01] * matb[Matrix.M10] + mata[Matrix.M02] * matb[Matrix.M20];
let v01 = mata[Matrix.M00] * matb[Matrix.M01] + mata[Matrix.M01] * matb[Matrix.M11] + mata[Matrix.M02] * matb[Matrix.M21];
let v02 = mata[Matrix.M00] * matb[Matrix.M02] + mata[Matrix.M01] * matb[Matrix.M12] + mata[Matrix.M02] * matb[Matrix.M22];

let v10 = mata[Matrix.M10] * matb[Matrix.M00] + mata[Matrix.M11] * matb[Matrix.M10] + mata[Matrix.M12] * matb[Matrix.M20];
let v11 = mata[Matrix.M10] * matb[Matrix.M01] + mata[Matrix.M11] * matb[Matrix.M11] + mata[Matrix.M12] * matb[Matrix.M21];
let v12 = mata[Matrix.M10] * matb[Matrix.M02] + mata[Matrix.M11] * matb[Matrix.M12] + mata[Matrix.M12] * matb[Matrix.M22];

let v20 = mata[Matrix.M20] * matb[Matrix.M00] + mata[Matrix.M21] * matb[Matrix.M10] + mata[Matrix.M22] * matb[Matrix.M20];
let v21 = mata[Matrix.M20] * matb[Matrix.M01] + mata[Matrix.M21] * matb[Matrix.M11] + mata[Matrix.M22] * matb[Matrix.M21];
let v22 = mata[Matrix.M20] * matb[Matrix.M02] + mata[Matrix.M21] * matb[Matrix.M12] + mata[Matrix.M22] * matb[Matrix.M22];

  mata[Matrix.M00] = v00;
  mata[Matrix.M10] = v10;
  mata[Matrix.M20] = v20;
  mata[Matrix.M01] = v01;
  mata[Matrix.M11] = v11;
  mata[Matrix.M21] = v21;
  mata[Matrix.M02] = v02;
  mata[Matrix.M12] = v12;
  mata[Matrix.M22] = v22;
}*/
class Matrix {
  static M00 = 0;
  static M01 = 3;
  static M02 = 6;
  static M10 = 1;
  static M11 = 4;
  static M12 = 7;
  static M20 = 2;
  static M21 = 5;
  static M22 = 8;
  /**@type number[]*/
  val = new Array(9).fill(0);
  /**@type number[]*/
  #tmp = new Array(9).fill(0);

  /**
   * @param {number[]} mata
   * @param {number[]} matb
   * @param {number[]} result
   * */
  static mul(mata, matb, result = undefined) {
    let v00 = mata[Matrix.M00] * matb[Matrix.M00] + mata[Matrix.M01] * matb[Matrix.M10] + mata[Matrix.M02] * matb[Matrix.M20];
    let v01 = mata[Matrix.M00] * matb[Matrix.M01] + mata[Matrix.M01] * matb[Matrix.M11] + mata[Matrix.M02] * matb[Matrix.M21];
    let v02 = mata[Matrix.M00] * matb[Matrix.M02] + mata[Matrix.M01] * matb[Matrix.M12] + mata[Matrix.M02] * matb[Matrix.M22];

    let v10 = mata[Matrix.M10] * matb[Matrix.M00] + mata[Matrix.M11] * matb[Matrix.M10] + mata[Matrix.M12] * matb[Matrix.M20];
    let v11 = mata[Matrix.M10] * matb[Matrix.M01] + mata[Matrix.M11] * matb[Matrix.M11] + mata[Matrix.M12] * matb[Matrix.M21];
    let v12 = mata[Matrix.M10] * matb[Matrix.M02] + mata[Matrix.M11] * matb[Matrix.M12] + mata[Matrix.M12] * matb[Matrix.M22];

    let v20 = mata[Matrix.M20] * matb[Matrix.M00] + mata[Matrix.M21] * matb[Matrix.M10] + mata[Matrix.M22] * matb[Matrix.M20];
    let v21 = mata[Matrix.M20] * matb[Matrix.M01] + mata[Matrix.M21] * matb[Matrix.M11] + mata[Matrix.M22] * matb[Matrix.M21];
    let v22 = mata[Matrix.M20] * matb[Matrix.M02] + mata[Matrix.M21] * matb[Matrix.M12] + mata[Matrix.M22] * matb[Matrix.M22];
    if (result === undefined) result = mata
    result[Matrix.M00] = v00;
    result[Matrix.M10] = v10;
    result[Matrix.M20] = v20;
    result[Matrix.M01] = v01;
    result[Matrix.M11] = v11;
    result[Matrix.M21] = v21;
    result[Matrix.M02] = v02;
    result[Matrix.M12] = v12;
    result[Matrix.M22] = v22;
  }

  constructor(matrix = undefined) {
    this.idt()
    if (matrix !== undefined) {
      this.set(matrix);
    }
  }


  /** Sets this matrix to an orthographic projection. */
  setOrtho(x, y, width, height) {
    //const right = x + width, top = y + height;

    // let x_orth = 2 / (right - x);
    // let y_orth = 2 / (top - y);
    //
    // let tx = -(right + x) / (right - x);
    // let ty = -(top + y) / (top - y);

    let x_orth = 2 / (width);
    let y_orth = 2 / (height);

    let tx = -(1 + x * x_orth);
    let ty = -(1 + y * y_orth);
    let val = this.val;
    val[Matrix.M00] = x_orth;
    val[Matrix.M11] = y_orth;

    val[Matrix.M02] = tx;
    val[Matrix.M12] = ty;
    val[Matrix.M22] = 1;

    return this;
  }

  /**
   * Sets this matrix to the identity matrix
   * @return This matrix for the purpose of chaining operations.
   */
  idt() {
    let val = this.val;
    val[Matrix.M00] = 1;
    val[Matrix.M10] = 0;
    val[Matrix.M20] = 0;
    val[Matrix.M01] = 0;
    val[Matrix.M11] = 1;
    val[Matrix.M21] = 0;
    val[Matrix.M02] = 0;
    val[Matrix.M12] = 0;
    val[Matrix.M22] = 1;
    return this;
  }

  /**
   * Postmultiplies this matrix with the provided matrix and stores the result in this matrix. For example:
   *
   * <pre>
   * A.mul(B) results in A := AB
   * </pre>
   * @param m Matrix to multiply by.
   * @return This matrix for the purpose of chaining operations together.
   */
  mul(m/**@type Matrix*/) {
    Matrix.mul(this.val, m)
    return this;
  }

  /**
   * Premultiplies this matrix with the provided matrix and stores the result in this matrix. For example:
   *
   * <pre>
   * A.mulLeft(B) results in A := BA
   * </pre>
   * @param m The other Matrix to multiply by
   * @return This matrix for the purpose of chaining operations.
   */
  mulLeft(m/**@type Matrix*/) {
    Matrix.mul(m, this.val, this.val)
    return this;
  }

  /**
   * Sets this matrix to a rotation matrix that will rotate any vector in counter-clockwise direction around the z-axis.
   * @param degrees the angle in degrees.
   * @return This matrix for the purpose of chaining operations.
   */
  setToRotationDegrees(degrees) {
    return this.setToRotationRad(Mathf.degreesToRadians * degrees);
  }

  /**
   * Sets this matrix to a rotation matrix that will rotate any vector in counter-clockwise direction around the z-axis.
   * @param radians the angle in radians.
   * @return This matrix for the purpose of chaining operations.
   */
  setToRotationRad(radians) {
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);
    let val = this.val;

    val[Matrix.M00] = cos;
    val[Matrix.M10] = sin;
    val[Matrix.M20] = 0;

    val[Matrix.M01] = -sin;
    val[Matrix.M11] = cos;
    val[Matrix.M21] = 0;

    val[Matrix.M02] = 0;
    val[Matrix.M12] = 0;
    val[Matrix.M22] = 1;

    return this;
  }

  setToRotationDegrees(axis, degrees) {
    return this.setToRotation(axis, Math.cos(degrees * Mathf.degreesToRadians), Math.sin(degrees * Mathf.degreesToRadians));
  }


  setToRotation(axis, cos, sin) {
    let val = this.val;
    let oc = 1.0 - cos;
    val[Matrix.M00] = oc * axis.x * axis.x + cos;
    val[Matrix.M10] = oc * axis.x * axis.y - axis.z * sin;
    val[Matrix.M20] = oc * axis.z * axis.x + axis.y * sin;
    val[Matrix.M01] = oc * axis.x * axis.y + axis.z * sin;
    val[Matrix.M11] = oc * axis.y * axis.y + cos;
    val[Matrix.M21] = oc * axis.y * axis.z - axis.x * sin;
    val[Matrix.M02] = oc * axis.z * axis.x - axis.y * sin;
    val[Matrix.M12] = oc * axis.y * axis.z + axis.x * sin;
    val[Matrix.M22] = oc * axis.z * axis.z + cos;
    return this;
  }

  /**
   * Sets this matrix to a translation matrix.
   * @param x the translation in x
   * @param y the translation in y
   * @return This matrix for the purpose of chaining operations.
   */
  setToTranslation(x, y) {
    let val = this.val;

    val[Matrix.M00] = 1;
    val[Matrix.M10] = 0;
    val[Matrix.M20] = 0;

    val[Matrix.M01] = 0;
    val[Matrix.M11] = 1;
    val[Matrix.M21] = 0;

    val[Matrix.M02] = x;
    val[Matrix.M12] = y;
    val[Matrix.M22] = 1;

    return this;
  }

  /**
   * Sets this matrix to a translation matrix.
   * @param translation The translation vector.
   * @return This matrix for the purpose of chaining operations.
   */
  setToTranslationVector(translation/**@type Vector2*/) {
    let val = this.val;

    val[Matrix.M00] = 1;
    val[Matrix.M10] = 0;
    val[Matrix.M20] = 0;

    val[Matrix.M01] = 0;
    val[Matrix.M11] = 1;
    val[Matrix.M21] = 0;

    val[Matrix.M02] = translation.x;
    val[Matrix.M12] = translation.y;
    val[Matrix.M22] = 1;

    return this;
  }

  /**
   * Sets this matrix to a scaling matrix.
   * @param scaleX the scale in x
   * @param scaleY the scale in y
   * @return This matrix for the purpose of chaining operations.
   */
  setToScaling(scaleX, scaleY) {
    let val = this.val;
    val[Matrix.M00] = scaleX;
    val[Matrix.M10] = 0;
    val[Matrix.M20] = 0;
    val[Matrix.M01] = 0;
    val[Matrix.M11] = scaleY;
    val[Matrix.M21] = 0;
    val[Matrix.M02] = 0;
    val[Matrix.M12] = 0;
    val[Matrix.M22] = 1;
    return this;
  }

  /**
   * Sets this matrix to a scaling matrix.
   * @param scale The scale vector.
   * @return This matrix for the purpose of chaining operations.
   */
  setToScalingVector(scale/**@type Vector2*/) {
    let val = this.val;
    val[Matrix.M00] = scale.x;
    val[Matrix.M10] = 0;
    val[Matrix.M20] = 0;
    val[Matrix.M01] = 0;
    val[Matrix.M11] = scale.y;
    val[Matrix.M21] = 0;
    val[Matrix.M02] = 0;
    val[Matrix.M12] = 0;
    val[Matrix.M22] = 1;
    return this;
  }

  toString() {
    let val = this.val;
    return "[" + val[Matrix.M00] + "|" + val[Matrix.M01] + "|" + val[Matrix.M02] + "]\n" //
      + "[" + val[Matrix.M10] + "|" + val[Matrix.M11] + "|" + val[Matrix.M12] + "]\n" //
      + "[" + val[Matrix.M20] + "|" + val[Matrix.M21] + "|" + val[Matrix.M22] + "]";
  }

  /** @return The determinant of this matrix */
  det() {
    let val = this.val;
    return val[Matrix.M00] * val[Matrix.M11] * val[Matrix.M22] + val[Matrix.M01] * val[Matrix.M12] * val[Matrix.M20] + val[Matrix.M02] * val[Matrix.M10] * val[Matrix.M21] - val[Matrix.M00]
      * val[Matrix.M12] * val[Matrix.M21] - val[Matrix.M01] * val[Matrix.M10] * val[Matrix.M22] - val[Matrix.M02] * val[Matrix.M11] * val[Matrix.M20];
  }

  /**
   * Inverts this matrix given that the determinant is != 0.
   * @return This matrix for the purpose of chaining operations.
   * @throws ArcRuntimeException if the matrix is singular (not invertible)
   */
  inv() {
    let det = this.det();
    if (det === 0) throw ("Can't invert a singular matrix");

    let inv_det = 1.0 / det;
    let tmp = this.#tmp, val = this.val;

    tmp[Matrix.M00] = val[Matrix.M11] * val[Matrix.M22] - val[Matrix.M21] * val[Matrix.M12];
    tmp[Matrix.M10] = val[Matrix.M20] * val[Matrix.M12] - val[Matrix.M10] * val[Matrix.M22];
    tmp[Matrix.M20] = val[Matrix.M10] * val[Matrix.M21] - val[Matrix.M20] * val[Matrix.M11];
    tmp[Matrix.M01] = val[Matrix.M21] * val[Matrix.M02] - val[Matrix.M01] * val[Matrix.M22];
    tmp[Matrix.M11] = val[Matrix.M00] * val[Matrix.M22] - val[Matrix.M20] * val[Matrix.M02];
    tmp[Matrix.M21] = val[Matrix.M20] * val[Matrix.M01] - val[Matrix.M00] * val[Matrix.M21];
    tmp[Matrix.M02] = val[Matrix.M01] * val[Matrix.M12] - val[Matrix.M11] * val[Matrix.M02];
    tmp[Matrix.M12] = val[Matrix.M10] * val[Matrix.M02] - val[Matrix.M00] * val[Matrix.M12];
    tmp[Matrix.M22] = val[Matrix.M00] * val[Matrix.M11] - val[Matrix.M10] * val[Matrix.M01];

    val[Matrix.M00] = inv_det * tmp[Matrix.M00];
    val[Matrix.M10] = inv_det * tmp[Matrix.M10];
    val[Matrix.M20] = inv_det * tmp[Matrix.M20];
    val[Matrix.M01] = inv_det * tmp[Matrix.M01];
    val[Matrix.M11] = inv_det * tmp[Matrix.M11];
    val[Matrix.M21] = inv_det * tmp[Matrix.M21];
    val[Matrix.M02] = inv_det * tmp[Matrix.M02];
    val[Matrix.M12] = inv_det * tmp[Matrix.M12];
    val[Matrix.M22] = inv_det * tmp[Matrix.M22];

    return this;
  }

  /**
   * Copies the values from the provided matrix to this matrix.
   * @param {Matrix|number[]} mat The matrix to copy.
   * @return This matrix for the purposes of chaining.
   */
  set(mat) {
    if (Object.getPrototypeOf(mat) === Matrix.prototype) {
      this.val = mat.val.slice()
    } else {
      this.val = mat.slice()
    }

    return this;
  }

  /**
   * Copies the values from the provided affine matrix to this matrix. The last row is set to (0, 0, 1).
   * @param affine The affine matrix to copy.
   * @return This matrix for the purposes of chaining.
   */


  /**
   * Adds a translational component to the matrix in the 3rd column. The other columns are untouched.
   * @param {Vector2} vector The translation vector.
   * @return This matrix for the purpose of chaining.
   */
  trnVector(vector) {
    this.val[Matrix.M02] += vector.x;
    this.val[Matrix.M12] += vector.y;
    return this;
  }

  /**
   * Adds a translational component to the matrix in the 3rd column. The other columns are untouched.
   * @param x The x-component of the translation vector.
   * @param y The y-component of the translation vector.
   * @return This matrix for the purpose of chaining.
   */
  trn(x, y) {
    this.val[Matrix.M02] += x;
    this.val[Matrix.M12] += y;
    return this;
  }

  /**
   * Postmultiplies this matrix by a translation matrix. Postmultiplication is also used by OpenGL ES' 1.x
   * glTranslate/glRotate/glScale.
   * @param x The x-component of the translation vector.
   * @param y The y-component of the translation vector.
   * @return This matrix for the purpose of chaining.
   */
  translate(x, y) {
    let val = this.val;
    this.#tmp[Matrix.M00] = 1;
    this.#tmp[Matrix.M10] = 0;
    this.#tmp[Matrix.M20] = 0;

    this.#tmp[Matrix.M01] = 0;
    this.#tmp[Matrix.M11] = 1;
    this.#tmp[Matrix.M21] = 0;

    this.#tmp[Matrix.M02] = x;
    this.#tmp[Matrix.M12] = y;
    this.#tmp[Matrix.M22] = 1;
    Matrix.mul(val, this.#tmp);
    return this;
  }

  /**
   * Postmultiplies this matrix by a translation matrix. Postmultiplication is also used by OpenGL ES' 1.x
   * glTranslate/glRotate/glScale.
   * @param {Vector2} translation The translation vector.
   * @return This matrix for the purpose of chaining.
   */
  translateVector(translation) {
    let val = this.val;
    this.#tmp[Matrix.M00] = 1;
    this.#tmp[Matrix.M10] = 0;
    this.#tmp[Matrix.M20] = 0;

    this.#tmp[Matrix.M01] = 0;
    this.#tmp[Matrix.M11] = 1;
    this.#tmp[Matrix.M21] = 0;

    this.#tmp[Matrix.M02] = translation.x;
    this.#tmp[Matrix.M12] = translation.y;
    this.#tmp[Matrix.M22] = 1;
    Matrix.mul(val, this.#tmp);
    return this;
  }

  /**
   * Postmultiplies this matrix with a (counter-clockwise) rotation matrix. Postmultiplication is also used by OpenGL ES' 1.x
   * glTranslate/glRotate/glScale.
   * @param degrees The angle in degrees
   * @return This matrix for the purpose of chaining.
   */
  rotate(degrees) {
    return this.rotateRad(Math.degreesToRadians * degrees);
  }

  /**
   * Postmultiplies this matrix with a (counter-clockwise) rotation matrix. Postmultiplication is also used by OpenGL ES' 1.x
   * glTranslate/glRotate/glScale.
   * @param radians The angle in radians
   * @return This matrix for the purpose of chaining.
   */
  rotateRad(radians) {
    if (radians % (2 * Math.PI) === 0) return this;
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);
    let tmp = this.#tmp;

    tmp[Matrix.M00] = cos;
    tmp[Matrix.M10] = sin;
    tmp[Matrix.M20] = 0;

    tmp[Matrix.M01] = -sin;
    tmp[Matrix.M11] = cos;
    tmp[Matrix.M21] = 0;

    tmp[Matrix.M02] = 0;
    tmp[Matrix.M12] = 0;
    tmp[Matrix.M22] = 1;
    Matrix.mul(this.val, tmp);
    return this;
  }

  /**
   * Postmultiplies this matrix with a scale matrix. Postmultiplication is also used by OpenGL ES' 1.x
   * glTranslate/glRotate/glScale.
   * @param scaleX The scale in the x-axis.
   * @param scaleY The scale in the y-axis.
   * @return This matrix for the purpose of chaining.
   */
  scale(scaleX, scaleY) {
    let tmp = this.#tmp;
    tmp[Matrix.M00] = scaleX;
    tmp[Matrix.M10] = 0;
    tmp[Matrix.M20] = 0;
    tmp[Matrix.M01] = 0;
    tmp[Matrix.M11] = scaleY;
    tmp[Matrix.M21] = 0;
    tmp[Matrix.M02] = 0;
    tmp[Matrix.M12] = 0;
    tmp[Matrix.M22] = 1;
    Matrix.mul(this.val, tmp);
    return this;
  }

  /**
   * Postmultiplies this matrix with a scale matrix. Postmultiplication is also used by OpenGL ES' 1.x
   * glTranslate/glRotate/glScale.
   * @param {Vector2} scale The vector to scale the matrix by.
   * @return This matrix for the purpose of chaining.
   */
  scaleVector(scale) {
    let tmp = this.#tmp;
    tmp[Matrix.M00] = scale.x;
    tmp[Matrix.M10] = 0;
    tmp[Matrix.M20] = 0;
    tmp[Matrix.M01] = 0;
    tmp[Matrix.M11] = scale.y;
    tmp[Matrix.M21] = 0;
    tmp[Matrix.M02] = 0;
    tmp[Matrix.M12] = 0;
    tmp[Matrix.M22] = 1;

    Matrix.mul(this.val, tmp);
    return this;
  }

  /**@param {Vector2}position*/
  getTranslation(position) {
    position.x = this.val[Matrix.M02];
    position.y = this.val[Matrix.M12];
    return position;
  }

  /**@param {Vector2}scale*/
  getScale(scale) {
    let val = this.val;
    scale.x = Math.sqrt(val[Matrix.M00] * val[Matrix.M00] + val[Matrix.M01] * val[Matrix.M01]);
    scale.y = Math.sqrt(val[Matrix.M10] * val[Matrix.M10] + val[Matrix.M11] * val[Matrix.M11]);
    return scale;
  }

  getRotation() {
    return Mathf.radiansToDegrees * Math.atan2(this.val[Matrix.M10], this.val[Matrix.M00]);
  }


  getRotationRad() {
    return Math.atan2(this.val[Matrix.M10], this.val[Matrix.M00]);
  }

  /**
   * Scale the matrix in the both the x and y components by the scalar value.
   * @param {number|Vector2} scale The single value that will be used to scale both the x and y components.
   * @return This matrix for the purpose of chaining methods together.
   */
  scl(scale) {
    let val = this.val;
    if (typeof scale == "number") {
      val[Matrix.M00] *= scale;
      val[Matrix.M11] *= scale;
    } else {
      val[Matrix.M00] *= scale.x;
      val[Matrix.M11] *= scale.y;
    }
    return this;
  }


  /**
   * Transposes the current matrix.
   * @return This matrix for the purpose of chaining methods together.
   */
  transpose() {
    // Where MXY you do not have to change MXX
    let val = this.val;
    let v01 = val[Matrix.M10];
    let v02 = val[Matrix.M20];
    let v10 = val[Matrix.M01];
    let v12 = val[Matrix.M21];
    let v20 = val[Matrix.M02];
    let v21 = val[Matrix.M12];
    val[Matrix.M01] = v01;
    val[Matrix.M02] = v02;
    val[Matrix.M10] = v10;
    val[Matrix.M12] = v12;
    val[Matrix.M20] = v20;
    val[Matrix.M21] = v21;
    return this;
  }
}
