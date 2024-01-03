class Genome {
  /**@type Uint8Array*/
  bytes
  /**@type number*/
  layersAmount


  /**
   * @param {Uint8Array} bytes
   */
  constructor(bytes) {
    this.bytes = bytes;
    this.layersAmount = bytes.length / sliceLength;
  }

  /**
   * @param {Genome} other
   * @param {(number)=>boolean} selector
   * @return Genome
   * */
  combine(other, selector = (it => Math.random() > 0.5)) {
    let newBytes = new Uint8Array(this.bytes.length)
    for (let i = 0; i < this.bytes.length; i++) {
      if (selector(i)) {
        newBytes[i] = this.bytes[i]
      } else {
        newBytes[i] = other.bytes[i]
      }
    }
    return new Genome(newBytes)
  }


  /**
   * @param {(number)=>number} generator
   * @param {(number)=>boolean} selector
   * */
  mutate(generator = () => Math.floor(Math.random() * 255), selector = (it => Math.random() > 0.5)) {
    for (let i = 0; i < this.bytes.length; i++) {
      if (selector(i)) {
        this.bytes[i] = generator(i)
      }
    }
  }

  /**
   * @param {number}sliceIndex
   * @return Slice
   * */
  createSlice(sliceIndex) {
    let slice = new Slice();
    let names = Object.getOwnPropertyNames(slice);
    for (let i = 0; i < names.length; i++) {
      let myValue = this.bytes[sliceIndex + i * this.layersAmount];
      let name = names[i];
      let hisValue = slice[name];
      if (hisValue !== undefined) {
        slice[name] = hisValue.map(myValue);
      } else {
        slice[name] = myValue;
      }

    }

    console.log(slice.red, slice.green, slice.blue)
    return slice
  }
}

function rangedValues(start, end) {
  return {map: (val) => Mathf.lerp(start, end, ((val - 128) / 128 + 1) / 2)}
}

const unitRanged = {map: (val) => ((val - 128) / 128 + 1) / 2}
const __zero__ = {map: (val) => 0}


class Slice {
  /**@type number*/
  length = rangedValues(60, 100)          //amount of circles
  /**@type number*/
  lengthDeviation = {map: (val) => (val - 128) / 128 * 4}     //random length offset
  /**@type number*/
  size = rangedValues(0.1, 10)               //thickness of segment
  /**@type number*/
  sizeChanges = rangedValues(-1, 1)         //delta size per step
  /**@type number*/
  sizeFromAncestor = unitRanged    //lerp between parent size and my size
  /**@type number*/
  sizeFromLevel       //lerp between calculated size and precalculated level size
  /**@type number*/
  red = unitRanged
  /**@type number*/
  green = unitRanged
  /**@type number*/
  blue = unitRanged
  /**@type number*/
  redChanges = unitRanged     //delta color component1 per step
  /**@type number*/
  greenChanges = unitRanged        //delta color component2 per step
  /**@type number*/
  blueChanges = unitRanged      //delta color component3 per step
  /**@type number*/
  colorFromAncestor = unitRanged      //lerp between parent color and my color
  /**@type number*/
  colorDeviation = __zero__      //random changed in start color of segment
  /**@type number*/
  numberOfBranches = rangedValues(1, 3)
  /**@type number*/
  angleOfBranches = rangedValues(0, Math.PI / 2)
  /**@type number*/
  angleDeviation      //random angle offset
  /**@type number*/
  turn = rangedValues(-Math.PI * 2 / 30, Math.PI * 2 / 30)                //delta angle for every step
  /**@type number*/
  randomTurn = rangedValues(-1, 1)          //random changes in agent direction
  /**@type number*/
  downUp = rangedValues(-1, 1)

  /**@type number*/

  constructor(length,
              lengthDeviation,
              size,
              sizeChanges,
              sizeFromAncestor,
              sizeFromLevel,
              red,
              green,
              blue,
              redChanges,
              greenChanges,
              blueChanges,
              colorFromAncestor,
              colorDeviation,
              numberOfBranches,
              angleOfBranches,
              angleDeviation,
              turn,
              randomTurn,
              downUp) {
    if (length === undefined) return
    this.length = length              //amount of circles
    this.lengthDeviation = lengthDeviation     //random length offset
    this.size = size                //thickness of segment
    this.sizeChanges = sizeChanges         //delta size per step
    this.sizeFromAncestor = sizeFromAncestor    //lerp between parent size and my size
    this.sizeFromLevel = sizeFromLevel       //lerp between calculated size and precalculated level size
    this.red = red
    this.green = green
    this.blue = blue
    this.redChanges = redChanges          //delta color component1 per step
    this.greenChanges = greenChanges        //delta color component2 per step
    this.blueChanges = blueChanges         //delta color component3 per step
    this.colorFromAncestor = colorFromAncestor   //lerp between parent color and my color
    this.colorDeviation = colorDeviation      //random changed in start color of segment
    this.numberOfBranches = numberOfBranches
    this.angleOfBranches = angleOfBranches
    this.angleDeviation = angleDeviation      //random angle offset
    this.turn = turn                //delta angle for every step
    this.randomTurn = randomTurn          //random changes in agent direction
    this.downUp = downUp
  }
}

class Agent {
  /**@type Vector2*/
  position = new Vector2(0, -window.scene.camera.height / 4)
  /**@type Slice*/
  slice
  /**@type Color*/
  color
  /**@type number*/
  angle = Math.PI / 2
  /**@type number*/
  size
  /**@type {-1,0,1}*/
  centerState
  /**@type Color*/
  deltaColor
  /**@type number*/
  speed
  /**@type number*/
  #totalLength
  /**@type number*/
  #lifetime
  /**@type number*/
  #time = 0

  get lifetime() {
    return this.#lifetime
  }

  /**
   * @param {Slice} mySlice
   * @param {-1|0|1} centerState
   * @param {Agent} parent
   * @param {number} iterationsPerAgent
   */
  constructor(mySlice, centerState, parent, iterationsPerAgent) {
    this.slice = mySlice;
    this.centerState = centerState;
    {
      let colorDeviation = new Color(Math.random(), Math.random(), Math.random()).mul(mySlice.colorDeviation)
      this.color = new Color(mySlice.red, mySlice.green, mySlice.blue);
      if (parent) {
        this.color.lerp(parent.color, mySlice.colorFromAncestor)
      }
      this.color.add(colorDeviation)
      this.deltaColor = new Color(mySlice.redChanges, mySlice.greenChanges, mySlice.blueChanges).div(iterationsPerAgent * 10)
    }
    {
      this.#totalLength = mySlice.length + mySlice.lengthDeviation * (Math.random() * 2 - 1)
      this.#lifetime = iterationsPerAgent
      this.speed = this.#totalLength / iterationsPerAgent;
    }
    this.size = mySlice.size
    if (!parent) return
    this.position.set(parent.position)
    this.angle = (parent.angle + Math.random() * mySlice.angleDeviation + parent.slice.angleOfBranches * centerState) % Mathf.tau
    this.size = Mathf.lerp(this.size, parent.size, mySlice.sizeFromAncestor)
  }

  /**@return Agent[]*/
  createChildren(nextSlice) {
    let branches = this.slice.numberOfBranches;
    /**@type Agent[]*/
    let children = []
    for (let i = 0; i < branches; i++) {
      let number = i - (branches - 1) / 2;
      children.push(new Agent(nextSlice, number > 0 ? 1 : (number < 0 ? -1 : 0), this, this.#lifetime))
    }
    return children
  }

  /**
   * @param {(x:number,y:number,radius:number,color:Color)=>void} drawer
   * */
  drawSlice(drawer) {
    let sin = Math.sin(this.angle);
    let cos = Math.cos(this.angle);
    drawer(this.position.x, this.position.y, this.size, this.color)
    this.position.add(cos * this.speed, sin * this.speed)
    let slice = this.slice;
    {
      // let angle1 = this.angle;
      this.angle += slice.turn * this.centerState + slice.randomTurn * Math.random()
      if (slice.downUp !== 0) {
        let a = this.angle;
        let b = slice.downUp > 0 ? -Mathf.halfPi : Mathf.halfPi
        let deltaAngle = Math.min((a - b) < 0 ? a - b + Mathf.tau : a - b, (b - a) < 0 ? b - a + Mathf.tau : b - a);
        if (b - a > Mathf.pi || b - a < 0) {
          deltaAngle = -deltaAngle
        } else if (b - a === Mathf.pi || b - a === 0) {
          deltaAngle = 0
        }
        this.angle = (a + deltaAngle * Math.abs(slice.downUp) + Mathf.tau * 2) % Mathf.tau
      }
      // console.log("delta_angle", this.angle - angle1)
    }
    this.size += slice.sizeChanges
    // this.color.add(this.deltaColor)
    this.#time++;
  }

  /**/
}

const STATIC_SLICE = new Slice();
const sliceLength = Object.getOwnPropertyNames(STATIC_SLICE).length
