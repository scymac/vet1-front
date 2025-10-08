// Functions
import { useEffect, useState, useRef } from 'react'
import { makeStyles } from '@mui/styles'
import { useAlert } from 'react-alert'

// Types
import {
  PermissionType, ReportType, ScreenDim, Screens,
} from 'types/types'
import { Measurement, Order, Setup } from 'api/Interfaces'

// API
import {
  ApiAckPlcAlarms, ApiFinishOrder, ApiGetCurrentOrder, ApiGetPlcAlarms, ApiListMeasurementsByOrder, ApiListOrders,
  ApiListSetups, ApiStartOrder, dataExchangeRate,
} from 'api/Requests'

// Components
import Menu from 'components/Menu/Menu'
import MainHeader from 'components/Header/MainHeader'
import { Container } from '@mui/system'

// Views
import MeasurementView from 'views/MeasurementView'
import ReportView from 'views/ReportView'
import SetupView from 'views/SetupView'
import AlarmView from 'views/AlarmView'

// Styles
import componentStyles from './MainLayout-CSS'

const useStyles:any = makeStyles(componentStyles)

export default function MainLayout() {

  const classes = useStyles()
  const alert = useAlert()

  const top  = 50
  const left = 180

  const [selectedScreen, setSelectedScreen] = useState<Screens>('measurement')
  const [orderStarted, setOrderStarted] = useState(false)
  const [selOrder, setSelOrder] = useState('') // id
  const [enableReports, setEnableReports] = useState(false)
  const [apiListError, setApiListError] = useState(false)
  const [setupList, setSetupList] = useState<Setup[]>([])
  const [orderList, setOrderList] = useState<Order[]>([])
  const [measList, setMeasList] = useState<Measurement[]>([])
  const [permission, setPermission] = useState<PermissionType>('user')
  const [reportType, setReportType] = useState<ReportType>(1)

  // Measurement Screen - to prevent variables from reseting
  const [tResUnit, setTResUnit] = useState(false) // false = kOhm, true = kOhm.cm
  const [sResUnit, setSResUnit] = useState(true) // false = kOhm, true = kOhm sq.

  // Report screen
  const [responsible, setResponsible] = useState('')

  useEffect(() => {
    if (orderList.length > 0) getCurrentOrder()
  }, [orderList])

  // * Online Checks *
  const [serverOnline, setServerOnline] = useState(false)
  const [plcOnline, setPlcOnline] = useState(false)
  const [plcAlarms, setPlcAlarms] = useState<string[]>([]) // current alarm list

  useEffect(() => {
    listOrders()
    listSetups()
  }, [serverOnline])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await ApiGetPlcAlarms()
        console.log(`alarms: ${res.message}`)
        setEnableReports(true)
        setServerOnline(true)
        if (res.ok) {
          const currentAlarms = res.message as string[]
          setPlcAlarms(currentAlarms)
          setPlcOnline(currentAlarms.indexOf('1.00') === -1)
          if (selOrder.length > 0) {
            const res2 = await ApiListMeasurementsByOrder(selOrder)
            if (res2.ok) {
              const list = res2.message as Measurement[]
              console.log(list)
              setMeasList(list)
            }
          }
        }
      }
      catch {
        setServerOnline(false)
        setPlcOnline(false)
        console.log('no response')
      }
    }, dataExchangeRate)                                                                                                // scan local storage every x ms
    return () => clearInterval(interval)
  }, [selOrder])

  // * API *
  const listSetups = async () => {
    try {
      const res = await ApiListSetups()
      console.log(res.message)
      if (res.ok) {
        const list = res.message as Setup[]
        list.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
          return 0
        })
        setSetupList(list)
      }
      else setApiListError(true)
      return res
    }
    catch {
      console.log('no response')
    }
  }

  const openOrder = async (id:string) => {
    try {
      const res = await ApiStartOrder(id)
      if (res.ok) {
        setSelOrder(id)
        setOrderStarted(true)
      }
      else setApiListError(true)
    }
    catch {
      console.log('no response')
    }
  }

  const listOrders = async () => {
    try {
      const res = await ApiListOrders()
      if (res.ok) {
        const list = res.message as Order[]
        setOrderList(list)
        setApiListError(false)
      }
      else setApiListError(true)
    }
    catch {
      console.log('no response')
    }
  }

  const getCurrentOrder = async () => {
    try {
      const res = await ApiGetCurrentOrder()
      if (res.ok) {
        const id = res.message as string
        if (id.length !== 0 && orderList.filter((o) => o.id === id).length === 1) {
          setOrderStarted(true)
          setSelOrder(id)
        }
        else {
          setOrderStarted(false)
          setSelOrder('')
        }
      }
      else setApiListError(true)
    }
    catch {
      console.log('no response')
    }
  }

  const finishOrder = async () => {
    try {
      const res = await ApiFinishOrder(selOrder)
      if (res.ok) {
        setSelOrder('')
        setOrderStarted(false)
        setMeasList([])
      }
    }
    catch {
      alert.error('Server Offline')
    }
  }

  const ackPlcAlarms = async () => {
    try {
      await ApiAckPlcAlarms()
      console.log('alarms acknowledged')
    }
    catch {
      alert.error('Server Offline')
    }
  }

  // * SCREEN *
  const [screenDimensions, setScreenDimensions] = useState<ScreenDim>({ width: 0, height: 0 })

  // Screen size monitor and shift the view up when the sidebar hides
  const getScreenDimensions = () => {
    const width  = window.innerWidth
    const height = window.innerHeight
    setScreenDimensions({ width, height })
  }
  useEffect(() => { getScreenDimensions() }, [])                                                                        // update margin top on page load
  useEffect(() => {                                                                                                     // update margin top every time the browser screen is resized
    window.addEventListener('resize', getScreenDimensions)
    return () => {
      window.removeEventListener('resize', getScreenDimensions)
    }
  })

  //* ** Get scroll position
  const ref = useRef(null)
  const [scrollTopPosition, setScrollTopPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el:any = ref.current
      const pos:any = el.scrollTop
      setScrollTopPosition(pos)
    }

    const element:any = ref.current
    element.addEventListener('scroll', handleScroll)

    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const getSetup = () => {
    const setupId = orderList.filter((o) => o.id === selOrder)[0].setup_id
    return setupList.filter((s) => s.id === setupId)[0]
  }

  const getScreen = () => {
    if (selectedScreen === 'report') {
      return (
        <ReportView
          measList         = {measList}
          order            = {orderList.filter((o) => o.id === selOrder)[0]}
          setup            = {getSetup()}
          responsible      = {responsible}
          setResponsible   = {(name:string) => setResponsible(name)}
          reportType       = {reportType}
          changeReportType = {(type:ReportType) => setReportType(type)}
        />
      )
    }
    if (selectedScreen === 'alarm') {
      return (
        <AlarmView
          screenDim     = {screenDimensions}
          currentAlarms = {plcAlarms}
        />
      )
    }
    if (selectedScreen === 'setup') {
      return (
        <SetupView
          screenDim  = {screenDimensions}
          setupList  = {setupList}
          permission = {permission}
          listSetups = {listSetups}
        />
      )
    }
    return (
      <MeasurementView
        screenDim       = {screenDimensions}
        orderStarted    = {orderStarted}
        selOrder        = {selOrder}
        setupList       = {setupList}
        orderList       = {orderList}
        measList        = {measList}
        tResUnit        = {tResUnit}
        sResUnit        = {sResUnit}
        setTResUnit     = {(val:boolean) => setTResUnit(val)}
        setSResUnit     = {(val:boolean) => setSResUnit(val)}
        setOrderStarted = {(val:boolean) => setOrderStarted(val)}
        setSelOrder     = {(val:string) => setSelOrder(val)}
        listOrders      = {listOrders}
        openOrder       = {openOrder}
        finishOrder     = {finishOrder}
      />
    )
  }

  const getHeader = () => {
    if (selectedScreen === 'report') return 'Berichte'
    if (selectedScreen === 'setup') return 'Einstellungen'
    if (selectedScreen === 'alarm') return 'Alarme'
    return 'Messung'
  }

  return (
    <>
      <Menu
        screenDimensions = {screenDimensions}
        width            = {left}
        permission       = {permission}
        onClick          = {(screen:Screens) => setSelectedScreen(screen)}
        setPermission    = {(val) => { setPermission(val) }}
        hasAlarms        = {plcAlarms.length > 0 && plcAlarms.filter((a) => a !== '1.00').length > 0}
        disableReports   = {!enableReports || selOrder === ''}
      />
      <Container
        maxWidth  = {false}
        style     = {{ width: screenDimensions.width - left }}
        className = {classes.mainContainer}
      >
        <MainHeader
          caption      = {getHeader()}
          top          = {top}
          left         = {left}
          serverOnline = {serverOnline}
          plcOnline    = {plcOnline}
          quitAlarms   = {ackPlcAlarms}
          hasAlarms    = {plcAlarms.length > 0 && plcAlarms.filter((a) => a !== '1.00').length > 0}
        />
        <Container
          maxWidth = {false}
          ref      = {ref}
          style    = {{
            position:  'absolute',
            top,
            left:      left + 24,
            width:     '100%',
            height:    screenDimensions.height - top - 1,
            overflowY: 'auto',
            overflowX: 'auto',
          }}
        >
          {getScreen()}
        </Container>
      </Container>
    </>
  )
}
