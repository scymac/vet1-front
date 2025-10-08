import { ReactElement } from 'react'

export type ScreenDim = {
  height: number,
  width : number
}

export type Screens = 'measurement'|'report'|'setup'|'alarm'

export type DropdownOption   = {
  value: string,
  label: string|ReactElement
}

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left' | 'bottom-end' | 'bottom-start' | 'left-end' |
  'left-start' | 'right-end' | 'right-start' | 'top-end' | 'top-start' | undefined

export type ColorType = 'inherit' | 'success' | 'info' | 'error' | 'primary' | 'secondary' | 'warning'

export type CursorType = 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' |
  'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' |
  'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' |
  'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' |
  'grab' | 'grabbing'

export type PermissionType = 'user'|'admin'
export type ReportType = 1|2|3
