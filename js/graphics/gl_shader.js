// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
// noinspection JSUnusedGlobalSymbols

class Shader {
  /**@type {(WebGLActiveInfo & {location:GLint})[]}*/
  attributes
  /**@type {(WebGLActiveInfo & {location:WebGLUniformLocation})[]}*/
  uniforms;
  /**@type WebGLShader*/
  #vertexShaderHandle;
  /**@type WebGLShader*/
  #fragmentShaderHandle;
  /**@type WebGLProgram*/
  #program;

  constructor(attributes, uniforms, vertexShaderHandle, fragmentShaderHandle, program) {
    this.attributes = attributes;
    this.uniforms = uniforms;
    this.#vertexShaderHandle = vertexShaderHandle;
    this.#fragmentShaderHandle = fragmentShaderHandle;
    this.#program = program;
  }

  /**
   * Sets the uniform with the given name. The {@link Shader} must be bound for this to work.
   * @param {string|WebGLUniformLocation} name
   * @param {number} value
   */
  setUniformi(name, value/**int*/) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform1i(location, value);
  }

  /**
   * Sets the uniform with the given name. The {@link Shader} must be bound for this to work.
   * @param {string|WebGLUniformLocation} name
   * @param {number} value1
   * @param {number} value2
   */
  setUniform2i(name, value1/**int*/, value2/**int*/) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform2i(location, value1, value2);
  }

  /**
   * Sets the uniform with the given name. The {@link Shader} must be bound for this to work.
   * @param {string|WebGLUniformLocation} name
   * @param {number} value1
   * @param {number} value2
   * @param {number} value3
   */
  setUniform3i(name, value1/**int*/, value2/**int*/, value3/**int*/) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform3i(location, value1, value2, value3);
  }

  /**
   * Sets the uniform with the given name. The {@link Shader} must be bound for this to work.
   * @param {string|WebGLUniformLocation} name
   * @param {number} value1
   * @param {number} value2
   * @param {number} value3
   * @param {number} value4
   */
  setUniform4i(name, value1/**int*/, value2/**int*/, value3/**int*/, value4/**int*/) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform4i(location, value1, value2, value3, value4);
  }

  /**
   * Sets the uniform with the given name. The {@link Shader} must be bound for this to work.
   * @param {string|WebGLUniformLocation}name the name of the uniform
   * @param {number|Vector2|Vector3}value the value
   */
  setUniformf(name, value) {
    let location = this.fetchUniformLocation(name);
    if (typeof value == "number") {
      Gl.uniform1f(location, value);
    } else {
      if (value.z) {
        this.setUniform3f(name, value.x, value.y, value.z);
      } else {
        this.setUniform2f(name, value.x, value.y);
      }
    }

  }

  /**
   * Sets the uniform with the given name. The {@link Shader} must be bound for this to work.

   * @param{Color} color
   * @param {string|WebGLUniformLocation} name
   */
  setUniformColor(name, color) {
    this.setUniform4f(name, color.r, color.g, color.b, color.a);
  }

  /**
   * Sets the uniform with the given name. The {@link Shader} must be bound for this to work.
   * @param {string|WebGLUniformLocation} name
   * @param {GLfloat} value1
   * @param {GLfloat} value2
   */
  setUniform2f(name, value1/**float*/, value2/**float*/) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform2f(location, value1, value2);
  }

  /**
   * Sets the uniform with the given name. The {@link Shader} must be bound for this to work.
   * @param name the name of the uniform
   * @param value1 the first value
   * @param value2 the second value
   * @param value3 the third value
   */
  setUniform3f(name, value1/**float*/, value2/**float*/, value3/**float*/) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform3f(location, value1, value2, value3);
  }

  /**
   * Sets the uniform with the given name. The {@link Shader} must be bound for this to work.
   * @param {string|WebGLUniformLocation} name
   * @param {number} value1
   * @param {number} value2
   * @param {number} value3
   * @param {number} value4
   */
  setUniform4f(name, value1/**float*/, value2/**float*/, value3/**float*/, value4/**float*/) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform4f(location, value1, value2, value3, value4);
  }

  /**
   * @param {string} name
   * @param {Float32Array | GLfloat[]} values
   */
  setUniform1fv(name, values/**float[]*/) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform1fv(location, values);
  }

  /**
   * @param {string} name
   * @param {Float32Array | GLfloat[]} values
   */
  setUniform2fv(name, values) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform2fv(location, values);
  }

  /**
   * @param {string} name
   * @param {Float32Array | GLfloat[]} values
   */
  setUniform3fv(name, values) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform3fv(location, values);
  }

  /**
   * @param {string} name
   * @param {Float32Array | GLfloat[]} values
   */
  setUniform4fv(name, values) {
    let location = this.fetchUniformLocation(name);
    Gl.uniform4fv(location, values);
  }

  /**
   * Sets the uniform matrix with the given name. The {@link Shader} must be bound for this to work.
   * @param name the name of the uniform
   * @param matrix the matrix
   setUniformMatrix(name, matrix/!**Mat*!/) {
   setUniformMatrix(name, matrix, false);
   }

   /!**
   * Sets the uniform matrix with the given name. The {@link Shader} must be bound for this to work.
   * @param name the name of the uniform
   * @param matrix the matrix
   * @param transpose whether the uniform matrix should be transposed
   *!/
   setUniformMatrix(name, matrix/!**Mat*!/, transpose/!**@type boolean*!/) {
   setUniformMatrix(this.fetchUniformLocation(name), matrix, transpose);
   }*/
  static #val4 = new Float32Array(4 * 4);
  static #val3 = new Float32Array(3 * 3);


  //mistakes were made
  /**@param {Matrix}matrix*/
  static #copyTransform(matrix) {
    this.#val4[4] = matrix.val[Matrix.M01];
    this.#val4[1] = matrix.val[Matrix.M10];

    this.#val4[0] = matrix.val[Matrix.M00];
    this.#val4[5] = matrix.val[Matrix.M11];
    this.#val4[10] = matrix.val[Matrix.M22];
    this.#val4[12] = matrix.val[Matrix.M02];
    this.#val4[13] = matrix.val[Matrix.M12];
    this.#val4[15] = 1;
    return this.#val4;
  }

  /**@param {Matrix}matrix*/
  static #copyTransform3(matrix) {
    let val3 = this.#val3;
    let val = matrix.val;
    for (let i = 0; i < val.length; i++) {
      val3[i] = val[i]
    }
    /* let i = 0;
     val3[i++] = val[Matrix.M00]
     val3[i++] = val[Matrix.M01]
     val3[i++] = val[Matrix.M02]

     val3[i++] = val[Matrix.M10]
     val3[i++] = val[Matrix.M11]
     val3[i++] = val[Matrix.M12]
     val3[i++] = val[Matrix.M20]

     val3[i++] = val[Matrix.M21]

     val3[i++] = val[Matrix.M22]*/
    return val3;
  }

  /**
   * @param {string} name
   * @param {Float32Array | GLfloat[]|Matrix} val
   */
  setUniformMatrix4(name, val) {
    if (Object.getPrototypeOf(val) === Matrix.prototype) {
      Gl.uniformMatrix4fv(this.fetchUniformLocation(name), false, Shader.#copyTransform(val));
    } else {
      Gl.uniformMatrix4fv(this.fetchUniformLocation(name), false, val);
    }
  }

  /**
   * @param {string} name
   * @param {Float32Array | GLfloat[]|Matrix} val
   */
  setUniformMatrix3(name, val) {
    if (Object.getPrototypeOf(val) === Matrix.prototype) {
      Gl.uniformMatrix3fv(this.fetchUniformLocation(name), false, Shader.#copyTransform3(val));
      // console.log(name)
      // Gl.uniform1fv(this.fetchUniformLocation(name),  Shader.#copyTransform3(val));
    } else {
      Gl.uniformMatrix3fv(this.fetchUniformLocation(name), false, val);
    }
  }

  /**
   * @param {string} name
   * @param {Float32Array | GLfloat[]} val
   */

  /*
      setUniformMatrix4(name, mat/!**Mat*!/) {
        Gl.uniformMatrix4fv(this.fetchUniformLocation(name), 1, false, copyTransform(mat), 0);
      }

      setUniformMatrix4(name, mat/!**Mat*!/, near/!**float*!/, far/!**float*!/) {
        Gl.uniformMatrix4fv(this.fetchUniformLocation(name), 1, false, copyTransform(mat, near, far), 0);
      }*/

  /**
   * Sets an array of uniform matrices with the given name. The {@link Shader} must be bound for this to work.
   * @param name the name of the uniform
   * @param buffer buffer containing the matrix data
   * @param transpose whether the uniform matrix should be transposed
   */
  /*setUniformMatrix3fv(name, FloatBuffer buffer, count/!**int*!/, transpose/!**@type boolean*!/){
    buffer.position(0);
    let location = this.fetchUniformLocation(name);
    Gl.uniformMatrix3fv(location, count, transpose, buffer);
  }*/

  /**
   * Sets an array of uniform matrices with the given name. The {@link Shader} must be bound for this to work.
   * @param name the name of the uniform
   * @param buffer buffer containing the matrix data
   * @param transpose whether the uniform matrix should be transposed
   */

  /*setUniformMatrix4fv(name, FloatBuffer buffer, count/!**int*!/, transpose/!**@type boolean*!/){
    buffer.position(0);
    let location = this.fetchUniformLocation(name);
    Gl.uniformMatrix4fv(location, count, transpose, buffer);
  }*/
  /**
   * @param {string|WebGLUniformLocation} name
   * @return WebGLUniformLocation
   * */

  fetchUniformLocation(name) {
    return typeof name == 'string' ? this.uniforms[name].location : name
  }

  /**
   * @param {*} name
   * @param {Float32Array | GLfloat[]} values
   */
  setUniformMatrix4fv(name, values) {
    Gl.uniformMatrix4fv(this.fetchUniformLocation(name), false, values);
  }


  /**
   * Sets the vertex attribute with the given name. The {@link Shader} must be bound for this to work.
   * @param name the attribute name
   * @param size the number of components, must be >= 1 and <= 4
   * @param type the type, must be one of GL20.GL_BYTE, GL20.GL_UNSIGNED_BYTE, GL20.GL_SHORT,
   * GL20.GL_UNSIGNED_SHORT,GL20.GL_FIXED, or GL20.GL_FLOAT. GL_FIXED will not work on the desktop
   * @param normalize whether fixed point data should be normalized. Will not work on the desktop
   * @param stride the stride in bytes between successive attributes
   * @param buffer the buffer containing the vertex attributes.
   setVertexAttribute(name, size/!**int*!/, type/!**int*!/, normalize/!**@type boolean*!/, stride/!**int*!/, Buffer buffer){
   let location = fetchAttributeLocation(name);
   if(location == -1) return;
   Gl.vertexAttribPointer(location, size, type, normalize, stride, buffer);
   }
   */
  /**
   * Sets the vertex attribute with the given name. The {@link Shader} must be bound for this to work.
   * @param name the attribute name
   * @param size the number of components, must be >= 1 and <= 4
   * @param type the type, must be one of GL20.GL_BYTE, GL20.GL_UNSIGNED_BYTE, GL20.GL_SHORT,
   * GL20.GL_UNSIGNED_SHORT,GL20.GL_FIXED, or GL20.GL_FLOAT. GL_FIXED will not work on the desktop
   * @param normalize whether fixed point data should be normalized. Will not work on the desktop
   * @param stride the stride in bytes between successive attributes
   * @param offset byte offset into the vertex buffer object bound to GL20.GL_ARRAY_BUFFER.
   */
  setVertexAttribute(name, size/**int*/, type/**int*/, normalize/**@type boolean*/, stride/**int*/, offset/**int*/) {
    let location = this.fetchAttributeLocation(name);
    if (location === -1) return;
    Gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
  }

  /**
   * Makes OpenGL ES 2.0 use this vertex and fragment shader pair.
   */

  bind() {
    if (this.#program === undefined) {
      throw "no program"
    }
    Gl.useProgram(this.#program);
  }

  /** Disposes all resources associated with this shader. Must be called when the shader is no longer used. */

  dispose() {
    if (this.disposed) return;

    Gl.useProgram(0);
    Gl.deleteShader(this.#vertexShaderHandle);
    Gl.deleteShader(this.#fragmentShaderHandle);
    Gl.deleteProgram(this.#program);
    this.disposed = true;
  }


  isDisposed() {
    return this.disposed;
  }

  /**
   * Disables the vertex attribute with the given name
   * @param name the vertex attribute name
   */
  disableVertexAttribute(name) {
    let location = this.fetchAttributeLocation(name);
    if (location === -1) return;
    Gl.disableVertexAttribArray(location);
  }

  /**
   * Enables the vertex attribute with the given name
   * @param name the vertex attribute name
   */
  enableVertexAttribute(name) {
    let location = this.fetchAttributeLocation(name);
    if (location === -1) return;
    Gl.enableVertexAttribArray(location);
  }

  /**
   * Sets the given attribute
   * @param name the name of the attribute
   * @param value1 the first value
   * @param value2 the second value
   * @param value3 the third value
   * @param value4 the fourth value
   */
  setAttributef(name, value1, value2, value3, value4) {
    let location = this.fetchAttributeLocation(name);
    Gl.vertexAttrib4f(location, value1, value2, value3, value4);
  }


  /**
   * @param {string|GLint} name
   * @param {number} size
   * @param {number} type
   * @param {boolean} normalize
   * @param {number} stride
   * @param {number} offset
   */
  vertexAttribPointer(name, size, type, normalize, stride, offset) {
    let location = this.fetchAttributeLocation(name);
    if (location === -1) return;
    Gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
  }

  /**
   * @param {string|GLint} name
   * @return GLint
   */
  fetchAttributeLocation(name) {
    // -1 == cached but not found
    return typeof name == 'string' ? this.attributes[name].location : name;
  }
}

const createShader = (function () {
  /**
   * @param {number} type
   * @param {string} text
   */
  function loadShader(type, text) {
    let shader = Gl.createShader(type);
    Gl.shaderSource(shader, text)
    Gl.compileShader(shader)
    if (!Gl.getShaderParameter(shader, Gl.COMPILE_STATUS)) {
      console.error(Gl.getShaderInfoLog(shader));
      console.log(text)
      return -1
    }
    return shader

  }

  function createProgram() {
    let program = Gl.createProgram();
    return program !== 0 ? program : -1;
  }

  /**@param program {WebGLProgram}
   * @param {WebGLShader} vertexShaderHandle
   * @param {WebGLShader} fragmentShaderHandle
   * */
  function linkProgram(program, vertexShaderHandle, fragmentShaderHandle) {
    if (program === -1) return -1;

    Gl.attachShader(program, vertexShaderHandle);
    Gl.attachShader(program, fragmentShaderHandle);
    Gl.linkProgram(program);

    let linked = Gl.getProgramParameter(program, Gl.LINK_STATUS);
    if (linked === "0") {
      alert(Gl.getProgramInfoLog(program));
      return -1;
    }

    return program;
  }

  /**
   * @param {string} vertexShader
   * @param {string} fragmentShader
   */
  function compileShaders(vertexShader, fragmentShader) {
    let vertexShaderHandle = loadShader(Gl.VERTEX_SHADER, vertexShader);
    let fragmentShaderHandle = loadShader(Gl.FRAGMENT_SHADER, fragmentShader);

    let noVertex = vertexShaderHandle === -1;
    let noFragment = fragmentShaderHandle === -1;
    if (noVertex && noFragment) {
      throw "cannot load vertex and fragment shader";
    } else if (noVertex) {
      throw "Cannot load vertex shader"
    } else if (noFragment) {
      throw "Cannot load fragment shader"
    }

    let program = linkProgram(createProgram(), vertexShaderHandle, fragmentShaderHandle);
    if (program === -1) {
      throw "Cannot load program"
    }

    return {
      vertexShaderHandle, fragmentShaderHandle, program
    }
  }

  /**
   * @param {{vertexShaderHandle: WebGLShader, fragmentShaderHandle: WebGLShader, program: WebGLProgram}} shader
   */
  function fetchAttributes(shader) {
    let programParameter = Gl.getProgramParameter(shader.program, Gl.ACTIVE_ATTRIBUTES);
    let attributes = {}
    for (let i = 0; i < programParameter; i++) {

      let info = Gl.getActiveAttrib(shader.program, i)
      let location = Gl.getAttribLocation(shader.program, info.name);
      attributes[info.name] = Object.assign(info, {location})
    }
    return attributes;
  }

  /**
   * @param {{vertexShaderHandle: WebGLShader, fragmentShaderHandle: WebGLShader, program: WebGLProgram}} shader
   */
  function fetchUniforms(shader) {
    let numUniforms = Gl.getProgramParameter(shader.program, Gl.ACTIVE_UNIFORMS);
    uniforms = {}

    for (let i = 0; i < numUniforms; i++) {

      let info = Gl.getActiveUniform(shader.program, i);
      let location = Gl.getUniformLocation(shader.program, info.name);
      uniforms[info.name] = Object.assign(info, {location});
    }
    return uniforms
  }


  return function (fragment, vertex) {
    let compiledShaders = compileShaders(vertex, fragment);
    if (compiledShaders == null) {
      throw "cannot load shader"
    }
    const attributes = fetchAttributes(compiledShaders);
    const uniforms = fetchUniforms(compiledShaders);
    let shader = new Shader(attributes, uniforms, compiledShaders.vertexShaderHandle, compiledShaders.fragmentShaderHandle, compiledShaders.program);
    return shader
  }


})()
