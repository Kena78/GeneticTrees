var mat = new Matrix()

/**@return WebGLRenderingContext*/
function initWebGL(canvas) {
  Gl = null;

  try {
    // Попытаться получить стандартный контекст. Если не получится, попробовать получить экспериментальный.
    let context = canvas.getContext("webgl");
    Gl = context || canvas.getContext("experimental-webgl");
  } catch (e) {
  }

  // Если мы не получили контекст GL, завершить работу
  if (!Gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    Gl = null;
  }

  return Gl;
}

/**@type WebGLRenderingContext*/
var Gl; // глобальная переменная для контекста WebGL

/**
 * @param {Camera} camera
 * @param {Shader} shader
 * @param {DrawableObject} circle
 * @param {number} radius
 * @param {number} dx
 * @param {number} dy
 */
function drawCircle(camera, shader, circle, radius, dx, dy) {
  let array = camera.array();
  camera.width /= radius
  camera.height /= radius
  camera.x -= dx * (1 / (radius));
  camera.y -= dy * (1 / (radius));
  camera.update()
  shader.setUniformMatrix3("u_matrix", camera.mat)
  Gl.drawElements(Gl.TRIANGLES, circle.indecies.length, Gl.UNSIGNED_SHORT, 0);
  camera.setFromArray(array)
  camera.update()
}

class DrawGenomeAgent {

  /**@type Agent[]*/
  agents
  /**@type Agent[]*/
  #newAgents
  /**@type {{x:number,y:number,radius:number,color:Color}[]}*/
  #drawQueue

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {Color} color
   * @param {boolean} realDrawing
   */

  drawCircle(x, y, radius, color, realDrawing = false) {
    if (!realDrawing) {
      this.#drawQueue.push({x, y, radius, color})
    }
    scene.shader.setUniform4f("u_color", 1, 1, 1, 0.5)
    let offset = 0.5;
    drawCircle(scene.camera, scene.shader, scene.drawObject, radius, x + offset, y + offset)
    scene.shader.setUniform4f("u_color", 0, 0, 0, 0.5)
    drawCircle(scene.camera, scene.shader, scene.drawObject, radius, x - offset, y - offset)
    scene.shader.setUniformColor("u_color", color)
    drawCircle(scene.camera, scene.shader, scene.drawObject, radius, x, y)
  }
  drawCircleLambda=(a,b,c,d)=>this.drawCircle(a,b,c,d)

  constructor(agents, layersAmount, genome) {
    this.agents = agents;
    this.layersAmount = layersAmount;
    this.genome = genome;
    this.#drawQueue=[]
  }

  get finished() {
    return this._finished === true
  }

  /**@type number*/
  #layerIndex
  /**@type number*/
  layersAmount
  /**@type number*/
  #nextAgentAmount
  /**@type number*/
  #newAgentIdx
  /**@type number*/
  #agentIndex
  /**@type Genome*/
  genome;
  /**@type {Slice|undefined}*/
  #nextSlice

  step() {
    // console.log("start", this._finished, this.finished)
    if (this.finished) return;
    if (this.#layerIndex === undefined) {
      this.#layerIndex = 0;
      this.#nextAgentAmount = Math.floor(this.agents[0].slice.numberOfBranches)
      this.startMainLoop()
      this.beginAgentLoop()
    }
    let layerToDraw = Number(document.getElementById("layer-amount").value);

    this.#drawAll()
    if (this.conditionAgentLoop()) {
      this.bodyAgentLoop(layerToDraw)
      this.endAgentLoop()
      if (this.conditionAgentLoop()) {
        this.#rerunMe();
        return;
      }
    }
    if (this.#layerIndex >= layerToDraw) {
      this._finished = true
      console.log("layerToDraw limit")
      return
    }
    this.agents = this.#newAgents
    this.endMainLoop();
    if (!this.conditionMainLoop()) {
      this._finished = true
      console.log("loop ended")
    }
    this.startMainLoop()
    this.beginAgentLoop()
    this.#rerunMe();
  }

  #drawAll() {
    let drawQueue = this.#drawQueue;
    for (let element of drawQueue) {
      this.drawCircle(element.x, element.y, element.radius, element.color, true)
    }
  }

  #rerunMe() {
    let self = this
    setTimeout(() => self.step())
  }

  endMainLoop() {
    this.#layerIndex++;
  }

  conditionMainLoop() {
    return this.#layerIndex < this.layersAmount;
  }

  conditionAgentLoop() {
    return this.#agentIndex < this.agents.length
  }

  bodyAgentLoop(layerToDraw) {
    /**@type Agent*/
    let agent = this.agents[this.#agentIndex];
    for (let j = 0; j < agent.lifetime; j++) {
      agent.drawSlice(this.drawCircleLambda)
    }
    if (this.#layerIndex + 1 < this.layersAmount && this.#layerIndex < layerToDraw) {

      for (let item of agent.createChildren(this.#nextSlice)) {
        this.#newAgents[this.#newAgentIdx++] = item;
      }
    }
  }

  endAgentLoop() {
    this.#agentIndex += 1
  }

  beginAgentLoop() {
    this.#agentIndex = 0;
  }

  startMainLoop() {
    this.#newAgentIdx = 0;
    console.log("drawing layer ", this.#layerIndex, "(agents to draw " + this.agents.length + ")")
    this.#nextSlice = this.#layerIndex + 1 < this.layersAmount ? this.genome.createSlice(this.#layerIndex + 1) : undefined;
    console.log(this.#nextSlice)
    this.#newAgents = new Array(this.#nextAgentAmount)
    if (this.#nextSlice) {
      this.#nextAgentAmount *= Math.floor(this.#nextSlice.numberOfBranches)
    }
  }
}

/**@type DrawGenomeAgent*/
var genomeDrawAgent;

/**
 * @param {Scene} scene
 * */
function drawGenome(scene) {
  const genome = scene.genome;
  for (let i = 0; i < inputCells.length; i++) {
    genome.bytes[i] = Number(inputCells[i].value)
  }
  /**@type Agent[]*/
  let agents = []
  let iterationsPerAgent = 10;
  agents.push(new Agent(genome.createSlice(0), 0, undefined, iterationsPerAgent))
  let layersAmount = genome.layersAmount
  if (genomeDrawAgent !== undefined && !genomeDrawAgent.finished) {
    genomeDrawAgent._finished = true;
  }
  genomeDrawAgent = new DrawGenomeAgent(agents, layersAmount, genome)
  genomeDrawAgent.step()
  genomeDrawAgent.step()
  genomeDrawAgent.step()
  if (true) return;
  // window.agents = agents
  let halfWhite = new Color(1, 1, 1, 0.5)
  let halfBlack = new Color(0, 0, 0, 0.5)
  /**@type {(x:number,y:number,radius:number,color:Color)=>void}*/

  let layerToDraw = Number(document.getElementById("layer-amount").value);
  let nextAgentAmount = Math.floor(agents[0].slice.numberOfBranches);
  for (let i = 0; i < layersAmount; i++) {
    let newAgents = new Array(nextAgentAmount)

    let newAgentIdx = 0;
    console.log("drawing layer ", i, "(agents to draw " + agents.length + ")")
    let nextSlice = i + 1 < layersAmount ? genome.createSlice(i + 1) : undefined;
    console.log(nextSlice)
    if (nextSlice) {
      nextAgentAmount *= Math.floor(nextSlice.numberOfBranches)
    }
    for (let agentIndex = 0; agentIndex < agents.length; agentIndex++) {
      let agent = agents[agentIndex];
      for (let j = 0; j < iterationsPerAgent; j++) {
        agent.drawSlice(drawer)
      }
      if (i + 1 < layersAmount && i < layerToDraw) {

        for (let item of agent.createChildren(nextSlice)) {
          newAgents[newAgentIdx++] = item;
        }
      }
    }
    if (i >= layerToDraw) break
    agents = newAgents
  }
  console.log("Drawing finished")
}

function randomGenome() {
  let amountOfSlices = 15;
  let bytes = sliceLength * amountOfSlices;
  let array = new Uint8Array(bytes);

  for (let i = 0; i < bytes; i++) {
    array[i] = Math.floor(Math.random() * 255)
  }
  /**@type Genome*/
  let genome = new Genome(array);
  let index = Object.getOwnPropertyNames(STATIC_SLICE).indexOf("sizeFromLevel");
  for (let i = 0; i < genome.layersAmount; i++) {
    let byteIndex = index * genome.layersAmount + i;
    genome.bytes[byteIndex] = 0;
  }
  return genome;
}

function clearScene() {
  Gl.clearColor(0.0, 0.0, 0.0, 0.0);
  // Gl.enable(Gl.DEPTH_TEST);
  Gl.depthFunc(Gl.LEQUAL);
  Gl.clear(Gl.COLOR_BUFFER_BIT | Gl.DEPTH_BUFFER_BIT);
}

function redraw() {
  drawGenome(window.scene);
}

function drawRandom() {
  clearScene();
  window.scene.updateGenome(randomGenome());
  redraw();
}

class Scene {
  /**@type DrawableObject*/
  drawObject
  /**@type Camera*/
  camera
  /**@type Shader*/
  shader
  /**@type Genome*/
  #genome

  /**
   * @param {Camera} camera
   * @param {Shader} shader
   * @param {DrawableObject} drawObject
   * @param {Genome} genome
   */
  constructor(camera, shader, drawObject, genome) {
    this.drawObject = drawObject;
    this.camera = camera;
    this.shader = shader;
    this.updateGenome(genome);
  }


  get genome() {
    return this.#genome;
  }

  /**
   * @param {Genome} value
   */
  updateGenome(value) {
    this.#genome = value;
    for (let i = 0; i < value.bytes.length; i++) {

      inputCells[i].value = value.bytes[i]
    }
  }
}

function startWebGl() {
  var canvas = document.getElementById("glcanvas");

  Gl = initWebGL(canvas); // инициализация контекста GL
  // продолжать только если WebGL доступен и работает

  if (!Gl) return;
  let shader = createShader(document.getElementById("fragment-shader").textContent.trim(),
    document.getElementById("vertex-shader").textContent.trim());
  let height = canvas.height;
  let width = canvas.width;
  let drawObject = Primitives.generateCircle(0, 0, 1, 50);
  window.scene = new Scene(
    new Camera(0, 0, width, height),
    shader,
    drawObject,
    randomGenome()
  )

  let vertexBuffer = Gl.createBuffer();
  Gl.bindBuffer(Gl.ARRAY_BUFFER, vertexBuffer);
  Gl.bufferData(Gl.ARRAY_BUFFER, drawObject.vertices, Gl.STATIC_DRAW);

  let indexBuffer = Gl.createBuffer();
  Gl.bindBuffer(Gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  Gl.bufferData(Gl.ELEMENT_ARRAY_BUFFER, drawObject.indecies, Gl.STATIC_DRAW);


  {

    let vertexSize = 12;

    let a_position = shader.fetchAttributeLocation("a_position");
    shader.enableVertexAttribute(a_position)

    shader.vertexAttribPointer(a_position, 2, Gl.FLOAT, false, vertexSize, 0)

    let a_color = shader.fetchAttributeLocation("a_color");
    shader.enableVertexAttribute(a_color)
    shader.vertexAttribPointer(a_color, 4, Gl.UNSIGNED_BYTE, true, vertexSize, 8)
  }
  shader.bind()
  drawRandom();
}

