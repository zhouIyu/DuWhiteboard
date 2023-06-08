import { ElementObject, ElementOptions, ElementType, Whiteboard } from '../../index'

export default class BaseElement {
  app: Whiteboard
  type: ElementType // 元素类型
  // 元素位置 左上角坐标
  x: number = 0
  y: number = 0
  // 元素大小
  width: number = 0
  height: number = 0
  // 元素id
  readonly id: number

  constructor(app: Whiteboard, options: ElementOptions) {
    this.type = 'base'
    this.app = app
    this.x = options.x || this.x
    this.y = options.y || this.y
    this.width = options.width || this.width
    this.height = options.height || this.height
    this.id = options.id || Date.now()
  }

  render() {
    throw new Error('render is not implemented')
  }

  /**
   * 更新元素
   * @param options
   */
  update(options: ElementOptions) {
    this.x = options.x
    this.y = options.y
    this.width = options.width
    this.height = options.height
  }

  /**
   * 获取元素选项
   */
  getOptions(): ElementObject {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      id: this.id,
      type: this.type
    }
  }
}
