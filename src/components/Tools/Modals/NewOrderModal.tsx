// React
import { ReactElement, useEffect, useState } from 'react'
import Modal from 'react-modal'

// Mui
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'
import { makeStyles } from '@mui/styles'

// Custom
import { NewOrder, Order, Setup } from 'api/Interfaces'
import { check, warn } from 'assets/functions/Texts'
import themeColors from 'assets/theme/colors'
import FormDropdown from 'components/Tools/Inputs/FormDropdown'
import TextInputField from 'components/Tools/Inputs/TextInputField'
import Text from 'components/Tools/Text/Text'

// Types
import { ColorType, DropdownOption, ScreenDim } from 'types/types'

// Style
import componentStyles from './NewOrderModal-CSS'

const useStyles = makeStyles(componentStyles)

type Props = {
  show            : boolean,
  screenDimensions: ScreenDim,
  icon            : string,
  title           : string|ReactElement,
  yesCaption      : string|ReactElement,
  noCaption       : string|ReactElement,
  confirmColor    : ColorType,
  orderList       : Order[],
  setupList       : Setup[],
  mode            : 'new' | 'edit',
  orderId?        : string,
  close           : () => void,
  onCreate?       : (order: NewOrder) => void,
  onEdit?         : (id: string, order: NewOrder) => void,
}

export default function ConfirmationModal(props:Props) {
  const classes = useStyles()

  const [orderNumber, setOrderNumber] = useState('')
  const [product, setProduct]         = useState('')
  const [notes, setNotes]             = useState('')
  const [setupId, setSetupId]         = useState('')

  const getOrderDetails = (target:string) => {
    const list = props.orderList.filter((o) => o.id === props.orderId)
    if (list.length > 0) {
      if (target === 'order') return list[0].order_no
      if (target === 'product') return list[0].product_no
      if (target === 'setupId') return list[0].setup_id
      if (target === 'setup') {
        const list2 = props.setupList.filter((s) => s.id === list.filter((o) => o.id === props.orderId)[0].setup_id)
        if (list2.length > 0) return list2[0].name
      }
      if (target === 'notes') {
        if (list[0].notes.length > 0) return list[0].notes
        return '- keine Bemerkung -'
      }
    }
    return ''
  }

  useEffect(() => {
    if (props.mode === 'edit') {
      setOrderNumber(getOrderDetails('order'))
      setProduct(getOrderDetails('product'))
      setNotes(getOrderDetails('notes'))
    }
  }, [props])

  const getSetupOptions = () => {
    const options:DropdownOption[] = []
    props.setupList.forEach((s) => {
      options.push({
        value: s.id,
        label: s.name,
      })
    })

    return options
  }

  const onSetupChange = (id:string) => {
    setSetupId(id)
    setProduct(props.setupList.filter((s) => s.id === id).length > 0 ? props.setupList.filter((s) => s.id === id)[0].product : '')
  }

  const saveEnabled = () => {
    if (props.mode === 'new') return orderNumber.length > 0 && setupId.length
    return product.length > 0
  }

  const getTooltip = () => {
    if (props.mode === 'new') {
      return (
        <>
          {orderNumber.length > 0 ? '' : (
            <>
              {warn}
              {' '}
              Auftragnummer eingeben
              <br />
            </>
          )}
          {setupId.length > 0 ? '' : (
            <>
              {warn}
              {' '}
              Einstellung auswählen
              <br />
            </>
          )}
        </>
      )
    }
  }

  const getDropdownTooltip = () => {
    if (setupId !== '') {
      const setup = props.setupList.filter((s) => s.id === setupId)
      if (setup.length > 0) {
        return (
          <div style = {{ fontSize: 14 }}>
            {setup[0].thickness ? (
              <>
                {check}
                {' '}
                Dicke
                <br />
              </>
            ) : null}
            {setup[0].through_resistance ? (
              <>
                {check}
                {' '}
                Durchgangswiderstand
                {' '}
                <br />
              </>
            ) : null}
            {setup[0].whole_resistance ? (
              <>
                {check}
                {' '}
                Gesamter Oberflächenwiderstand
                <br />
              </>
            ) : null }
            {setup[0].local_resistance ? (
              <>
                {check}
                {' '}
                Lokaler Oberflächenwiderstand
                <br />
              </>
            ) : null}
          </div>
        )
      }
    }
  }

  // * Modal Functions *
  // const onClickOutside = () => { close() }  // close the modal by clicking outside of it

  const close = () => {
    setProduct('')
    setSetupId('')
    setOrderNumber('')
    setNotes('')
    props.close()
  }
  const onCancel  = () => { close() }  // close the modal using cancel button
  const onCreate = () => {
    props.onCreate!({
      order_no:   orderNumber,
      product_no: product,
      notes,
      setup_id:   setupId,
    })
    close()
  }
  const onEdit = () => {
    props.onEdit!(props.orderId!, {
      order_no:   orderNumber,
      product_no: product,
      notes,
      setup_id:   getOrderDetails('setupId'),
    })
    close()
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
      width:          350,
      height:         400,
      display:        'block',
      justifyContent: 'center',
      top:            getTop(),
      left:           getLeft(),
    },
  }

  // * RENDER *
  const getIconDark = () => {
    switch (props.icon) {
      case 'add': return <AddIcon className = "mr-1" color = {props.confirmColor} />
      case 'edit': return <EditIcon className = "mr-1" color = {props.confirmColor} />
    }
  }

  const getIconWhite = () => {
    switch (props.icon) {
      case 'add': return <AddIcon />
      case 'edit': return <EditIcon />
    }
  }

  return (
    <Modal
      isOpen = {props.show}
      shouldCloseOnEsc
      ariaHideApp    = {false}
      style          = {customStyles}
      className      = "mymodal"
      closeTimeoutMS = {200}

      // onRequestClose = {onClickOutside}
    >
      <Box className = {classes.titleBox}>
        <Typography className = {classes.typoHeader}>{props.title}</Typography>
        {getIconDark()}
      </Box>
      <Divider component = "div" className = {classes.divider} />
      <Box className = {classes.formBox}>
        {
          props.mode === 'edit' ? null
            : (
              <>
                <Box className = {`${classes.formItem} ${classes.marginTop}`}>
                  <Box className = {classes.formItemText}>
                    <Text
                      text = "* Auftrag Nr"
                    />
                  </Box>
                  <Box className = {classes.formItemField}>
                    <TextInputField
                      value        = {orderNumber}
                      onChange     = {(val:string) => { setOrderNumber(val) }}
                      fieldVariant = "outlined"
                      height       = {30}
                      maxLength    = {10}
                    />
                  </Box>
                </Box>
                <Box className = {`${classes.formItem} ${classes.formItem}`}>
                  <Box className = {classes.formItemText}>
                    <Text
                      text = "* Einstellung"
                    />
                  </Box>
                  <Tooltip
                    TransitionComponent = {Zoom}
                    arrow
                    title      = {getDropdownTooltip()}
                    placement  = "right"
                    enterDelay = {300}
                  >
                    <Box className = {classes.formItemField}>
                      <FormDropdown
                        options        = {getSetupOptions()}
                        selectedOption = {setupId}
                        onChange       = {onSetupChange}
                        height         = {30}
                        maxMenuHeight  = {200}
                      />
                    </Box>
                  </Tooltip>
                </Box>
                <Box className = {`${classes.formItem}`}>
                  <Box className = {classes.formItemText}>
                    <Text
                      text = "Produkt"
                    />
                  </Box>
                  <Box className = {classes.formItemField}>
                    <TextInputField
                      value        = {product}
                      onChange     = {() => null}
                      fieldVariant = "outlined"
                      height       = {30}
                      maxLength    = {20}
                      backgroundColor = {themeColors.gray.lightest}
                      disabled
                    />
                  </Box>
                </Box>
              </>
            )
        }
        <Box className = {`${classes.formItem} ${props.mode === 'edit' ? classes.marginTop : null}`}>
          <Box className = {classes.formItemText}>
            <Text
              text = "Bemerkungen"
            />
          </Box>
          <Box className = {classes.formItemField}>
            <TextInputField
              value        = {notes.replace(/\n/g, ' ')}
              onChange     = {(val:string) => { setNotes(val) }}
              fieldVariant = "outlined"
              height       = {100}
              multiline
              maxLength = {500}
            />
          </Box>
        </Box>
      </Box>
      <Divider component = "div" className = {`${classes.divider} ${classes.marginTop2}`} />
      <Stack
        direction = "row"
        spacing   = {8}
        className = {classes.stack}
      >
        <Button
          variant = "text"
          onClick = {onCancel}
          color   = "inherit"
        >
          <Typography className = {classes.typoButton}>
            {props.noCaption}
          </Typography>
        </Button>
        <Tooltip
          TransitionComponent = {Zoom}
          arrow
          title      = {saveEnabled() ? undefined : <div style = {{ fontSize: 14 }}>{getTooltip()}</div>}
          placement  = "right"
          enterDelay = {300}
        >
          <Box>
            <Button
              variant   = "contained"
              startIcon = {getIconWhite()}
              onClick   = {props.mode === 'new' ? onCreate : onEdit}
              color     = {props.confirmColor}
              disabled  = {!saveEnabled()}
            >
              <Typography className = {classes.typoButton}>
                {props.yesCaption}
              </Typography>
            </Button>
          </Box>
        </Tooltip>
      </Stack>
    </Modal>
  )
}
