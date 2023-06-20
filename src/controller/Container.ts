import { ElementOptions, Whiteboard } from '../../index'
import Box from './Box'
import Direction from './Direction'
import { DirectionEnum } from '../enum'

export default class Container {
  app: Whiteboard
  options: ElementOptions
  idPrefix: string = 'whiteboard-selection-'
  ele: HTMLElement
  box: Box
  circleList: Direction[] = []

  constructor(app: Whiteboard, options: ElementOptions) {
    this.app = app
    this.options = options
    this.ele = this.create()
    this.box = this.createBox()
    this.createDirection()
  }

  createBox() {
    const rect = new Box(this.app, this.options)
    this.ele.appendChild(rect.ele)
    return rect
  }

  createDirection() {
    const list = [DirectionEnum.BottomRight, DirectionEnum.BottomLeft, DirectionEnum.TopLeft, DirectionEnum.TopRight]
    list.forEach((type) => {
      const circle = new Direction(this.app, this.options, type)
      this.ele.appendChild(circle.ele)
      this.circleList.push(circle)
    })
  }

  create() {
    const $container = document.createElement('div')
    $container.id = `${this.idPrefix}${this.options.id}`
    document.body.appendChild($container)
    return $container
  }

  remove() {
    this.box.remove()
    this.circleList.forEach((item) => item.remove())
    document.body.removeChild(this.ele)
  }
}
