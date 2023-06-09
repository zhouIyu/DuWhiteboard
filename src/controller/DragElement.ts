import { Point, Whiteboard } from '../../index'

export default class DragElement {
  isMousedown: boolean = false
  mousedownPoint: Point = {
    x: 0,
    y: 0
  }
  lastMouseSize = {
    dx: 0,
    dy: 0
  }
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

  constructor(app: Whiteboard) {
    this.app = app
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
    document.body.removeChild(this.#_ele)
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
      dx: 0,
      dy: 0
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
      this.#_ele.style.top = `${top}px`
      dy = top - this.#_ele.offsetTop
    }

    if (this.#_ele.offsetLeft + this.#_ele.offsetWidth + dx > right - 10) {
      dx = right - this.#_ele.offsetLeft - this.#_ele.offsetWidth - 10
    }

    if (this.#_ele.offsetTop + this.#_ele.offsetHeight + dy > bottom - 10) {
      dy = bottom - this.#_ele.offsetTop - this.#_ele.offsetHeight - 10
    }

    this.#_ele.style.left = `${this.#_ele.offsetLeft + dx}px`
    this.#_ele.style.top = `${this.#_ele.offsetTop + dy}px`

    this.lastMouseSize = {
      dx,
      dy
    }
    this.mousedownPoint = {
      x: e.clientX,
      y: e.clientY
    }
  }

  onMouseup(e: MouseEvent) {
    if (e.target !== this.#_ele) return
    this.isMousedown = false
    this.lastMouseSize = {
      dx: 0,
      dy: 0
    }
    this.mousedownPoint = {
      x: 0,
      y: 0
    }
  }

  onMouseleave(e: MouseEvent) {
    if (e.target !== this.#_ele) return
    if (this.isMousedown) {
      this.onMouseup(e)
    }
  }
}
