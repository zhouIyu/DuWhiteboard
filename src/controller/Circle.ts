import { Point, Whiteboard } from '../../index'
import { DirectionEnum, ElementEventEnum } from '../enum'

export default class ControllerCircle {
  app: Whiteboard
  type: DirectionEnum
  isMousedown: boolean = false
  mousedownPoint: Point = {
    x: 0,
    y: 0
  }
  ele: HTMLDivElement
  parent: HTMLDivElement
  className: string = 'du-whiteboard__selection-circle'
  radius: number = 8
  parentStartOptions: DOMRect
  id: number = 0

  constructor(app: Whiteboard, type: DirectionEnum, parent: HTMLDivElement) {
    this.app = app
    this.type = type
    this.parent = parent
    this.parentStartOptions = parent.getBoundingClientRect()
    this.id = parseInt(this.parent.id.split('-')[2])
    this.ele = this.create()
    this.parent.appendChild(this.ele)
    this.setPosition()
    this.bindEvent()
    this.app.on(ElementEventEnum.ElementUpdate, this.onUpdate.bind(this))
    this.app.on(ElementEventEnum.ElementUpdateComplete, this.onUpdateComplete.bind(this))
  }

  create(): HTMLDivElement {
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

  onUpdate(id: number) {
    if (id === this.id) {
      this.setPosition()
    }
  }

  onUpdateComplete(id: number) {
    if (id === this.id) {
      this.parentStartOptions = this.parent.getBoundingClientRect()
    }
  }

  setPosition() {
    const { width, height } = this.parent.getBoundingClientRect()
    const borderWidth = this.parent.style.borderWidth ? parseInt(this.parent.style.borderWidth) : 0
    let leftValue = 0
    let topValue = 0
    let cursor = ''
    const temp = this.radius + borderWidth
    switch (this.type) {
      case DirectionEnum.TopLeft:
        leftValue = -temp
        topValue = -temp
        cursor = 'nw-resize'
        break
      case DirectionEnum.TopRight:
        leftValue = width - temp
        topValue = -temp
        cursor = 'ne-resize'
        break
      case DirectionEnum.BottomLeft:
        leftValue = -temp
        topValue = height - temp
        cursor = 'sw-resize'
        break
      case DirectionEnum.BottomRight:
        leftValue = width - temp
        topValue = height - temp
        cursor = 'se-resize'
        break
    }
    this.ele.style.left = `${leftValue}px`
    this.ele.style.top = `${topValue}px`
    this.ele.style.cursor = cursor
  }

  bindEvent() {
    this.ele.addEventListener('mousedown', this.onMousedown.bind(this), false)
    this.ele.addEventListener('mousemove', this.onMousemove.bind(this), false)
    this.ele.addEventListener('mouseup', this.onMouseup.bind(this), false)
    this.ele.addEventListener('mouseleave', this.onMouseleave.bind(this), false)
  }

  onMousedown(e: MouseEvent) {
    this.isMousedown = true
    this.mousedownPoint = {
      x: e.clientX,
      y: e.clientY
    }
  }

  onMousemove(e: MouseEvent) {
    if (!this.isMousedown) {
      return
    }
    const { clientX, clientY } = e
    const { x, y } = this.mousedownPoint
    let dx = clientX - x
    let dy = clientY - y

    let translateX = 0
    let translateY = 0

    switch (this.type) {
      case DirectionEnum.TopLeft:
        translateX = dx
        translateY = dy
        dx = -dx
        dy = -dy
        break
      case DirectionEnum.TopRight:
        translateX = 0
        translateY = dy
        dy = -dy
        break
      case DirectionEnum.BottomLeft:
        translateX = dx
        translateY = 0
        dx = -dx
        break
      case DirectionEnum.BottomRight:
        translateX = 0
        translateY = 0
        break
    }

    const parentWidth = this.parentStartOptions.width + dx
    const parentHeight = this.parentStartOptions.height + dy

    if (parentWidth < 20 || parentHeight < 20) {
      return
    }

    const element = this.app.elementFactory.getElement(this.id)

    this.parent.style.width = `${parentWidth}px`
    this.parent.style.height = `${parentHeight}px`
    this.parent.style.transform = `translate(${translateX}px, ${translateY}px)`

    element.update({
      x: element.start.x + translateX,
      y: element.start.y + translateY,
      width: element.start.width + dx,
      height: element.start.height + dy
    })
    this.app.render()
    this.app.emit(ElementEventEnum.ElementUpdate, this.id)
  }

  onMouseup() {
    this.isMousedown = false
    this.mousedownPoint = { x: 0, y: 0 }
    this.app.emit(ElementEventEnum.ElementUpdateComplete, this.id)
  }

  onMouseleave() {
    if (this.isMousedown) {
      this.onMouseup()
    }
  }
}
