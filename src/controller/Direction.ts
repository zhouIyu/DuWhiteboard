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
        left = x - this.radius - this.padding + canvasOffsetLeft
        top = y - this.radius - this.padding + canvasOffsetTop
        cursor = 'nwse-resize'
        break
      case DirectionEnum.TopRight:
        left = x + width - this.radius + this.padding + canvasOffsetLeft
        top = y - this.radius - this.padding + canvasOffsetTop
        cursor = 'nesw-resize'
        break
      case DirectionEnum.BottomLeft:
        left = x - this.radius - this.padding + canvasOffsetLeft
        top = y + height - this.radius + this.padding + canvasOffsetTop
        cursor = 'nesw-resize'
        break
      case DirectionEnum.BottomRight:
        left = x + width - this.radius + this.padding + canvasOffsetLeft
        top = y + height - this.radius + this.padding + canvasOffsetTop
        cursor = 'nwse-resize'
        break
    }
    this.ele.style.cursor = cursor
    this.ele.style.left = `${left}px`
    this.ele.style.top = `${top}px`
  }

  handleMove() {
    if (!this.isMousedown) return
    const { x, y } = this.lastMouseSize

    let dw = 0
    let dh = 0
    let dx = 0
    let dy = 0
    switch (this.type) {
      case DirectionEnum.TopLeft:
        dw = -x
        dh = -y
        dx = x
        dy = y
        break
      case DirectionEnum.TopRight:
        dw = x
        dh = -y
        dx = 0
        dy = y
        break
      case DirectionEnum.BottomLeft:
        dw = -x
        dh = y
        dx = x
        dy = 0
        break
      case DirectionEnum.BottomRight:
        dw = x
        dh = y
        dx = 0
        dy = 0
        break
    }

    this.app.emit(ElementEventEnum.Update, {
      id: this.options.id,
      dw,
      dh,
      dx,
      dy,
      type: this.type
    })
    this.options.width += dw
    this.options.height += dh
    this.options.x += dx
    this.options.y += dy
  }

  handleUpdate(options: UpdateElementOptions) {
    if (options.type === 'box') {
      const { dx, dy } = options
      this.options.x += dx
      this.options.y += dy
    } else {
      const { dw, dh, dx, dy } = options
      this.options.width += dw
      this.options.height += dh
      this.options.x += dx
      this.options.y += dy
    }
    this.setPosition()
  }
}
