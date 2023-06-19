import { BaseElement, ElementOptions, Whiteboard, ElementType, ElementObject } from '../index'
import { ElementEventEnum, ElementTypeEnum } from './enum'
import Rect from './element/Rect'

export default class Factory {
  elementList: BaseElement[] = [] // 元素列表
  activeElement: BaseElement | null = null // 当前激活元素
  app: Whiteboard

  constructor(app: Whiteboard) {
    this.app = app
    this.app.on(ElementEventEnum.Selected, this.onSelected.bind(this))
  }

  /**
   * 创建元素
   * @param type
   * @param options
   */
  createElement(type: ElementType, options: ElementOptions) {
    let element: BaseElement
    switch (type) {
      case ElementTypeEnum.Rect:
        element = new Rect(this.app, options)
        break
      default:
        throw new Error('type is not supported')
    }
    this.elementList.push(element)
    this.setActiveElement(element)
    return element
  }

  /**
   * 设置当前激活元素
   * @param element
   */
  setActiveElement(element: BaseElement) {
    this.activeElement = element
  }

  /**
   * 获取当前激活元素
   */
  getActiveElement(): BaseElement | null {
    return this.activeElement
  }

  /**
   * 获取当前激活元素的选项
   */
  getActiveElementOptions(): ElementObject {
    const element = this.getActiveElement()!
    return element.getOptions()
  }

  updateActiveElement(options: ElementOptions) {
    const element = this.getActiveElement()!
    element.update(options)
  }

  /**
   * 删除元素
   * @param id
   */
  deleteElement(id: number) {
    const index = this.elementList.findIndex((item) => item.id === id)
    if (index > -1) {
      this.elementList.splice(index, 1)
    }
    const len = this.elementList.length
    if (len > 0) {
      const lastElement: BaseElement = this.elementList[len - 1]
      this.setActiveElement(lastElement)
    }
  }

  render() {
    this.elementList.forEach((item) => item.render())
  }

  onSelected(options: ElementOptions) {
    const { x, y, width, height } = options
    const endX = x + width
    const endY = y + height
    this.elementList.forEach((element) => {
      if (element.x >= x && element.y >= y && element.x + element.width <= endX && element.y + element.height <= endY) {
        element.setSelected(true)
      } else {
        element.setSelected(false)
      }
    })
  }
}
