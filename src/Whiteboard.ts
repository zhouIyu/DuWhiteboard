import { ElementOptions, ElementType, Point, WhiteboardOptions, WhiteboardStatus } from '../index'
import Factory from './Factory'
import History from './History'
import EventEmitter from 'eventemitter3'
import { ElementEventEnum, ElementTypeEnum, EmitEventEnum } from './enum'
import Controller from './controller'
import Selection from './Selection'

export default class Whiteboard {
  canvas: HTMLCanvasElement // 画布
  ctx: CanvasRenderingContext2D // 画布上下文
  width: number = 300 // 默认宽度
  height: number = 150 // 默认高度

  isCreateElement: boolean = false // 是否正在创建元素
  isMousedown: boolean = false // 是否按下鼠标
  mousedownPoint: Point = {
    // 按下鼠标时的坐标
    x: 0,
    y: 0
  }

  status: WhiteboardStatus = {
    // 白板状态
    type: ElementTypeEnum.Select,
    canRedo: false,
    canUndo: false
  }

  factory: Factory
  history: History
  controller: Controller
  selection: Selection

  on: Function
  emit: Function
  off: Function

  constructor(ele: string | HTMLCanvasElement, options: WhiteboardOptions = {}) {
    if (!ele) {
      throw new Error('ele is required')
    }
    if (typeof ele === 'string') {
      const $ele: HTMLCanvasElement = document.querySelector(ele) as HTMLCanvasElement
      if (!$ele) {
        throw new Error('ele is not found')
      }
      this.canvas = $ele
    } else if (ele.tagName.toLowerCase() === 'canvas') {
      this.canvas = ele
    } else {
      throw new Error('ele must be a canvas element or a selector')
    }

    // event emitter
    const eventEmitter = new EventEmitter()

    this.on = eventEmitter.on.bind(eventEmitter)
    this.emit = eventEmitter.emit.bind(eventEmitter)
    this.off = eventEmitter.off.bind(eventEmitter)

    // 初始化canvas
    this.ctx = this.canvas.getContext('2d')!
    this.width = options.width || this.width
    this.height = options.height || this.height

    this.initCanvas()

    // 加载模块
    this.factory = new Factory(this)
    this.history = new History(this)
    this.controller = new Controller(this)
    this.selection = new Selection(this)

    // 绑定事件
    this.bindEvent()
  }

  /**
   * 初始化canvas
   */
  initCanvas() {
    this.canvas.width = this.width
    this.canvas.height = this.height
  }

  /**
   * 绑定事件
   */
  bindEvent() {
    const { canvas } = this
    canvas.addEventListener('mousedown', this.onMousedown.bind(this))
    canvas.addEventListener('mousemove', this.onMousemove.bind(this))
    canvas.addEventListener('mouseup', this.onMouseup.bind(this))
    canvas.addEventListener('mouseleave', this.onMouseleave.bind(this))
  }

  onMouseleave() {
    if (this.isMousedown) {
      this.onMouseup()
    }
  }

  /**
   * 鼠标按下
   * @param {MouseEvent} e
   */
  onMousedown(e: MouseEvent) {
    const { x, y } = e
    this.isMousedown = true
    this.mousedownPoint = { x, y }
    const options: ElementOptions = {
      x,
      y,
      width: 0,
      height: 0
    }
    if (this.status.type === ElementTypeEnum.Select) {
      this.selection.create(options)
    } else {
      this.factory.createElement(this.status.type as ElementType, options)
    }
  }

  /**
   * 鼠标移动
   * @param {MouseEvent} e
   */
  onMousemove(e: MouseEvent) {
    if (!this.isMousedown) {
      return
    }
    const { x, y } = e
    const { x: startX, y: startY } = this.mousedownPoint
    const dx = x - startX
    const dy = y - startY
    // 更新元素
    const width = Math.abs(dx)
    const height = Math.abs(dy)
    const options: ElementOptions = {
      width: width,
      height: height,
      x: dx < 0 ? x : startX,
      y: dy < 0 ? y : startY
    }

    if (this.status.type === ElementTypeEnum.Select) {
      this.selection.update(options)
    } else {
      this.factory.updateActiveElement(options)
    }
    this.render()
  }

  /**
   * 鼠标抬起
   */
  onMouseup() {
    this.isMousedown = false
    this.mousedownPoint = { x: 0, y: 0 }
    if (this.isCreateElement) {
      this.emit(ElementEventEnum.UpdateComplete, this.factory.getActiveElement()!.id)
    } else {
      this.selection.selected()
      this.render()
    }
  }

  /**
   * 渲染
   */
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.factory.render()
    if (this.status.type === ElementTypeEnum.Select) {
      this.selection.render()
    }
  }

  getStatus(): WhiteboardStatus {
    return this.status
  }

  setType(type: string) {
    this.status.type = type as ElementTypeEnum
    let cursor = 'default'
    switch (type) {
      case ElementTypeEnum.Select:
        this.isCreateElement = false
        break
      case ElementTypeEnum.Rect:
        this.isCreateElement = true
        cursor = 'crosshair'
        break
      default:
        this.isCreateElement = false
    }
    this.setCursor(cursor)
    this.emit(EmitEventEnum.StatusChange)
  }

  setCursor(cursor: string) {
    this.canvas.style.cursor = cursor
  }
}
