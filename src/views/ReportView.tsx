// Functions
import { useState, useMemo } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'

// MUI
import { makeStyles } from '@mui/styles'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

// Components
import Report1 from 'components/reports/report1/Report1'

// Styles
import { Measurement, Order, Setup } from 'api/Interfaces'
import TextInputField from 'components/Tools/Inputs/TextInputField'
import Report2 from 'components/reports/report2/Report2'
import componentStyles from './ReportView-CSS'

const useStyles:any = makeStyles(componentStyles)

type Props = {
  measList: Measurement[],
  order: Order,
  setup: Setup
}

const m = (i:number) => {

  const res:Measurement = {
    constants: {
      electrode_distance:
    2200,
      electrode_half_distance:
    2200,
      sample_width:
    1000,
      spot_electrode_gap:
    100,
      spot_electrode_length:
    100,
      t_resistance_area:
    9.4245,
    },
    id:        '3f9fae81-4d26-4901-8642-fe6e6bbeb504',
    l_res1:    { voltage: 8.959, current: 0.00004654, resistance: 192502.8 },
    l_res2:    { voltage: 8.972, current: 0.00004613, resistance: 194465.2 },
    l_res3:    { voltage: 8.961, current: 0.00004616, resistance: 1219.7 },
    l_res4:    { voltage: 8.978, current: 0.00004617, resistance: 194437.1 },
    l_res5:    { voltage: 8.943, current: 0.00004599, resistance: 194455.6 },
    l_res6:    { voltage: 8.952, current: 0.0000471, resistance: 190075.6 },
    l_res7:    { voltage: 8.964, current: 0.00004689, resistance: 191186.6 },
    l_res8:    { voltage: 8.918, current: 0.00004648, resistance: 191848.6 },
    l_res9:    { voltage: 8.955, current: 0.00004699, resistance: 190563.7 },
    l_res10:   { voltage: 8.946, current: 0.00004668, resistance: 191657.4 },
    l_res11:   { voltage: 8.931, current: 0.00004642, resistance: 192403.3 },
    l_res12:   { voltage: 8.931, current: 0.00004645, resistance: 192257.9 },
    order_id:  'cdbbab2e-4576-48fc-aa0b-cc52826056b5',
    sample_no: i,
    t_res:     { voltage: 8.93, current: 0.00004636, resistance: 109.8 },
    thickness: 0.322,
    tstamp:    new Date(),
    w_res:     { voltage: 8.93, current: 0.00004636, resistance: 100000 },
  }
  return res
}

export default function ReportView(props:Props) {

  const classes = useStyles()

  const [measList, setMeasList] = useState(props.measList)
  const [order, setOrder] = useState(props.order)
  const [setup, setSetup] = useState(props.setup)

  const [responsible, setResponsible] = useState('')

  useMemo(() => {

    /*
    const meas:Measurement[] = []
    for (let i = 1; i < 60; i += 1) {
      const mm = m(i)
      mm.sample_no = i
      meas.push(mm)
    }
    setMeasList(meas)
    */
    setMeasList(props.measList)
    setOrder(props.order)
    setSetup(props.setup)
  }, [props.measList, props.order, props.setup])

  const getReport = (variant: 'document'|'snapshot') => {
    if (setup.local_resistance) {
      return (
        <Report1
          responsible = {responsible}
          measList    = {measList}
          order       = {order}
          setup       = {setup}
          variant     = {variant}
        />
      )
    }
    return (
      <Report2
        responsible = {responsible}
        measList    = {measList}
        order       = {order}
        setup       = {setup}
        variant     = {variant}
      />
    )
  }

  return (
    <div
      style = {{
        margin: '1rem',
      }}
    >
      <Box
        style = {{
          display:    'flex',
          alignItems: 'center',
        }}
      >
        {
          measList.length === 0
            ? (
              <Button
                variant   = "contained"
                color     = "primary"
                disabled
                size      = "small"
                startIcon = {<FileDownloadIcon />}
                style = {{
                  paddingLeft:  '15px',
                  paddingRight: '15px',
                }}
              >
                Download
              </Button>
            )
            :                (
              <PDFDownloadLink
                document = {(
                  getReport('document')
                )}
                fileName = "MyReport"
              >
                {({ loading }) => (
                  loading
                    ? (
                      <Button
                        variant   = "contained"
                        color     = "primary"
                        size      = "small"
                        startIcon = {<FileDownloadIcon />}
                        style = {{
                          paddingLeft:  '15px',
                          paddingRight: '15px',
                        }}
                      >
                        Download
                      </Button>
                    )
                    : (
                      <Button
                        variant   = "contained"
                        color     = "primary"
                        size      = "small"
                        startIcon = {<FileDownloadIcon />}
                        style = {{
                          paddingLeft:  '15px',
                          paddingRight: '15px',
                        }}
                      >
                        Download
                      </Button>
                    )
                )}
              </PDFDownloadLink>
            )
          }
        <Typography style = {{
          marginLeft:  '50px',
          marginRight: '10px',
        }}
        >
          Kontrolleur
        </Typography>
        <TextInputField
          value = {responsible}
          fieldVariant = "outlined"
          width = {300}
          onChange = {(val:string) => setResponsible(val)}
        />
      </Box>

      {getReport('snapshot')}

    </div>
  )
}

/*

<PDFDownloadLink
  document = {(
    <Report1
      measList = {measList}
      order    = {order}
      setup    = {setup}
      variant  = "document"
    />
  )}
  fileName = "MyReport"
>
  {({ loading }) => (
    loading
      ? (
        <Button
          variant   = "contained"
          color     = "primary"
          disabled
          size      = "small"
          startIcon = {<FileDownloadIcon />}
        >
          Loading Document...
        </Button>
      )
      : (
        <Button
          variant   = "contained"
          color     = "primary"
          disabled  = {measList.length === 0}
          size      = "small"
          startIcon = {<FileDownloadIcon />}
        >
          Download
        </Button>
      )
  )}
</PDFDownloadLink>

*/
