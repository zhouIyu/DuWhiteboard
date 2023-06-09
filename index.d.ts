export type ElementType = | 'base' | 'rect' | 'select'

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

export type WhiteboardStatus = {
  type: ElementType
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
  controllerContainer: ControllerContainer
  status: WhiteboardStatus

  on: Function
  emit: Function
  off: Function

  initCanvas (): void

  bindEvent (): void

  onMousedown (e: MouseEvent): void

  onMousemove (e: MouseEvent): void

  onMouseup (): void

  onMouseleave (): void

  render (): void

  getStatus (): WhiteboardStatus

  setType (type: EventType): void

  setCursor (cursor: string): void
}

export interface BaseElement {
  app: Whiteboard
  id: number
  type: ElementType
  start: ElementOptions
  x: number
  y: number
  width: number
  height: number
  isSelected: boolean

  render (): void

  update (options: ElementOptions): void

  getOptions (): ElementObject

  setSelected (isSelected: boolean): void

  move (x: number, y: number): void

  changeSize (width: number, height: number): void

  onUpdateComplete (id: number): void
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

  getElement (id: number): BaseElement

  cancelSelection (): void

  selectionElement (): void
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

export interface ControllerContainer {
  app: Whiteboard
  isMousedown: boolean
  mousedownPoint: Point
  padding: number
  borderWidth: number
  borderColor: string
  className: string
  idPrefix: string

  create (options: ElementOptions): void

  remove (id: number): void

  bindEvent (ele: HTMLDivElement): void

  offEvent (ele: HTMLDivElement): void

  onMousedown (e: MouseEvent): void

  onMousemove (e: MouseEvent): void

  onMouseup (): void

  onMouseleave (): void
}

