// Functions
import { ReactElement } from 'react'

// Components
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

// Icons
import MonitorIcon from '@mui/icons-material/Monitor'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import StorageIcon from '@mui/icons-material/Storage'
import DnsIcon from '@mui/icons-material/Dns'

// Style
import 'assets/theme/textNoSelect.css'

type Props = {
  icon        : string,
  visible?    : boolean,
  tooltip?    : string|ReactElement,
  rotate?     : string,
  width?      : number,
  height?     : number,
  marginLeft? : number,
  marginRight?: number,
  color?      : string
}

export default function SmartIcon(props: Props) {

  const getIcon = () => {
    switch (props.icon) {

      // React Icons
      case 'monitor': return (
        <MonitorIcon
          style = {{
            rotate: props.rotate === undefined ? '0deg' : props.rotate,
          }}
        />
      )
      case 'swapHoriz': return <SwapHorizIcon />
      case 'storage': return <StorageIcon />
      case 'dns': return <DnsIcon />
    }
  }

  const postStyleBox = {
    marginLeft:  props.marginLeft === undefined ? 0 : props.marginLeft,
    marginRight: props.marginRight === undefined ? 0 : props.marginRight,
    height:      props.height === undefined ? 25    : props.height,
    width:       props.width === undefined ? 25     : props.width,
    color:       props.color,
  }

  return (
    <div>
      {
        props.visible === undefined || props.visible
          ? (
            <Tooltip
              arrow
              title = {
            props.tooltip === undefined ? (
              ''
            ) : (
              <div style = {{ fontSize: 13 }}>{props.tooltip}</div>
            )
          }
              placement  = "bottom"
              enterDelay = {300}
            >
              <Box
                style = {postStyleBox}
              >
                {getIcon()}
              </Box>
            </Tooltip>
          )
          : null
      }
    </div>
  )
}
