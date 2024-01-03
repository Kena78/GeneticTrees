class Camera {
  mat = new Matrix()
  width
  height
  x
  y

  update() {
    this.mat.setOrtho(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
  }

  array() {
    return [this.x, this.y, this.width, this.height]
  }
  setFromArray(array){
    this.x=array[0]
    this.y=array[1]
    this.width=array[2]
    this.height=array[3]
  }

  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update()
  }
}
