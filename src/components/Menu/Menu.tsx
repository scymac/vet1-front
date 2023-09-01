// Functions
import { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { useAlert } from 'react-alert'

// Types
import { PermissionType, ScreenDim, Screens } from 'types/types'

// Components
import Box from '@mui/material/Box'
import Text from 'components/Tools/Text/Text'
import MenuBarButton from 'components/Tools/Buttons/MenuBarButton'

// Images
import logo from 'assets/logo/vonroll_logo_white.png'

// Style
import { Divider } from '@mui/material'
import IconButton from 'components/Tools/Buttons/IconButton'
import PasswordModal from 'components/Tools/Modals/PasswordModal'
import { ApiAdminLogin } from 'api/Requests'
import componentStyles from './Menu-CSS'

const useStyles:any = makeStyles(componentStyles)

type Props = {
  screenDimensions: ScreenDim,
  width           : number,
  permission      : PermissionType,
  hasAlarms       : boolean,
  disableReports  : boolean,
  onClick         : (screen:Screens) => void,
  setPermission   : (val:PermissionType) => void
}

export default function MainLayout(props:Props) {

  const classes = useStyles()
  const alert   = useAlert()

  const [showPassModal, setShowPassModal] = useState(false)

  const checkAdminPassword = async (password:string) => {
    try {
      const res = await ApiAdminLogin(password)
      if (res.ok) {
        const response = res.message as string
        if (res.message === 'ok') {
          props.setPermission('admin')
          alert.success('Admin-Modus aktiviert')
        }
        else if (res.message === 'fail') alert.error('falsches Passwort')
        else alert.error('Server Fehler')
      }
      else alert.error('Server Fehler')
    }
    catch {
      alert.error('Server Offline')
    }
  }

  return (
    <>
      <PasswordModal
        show             = {showPassModal}
        close            = {() => { setShowPassModal(false) }}
        onConfirm        = {checkAdminPassword}
        screenDimensions = {props.screenDimensions}
        title            = "ADMIN PASSWORD"
        confirmColor     = "primary"
      />
      <Box
        className = {classes.mainBox}
        width     = {props.width}
        height    = {props.screenDimensions.height - 1}
      >
        <Box
          className = {classes.blockBox}
        >
          <div><img src = {logo} className = {classes.logo} alt = "logo" /></div>
          <MenuBarButton
            caption   = "Messung"
            selected  = {false}
            marginTop = {40}
            onClick   = {() => { props.onClick('measurement') }}
          />
          <MenuBarButton
            caption   = "Berichte"
            selected  = {false}
            marginTop = {10}
            onClick   = {() => { props.onClick('report') }}
            disabled  = {props.disableReports}
          />
          <MenuBarButton
            caption   = "Einstellungen"
            selected  = {false}
            marginTop = {10}
            onClick   = {() => { props.onClick('setup') }}
          />
          <MenuBarButton
            caption   = "Alarme"
            selected  = {false}
            marginTop = {10}
            hasAlarms = {props.hasAlarms}
            onClick   = {() => { props.onClick('alarm') }}
          />
          <Box
            className = {classes.hCenter}
            marginTop = {`${props.screenDimensions.height - 370}px`}
            marginBottom = {2}
          >
            <IconButton
              icon = "person"
              disableEffects
              height   = {40}
              width    = {40}
              scale    = {1.5}
              selected = {props.permission === 'user'}
              theme    = "white"
              onClick  = {() => props.setPermission('user')}
              tooltip  = "Bediener"
            />
            <IconButton
              icon = "admin"
              disableEffects
              height   = {40}
              width    = {40}
              scale    = {1.5}
              selected = {props.permission === 'admin'}
              theme    = "white"
              onClick  = {() => { if (props.permission !== 'admin') setShowPassModal(true) }}
              tooltip  = "Admin"
            />
          </Box>
          <Divider
            style = {{
              background: '#ddd',
            }}
          />
          <Box
            className = {classes.hCenter}
            marginTop = {1}
          >
            <Text
              type  = "p1"
              text  = "v0.0.0"
              color = "#fff"
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}
