// React functions
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'

// Style
import componentStyles from './MenuBarButton2-CSS'
import 'assets/theme/textNoSelect.css'

const useStyles: any = makeStyles(componentStyles)

type Props = {
  caption: string
  selected: boolean
  marginTop?: number
  onClick: () => void
}

export default function MenuBarButton(props: Props) {
  const classes = useStyles()

  return (
    <Box
      className={`noSelect ${classes.main} ${props.selected ? classes.selected : null}`}
      style={{
        marginTop: props.marginTop === undefined ? 0 : props.marginTop
      }}
      onClick={props.onClick}
    >
      {props.caption}
    </Box>
  )
}
