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

  deleteSelection() {
    const { x, y, width, height } = this
    const endX = x + width
    const endY = y + height
    this.app.elementFactory.elementList.forEach((element) => {
      if (element.type === 'select') return
      if (element.x >= x && element.y >= y && element.x + element.width <= endX && element.y + element.height <= endY) {
        element.setSelected(true)
      } else {
        element.setSelected(false)
      }
    })
  }
}
