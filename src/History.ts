import { ElementObject, Whiteboard } from '../index'
import { EmitEventEnum } from './enum'

export default class History {
  app: Whiteboard
  redoList: ElementObject[] = []
  undoList: ElementObject[] = []

  constructor(app: Whiteboard) {
    this.app = app
  }

  /**
   * 设置状态
   */
  setStatus() {
    console.log('redo', this.redoList)
    console.log('undo', this.undoList)
    this.app.status.canUndo = this.canUndo()
    this.app.status.canRedo = this.canRedo()
    this.app.emit(EmitEventEnum.StatusChange)
  }

  /**
   * 添加元素
   */
  add(options: ElementObject) {
    this.undoList.unshift(options)
    this.setStatus()
  }

  /**
   * 重做
   */
  redo() {
    if (!this.canRedo()) {
      return
    }
    this.app.selection.selected()

    const item = this.redoList.shift()!

    const elementOption = this.undoList.find((ele) => item.id === ele.id)
    if (elementOption) {
      this.app.factory.deleteElement(elementOption.id)
    }
    this.undoList.unshift(item)

    this.app.factory.createElement(item.type, item)

    this.app.render()
    this.setStatus()
  }

  /**
   * 撤销
   */
  undo() {
    if (!this.canUndo()) {
      return
    }
    this.app.selection.selected()

    const item = this.undoList.shift()!
    this.redoList.unshift(item)
    this.app.factory.deleteElement(item.id)

    const elementOption = this.undoList.find((ele) => item.id === ele.id)

    if (elementOption) {
      this.app.factory.createElement(elementOption.type, elementOption)
    }

    this.app.render()
    this.setStatus()
  }

  /**
   *  是否可以重做
   */
  canRedo(): boolean {
    return this.redoList.length > 0
  }

  /**
   * 是否可以撤销
   */
  canUndo(): boolean {
    return this.undoList.length > 0
  }
}
