const WIDTH = window.innerWidth
// const HEIGHT = window.innerHeight
const RATIO = window.devicePixelRatio || 2
const STAGE_LAYERS = ['bg', 'ga', 'ui'] // background game ui

let document = window.document

export function createCanvas ({className, width = WIDTH, height = WIDTH, type = '2d'}) {
  let el = document.createElement('canvas')
  let pen = el.getContext(type)
  el.width = width * RATIO
  el.height = height * RATIO
  el.style.width = `${width}px`
  el.style.height = `${height}px`
  pen.scale(RATIO, RATIO)
  return {pen, el}
}
export function createStage (id = 'np-stage', width = WIDTH, height = WIDTH) {
  let stage = {}
  stage.el = id instanceof window.HTMLElement ? id : document.getElementById(`#${id}`)
  if (!stage.el) {
    stage.el = document.createElement('div')
    stage.el.id = 'np-stage'
    document.body.appendChild(stage.el)
  }

  stage.el.classList.add('np-stage-panel')
  stage.el.style.width = `${width}px`
  stage.el.style.height = `${height}px`

  STAGE_LAYERS.forEach((item) => {
    let layer = createCanvas({className: `layer-${item}`})
    stage.el.appendChild(layer.el)
    stage[item] = layer
  })
  return stage
}
