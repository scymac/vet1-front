// React
import { ReactElement } from 'react'
import Modal from 'react-modal'

// Mui
import DeleteIcon from '@mui/icons-material/Delete'
import FactCheck from '@mui/icons-material/FactCheck'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// Types
import { ScreenDim } from 'types/types'

// Style
import classes from './ConfirmationModal-CSS'

type Props = {
  show: boolean
  screenDimensions: ScreenDim
  icon: string
  title: string | ReactElement
  question: string | ReactElement
  yesCaption: string | ReactElement
  noCaption: string | ReactElement
  disableConfirmation?: boolean
  confirmColor:
    | 'inherit'
    | 'success'
    | 'info'
    | 'error'
    | 'primary'
    | 'secondary'
    | 'warning'
  close: () => void
  onConfirm: () => void
}

export default function ConfirmationModal(props: Props) {
  // * Modal Functions *
  const onClickOutside = () => {
    props.close()
  } // close the modal by clicking outside of it

  const onCancel = () => {
    props.close()
  } // close the modal using cancel button
  const onConfirm = () => {
    props.onConfirm() // confirm
    props.close() // close the modal
  }

  // * Modal breakpoint positioning *
  const getTop = () => {
    const h = props.screenDimensions.height
    if (h <= 370) return 170 // stop going up
    return '50%'
  }
  const getLeft = () => {
    const w = props.screenDimensions.width
    if (w <= 1100) return '50%'
    if (w <= 1700) {
      const y = -0.02 * w + 82
      return `${y.toString()}%`
    }
    return '50%'
  }

  // * Modal style *
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000
    },
    content: {
      width: '310px',
      height: 180,
      display: 'block',
      justifyContent: 'center',
      top: getTop(),
      left: getLeft()

      // right: 'auto',
      // bottom: "500px",
      // marginRight: '-50%',
      // transform: 'translate(-50%, -50%)'
    }
  }

  const getIconDark = () => {
    switch (props.icon) {
      case 'delete':
        return <DeleteIcon className="mr-1" color={props.confirmColor} />
      case 'factCheck':
        return <FactCheck className="mr-1" color={props.confirmColor} />
    }
  }

  const getIconWhite = () => {
    switch (props.icon) {
      case 'delete':
        return <DeleteIcon />
      case 'factCheck':
        return <FactCheck />
    }
  }

  return (
    <Modal
      isOpen={props.show}
      onRequestClose={onClickOutside}
      shouldCloseOnEsc
      ariaHideApp={false}
      style={customStyles}
      className="mymodal"
      closeTimeoutMS={200}
    >
      <Box sx={classes.titleBox}>
        <Typography sx={classes.typoHeader}>{props.title}</Typography>
        {getIconDark()}
      </Box>
      <Divider component="div" sx={classes.divider} />
      <Box sx={classes.formBox}>
        <Typography sx={classes.typo}>{props.question}</Typography>
      </Box>
      <Stack
        direction="row"
        spacing={2}
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button variant="text" onClick={onCancel} color="inherit">
          <Typography sx={classes.typoButton}>{props.noCaption}</Typography>
        </Button>
        <Button
          variant="contained"
          startIcon={getIconWhite()}
          onClick={onConfirm}
          color={props.confirmColor}
          disabled={props.disableConfirmation}
        >
          <Typography sx={classes.typoButton}>{props.yesCaption}</Typography>
        </Button>
      </Stack>
    </Modal>
  )
}
