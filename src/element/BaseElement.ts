import { ElementObject, ElementOptions, ElementType, UpdateElementOptions, Whiteboard } from '../../index'
import { ElementEventEnum } from '../enum'

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
  isSelected: boolean = false

  constructor(app: Whiteboard, options: ElementOptions) {
    this.type = 'base'
    this.app = app
    this.x = options.x || this.x
    this.y = options.y || this.y
    this.width = options.width || this.width
    this.height = options.height || this.height
    this.id = options.id || Date.now()

    this.app.on(ElementEventEnum.Update, this.onUpdate.bind(this))
  }

  onUpdate(options: UpdateElementOptions) {
    if (options.id === this.id) {
      const x = options.dx + this.x
      const y = options.dy + this.y
      const width = options.dw + this.width
      const height = options.dh + this.height
      this.update({ x, y, width, height })
      this.app.render()
    }
  }

  render() {
    throw new Error('render is not implemented')
  }

  /**
   * 更新元素
   * @param options
   */
  update(options: ElementOptions) {
    this.move(options.x, options.y)
    this.changeSize(options.width, options.height)
  }

  move(x: number, y: number) {
    this.x = x
    this.y = y
  }

  changeSize(width: number, height: number) {
    this.width = width
    this.height = height
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

  setSelected(isSelected: boolean) {
    if (isSelected && !this.isSelected) {
      this.app.controller.create(this.getOptions())
    } else if (!isSelected && this.isSelected) {
      this.app.controller.remove(this.id)
    }
    this.isSelected = isSelected
  }
}
