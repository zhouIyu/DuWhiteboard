import { ElementOptions, ElementType, Whiteboard } from '../../index'
import BaseElement from './BaseElement'

export default class Rect extends BaseElement {
  type: ElementType = 'rect'

  constructor(app: Whiteboard, options: ElementOptions) {
    super(app, options)
  }

  render() {
    const ctx = this.app.ctx
    ctx.save()
    ctx.beginPath()
    ctx.rect(this.x, this.y, this.width, this.height)
    ctx.stroke()
    ctx.restore()
  }
}
