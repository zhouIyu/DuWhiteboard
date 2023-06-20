import DragElement from './DragElement'
import { ElementOptions, UpdateElementOptions, Whiteboard } from '../../index'
import { ElementEventEnum } from '../enum'

export default class Box extends DragElement {
  borderWidth: number = 2
  borderColor: string = 'rgba(121, 181, 254,0.8)'
  className: string = 'du-whiteboard__selection'
  idPrefix: string = 'whiteboard-selection-box'
  type: string = 'box'

  constructor(app: Whiteboard, options: ElementOptions) {
    super(app, options)
    this.options = options
    this.ele = this.create()
    this.bindEvent()
  }

  handleUpdate(options: UpdateElementOptions) {
    const left = parseInt(this.ele.style.left) + options.dx
    const top = parseInt(this.ele.style.top) + options.dy
    const height = parseInt(this.ele.style.height) + options.dh
    const width = parseInt(this.ele.style.width) + options.dw
    this.ele.style.left = `${left}px`
    this.ele.style.top = `${top}px`
    this.ele.style.width = `${width}px`
    this.ele.style.height = `${height}px`
  }

  create(): HTMLElement {
    const { x, y, width, height, id } = this.options
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
    return $selection
  }

  handleMove() {
    if (!this.isMousedown) return

    const { x, y } = this.lastMouseSize
    this.app.emit(ElementEventEnum.Update, {
      id: this.options.id!,
      dx: x,
      dy: y,
      dw: 0,
      dh: 0,
      type: this.type
    })
  }
}
