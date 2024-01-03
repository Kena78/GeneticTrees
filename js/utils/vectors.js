class Vector2 {
  /**@type number*/
  x
  /**@type number*/
  y;
  add(x,y){
    this.x+=x;
    this.y+=y;
  }
  /**
   * @param {Vector2} other
   */
  set(other){
    this.x=other.x;
    this.y=other.y;
  }
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Vector3 {
  /**@type number*/
  x
  /**@type number*/
  y
  /**@type number*/
  z

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

