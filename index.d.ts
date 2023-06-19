export type ElementType = | 'base' | 'rect' | 'select'

export type UpdateType = | 'box' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

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
  factory: Factory
  history: History
  controller: Controller
  selection: Selection
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

  onUpdate (options: UpdateElementOptions): void
}

export interface Factory {
  elementList: BaseElement[]
  activeElement: BaseElement | null
  app: Whiteboard

  createElement (type: ElementType, options: ElementOptions): BaseElement

  setActiveElement (element: BaseElement): void

  getActiveElement (): BaseElement | null

  getActiveElementOptions (): ElementObject | null

  updateActiveElement (options: ElementOptions): void

  deleteElement (id: number): void

  render (): void

  onSelected (options: ElementOptions): void
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

export interface Controller {
  app: Whiteboard
  containerList: any[]

  create (options: ElementObject): void

  remove (id: number): void
}

export interface Selection {
  app: Whiteboard
  x: number
  y: number
  width: number
  height: number

  render (): void

  create (options: ElementOptions): void

  update (options: ElementOptions): void

  selected (): void

  remove (): void
}

export type UpdateElementOptions = {
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  id: number,
  type: UpdateType
}

