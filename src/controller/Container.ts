import { ElementObject, Whiteboard } from '../../index'
import ControllerRect from './Rect'

export default class Container {
  app: Whiteboard
  rectList: ControllerRect[] = []

  constructor(app: Whiteboard) {
    this.app = app
  }

  create(options: ElementObject) {
    console.log('create', options)
    const rect = new ControllerRect(this.app, options)
    this.rectList.push(rect)
  }

  remove(id: number) {
    const index = this.rectList.findIndex((item) => item.options.id === id)
    if (index !== -1) {
      const rect = this.rectList[index]
      rect.remove()
      this.rectList.splice(index, 1)
    }
  }
}
