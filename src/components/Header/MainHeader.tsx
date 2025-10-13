// Functions
import { makeStyles } from '@mui/styles'

// Components
import Box from '@mui/material/Box'
import Text from 'components/Tools/Text/Text'
import SmartIcon from 'components/Tools/Icons/SmartIcon'
import { Button } from '@mui/material'
import SyncProblemIcon from '@mui/icons-material/SyncProblem'

// Style
import themeColors from 'assets/theme/colors'
import componentStyles from './MainHeader-CSS'
import 'assets/theme/textNoSelect.css'

const useStyles: any = makeStyles(componentStyles)

type Props = {
  caption: string
  top: number
  left: number
  serverOnline: boolean
  plcOnline: boolean
  hasAlarms: boolean
  quitAlarms: () => void
}

export default function MainHeader(props: Props) {
  const classes = useStyles()

  return (
    <Box
      className={classes.mainBox}
      style={{
        width: '100%',
        marginLeft: props.left,
        height: props.top
      }}
    >
      <Box className={`noSelect ${classes.titleBox}`}>
        <Text text={props.caption} type="h3" marginLeft={30} />
      </Box>

      <Box className={classes.iconBox}>
        <SmartIcon
          icon="monitor"
          tooltip="Visualisierung"
          color={themeColors.success.darker}
        />
        <SmartIcon
          icon="swapHoriz"
          tooltip="Visualisierung &#8596; Server Verbindung"
          color={props.serverOnline ? themeColors.success.darker : undefined}
          marginLeft={10}
        />
        <SmartIcon
          icon="storage"
          tooltip={props.serverOnline ? 'Server Online' : 'Server Offline'}
          color={
            props.serverOnline
              ? themeColors.success.darker
              : themeColors.error.main
          }
          marginLeft={10}
        />
        <SmartIcon
          icon="swapHoriz"
          tooltip="Server &#8596; SPS Verbindung"
          color={props.plcOnline ? themeColors.success.darker : undefined}
          marginLeft={10}
        />
        <SmartIcon
          icon="dns"
          rotate="90deg"
          tooltip={props.plcOnline ? 'SPS Online' : 'SPS Offline'}
          color={
            props.plcOnline
              ? themeColors.success.darker
              : themeColors.error.main
          }
          marginLeft={10}
        />
      </Box>
      <Box className={classes.ackBox}>
        <Button
          variant={props.hasAlarms ? 'contained' : 'outlined'}
          color={props.hasAlarms ? 'warning' : 'inherit'}
          disabled={!props.hasAlarms}
          size="small"
          onClick={props.quitAlarms}
          startIcon={<SyncProblemIcon />}
        >
          Alarme quittieren
        </Button>
      </Box>
    </Box>
  )
}
