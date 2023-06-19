import { ElementOptions, Whiteboard } from '../../index'
import ControllerRect from './Rect'
import ControllerCircle from './Circle'
import { DirectionEnum } from '../enum'

export default class Container {
  app: Whiteboard
  options: ElementOptions
  idPrefix: string = 'whiteboard-selection-'
  ele: HTMLElement
  rect: ControllerRect
  circleList: ControllerCircle[] = []

  constructor(app: Whiteboard, options: ElementOptions) {
    this.app = app
    this.options = options
    this.ele = this.create()
    this.rect = this.createRect()
    this.createCircle()
  }

  createRect() {
    const rect = new ControllerRect(this.app, this.options)
    this.ele.appendChild(rect.ele)
    return rect
  }

  createCircle() {
    const list = [DirectionEnum.BottomRight]
    list.forEach((type) => {
      const circle = new ControllerCircle(this.app, this.options, type)
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
    this.rect.remove()
    this.circleList.forEach((item) => item.remove())
    document.body.removeChild(this.ele)
  }
}
