import { BaseElement, ElementOptions, Whiteboard, ElementType } from '../index'
import { ElementTypeEnum } from './enum'
import { Rect } from './element'

export default class ElementFactory {
  elementList: BaseElement[] = []
  activeElement: BaseElement | null = null
  app: Whiteboard

  constructor(app: Whiteboard) {
    this.app = app
  }

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

  setActiveElement(element: BaseElement) {
    this.activeElement = element
  }

  getActiveElement(): BaseElement | null {
    return this.activeElement
  }
}
