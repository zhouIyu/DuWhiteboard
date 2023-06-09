import DragElement from './DragElement'
import { ElementObject, ElementOptions, Whiteboard } from '../../index'

export default class ControllerRect extends DragElement {
  options: ElementOptions
  padding: number = 5
  borderWidth: number = 2
  borderColor: string = 'rgba(121, 181, 254,0.8)'
  className: string = 'du-whiteboard__selection'
  idPrefix: string = 'whiteboard-selection-'

  constructor(app: Whiteboard, options: ElementObject) {
    super(app)
    this.options = options
    this.ele = this.create()
    this.bindEvent()
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
    document.body.appendChild($selection)
    return $selection
  }

  onMousemove(e: MouseEvent) {
    super.onMousemove(e)
    const { dx, dy } = this.lastMouseSize
    const element = this.app.elementFactory.getElement(this.options.id!)
    element.move(element.x + dx, element.y + dy)
    this.app.render()
  }
}
