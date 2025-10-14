// React
import { ReactElement } from 'react'

// Mui
import Tooltip from '@mui/material/Tooltip'

// Style
import themeColors from 'assets/theme/colors'

// Types
import { CursorType } from 'types/types'

import './Text.css'
import { Typography } from '@mui/material'
import { noSelect } from 'assets/theme/noSelect'

type Props = {
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p1' | 'p2' | 'p3'
  fontSize?: number | string
  fontWeight?: number
  text: string
  color?: string
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  noSelect?: boolean
  fontStyle?: string
  lineHeight?: number | string
  tooltip?: string | ReactElement
  cursor?: CursorType
}

export default function Text(props: Props) {
  const getFontSize = () => {
    if (props.fontSize !== undefined) return props.fontSize
    if (props.type !== undefined) {
      switch (props.type) {
        case 'h1':
          return 30
        case 'h2':
          return 24
        case 'h3':
          return 20
        case 'h4':
          return 18
        case 'h5':
          return 16
        case 'p1':
          return 14
        case 'p2':
          return 13
        case 'p3':
          return 12
      }
    }
    return 14
  }
  const getMarginTop = () => {
    if (props.marginTop !== undefined) return props.marginTop
    if (props.type !== undefined) {
      switch (props.type) {
        case 'h1':
          return 20
        case 'h2':
          return 20
        case 'h3':
          return 10
        case 'h4':
          return 5
        case 'h5':
          return 5
        case 'p1':
          return 3
        case 'p2':
          return 2
        case 'p3':
          return 2
      }
    }
    return 5
  }
  const getMarginBottom = () => {
    if (props.marginBottom !== undefined) return props.marginBottom
    if (props.type !== undefined) {
      switch (props.type) {
        case 'h1':
          return 20
        case 'h2':
          return 20
        case 'h3':
          return 10
        case 'h4':
          return 5
        case 'h5':
          return 5
        case 'p1':
          return 3
        case 'p2':
          return 2
        case 'p3':
          return 2
      }
    }
    return 5
  }
  const getFontWeight = () => {
    if (props.fontWeight !== undefined) return props.fontWeight
    if (props.type !== undefined) {
      switch (props.type) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
          return 600
        case 'p1':
        case 'p2':
        case 'p3':
          return 400
      }
    }
    return 400
  }

  return (
    <Tooltip
      arrow
      title={
        props.tooltip === undefined ? (
          ''
        ) : (
          <div style={{ fontSize: 13 }}>{props.tooltip}</div>
        )
      }
      placement="bottom"
      enterDelay={300}
    >
      <Typography
        sx={{
          marginTop: getMarginTop(),
          marginBottom: getMarginBottom(),
          marginLeft: props.marginLeft,
          marginRight: props.marginRight,
          fontWeight: getFontWeight(),
          fontSize: getFontSize(),
          fontStyle: props.fontStyle,
          lineHeight: props.lineHeight === undefined ? 1.5 : props.lineHeight,
          color:
            props.color === undefined ? themeColors.gray.dark : props.color,
          cursor: props.cursor,
          ...(props.noSelect ? noSelect : undefined)
        }}
      >
        {props.text}
      </Typography>
    </Tooltip>
  )
}
