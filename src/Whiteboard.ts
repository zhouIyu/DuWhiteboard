import { ElementOptions, ElementType, EventType, Point, WhiteboardOptions, WhiteboardStatus } from '../index'
import ElementFactory from './ElementFactory'
import History from './History'
import EventEmitter from 'eventemitter3'
import { EmitEventEnum, EventTypeEnum } from './enum'

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
    type: EventTypeEnum.Select,
    canRedo: false,
    canUndo: false
  }

  elementFactory: ElementFactory
  history: History

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
    this.elementFactory = new ElementFactory(this)
    this.history = new History(this)

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
    this.canvas.addEventListener('mousedown', this.onMousedown.bind(this))
    this.canvas.addEventListener('mousemove', this.onMousemove.bind(this))
    this.canvas.addEventListener('mouseup', this.onMouseup.bind(this))
  }

  /**
   * 鼠标按下
   * @param {MouseEvent} e
   */
  onMousedown(e: MouseEvent) {
    const { x, y } = e
    this.isMousedown = true
    this.mousedownPoint = { x, y }
    if (this.isCreateElement) {
      // 创建元素
      this.elementFactory.createElement(this.status.type as ElementType, {
        x,
        y,
        width: 0,
        height: 0
      })
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
    if (this.isCreateElement) {
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
      const element = this.elementFactory.getActiveElement()!
      element.update(options)
      this.render()
    }
  }

  /**
   * 鼠标抬起
   */
  onMouseup() {
    this.isMousedown = false
    this.mousedownPoint = { x: 0, y: 0 }
    if (this.isCreateElement) {
      this.history.add()
    }
  }

  /**
   * 渲染
   */
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.elementFactory.elementList.forEach((element) => {
      element.render()
    })
  }

  getStatus(): WhiteboardStatus {
    return this.status
  }

  setType(type: string) {
    this.status.type = type as EventType
    let cursor = 'default'
    switch (type) {
      case EventTypeEnum.Select:
        this.isCreateElement = false
        break
      case EventTypeEnum.Rect:
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
