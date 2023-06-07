import { ElementOptions, Whiteboard } from '../../index'

export default class BaseElement {
  type: string
  x: number = 0
  y: number = 0
  width: number = 0
  height: number = 0
  app: Whiteboard

  constructor(app: Whiteboard, options: ElementOptions) {
    this.type = 'base'
    this.app = app
    this.x = options.x || this.x
    this.y = options.y || this.y
    this.width = options.width || this.width
    this.height = options.height || this.height
  }

  render() {
    throw new Error('render is not implemented')
  }

  update(options: ElementOptions) {
    this.x = options.x
    this.y = options.y
    this.width = options.width
    this.height = options.height
  }
}
