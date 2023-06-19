import { ElementOptions, UpdateElementOptions, Whiteboard } from '../../index'
import { DirectionEnum, ElementEventEnum } from '../enum'
import DragElement from './DragElement'

export default class Direction extends DragElement {
  type: DirectionEnum
  className: string = 'du-whiteboard__selection-direction'
  radius: number = 8

  constructor(app: Whiteboard, options: ElementOptions, type: DirectionEnum) {
    super(app, options)
    this.type = type
    this.ele = this.create()
    this.setPosition()
    this.bindEvent()
  }

  create(): HTMLElement {
    const $circle = document.createElement('div')
    $circle.className = this.className
    $circle.setAttribute('data-type', this.type)
    $circle.style.position = 'absolute'
    $circle.style.width = `${this.radius * 2}px`
    $circle.style.height = `${this.radius * 2}px`
    $circle.style.backgroundColor = 'rgba(121, 181, 254,1)'
    $circle.style.zIndex = '101'
    $circle.style.cursor = 'pointer'
    $circle.style.borderRadius = '50%'
    return $circle
  }

  setPosition() {
    const { x, y, width, height } = this.options
    const canvas = this.app.canvas
    const canvasOffsetLeft = canvas.offsetLeft
    const canvasOffsetTop = canvas.offsetTop
    let left = 0
    let top = 0
    let cursor = 'default'
    switch (this.type) {
      case DirectionEnum.TopLeft:
        left = x - this.radius + canvasOffsetLeft
        top = y - this.radius + canvasOffsetTop
        cursor = 'nw-resize'
        break
      case DirectionEnum.TopRight:
        left = x + width - this.radius + canvasOffsetLeft
        top = y - this.radius + canvasOffsetTop
        cursor = 'ne-resize'
        break
      case DirectionEnum.BottomLeft:
        left = x - this.radius + canvasOffsetLeft
        top = y + height - this.radius + canvasOffsetTop
        cursor = 'sw-resize'
        break
      case DirectionEnum.BottomRight:
        left = x + width - this.radius + canvasOffsetLeft + 5
        top = y + height - this.radius + canvasOffsetTop + 5
        cursor = 'se-resize'
        break
    }
    this.ele.style.cursor = cursor
    this.ele.style.left = `${left}px`
    this.ele.style.top = `${top}px`
  }

  handleMove() {
    if (!this.isMousedown) return
    const { dx, dy } = this.lastMouseSize
    this.app.emit(ElementEventEnum.Update, {
      id: this.options.id,
      dw: dx,
      dh: dy,
      dx: 0,
      dy: 0,
      type: this.type
    })
  }

  handleUpdate(options: UpdateElementOptions) {
    const { dx, dy } = options
    const left = parseInt(this.ele.style.left) + dx
    const top = parseInt(this.ele.style.top) + dy
    this.ele.style.left = `${left}px`
    this.ele.style.top = `${top}px`
  }
}
