export type WhiteboardOptions = {
  width?: number
  height?: number
}

export interface Whiteboard {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  isMousedown: boolean

  initCanvas (): void
}

export type ElementType = 'rect'

export type Point = {
  x: number
  y: number
}

export type ElementOptions = {
  x: number
  y: number
  width: number
  height: number
}

export interface BaseElement {
  type: string
  x: number
  y: number
  width: number
  height: number
  app: Whiteboard

  render (): void

  update (options: ElementOptions): void
}

export interface ElementFactory {
  elementList: BaseElement[]
  activeElement: BaseElement | null
  app: Whiteboard

  createElement (type: ElementType, options: ElementOptions): BaseElement

  setActiveElement (element: BaseElement): void

  getActiveElement (): BaseElement | null
}

