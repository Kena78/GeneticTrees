/**@type HTMLElement[]*/
let inputCells = []

function copyGenome() {
  /**@type Uint8Array*/
  let value = window.scene.genome.bytes;

  let array = Array.from(value);

  console.log(array);
  navigator.clipboard.writeText(JSON.stringify(array))
}

function fixDownUp() {
  console.log("fixDownUp")
  /**@type Genome*/
  let genome = window.scene.genome;
  let index = Object.getOwnPropertyNames(STATIC_SLICE).indexOf("downUp");
  console.log(index)
  for (let i = 0; i < genome.layersAmount; i++) {
    let byteIndex = index * genome.layersAmount + i;
    let byte = genome.bytes[byteIndex] - 128;
    console.log(byte);
    let progress = i / (genome.layersAmount - 1);
    let p1 = Math.pow(progress,3);
    byte =Mathf.lerp(0,byte,Math.pow(progress, 3))
    console.log(byte);
    genome.bytes[byteIndex] = byte + 128;
  }
  window.scene.updateGenome(genome)
}

function pasteGenome() {
  navigator.clipboard.readText().then(it => {
    console.log("it: ", it)
    let parse = JSON.parse(it);
    let names = Object.getOwnPropertyNames(parse);
    let array = new Uint8Array(parse);
    console.log("it: ", array)
    window.scene.updateGenome(new Genome(array))
  }).finally(it => {
    console.log(it);
  })
}
function mixGenomeFromClipboard() {
  navigator.clipboard.readText().then(it => {
    let parse = JSON.parse(it);
    let array = new Uint8Array(parse);
    let male = new Genome(array);
    /**@type Genome*/
    let female = window.scene.genome;
    window.scene.updateGenome(female.combine(male))
  }).finally(it => {
    console.log(it);
  })
}

function setupCells() {
  let element = document.getElementById("genome_container");
  let names = Object.getOwnPropertyNames(STATIC_SLICE);
  let amountOfSlices = 15;
  for (let paramIndex = 0; paramIndex < sliceLength; paramIndex++) {

    let textElement = document.createElement("p");
    textElement.innerText = names[paramIndex]
    element.appendChild(textElement)
    for (let sliceIndex = 0; sliceIndex < amountOfSlices; sliceIndex++) {
      let inputElement = document.createElement("input");
      let attr = document.createAttribute("type");
      attr.value = "text"
      inputElement.attributes.setNamedItem(attr)

      attr = document.createAttribute("class");
      attr.value = "value_input"
      inputElement.attributes.setNamedItem(attr)

      attr = document.createAttribute("id");
      let myIndex = sliceIndex + paramIndex * amountOfSlices;
      attr.value = "value_input_" + myIndex
      inputElement.attributes.setNamedItem(attr)
      inputCells[myIndex] = inputElement
      element.appendChild(inputElement)
    }
  }
}
function setupCells2() {
  let element = document.getElementById("genome_container");
  {
    let column = document.createElement("div");
    column.classList.add("slice_values")
    let names = Object.getOwnPropertyNames(STATIC_SLICE);
    for (let i = 0; i < sliceLength; i++) {
      let textElement = document.createElement("p");
      textElement.innerText = names[i]
      column.appendChild(textElement)
    }
    element.appendChild(column)
  }
  let number = 15;
  for (let i = 0; i < number; i++) {
    let column = document.createElement("div");
    column.classList.add("slice_values")
    for (let j = 0; j < sliceLength; j++) {
      let inputElement = document.createElement("input");
      let attr = document.createAttribute("type");
      attr.value = "text"
      inputElement.attributes.setNamedItem(attr)

      attr = document.createAttribute("class");
      attr.value = "value_input"
      inputElement.attributes.setNamedItem(attr)

      attr = document.createAttribute("id");
      let myIndex = i + j * number;
      attr.value = "value_input_" + myIndex
      inputElement.attributes.setNamedItem(attr)
      inputCells[myIndex] = inputElement
      column.appendChild(inputElement)
    }
    element.appendChild(column)
  }
}
