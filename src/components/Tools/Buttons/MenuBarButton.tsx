// React functions
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'

// Style
import componentStyles from './MenuBarButton-CSS'
import 'assets/theme/textNoSelect.css'

const useStyles:any = makeStyles(componentStyles)

type Props = {
  caption   : string,
  selected  : boolean,
  marginTop?: number,
  hasAlarms?: boolean,
  disabled ?: boolean,
  onClick   : () => void,
}

export default function MenuBarButton(props: Props) {

  const classes = useStyles()

  const [color, setColor] = useState('rgba(0,0,0,0)')
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      if (color === 'rgba(0,0,0,0)') setColor('rgba(255,150,100,0.35)')
      else setColor('rgba(0,0,0,0)')
    }, 1500)
    return () => clearInterval(interval)
  }, [color])

  const getBg = () => {
    if (hovered) return '#ffffff33'
    if (props.hasAlarms) return color
  }

  const onClick = () => {
    if (props.disabled === undefined || !props.disabled) props.onClick()
  }

  return (
    <Box
      className = {`noSelect 
        ${classes.main}
        ${props.selected ? classes.selected : null}
      `}
      style     = {{
        marginTop:  props.marginTop === undefined ? 0 : props.marginTop,
        background: getBg(),
        transition: !props.hasAlarms ? 'background 100ms' : 'background 1s',
        color:      props.disabled ? '#aaa' : undefined,
      }}
      onClick = {onClick}
      onMouseEnter = {() => setHovered(true)}
      onMouseLeave = {() => setHovered(false)}
    >
      {props.caption}
    </Box>
  )
}
