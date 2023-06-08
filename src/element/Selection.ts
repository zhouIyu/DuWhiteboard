import BaseElement from './BaseElement'
import { ElementOptions, ElementType, Whiteboard } from '../../index'

export default class Selection extends BaseElement {
  type: ElementType = 'select'
  id: number = 0

  constructor(app: Whiteboard, options: ElementOptions) {
    super(app, options)
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
}
