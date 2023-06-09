import { ElementOptions, Point, Whiteboard } from '../index'

export default class SelectController {
  app: Whiteboard
  mousedownPoint: Point = {
    x: 0,
    y: 0
  }
  isMousedown: boolean = false
  padding: number = 5
  borderWidth: number = 2
  borderColor: string = 'rgba(121, 181, 254,0.8)'
  className: string = 'du-whiteboard__selection'
  idPrefix: string = 'whiteboard-selection-'

  constructor(app: Whiteboard) {
    this.app = app
  }

  create(options: ElementOptions) {
    const { x, y, width, height, id } = options
    console.log(x, y)
    const canvas = this.app.canvas
    const canvasOffsetLeft = canvas.offsetLeft
    const canvasOffsetTop = canvas.offsetTop
    const $selection = document.createElement('div')
    $selection.className = this.className

    $selection.id = `${this.idPrefix}${id}`
    $selection.style.position = 'absolute'
    $selection.style.left = `${x - this.padding + canvasOffsetLeft - this.borderWidth}px`
    $selection.style.top = `${y - this.padding + canvasOffsetTop - this.borderWidth}px`
    $selection.style.width = `${width + this.padding * 2}px`
    $selection.style.height = `${height + this.padding * 2}px`
    $selection.style.border = `${this.borderWidth}px dashed ${this.borderColor}`
    $selection.style.cursor = 'move'
    $selection.style.backgroundColor = 'rgba(114, 211, 242,0.1)'
    $selection.style.zIndex = '100'
    document.body.appendChild($selection)
    this.bindEvent($selection)
  }

  bindEvent(ele: HTMLDivElement) {
    ele.addEventListener('mousedown', this.onMousedown.bind(this))
    ele.addEventListener('mousemove', this.onMousemove.bind(this))
    ele.addEventListener('mouseup', this.onMouseup.bind(this))
    ele.addEventListener('mouseleave', this.onMouseleave.bind(this))
  }

  offEvent(ele: HTMLDivElement) {
    ele.removeEventListener('mousedown', this.onMousedown.bind(this))
    ele.removeEventListener('mousemove', this.onMousemove.bind(this))
    ele.removeEventListener('mouseup', this.onMouseup.bind(this))
    ele.removeEventListener('mouseleave', this.onMouseleave.bind(this))
  }

  remove(id: number) {
    const $selection = document.querySelector(`#${this.idPrefix}${id}`)
    if ($selection) {
      this.offEvent($selection as HTMLDivElement)
      document.body.removeChild($selection)
    }
  }

  onMousedown(e: MouseEvent) {
    this.isMousedown = true
    this.mousedownPoint = {
      x: e.clientX,
      y: e.clientY
    }
  }

  onMousemove(e: MouseEvent) {
    if (!this.isMousedown) return

    const { clientX, clientY } = e
    const { x: startX, y: startY } = this.mousedownPoint
    let dx = clientX - startX
    let dy = clientY - startY
    const target = e.target as HTMLDivElement

    const id = parseInt(target.id.split('-')[2])
    const element = this.app.elementFactory.getElement(id)

    const canvasOffsetLeft = this.app.canvas.offsetLeft
    const canvasOffsetTop = this.app.canvas.offsetTop
    const canvasOffsetRight = canvasOffsetLeft + this.app.canvas.width
    const canvasOffsetBottom = canvasOffsetTop + this.app.canvas.height

    if (element.start.x + dx < canvasOffsetLeft) {
      dx = canvasOffsetLeft - element.start.x
    }

    const maxRight = element.start.x + dx + element.width + this.padding * 2 + this.borderWidth * 2

    if (maxRight > canvasOffsetRight) {
      dx = canvasOffsetRight - element.start.x - element.width - this.padding * 2 - this.borderWidth * 2
    }

    if (element.start.y + dy < canvasOffsetTop) {
      dy = canvasOffsetTop - element.start.y
    }

    const maxBottom = element.start.y + dy + element.height + this.padding * 2 + this.borderWidth * 2
    if (maxBottom > canvasOffsetBottom) {
      dy = canvasOffsetBottom - element.start.y - element.height - this.padding * 2 - this.borderWidth * 2
    }

    target.style.transform = `translate(${dx}px, ${dy}px)`
    element.move(element.start.x + dx, element.start.y + dy)
    this.app.render()
  }

  onMouseup() {
    this.isMousedown = false
    this.mousedownPoint = {
      x: 0,
      y: 0
    }
  }

  onMouseleave() {
    if (this.isMousedown) {
      this.onMouseup()
    }
  }
}
