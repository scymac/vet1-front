// React
import { ReactElement, useEffect, useState } from 'react'
import Modal from 'react-modal'

// Mui
import FolderOpen from '@mui/icons-material/FolderOpen'
import { List, ListItem, ListItemButton } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// Custom
import { Order } from 'api/Interfaces'
import { timestampFormat } from 'assets/functions/Conversions'
import TextInputField from 'components/Tools/Inputs/TextInputField'

// Types
import { ColorType, ScreenDim } from 'types/types'

// Style
import classes from './OpenOrderModal-CSS'

type Props = {
  show: boolean
  screenDimensions: ScreenDim
  icon: string
  title: string | ReactElement
  yesCaption: string | ReactElement
  noCaption: string | ReactElement
  confirmColor: ColorType
  orderList: Order[]
  close: () => void
  onConfirm: (id: string) => void
}

export default function ConfirmationModal(props: Props) {
  const [selOrder, setSelOrder] = useState('')
  const [filterOrder, setFilterOrder] = useState('')
  const [filterProduct, setFilterProduct] = useState('')
  const [filterDate, setFilterDate] = useState('')

  // clear selection if filter returns no item
  useEffect(() => {
    const filteredList = props.orderList
      .filter(o => o.order_no.includes(filterOrder))
      .filter(o => o.product_no.includes(filterProduct))
      .filter(o => o.created.includes(filterDate))

    if (filteredList.length === 0) setSelOrder('')
  }, [filterOrder, filterProduct, filterDate])

  // * Modal Functions *
  const onClickOutside = () => {
    props.close()
  } // close the modal by clicking outside of it

  const onCancel = () => {
    props.close()
  } // close the modal using cancel button
  const onConfirm = () => {
    props.onConfirm(selOrder) // confirm
    props.close() // close the modal
  }
  const onConfirmDirect = (order: string) => {
    props.onConfirm(order) // confirm
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
      width: 500,
      height: 500,
      display: 'block',
      justifyContent: 'center',
      top: getTop(),
      left: getLeft()
    }
  }

  const getIconDark = () => {
    switch (props.icon) {
      case 'folderOpen':
        return <FolderOpen className="mr-1" color={props.confirmColor} />
    }
  }

  const getIconWhite = () => {
    switch (props.icon) {
      case 'folderOpen':
        return <FolderOpen />
    }
  }

  const renderList = () => {
    const filteredList = props.orderList
      .filter(o => o.order_no.includes(filterOrder))
      .filter(o => o.product_no.includes(filterProduct))
      .filter(o => timestampFormat(o.created).includes(filterDate))

    return (
      <>
        <ListItem key={'headers'} disablePadding>
          <Typography width={150} ml={'10px'}>
            Auftrag Nr.
          </Typography>
          <Typography width={150}>Produkt</Typography>
          <Typography width={150}>Datum</Typography>
        </ListItem>
        <ListItem key={'search'} disablePadding>
          <TextInputField
            value={filterOrder}
            onChange={(val: string) => setFilterOrder(val)}
            height={25}
            marginLeft={10}
            placeholder="suchen..."
            width={140}
            fieldVariant="outlined"
            tooltip="nach Auftrag suchen"
            tooltipPlacement="bottom"
          />
          <TextInputField
            value={filterProduct}
            onChange={(val: string) => setFilterProduct(val)}
            height={25}
            width={140}
            marginLeft={10}
            placeholder="suchen..."
            fieldVariant="outlined"
            tooltip="nach Produkt suchen"
            tooltipPlacement="bottom"
          />
          <TextInputField
            value={filterDate}
            onChange={(val: string) => setFilterDate(val)}
            height={25}
            width={140}
            marginLeft={10}
            placeholder="suchen..."
            fieldVariant="outlined"
            tooltip="nach Datum suchen"
            tooltipPlacement="bottom"
          />
        </ListItem>
        {filteredList.map(o => (
          <ListItem
            key={o.id}
            disablePadding
            onClick={() => {
              setSelOrder(o.id)
            }}
            onDoubleClick={() => {
              onConfirmDirect(o.id)
            }}
          >
            <ListItemButton key={o.id} selected={o.id === selOrder}>
              <Box sx={classes.buttonBox}>{o.order_no}</Box>
              <Box sx={classes.buttonBox}>{o.product_no}</Box>
              <Box sx={classes.buttonBox}>{timestampFormat(o.created)}</Box>
            </ListItemButton>
          </ListItem>
        ))}
      </>
    )
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

      <Box sx={classes.listBox}>
        <List component="nav">{renderList()}</List>
      </Box>
      <Stack direction="row" spacing={10} sx={classes.stack}>
        <Button variant="text" onClick={onCancel} color="inherit">
          <Typography sx={classes.typoButton}>{props.noCaption}</Typography>
        </Button>
        <Button
          variant="contained"
          startIcon={getIconWhite()}
          onClick={onConfirm}
          color={props.confirmColor}
          disabled={selOrder.length === 0}
        >
          <Typography sx={classes.typoButton}>{props.yesCaption}</Typography>
        </Button>
      </Stack>
    </Modal>
  )
}
