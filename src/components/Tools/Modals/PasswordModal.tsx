// React
import { useState, ReactElement } from 'react'
import Modal from 'react-modal'

// Mui
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'

// Custom
import TextInputField from 'components/Tools/Inputs/TextInputField'

// Types
import { ScreenDim } from 'types/types'

// Style
import componentStyles from './PasswordModal-CSS'

const useStyles = makeStyles(componentStyles)

type Props = {
  show                : boolean,
  screenDimensions    : ScreenDim,
  title               : string|ReactElement,
  confirmColor        : 'inherit' | 'success' | 'info' | 'error' | 'primary' | 'secondary' | 'warning'
  close               : () => void,
  onConfirm           : (pass: string) => void,
}

export default function PasswordModal(props:Props) {
  const classes = useStyles()

  const [enteredPassword, setEnteredPassword] = useState('')

  // * Modal Functions *

  const close = () => {
    setEnteredPassword('')
    props.close()
  }

  const onClickOutside = () => { close() }                                                                        // close the modal by clicking outside of it

  const onCancel = () => { close() }                                                                              // close the modal using cancel button
  const onConfirm = () => {
    if (enteredPassword.length > 0) {
      props.onConfirm(enteredPassword)                                                                                  // confirm
      close()
    }
  }

  // * Modal breakpoint positioning *
  const getTop = () => {
    const h = props.screenDimensions.height
    if (h <= 370) return 170                                                                                             // stop going up
    return '50%'
  }
  const getLeft = () => {
    const w = props.screenDimensions.width
    if (w <= 1100) return '50%'
    if (w <= 1700) {
      const y = (-0.02 * w) + 82
      return `${y.toString()}%`
    }
    return '50%'
  }

  // * Modal style *
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex:          1000,
    },
    content: {
      width:          '310px',
      height:         180,
      display:        'block',
      justifyContent: 'center',
      top:            getTop(),
      left:           getLeft(),
    },
  }

  const getIconDark = () => <AdminPanelSettingsIcon className = "mr-1" color = {props.confirmColor} />

  const getIconWhite = () => <AdminPanelSettingsIcon />

  return (
    <Modal
      isOpen         = {props.show}
      onRequestClose = {onClickOutside}
      shouldCloseOnEsc
      ariaHideApp    = {false}
      style          = {customStyles}
      className      = "mymodal"
      closeTimeoutMS = {200}
    >
      <Box className = {classes.titleBox}>
        <Typography className = {classes.typoHeader}>{props.title}</Typography>
        {getIconDark()}
      </Box>
      <Divider component = "div" className = {classes.divider} />

      <TextInputField
        value        = {enteredPassword}
        onChange     = {(val:string) => { setEnteredPassword(val) }}
        fieldVariant = "outlined"
        passwordType
        height       = {30}
        maxLength    = {10}
        marginTop    = {40}
        marginBottom = {20}
      />

      <Box className = {classes.formItemField}>
        <Button
          variant   = "contained"
          startIcon = {getIconWhite()}
          onClick   = {onConfirm}
          color     = {props.confirmColor}
          disabled  = {enteredPassword.length === 0}
        >
          <Typography className = {classes.typoButton}>Bestätigen</Typography>
        </Button>
      </Box>
    </Modal>
  )
}
