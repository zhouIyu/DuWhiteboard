import { ElementOptions, Point, Whiteboard } from '../../index'
import ControllerCircle from './Circle'
import { DirectionEnum } from '../enum'

export default class Container {
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
  elementId: number = 0

  constructor(app: Whiteboard) {
    this.app = app
  }

  create(options: ElementOptions) {
    const { x, y, width, height, id } = options
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
    const list = [DirectionEnum.BottomLeft, DirectionEnum.BottomRight, DirectionEnum.TopLeft, DirectionEnum.TopRight]

    list.forEach((type) => {
      new ControllerCircle(this.app, type, $selection)
    })
    this.bindEvent($selection)
  }

  bindEvent(ele: HTMLDivElement) {
    ele.addEventListener('mousedown', this.onMousedown.bind(this), false)
    ele.addEventListener('mousemove', this.onMousemove.bind(this), false)
    ele.addEventListener('mouseup', this.onMouseup.bind(this), false)
    ele.addEventListener('mouseleave', this.onMouseleave.bind(this), false)
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
    if (e.target !== e.currentTarget) return
    this.isMousedown = true
    this.mousedownPoint = {
      x: e.clientX,
      y: e.clientY
    }
    this.elementId = parseInt((e.target as HTMLDivElement).id.split('-')[2])
  }

  onMousemove(e: MouseEvent) {
    if (!this.isMousedown) return

    const { clientX, clientY } = e
    const { x: startX, y: startY } = this.mousedownPoint
    let dx = clientX - startX
    let dy = clientY - startY
    const target = e.target as HTMLDivElement

    const element = this.app.elementFactory.getElement(this.elementId)

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

  onMouseup(e: MouseEvent) {
    if (e.target !== e.currentTarget) return
    this.isMousedown = false
    this.mousedownPoint = {
      x: 0,
      y: 0
    }
    if (this.elementId === 0) return
    const element = this.app.elementFactory.getElement(this.elementId)
    element.onUpdateComplete(this.elementId)
  }

  onMouseleave(e: MouseEvent) {
    if (e.target !== e.currentTarget) return
    if (this.isMousedown) {
      this.onMouseup(e)
    }
  }
}
