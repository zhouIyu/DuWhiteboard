import { ElementOptions, Point, UpdateElementOptions, Whiteboard } from '../../index'
import { ElementEventEnum } from '../enum'

export default class DragElement {
  isMousedown: boolean = false
  mousedownPoint: Point = {
    x: 0,
    y: 0
  }
  lastMouseSize = {
    x: 0,
    y: 0
  }
  padding: number = 5
  type: string = ''
  // 抽象方法
  // @ts-ignore
  #_ele: HTMLElement

  get ele(): HTMLElement {
    return this.#_ele
  }

  set ele(value: HTMLElement) {
    this.#_ele = value
  }

  app: Whiteboard
  options: ElementOptions

  constructor(app: Whiteboard, options: ElementOptions) {
    this.app = app
    this.options = { ...options }
    this.app.on(ElementEventEnum.Update, this.onUpdate.bind(this))
  }

  bindEvent() {
    this.#_ele.addEventListener('mousedown', this.onMousedown.bind(this))
    this.#_ele.addEventListener('mousemove', this.onMousemove.bind(this))
    this.#_ele.addEventListener('mouseup', this.onMouseup.bind(this))
    this.#_ele.addEventListener('mouseleave', this.onMouseleave.bind(this))
  }

  offEvent() {
    this.#_ele.removeEventListener('mousedown', this.onMousedown.bind(this))
    this.#_ele.removeEventListener('mousemove', this.onMousemove.bind(this))
    this.#_ele.removeEventListener('mouseup', this.onMouseup.bind(this))
    this.#_ele.removeEventListener('mouseleave', this.onMouseleave.bind(this))
  }

  create(): HTMLElement {
    throw new Error('子类必须实现create方法')
  }

  remove() {
    this.offEvent()
  }

  onMousedown(e: MouseEvent) {
    if (e.target !== this.#_ele) return
    this.isMousedown = true
    this.mousedownPoint = {
      x: e.clientX,
      y: e.clientY
    }
    this.lastMouseSize = {
      x: 0,
      y: 0
    }
  }

  onMousemove(e: MouseEvent) {
    if (e.target !== this.#_ele) return
    if (!this.isMousedown) return
    let dx = e.clientX - this.mousedownPoint.x
    let dy = e.clientY - this.mousedownPoint.y

    const { left, top, right, bottom } = this.app.canvas.getBoundingClientRect()

    if (this.#_ele.offsetLeft + dx < left) {
      dx = left - this.#_ele.offsetLeft
    }

    if (this.#_ele.offsetTop + dy < top) {
      dy = top - this.#_ele.offsetTop
    }

    if (this.#_ele.offsetLeft + this.#_ele.offsetWidth + dx > right - this.padding * 2) {
      dx = right - this.#_ele.offsetLeft - this.#_ele.offsetWidth - this.padding * 2
    }

    if (this.#_ele.offsetTop + this.#_ele.offsetHeight + dy > bottom - this.padding * 2) {
      dy = bottom - this.#_ele.offsetTop - this.#_ele.offsetHeight - this.padding * 2
    }

    this.lastMouseSize = {
      x: dx,
      y: dy
    }
    this.mousedownPoint = {
      x: e.clientX,
      y: e.clientY
    }

    this.handleMove()

    this.#_ele.style.left = `${this.#_ele.offsetLeft + dx}px`
    this.#_ele.style.top = `${this.#_ele.offsetTop + dy}px`
  }

  onMouseup(e: MouseEvent) {
    if (e.target !== this.#_ele) return
    this.isMousedown = false
    this.lastMouseSize = {
      x: 0,
      y: 0
    }
    this.mousedownPoint = {
      x: 0,
      y: 0
    }
    this.handleMoveUp()
    this.app.emit(ElementEventEnum.UpdateComplete, this.options.id)
  }

  onMouseleave(e: MouseEvent) {
    if (e.target !== this.#_ele) return
    if (this.isMousedown) {
      this.onMouseup(e)
    }
  }

  onUpdate(options: UpdateElementOptions) {
    if (options.type === this.type) return
    if (options.id === this.options.id) {
      this.handleUpdate(options)
    }
  }

  handleMove() {}

  handleMoveUp() {}

  handleUpdate(_options: UpdateElementOptions) {}
}
