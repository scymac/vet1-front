// Functions
import { makeStyles } from '@mui/styles'

// Types
import { ScreenDim } from 'types/types'

// Components
import Box from '@mui/material/Box'

// Styles
import componentStyles from './ReportView-CSS'

const useStyles:any = makeStyles(componentStyles)

type Props = {}

export default function MeasurementView(props:Props) {

  const classes = useStyles()

  return (
    <Box>

      report view

    </Box>

  )
}
