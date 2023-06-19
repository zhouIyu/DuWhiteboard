import { ElementOptions, Whiteboard } from '../../index'
import Container from './Container'

export default class Controller {
  app: Whiteboard
  containerList: any[] = []

  constructor(app: Whiteboard) {
    this.app = app
  }

  create(options: ElementOptions) {
    console.log('create', options)
    const container = new Container(this.app, options)
    this.containerList.push(container)
  }

  remove(id: number) {
    const index = this.containerList.findIndex((item) => item.options.id === id)
    if (index !== -1) {
      const container = this.containerList[index]
      container.remove()
      this.containerList.splice(index, 1)
    }
  }
}
