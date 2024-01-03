class DrawableObject{
  /**@type Uint16Array*/
  indecies
  /**@type Float32Array*/
  vertices

  constructor(indecies, verticies) {
    this.indecies = indecies;
    this.vertices = verticies;
  }
}

let Primitives = {
  generateCircle(x, y, radius, sides) {
    const delta = Math.PI * 2 / sides;
    const vertexSize = 3
    const vertices = new Float32Array((1+sides) * vertexSize);
    const indecies = new Uint16Array(sides * 3);
    vertices[0] = x
    vertices[1] = y
    vertices[2] = Colors.whiteFloatBits
    for (let sideIndex = 0; sideIndex < sides; sideIndex++) {
      let vertexIndex = (sideIndex + 1) * vertexSize;
      vertices[vertexIndex + 0] = Math.cos(delta * sideIndex) * radius + x
      vertices[vertexIndex + 1] = Math.sin(delta * sideIndex) * radius + y
      vertices[vertexIndex + 2] = Colors.whiteFloatBits

      let indexIndex = sideIndex * 3;
      indecies[indexIndex] = 0
      indecies[indexIndex + 1] =  sideIndex+1
      let number =  (sideIndex + 2) % (sides+1);
      indecies[indexIndex + 2] = (number === 0 ? 1 : number)
    }
    return new DrawableObject(indecies,vertices)

  }
}
