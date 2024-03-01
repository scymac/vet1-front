// Functions
import { useState, useMemo } from 'react'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'

// MUI
import { makeStyles } from '@mui/styles'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

// Components
import Report1 from 'components/reports/report1/Report1'

// Styles
import {
  Measurement, Order, Setup,
} from 'api/Interfaces'
import TextInputField from 'components/Tools/Inputs/TextInputField'
import Report2 from 'components/reports/report2/Report2'
import NumInputField from 'components/Tools/Inputs/NumInputField'
import { getMax, getMin } from 'assets/functions/Calculations'
import Report3 from 'components/reports/report3/Report3'
import { ReportType } from 'types/types'
import componentStyles from './ReportView-CSS'

const useStyles:any = makeStyles(componentStyles)

/* for testing

const d:SResMeasurement = {
  voltage:    14.2,
  resistance: 14.2 / 0.0016,
}

const defMeasurement:Measurement = {
  sample_no: 1,
  order_id:  'asdfasdf',
  thickness: 0.2,
  t_res:     {
    voltage:    14.3,
    current:    0.002,
    resistance: 14.3 / 0.002,
  },
  w_l_res_A: 0.0016,
  w_res:     d,
  l_res1:    d,
  l_res2:    d,
  l_res3:    d,
  l_res4:    d,
  l_res5:    d,
  l_res6:    d,
  l_res7:    d,
  l_res8:    d,
  l_res9:    d,
  l_res10:   d,
  l_res11:   d,
  l_res12:   d,
  id:        '0asdnkjlasd',
  tstamp:    new Date(),
  constants: {
    electrode_distance:      2288,
    electrode_half_distance: 1144,
    spot_electrode_length:   58.4,
    spot_electrode_gap:      58.4,
    sample_width:            1012,
    t_resistance_area:       8.0422,
  },
}

const samples = 52

*/

type Props = {
  measList        : Measurement[],
  order           : Order,
  setup           : Setup
  responsible     : string,
  reportType      : ReportType,
  setResponsible  : (name:string) => void,
  changeReportType: (type:ReportType) => void,
}

export default function ReportView(props:Props) {

  const classes = useStyles()

  const [measList, setMeasList] = useState(props.measList)
  const [order, setOrder] = useState(props.order)
  const [setup, setSetup] = useState(props.setup)

  const [pageMin, setPageMin] = useState<number>(getMin(props.measList.map((m) => m.sample_no)))
  const [pageMax, setPageMax] = useState<number>(getMax(props.measList.map((m) => m.sample_no)))
  const [pageFrom, setPageFrom] = useState<number>(pageMin)
  const [pageTo, setPageTo] = useState<number>(pageMax)

  useMemo(() => {

    /* const a:Measurement[] = []
    for (let i = 0; i < samples; i += 1) {
      a.push(defMeasurement)
    }
    setMeasList(a) */

    setMeasList(props.measList)
    setOrder(props.order)
    setSetup(props.setup)
  }, [props.measList, props.order, props.setup])

  const generatePdfDocument = async (fileName:any) => {
    const blob = await pdf((
      getReport('document')
    )).toBlob()
    saveAs(blob, fileName)
  }

  const getReport = (variant: 'document'|'snapshot') => {
    if (props.reportType === 1) {
      return (
        <Report1
          responsible = {props.responsible}
          measList    = {measList.filter((m) => m.sample_no >= pageFrom && m.sample_no <= pageTo)}
          order       = {order}
          setup       = {setup}
          variant     = {variant}
        />
      )
    }
    if (props.reportType === 2) {
      return (
        <Report2
          responsible = {props.responsible}
          measList    = {measList.filter((m) => m.sample_no >= pageFrom && m.sample_no <= pageTo)}
          order       = {order}
          setup       = {setup}
          variant     = {variant}
        />
      )
    }
    return (
      <Report3
        responsible = {props.responsible}
        measList    = {measList.filter((m) => m.sample_no >= pageFrom && m.sample_no <= pageTo)}
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
        <Button
          variant   = "contained"
          color     = "primary"
          size      = "small"
          startIcon = {<FileDownloadIcon />}
          style     = {{
            paddingLeft:  '25px',
            paddingRight: '25px',
            minWidth:     180,
          }}
          onClick = {() => generatePdfDocument(`Messbericht_${props.order.order_no}`)}
        >
          Herunterladen
        </Button>

        <Typography style = {{
          marginLeft:  '50px',
          marginRight: '10px',
        }}
        >
          Kontrolleur
        </Typography>
        <TextInputField
          value        = {props.responsible}
          fieldVariant = "outlined"
          width        = {300}
          onChange     = {(val:string) => props.setResponsible(val)}
        />

        <Box style = {{
          display:     'flex',
          alignItems:  'center',
          marginRight: '50px',
        }}
        >
          <Typography style = {{
            marginLeft:  '50px',
            marginRight: '10px',
          }}
          >
            Rollennr.
          </Typography>
          <NumInputField
            value        = {pageFrom}
            onChange     = {(val:number) => setPageFrom(val > pageTo ? pageTo : val)}
            fieldVariant = "outlined"
            height       = {30}
            width        = {80}
            minEqual
            maxEqual
            minValue  = {pageMin}
            maxValue  = {pageTo}
            precision = {0}
            step      = {1}
          />

          <Typography style = {{
            marginLeft:  '5px',
            marginRight: '10px',
          }}
          >
            -
          </Typography>
          <NumInputField
            value        = {pageTo}
            onChange     = {(val:number) => setPageTo(val < pageFrom ? pageFrom : val)}
            fieldVariant = "outlined"
            height       = {30}
            width        = {80}
            minEqual
            maxEqual
            minValue  = {pageFrom}
            maxValue  = {pageMax}
            precision = {0}
            step      = {1}
          />
        </Box>
        <Button
          variant = "contained"
          color   = "warning"
          size    = "small"
          style   = {{
            paddingLeft:  '25px',
            paddingRight: '25px',
            minWidth:     50,
          }}
          onClick = {() => props.changeReportType(1)}
          disabled = {props.reportType === 1}
        >
          Typ1
        </Button>
        <Button
          variant = "contained"
          color   = "warning"
          size    = "small"
          style   = {{
            paddingLeft:  '25px',
            paddingRight: '25px',
            marginLeft:   '10px',
          }}
          onClick = {() => props.changeReportType(2)}
          disabled = {props.reportType === 2}
        >
          Typ2
        </Button>
        <Button
          variant = "contained"
          color   = "warning"
          size    = "small"
          style   = {{
            paddingLeft:  '25px',
            paddingRight: '25px',
            marginLeft:   '10px',
          }}
          onClick = {() => props.changeReportType(3)}
          disabled = {props.reportType === 3}
        >
          Typ3
        </Button>
      </Box>

      {getReport('snapshot')}

    </div>
  )
}
