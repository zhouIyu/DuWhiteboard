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
  add() {
    const element = this.app.elementFactory.getActiveElementOptions()!
    this.undoList.push(element)
    this.setStatus()
  }

  /**
   * 重做
   */
  redo() {
    if (!this.canRedo()) {
      return
    }
    const item = this.redoList.pop()!
    this.undoList.push(item)
    this.app.elementFactory.createElement(item.type, item)
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
    const item = this.undoList.pop()!
    this.redoList.push(item)
    this.app.elementFactory.deleteElement(item.id)
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
