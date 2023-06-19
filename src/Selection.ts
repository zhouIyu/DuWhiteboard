import { ElementOptions, Whiteboard } from '../index'
import { ElementEventEnum } from './enum'

export default class Selection {
  app: Whiteboard
  x: number = 0
  y: number = 0
  width: number = 0
  height: number = 0

  constructor(app: Whiteboard) {
    this.app = app
  }

  render() {
    const ctx = this.app.ctx
    ctx.save()
    ctx.beginPath()
    ctx.rect(this.x, this.y, this.width, this.height)
    ctx.strokeStyle = 'rgba(121, 181, 254,0.1)'
    ctx.stroke()
    ctx.fillStyle = 'rgba(114, 211, 242,0.1)'
    ctx.fill()
    ctx.restore()
  }

  create(options: ElementOptions) {
    this.x = options.x || this.x
    this.y = options.y || this.y
    this.width = options.width || this.width
    this.height = options.height || this.height
  }

  update(options: ElementOptions) {
    this.x = options.x
    this.y = options.y
    this.width = options.width
    this.height = options.height
  }

  selected() {
    const { x, y, width, height } = this
    this.app.emit(ElementEventEnum.Selected, {
      x,
      y,
      width,
      height
    })
    this.remove()
  }

  remove() {
    this.update({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    })
  }
}
