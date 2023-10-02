// Functions
import { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import {
  ApiEditOrder, ApiNewOrder, ApiStartOrder,
} from 'api/Requests'
import { useAlert } from 'react-alert'
import { timestampFormat2 } from 'assets/functions/Conversions'

// Types
import { ScreenDim } from 'types/types'
import {
  IdType, Measurement, NewOrder, NewSetup, Order, Setup,
} from 'api/Interfaces'

// Components
import Box from '@mui/material/Box'
import IconButton from 'components/Tools/Buttons/IconButton'
import NewOrderModal from 'components/Tools/Modals/NewOrderModal'
import OpenOrderModal from 'components/Tools/Modals/OpenOrderModal'
import Text from 'components/Tools/Text/Text'
import ConfirmationModal from 'components/Tools/Modals/ConfirmationModal'
import MeasTable from 'components/Tools/Table/MeasTable'

// Styles
import componentStyles from './MeasurementView-CSS'
import 'assets/theme/textNoSelect.css'

const useStyles:any = makeStyles(componentStyles)

type Props = {
  screenDim        : ScreenDim,
  orderStarted     : boolean,
  selOrder         : string,
  setupList        : Setup[],
  orderList        : Order[],
  measList         : Measurement[],
  tResUnit         : boolean,
  sResUnit         : boolean,
  setTResUnit      : (val:boolean) => void,
  setSResUnit      : (val:boolean) => void,
  setOrderStarted  : (val:boolean) => void,
  setSelOrder      : (val:string) => void,
  listOrders       : () => void,
  openOrder        : (id:string) => void,
  finishOrder      : () => void
}

// apiListError     : boolean
// listSetups       : () => void,

export default function MeasurementView(props:Props) {

  const classes = useStyles()
  const alert   = useAlert()

  const [currentSetup, setCurrentSetup] = useState<null|Setup>(null)
  const [currentOrder, setCurrentOrder] = useState<null|Order>(null)

  const getSetup = () => {
    const list = props.orderList.filter((o) => o.id === props.selOrder)
    if (list.length > 0) {
      const list2 = props.setupList.filter((s) => s.id === list.filter((o) => o.id === props.selOrder)[0].setup_id)
      if (list2.length > 0) return list2[0]
    }
    return null
  }

  const getOrder = () => {
    const list = props.orderList.filter((o) => o.id === props.selOrder)
    if (list.length > 0) {
      return list[0]
    }
    return null
  }

  useEffect(() => {
    setCurrentOrder(getOrder())
    setCurrentSetup(getSetup())
  }, [props.orderList, props.setupList])

  //* ** API */

  const newOrder = async (order:NewOrder) => {
    try {
      const res = await ApiNewOrder(order)
      if (res.ok) {
        alert.success('Auftrag erstellt!')
        props.setOrderStarted(true)
        const id = res.message as IdType
        const res2 = await ApiStartOrder(id.id)
        if (res2.ok) {
          props.setSelOrder(id.id)
          props.listOrders()
        }
      }
      else alert.error(res.statusMessage)
    }
    catch {
      alert.error('Server Offline')
    }
  }

  const editOrder = async (id:string, order:NewOrder) => {
    try {
      const res = await ApiEditOrder(id, order)
      if (res.ok) {
        alert.success('gespeichert!')
        props.listOrders()
      }
      else alert.error(res.statusMessage)
    }
    catch {
      alert.error('Server Offline')
    }
  }

  const openOrder = (id:string) => {
    props.openOrder(id)
  }

  const getTableHeaders = () => {
    const s = getSetup()
    if (s !== null) {
      const list1 = [
        'Plattennr.',
        'Status',
        'Zeitstempel',
        'Dicke [mm]',
        `Durchgangswiderstand [kΩ${!props.tResUnit ? '' : '.cm'}]`,
        `Oberflächenwiderstand [kΩ${!props.sResUnit ? '' : ' sq.'}]`,
      ] // ["Plattennr.", "Status", "Zeitstempel"]
      const list2 = ['gesamt', 'R1 - R12']// []
      // if(!s.whole_resistance && s.local_resistance) list1.push("Oberflächenwiderstand [kΩ]")
      /*  if(s.thickness) list1.push("Dicke [mm]")
      if(s.through_resistance) list1.push("Durchgangswiderstand [kΩ]")
      if(s.whole_resistance) list1.push("Oberflächenwiderstand [kΩ]")

      if(s.whole_resistance) list2.push("gesamt")
      if(s.local_resistance) {
        for (let i = 1; i < 13; i += 1) list2.push(`R${i}`)
      } */
      return [list1, list2]
    }
    return []
  }

  const getTableData = () => {
    const data:string[][] = []
    const s = getSetup()
    if (s !== null) {
      props.measList.forEach((m) => {
        const d:string[] = [m.sample_no.toFixed(0), 'C', timestampFormat2(m.tstamp.toString())]
        if (s.thickness) {
          const t = () => {
            if (m.thickness === null || m.thickness === undefined) return '-'
            return m.thickness.toFixed(3)
          }
          d.push(t())
        }
        else d.push('-')

        if (s.through_resistance) {
          const t = () => {
            if (m.t_res.resistance === null || m.t_res.resistance === undefined) return '-'
            if (props.tResUnit) return ((m.t_res.resistance / 1000) * (m.constants.t_resistance_area / (Number(currentSetup?.target_thickness) / 10))).toFixed(2) // kOhm * cm
            return (m.t_res.resistance / 1000).toFixed(3) // kOhm
          }
          d.push(t())
        }
        else d.push('-')

        if (s.whole_resistance) {
          const t = () => {
            const eDistance = currentSetup?.is_half_plate ? m.constants.electrode_half_distance : m.constants.electrode_distance
            if (m.w_res.resistance === null || m.w_res.resistance === undefined) return '-'
            if (props.sResUnit) return ((m.w_res.resistance / 1000) * (m.constants.sample_width / eDistance)).toFixed(2) // kOhm sq.
            return (m.w_res.resistance / 1000).toFixed(2) // kOhm
          }
          d.push(t())
        }
        else d.push('-')

        if (s.local_resistance) {

          const t = (res:number|null|undefined) => {
            if (res === null || res === undefined) return '-'
            if (props.sResUnit)  return ((res / 1000) * (m.constants.sample_width / m.constants.spot_electrode_gap)).toFixed(2) // kOhm sq.
            return ((res / 1000) * (m.constants.sample_width / m.constants.spot_electrode_gap)).toFixed(2) // kOhm = kOhm sq. since electrode area is a square
          }
          for (let i = 1; i < 13; i += 1) {
            const val = () => {
              switch (i) {
                case 1: return m.l_res1.resistance
                case 2: return m.l_res2.resistance
                case 3: return currentSetup?.is_half_plate ? null : m.l_res3.resistance
                case 4: return currentSetup?.is_half_plate ? null : m.l_res4.resistance
                case 5: return m.l_res5.resistance
                case 6: return m.l_res6.resistance
                case 7: return currentSetup?.is_half_plate ? null : m.l_res7.resistance
                case 8: return currentSetup?.is_half_plate ? null : m.l_res8.resistance
                case 9: return m.l_res9.resistance
                case 10: return m.l_res10.resistance
                case 11: return currentSetup?.is_half_plate ? null : m.l_res11.resistance
                case 12: return currentSetup?.is_half_plate ? null : m.l_res12.resistance
              }
            }
            d.push(t(val()))
          }
        }
        else for (let i = 1; i < 13; i += 1) { d.push('') }
        data.push(d)
      })
      return data
    }
    return props.measList.length === 0 ? [] : props.measList.map((a) => Object.values(a))
  }

  const getConstants = () => {
    if (currentSetup === null) {
      return {
        isHalfPlate:        false,
        thickness:          false,
        through_resistance: false,
        whole_resistance:   false,
        local_resistance:   false,
        lRes_max:           0,
        lRes_min:           0,
        wRes_max:           0,
        wRes_min:           0,
        tRes_max:           0,
        tRes_min:           0,
      }
    }
    return {
      isHalfPlate:        currentSetup?.is_half_plate,
      thickness:          currentSetup?.thickness,
      through_resistance: currentSetup?.through_resistance,
      whole_resistance:   currentSetup?.whole_resistance,
      local_resistance:   currentSetup?.local_resistance,
      lRes_max:           Number(currentSetup?.max_lres),
      lRes_min:           Number(currentSetup?.min_lres),
      wRes_max:           Number(currentSetup?.max_wres),
      wRes_min:           Number(currentSetup?.min_wres),
      tRes_max:           Number(currentSetup?.max_tres),
      tRes_min:           Number(currentSetup?.min_tres),
    }
  }

  //* ** MODALS */
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [showNewOrderModal2, setShowNewOrderModal2] = useState(false)
  const [showOpenOrderModal, setShowOpenOrderModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  return (
    <>
      <NewOrderModal
        show             = {showNewOrderModal}
        close            = {() => { setShowNewOrderModal(false) }}
        onCreate         = {newOrder}
        screenDimensions = {props.screenDim}
        mode             = "new"
        title            = "NEUER AUFTRAG"
        icon             = "add"
        yesCaption       = "erstellen"
        noCaption        = "zurück"
        confirmColor     = "success"
        orderList        = {props.orderList}
        setupList        = {props.setupList}
      />
      <NewOrderModal
        show             = {showNewOrderModal2}
        close            = {() => { setShowNewOrderModal2(false) }}
        onEdit           = {editOrder}
        screenDimensions = {props.screenDim}
        orderId          = {props.selOrder}
        mode             = "edit"
        title            = "AUFTRAG BEARBEITEN"
        icon             = "edit"
        yesCaption       = "SPEICHERN"
        noCaption        = "zurück"
        confirmColor     = "info"
        orderList        = {props.orderList}
        setupList        = {props.setupList}
      />
      <OpenOrderModal
        show             = {showOpenOrderModal}
        close            = {() => { setShowOpenOrderModal(false) }}
        onConfirm        = {openOrder}
        screenDimensions = {props.screenDim}
        title            = "AUFTRAG ÖFFNEN"
        icon             = "folderOpen"
        yesCaption       = "öffnen"
        noCaption        = "zurück"
        confirmColor     = "info"
        orderList        = {props.orderList}
      />
      <ConfirmationModal
        show             = {showConfirmationModal}
        close            = {() => { setShowConfirmationModal(false) }}
        onConfirm        = {props.finishOrder}
        screenDimensions = {props.screenDim}
        title            = "AUFTRAG BEENDEN"
        question         = {`Sind Sie sicher, dass Sie den Auftrag ${props.selOrder !== '' ? currentOrder?.order_no : null} beenden wollen?`}
        icon             = "factCheck"
        yesCaption       = "BEENDEN"
        noCaption        = "NEIN"
        confirmColor     = "success"
      />
      <Box>

        <Box
          className = {classes.orderButtonBox}
          style     = {{ width: props.screenDim.width - 220 }}
        >
          <IconButton
            icon    = "add"
            tooltip = "Neuer Auftrag"
            width   = {25}
            height  = {25}
            onClick = {() => { setShowNewOrderModal(true) }}
            visible = {!props.orderStarted}
          />
          <IconButton
            icon       = "folderOpen"
            tooltip    = "Auftrag öffnen"
            width      = {25}
            height     = {25}
            onClick    = {() => { setShowOpenOrderModal(true) }}
            visible    = {!props.orderStarted}
            marginLeft = {10}
          />
          <IconButton
            icon       = "factCheck"
            tooltip    = "Auftrag beenden"
            width      = {25}
            height     = {25}
            onClick    = {() => { setShowConfirmationModal(true) }}
            visible    = {props.orderStarted}
            marginLeft = {10}
          />
          <IconButton
            icon       = "edit"
            tooltip    = "Information bearbeiten"
            width      = {25}
            height     = {25}
            onClick    = {() => { setShowNewOrderModal2(true) }}
            visible    = {props.orderStarted}
            marginLeft = {10}
          />

          <Box
            className = {`${classes.menuButton} ${classes.noSelect} ${
              props.tResUnit ? classes.menuButtonSelected : classes.menuButtonUnselected
            }`}
            style = {{
              marginLeft: '40px',
            }}
            onClick = {() => props.setTResUnit(!props.tResUnit)}
          >
            {`Durchgangswid. ${props.tResUnit ? 'kΩ.cm' : 'kΩ'}`}
          </Box>
          <Box
            className = {`${classes.menuButton} ${classes.noSelect} ${
              props.sResUnit ? classes.menuButtonSelected : classes.menuButtonUnselected
            }`}
            onClick = {() => props.setSResUnit(!props.sResUnit)}
          >
            {`Oberflächenwid. ${props.sResUnit ? 'kΩ sq.' : 'kΩ'}`}
          </Box>
        </Box>

        <Box
          className = {classes.orderBox}
          style     = {{ width: props.screenDim.width - 225 }}
        >
          {
            props.orderStarted
              ? (
                <>
                  <Box className = {classes.formItemText}>
                    <Text
                      text = "Auftrag Nr :"
                      type = "p1"
                    />
                  </Box>
                  <Box className = {classes.formItemLabel1}>
                    <Text
                      text = {currentOrder?.order_no!}
                      type = "h5"
                    />
                  </Box>
                  <Box className = {classes.formItemText}>
                    <Text
                      text = "Produkt :"
                      type = "p1"
                    />
                  </Box>
                  <Box className = {classes.formItemLabel1}>
                    <Text
                      text = {currentOrder?.product_no!}
                      type = "h5"
                    />
                  </Box>
                  <Box className = {classes.formItemText}>
                    <Text
                      text = "Einstellung :"
                      type = "p1"
                    />
                  </Box>
                  <Box className = {classes.formItemLabel1}>
                    <Text
                      text = {currentSetup?.name!}
                      type = "h5"
                      tooltip = {(
                        <>
                          {currentSetup?.thickness ? (
                            <>
                              Dicke messen
                              <br />
                            </>
                          ) : null}
                          {currentSetup?.through_resistance ? (
                            <>
                              Durchgangswiderstand messen
                              <br />
                            </>
                          ) : null}
                          {currentSetup?.whole_resistance ? (
                            <>
                              Oberflächenwiderstand (gesamt) messen
                              <br />
                            </>
                          ) : null}
                          {currentSetup?.local_resistance ? <>Oberflächenwiderstand (R1 - R12) messen</> : null}
                          {
                            Number(currentSetup?.notes.length) > 0 ? (
                              <>
                                <br />
                                {currentSetup?.notes}
                              </>
                            )
                              :  null
                          }
                        </>
                      )}
                    />
                  </Box>
                  <Box className = {classes.formItemText}>
                    <Text
                      text = "IST-Plattendicke :"
                      type = "p1"
                    />
                  </Box>
                  <Box className = {classes.formItemLabel1}>
                    <Text
                      text = {Number(currentOrder?.thickness!).toFixed(3)}
                      type = "h5"
                    />
                  </Box>
                  <IconButton
                    icon    = "notes"
                    tooltip = {(
                      <>
                        Bemerkungen
                        {' '}
                        <br />
                        <br />
                        {currentOrder?.notes!}
                      </>
                    )}
                    visible
                    disabled
                    marginLeft = {20}
                  />
                </>
              )
              :             (
                <Box className = {classes.formItemText4}>
                  <Text
                    text       = "kein Auftrag erstellt"
                    type       = "h5"
                    marginLeft = {20}
                  />
                </Box>
              )
          }
        </Box>
        {
          props.orderStarted
            ? (
              <Box
                className = {classes.tableBox}
                style     = {{ width: props.screenDim.width - 225 }}
              >
                <MeasTable
                  screenDim = {props.screenDim}
                  rawData   = {props.measList}
                  headers   = {getTableHeaders()}
                  data      = {getTableData()}
                  setup     = {getConstants()}
                  showTResOutOfSpec = {props.tResUnit}
                  showSResOutOfSpec = {props.sResUnit}
                />
              </Box>
            )
            : null
        }

      </Box>
    </>
  )
}
