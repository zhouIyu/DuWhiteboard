import { ElementObject, ElementOptions, ElementType, Whiteboard } from '../../index'
import { ElementEventEnum } from '../enum'

export default class BaseElement {
  app: Whiteboard
  type: ElementType // 元素类型
  start: ElementOptions = { x: 0, y: 0, width: 0, height: 0 } // 元素起始位置
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
    this.start = {
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height
    }
    this.x = options.x || this.x
    this.y = options.y || this.y
    this.width = options.width || this.width
    this.height = options.height || this.height
    this.id = options.id || Date.now()

    this.app.on(ElementEventEnum.ElementUpdateComplete, this.onUpdateComplete.bind(this))
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

  onUpdateComplete(id: number) {
    if (id === this.id) {
      this.start = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      }
    }
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
      this.start = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      }
      this.app.controllerContainer.create(this.getOptions())
    } else if (!isSelected && this.isSelected) {
      this.app.controllerContainer.remove(this.id)
    }
    this.isSelected = isSelected
  }
}
