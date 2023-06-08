import { BaseElement, ElementOptions, Whiteboard, ElementType, ElementObject } from '../index'
import { ElementTypeEnum } from './enum'
import { Rect } from './element'

export default class ElementFactory {
  elementList: BaseElement[] = [] // 元素列表
  activeElement: BaseElement | null = null // 当前激活元素
  app: Whiteboard

  constructor(app: Whiteboard) {
    this.app = app
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

  /**
   * 删除元素
   * @param id
   */
  deleteElement(id: number) {
    const index = this.elementList.findIndex((item) => item.id === id)
    if (index > -1) {
      this.elementList.splice(index, 1)
    }
  }
}
