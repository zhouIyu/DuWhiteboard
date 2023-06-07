import { ElementOptions, Point, WhiteboardOptions } from '../index'
import ElementFactory from './ElementFactory'

export default class Whiteboard {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number = 300
  height: number = 150
  elementFactory: ElementFactory
  isMousedown: boolean = false
  mousedownPoint: Point = {
    x: 0,
    y: 0
  }

  constructor(ele: string | HTMLCanvasElement, options: WhiteboardOptions = {}) {
    if (!ele) {
      throw new Error('ele is required')
    }
    if (typeof ele === 'string') {
      const $ele = document.querySelector(ele) as HTMLCanvasElement
      if (!$ele) {
        throw new Error('ele is not found')
      }
      this.canvas = $ele
    } else if (ele.tagName.toLowerCase() === 'canvas') {
      this.canvas = ele
    } else {
      throw new Error('ele must be a canvas element or a selector')
    }

    this.ctx = this.canvas.getContext('2d')!
    this.width = options.width || this.width
    this.height = options.height || this.height

    this.initCanvas()

    this.elementFactory = new ElementFactory(this)

    this.bindEvent()
  }

  initCanvas() {
    this.canvas.width = this.width
    this.canvas.height = this.height
  }

  bindEvent() {
    this.canvas.addEventListener('mousedown', this.onMousedown.bind(this))
    this.canvas.addEventListener('mousemove', this.onMousemove.bind(this))
    this.canvas.addEventListener('mouseup', this.onMouseup.bind(this))
  }

  onMousedown(e: MouseEvent) {
    this.isMousedown = true
    const { x, y } = e
    this.mousedownPoint = { x, y }
    this.elementFactory.createElement('rect', {
      x,
      y,
      width: 0,
      height: 0
    })
  }

  onMousemove(e: MouseEvent) {
    if (!this.isMousedown) {
      return
    }
    const { x, y } = e
    const { x: startX, y: startY } = this.mousedownPoint
    const dx = x - startX
    const dy = y - startY
    const width = Math.abs(dx)
    const height = Math.abs(dy)
    const options: ElementOptions = {
      width: width,
      height: height,
      x: startX,
      y: startY
    }
    if (dx < 0 || dy < 0) {
      options.x = x
      options.y = y
    }
    const element = this.elementFactory.getActiveElement()!
    element.update(options)
    this.render()
  }

  onMouseup() {
    this.isMousedown = false
    this.mousedownPoint = { x: 0, y: 0 }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.elementFactory.elementList.forEach((element) => {
      element.render()
    })
  }
}
