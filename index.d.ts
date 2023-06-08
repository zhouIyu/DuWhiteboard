export type ElementType = | 'base' | 'rect'

export type Point = {
  x: number
  y: number
}

export type ElementOptions = {
  x: number
  y: number
  width: number
  height: number
  id?: number
}

export type ElementObject = ElementOptions & { type: ElementType, id: number }

export type WhiteboardOptions = {
  width?: number
  height?: number
}

export type EventType = ElementType | 'select'

export type WhiteboardStatus = {
  type: EventType
  canRedo: boolean
  canUndo: boolean
}

export interface Whiteboard {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  isMousedown: boolean
  isCreateElement: boolean
  mousedownPoint: Point
  elementFactory: ElementFactory
  history: History
  status: WhiteboardStatus

  on: Function
  emit: Function
  off: Function

  initCanvas (): void

  bindEvent (): void

  onMousedown (e: MouseEvent): void

  onMousemove (e: MouseEvent): void

  onMouseup (e: MouseEvent): void

  render (): void

  getStatus (): WhiteboardStatus

  setType (type: EventType): void

  setCursor (cursor: string): void
}

export interface BaseElement {
  id: number
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  app: Whiteboard

  render (): void

  update (options: ElementOptions): void

  getOptions (): ElementObject
}

export interface ElementFactory {
  elementList: BaseElement[]
  activeElement: BaseElement | null
  app: Whiteboard

  createElement (type: ElementType, options: ElementOptions): BaseElement

  setActiveElement (element: BaseElement): void

  getActiveElement (): BaseElement | null

  getActiveElementOptions (): ElementObject | null

  deleteElement (id: number): void
}

export interface History {
  app: Whiteboard
  redoList: ElementObject[]
  undoList: T[]

  add (): void

  redo (): void

  undo (): void

  canUndo (): boolean

  canRedo (): boolean
}

