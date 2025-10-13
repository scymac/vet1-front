// Functions
import { makeStyles } from '@mui/styles'
import { useState } from 'react'

// Types
import { ScreenDim } from 'types/types'

// Components
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import AlarmTable from 'components/Tools/Table/AlarmTable'

// Styles
import { AlarmInterface } from 'api/Interfaces'
import { ApiGetAlarmHist } from 'api/Requests'
import componentStyles from './AlarmView-CSS'

const useStyles: any = makeStyles(componentStyles)

type Props = {
  screenDim: ScreenDim
  currentAlarms: string[]
}

export default function MeasurementView(props: Props) {
  const classes = useStyles()

  const [alarmGroup, setAlarmGroup] = useState<'current' | 'history'>('current')
  const [alarmHist, setAlarmHist] = useState<AlarmInterface[]>([])

  const getAlarmHist = async () => {
    try {
      const res = await ApiGetAlarmHist()
      if (res.ok) {
        const list = res.message as AlarmInterface[]
        setAlarmHist(list)
      }
    } catch {
      console.log('no response')
    }
  }

  const getCurrentAlarmList = () => props.currentAlarms.map(a => ['', a, '']) // [id, code, tstamp] to match the alarm history format and use the same table component

  return (
    <Box>
      <Box className={classes.buttonBox}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setAlarmGroup('current')
          }}
          style={{
            marginRight: 10
          }}
          disabled={alarmGroup === 'current'}
        >
          aktuelle Alarme
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setAlarmGroup('history')
            getAlarmHist()
          }}
          disabled={alarmGroup === 'history'}
        >
          Alarmhistorie
        </Button>
      </Box>
      <Box
        className={classes.tableBox}
        style={{
          width: props.screenDim.width - 215,
          height: props.screenDim.height - 130
        }}
      >
        {alarmGroup === 'current' ? (
          <AlarmTable
            screenDim={props.screenDim}
            headers={[
              [
                'ID',
                'Alarmnr.',
                'Zeitstempel',
                'Bezeichnung',
                'Auslöser',
                'Details',
                'Mögliche Ursachen'
              ]
            ]}
            data={getCurrentAlarmList()}
            tab="current"
          />
        ) : (
          <AlarmTable
            screenDim={props.screenDim}
            headers={[
              [
                'ID',
                'Alarmnr.',
                'Zeitstempel',
                'Bezeichnung',
                'Auslöser',
                'Details',
                'Mögliche Ursachen'
              ]
            ]}
            data={alarmHist.map(d => Object.values(d))}
            tab="history"
          />
        )}
      </Box>
    </Box>
  )
}
