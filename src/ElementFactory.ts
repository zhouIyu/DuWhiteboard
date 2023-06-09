import { BaseElement, ElementOptions, Whiteboard, ElementType, ElementObject } from '../index'
import { ElementTypeEnum } from './enum'
import Rect from './element/Rect'
import Selection from './element/Selection'

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
      case ElementTypeEnum.Select:
        element = new Selection(this.app, options)
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
    const len = this.elementList.length
    if (len > 0) {
      const lastElement: BaseElement = this.elementList[len - 1]
      this.setActiveElement(lastElement)
    }
  }

  getElement(id: number) {
    return this.elementList.find((item) => item.id === id)!
  }

  selectionElement() {
    const element = this.getActiveElement()! as Selection
    element.deleteSelection()
    this.deleteElement(element.id)
  }

  cancelSelection() {
    this.elementList.forEach((item) => {
      item.setSelected(false)
    })
  }
}
